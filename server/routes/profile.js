const express = require('express');
const fs = require('fs/promises');
const multer = require('multer');
const path = require('path');
const isAuthenticated = require('../middleware/isAuthenticated');
const User = require('../models/User');
const { cloudinary, hasCloudinaryConfig } = require('../utils/cloudinary');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const { buildCacheKey, deleteCacheByPrefixes, deleteCacheKeys, getCachedJson, setCachedJson } = require('../utils/cache');
const { formatUser } = require('../utils/userSerializer');

const router = express.Router();

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image uploads are allowed.'));
  }

  return cb(null, true);
};

const upload = multer({
  storage: localStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'skillswipe/profiles',
      resource_type: 'image',
    });

    return result.secure_url;
  } finally {
    await fs.unlink(filePath).catch(() => null);
  }
};

const parseList = (value) => {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.map((item) => item.trim()).filter(Boolean)));
  }

  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
};

const normalizeRole = (role) => {
  const value = String(role || '').trim();
  if (!value) {
    return '';
  }

  return value.toLowerCase() === 'mentee' ? 'Student' : value;
};

router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const cacheKey = buildCacheKey('profile', req.user._id);
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const response = { user: formatUser(req.user) };
  await setCachedJson(cacheKey, response, env.profileCacheTtlSeconds);
  return res.json(response);
}));

router.put('/', isAuthenticated, upload.single('photo'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'Your account could not be found.' });
  }

  const { bio, availability, location, pincode } = req.body;
  const roles = parseList(req.body.roles).map(normalizeRole).filter(Boolean);
  const skills = parseList(req.body.skills);

  if (!roles.length) {
    return res.status(400).json({ message: 'Select at least one role.' });
  }

  if (!skills.length) {
    return res.status(400).json({ message: 'Add at least one skill.' });
  }

  if (!bio || bio.trim().length > 200) {
    return res.status(400).json({ message: 'Bio is required and must be 200 characters or less.' });
  }

  user.bio = bio.trim();
  user.roles = roles;
  user.skills = skills;
  user.location = location?.trim() || 'Delhi/NCR';
  user.pincode = pincode?.trim() || '';
  user.availability = availability?.trim() || '';

  if (req.file) {
    user.photo = hasCloudinaryConfig
      ? await uploadToCloudinary(req.file.path)
      : `/uploads/${req.file.filename}`;
  }

  user.isProfileComplete = Boolean(user.photo && user.bio && user.skills.length && user.roles.length && user.availability);

  await user.save();

  await deleteCacheKeys(
    buildCacheKey('profile', user._id),
    buildCacheKey('swipe-next', user._id, 1, 10),
    buildCacheKey('matches', user._id, 1, 10)
  );
  await deleteCacheByPrefixes(buildCacheKey('swipe-next', user._id), buildCacheKey('matches', user._id), buildCacheKey('swipe-filters'));

  return res.json({ user: formatUser(user) });
}));

module.exports = router;

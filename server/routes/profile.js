const express = require('express');
const fs = require('fs/promises');
const multer = require('multer');
const path = require('path');
const isAuthenticated = require('../middleware/isAuthenticated');
const User = require('../models/User');
const { cloudinary, hasCloudinaryConfig } = require('../utils/cloudinary');

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

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  roles: user.roles,
  bio: user.bio,
  skills: user.skills,
  location: user.location,
  pincode: user.pincode,
  availability: user.availability,
  photo: user.photo,
  isProfileComplete: user.isProfileComplete,
  swipesToday: user.swipesToday,
  dailySwipeLimit: user.dailySwipeLimit,
  swipesLeftToday: Math.max(user.dailySwipeLimit - user.swipesToday, 0),
  createdAt: user.createdAt,
});

const parseList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

router.get('/', isAuthenticated, (req, res) => {
  return res.json({ user: formatUser(req.user) });
});

router.put('/', isAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { bio, availability, location, pincode } = req.body;
    const roles = parseList(req.body.roles);
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

    return res.json({ user: formatUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update profile.' });
  }
});

module.exports = router;

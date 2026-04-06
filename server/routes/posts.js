const express = require('express');
const fs = require('fs/promises');
const multer = require('multer');
const path = require('path');

const isAuthenticated = require('../middleware/isAuthenticated');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const Post = require('../models/Post');
const { cloudinary, hasCloudinaryConfig } = require('../utils/cloudinary');
const { buildCacheKey, deleteCacheByPrefixes, getCachedJson, setCachedJson } = require('../utils/cache');
const { createPaginationMeta, parsePagination } = require('../utils/pagination');
const { formatPost } = require('../utils/postSerializer');

const router = express.Router();

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `post-${Date.now()}-${safeName}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image uploads are allowed.'));
  }

  return cb(null, true);
};

const upload = multer({
  storage: postStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 4,
  },
});

const removeLocalFiles = async (files = []) => {
  await Promise.all(
    files
      .map((file) => file?.path)
      .filter(Boolean)
      .map((filePath) => fs.unlink(filePath).catch(() => null))
  );
};

const uploadImage = async (filePath) => {
  try {
    if (!hasCloudinaryConfig) {
      return `/uploads/${path.basename(filePath)}`;
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'skillswipe/posts',
      resource_type: 'image',
    });

    return result.secure_url;
  } finally {
    if (hasCloudinaryConfig) {
      await fs.unlink(filePath).catch(() => null);
    }
  }
};

const parsePollOptions = (options) => {
  const values = Array.isArray(options) ? options : String(options || '').split(',');

  return values
    .map((option) => String(option).trim())
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index)
    .map((text) => ({ text }));
};

router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { limit: 10, maxLimit: 25 });
  const cacheKey = buildCacheKey('posts', req.user._id, page, limit);
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const query = {};
  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'name photo roles')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments(query),
  ]);

  const response = {
    posts: posts.map((post) => formatPost(post, req.user._id)),
    pagination: createPaginationMeta({ page, limit, total }),
  };

  await setCachedJson(cacheKey, response, env.postsCacheTtlSeconds);
  return res.json(response);
}));

router.post('/', isAuthenticated, upload.array('images', 4), asyncHandler(async (req, res) => {
  const type = String(req.body.type || 'text').trim().toLowerCase();
  const formatting = String(req.body.formatting || 'plain').trim().toLowerCase();

  if (!['text', 'image', 'poll'].includes(type)) {
    return res.status(400).json({ message: 'Post type must be text, image, or poll.' });
  }

  if (!['plain', 'markdown'].includes(formatting)) {
    return res.status(400).json({ message: 'Formatting must be plain or markdown.' });
  }

  const content = String(req.body.content || '').trim();
  const caption = String(req.body.caption || '').trim();
  const uploadedFiles = req.files || [];

  if (type !== 'image' && uploadedFiles.length) {
    await removeLocalFiles(uploadedFiles);
    return res.status(400).json({ message: 'Image uploads are only allowed for image posts.' });
  }

  const payload = {
    author: req.user._id,
    type,
    formatting,
    content: '',
    caption: '',
    images: [],
    poll: {
      question: '',
      options: [],
      closesAt: null,
    },
  };

  if (type === 'text') {
    if (!content) {
      await removeLocalFiles(uploadedFiles);
      return res.status(400).json({ message: 'Text posts require content.' });
    }

    payload.content = content;
  }

  if (type === 'image') {
    if (!uploadedFiles.length) {
      return res.status(400).json({ message: 'Image posts require at least one image.' });
    }

    payload.caption = caption;
    payload.images = await Promise.all(uploadedFiles.map((file) => uploadImage(file.path)));
  }

  if (type === 'poll') {
    const question = String(req.body.question || '').trim();
    const options = parsePollOptions(req.body.options || req.body['options[]']);
    const closesAt = req.body.closesAt ? new Date(req.body.closesAt) : null;

    if (!question) {
      await removeLocalFiles(uploadedFiles);
      return res.status(400).json({ message: 'Poll posts require a question.' });
    }

    if (options.length < 2 || options.length > 4) {
      await removeLocalFiles(uploadedFiles);
      return res.status(400).json({ message: 'Poll posts require between 2 and 4 unique options.' });
    }

    if (closesAt && Number.isNaN(closesAt.getTime())) {
      await removeLocalFiles(uploadedFiles);
      return res.status(400).json({ message: 'Poll closing date is invalid.' });
    }

    payload.poll = {
      question,
      options,
      closesAt,
    };
    payload.caption = caption;
  }

  const post = await Post.create(payload);
  const populatedPost = await Post.findById(post._id).populate('author', 'name photo roles');

  await deleteCacheByPrefixes(buildCacheKey('posts'));

  return res.status(201).json({
    post: formatPost(populatedPost, req.user._id),
  });
}));

router.delete('/:postId', isAuthenticated, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only delete your own posts.' });
  }

  await post.deleteOne();
  await deleteCacheByPrefixes(buildCacheKey('posts'));

  return res.json({ message: 'Post deleted successfully.' });
}));

module.exports = router;

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');
const asyncHandler = require('../utils/asyncHandler');
const { formatUser } = require('../utils/userSerializer');
const { authRateLimiter } = require('../middleware/rateLimit');
const { buildCacheKey, deleteCacheByPrefixes, deleteCacheKeys } = require('../utils/cache');

const router = express.Router();
const getUserCacheKeys = (userId) => [
  ...(userId ? [buildCacheKey('profile', userId)] : []),
  ...(userId ? [buildCacheKey('swipe-next', userId, 1, 10)] : []),
  ...(userId ? [buildCacheKey('matches', userId, 1, 10)] : []),
];

router.post('/register', authRateLimiter, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: 'An account already exists with that email.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  req.login(user, (error) => {
    if (error) {
      return res.status(500).json({ message: 'Account created, but login failed.' });
    }

    return res.status(201).json({ user: formatUser(user) });
  });
}));

router.post('/login', authRateLimiter, (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({ message: info?.message || 'Invalid email or password.' });
    }

    req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.json({ user: formatUser(user) });
    });
  })(req, res, next);
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
  router.get('/google', authRateLimiter, passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login` }),
    (req, res) => {
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/swipe`);
    }
  );
}

router.get('/me', isAuthenticated, (req, res) => {
  return res.json({ user: formatUser(req.user) });
});

router.post('/logout', (req, res, next) => {
  const userId = req.user?._id?.toString();

  const clearSession = () => {
    if (!req.session) {
      res.clearCookie('skillswipe.sid');
      return res.json({ message: 'Logged out successfully.' });
    }

    req.session.destroy(() => {
      res.clearCookie('skillswipe.sid');
      return res.json({ message: 'Logged out successfully.' });
    });
  };

  const clearCaches = async () => {
    if (!userId) {
      return;
    }

    await deleteCacheKeys(...getUserCacheKeys(userId));
    await deleteCacheByPrefixes(buildCacheKey('swipe-next', userId), buildCacheKey('matches', userId));
  };

  const finishLogout = async () => {
    try {
      await clearCaches();
    } catch (error) {
      return next(error);
    }

    return clearSession();
  };

  if (typeof req.logout === 'function') {
    return req.logout((error) => {
      if (error) {
        return next(error);
      }

      return finishLogout();
    });
  }

  return finishLogout();
});

module.exports = router;

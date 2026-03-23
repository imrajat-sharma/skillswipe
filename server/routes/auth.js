const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

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

router.post('/register', async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to register.' });
  }
});

router.post('/login', (req, res, next) => {
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
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login` }),
    (req, res) => {
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/swipe`);
    }
  );
}

router.get('/me', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  return res.json({ user: formatUser(req.user) });
});

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy(() => {
      res.clearCookie('skillswipe.sid');
      return res.json({ message: 'Logged out successfully.' });
    });
  });
});

module.exports = router;

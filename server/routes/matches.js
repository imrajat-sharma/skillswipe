const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const Match = require('../models/Match');

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user._id })
      .populate('users', 'name roles bio skills location availability photo')
      .sort({ updatedAt: -1, createdAt: -1 });

    const formattedMatches = matches.map((match) => {
      const partner = match.users.find((user) => user._id.toString() !== req.user._id.toString());
      return {
        _id: match._id,
        matchedAt: match.createdAt,
        partner,
        messages: match.messages,
      };
    });

    return res.json({ matches: formattedMatches });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load matches.' });
  }
});

module.exports = router;

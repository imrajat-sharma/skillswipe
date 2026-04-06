const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const { buildCacheKey, getCachedJson, setCachedJson } = require('../utils/cache');
const { createPaginationMeta, parsePagination } = require('../utils/pagination');

const router = express.Router();

router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { limit: 10, maxLimit: 25 });
  const cacheKey = buildCacheKey('matches', req.user._id, page, limit);
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const query = { users: req.user._id };
  const [matches, total] = await Promise.all([
    Match.find(query)
      .populate('users', 'name roles bio skills location availability photo')
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Match.countDocuments(query),
  ]);

  const formattedMatches = matches.map((match) => {
    const partner = match.users.find((user) => user._id.toString() !== req.user._id.toString());
    return {
      _id: match._id,
      matchedAt: match.createdAt,
      partner,
      messages: match.messages,
    };
  });

  const response = {
    matches: formattedMatches,
    pagination: createPaginationMeta({ page, limit, total }),
  };

  await setCachedJson(cacheKey, response, env.matchesCacheTtlSeconds);
  return res.json(response);
}));

module.exports = router;

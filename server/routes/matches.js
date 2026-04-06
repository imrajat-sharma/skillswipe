const express = require('express');
const mongoose = require('mongoose');
const isAuthenticated = require('../middleware/isAuthenticated');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const { buildCacheKey, deleteCacheByPrefixes, deleteCacheKeys, getCachedJson, setCachedJson } = require('../utils/cache');
const { createPaginationMeta, parsePagination } = require('../utils/pagination');

const router = express.Router();

const formatMatchSummary = (match, currentUserId) => {
  const currentUserIdString = currentUserId.toString();
  const partner = match.users.find((user) => user._id.toString() !== currentUserIdString);
  const lastMessage = match.messages?.[match.messages.length - 1] || null;

  return {
    _id: match._id,
    matchedAt: match.createdAt,
    updatedAt: match.updatedAt,
    partner,
    messages: match.messages,
    messageCount: match.messages?.length || 0,
    lastMessage,
  };
};

const loadMatchForUser = async (matchId, userId) =>
  Match.findOne({ _id: matchId, users: userId })
    .populate('users', 'name roles bio skills location pincode availability photo')
    .populate('messages.sender', 'name photo');

const loadMatches = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { limit: 10, maxLimit: 25 });
  const cacheKey = buildCacheKey('matches', req.user._id, page, limit);
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const query = { users: req.user._id };
  const [matches, total] = await Promise.all([
    Match.find(query)
      .populate('users', 'name roles bio skills location pincode availability photo')
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Match.countDocuments(query),
  ]);

  const formattedMatches = matches.map((match) => formatMatchSummary(match, req.user._id));

  const response = {
    matches: formattedMatches,
    pagination: createPaginationMeta({ page, limit, total }),
  };

  await setCachedJson(cacheKey, response, env.matchesCacheTtlSeconds);
  return res.json(response);
};

router.get('/', isAuthenticated, asyncHandler(loadMatches));
router.get('/chat', isAuthenticated, asyncHandler(loadMatches));

router.get('/:matchId', isAuthenticated, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.matchId)) {
    return res.status(400).json({ message: 'Invalid match id.' });
  }

  const match = await loadMatchForUser(req.params.matchId, req.user._id);

  if (!match) {
    return res.status(404).json({ message: 'Match not found.' });
  }

  return res.json({
    match: formatMatchSummary(match, req.user._id),
  });
}));

router.post('/:matchId/messages', isAuthenticated, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.matchId)) {
    return res.status(400).json({ message: 'Invalid match id.' });
  }

  const content = String(req.body.content || req.body.message || '').trim();
  if (!content) {
    return res.status(400).json({ message: 'Message content is required.' });
  }

  if (content.length > 240) {
    return res.status(400).json({ message: 'Messages must be 240 characters or less.' });
  }

  const match = await Match.findOne({ _id: req.params.matchId, users: req.user._id });

  if (!match) {
    return res.status(404).json({ message: 'Match not found.' });
  }

  match.messages.push({
    sender: req.user._id,
    content,
  });
  await match.save();

  const updatedMatch = await loadMatchForUser(match._id, req.user._id);
  const participantIds = updatedMatch.users.map((user) => user._id.toString());

  await deleteCacheKeys(
    ...participantIds.flatMap((participantId) => [
      buildCacheKey('matches', participantId, 1, 10),
      buildCacheKey('matches', participantId),
    ])
  );
  await deleteCacheByPrefixes(...participantIds.map((participantId) => buildCacheKey('matches', participantId)));

  return res.status(201).json({
    match: formatMatchSummary(updatedMatch, req.user._id),
  });
}));

module.exports = router;

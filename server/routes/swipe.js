const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const User = require('../models/User');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const { buildCacheKey, deleteCacheByPrefixes, deleteCacheKeys, getCachedJson, setCachedJson } = require('../utils/cache');
const { createPaginationMeta, parsePagination } = require('../utils/pagination');

const router = express.Router();

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const resetDailySwipesIfNeeded = async (user, options = {}) => {
  const today = startOfToday();
  const lastSwipeDate = user.lastSwipeDate ? new Date(user.lastSwipeDate) : null;

  if (!lastSwipeDate || lastSwipeDate < today) {
    user.swipesToday = 0;
    user.lastSwipeDate = new Date();
    await user.save(options);
  }
};

const profileProjection = 'name roles bio skills location availability photo createdAt';

const formatMatchPayload = (match, currentUserId) => {
  if (!match) {
    return null;
  }

  const partner = match.users.find((user) => user._id.toString() !== currentUserId.toString());

  return {
    _id: match._id,
    matchedAt: match.createdAt,
    partner,
    messages: match.messages,
  };
};

router.get('/next', isAuthenticated, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  await resetDailySwipesIfNeeded(user);

  const swipesLeft = Math.max(user.dailySwipeLimit - user.swipesToday, 0);
  if (!user.isProfileComplete) {
    return res.status(403).json({ message: 'Complete your profile before swiping.', swipesLeft });
  }

  if (swipesLeft <= 0) {
    return res.json({ profiles: [], swipesLeft, message: 'Daily swipe limit reached.' });
  }

  const { page, limit, skip } = parsePagination(req.query, { limit: 10, maxLimit: 20 });
  const cacheKey = buildCacheKey('swipe-next', user._id, page, limit);
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const candidates = await User.find({
    _id: { $nin: [...user.swipedUsers, user._id] },
    isProfileComplete: true,
  }).select(profileProjection);

  const rankedCandidates = candidates
    .map((candidate) => {
      const overlap = candidate.skills.filter((skill) => user.skills.includes(skill)).length;
      const roleAlignment = candidate.roles.some((role) => user.roles.includes(role)) ? 2 : 0;
      const locationBoost = candidate.location?.toLowerCase().includes('delhi') || candidate.location?.toLowerCase().includes('ncr') ? 1 : 0;

      return {
        candidate,
        score: overlap * 3 + roleAlignment + locationBoost,
      };
    })
    .sort((a, b) => b.score - a.score || new Date(b.candidate.createdAt) - new Date(a.candidate.createdAt));

  const pagedProfiles = rankedCandidates.slice(skip, skip + limit).map(({ candidate }) => candidate);
  const response = {
    profiles: pagedProfiles,
    swipesLeft,
    pagination: createPaginationMeta({
      page,
      limit,
      total: rankedCandidates.length,
    }),
  };

  await setCachedJson(cacheKey, response, env.swipeCacheTtlSeconds);
  return res.json(response);
}));

router.post('/action', isAuthenticated, asyncHandler(async (req, res) => {
  const { targetId, direction } = req.body;
  if (!targetId || !['like', 'pass'].includes(direction)) {
    return res.status(400).json({ message: 'Invalid swipe action.' });
  }

  const user = await User.findById(req.user._id);
  const target = await User.findById(targetId);

  if (!target) {
    return res.status(404).json({ message: 'Profile not found.' });
  }

  await resetDailySwipesIfNeeded(user);
  if (user.swipesToday >= user.dailySwipeLimit) {
    return res.status(400).json({ message: 'Daily swipe limit reached.' });
  }

  if (!user.swipedUsers.some((id) => id.equals(target._id))) {
    user.swipedUsers.push(target._id);
  }

  let isMatch = false;
  let matchRecord = null;

  if (direction === 'like' && !user.likedUsers.some((id) => id.equals(target._id))) {
    user.likedUsers.push(target._id);

    if (target.likedUsers.some((id) => id.equals(user._id))) {
      const existingMatch = await Match.findOne({ users: { $all: [user._id, target._id] } }).populate(
        'users',
        'name roles bio skills location availability photo'
      );

      if (!existingMatch) {
        matchRecord = await Match.create({
          users: [user._id, target._id],
          messages: [
            {
              sender: user._id,
              content: `You matched with ${target.name} on SkillSwipe. Start the conversation around mentorship or a short project idea.`,
            },
          ],
        });

        matchRecord = await Match.findById(matchRecord._id).populate(
          'users',
          'name roles bio skills location availability photo'
        );
      } else {
        matchRecord = existingMatch;
      }

      isMatch = true;
    }
  }

  user.swipesToday += 1;
  user.lastSwipeDate = new Date();
  await user.save();

  await deleteCacheKeys(
    buildCacheKey('profile', user._id),
    buildCacheKey('swipe-next', user._id, 1, 10),
    buildCacheKey('matches', user._id, 1, 10),
    buildCacheKey('matches', target._id, 1, 10)
  );
  await deleteCacheByPrefixes(
    buildCacheKey('swipe-next', user._id),
    buildCacheKey('matches', user._id),
    buildCacheKey('matches', target._id)
  );

  return res.json({
    success: true,
    isMatch,
    swipesLeft: Math.max(user.dailySwipeLimit - user.swipesToday, 0),
    match: formatMatchPayload(matchRecord, user._id),
  });
}));

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const isAuthenticated = require('../middleware/isAuthenticated');
const User = require('../models/User');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const { buildCacheKey, deleteCacheByPrefixes, deleteCacheKeys, getCachedJson, setCachedJson } = require('../utils/cache');
const { createPaginationMeta, parseDiscoverFilters, parsePagination } = require('../utils/pagination');

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

const profileProjection = 'name roles bio skills location pincode availability photo createdAt';

const normalizeText = (value) => String(value ?? '').trim().toLowerCase();
const normalizeRole = (role) => {
  const value = String(role ?? '').trim();
  if (!value) {
    return '';
  }
  return value.toLowerCase() === 'mentee' ? 'Student' : value;
};

const buildFilterSignature = (filters) =>
  [
    [...filters.roles].map(normalizeText).sort().join('|'),
    [...filters.skills].map(normalizeText).sort().join('|'),
    normalizeText(filters.location),
    normalizeText(filters.availability),
    normalizeText(filters.pincode),
    normalizeText(filters.search),
  ]
    .join(';');

const matchesTextField = (haystack, needle) => normalizeText(haystack).includes(normalizeText(needle));

const matchesListField = (source = [], required = []) => {
  if (!required.length) {
    return true;
  }

  const sourceLookup = source.map((value) => normalizeText(normalizeRole(value)));
  return required.some((value) => sourceLookup.includes(normalizeText(normalizeRole(value))));
};

const candidateMatchesFilters = (candidate, filters) => {
  if (!matchesListField(candidate.roles, filters.roles)) {
    return false;
  }

  if (!matchesListField(candidate.skills, filters.skills)) {
    return false;
  }

  if (filters.location && !matchesTextField(candidate.location, filters.location)) {
    return false;
  }

  if (filters.availability && !matchesTextField(candidate.availability, filters.availability)) {
    return false;
  }

  if (filters.pincode && !matchesTextField(candidate.pincode, filters.pincode)) {
    return false;
  }

  if (filters.search) {
    const haystack = [
      candidate.name,
      candidate.bio,
      candidate.location,
      candidate.pincode,
      candidate.availability,
      ...(candidate.roles || []),
      ...(candidate.skills || []),
    ]
      .filter(Boolean)
      .join(' ');

    if (!matchesTextField(haystack, filters.search)) {
      return false;
    }
  }

  return true;
};

const scoreCandidate = (candidate, user) => {
  const overlap = candidate.skills.filter((skill) => user.skills.includes(skill)).length;
  const normalizedCandidateRoles = (candidate.roles || []).map((role) => normalizeRole(role));
  const normalizedUserRoles = (user.roles || []).map((role) => normalizeRole(role));
  const roleAlignment = normalizedCandidateRoles.some((role) => normalizedUserRoles.includes(role)) ? 2 : 0;
  const locationBoost = candidate.location?.toLowerCase().includes('delhi') || candidate.location?.toLowerCase().includes('ncr') ? 1 : 0;

  return overlap * 3 + roleAlignment + locationBoost;
};

const formatMatchPayload = (match, currentUserId) => {
  if (!match) {
    return null;
  }

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

const loadDiscoverQueue = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'Your account could not be found.' });
  }

  await resetDailySwipesIfNeeded(user);

  const swipesLeft = Math.max(user.dailySwipeLimit - user.swipesToday, 0);
  if (!user.isProfileComplete) {
    return res.status(403).json({ message: 'Complete your profile before swiping.', swipesLeft, filters: parseDiscoverFilters(req.query) });
  }

  const filters = parseDiscoverFilters(req.query);
  const filterSignature = buildFilterSignature(filters);

  if (swipesLeft <= 0) {
    return res.json({
      profiles: [],
      swipesLeft,
      message: 'Daily swipe limit reached.',
      filters,
    });
  }

  const { page, limit, skip } = parsePagination(req.query, { limit: 10, maxLimit: 20 });
  const cacheKey = buildCacheKey('swipe-next', user._id, page, limit, filterSignature);
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const candidates = await User.find({
    _id: { $nin: [...user.swipedUsers, user._id] },
    isProfileComplete: true,
  }).select(profileProjection);

  const rankedCandidates = candidates
    .filter((candidate) => candidateMatchesFilters(candidate, filters))
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(candidate, user),
    }))
    .sort((a, b) => b.score - a.score || new Date(b.candidate.createdAt) - new Date(a.candidate.createdAt));

  const pagedProfiles = rankedCandidates.slice(skip, skip + limit).map(({ candidate }) => candidate);
  const response = {
    profiles: pagedProfiles,
    swipesLeft,
    filters,
    pagination: createPaginationMeta({
      page,
      limit,
      total: rankedCandidates.length,
    }),
  };

  if (!pagedProfiles.length) {
    response.message = filterSignature ? 'No profiles match your current filters yet.' : 'No profiles available right now.';
  }

  await setCachedJson(cacheKey, response, env.swipeCacheTtlSeconds);
  return res.json(response);
};

const loadFilterOptions = async (req, res) => {
  const cacheKey = buildCacheKey('swipe-filters');
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const [roles, skills, locations, availability, pincodes] = await Promise.all([
    User.distinct('roles', { isProfileComplete: true }),
    User.distinct('skills', { isProfileComplete: true }),
    User.distinct('location', { isProfileComplete: true }),
    User.distinct('availability', { isProfileComplete: true }),
    User.distinct('pincode', { isProfileComplete: true }),
  ]);

  const response = {
    filters: {
      roles: Array.from(new Set(roles.map((role) => normalizeRole(role)).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
      skills: skills.filter(Boolean).sort((a, b) => a.localeCompare(b)),
      locations: locations.filter(Boolean).sort((a, b) => a.localeCompare(b)),
      availability: availability.filter(Boolean).sort((a, b) => a.localeCompare(b)),
      pincodes: pincodes.filter(Boolean).sort((a, b) => a.localeCompare(b)),
    },
  };

  await setCachedJson(cacheKey, response, env.swipeCacheTtlSeconds);
  return res.json(response);
};

router.get('/', isAuthenticated, asyncHandler(loadDiscoverQueue));
router.get('/next', isAuthenticated, asyncHandler(loadDiscoverQueue));
router.get('/discover', isAuthenticated, asyncHandler(loadDiscoverQueue));
router.get('/filters', isAuthenticated, asyncHandler(loadFilterOptions));

router.post('/action', isAuthenticated, asyncHandler(async (req, res) => {
  const { targetId, direction } = req.body;
  if (!targetId || !mongoose.isValidObjectId(targetId) || !['like', 'pass'].includes(direction)) {
    return res.status(400).json({ message: 'Invalid swipe action.' });
  }

  const user = await User.findById(req.user._id);
  const target = await User.findById(targetId);

  if (!user) {
    return res.status(404).json({ message: 'Your account could not be found.' });
  }

  if (!target || !target.isProfileComplete) {
    return res.status(404).json({ message: 'Profile not found.' });
  }

  await resetDailySwipesIfNeeded(user);

  if (!user.isProfileComplete) {
    return res.status(403).json({ message: 'Complete your profile before swiping.' });
  }

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
        'name roles bio skills location pincode availability photo'
      );

      if (!existingMatch) {
        const newMatch = await Match.create({
          users: [user._id, target._id],
          messages: [
            {
              sender: user._id,
              content: `You matched with ${target.name} on SkillSwipe. Start the conversation around mentorship or a short project idea.`,
            },
          ],
        });

        matchRecord = await Match.findById(newMatch._id)
          .populate('users', 'name roles bio skills location pincode availability photo')
          .populate('messages.sender', 'name photo');
      } else {
        matchRecord = await Match.findById(existingMatch._id)
          .populate('users', 'name roles bio skills location pincode availability photo')
          .populate('messages.sender', 'name photo');
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
    buildCacheKey('matches', target._id)
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

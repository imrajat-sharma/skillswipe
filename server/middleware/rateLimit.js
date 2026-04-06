const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const rateLimitMessage = {
  message: 'Too many requests, please try again later.',
};

const standardRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: rateLimitMessage,
});

const authRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.authRateLimitMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts, please try again later.',
  },
});

module.exports = {
  authRateLimiter,
  standardRateLimiter,
};

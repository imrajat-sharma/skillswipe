const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInteger(process.env.PORT, 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswipe',
  sessionSecret: process.env.SESSION_SECRET || 'change-me',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  redisUrl: process.env.REDIS_URL || '',
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  rateLimitWindowMs: parseInteger(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: parseInteger(process.env.RATE_LIMIT_MAX, process.env.NODE_ENV === 'production' ? 200 : 1000),
  authRateLimitMax: parseInteger(process.env.AUTH_RATE_LIMIT_MAX, process.env.NODE_ENV === 'production' ? 20 : 100),
  profileCacheTtlSeconds: parseInteger(process.env.PROFILE_CACHE_TTL_SECONDS, 120),
  matchesCacheTtlSeconds: parseInteger(process.env.MATCHES_CACHE_TTL_SECONDS, 60),
  swipeCacheTtlSeconds: parseInteger(process.env.SWIPE_CACHE_TTL_SECONDS, 45),
  postsCacheTtlSeconds: parseInteger(process.env.POSTS_CACHE_TTL_SECONDS, 60),
  sessionTtlSeconds: parseInteger(process.env.SESSION_TTL_SECONDS, 7 * 24 * 60 * 60),
};

config.isProduction = config.nodeEnv === 'production';

module.exports = config;

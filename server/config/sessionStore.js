const session = require('express-session');
const MongoStore = require('connect-mongo');
const { RedisStore } = require('connect-redis');
const env = require('./env');
const { getRedisClient } = require('./redis');

const createSessionStore = async () => {
  if (env.nodeEnv === 'test') {
    return new session.MemoryStore();
  }

  const redisClient = await getRedisClient();

  if (redisClient) {
    return new RedisStore({
      client: redisClient,
      prefix: 'skillswipe:sess:',
      ttl: env.sessionTtlSeconds,
    });
  }

  return MongoStore.create({
    mongoUrl: env.mongoUri,
    ttl: env.sessionTtlSeconds,
    collectionName: 'sessions',
  });
};

const createSessionMiddleware = async () =>
  session({
    name: 'skillswipe.sid',
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: env.isProduction,
    store: await createSessionStore(),
    cookie: {
      maxAge: env.sessionTtlSeconds * 1000,
      httpOnly: true,
      sameSite: env.isProduction ? 'none' : 'lax',
      secure: env.isProduction,
    },
  });

module.exports = {
  createSessionMiddleware,
};

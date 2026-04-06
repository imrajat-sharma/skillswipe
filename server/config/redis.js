const { createClient } = require('redis');
const env = require('./env');
const logger = require('./logger');

let redisClient = null;
let redisConnectionPromise = null;

const getRedisClient = async () => {
  if (!env.redisUrl) {
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (!redisClient) {
    redisClient = createClient({ url: env.redisUrl });
    redisClient.on('error', (error) => {
      logger.warn({ err: error }, 'Redis client error');
    });
  }

  if (!redisConnectionPromise) {
    redisConnectionPromise = redisClient.connect().catch((error) => {
      redisConnectionPromise = null;
      logger.warn({ err: error }, 'Redis unavailable, continuing without cache/session store');
      return null;
    });
  }

  await redisConnectionPromise;
  return redisClient?.isOpen ? redisClient : null;
};

module.exports = {
  getRedisClient,
};

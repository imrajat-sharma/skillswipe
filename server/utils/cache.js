const { getRedisClient } = require('../config/redis');

const buildCacheKey = (...parts) =>
  parts
    .filter(Boolean)
    .map((part) => String(part))
    .join(':');

const getCachedJson = async (key) => {
  const client = await getRedisClient();
  if (!client) {
    return null;
  }

  const payload = await client.get(key);
  return payload ? JSON.parse(payload) : null;
};

const setCachedJson = async (key, value, ttlSeconds) => {
  const client = await getRedisClient();
  if (!client) {
    return false;
  }

  await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  return true;
};

const deleteCacheKeys = async (...keys) => {
  const client = await getRedisClient();
  const filteredKeys = keys.filter(Boolean);
  if (!client || !filteredKeys.length) {
    return;
  }

  await client.del(filteredKeys);
};

const deleteCacheByPrefixes = async (...prefixes) => {
  const client = await getRedisClient();
  const filteredPrefixes = prefixes.filter(Boolean);
  if (!client || !filteredPrefixes.length) {
    return;
  }

  for (const prefix of filteredPrefixes) {
    const keys = [];
    for await (const key of client.scanIterator({ MATCH: `${prefix}*`, COUNT: 100 })) {
      keys.push(key);
    }

    if (keys.length) {
      await client.del(keys);
    }
  }
};

module.exports = {
  buildCacheKey,
  deleteCacheByPrefixes,
  deleteCacheKeys,
  getCachedJson,
  setCachedJson,
};

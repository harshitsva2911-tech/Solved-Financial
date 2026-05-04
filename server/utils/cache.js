// Simple in-memory TTL cache for public read endpoints.
// Keeps frequently-requested data (services, articles, metrics, etc.) in RAM
// so MongoDB isn't hit on every request under load.

const store = new Map();

/**
 * @param {string} key
 * @param {number} ttlSeconds
 * @returns {Function} Express middleware
 */
function cacheMiddleware(ttlSeconds = 60) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next();

    const key = req.originalUrl;
    const hit = store.get(key);

    if (hit && Date.now() < hit.expiresAt) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}`);
      return res.json(hit.data);
    }

    // Intercept res.json to capture the response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
      }
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}`);
      return originalJson(data);
    };

    next();
  };
}

/** Call this after a write (POST/PUT/DELETE) to invalidate related cache entries */
function invalidateCache(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/** Clear entire cache (used after force-seed) */
function clearCache() {
  store.clear();
}

module.exports = { cacheMiddleware, invalidateCache, clearCache };

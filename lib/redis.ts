import Redis from "ioredis";
import { logger } from "./logger";

// Redis connection configuration
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Create Redis client
const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Event handlers for monitoring
redis.on("connect", () => {
  logger.info("Redis client connected");
});

redis.on("error", (err) => {
  logger.error("Redis client error", { error: err.message });
});

redis.on("ready", () => {
  logger.info("Redis client ready");
});

export default redis;

/**
 * Cache utility functions
 */
export const cache = {
  /**
   * Get data from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      if (!cached) return null;

      return JSON.parse(cached) as T;
    } catch (error) {
      logger.error(`Cache get error for key: ${key}`, { error });
      return null;
    }
  },

  /**
   * Set data in cache with TTL
   * @param key - Cache key
   * @param value - Data to cache
   * @param ttl - Time to live in seconds (default: 60)
   */
  async set(key: string, value: unknown, ttl = 60): Promise<boolean> {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttl);
      logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      logger.error(`Cache set error for key: ${key}`, { error });
      return false;
    }
  },

  /**
   * Delete cache entry
   */
  async del(key: string | string[]): Promise<number> {
    try {
      const keys = Array.isArray(key) ? key : [key];
      const deleted = await redis.del(...keys);
      logger.debug(`Cache deleted: ${keys.join(", ")}`);
      return deleted;
    } catch (error) {
      logger.error(`Cache delete error`, { error });
      return 0;
    }
  },

  /**
   * Delete all cache entries matching pattern
   */
  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;

      const deleted = await redis.del(...keys);
      logger.debug(`Cache pattern deleted: ${pattern} (${deleted} keys)`);
      return deleted;
    } catch (error) {
      logger.error(`Cache pattern delete error: ${pattern}`, { error });
      return 0;
    }
  },

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const exists = await redis.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error(`Cache exists error for key: ${key}`, { error });
      return false;
    }
  },

  /**
   * Get remaining TTL for a key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      logger.error(`Cache TTL error for key: ${key}`, { error });
      return -1;
    }
  },
};

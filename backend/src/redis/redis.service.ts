import { Injectable, OnModuleDestroy, Global, Module, Logger } from "@nestjs/common";
import { Redis } from "ioredis";

/**
 * RedisService — global singleton providing a single ioredis connection.
 *
 * The ioredis client is created synchronously in the constructor so other
 * modules (ThrottlerStorageRedisService, BullMQ) can consume it during
 * NestJS dependency wiring. ioredis auto-connects in the background and
 * emits `ready` / `error` events.
 *
 * Used by:
 *  - ThrottlerStorageRedisService (rate limiting across instances)
 *  - ProvaCacheService (exam questions cache)
 *  - QueueModule (BullMQ connection)
 *
 * Configuration:
 *  - REDIS_URL: connection string (e.g. redis://redis:6379), default redis://localhost:6379
 *  - REDIS_KEY_PREFIX: namespace prefix for all keys, default "olicmat:"
 *
 * Fallback behavior:
 *  - If Redis is unreachable, `isAvailable` stays false. Consumers must
 *    check this flag and degrade gracefully (skip cache, fall back to
 *    in-memory throttler, run queue jobs inline).
 *  - Reconnection is automatic (ioredis default reconnect strategy).
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public client: Redis;
  public isAvailable = false;
  private readonly keyPrefix: string;

  constructor() {
    this.keyPrefix = process.env.REDIS_KEY_PREFIX || "olicmat:";
    const url = process.env.REDIS_URL || "redis://localhost:6379";

    this.client = new Redis(url, {
      keyPrefix: this.keyPrefix,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times: number) => Math.min(times * 200, 2000),
      // Do not crash the process if Redis is down on first connect.
      enableOfflineQueue: true,
    });

    this.client.on("ready", () => {
      this.isAvailable = true;
      this.logger.log(`Redis connected at ${url.replace(/\/\/.*@/, "//***@")}`);
    });
    this.client.on("error", (err: Error) => {
      this.isAvailable = false;
      if (err.message.includes("ECONNREFUSED")) {
        // Only log once to avoid spamming logs during outage.
        if (!this.isAvailable) {
          this.logger.warn(
            `Redis unavailable — running in degraded mode (cache/rate-limit/queue fall back). Cause: ${err.message}`
          );
        }
      } else {
        this.logger.warn(`Redis error: ${err.message}`);
      }
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isAvailable) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.isAvailable) return;
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, "EX", ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch {
      // ignore — cache is best-effort
    }
  }

  async del(...keys: string[]): Promise<void> {
    if (!this.isAvailable || keys.length === 0) return;
    try {
      await this.client.del(keys);
    } catch {
      // ignore
    }
  }

  async delByPattern(pattern: string): Promise<number> {
    if (!this.isAvailable) return 0;
    try {
      let count = 0;
      let cursor = "0";
      do {
        const [next, matched] = await this.client.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100
        );
        cursor = next;
        if (matched.length > 0) {
          await this.client.del(...matched);
          count += matched.length;
        }
      } while (cursor !== "0");
      return count;
    } catch {
      return 0;
    }
  }

  async ping(): Promise<boolean> {
    if (!this.isAvailable) return false;
    try {
      const res = await this.client.ping();
      return res === "PONG";
    } catch {
      return false;
    }
  }
}

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
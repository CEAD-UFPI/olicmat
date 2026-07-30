import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { RedisService } from "../redis/redis.service.js";

interface HealthCheck {
  name: string;
  status: "up" | "down";
  latencyMs?: number;
  detail?: string;
}

/**
 * HealthController — exposes liveness and readiness checks.
 *
 * GET /api/health        — liveness (always 200 if process is alive)
 * GET /api/health/ready  — readiness (checks DB + Redis connectivity)
 *
 * Usage:
 *  - Load balancer should hit /api/health for liveness (process alive).
 *  - Load balancer should hit /api/health/ready for readiness (can serve
 *    traffic). If DB is down, the instance should be pulled from rotation
 *    even though the process is alive.
 */
@Controller("health")
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  liveness() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("ready")
  async readiness() {
    const checks: HealthCheck[] = [];

    // Database check
    const dbStart = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.push({ name: "database", status: "up", latencyMs: Date.now() - dbStart });
    } catch (err: any) {
      checks.push({ name: "database", status: "down", detail: err.message, latencyMs: Date.now() - dbStart });
    }

    // Redis check
    const redisStart = Date.now();
    const redisOk = await this.redis.ping();
    checks.push({
      name: "redis",
      status: redisOk ? "up" : "down",
      latencyMs: Date.now() - redisStart,
      detail: redisOk ? undefined : "Redis unavailable — running in degraded mode",
    });

    const allUp = checks.every((c) => c.status === "up");
    return {
      status: allUp ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  @Get("metrics")
  async metrics() {
    // Exposed for Prometheus-style scraping (text format would be better;
    // JSON here keeps it simple and documented).
    return {
      timestamp: new Date().toISOString(),
      cache: (this as any).cacheStats ?? null,
      redis: { available: this.redis.isAvailable },
    };
  }
}
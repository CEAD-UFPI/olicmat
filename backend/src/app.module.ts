import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "./prisma.service.js";
import { RedisModule, RedisService } from "./redis/redis.service.js";
import { QueueModule } from "./queue/queue.module.js";
import { ProvaCacheModule } from "./olimpiada/prova/prova-cache.module.js";
import { HealthModule } from "./health/health.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { UsersModule } from "./users/users.module.js";
import { OlimpiadaModule } from "./olimpiada/olimpiada.module.js";
import { InstituicoesModule } from "./instituicoes/instituicoes.module.js";
import { AdminModule } from "./admin/admin.module.js";
import { CoordenacaoModule } from "./coordenacao/coordenacao.module.js";
import { CorrecaoModule } from "./correcao/correcao.module.js";
import { EmailModule } from "./email/email.module.js";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";

@Module({
  imports: [
    // --- Shared infrastructure (global modules) ---
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    QueueModule,
    ProvaCacheModule,
    HealthModule,

    // --- Rate limiting (Redis-backed when available, in-memory fallback) ---
    // Production-safe defaults: an exam has 30 questions, so 100 req/s short
    // tier is generous enough for legitimate traffic while still preventing
    // abuse. Limits are shared across all backend instances via Redis so
    // horizontal scaling does not multiply the effective rate limit.
    ThrottlerModule.forRootAsync({
      inject: [RedisService],
      useFactory: (redis: RedisService) => ({
        throttlers: [
          { name: "short", ttl: 1000, limit: 100 },
          { name: "medium", ttl: 10000, limit: 500 },
          { name: "long", ttl: 60000, limit: 5000 },
        ],
        // Falls back to in-memory storage when Redis is unavailable.
        storage: redis.client ? new ThrottlerStorageRedisService(redis.client) : undefined,
      }),
    }),

    // ── Module 1: Config / Registrations / Results / Reports ──
    AuthModule,
    EmailModule,
    UsersModule,
    OlimpiadaModule,
    InstituicoesModule,
    AdminModule,
    CoordenacaoModule,

    // ── Module 2: Exam execution (isolated) ──
    // (handled by ProvaController within OlimpiadaModule)

    // ── Module 3: Correction / Evaluation ──
    CorrecaoModule,
  ],
  providers: [
    // Apply throttler globally to all controllers.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

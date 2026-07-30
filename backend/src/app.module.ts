import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "./prisma.service.js";
import { HealthModule } from "./health/health.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { UsersModule } from "./users/users.module.js";
import { OlimpiadaModule } from "./olimpiada/olimpiada.module.js";
import { InstituicoesModule } from "./instituicoes/instituicoes.module.js";
import { AdminModule } from "./admin/admin.module.js";
import { CoordenacaoModule } from "./coordenacao/coordenacao.module.js";
import { CorrecaoModule } from "./correcao/correcao.module.js";
import { EmailModule } from "./email/email.module.js";

@Module({
  imports: [
    // --- Shared infrastructure (global modules) ---
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,

    // --- Rate limiting (in-memory) ---
    // Production-safe defaults: an exam has 30 questions, so 100 req/s short
    // tier is generous enough for legitimate traffic while still preventing abuse.
    ThrottlerModule.forRoot({
      throttlers: [
        { name: "short", ttl: 1000, limit: 100 },
        { name: "medium", ttl: 10000, limit: 500 },
        { name: "long", ttl: 60000, limit: 5000 },
      ],
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

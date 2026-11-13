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
import { Fase2Module } from "./fase2/fase2.module.js";
import { EmailModule } from "./email/email.module.js";
import { ConvitesModule } from "./convites/convites.module.js";
import { LinksConviteModule } from "./links-convite/links-convite.module.js";
import { NotificacoesModule } from "./notificacoes/notificacoes.module.js";

@Module({
  imports: [
    // --- Shared infrastructure (global modules) ---
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,

    // --- Rate limiting (in-memory) ---
    // Os contadores são por rota e por IP, e atrás do proxy todos os participantes
    // chegam com o mesmo IP. Com os limites antigos (100/s, 500/10s), 567 pessoas
    // entrando em 5 segundos receberam 409 respostas 429 no login (teste de carga
    // de 04/11/2026). Estes valores têm que comportar a turma inteira ao mesmo tempo.
    ThrottlerModule.forRoot({
      throttlers: [
        { name: "short", ttl: 1000, limit: Number(process.env.THROTTLE_SHORT ?? 2000) },
        { name: "medium", ttl: 10000, limit: Number(process.env.THROTTLE_MEDIUM ?? 10000) },
        { name: "long", ttl: 60000, limit: Number(process.env.THROTTLE_LONG ?? 60000) },
      ],
    }),

    // ── Module 1: Config / Registrations / Results / Reports ──
    AuthModule,
    EmailModule,
    NotificacoesModule,
    UsersModule,
    OlimpiadaModule,
    InstituicoesModule,
    AdminModule,
    CoordenacaoModule,

    // ── Module 2: Exam execution (isolated) ──
    // (apps/exam: aplicação isolada, que concentra todas as regras da prova)

    // ── Module 3: Correction / Evaluation ──
    Fase2Module,
    ConvitesModule,
    LinksConviteModule,
  ],
  providers: [
    // Apply throttler globally to all controllers.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

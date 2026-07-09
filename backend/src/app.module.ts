import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma.service.js";
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
    // --- Shared infrastructure ---
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,

    // --- Rate limiting ---
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1000, limit: 3 },
      { name: "medium", ttl: 10000, limit: 20 },
      { name: "long", ttl: 60000, limit: 100 },
    ]),

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
})
export class AppModule {}

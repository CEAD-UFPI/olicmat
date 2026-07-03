import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma.service.js";
import { AuthModule } from "./auth/auth.module.js";
import { UsersModule } from "./users/users.module.js";
import { OlimpiadaModule } from "./olimpiada/olimpiada.module.js";
import { InstituicoesModule } from "./instituicoes/instituicoes.module.js";
import { AdminModule } from "./admin/admin.module.js";
import { CoordenacaoModule } from "./coordenacao/coordenacao.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OlimpiadaModule,
    InstituicoesModule,
    AdminModule,
    CoordenacaoModule,
  ],
})
export class AppModule {}

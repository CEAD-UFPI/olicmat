import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { ProvaModule } from "./prova/prova.module.js";
import { PrismaModule } from "./prisma.service.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProvaModule,
  ],
})
export class AppModule {}

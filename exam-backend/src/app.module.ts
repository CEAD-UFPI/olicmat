import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { ProvaModule } from "./prova/prova.module.js";
import { PrismaService } from "./prisma.service.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProvaModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

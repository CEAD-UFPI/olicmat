import { Module } from "@nestjs/common";
import { ProvaController } from "./prova.controller.js";
import { ProvaService } from "./prova.service.js";
import { PrismaService } from "../prisma.service.js";

@Module({
  controllers: [ProvaController],
  providers: [ProvaService, PrismaService],
})
export class ProvaModule {}

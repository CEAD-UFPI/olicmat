import { Module } from "@nestjs/common";
import { AuditoriaService } from "./auditoria.service.js";
import { AuditoriaController } from "./auditoria.controller.js";
import { PrismaService } from "../../prisma.service.js";

@Module({
  controllers: [AuditoriaController],
  providers: [AuditoriaService, PrismaService],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}

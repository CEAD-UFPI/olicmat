import { Module } from "@nestjs/common";
import { QuestoesService } from "./questoes.service.js";
import { QuestoesController } from "./questoes.controller.js";
import { PrismaService } from "../../prisma.service.js";

@Module({
  controllers: [QuestoesController],
  providers: [QuestoesService, PrismaService],
  exports: [QuestoesService],
})
export class QuestoesModule {}

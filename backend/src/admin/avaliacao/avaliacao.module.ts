import { Module } from "@nestjs/common";
import { AvaliacaoService } from "./avaliacao.service.js";
import { AvaliacaoController } from "./avaliacao.controller.js";
import { PrismaService } from "../../prisma.service.js";

@Module({
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService, PrismaService],
  exports: [AvaliacaoService],
})
export class AvaliacaoModule {}

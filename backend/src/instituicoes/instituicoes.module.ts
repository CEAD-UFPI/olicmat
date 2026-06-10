import { Module } from "@nestjs/common";
import { InstituicoesService } from "./instituicoes.service.js";
import { InstituicoesController } from "./instituicoes.controller.js";
import { PrismaService } from "../prisma.service.js";

@Module({
  controllers: [InstituicoesController],
  providers: [InstituicoesService, PrismaService],
  exports: [InstituicoesService],
})
export class InstituicoesModule {}

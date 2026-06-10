import { Module } from "@nestjs/common";
import { CoordenacaoService } from "./coordenacao.service.js";
import { CoordenacaoController } from "./coordenacao.controller.js";
import { PrismaService } from "../prisma.service.js";

@Module({
  controllers: [CoordenacaoController],
  providers: [CoordenacaoService, PrismaService],
  exports: [CoordenacaoService],
})
export class CoordenacaoModule {}

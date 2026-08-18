import { Module } from "@nestjs/common";
import { AvaliacaoService } from "./avaliacao.service.js";
import { AvaliacaoController } from "./avaliacao.controller.js";

@Module({
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService],
  exports: [AvaliacaoService],
})
export class AvaliacaoModule {}

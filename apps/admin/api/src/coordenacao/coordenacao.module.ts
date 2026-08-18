import { Module } from "@nestjs/common";
import { CoordenacaoService } from "./coordenacao.service.js";
import { CoordenacaoController } from "./coordenacao.controller.js";

@Module({
  controllers: [CoordenacaoController],
  providers: [CoordenacaoService],
  exports: [CoordenacaoService],
})
export class CoordenacaoModule {}

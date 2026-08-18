import { Module } from "@nestjs/common";
import { CorrecaoService } from "./correcao.service.js";
import { CorrecaoController } from "./correcao.controller.js";

@Module({
  controllers: [CorrecaoController],
  providers: [CorrecaoService],
  exports: [CorrecaoService],
})
export class CorrecaoModule {}

import { Module } from "@nestjs/common";
import { InstituicoesService } from "./instituicoes.service.js";
import { InstituicoesController } from "./instituicoes.controller.js";

@Module({
  controllers: [InstituicoesController],
  providers: [InstituicoesService],
  exports: [InstituicoesService],
})
export class InstituicoesModule {}

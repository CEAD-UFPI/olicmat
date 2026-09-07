import { Module } from "@nestjs/common";
import { CoordenacaoService } from "./coordenacao.service.js";
import { CoordenacaoController } from "./coordenacao.controller.js";
import { ConvitesModule } from "../convites/convites.module.js";

@Module({
  imports: [ConvitesModule],
  controllers: [CoordenacaoController],
  providers: [CoordenacaoService],
  exports: [CoordenacaoService],
})
export class CoordenacaoModule {}

import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module.js";
import { Fase2ParticipanteService } from "./fase2-participante.service.js";
import { Fase2GestaoService } from "./fase2-gestao.service.js";
import { Fase2AvaliadorService } from "./fase2-avaliador.service.js";
import { Fase2ArmazenamentoService } from "./fase2-armazenamento.service.js";
import { Fase2VideosService } from "./fase2-videos.service.js";
import { Fase2CompressorController } from "./fase2-compressor.controller.js";
import { Fase2CoordenacaoController, Fase2CoordenacaoService } from "./fase2-coordenacao.service.js";
import {
  Fase2AvaliadorController,
  Fase2GestaoController,
  Fase2ParticipanteController,
} from "./fase2.controllers.js";

@Module({
  imports: [EmailModule],
  controllers: [Fase2ParticipanteController, Fase2GestaoController, Fase2AvaliadorController, Fase2CompressorController, Fase2CoordenacaoController],
  providers: [Fase2ArmazenamentoService, Fase2VideosService, Fase2ParticipanteService, Fase2GestaoService, Fase2AvaliadorService, Fase2CoordenacaoService],
})
export class Fase2Module {}

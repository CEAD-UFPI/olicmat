import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module.js";
import { Fase2ParticipanteService } from "./fase2-participante.service.js";
import { Fase2GestaoService } from "./fase2-gestao.service.js";
import { Fase2AvaliadorService } from "./fase2-avaliador.service.js";
import {
  Fase2AvaliadorController,
  Fase2GestaoController,
  Fase2ParticipanteController,
} from "./fase2.controllers.js";

@Module({
  imports: [EmailModule],
  controllers: [Fase2ParticipanteController, Fase2GestaoController, Fase2AvaliadorController],
  providers: [Fase2ParticipanteService, Fase2GestaoService, Fase2AvaliadorService],
})
export class Fase2Module {}

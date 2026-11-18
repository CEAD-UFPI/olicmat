import { Module } from "@nestjs/common";
import { InscricaoService } from "./inscricao/inscricao.service.js";
import { InscricaoController } from "./inscricao/inscricao.controller.js";
import { ProvaService } from "./prova/prova.service.js";
import { RankingService } from "./ranking/ranking.service.js";
import { RankingController } from "./ranking/ranking.controller.js";
import { RevisaoFase1Service } from "./revisao-fase1/revisao-fase1.service.js";
import { RevisaoFase1Controller } from "./revisao-fase1/revisao-fase1.controller.js";
import { UploadModule } from "../upload/upload.module.js";
import { EmailModule } from "../email/email.module.js";
import { NotificacoesModule } from "../notificacoes/notificacoes.module.js";

@Module({
  imports: [UploadModule, EmailModule, NotificacoesModule],
  controllers: [
    InscricaoController,
    RankingController,
    RevisaoFase1Controller,
  ],
  providers: [InscricaoService, ProvaService, RankingService, RevisaoFase1Service],
  exports: [InscricaoService, ProvaService],
})
export class OlimpiadaModule {}

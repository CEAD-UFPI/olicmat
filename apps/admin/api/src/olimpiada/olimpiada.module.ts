import { Module } from "@nestjs/common";
import { InscricaoService } from "./inscricao/inscricao.service.js";
import { InscricaoController } from "./inscricao/inscricao.controller.js";
import { ProvaService } from "./prova/prova.service.js";
import { RankingService } from "./ranking/ranking.service.js";
import { RankingController } from "./ranking/ranking.controller.js";
import { UploadModule } from "../upload/upload.module.js";
import { EmailModule } from "../email/email.module.js";
import { NotificacoesModule } from "../notificacoes/notificacoes.module.js";

@Module({
  imports: [UploadModule, EmailModule, NotificacoesModule],
  controllers: [
    InscricaoController,
    RankingController,
  ],
  providers: [InscricaoService, ProvaService, RankingService],
  exports: [InscricaoService, ProvaService],
})
export class OlimpiadaModule {}

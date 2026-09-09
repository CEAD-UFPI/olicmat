import { Module } from "@nestjs/common";
import { InscricaoService } from "./inscricao/inscricao.service.js";
import { InscricaoController } from "./inscricao/inscricao.controller.js";
import { ProvaService } from "./prova/prova.service.js";
import { ProvaController } from "./prova/prova.controller.js";
import { EnvioService } from "./envio/envio.service.js";
import { EnvioController } from "./envio/envio.controller.js";
import { RankingService } from "./ranking/ranking.service.js";
import { RankingController } from "./ranking/ranking.controller.js";
import { UploadModule } from "../upload/upload.module.js";
import { EmailModule } from "../email/email.module.js";
import { NotificacoesModule } from "../notificacoes/notificacoes.module.js";

@Module({
  imports: [UploadModule, EmailModule, NotificacoesModule],
  controllers: [
    InscricaoController,
    ProvaController,
    EnvioController,
    RankingController,
  ],
  providers: [InscricaoService, ProvaService, EnvioService, RankingService],
  exports: [InscricaoService, ProvaService, EnvioService],
})
export class OlimpiadaModule {}

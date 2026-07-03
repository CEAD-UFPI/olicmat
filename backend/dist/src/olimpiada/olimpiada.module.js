var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let OlimpiadaModule = class OlimpiadaModule {
};
OlimpiadaModule = __decorate([
    Module({
        imports: [UploadModule],
        controllers: [
            InscricaoController,
            ProvaController,
            EnvioController,
            RankingController,
        ],
        providers: [InscricaoService, ProvaService, EnvioService, RankingService],
        exports: [InscricaoService, ProvaService, EnvioService],
    })
], OlimpiadaModule);
export { OlimpiadaModule };
//# sourceMappingURL=olimpiada.module.js.map
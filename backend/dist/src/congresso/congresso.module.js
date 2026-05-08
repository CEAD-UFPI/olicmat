var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { SubmissaoService } from "./submissao/submissao.service.js";
import { SubmissaoController } from "./submissao/submissao.controller.js";
import { PrismaService } from "../prisma.service.js";
import { UploadModule } from "../upload/upload.module.js";
let CongressoModule = class CongressoModule {
};
CongressoModule = __decorate([
    Module({
        imports: [UploadModule],
        controllers: [SubmissaoController],
        providers: [SubmissaoService, PrismaService],
    })
], CongressoModule);
export { CongressoModule };
//# sourceMappingURL=congresso.module.js.map
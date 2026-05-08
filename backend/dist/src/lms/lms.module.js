var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { ModuloService } from "./modulos/modulo.service.js";
import { ModuloController } from "./modulos/modulo.controller.js";
import { CertificadoService } from "./certificado/certificado.service.js";
import { CertificadoController } from "./certificado/certificado.controller.js";
import { PrismaService } from "../prisma.service.js";
let LmsModule = class LmsModule {
};
LmsModule = __decorate([
    Module({
        controllers: [ModuloController, CertificadoController],
        providers: [ModuloService, CertificadoService, PrismaService],
        exports: [ModuloService, CertificadoService],
    })
], LmsModule);
export { LmsModule };
//# sourceMappingURL=lms.module.js.map
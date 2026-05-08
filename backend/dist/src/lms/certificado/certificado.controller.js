var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { CertificadoService } from "./certificado.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
let CertificadoController = class CertificadoController {
    certificadoService;
    constructor(certificadoService) {
        this.certificadoService = certificadoService;
    }
    async emitir(req) {
        return this.certificadoService.emitir(req.user.id);
    }
    async listar(req) {
        return this.certificadoService.meusCertificados(req.user.id);
    }
};
__decorate([
    Post("emitir"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificadoController.prototype, "emitir", null);
__decorate([
    Get(),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificadoController.prototype, "listar", null);
CertificadoController = __decorate([
    Controller("certificados"),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [CertificadoService])
], CertificadoController);
export { CertificadoController };
//# sourceMappingURL=certificado.controller.js.map
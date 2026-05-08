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
import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, UseInterceptors, UploadedFile, Request, BadRequestException, } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SubmissaoService } from "./submissao.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
let SubmissaoController = class SubmissaoController {
    submissaoService;
    constructor(submissaoService) {
        this.submissaoService = submissaoService;
    }
    async submeter(req, file, body) {
        if (!file)
            throw new BadRequestException("Arquivo é obrigatório");
        if (!body.titulo)
            throw new BadRequestException("Título é obrigatório");
        if (!body.resumo)
            throw new BadRequestException("Resumo é obrigatório");
        if (!["ARTIGO", "POSTER"].includes(body.tipo))
            throw new BadRequestException("Tipo inválido");
        return this.submissaoService.submeter(req.user.id, body.titulo, body.resumo, body.tipo, file);
    }
    async minhas(req) {
        return this.submissaoService.listarPorUsuario(req.user.id);
    }
    async listar(status) {
        return this.submissaoService.listarTodas(status);
    }
    async atualizarStatus(id, body) {
        if (!["APROVADO", "REJEITADO"].includes(body.status)) {
            throw new BadRequestException("Status inválido");
        }
        return this.submissaoService.atualizarStatus(id, body.status);
    }
};
__decorate([
    Post(),
    UseInterceptors(FileInterceptor("arquivo")),
    __param(0, Request()),
    __param(1, UploadedFile()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SubmissaoController.prototype, "submeter", null);
__decorate([
    Get("minhas"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubmissaoController.prototype, "minhas", null);
__decorate([
    UseGuards(RolesGuard),
    Roles("ADMIN", "AVALIADOR"),
    Get(),
    __param(0, Query("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissaoController.prototype, "listar", null);
__decorate([
    UseGuards(RolesGuard),
    Roles("ADMIN", "AVALIADOR"),
    Patch(":id"),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubmissaoController.prototype, "atualizarStatus", null);
SubmissaoController = __decorate([
    Controller("submissoes"),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [SubmissaoService])
], SubmissaoController);
export { SubmissaoController };
//# sourceMappingURL=submissao.controller.js.map
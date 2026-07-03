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
import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, BadRequestException, Query, UseInterceptors, UploadedFile, } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { z } from "zod";
import { InscricaoService } from "./inscricao.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
import { criarInscricaoSchema, editarInscricaoSchema, } from "./dto/inscricao.dto.js";
import { UploadService } from "../../upload/upload.service.js";
let InscricaoController = class InscricaoController {
    inscricaoService;
    uploadService;
    constructor(inscricaoService, uploadService) {
        this.inscricaoService = inscricaoService;
        this.uploadService = uploadService;
    }
    async criar(req, body) {
        const parsed = criarInscricaoSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.inscricaoService.criar(req.user.id, parsed.data);
    }
    async minha(req) {
        return this.inscricaoService.buscarPorUsuario(req.user.id);
    }
    async iniciarProva(req) {
        const inscricao = await this.inscricaoService.buscarPorUsuario(req.user.id);
        return this.inscricaoService.iniciarProva(inscricao.id);
    }
    async sortearTema(req) {
        const inscricao = await this.inscricaoService.buscarPorUsuario(req.user.id);
        return this.inscricaoService.sortearTema(inscricao.id);
    }
    async listar(req, status) {
        return this.inscricaoService.listarTodas(req.user.role, req.user.id, undefined, status);
    }
    async confirmar(id, req) {
        return this.inscricaoService.confirmar(id, req.user.id);
    }
    async atualizarStatus(id, body, req) {
        const parsed = z.object({
            status: z.enum(["PENDENTE", "CONFIRMADA", "REJEITADA"]),
        }).safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.inscricaoService.atualizarStatus(id, parsed.data.status, req.user.id);
    }
    async editar(id, body) {
        const parsed = editarInscricaoSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.inscricaoService.editar(id, parsed.data);
    }
    async deletar(id, req) {
        return this.inscricaoService.deletar(id, req.user.id);
    }
    async uploadComprovante(req, file) {
        const url = await this.uploadService.uploadArquivo(file, "comprovantes", "image");
        const inscricao = await this.inscricaoService.buscarPorUsuario(req.user.id);
        await this.inscricaoService.editar(inscricao.id, { comprovanteUrl: url });
        return { url };
    }
};
__decorate([
    UseGuards(JwtAuthGuard),
    Post(),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "criar", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get("minha"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "minha", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post("minha/iniciar-prova"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "iniciarProva", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post("minha/sortear-tema"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "sortearTema", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.COMISSAO, Role.AVALIADOR),
    Get(),
    __param(0, Request()),
    __param(1, Query("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "listar", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    Patch(":id/confirmar"),
    __param(0, Param("id")),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "confirmar", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    Patch(":id/status"),
    __param(0, Param("id")),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "atualizarStatus", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    Patch(":id"),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "editar", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    Delete(":id"),
    __param(0, Param("id")),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "deletar", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post("comprovante"),
    UseInterceptors(FileInterceptor("comprovante")),
    __param(0, Request()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InscricaoController.prototype, "uploadComprovante", null);
InscricaoController = __decorate([
    Controller("inscricoes"),
    __metadata("design:paramtypes", [InscricaoService,
        UploadService])
], InscricaoController);
export { InscricaoController };
//# sourceMappingURL=inscricao.controller.js.map
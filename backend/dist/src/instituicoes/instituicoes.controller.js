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
import { Controller, Get, Post, Patch, Param, Body, UseGuards, BadRequestException, } from "@nestjs/common";
import { z } from "zod";
import { InstituicoesService } from "./instituicoes.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";
const criarInstituicaoSchema = z.object({
    nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    sigla: z.string().min(2, "Sigla deve ter no mínimo 2 caracteres").max(10),
    estado: z.string().length(2, "UF deve ter 2 caracteres").optional(),
});
const atualizarInstituicaoSchema = z.object({
    nome: z.string().min(2).optional(),
    sigla: z.string().min(2).max(10).optional(),
    estado: z.string().length(2).optional(),
});
let InstituicoesController = class InstituicoesController {
    instituicoesService;
    constructor(instituicoesService) {
        this.instituicoesService = instituicoesService;
    }
    async findAll() {
        return this.instituicoesService.findAll();
    }
    async findById(id) {
        return this.instituicoesService.findById(id);
    }
    async create(body) {
        const parsed = criarInstituicaoSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.instituicoesService.create(parsed.data);
    }
    async update(id, body) {
        const parsed = atualizarInstituicaoSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.instituicoesService.update(id, parsed.data);
    }
};
__decorate([
    Get("instituicoes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstituicoesController.prototype, "findAll", null);
__decorate([
    Get("instituicoes/:id"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstituicoesController.prototype, "findById", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    Post("admin/instituicoes"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstituicoesController.prototype, "create", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    Patch("admin/instituicoes/:id"),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InstituicoesController.prototype, "update", null);
InstituicoesController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [InstituicoesService])
], InstituicoesController);
export { InstituicoesController };
//# sourceMappingURL=instituicoes.controller.js.map
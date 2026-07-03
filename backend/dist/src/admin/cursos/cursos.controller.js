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
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, BadRequestException, } from "@nestjs/common";
import { z } from "zod";
import { CursosService } from "./cursos.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
const criarCursoSchema = z.object({
    nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    instituicaoId: z.string().uuid("Instituição inválida"),
});
const atualizarCursoSchema = z.object({
    nome: z.string().min(2).optional(),
    instituicaoId: z.string().uuid().optional(),
});
let CursosController = class CursosController {
    cursosService;
    constructor(cursosService) {
        this.cursosService = cursosService;
    }
    async findAll(instituicaoId) {
        return this.cursosService.findAll(instituicaoId);
    }
    async findById(id) {
        return this.cursosService.findById(id);
    }
    async create(body) {
        const parsed = criarCursoSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.cursosService.create(parsed.data);
    }
    async update(id, body) {
        const parsed = atualizarCursoSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.cursosService.update(id, parsed.data);
    }
    async delete(id) {
        return this.cursosService.delete(id);
    }
};
__decorate([
    Roles(Role.ADMIN, Role.AVALIADOR, Role.COMISSAO),
    Get(),
    __param(0, Query("instituicaoId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CursosController.prototype, "findAll", null);
__decorate([
    Roles(Role.ADMIN, Role.AVALIADOR, Role.COMISSAO),
    Get(":id"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CursosController.prototype, "findById", null);
__decorate([
    Roles(Role.ADMIN),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CursosController.prototype, "create", null);
__decorate([
    Roles(Role.ADMIN),
    Patch(":id"),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CursosController.prototype, "update", null);
__decorate([
    Roles(Role.ADMIN),
    Delete(":id"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CursosController.prototype, "delete", null);
CursosController = __decorate([
    Controller("admin/cursos"),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [CursosService])
], CursosController);
export { CursosController };
//# sourceMappingURL=cursos.controller.js.map
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
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Req, BadRequestException, } from "@nestjs/common";
import { ProvasService } from "./provas.service.js";
import { criarProvaSchema, atualizarProvaSchema } from "./dto/provas.dto.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
let ProvasController = class ProvasController {
    provasService;
    constructor(provasService) {
        this.provasService = provasService;
    }
    async create(req, body) {
        const parsed = criarProvaSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.provasService.create(req.user.id, parsed.data);
    }
    async findAll(edicaoId) {
        return this.provasService.findAll(edicaoId);
    }
    async findById(id) {
        return this.provasService.findById(id);
    }
    async update(id, req, body) {
        const parsed = atualizarProvaSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        if (req.user.role === Role.AVALIADOR) {
            const prova = await this.provasService.findById(id);
            if (prova.status !== "RASCUNHO") {
                throw new BadRequestException("Apenas provas em rascunho podem ser editadas por avaliadores");
            }
        }
        return this.provasService.update(id, parsed.data);
    }
    async delete(id) {
        return this.provasService.delete(id);
    }
    async publicar(id) {
        return this.provasService.publicar(id);
    }
    async duplicar(id, req) {
        return this.provasService.duplicar(id, req.user.id);
    }
};
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Post(),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProvasController.prototype, "create", null);
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Get(),
    __param(0, Query("edicaoId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProvasController.prototype, "findAll", null);
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Get(":id"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProvasController.prototype, "findById", null);
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Patch(":id"),
    __param(0, Param("id")),
    __param(1, Req()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProvasController.prototype, "update", null);
__decorate([
    Roles(Role.ADMIN),
    Delete(":id"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProvasController.prototype, "delete", null);
__decorate([
    Roles(Role.ADMIN),
    Post(":id/publicar"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProvasController.prototype, "publicar", null);
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Post(":id/duplicar"),
    __param(0, Param("id")),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProvasController.prototype, "duplicar", null);
ProvasController = __decorate([
    Controller("admin/provas"),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [ProvasService])
], ProvasController);
export { ProvasController };
//# sourceMappingURL=provas.controller.js.map
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
import { Controller, Get, Post, Param, Body, Query, UseGuards, Req, BadRequestException, } from "@nestjs/common";
import { AvaliacaoService } from "./avaliacao.service.js";
import { avaliarEnvioSchema } from "./dto/avaliacao.dto.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
let AvaliacaoController = class AvaliacaoController {
    avaliacaoService;
    constructor(avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }
    async listPending() {
        return this.avaliacaoService.listPending();
    }
    async assignGrade(envioId, body, req) {
        const parsed = avaliarEnvioSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.avaliacaoService.assignGrade(envioId, parsed.data, req.user.id);
    }
    async listHistorico(page, limit, nome) {
        return this.avaliacaoService.listHistorico(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20, nome);
    }
};
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Get("pendentes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AvaliacaoController.prototype, "listPending", null);
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Post(":envioId/nota"),
    __param(0, Param("envioId")),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AvaliacaoController.prototype, "assignGrade", null);
__decorate([
    Roles(Role.ADMIN, Role.AVALIADOR),
    Get("historico"),
    __param(0, Query("page")),
    __param(1, Query("limit")),
    __param(2, Query("nome")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AvaliacaoController.prototype, "listHistorico", null);
AvaliacaoController = __decorate([
    Controller("admin/avaliacao"),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [AvaliacaoService])
], AvaliacaoController);
export { AvaliacaoController };
//# sourceMappingURL=avaliacao.controller.js.map
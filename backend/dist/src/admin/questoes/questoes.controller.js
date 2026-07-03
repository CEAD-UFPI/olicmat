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
import { QuestoesService } from "./questoes.service.js";
import { criarQuestaoSchema, vincularQuestaoSchema, atualizarQuestaoSchema, } from "./dto/questoes.dto.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
let QuestoesController = class QuestoesController {
    questoesService;
    constructor(questoesService) {
        this.questoesService = questoesService;
    }
    async addToExam(provaId, body) {
        if ("questaoId" in body && body.questaoId) {
            const parsed = vincularQuestaoSchema.safeParse(body);
            if (!parsed.success) {
                throw new BadRequestException(parsed.error.flatten().fieldErrors);
            }
            return this.questoesService.linkToExam(provaId, parsed.data);
        }
        const parsed = criarQuestaoSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.questoesService.addToExam(provaId, parsed.data);
    }
    async findAll(eixo, dificuldade) {
        return this.questoesService.findAll({ eixo, dificuldade });
    }
    async findExamQuestions(provaId) {
        return this.questoesService.findExamQuestions(provaId);
    }
    async update(id, body) {
        const parsed = atualizarQuestaoSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.questoesService.update(id, parsed.data);
    }
    async remove(id) {
        return this.questoesService.remove(id);
    }
};
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Post("admin/provas/:provaId/questoes"),
    __param(0, Param("provaId")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestoesController.prototype, "addToExam", null);
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN, Role.COMISSAO),
    Get("admin/questoes"),
    __param(0, Query("eixo")),
    __param(1, Query("dificuldade")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuestoesController.prototype, "findAll", null);
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN, Role.COMISSAO),
    Get("admin/provas/:provaId/questoes"),
    __param(0, Param("provaId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestoesController.prototype, "findExamQuestions", null);
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Patch("admin/questoes/:id"),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestoesController.prototype, "update", null);
__decorate([
    Roles(Role.AVALIADOR, Role.ADMIN),
    Delete("admin/questoes/:id"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestoesController.prototype, "remove", null);
QuestoesController = __decorate([
    Controller(),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [QuestoesService])
], QuestoesController);
export { QuestoesController };
//# sourceMappingURL=questoes.controller.js.map
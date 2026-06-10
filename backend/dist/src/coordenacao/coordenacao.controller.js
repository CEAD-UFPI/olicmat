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
import { Controller, Get, Query, UseGuards, Req, } from "@nestjs/common";
import { CoordenacaoService } from "./coordenacao.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";
let CoordenacaoController = class CoordenacaoController {
    coordenacaoService;
    constructor(coordenacaoService) {
        this.coordenacaoService = coordenacaoService;
    }
    async listAlunos(req) {
        return this.coordenacaoService.listAlunos(req.user.id);
    }
    async listInscricoes(req, cursoId, status) {
        return this.coordenacaoService.listInscricoes(req.user.id, {
            cursoId,
            status,
        });
    }
    async getMetricas(req) {
        return this.coordenacaoService.getMetricas(req.user.id);
    }
};
__decorate([
    Get("alunos"),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoordenacaoController.prototype, "listAlunos", null);
__decorate([
    Get("inscricoes"),
    __param(0, Req()),
    __param(1, Query("cursoId")),
    __param(2, Query("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CoordenacaoController.prototype, "listInscricoes", null);
__decorate([
    Get("metricas"),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoordenacaoController.prototype, "getMetricas", null);
CoordenacaoController = __decorate([
    Controller("coordenacao"),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.COORDENADOR_CURSO),
    __metadata("design:paramtypes", [CoordenacaoService])
], CoordenacaoController);
export { CoordenacaoController };
//# sourceMappingURL=coordenacao.controller.js.map
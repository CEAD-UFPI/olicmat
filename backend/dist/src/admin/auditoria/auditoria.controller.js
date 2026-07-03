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
import { Controller, Get, Query, Header, Res, UseGuards } from "@nestjs/common";
import { AuditoriaService } from "./auditoria.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
let AuditoriaController = class AuditoriaController {
    auditoriaService;
    constructor(auditoriaService) {
        this.auditoriaService = auditoriaService;
    }
    async findAll(entidade, acao, actorId, dataInicio, dataFim, page, limit) {
        return this.auditoriaService.findAll({
            entidade,
            acao,
            actorId,
            dataInicio,
            dataFim,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }
    async exportCsv(entidade, acao, dataInicio, dataFim, res) {
        const csv = await this.auditoriaService.exportCsv({
            entidade,
            acao,
            dataInicio,
            dataFim,
        });
        res?.send(csv);
    }
};
__decorate([
    Roles(Role.ADMIN, Role.COMISSAO),
    Get(),
    __param(0, Query("entidade")),
    __param(1, Query("acao")),
    __param(2, Query("actorId")),
    __param(3, Query("dataInicio")),
    __param(4, Query("dataFim")),
    __param(5, Query("page")),
    __param(6, Query("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuditoriaController.prototype, "findAll", null);
__decorate([
    Roles(Role.ADMIN, Role.COMISSAO),
    Get("export"),
    Header("Content-Type", "text/csv; charset=utf-8"),
    Header("Content-Disposition", "attachment; filename=auditoria.csv"),
    __param(0, Query("entidade")),
    __param(1, Query("acao")),
    __param(2, Query("dataInicio")),
    __param(3, Query("dataFim")),
    __param(4, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuditoriaController.prototype, "exportCsv", null);
AuditoriaController = __decorate([
    Controller("admin/auditoria"),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    __metadata("design:paramtypes", [AuditoriaService])
], AuditoriaController);
export { AuditoriaController };
//# sourceMappingURL=auditoria.controller.js.map
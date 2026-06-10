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
import { Controller, Get, Header, Query, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getMetrics() {
        return this.dashboardService.getMetrics();
    }
    async getResumo() {
        return this.dashboardService.getResumo();
    }
    async exportInscricoes(edicaoId, estado, status) {
        return this.dashboardService.exportInscricoes({
            edicaoId,
            estado,
            status,
        });
    }
    async exportUsuarios() {
        return this.dashboardService.exportUsuarios();
    }
    async exportProvas() {
        return this.dashboardService.exportProvas();
    }
    async exportResultados() {
        return this.dashboardService.exportResultados();
    }
    async listEdicoes() {
        return this.dashboardService.listEdicoes();
    }
};
__decorate([
    Roles(Role.ADMIN),
    Get("dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMetrics", null);
__decorate([
    Roles(Role.ADMIN),
    Get("metricas"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getResumo", null);
__decorate([
    Roles(Role.ADMIN),
    Get("export/inscricoes"),
    Header("Content-Type", "text/csv"),
    Header("Content-Disposition", 'attachment; filename="inscricoes.csv"'),
    __param(0, Query("edicaoId")),
    __param(1, Query("estado")),
    __param(2, Query("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "exportInscricoes", null);
__decorate([
    Roles(Role.ADMIN),
    Get("export/usuarios"),
    Header("Content-Type", "text/csv"),
    Header("Content-Disposition", 'attachment; filename="usuarios.csv"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "exportUsuarios", null);
__decorate([
    Roles(Role.ADMIN),
    Get("export/provas"),
    Header("Content-Type", "text/csv"),
    Header("Content-Disposition", 'attachment; filename="provas.csv"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "exportProvas", null);
__decorate([
    Roles(Role.ADMIN),
    Get("export/resultados"),
    Header("Content-Type", "text/csv"),
    Header("Content-Disposition", 'attachment; filename="resultados.csv"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "exportResultados", null);
__decorate([
    Roles(Role.ADMIN, Role.AVALIADOR),
    Get("edicoes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "listEdicoes", null);
DashboardController = __decorate([
    Controller("admin"),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [DashboardService])
], DashboardController);
export { DashboardController };
//# sourceMappingURL=dashboard.controller.js.map
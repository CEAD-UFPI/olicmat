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
import { Controller, Get, Post, Param, Body, UseGuards, Request, } from "@nestjs/common";
import { ModuloService } from "./modulo.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
let ModuloController = class ModuloController {
    moduloService;
    constructor(moduloService) {
        this.moduloService = moduloService;
    }
    async listar() {
        return this.moduloService.listarTodos();
    }
    async progresso(req) {
        return this.moduloService.progressoGeral(req.user.id);
    }
    async buscar(id, req) {
        return this.moduloService.buscarPorId(id, req.user.id);
    }
    async concluir(id, req, body) {
        return this.moduloService.concluirModulo(req.user.id, id, body.nota);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModuloController.prototype, "listar", null);
__decorate([
    Get("progresso"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModuloController.prototype, "progresso", null);
__decorate([
    Get(":id"),
    __param(0, Param("id")),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ModuloController.prototype, "buscar", null);
__decorate([
    Post(":id/concluir"),
    __param(0, Param("id")),
    __param(1, Request()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ModuloController.prototype, "concluir", null);
ModuloController = __decorate([
    Controller("modulos"),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [ModuloService])
], ModuloController);
export { ModuloController };
//# sourceMappingURL=modulo.controller.js.map
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
import { Controller, Get, Post, Body, UseGuards, Request, BadRequestException, } from "@nestjs/common";
import { ProvaService } from "./prova.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { responderQuestaoSchema } from "./dto/prova.dto.js";
let ProvaController = class ProvaController {
    provaService;
    constructor(provaService) {
        this.provaService = provaService;
    }
    async buscarQuestoes(req) {
        return this.provaService.buscarQuestoes(req.user.id);
    }
    async responder(req, body) {
        const parsed = responderQuestaoSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.provaService.responder(req.user.id, parsed.data);
    }
    async finalizar(req) {
        return this.provaService.finalizarProva(req.user.id);
    }
    async resumo(req) {
        return this.provaService.resumoProva(req.user.id);
    }
};
__decorate([
    Get("questoes"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProvaController.prototype, "buscarQuestoes", null);
__decorate([
    Post("responder"),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProvaController.prototype, "responder", null);
__decorate([
    Post("finalizar"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProvaController.prototype, "finalizar", null);
__decorate([
    Get("resumo"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProvaController.prototype, "resumo", null);
ProvaController = __decorate([
    Controller("prova"),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [ProvaService])
], ProvaController);
export { ProvaController };
//# sourceMappingURL=prova.controller.js.map
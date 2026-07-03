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
import { Controller, Post, Get, Body, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException, } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { EnvioService } from "./envio.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
let EnvioController = class EnvioController {
    envioService;
    constructor(envioService) {
        this.envioService = envioService;
    }
    async enviarVideoLink(req, body) {
        if (!body.videoLink) {
            throw new BadRequestException("Link do vídeo é obrigatório");
        }
        return this.envioService.enviarVideoLink(req.user.id, body.videoLink);
    }
    async uploadPortfolio(req, file) {
        if (!file) {
            throw new BadRequestException("Arquivo do portfólio é obrigatório");
        }
        return this.envioService.uploadPortfolio(req.user.id, file);
    }
    async status(req) {
        return this.envioService.statusEnvio(req.user.id);
    }
};
__decorate([
    Post("video-link"),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnvioController.prototype, "enviarVideoLink", null);
__decorate([
    Post("portfolio"),
    UseInterceptors(FileInterceptor("portfolio")),
    __param(0, Request()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnvioController.prototype, "uploadPortfolio", null);
__decorate([
    Get("status"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnvioController.prototype, "status", null);
EnvioController = __decorate([
    Controller("envio"),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [EnvioService])
], EnvioController);
export { EnvioController };
//# sourceMappingURL=envio.controller.js.map
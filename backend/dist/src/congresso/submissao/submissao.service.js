var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { UploadService } from "../../upload/upload.service.js";
let SubmissaoService = class SubmissaoService {
    prisma;
    upload;
    constructor(prisma, upload) {
        this.prisma = prisma;
        this.upload = upload;
    }
    async submeter(userId, titulo, resumo, tipo, file) {
        const arquivoUrl = await this.upload.uploadBuffer(file.buffer, `congemat/${userId}`, file.originalname, "raw");
        return this.prisma.submissao.create({
            data: { userId, titulo, resumo, tipo, arquivoUrl },
        });
    }
    async listarPorUsuario(userId) {
        return this.prisma.submissao.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                titulo: true,
                tipo: true,
                status: true,
                createdAt: true,
            },
        });
    }
    async listarTodas(status) {
        return this.prisma.submissao.findMany({
            where: status ? { status: status } : undefined,
            include: {
                user: { select: { id: true, nome: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async atualizarStatus(id, status) {
        const submissao = await this.prisma.submissao.findUnique({ where: { id } });
        if (!submissao)
            throw new NotFoundException("Submissão não encontrada");
        return this.prisma.submissao.update({
            where: { id },
            data: { status },
        });
    }
};
SubmissaoService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        UploadService])
], SubmissaoService);
export { SubmissaoService };
//# sourceMappingURL=submissao.service.js.map
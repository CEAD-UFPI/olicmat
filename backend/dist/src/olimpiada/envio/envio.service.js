var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException, } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { UploadService } from "../../upload/upload.service.js";
let EnvioService = class EnvioService {
    prisma;
    upload;
    constructor(prisma, upload) {
        this.prisma = prisma;
        this.upload = upload;
    }
    async uploadFase2(userId, file, tipo) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { userId },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        if (!inscricao.fase2Tema) {
            throw new BadRequestException("Tema da Fase 2 ainda não foi sorteado");
        }
        if (inscricao.fase1Nota == null || inscricao.fase1Nota < 60) {
            throw new BadRequestException("Nota mínima da Fase 1 não atingida");
        }
        const resourceType = tipo === "video" ? "video" : "raw";
        const arquivoUrl = await this.upload.uploadBuffer(file.buffer, `fase2/${userId}`, file.originalname, resourceType);
        return this.prisma.envioFase2.create({
            data: {
                inscricaoId: inscricao.id,
                tipo,
                arquivoUrl,
                status: "ENVIADO",
            },
        });
    }
    async uploadVideo(userId, file) {
        return this.uploadFase2(userId, file, "video");
    }
    async uploadPortfolio(userId, file) {
        return this.uploadFase2(userId, file, "portfolio");
    }
    async statusEnvio(userId) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { userId },
            select: {
                id: true,
                fase2Tema: true,
                enviosFase2: {
                    select: {
                        id: true,
                        tipo: true,
                        arquivoUrl: true,
                        status: true,
                        enviadoEm: true,
                    },
                },
                avaliacoes: {
                    select: {
                        id: true,
                        nota: true,
                        parecer: true,
                        avaliadoEm: true,
                    },
                },
            },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        return inscricao;
    }
};
EnvioService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        UploadService])
], EnvioService);
export { EnvioService };
//# sourceMappingURL=envio.service.js.map
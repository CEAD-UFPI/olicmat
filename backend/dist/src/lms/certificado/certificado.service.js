var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { randomBytes } from "crypto";
let CertificadoService = class CertificadoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async emitir(userId) {
        const progresso = await this.prisma.progressoCurso.findMany({
            where: { userId, concluido: true },
            include: { modulo: { select: { cargaHoraria: true } } },
        });
        if (progresso.length === 0) {
            throw new BadRequestException("Nenhum módulo concluído");
        }
        const cargaHoraria = progresso.reduce((acc, p) => acc + p.modulo.cargaHoraria, 0);
        const existente = await this.prisma.certificado.findFirst({
            where: { userId, cargaHoraria },
        });
        if (existente) {
            return existente;
        }
        const codigo = randomBytes(8).toString("hex").toUpperCase();
        return this.prisma.certificado.create({
            data: {
                userId,
                cargaHoraria,
                codigo,
            },
        });
    }
    async meusCertificados(userId) {
        return this.prisma.certificado.findMany({
            where: { userId },
            orderBy: { emitidoEm: "desc" },
        });
    }
};
CertificadoService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CertificadoService);
export { CertificadoService };
//# sourceMappingURL=certificado.service.js.map
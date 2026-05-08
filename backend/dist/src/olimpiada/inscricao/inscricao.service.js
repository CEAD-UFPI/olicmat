var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, BadRequestException, } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
const TEMAS_GERADORES = [
    "Funções no Cotidiano",
    "Geometria e Arte",
    "Probabilidade e Jogos",
    "Matemática Financeira",
    "Trigonometria Aplicada",
    "Modelagem Matemática",
    "Educação Matemática Inclusiva",
    "Tecnologias no Ensino de Matemática",
    "Resolução de Problemas",
    "História da Matemática em Sala de Aula",
];
let InscricaoService = class InscricaoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async criar(userId, data) {
        const existente = await this.prisma.inscricao.findUnique({
            where: { userId },
        });
        if (existente) {
            throw new ConflictException("Você já possui uma inscrição");
        }
        return this.prisma.inscricao.create({
            data: {
                userId,
                estado: data.estado.toUpperCase(),
                municipio: data.municipio,
                instituicao: data.instituicao,
                curso: data.curso,
                periodo: data.periodo,
            },
        });
    }
    async buscarPorUsuario(userId) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
            },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        return inscricao;
    }
    async confirmar(inscricaoId) {
        return this.prisma.inscricao.update({
            where: { id: inscricaoId },
            data: { status: "CONFIRMADA" },
        });
    }
    async iniciarProva(inscricaoId) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { id: inscricaoId },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        if (inscricao.status !== "CONFIRMADA") {
            throw new BadRequestException("Inscrição precisa estar confirmada para iniciar a prova");
        }
        if (inscricao.fase1Inicio) {
            throw new BadRequestException("Prova já foi iniciada");
        }
        return this.prisma.inscricao.update({
            where: { id: inscricaoId },
            data: { fase1Inicio: new Date() },
        });
    }
    async sortearTema(inscricaoId) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { id: inscricaoId },
        });
        if (!inscricao || inscricao.status !== "CONFIRMADA") {
            throw new BadRequestException("Inscrição não está apta para a Fase 2");
        }
        if (!inscricao.fase1Nota || inscricao.fase1Nota < 60) {
            throw new BadRequestException("Nota mínima da Fase 1 não atingida");
        }
        if (inscricao.fase2Tema) {
            throw new BadRequestException("Tema já foi sorteado");
        }
        const tema = TEMAS_GERADORES[Math.floor(Math.random() * TEMAS_GERADORES.length)];
        return this.prisma.inscricao.update({
            where: { id: inscricaoId },
            data: { fase2Tema: tema },
        });
    }
    async listarTodas(status) {
        return this.prisma.inscricao.findMany({
            where: status ? { status: status } : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        instituicao: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
};
InscricaoService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], InscricaoService);
export { InscricaoService };
//# sourceMappingURL=inscricao.service.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
let AvaliacaoService = class AvaliacaoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listPending() {
        return this.prisma.envioFase2.findMany({
            where: { status: "ENVIADO" },
            include: {
                inscricao: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                nome: true,
                                email: true,
                            },
                        },
                        instituicao: { select: { id: true, nome: true, sigla: true } },
                        curso: { select: { id: true, nome: true } },
                    },
                },
            },
            orderBy: { enviadoEm: "asc" },
        });
    }
    async assignGrade(envioId, data, avaliadorId) {
        const envio = await this.prisma.envioFase2.findUnique({
            where: { id: envioId },
        });
        if (!envio) {
            throw new NotFoundException("Envio não encontrado");
        }
        if (envio.status !== "ENVIADO") {
            throw new BadRequestException("Envio já foi avaliado ou não está pendente");
        }
        const inscricaoId = envio.inscricaoId;
        const avaliacao = await this.prisma.avaliacaoFase2.upsert({
            where: {
                inscricaoId_avaliadorId: {
                    inscricaoId,
                    avaliadorId,
                },
            },
            create: {
                inscricaoId,
                avaliadorId,
                nota: data.nota,
                parecer: data.comentario,
            },
            update: {
                nota: data.nota,
                parecer: data.comentario,
            },
        });
        await this.prisma.envioFase2.update({
            where: { id: envioId },
            data: { status: "AVALIADO" },
        });
        const avaliacoes = await this.prisma.avaliacaoFase2.findMany({
            where: { inscricaoId },
        });
        const mediaNota = avaliacoes.reduce((sum, a) => sum + a.nota, 0) / avaliacoes.length;
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { id: inscricaoId },
            include: { edicao: true },
        });
        if (inscricao) {
            const pesoFase1 = inscricao.edicao?.pesoFase1 ?? 0.5;
            const pesoFase2 = inscricao.edicao?.pesoFase2 ?? 0.5;
            const fase1Nota = inscricao.fase1Nota ?? 0;
            const notaFinal = Math.round((fase1Nota * pesoFase1 + mediaNota * pesoFase2) * 100) / 100;
            await this.prisma.inscricao.update({
                where: { id: inscricaoId },
                data: {
                    notaFinal,
                },
            });
        }
        return avaliacao;
    }
    async listHistorico(page = 1, limit = 20, nome) {
        const where = {
            status: "AVALIADO",
        };
        if (nome) {
            where.inscricao = {
                user: {
                    nome: { contains: nome, mode: "insensitive" },
                },
            };
        }
        const [envios, total] = await Promise.all([
            this.prisma.envioFase2.findMany({
                where,
                include: {
                    inscricao: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    nome: true,
                                    email: true,
                                },
                            },
                            instituicao: { select: { id: true, nome: true, sigla: true } },
                            curso: { select: { id: true, nome: true } },
                            avaliacoes: {
                                include: {
                                    avaliador: {
                                        select: { id: true, nome: true },
                                    },
                                },
                                orderBy: { avaliadoEm: "desc" },
                            },
                        },
                    },
                },
                orderBy: { enviadoEm: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.envioFase2.count({ where }),
        ]);
        return {
            data: envios,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
};
AvaliacaoService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AvaliacaoService);
export { AvaliacaoService };
//# sourceMappingURL=avaliacao.service.js.map
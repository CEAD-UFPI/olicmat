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
const DURACAO_PROVA_MINUTOS = 180;
let ProvaService = class ProvaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async buscarQuestoes(userId, quantidade = 30) {
        const inscricao = await this.prisma.inscricao.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        if (!inscricao || inscricao.status !== "CONFIRMADA") {
            throw new BadRequestException("Inscrição não está confirmada para realizar a prova");
        }
        if (!inscricao.fase1Inicio) {
            throw new BadRequestException("Prova não foi iniciada");
        }
        const fimProva = new Date(inscricao.fase1Inicio.getTime() + DURACAO_PROVA_MINUTOS * 60 * 1000);
        if (new Date() > fimProva) {
            throw new BadRequestException("Tempo de prova esgotado");
        }
        const prova = await this.prisma.prova.findFirst({
            where: { edicaoId: inscricao.edicaoId, fase: 1 },
        });
        if (!prova) {
            throw new BadRequestException("Nenhuma prova disponível para esta edição");
        }
        const provasQuestoes = await this.prisma.provaQuestao.findMany({
            where: { provaId: prova.id },
            include: {
                questao: {
                    select: {
                        id: true,
                        enunciado: true,
                        alternativaA: true,
                        alternativaB: true,
                        alternativaC: true,
                        alternativaD: true,
                        alternativaE: true,
                        eixo: true,
                        dificuldade: true,
                    },
                },
            },
            orderBy: { ordem: "asc" },
        });
        const questoes = provasQuestoes.map((pq) => pq.questao);
        const respostas = await this.prisma.resposta.findMany({
            where: {
                inscricaoId: inscricao.id,
                questaoId: { in: questoes.map((q) => q.id) },
            },
        });
        const respostasMap = new Map(respostas.map((r) => [r.questaoId, r.alternativaMarcada]));
        return {
            inscricaoId: inscricao.id,
            inicio: inscricao.fase1Inicio.toISOString(),
            fim: fimProva.toISOString(),
            questoes: questoes.map((q) => ({
                ...q,
                respondida: respostasMap.get(q.id) || null,
            })),
        };
    }
    async responder(userId, data) {
        const inscricao = await this.prisma.inscricao.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        const questao = await this.prisma.questao.findUnique({
            where: { id: data.questaoId },
        });
        if (!questao) {
            throw new NotFoundException("Questão não encontrada");
        }
        const prova = await this.prisma.prova.findFirst({
            where: { edicaoId: inscricao.edicaoId, fase: 1 },
        });
        if (!prova) {
            throw new BadRequestException("Nenhuma prova disponível para esta edição");
        }
        const fimProva = inscricao.fase1Inicio
            ? new Date(inscricao.fase1Inicio.getTime() + DURACAO_PROVA_MINUTOS * 60 * 1000)
            : null;
        if (fimProva && new Date() > fimProva) {
            throw new BadRequestException("Tempo de prova esgotado");
        }
        const correta = data.alternativa === questao.correta;
        return this.prisma.resposta.upsert({
            where: {
                inscricaoId_provaId_questaoId: {
                    inscricaoId: inscricao.id,
                    provaId: prova.id,
                    questaoId: data.questaoId,
                },
            },
            create: {
                inscricaoId: inscricao.id,
                provaId: prova.id,
                questaoId: data.questaoId,
                alternativaMarcada: data.alternativa,
                correta,
            },
            update: {
                alternativaMarcada: data.alternativa,
                correta,
            },
        });
    }
    async finalizarProva(userId) {
        const inscricao = await this.prisma.inscricao.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        const respostas = await this.prisma.resposta.findMany({
            where: { inscricaoId: inscricao.id, correta: true },
        });
        const totalQuestoes = await this.prisma.resposta.count({
            where: { inscricaoId: inscricao.id },
        });
        const nota = totalQuestoes > 0 ? (respostas.length / totalQuestoes) * 100 : 0;
        return this.prisma.inscricao.update({
            where: { id: inscricao.id },
            data: {
                fase1Nota: Math.round(nota * 100) / 100,
                fase1Fim: new Date(),
            },
        });
    }
    async resumoProva(userId) {
        const inscricao = await this.prisma.inscricao.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        const prova = await this.prisma.prova.findFirst({
            where: { edicaoId: inscricao.edicaoId, fase: 1 },
        });
        const total = prova
            ? await this.prisma.provaQuestao.count({ where: { provaId: prova.id } })
            : 0;
        const [respondidas, corretas] = await Promise.all([
            this.prisma.resposta.count({
                where: { inscricaoId: inscricao.id },
            }),
            this.prisma.resposta.count({
                where: { inscricaoId: inscricao.id, correta: true },
            }),
        ]);
        return {
            inscricaoId: inscricao.id,
            inicio: inscricao.fase1Inicio?.toISOString() || null,
            fim: inscricao.fase1Fim?.toISOString() || null,
            fase1Nota: inscricao.fase1Nota,
            respondidas,
            corretas,
            total,
            percentual: total > 0 ? Math.round((corretas / total) * 100) : 0,
        };
    }
};
ProvaService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ProvaService);
export { ProvaService };
//# sourceMappingURL=prova.service.js.map
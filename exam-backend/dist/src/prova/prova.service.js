var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProvaService_1;
import { Injectable, NotFoundException, BadRequestException, Logger, } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
const DURACAO_PROVA_MINUTOS = 180;
let ProvaService = ProvaService_1 = class ProvaService {
    prisma;
    logger = new Logger(ProvaService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async iniciarProva(userId) {
        const inscricao = await this.prisma.inscricao.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: { id: true, status: true, fase1Inicio: true, fase1Fim: true },
        });
        if (!inscricao || inscricao.status !== "CONFIRMADA") {
            throw new BadRequestException("Inscrição não confirmada para realizar a prova");
        }
        if (inscricao.fase1Fim) {
            throw new BadRequestException("Prova já foi finalizada");
        }
        if (!inscricao.fase1Inicio) {
            const updated = await this.prisma.inscricao.update({
                where: { id: inscricao.id },
                data: { fase1Inicio: new Date() },
            });
            return { message: "Prova iniciada com sucesso", inicio: updated.fase1Inicio };
        }
        return { message: "Prova já em andamento", inicio: inscricao.fase1Inicio };
    }
    async buscarQuestoes(userId) {
        const inscricao = await this.prisma.inscricao.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                status: true,
                fase1Inicio: true,
                fase1Fim: true,
                edicaoId: true,
            },
        });
        if (!inscricao || inscricao.status !== "CONFIRMADA") {
            throw new BadRequestException("Inscrição não confirmada para realizar a prova");
        }
        if (!inscricao.fase1Inicio) {
            throw new BadRequestException("Prova não foi iniciada");
        }
        const fimProva = new Date(inscricao.fase1Inicio.getTime() + DURACAO_PROVA_MINUTOS * 60 * 1000);
        if (new Date() > fimProva || inscricao.fase1Fim) {
            throw new BadRequestException("Tempo de prova esgotado ou já finalizada");
        }
        const prova = await this.prisma.prova.findFirst({
            where: { edicaoId: inscricao.edicaoId, fase: 1 },
            select: { id: true },
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
            select: { questaoId: true, alternativaMarcada: true },
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
            select: { id: true, edicaoId: true, fase1Inicio: true, fase1Fim: true },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        if (inscricao.fase1Fim) {
            throw new BadRequestException("Prova já foi finalizada");
        }
        const questao = await this.prisma.questao.findUnique({
            where: { id: data.questaoId },
            select: { id: true, correta: true },
        });
        if (!questao) {
            throw new NotFoundException("Questão não encontrada");
        }
        const prova = await this.prisma.prova.findFirst({
            where: { edicaoId: inscricao.edicaoId, fase: 1 },
            select: { id: true },
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
            select: {
                id: true,
                edicaoId: true,
                fase1Fim: true,
                fase1Nota: true,
            },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        if (inscricao.fase1Fim) {
            return this.prisma.inscricao.findUnique({ where: { id: inscricao.id } });
        }
        const prova = await this.prisma.prova.findFirst({
            where: { edicaoId: inscricao.edicaoId, fase: 1 },
            select: { id: true },
        });
        const groups = await this.prisma.resposta.groupBy({
            by: ["correta"],
            where: { inscricaoId: inscricao.id },
            _count: { _all: true },
        });
        let corretas = 0;
        for (const g of groups) {
            if (g.correta)
                corretas = g._count._all;
        }
        let totalQuestoes = 0;
        if (prova) {
            totalQuestoes = await this.prisma.provaQuestao.count({
                where: { provaId: prova.id },
            });
        }
        const nota = totalQuestoes > 0 ? (corretas / totalQuestoes) * 100 : 0;
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
            select: {
                id: true,
                edicaoId: true,
                fase1Inicio: true,
                fase1Fim: true,
                fase1Nota: true,
            },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        const prova = await this.prisma.prova.findFirst({
            where: { edicaoId: inscricao.edicaoId, fase: 1 },
            select: { id: true },
        });
        let total = 0;
        if (prova) {
            total = await this.prisma.provaQuestao.count({ where: { provaId: prova.id } });
        }
        const groups = await this.prisma.resposta.groupBy({
            by: ["correta"],
            where: { inscricaoId: inscricao.id },
            _count: { _all: true },
        });
        let respondidas = 0;
        let corretas = 0;
        for (const g of groups) {
            respondidas += g._count._all;
            if (g.correta)
                corretas = g._count._all;
        }
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
    async obterMonitoramento() {
        const emAndamento = await this.prisma.inscricao.count({
            where: {
                fase1Inicio: { not: null },
                fase1Fim: null,
            },
        });
        const finalizadas = await this.prisma.inscricao.count({
            where: {
                fase1Fim: { not: null },
            },
        });
        const mediaNota = await this.prisma.inscricao.aggregate({
            where: { fase1Nota: { not: null } },
            _avg: { fase1Nota: true },
        });
        return {
            emAndamento,
            finalizadas,
            totalAtivos: emAndamento + finalizadas,
            mediaNotaFase1: mediaNota._avg.fase1Nota ? Math.round(mediaNota._avg.fase1Nota * 100) / 100 : 0,
        };
    }
};
ProvaService = ProvaService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ProvaService);
export { ProvaService };
//# sourceMappingURL=prova.service.js.map
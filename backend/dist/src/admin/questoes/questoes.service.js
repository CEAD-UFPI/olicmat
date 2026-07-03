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
import { AuditoriaService } from "../auditoria/auditoria.service.js";
let QuestoesService = class QuestoesService {
    prisma;
    auditoria;
    constructor(prisma, auditoria) {
        this.prisma = prisma;
        this.auditoria = auditoria;
    }
    async addToExam(provaId, data, userId) {
        const prova = await this.prisma.prova.findUnique({
            where: { id: provaId },
        });
        if (!prova) {
            throw new NotFoundException("Prova não encontrada");
        }
        if (prova.status !== "RASCUNHO") {
            throw new BadRequestException("Só é possível adicionar questões a provas em rascunho");
        }
        const questao = await this.prisma.questao.create({
            data: {
                enunciado: data.enunciado,
                alternativaA: data.alternativaA,
                alternativaB: data.alternativaB,
                alternativaC: data.alternativaC,
                alternativaD: data.alternativaD,
                alternativaE: data.alternativaE,
                correta: data.correta,
                eixo: data.eixo,
                dificuldade: data.dificuldade,
            },
        });
        const maxOrdem = await this.prisma.provaQuestao.aggregate({
            where: { provaId },
            _max: { ordem: true },
        });
        const ordem = data.ordem ?? (maxOrdem._max.ordem ?? 0) + 1;
        await this.prisma.provaQuestao.create({
            data: { provaId, questaoId: questao.id, ordem },
        });
        if (userId) {
            await this.auditoria.log(userId, "CRIAR_QUESTAO", "Questao", questao.id, {
                provaId,
                eixo: data.eixo,
            });
        }
        return questao;
    }
    async linkToExam(provaId, data, userId) {
        const prova = await this.prisma.prova.findUnique({
            where: { id: provaId },
        });
        if (!prova) {
            throw new NotFoundException("Prova não encontrada");
        }
        if (prova.status !== "RASCUNHO") {
            throw new BadRequestException("Só é possível adicionar questões a provas em rascunho");
        }
        const questao = await this.prisma.questao.findUnique({
            where: { id: data.questaoId },
        });
        if (!questao) {
            throw new NotFoundException("Questão não encontrada");
        }
        const existing = await this.prisma.provaQuestao.findUnique({
            where: {
                provaId_questaoId: { provaId, questaoId: data.questaoId },
            },
        });
        if (existing) {
            throw new BadRequestException("Questão já está vinculada a esta prova");
        }
        const maxOrdem = await this.prisma.provaQuestao.aggregate({
            where: { provaId },
            _max: { ordem: true },
        });
        const ordem = data.ordem ?? (maxOrdem._max.ordem ?? 0) + 1;
        await this.prisma.provaQuestao.create({
            data: { provaId, questaoId: data.questaoId, ordem },
        });
        if (userId) {
            await this.auditoria.log(userId, "VINCULAR_QUESTAO", "ProvaQuestao", `${provaId}_${data.questaoId}`);
        }
        return questao;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.eixo)
            where.eixo = filters.eixo;
        if (filters?.dificuldade)
            where.dificuldade = filters.dificuldade;
        return this.prisma.questao.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
    }
    async findExamQuestions(provaId) {
        const prova = await this.prisma.prova.findUnique({
            where: { id: provaId },
        });
        if (!prova) {
            throw new NotFoundException("Prova não encontrada");
        }
        return this.prisma.provaQuestao.findMany({
            where: { provaId },
            include: { questao: true },
            orderBy: { ordem: "asc" },
        });
    }
    async update(id, data, userId) {
        const questao = await this.prisma.questao.findUnique({
            where: { id },
        });
        if (!questao) {
            throw new NotFoundException("Questão não encontrada");
        }
        const vinculadas = await this.prisma.provaQuestao.findMany({
            where: { questaoId: id },
            include: { prova: true },
        });
        const temProvaPublicada = vinculadas.some((v) => v.prova.status !== "RASCUNHO");
        if (temProvaPublicada) {
            throw new BadRequestException("Não é possível editar questão vinculada a uma prova publicada");
        }
        const result = await this.prisma.questao.update({
            where: { id },
            data,
        });
        if (userId) {
            await this.auditoria.log(userId, "ATUALIZAR_QUESTAO", "Questao", id, data);
        }
        return result;
    }
    async remove(id, userId) {
        const questao = await this.prisma.questao.findUnique({
            where: { id },
        });
        if (!questao) {
            throw new NotFoundException("Questão não encontrada");
        }
        const vinculadas = await this.prisma.provaQuestao.findMany({
            where: { questaoId: id },
            include: { prova: true },
        });
        const temProvaPublicada = vinculadas.some((v) => v.prova.status !== "RASCUNHO");
        if (temProvaPublicada) {
            throw new BadRequestException("Não é possível remover questão vinculada a uma prova publicada");
        }
        await this.prisma.provaQuestao.deleteMany({
            where: { questaoId: id },
        });
        await this.prisma.questao.delete({
            where: { id },
        });
        if (userId) {
            await this.auditoria.log(userId, "DELETAR_QUESTAO", "Questao", id);
        }
        return { deleted: true };
    }
};
QuestoesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AuditoriaService])
], QuestoesService);
export { QuestoesService };
//# sourceMappingURL=questoes.service.js.map
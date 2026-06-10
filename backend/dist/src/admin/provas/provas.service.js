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
let ProvasService = class ProvasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        return this.prisma.prova.create({
            data: {
                edicaoId: data.edicaoId,
                fase: data.fase,
                titulo: data.titulo,
                duracaoMinutos: data.duracaoMinutos,
                janelaInicio: data.janelaInicio ? new Date(data.janelaInicio) : undefined,
                janelaFim: data.janelaFim ? new Date(data.janelaFim) : undefined,
                status: "RASCUNHO",
                createdBy: userId,
            },
        });
    }
    async findAll(edicaoId) {
        const where = edicaoId ? { edicaoId } : {};
        return this.prisma.prova.findMany({
            where,
            include: {
                edicao: { select: { id: true, ano: true, titulo: true } },
                _count: { select: { questoes: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findById(id) {
        const prova = await this.prisma.prova.findUnique({
            where: { id },
            include: {
                edicao: { select: { id: true, ano: true, titulo: true } },
                questoes: {
                    include: {
                        questao: true,
                    },
                    orderBy: { ordem: "asc" },
                },
            },
        });
        if (!prova) {
            throw new NotFoundException("Prova não encontrada");
        }
        return prova;
    }
    async update(id, data) {
        await this.findById(id);
        return this.prisma.prova.update({
            where: { id },
            data: {
                ...(data.titulo && { titulo: data.titulo }),
                ...(data.duracaoMinutos !== undefined && { duracaoMinutos: data.duracaoMinutos }),
                ...(data.janelaInicio && { janelaInicio: new Date(data.janelaInicio) }),
                ...(data.janelaFim && { janelaFim: new Date(data.janelaFim) }),
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.provaQuestao.deleteMany({
            where: { provaId: id },
        });
        await this.prisma.prova.delete({
            where: { id },
        });
        return { deleted: true };
    }
    async publicar(id) {
        await this.findById(id);
        const questaoCount = await this.prisma.provaQuestao.count({
            where: { provaId: id },
        });
        if (questaoCount === 0) {
            throw new BadRequestException("Não é possível publicar uma prova sem questões");
        }
        return this.prisma.prova.update({
            where: { id },
            data: { status: "PUBLICADA" },
        });
    }
    async duplicar(id, userId) {
        const prova = await this.findById(id);
        const novaProva = await this.prisma.prova.create({
            data: {
                edicaoId: prova.edicaoId,
                fase: prova.fase,
                titulo: `${prova.titulo} (cópia)`,
                duracaoMinutos: prova.duracaoMinutos,
                janelaInicio: prova.janelaInicio,
                janelaFim: prova.janelaFim,
                status: "RASCUNHO",
                createdBy: userId,
            },
        });
        if (prova.questoes.length > 0) {
            await this.prisma.provaQuestao.createMany({
                data: prova.questoes.map((pq) => ({
                    provaId: novaProva.id,
                    questaoId: pq.questaoId,
                    ordem: pq.ordem,
                })),
            });
        }
        return this.findById(novaProva.id);
    }
};
ProvasService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ProvasService);
export { ProvasService };
//# sourceMappingURL=provas.service.js.map
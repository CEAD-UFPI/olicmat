var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
let ModuloService = class ModuloService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listarTodos() {
        return this.prisma.modulo.findMany({
            orderBy: { ordem: "asc" },
            select: {
                id: true,
                titulo: true,
                descricao: true,
                ordem: true,
                cargaHoraria: true,
            },
        });
    }
    async buscarPorId(id, userId) {
        const modulo = await this.prisma.modulo.findUnique({
            where: { id },
            include: {
                progressos: {
                    where: { userId },
                    select: { concluido: true, nota: true },
                },
            },
        });
        if (!modulo) {
            throw new NotFoundException("Módulo não encontrado");
        }
        return {
            ...modulo,
            progresso: modulo.progressos[0] || null,
            progressos: undefined,
        };
    }
    async concluirModulo(userId, moduloId, nota) {
        return this.prisma.progressoCurso.upsert({
            where: {
                userId_moduloId: { userId, moduloId },
            },
            create: {
                userId,
                moduloId,
                concluido: true,
                nota,
            },
            update: {
                concluido: true,
                nota: nota ?? undefined,
            },
        });
    }
    async progressoGeral(userId) {
        const modulos = await this.prisma.modulo.count();
        const concluidos = await this.prisma.progressoCurso.count({
            where: { userId, concluido: true },
        });
        const cargaTotal = await this.prisma.modulo.aggregate({
            _sum: { cargaHoraria: true },
        });
        const cargaConcluida = await this.prisma.progressoCurso.findMany({
            where: { userId, concluido: true },
            include: { modulo: { select: { cargaHoraria: true } } },
        });
        const horasConcluidas = cargaConcluida.reduce((acc, p) => acc + p.modulo.cargaHoraria, 0);
        return {
            totalModulos: modulos,
            concluidos,
            percentual: modulos > 0 ? Math.round((concluidos / modulos) * 100) : 0,
            cargaHorariaTotal: cargaTotal._sum.cargaHoraria || 0,
            cargaHorariaConcluida: horasConcluidas,
        };
    }
};
ModuloService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ModuloService);
export { ModuloService };
//# sourceMappingURL=modulo.service.js.map
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
let CursosService = class CursosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(instituicaoId) {
        const where = {};
        if (instituicaoId)
            where.instituicaoId = instituicaoId;
        return this.prisma.curso.findMany({
            where,
            include: {
                instituicao: { select: { id: true, nome: true, sigla: true } },
                _count: { select: { usuarios: true, inscricoes: true } },
            },
            orderBy: { nome: "asc" },
        });
    }
    async findById(id) {
        const curso = await this.prisma.curso.findUnique({
            where: { id },
            include: {
                instituicao: { select: { id: true, nome: true, sigla: true } },
                _count: { select: { usuarios: true, inscricoes: true } },
            },
        });
        if (!curso) {
            throw new NotFoundException("Curso não encontrado");
        }
        return curso;
    }
    async create(data) {
        return this.prisma.curso.create({
            data: {
                nome: data.nome,
                instituicaoId: data.instituicaoId,
            },
            include: {
                instituicao: { select: { id: true, nome: true, sigla: true } },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        return this.prisma.curso.update({
            where: { id },
            data,
            include: {
                instituicao: { select: { id: true, nome: true, sigla: true } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.curso.delete({ where: { id } });
        return { deleted: true };
    }
};
CursosService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CursosService);
export { CursosService };
//# sourceMappingURL=cursos.service.js.map
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
import { PrismaService } from "../prisma.service.js";
let InstituicoesService = class InstituicoesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.instituicao.findMany({
            include: {
                cursos: {
                    select: { id: true, nome: true },
                },
            },
            orderBy: { nome: "asc" },
        });
    }
    async findById(id) {
        const instituicao = await this.prisma.instituicao.findUnique({
            where: { id },
            include: {
                cursos: {
                    select: { id: true, nome: true },
                },
            },
        });
        if (!instituicao) {
            throw new NotFoundException("Instituição não encontrada");
        }
        return instituicao;
    }
    async create(data) {
        return this.prisma.instituicao.create({
            data: {
                nome: data.nome,
                sigla: data.sigla.toUpperCase(),
                estado: data.estado?.toUpperCase() ?? "",
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.nome)
            updateData.nome = data.nome;
        if (data.sigla)
            updateData.sigla = data.sigla.toUpperCase();
        if (data.estado)
            updateData.estado = data.estado.toUpperCase();
        return this.prisma.instituicao.update({
            where: { id },
            data: updateData,
        });
    }
};
InstituicoesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], InstituicoesService);
export { InstituicoesService };
//# sourceMappingURL=instituicoes.service.js.map
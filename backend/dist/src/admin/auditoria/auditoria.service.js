var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
let AuditoriaService = class AuditoriaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.entidade)
            where.entidade = filters.entidade;
        if (filters?.acao)
            where.acao = filters.acao;
        if (filters?.actorId)
            where.actorId = filters.actorId;
        if (filters?.dataInicio || filters?.dataFim) {
            const createdAt = {};
            if (filters.dataInicio)
                createdAt.gte = new Date(filters.dataInicio);
            if (filters.dataFim) {
                const fim = new Date(filters.dataFim);
                fim.setHours(23, 59, 59, 999);
                createdAt.lte = fim;
            }
            where.createdAt = createdAt;
        }
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 20;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                include: {
                    actor: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async exportCsv(filters) {
        const where = {};
        if (filters?.entidade)
            where.entidade = filters.entidade;
        if (filters?.acao)
            where.acao = filters.acao;
        if (filters?.dataInicio || filters?.dataFim) {
            const createdAt = {};
            if (filters.dataInicio)
                createdAt.gte = new Date(filters.dataInicio);
            if (filters.dataFim) {
                const fim = new Date(filters.dataFim);
                fim.setHours(23, 59, 59, 999);
                createdAt.lte = fim;
            }
            where.createdAt = createdAt;
        }
        const logs = await this.prisma.auditLog.findMany({
            where,
            include: {
                actor: { select: { nome: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        const header = "id,entidade,acao,payload,usuario,email,data\n";
        const rows = logs
            .map((log) => [
            log.id,
            log.entidade,
            log.acao,
            `"${(log.payload ?? "").replace(/"/g, '""')}"`,
            log.actor.nome,
            log.actor.email,
            log.createdAt.toISOString(),
        ].join(","))
            .join("\n");
        return header + rows;
    }
};
AuditoriaService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AuditoriaService);
export { AuditoriaService };
//# sourceMappingURL=auditoria.service.js.map
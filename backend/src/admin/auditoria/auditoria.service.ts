import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    entidade?: string;
    acao?: string;
    actorId?: string;
    dataInicio?: string;
    dataFim?: string;
    page?: number;
    limit?: number;
  }) {
    const where: Record<string, unknown> = {};
    if (filters?.entidade) where.entidade = filters.entidade;
    if (filters?.acao) where.acao = filters.acao;
    if (filters?.actorId) where.actorId = filters.actorId;

    if (filters?.dataInicio || filters?.dataFim) {
      const createdAt: Record<string, Date> = {};
      if (filters.dataInicio) createdAt.gte = new Date(filters.dataInicio);
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

  async exportCsv(filters?: {
    entidade?: string;
    acao?: string;
    dataInicio?: string;
    dataFim?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (filters?.entidade) where.entidade = filters.entidade;
    if (filters?.acao) where.acao = filters.acao;

    if (filters?.dataInicio || filters?.dataFim) {
      const createdAt: Record<string, Date> = {};
      if (filters.dataInicio) createdAt.gte = new Date(filters.dataInicio);
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
      .map((log) =>
        [
          log.id,
          log.entidade,
          log.acao,
          `"${(log.payload as string ?? "").replace(/"/g, '""')}"`,
          log.actor.nome,
          log.actor.email,
          log.createdAt.toISOString(),
        ].join(",")
      )
      .join("\n");

    return header + rows;
  }
}

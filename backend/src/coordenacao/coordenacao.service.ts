import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";

@Injectable()
export class CoordenacaoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns the course IDs the coordinator is responsible for.
   */
  private async getCoordenadorCursos(coordenadorId: string) {
    const cursos = await this.prisma.coordenadorCurso.findMany({
      where: { userId: coordenadorId },
      select: { cursoId: true },
    });

    return cursos.map((c) => c.cursoId);
  }

  async listAlunos(coordenadorId: string) {
    const cursosIds = await this.getCoordenadorCursos(coordenadorId);

    if (cursosIds.length === 0) {
      throw new ForbiddenException("Você não coordena nenhum curso");
    }

    return this.prisma.user.findMany({
      where: {
        role: "ALUNO",
        cursoId: { in: cursosIds },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        matricula: true,
        curso: { select: { id: true, nome: true } },
        instituicao: { select: { id: true, nome: true, sigla: true } },
        createdAt: true,
      },
      orderBy: { nome: "asc" },
    });
  }

  async listInscricoes(coordenadorId: string, filters?: {
    cursoId?: string;
    status?: string;
  }) {
    const cursosIds = await this.getCoordenadorCursos(coordenadorId);

    if (cursosIds.length === 0) {
      throw new ForbiddenException("Você não coordena nenhum curso");
    }

    // If filtering by a specific course, verify the coordinator has access
    if (filters?.cursoId && !cursosIds.includes(filters.cursoId)) {
      throw new ForbiddenException("Você não coordena este curso");
    }

    const where: Record<string, unknown> = {
      cursoId: filters?.cursoId
        ? filters.cursoId
        : { in: cursosIds },
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.inscricao.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            matricula: true,
          },
        },
        instituicao: { select: { id: true, nome: true, sigla: true } },
        curso: { select: { id: true, nome: true } },
        edicao: { select: { id: true, ano: true, titulo: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getMetricas(coordenadorId: string) {
    const cursosIds = await this.getCoordenadorCursos(coordenadorId);

    if (cursosIds.length === 0) {
      throw new ForbiddenException("Você não coordena nenhum curso");
    }

    const [porStatus, porCurso, total] = await Promise.all([
      this.prisma.inscricao.groupBy({
        by: ["status"],
        where: { cursoId: { in: cursosIds } },
        _count: { id: true },
      }),
      this.prisma.inscricao.groupBy({
        by: ["cursoId"],
        where: { cursoId: { in: cursosIds } },
        _count: { id: true },
      }),
      this.prisma.inscricao.count({
        where: { cursoId: { in: cursosIds } },
      }),
    ]);

    // Resolve course names
    const cursos = await this.prisma.curso.findMany({
      where: { id: { in: cursosIds } },
      select: { id: true, nome: true },
    });

    const cursoMap = new Map(cursos.map((c) => [c.id, c]));

    return {
      total,
      porStatus: porStatus.map((s) => ({
        status: s.status,
        count: s._count.id,
      })),
      porCurso: porCurso.map((c) => ({
        cursoId: c.cursoId,
        nome: cursoMap.get(c.cursoId)?.nome ?? "Desconhecido",
        count: c._count.id,
      })),
    };
  }
}

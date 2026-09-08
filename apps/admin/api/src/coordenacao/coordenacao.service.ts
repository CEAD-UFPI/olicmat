import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import type { PaginationParams } from "../common/pagination.js";
import { getSkipTake, paginate } from "../common/pagination.js";

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

  async listCursos(coordenadorId: string) {
    const coordCursos = await this.prisma.coordenadorCurso.findMany({
      where: { userId: coordenadorId },
      include: {
        curso: {
          select: {
            id: true,
            nome: true,
            instituicaoId: true,
            instituicao: {
              select: {
                id: true,
                nome: true,
                sigla: true,
              },
            },
          },
        },
      },
    });
    return coordCursos.map((cc) => cc.curso);
  }

  async listAlunos(coordenadorId: string, params?: PaginationParams) {
    const cursosIds = await this.getCoordenadorCursos(coordenadorId);

    if (cursosIds.length === 0) {
      throw new ForbiddenException("Você não coordena nenhum curso");
    }

    const where = {
      role: "ALUNO" as const,
      cursoId: { in: cursosIds },
    };
    const select = {
      id: true,
      nome: true,
      email: true,
      matricula: true,
      curso: { select: { id: true, nome: true } },
      instituicao: { select: { id: true, nome: true, sigla: true } },
      createdAt: true,
    };
    const orderBy = { nome: "asc" as const };

    if (params?.page === undefined && params?.limit === undefined) {
      return this.prisma.user.findMany({ where, select, orderBy });
    }

    const { skip, take } = getSkipTake(params);
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, select, orderBy, skip, take }),
      this.prisma.user.count({ where }),
    ]);

    return paginate(data, total, params);
  }

  async listInscricoes(
    coordenadorId: string,
    filters?: {
      cursoId?: string;
      status?: string;
    },
    params?: PaginationParams
  ) {
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

    const include = {
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
    };
    const orderBy = { createdAt: "desc" as const };

    if (params?.page === undefined && params?.limit === undefined) {
      return this.prisma.inscricao.findMany({ where, include, orderBy });
    }

    const { skip, take } = getSkipTake(params);
    const [data, total] = await Promise.all([
      this.prisma.inscricao.findMany({ where, include, orderBy, skip, take }),
      this.prisma.inscricao.count({ where }),
    ]);

    return paginate(data, total, params);
  }

  async listMonitoramentoInscricoes(coordenadorId: string) {
    const cursosIds = await this.getCoordenadorCursos(coordenadorId);

    if (cursosIds.length === 0) {
      throw new ForbiddenException("Você não coordena nenhum curso");
    }

    const [alunos, inscricoes] = await Promise.all([
      this.prisma.user.findMany({
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
          createdAt: true,
        },
        orderBy: { nome: "asc" },
      }),
      this.prisma.inscricao.findMany({
        where: { cursoId: { in: cursosIds } },
        include: {
          edicao: { select: { id: true, ano: true, titulo: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Keep the most recent inscription per student.
    const inscricaoByUser = new Map<string, (typeof inscricoes)[number]>();
    for (const inscricao of inscricoes) {
      if (!inscricaoByUser.has(inscricao.userId)) {
        inscricaoByUser.set(inscricao.userId, inscricao);
      }
    }

    const inscritos = alunos
      .filter((aluno) => inscricaoByUser.has(aluno.id))
      .map((aluno) => ({ ...aluno, inscricao: inscricaoByUser.get(aluno.id) }));
    const naoInscritos = alunos.filter((aluno) => !inscricaoByUser.has(aluno.id));

    return {
      totalAlunos: alunos.length,
      totalInscritos: inscritos.length,
      totalNaoInscritos: naoInscritos.length,
      inscritos,
      naoInscritos,
    };
  }

  async getMetricas(coordenadorId: string) {
    const cursosIds = await this.getCoordenadorCursos(coordenadorId);

    if (cursosIds.length === 0) {
      throw new ForbiddenException("Você não coordena nenhum curso");
    }

    // A quebra por curso precisa do status junto: a tela de Métricas mostra
    // confirmadas/pendentes/rejeitadas de cada curso, e agrupar só por cursoId
    // devolveria um total sem como reparti-lo.
    const [porStatus, porCursoStatus, total, totalAlunos] = await Promise.all([
      this.prisma.inscricao.groupBy({
        by: ["status"],
        where: { cursoId: { in: cursosIds } },
        _count: { id: true },
      }),
      this.prisma.inscricao.groupBy({
        by: ["cursoId", "status"],
        where: { cursoId: { in: cursosIds } },
        _count: { id: true },
      }),
      this.prisma.inscricao.count({
        where: { cursoId: { in: cursosIds } },
      }),
      // Alunos do curso, inscritos ou não: é esse número que o coordenador
      // compara com o de inscritos para saber quem ainda falta.
      this.prisma.user.count({
        where: { role: "ALUNO", cursoId: { in: cursosIds } },
      }),
    ]);

    const porStatusCurso = new Map<
      string,
      { status: string; _count: { id: number } }[]
    >();
    for (const linha of porCursoStatus) {
      const atual = porStatusCurso.get(linha.cursoId) ?? [];
      atual.push({ status: linha.status, _count: { id: linha._count.id } });
      porStatusCurso.set(linha.cursoId, atual);
    }

    const porCurso = cursosIds.map((cursoId) => ({
      cursoId,
      _count: {
        id: (porStatusCurso.get(cursoId) ?? []).reduce(
          (soma, l) => soma + l._count.id,
          0,
        ),
      },
    }));

    // Resolve course names
    const cursos = await this.prisma.curso.findMany({
      where: { id: { in: cursosIds } },
      select: { id: true, nome: true },
    });

    const cursoMap = new Map(cursos.map((c) => [c.id, c]));

    const contar = (
      linhas: { status: string; _count: { id: number } }[],
      status: string,
    ) => linhas.find((l) => l.status === status)?._count.id ?? 0;

    return {
      totalAlunos,
      totalInscricoes: total,
      confirmadas: contar(porStatus, "CONFIRMADA"),
      pendentes: contar(porStatus, "PENDENTE"),
      rejeitadas: contar(porStatus, "REJEITADA"),
      porCurso: porCurso.map((c) => ({
        cursoId: c.cursoId,
        curso: cursoMap.get(c.cursoId)?.nome ?? "Desconhecido",
        total: c._count.id,
        confirmadas: contar(porStatusCurso.get(c.cursoId) ?? [], "CONFIRMADA"),
        pendentes: contar(porStatusCurso.get(c.cursoId) ?? [], "PENDENTE"),
        rejeitadas: contar(porStatusCurso.get(c.cursoId) ?? [], "REJEITADA"),
      })),
    };
  }
}

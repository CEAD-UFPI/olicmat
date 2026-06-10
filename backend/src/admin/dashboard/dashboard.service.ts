import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const [totalInscricoes, porStatus, porEstado, porInstituicao] =
      await Promise.all([
        this.prisma.inscricao.count(),
        this.prisma.inscricao.groupBy({
          by: ["status"],
          _count: { id: true },
        }),
        this.prisma.inscricao.groupBy({
          by: ["estado"],
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
        }),
        this.prisma.inscricao.groupBy({
          by: ["instituicaoId"],
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
        }),
      ]);

    // Resolve institution names
    const instituicoesIds = porInstituicao.map(
      (i: { instituicaoId: string; _count: { id: number } }) => i.instituicaoId
    );
    const instituicoes = await this.prisma.instituicao.findMany({
      where: { id: { in: instituicoesIds } },
      select: { id: true, nome: true, sigla: true },
    });

    const instituicaoMap = new Map(
      instituicoes.map((inst: { id: string; nome: string; sigla: string }) => [inst.id, inst])
    );

    return {
      totalInscricoes,
      porStatus: porStatus.map(
        (s: { status: string; _count: { id: number } }) => ({
          status: s.status,
          count: s._count.id,
        })
      ),
      porEstado: porEstado.map(
        (e: { estado: string; _count: { id: number } }) => ({
          estado: e.estado,
          count: e._count.id,
        })
      ),
      porInstituicao: porInstituicao.map(
        (i: { instituicaoId: string; _count: { id: number } }) => ({
          instituicaoId: i.instituicaoId,
          nome: instituicaoMap.get(i.instituicaoId)?.nome ?? "Desconhecida",
          sigla: instituicaoMap.get(i.instituicaoId)?.sigla ?? "???",
          count: i._count.id,
        })
      ),
    };
  }

  async getResumo() {
    const [totalUsuarios, totalInscricoes, pendentes] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.inscricao.count(),
      this.prisma.inscricao.count({ where: { status: "PENDENTE" } }),
    ]);
    return { totalUsuarios, totalInscricoes, pendentes };
  }

  async exportInscricoes(filters?: {
    edicaoId?: string;
    estado?: string;
    status?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (filters?.edicaoId) where.edicaoId = filters.edicaoId;
    if (filters?.estado) where.estado = filters.estado.toUpperCase();
    if (filters?.status) where.status = filters.status;

    const inscricoes = await this.prisma.inscricao.findMany({
      where,
      include: {
        user: {
          select: {
            nome: true,
            email: true,
            cpf: true,
            matricula: true,
            dataNascimento: true,
          },
        },
        instituicao: { select: { nome: true, sigla: true } },
        curso: { select: { nome: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const header = [
      "ID",
      "Nome",
      "Email",
      "CPF",
      "Matricula",
      "Data Nascimento",
      "Estado",
      "Municipio",
      "Instituicao",
      "Curso",
      "Periodo",
      "Status",
      "Fase 1 Nota",
      "Nota Final",
      "Medalha",
      "Criado Em",
    ].join(",");

    const rows = inscricoes.map((i) =>
      [
        i.id,
        `"${i.user.nome}"`,
        i.user.email,
        i.user.cpf,
        i.user.matricula,
        i.user.dataNascimento?.toISOString().split("T")[0] ?? "",
        i.estado,
        i.municipio ?? "",
        `"${i.instituicao?.nome ?? ""}"`,
        `"${i.curso?.nome ?? ""}"`,
        i.periodo ?? "",
        i.status,
        i.fase1Nota ?? "",
        i.notaFinal ?? "",
        i.medalha ?? "",
        i.createdAt.toISOString(),
      ].join(",")
    );

    return [header, ...rows].join("\n");
  }

  async exportUsuarios() {
    const users = await this.prisma.user.findMany({
      include: {
        instituicao: { select: { nome: true, sigla: true } },
        curso: { select: { nome: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const header = "ID,Nome,Email,CPF,Role,Matricula,Data Nascimento,Instituicao,Curso,Criado Em\n";
    const rows = users
      .map((u) =>
        [
          u.id,
          `"${u.nome}"`,
          u.email,
          u.cpf,
          u.role,
          u.matricula ?? "",
          u.dataNascimento?.toISOString().split("T")[0] ?? "",
          `"${u.instituicao?.nome ?? ""}"`,
          `"${u.curso?.nome ?? ""}"`,
          u.createdAt.toISOString(),
        ].join(",")
      )
      .join("\n");

    return header + rows;
  }

  async exportProvas() {
    const provas = await this.prisma.prova.findMany({
      include: {
        edicao: { select: { ano: true, titulo: true } },
        _count: { select: { questoes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const header = "ID,Titulo,Edicao,Duracao (min),Questoes,Status,Publicada,Criado Em\n";
    const rows = provas
      .map((p) =>
        [
          p.id,
          `"${p.titulo || ""}"`,
          p.edicao?.ano ?? "",
          p.duracaoMinutos ?? "",
          p._count.questoes,
          p.status,
          p.publicadaEm ? "Sim" : "Nao",
          p.createdAt.toISOString(),
        ].join(",")
      )
      .join("\n");

    return header + rows;
  }

  async exportResultados() {
    const inscricoes = await this.prisma.inscricao.findMany({
      where: { status: "CONFIRMADA" },
      include: {
        user: {
          select: { nome: true, email: true, cpf: true },
        },
        instituicao: { select: { nome: true, sigla: true } },
        curso: { select: { nome: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const header = "ID,Nome,Email,CPF,Estado,Instituicao,Curso,Fase 1 Nota,Fase 2 Tema,Nota Final,Medalha\n";
    const rows = inscricoes
      .map((i) =>
        [
          i.id,
          `"${i.user.nome}"`,
          i.user.email,
          i.user.cpf,
          i.estado,
          `"${i.instituicao?.nome ?? ""}"`,
          `"${i.curso?.nome ?? ""}"`,
          i.fase1Nota ?? "",
          `"${i.fase2Tema ?? ""}"`,
          i.notaFinal ?? "",
          i.medalha ?? "",
        ].join(",")
      )
      .join("\n");

    return header + rows;
  }

  async listEdicoes() {
    return this.prisma.edicao.findMany({
      select: { id: true, ano: true, titulo: true, status: true },
      orderBy: { ano: "desc" },
    });
  }
}

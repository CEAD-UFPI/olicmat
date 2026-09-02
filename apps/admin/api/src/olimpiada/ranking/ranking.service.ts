import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../../admin/auditoria/auditoria.service.js";

type Avaliacoes = { nota: number }[];

interface Notas {
  fase1Nota: number;
  fase2Nota: number;
  notaFinal: number;
}

interface ItemRanking {
  inscricaoId: string;
  nome: string;
  estado: string;
  fase1Nota: number;
  fase2Nota: number;
  notaFinal: number;
  dataNascimento: Date;
}

export interface ItemRankingPublico {
  inscricaoId: string;
  nome: string;
  estado: string;
  fase1Nota: number;
  fase2Nota: number;
  notaFinal: number;
  medalha: "OURO" | "PRATA" | "BRONZE";
}

const DEFAULT_DESEMPATE = ["NOTA_FASE2", "NOTA_FASE1", "IDADE"];

@Injectable()
export class RankingService {
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
  ) {}

  private calcularNotas(
    i: { fase1Nota: number | null; notaFinal: number | null; avaliacoes: Avaliacoes },
    pesoFase1: number,
    pesoFase2: number,
  ): Notas {
    const fase1Nota = i.fase1Nota ?? 0;
    const fase2Nota =
      i.avaliacoes.length > 0
        ? i.avaliacoes.reduce((sum, a) => sum + a.nota, 0) / i.avaliacoes.length
        : 0;
    const notaFinal = i.notaFinal ?? fase1Nota * pesoFase1 + fase2Nota * pesoFase2;
    return { fase1Nota, fase2Nota, notaFinal };
  }

  /**
   * Builds a comparator where the primary criterion is always the final
   * score (descending), followed by the configurable tiebreaker criteria
   * in order: NOTA_FASE2, NOTA_FASE1, IDADE (older wins).
   */
  private tiebreakComparator(desempate: string[]) {
    const criterios = (desempate ?? []).filter((c) => c !== "NOTA_FINAL");
    return (a: ItemRanking, b: ItemRanking): number => {
      if (b.notaFinal !== a.notaFinal) return b.notaFinal - a.notaFinal;
      for (const criterio of criterios) {
        if (criterio === "NOTA_FASE2" && b.fase2Nota !== a.fase2Nota) {
          return b.fase2Nota - a.fase2Nota;
        }
        if (criterio === "NOTA_FASE1" && b.fase1Nota !== a.fase1Nota) {
          return b.fase1Nota - a.fase1Nota;
        }
        if (criterio === "IDADE") {
          return a.dataNascimento.getTime() - b.dataNascimento.getTime();
        }
      }
      return 0;
    };
  }

  private desempate(edicao: { desempate: string[] } | null): string[] {
    return edicao?.desempate?.length ? edicao.desempate : DEFAULT_DESEMPATE;
  }

  async rankingPorEstado(estado?: string, edicaoId?: string) {
    const edicao = edicaoId
      ? await this.prisma.edicao.findUnique({ where: { id: edicaoId } })
      : await this.prisma.edicao.findFirst({ orderBy: { ano: "desc" } });

    const whereClause: Record<string, unknown> = {
      status: "CONFIRMADA",
      fase1Nota: { not: null },
    };
    if (edicao) {
      whereClause.edicaoId = edicao.id;
    }
    if (estado) {
      whereClause.estado = estado.toUpperCase();
    }

    const inscricoes = await this.prisma.inscricao.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            dataNascimento: true,
          },
        },
        avaliacoes: {
          select: { nota: true },
        },
      },
    });

    const pesoFase1 = edicao?.pesoFase1 ?? 0.5;
    const pesoFase2 = edicao?.pesoFase2 ?? 0.5;

    const ordenado = inscricoes
      .map((i): ItemRanking => {
        const { fase1Nota, fase2Nota, notaFinal } = this.calcularNotas(
          i,
          pesoFase1,
          pesoFase2,
        );
        return {
          inscricaoId: i.id,
          nome: i.user.nome,
          estado: i.estado,
          fase1Nota,
          fase2Nota,
          notaFinal,
          dataNascimento: i.user.dataNascimento,
        };
      })
      .sort(this.tiebreakComparator(this.desempate(edicao)));

    const porEstado = new Map<string, ItemRanking[]>();
    for (const item of ordenado) {
      const items = porEstado.get(item.estado) || [];
      items.push(item);
      porEstado.set(item.estado, items);
    }

    const resultado: Record<string, Record<"OURO" | "PRATA" | "BRONZE", ItemRankingPublico[]>> = {};

    for (const [uf, items] of porEstado) {
      const total = items.length;
      const ouroCount = Math.max(1, Math.floor(total * 0.05));
      const prataCount = Math.max(1, Math.floor(total * 0.10));
      const bronzeCount = Math.max(1, Math.floor(total * 0.15));

      resultado[uf] = {
        OURO: items.slice(0, ouroCount).map((it) => this.toItemPublico(it, "OURO")),
        PRATA: items
          .slice(ouroCount, ouroCount + prataCount)
          .map((it) => this.toItemPublico(it, "PRATA")),
        BRONZE: items
          .slice(ouroCount + prataCount, ouroCount + prataCount + bronzeCount)
          .map((it) => this.toItemPublico(it, "BRONZE")),
      };
    }

    return estado ? resultado[estado.toUpperCase()] || { OURO: [], PRATA: [], BRONZE: [] } : resultado;
  }

  private toItemPublico(
    item: ItemRanking,
    medalha: "OURO" | "PRATA" | "BRONZE",
  ): ItemRankingPublico {
    return {
      inscricaoId: item.inscricaoId,
      nome: item.nome,
      estado: item.estado,
      fase1Nota: item.fase1Nota,
      fase2Nota: item.fase2Nota,
      notaFinal: item.notaFinal,
      medalha,
    };
  }

  async atualizarMedalhas(actorId?: string) {
    const ranking = await this.rankingPorEstado();

    type ItemMedalha = { inscricaoId: string; notaFinal: number };

    const updates: Array<{ inscricaoId: string; medalha: string; notaFinal: number }> = [];

    for (const medalhas of Object.values(ranking)) {
      for (const [medalha, items] of Object.entries(medalhas) as [string, ItemMedalha[]][]) {
        for (const item of items) {
          updates.push({
            inscricaoId: item.inscricaoId,
            medalha,
            notaFinal: item.notaFinal,
          });
        }
      }
    }

    await this.prisma.$transaction(
      updates.map((u) =>
        this.prisma.inscricao.update({
          where: { id: u.inscricaoId },
          data: {
            medalha: u.medalha as "OURO" | "PRATA" | "BRONZE",
            notaFinal: u.notaFinal,
          },
        }),
      ),
    );

    if (actorId) {
      await this.auditoria.log(actorId, "ATUALIZAR_MEDALHAS", "Ranking", "all", {
        totalAtualizados: updates.length,
      });
    }

    return { atualizado: true, total: updates.length };
  }

  async rankingPorInstituicao() {
    const edicao = await this.prisma.edicao.findFirst({
      orderBy: { ano: "desc" },
    });

    const whereClause: Record<string, unknown> = {
      status: "CONFIRMADA",
      fase1Nota: { not: null },
    };
    if (edicao) {
      whereClause.edicaoId = edicao.id;
    }

    const inscricoes = await this.prisma.inscricao.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            nome: true,
            dataNascimento: true,
          },
        },
        instituicao: {
          select: {
            id: true,
            nome: true,
            sigla: true,
          },
        },
        curso: {
          select: {
            id: true,
            nome: true,
          },
        },
        avaliacoes: {
          select: { nota: true },
        },
      },
    });

    const pesoFase1 = edicao?.pesoFase1 ?? 0.5;
    const pesoFase2 = edicao?.pesoFase2 ?? 0.5;

    const porInstituicao = new Map<string, {
      instituicao: { id: string; nome: string; sigla: string };
      totalAlunos: number;
      medalhas: { OURO: number; PRATA: number; BRONZE: number };
      mediaGeral: number;
      alunos: Array<{
        nome: string;
        curso: string | null;
        fase1Nota: number;
        fase2Nota: number;
        notaFinal: number;
        medalha: string | null;
      }>;
    }>();

    for (const i of inscricoes) {
      if (!i.instituicao) continue;

      const instId = i.instituicao.id;
      if (!porInstituicao.has(instId)) {
        porInstituicao.set(instId, {
          instituicao: i.instituicao,
          totalAlunos: 0,
          medalhas: { OURO: 0, PRATA: 0, BRONZE: 0 },
          mediaGeral: 0,
          alunos: [],
        });
      }

      const grupo = porInstituicao.get(instId)!;
      const { fase1Nota, fase2Nota, notaFinal } = this.calcularNotas(i, pesoFase1, pesoFase2);

      grupo.totalAlunos++;
      grupo.mediaGeral += notaFinal;

      if (i.medalha) {
        grupo.medalhas[i.medalha as "OURO" | "PRATA" | "BRONZE"]++;
      }

      grupo.alunos.push({
        nome: i.user.nome,
        curso: i.curso?.nome ?? null,
        fase1Nota,
        fase2Nota,
        notaFinal,
        medalha: i.medalha,
      });
    }

    const resultado = Array.from(porInstituicao.values()).map((g) => ({
      ...g,
      mediaGeral: g.totalAlunos > 0 ? g.mediaGeral / g.totalAlunos : 0,
      alunos: g.alunos.sort((a, b) => b.notaFinal - a.notaFinal),
    })).sort((a, b) => {
      if (b.medalhas.OURO !== a.medalhas.OURO) return b.medalhas.OURO - a.medalhas.OURO;
      if (b.medalhas.PRATA !== a.medalhas.PRATA) return b.medalhas.PRATA - a.medalhas.PRATA;
      if (b.medalhas.BRONZE !== a.medalhas.BRONZE) return b.medalhas.BRONZE - a.medalhas.BRONZE;
      return b.mediaGeral - a.mediaGeral;
    });

    return resultado;
  }

  async rankingPorCurso(cursoId?: string) {
    const edicao = await this.prisma.edicao.findFirst({
      orderBy: { ano: "desc" },
    });

    const whereClause: Record<string, unknown> = {
      status: "CONFIRMADA",
      fase1Nota: { not: null },
    };
    if (edicao) {
      whereClause.edicaoId = edicao.id;
    }
    if (cursoId) {
      whereClause.cursoId = cursoId;
    }

    const inscricoes = await this.prisma.inscricao.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            nome: true,
            dataNascimento: true,
          },
        },
        curso: {
          select: {
            id: true,
            nome: true,
            instituicao: { select: { sigla: true } },
          },
        },
        avaliacoes: {
          select: { nota: true },
        },
      },
    });

    const pesoFase1 = edicao?.pesoFase1 ?? 0.5;
    const pesoFase2 = edicao?.pesoFase2 ?? 0.5;

    const porCurso = new Map<string, {
      curso: { id: string; nome: string; instituicaoSigla: string | null };
      totalAlunos: number;
      medalhas: { OURO: number; PRATA: number; BRONZE: number };
      mediaGeral: number;
      alunos: Array<{
        nome: string;
        fase1Nota: number;
        fase2Nota: number;
        notaFinal: number;
        medalha: string | null;
      }>;
    }>();

    for (const i of inscricoes) {
      if (!i.curso) continue;

      const cursoIdAtual = i.curso.id;
      if (!porCurso.has(cursoIdAtual)) {
        porCurso.set(cursoIdAtual, {
          curso: {
            id: i.curso.id,
            nome: i.curso.nome,
            instituicaoSigla: i.curso.instituicao?.sigla ?? null,
          },
          totalAlunos: 0,
          medalhas: { OURO: 0, PRATA: 0, BRONZE: 0 },
          mediaGeral: 0,
          alunos: [],
        });
      }

      const grupo = porCurso.get(cursoIdAtual)!;
      const { fase1Nota, fase2Nota, notaFinal } = this.calcularNotas(i, pesoFase1, pesoFase2);

      grupo.totalAlunos++;
      grupo.mediaGeral += notaFinal;

      if (i.medalha) {
        grupo.medalhas[i.medalha as "OURO" | "PRATA" | "BRONZE"]++;
      }

      grupo.alunos.push({
        nome: i.user.nome,
        fase1Nota,
        fase2Nota,
        notaFinal,
        medalha: i.medalha,
      });
    }

    return Array.from(porCurso.values()).map((g) => ({
      ...g,
      mediaGeral: g.totalAlunos > 0 ? g.mediaGeral / g.totalAlunos : 0,
      alunos: g.alunos.sort((a, b) => b.notaFinal - a.notaFinal),
    })).sort((a, b) => {
      if (b.medalhas.OURO !== a.medalhas.OURO) return b.medalhas.OURO - a.medalhas.OURO;
      if (b.medalhas.PRATA !== a.medalhas.PRATA) return b.medalhas.PRATA - a.medalhas.PRATA;
      if (b.medalhas.BRONZE !== a.medalhas.BRONZE) return b.medalhas.BRONZE - a.medalhas.BRONZE;
      return b.mediaGeral - a.mediaGeral;
    });
  }

  async publicarRanking(edicaoId: string | undefined, actorId?: string) {
    const edicao = edicaoId
      ? await this.prisma.edicao.findUnique({ where: { id: edicaoId } })
      : await this.prisma.edicao.findFirst({ orderBy: { ano: "desc" } });
    if (!edicao) {
      throw new NotFoundException("Edição não encontrada");
    }

    const ranking = await this.rankingPorEstado(undefined, edicao.id);

    const snapshot = await this.prisma.rankingSnapshot.create({
      data: {
        edicaoId: edicao.id,
        dados: ranking as unknown as object,
        publicadoEm: new Date(),
      },
    });

    if (actorId) {
      await this.auditoria.log(actorId, "PUBLICAR_RANKING", "RankingSnapshot", snapshot.id, {
        edicaoId: edicao.id,
      });
    }

    return snapshot;
  }

  async getRankingPublicado(edicaoId: string) {
    const snapshot = await this.prisma.rankingSnapshot.findFirst({
      where: { edicaoId },
      orderBy: { publicadoEm: "desc" },
    });
    return snapshot ?? null;
  }

  /**
   * Public entrypoint for the published ranking. Reads the latest snapshot
   * for the current edition (controlled publication) instead of live-computing,
   * so results only become visible after an ADMIN publishes them.
   */
  async rankingPublicado(estado?: string) {
    const vazio = { OURO: [], PRATA: [], BRONZE: [] };
    const edicao = await this.prisma.edicao.findFirst({ orderBy: { ano: "desc" } });

    if (!edicao) {
      return estado ? vazio : {};
    }

    const snapshot = await this.prisma.rankingSnapshot.findFirst({
      where: { edicaoId: edicao.id },
      orderBy: { publicadoEm: "desc" },
    });

    if (!snapshot) {
      return estado ? vazio : {};
    }

    const dados = snapshot.dados as unknown as Record<
      string,
      Record<"OURO" | "PRATA" | "BRONZE", ItemRankingPublico[]>
    >;

    if (estado) {
      return dados[estado.toUpperCase()] ?? vazio;
    }

    return dados;
  }
}

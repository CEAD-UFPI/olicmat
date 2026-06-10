import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  async rankingPorEstado(estado?: string) {
    // Find the most recent active edition
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
      .map((i) => {
        const fase1Nota = i.fase1Nota || 0;
        const fase2Nota =
          i.avaliacoes.length > 0
            ? i.avaliacoes.reduce((sum, a) => sum + a.nota, 0) / i.avaliacoes.length
            : 0;
        const notaFinal =
          i.notaFinal || fase1Nota * pesoFase1 + fase2Nota * pesoFase2;

        return {
          inscricaoId: i.id,
          nome: i.user.nome,
          estado: i.estado,
          fase1Nota,
          fase2Nota,
          notaFinal,
          dataNascimento: i.user.dataNascimento,
          medalha: i.medalha,
        };
      })
      .sort((a, b) => {
        // Desempate: nota final > fase2 > fase1 > idade (mais velho)
        if (b.notaFinal !== a.notaFinal) return b.notaFinal - a.notaFinal;
        if (b.fase2Nota !== a.fase2Nota) return b.fase2Nota - a.fase2Nota;
        if (b.fase1Nota !== a.fase1Nota) return b.fase1Nota - a.fase1Nota;
        return a.dataNascimento.getTime() - b.dataNascimento.getTime();
      });

    // Agrupar por estado e atribuir medalhas
    const porEstado = new Map<string, typeof ordenado>();
    for (const item of ordenado) {
      const items = porEstado.get(item.estado) || [];
      items.push(item);
      porEstado.set(item.estado, items);
    }

    const resultado: Record<string, Record<"OURO" | "PRATA" | "BRONZE", typeof ordenado>> = {};

    for (const [uf, items] of porEstado) {
      const total = items.length;
      const ouro = items.slice(0, Math.max(1, Math.floor(total * 0.05)));
      const prata = items.slice(ouro.length, ouro.length + Math.max(1, Math.floor(total * 0.10)));
      const bronze = items.slice(ouro.length + prata.length, ouro.length + prata.length + Math.max(1, Math.floor(total * 0.15)));

      resultado[uf] = { OURO: ouro, PRATA: prata, BRONZE: bronze };
    }

    return estado ? resultado[estado.toUpperCase()] || { OURO: [], PRATA: [], BRONZE: [] } : resultado;
  }

  async atualizarMedalhas() {
    const ranking = await this.rankingPorEstado();

    type ItemRanking = { inscricaoId: string; notaFinal: number };

    for (const medalhas of Object.values(ranking)) {
      for (const [medalha, items] of Object.entries(medalhas) as [string, ItemRanking[]][]) {
        for (const item of items) {
          await this.prisma.inscricao.update({
            where: { id: item.inscricaoId },
            data: {
              medalha: medalha as "OURO" | "PRATA" | "BRONZE",
              notaFinal: item.notaFinal,
            },
          });
        }
      }
    }

    return { atualizado: true };
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  async rankingPorEstado(estado?: string) {
    const inscricoes = await this.prisma.inscricao.findMany({
      where: {
        status: "CONFIRMADA",
        fase1Nota: { not: null },
        ...(estado ? { estado: estado.toUpperCase() } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            dataNascimento: true,
          },
        },
      },
    });

    const ordenado = inscricoes
      .map((i) => ({
        inscricaoId: i.id,
        nome: i.user.nome,
        estado: i.estado,
        fase1Nota: i.fase1Nota || 0,
        fase2Nota: i.fase2Nota || 0,
        notaFinal: i.notaFinal || this.calcularNotaFinal(i.fase1Nota, i.fase2Nota),
        dataNascimento: i.user.dataNascimento,
        medalha: i.medalha,
      }))
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

  private calcularNotaFinal(fase1: number | null, fase2: number | null): number {
    const n1 = fase1 || 0;
    const n2 = fase2 || 0;
    return n1 * 0.4 + n2 * 0.6;
  }
}

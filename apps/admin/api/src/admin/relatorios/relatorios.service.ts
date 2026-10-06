import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import {
  gerarPdfInscricoesConfirmadas,
  ordenarAlfabeticamente,
} from "./inscricoes-confirmadas.pdf.js";

export function formatarNumeroInscricao(ano: number, numero: number): string {
  return `${ano}-${String(numero).padStart(4, "0")}`;
}

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async inscricoesConfirmadasPdf(edicaoId?: string) {
    const edicao = edicaoId
      ? await this.prisma.edicao.findUnique({ where: { id: edicaoId } })
      : ((await this.prisma.edicao.findFirst({
          where: { status: "ATIVA" },
          orderBy: [{ ano: "desc" }, { semestre: "desc" }],
        })) ??
        (await this.prisma.edicao.findFirst({
          orderBy: [{ ano: "desc" }, { semestre: "desc" }],
        })));
    if (!edicao) throw new NotFoundException("Edição não encontrada");

    const inscricoes = await this.prisma.inscricao.findMany({
      where: { edicaoId: edicao.id, status: "CONFIRMADA" },
      select: {
        numero: true,
        user: { select: { nome: true } },
        curso: { select: { nome: true } },
      },
    });

    const linhas = ordenarAlfabeticamente(
      inscricoes.map((i) => ({
        numero: formatarNumeroInscricao(edicao.ano, i.numero),
        nome: i.user.nome,
        curso: i.curso?.nome ?? "—",
        status: "Confirmada",
      })),
    );

    const buffer = await gerarPdfInscricoesConfirmadas({
      titulo: edicao.titulo,
      geradoEm: new Date(),
      linhas,
    });
    return { buffer, filename: `inscricoes-confirmadas-${edicao.ano}-${edicao.semestre}.pdf` };
  }
}

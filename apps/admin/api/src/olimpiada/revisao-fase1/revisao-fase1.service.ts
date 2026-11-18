import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../../admin/auditoria/auditoria.service.js";
import { montarRevisao } from "./revisao-fase1.logic.js";

/** Prova da Fase 1 que vale: a publicada por último (mesmo critério do exam-app e do corrigir-fase1). */
const PROVA_FASE1 = { fase: 1, status: { in: ["PUBLICADA", "EM_ANDAMENTO", "ENCERRADA"] as Array<"PUBLICADA" | "EM_ANDAMENTO" | "ENCERRADA"> } };

/**
 * Revisão da Fase 1 pelo participante: suas respostas comparadas ao gabarito
 * oficial. Fica oculta até um Admin publicá-la (Edicao.revisaoFase1PublicadaEm).
 */
@Injectable()
export class RevisaoFase1Service {
  constructor(private prisma: PrismaService, private auditoria: AuditoriaService) {}

  private async edicao() {
    const e = await this.prisma.edicao.findFirst({ orderBy: [{ ano: "desc" }, { semestre: "desc" }] });
    if (!e) throw new NotFoundException("Nenhuma edição cadastrada");
    return e;
  }

  private provaDa(edicaoId: string) {
    return this.prisma.prova.findFirst({
      where: { edicaoId, ...PROVA_FASE1 },
      orderBy: { publicadaEm: { sort: "desc", nulls: "last" } },
      select: {
        id: true,
        titulo: true,
        questoes: {
          orderBy: { ordem: "asc" },
          select: {
            ordem: true,
            questao: {
              select: {
                id: true, enunciado: true, correta: true,
                alternativaA: true, alternativaB: true, alternativaC: true, alternativaD: true, alternativaE: true,
              },
            },
          },
        },
      },
    });
  }

  async minha(userId: string) {
    const edicao = await this.edicao();
    if (!edicao.revisaoFase1PublicadaEm) return { disponivel: false as const };

    const inscricao = await this.prisma.inscricao.findUnique({
      where: { userId_edicaoId: { userId, edicaoId: edicao.id } },
      select: { id: true, fase1Inicio: true, fase1Nota: true },
    });
    if (!inscricao?.fase1Inicio) return { disponivel: true as const, participou: false as const };

    const prova = await this.provaDa(edicao.id);
    if (!prova) return { disponivel: false as const };
    const questoes = prova.questoes.map((pq) => ({ ...pq.questao, ordem: pq.ordem }));
    const respostas = await this.prisma.resposta.findMany({
      where: { inscricaoId: inscricao.id, questaoId: { in: questoes.map((q) => q.id) } },
      select: { questaoId: true, alternativaMarcada: true },
    });
    const revisao = montarRevisao(inscricao.id, questoes, new Map(respostas.map((r) => [r.questaoId, r.alternativaMarcada])));
    return {
      disponivel: true as const,
      participou: true as const,
      prova: prova.titulo,
      nota: inscricao.fase1Nota,
      ...revisao,
    };
  }

  async situacao() {
    const edicao = await this.edicao();
    const prova = await this.provaDa(edicao.id);
    const semGabarito = prova ? prova.questoes.filter((pq) => !pq.questao.correta).length : null;
    return {
      edicao: edicao.titulo,
      publicadaEm: edicao.revisaoFase1PublicadaEm?.toISOString() ?? null,
      prova: prova?.titulo ?? null,
      questoes: prova?.questoes.length ?? 0,
      semGabarito,
    };
  }

  async publicar(publicar: boolean, actorId: string) {
    const edicao = await this.edicao();
    if (publicar) {
      const prova = await this.provaDa(edicao.id);
      if (!prova || !prova.questoes.length) throw new BadRequestException("Nenhuma prova da Fase 1 encontrada.");
      const sem = prova.questoes.filter((pq) => !pq.questao.correta).length;
      if (sem) throw new BadRequestException(`Há ${sem} questão(ões) sem gabarito oficial. Cadastre o gabarito antes de publicar.`);
    }
    await this.prisma.edicao.update({
      where: { id: edicao.id },
      data: { revisaoFase1PublicadaEm: publicar ? new Date() : null },
    });
    await this.auditoria.log(actorId, publicar ? "PUBLICAR_REVISAO_FASE1" : "OCULTAR_REVISAO_FASE1", "Edicao", edicao.id, {});
    return this.situacao();
  }
}

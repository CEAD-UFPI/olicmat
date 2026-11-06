import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import type { ResponderQuestaoDto } from "./dto/prova.dto.js";
import { permutacaoAlternativas } from "./shuffle.js";

const DURACAO_PROVA_MINUTOS = 180; // 3h

/** Só para o salvamento que já estava a caminho quando o tempo acabou. */
const TOLERANCIA_ENVIO_MS = 5_000;

/** Por quanto tempo uma tentativa em outro aparelho mantém o aviso na tela. */
const AVISO_CONFLITO_MS = 90_000;

/**
 * Rascunhos e cópias nunca chegam ao participante. ENCERRADA fica de fora só no
 * início da prova: quem já fez precisa continuar finalizando e consultando.
 */
const PROVA_FASE1 = {
  fase: 1,
  status: { in: ["PUBLICADA", "EM_ANDAMENTO", "ENCERRADA"] as ("PUBLICADA" | "EM_ANDAMENTO" | "ENCERRADA")[] },
};

/** Se uma prova foi encerrada e substituída, vale a publicada por último. */
const PROVA_MAIS_RECENTE = { publicadaEm: { sort: "desc", nulls: "last" } } as const;

/** Limite do regulamento: a terceira saída encerra a prova. */
const MAX_ADVERTENCIAS = 3;

export const MOTIVOS_FIM = ["ALUNO", "TEMPO", "ADVERTENCIAS"] as const;
export type MotivoFim = (typeof MOTIVOS_FIM)[number];

/**
 * Horário em que a prova deste participante termina.
 *
 * A prova acaba no que vier primeiro, a duração ou o fechamento da janela: quem
 * entra às 08:40 numa janela até 11:00 tem até 11:00. O tempo extra concedido
 * pelo suporte soma DEPOIS desse corte; caso contrário, uma compensação dada
 * perto do fechamento não teria efeito nenhum.
 */
export function calcularFimProva(
  inicio: Date,
  duracaoMinutos: number | null,
  janelaFim: Date | null,
  tempoExtraMinutos: number | null,
): Date {
  const pelaDuracao = inicio.getTime() + (duracaoMinutos || DURACAO_PROVA_MINUTOS) * 60_000;
  const base = janelaFim ? Math.min(pelaDuracao, janelaFim.getTime()) : pelaDuracao;
  return new Date(base + (tempoExtraMinutos || 0) * 60_000);
}

/**
 * A nota da Fase 1 NÃO é divulgada ao participante ao final da prova: o gabarito
 * e a pontuação de todos serão publicados no site da OLICMAT. Nenhuma resposta
 * desta API deve carregar nota, número de acertos ou percentual.
 */
function semNotaFase1<T extends { fase1Nota?: unknown }>(inscricao: T | null): Omit<T, "fase1Nota"> | null {
  if (!inscricao) return null;
  const { fase1Nota: _omitida, ...resto } = inscricao;
  return resto;
}

@Injectable()
export class ProvaService {
  constructor(private prisma: PrismaService) {}

  async iniciarProva(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, fase1Inicio: true, fase1Fim: true, edicaoId: true },
    });

    if (!inscricao || inscricao.status !== "CONFIRMADA") {
      throw new BadRequestException("Inscrição não confirmada para realizar a prova");
    }

    if (inscricao.fase1Fim) {
      throw new BadRequestException("Prova já foi finalizada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, ...PROVA_FASE1 },
      orderBy: PROVA_MAIS_RECENTE,
      select: { id: true, status: true, janelaInicio: true, janelaFim: true, limiteInicio: true },
    });

    if (!prova) {
      throw new BadRequestException("Nenhuma prova disponível para esta edição");
    }

    const agora = new Date();
    if (prova.janelaInicio && agora < prova.janelaInicio) {
      throw new BadRequestException("A prova ainda não está disponível para realização");
    }
    // Quem já começou pode continuar, inclusive com tempo extra além da janela.
    if (!inscricao.fase1Inicio) {
      if (prova.status === "ENCERRADA" || (prova.janelaFim && agora > prova.janelaFim)) {
        throw new BadRequestException("A janela de realização desta prova já se encerrou");
      }
      if (prova.limiteInicio && agora > prova.limiteInicio) {
        const horario = prova.limiteInicio.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        });
        throw new BadRequestException(`O prazo para iniciar a prova terminou às ${horario}`);
      }
    }

    if (!inscricao.fase1Inicio) {
      const updated = await this.prisma.inscricao.update({
        where: { id: inscricao.id },
        data: { fase1Inicio: new Date() },
      });
      return { message: "Prova iniciada com sucesso", inicio: updated.fase1Inicio };
    }

    return { message: "Prova já em andamento", inicio: inscricao.fase1Inicio };
  }

  async buscarQuestoes(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        fase1Inicio: true,
        fase1Fim: true,
        fase1TempoExtraMinutos: true,
        fase1Advertencias: true,
        edicaoId: true,
      },
    });

    if (!inscricao || inscricao.status !== "CONFIRMADA") {
      throw new BadRequestException("Inscrição não confirmada para realizar a prova");
    }

    if (!inscricao.fase1Inicio) {
      throw new BadRequestException("Prova não foi iniciada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, ...PROVA_FASE1 },
      orderBy: PROVA_MAIS_RECENTE,
      select: { id: true, duracaoMinutos: true, janelaFim: true },
    });

    if (!prova) {
      throw new BadRequestException("Nenhuma prova disponível para esta edição");
    }

    const agora = new Date();
    const fimProva = calcularFimProva(
      inscricao.fase1Inicio,
      prova.duracaoMinutos,
      prova.janelaFim,
      inscricao.fase1TempoExtraMinutos,
    );

    if (agora > fimProva || inscricao.fase1Fim) {
      throw new BadRequestException("Tempo de prova esgotado ou já finalizada");
    }

    const provasQuestoes = await this.prisma.provaQuestao.findMany({
      where: { provaId: prova.id },
      include: {
        questao: {
          select: {
            id: true,
            enunciado: true,
            alternativaA: true,
            alternativaB: true,
            alternativaC: true,
            alternativaD: true,
            alternativaE: true,
          },
        },
      },
      orderBy: { ordem: "asc" },
    });

    // A ordem das questões é a do cadastro, igual para todos.
    const questoes = provasQuestoes.map((pq) => pq.questao);

    const respostas = await this.prisma.resposta.findMany({
      where: {
        inscricaoId: inscricao.id,
        questaoId: { in: questoes.map((q) => q.id) },
      },
      select: { questaoId: true, alternativaMarcada: true },
    });

    const respostasMap = new Map(
      respostas.map((r) => [r.questaoId, r.alternativaMarcada])
    );

    return {
      inscricaoId: inscricao.id,
      inicio: inscricao.fase1Inicio.toISOString(),
      fim: fimProva.toISOString(),
      agora: agora.toISOString(),
      advertencias: inscricao.fase1Advertencias ?? 0,
      questoes: questoes.map((q) => {
        const perm = permutacaoAlternativas(`${inscricao.id}:${q.id}`);
        const textoCanonico: Record<string, string> = {
          A: q.alternativaA,
          B: q.alternativaB,
          C: q.alternativaC,
          D: q.alternativaD,
          E: q.alternativaE,
        };
        const [a, b, c, d, e] = perm.map((letra) => textoCanonico[letra]);
        return {
          id: q.id,
          enunciado: q.enunciado,
          alternativaA: a,
          alternativaB: b,
          alternativaC: c,
          alternativaD: d,
          alternativaE: e,
          respondida: respostasMap.get(q.id) || null,
        };
      }),
    };
  }

  async responder(userId: string, data: ResponderQuestaoDto) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, edicaoId: true, fase1Inicio: true, fase1Fim: true, fase1TempoExtraMinutos: true },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    if (inscricao.fase1Fim) {
      throw new BadRequestException("Prova já foi finalizada");
    }

    const questao = await this.prisma.questao.findUnique({
      where: { id: data.questaoId },
      select: { id: true, correta: true },
    });

    if (!questao) {
      throw new NotFoundException("Questão não encontrada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, ...PROVA_FASE1 },
      orderBy: PROVA_MAIS_RECENTE,
      select: { id: true, duracaoMinutos: true, janelaFim: true },
    });

    if (!prova) {
      throw new BadRequestException("Nenhuma prova disponível para esta edição");
    }

    const fimProva = inscricao.fase1Inicio
      ? calcularFimProva(
          inscricao.fase1Inicio,
          prova.duracaoMinutos,
          prova.janelaFim,
          inscricao.fase1TempoExtraMinutos,
        )
      : null;

    if (fimProva && Date.now() > fimProva.getTime() + TOLERANCIA_ENVIO_MS) {
      throw new BadRequestException("Tempo de prova esgotado");
    }

    // Remapeia a letra exibida (A–E embaralhada) de volta para a letra canônica.
    const perm = permutacaoAlternativas(`${inscricao.id}:${questao.id}`);
    const idx = "ABCDE".indexOf(data.alternativa);
    const correta = perm[idx] === questao.correta;

    return this.prisma.resposta.upsert({
      where: {
        inscricaoId_provaId_questaoId: {
          inscricaoId: inscricao.id,
          provaId: prova.id,
          questaoId: data.questaoId,
        },
      },
      create: {
        inscricaoId: inscricao.id,
        provaId: prova.id,
        questaoId: data.questaoId,
        alternativaMarcada: data.alternativa,
        correta,
      },
      update: {
        alternativaMarcada: data.alternativa,
        correta,
      },
    });
  }

  async finalizarProva(userId: string, motivo: MotivoFim = "ALUNO") {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        edicaoId: true,
        fase1Fim: true,
        fase1Nota: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    if (inscricao.fase1Fim) {
      return semNotaFase1(
        await this.prisma.inscricao.findUnique({ where: { id: inscricao.id } }),
      );
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, ...PROVA_FASE1 },
      orderBy: PROVA_MAIS_RECENTE,
      select: { id: true },
    });

    const groups = await this.prisma.resposta.groupBy({
      by: ["correta"],
      where: { inscricaoId: inscricao.id },
      _count: { _all: true },
    });

    let corretas = 0;
    for (const g of groups) {
      if (g.correta) corretas = g._count._all;
    }

    let totalQuestoes = 0;
    if (prova) {
      totalQuestoes = await this.prisma.provaQuestao.count({
        where: { provaId: prova.id },
      });
    }

    // Sem o gabarito oficial não há nota: ela fica vazia até a correção, e não
    // zero. As respostas guardadas bastam para corrigir depois.
    const semGabarito = prova
      ? await this.prisma.questao.count({
          where: { correta: null, provas: { some: { provaId: prova.id } } },
        })
      : 0;

    const nota = totalQuestoes > 0 ? (corretas / totalQuestoes) * 100 : 0;

    const atualizada = await this.prisma.inscricao.update({
      where: { id: inscricao.id },
      data: {
        fase1Nota: semGabarito > 0 ? null : Math.round(nota * 100) / 100,
        fase1Fim: new Date(),
        fase1FimMotivo: motivo,
      },
    });
    return semNotaFase1(atualizada);
  }

  /**
   * Estado vivo da prova, consultado periodicamente pelo navegador. É o que faz
   * um "+ Tempo" do suporte chegar a quem está com a prova aberta, e dá ao
   * cronômetro a hora do servidor (o relógio do computador pode estar errado).
   */
  async estadoProva(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        edicaoId: true,
        fase1Inicio: true,
        fase1Fim: true,
        fase1TempoExtraMinutos: true,
        fase1Advertencias: true,
        fase1FimMotivo: true,
        user: { select: { sessaoConflitoEm: true } },
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, ...PROVA_FASE1 },
      orderBy: PROVA_MAIS_RECENTE,
      select: { duracaoMinutos: true, janelaFim: true },
    });

    const conflitoEm = inscricao.user?.sessaoConflitoEm?.getTime() ?? 0;

    const fim =
      inscricao.fase1Inicio && prova
        ? calcularFimProva(
            inscricao.fase1Inicio,
            prova.duracaoMinutos,
            prova.janelaFim,
            inscricao.fase1TempoExtraMinutos,
          )
        : null;

    return {
      agora: new Date().toISOString(),
      fim: fim?.toISOString() ?? null,
      finalizada: inscricao.fase1Fim !== null,
      motivoFim: inscricao.fase1FimMotivo ?? null,
      advertencias: inscricao.fase1Advertencias ?? 0,
      outroAparelho: Date.now() - conflitoEm < AVISO_CONFLITO_MS,
    };
  }

  /** Registra no servidor: o suporte precisa ver, e recarregar a página não zera. */
  async registrarAdvertencia(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    const atualizada = await this.prisma.inscricao.update({
      where: { id: inscricao.id },
      data: { fase1Advertencias: { increment: 1 } },
      select: { fase1Advertencias: true },
    });

    // O servidor decide: o navegador pode estar suspenso ou ter sido alterado.
    const encerrada = atualizada.fase1Advertencias >= MAX_ADVERTENCIAS;
    if (encerrada) {
      await this.finalizarProva(userId, "ADVERTENCIAS");
    }
    return { advertencias: atualizada.fase1Advertencias, finalizada: encerrada };
  }

  async resumoProva(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        edicaoId: true,
        fase1Inicio: true,
        fase1Fim: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, ...PROVA_FASE1 },
      orderBy: PROVA_MAIS_RECENTE,
      select: { id: true },
    });

    let total = 0;
    if (prova) {
      total = await this.prisma.provaQuestao.count({ where: { provaId: prova.id } });
    }

    const groups = await this.prisma.resposta.groupBy({
      by: ["correta"],
      where: { inscricaoId: inscricao.id },
      _count: { _all: true },
    });

    let respondidas = 0;
    for (const g of groups) {
      respondidas += g._count._all;
    }

    return {
      inscricaoId: inscricao.id,
      inicio: inscricao.fase1Inicio?.toISOString() || null,
      fim: inscricao.fase1Fim?.toISOString() || null,
      respondidas,
      total,
    };
  }

}

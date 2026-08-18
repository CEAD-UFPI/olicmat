import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../auditoria/auditoria.service.js";

export type StatusProvaMonitoramento = "em_breve" | "em_andamento" | "realizada";
export type StatusAlunoMonitoramento =
  | "nao_iniciado"
  | "em_andamento"
  | "finalizado";

const DURACAO_PROVA_MINUTOS = 180;

@Injectable()
export class MonitoramentoService {
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
  ) {}

  async listarEdicoesComProvas() {
    const agora = new Date();
    const edicoes = await this.prisma.edicao.findMany({
      include: {
        provas: {
          include: {
            _count: { select: { questoes: true } },
          },
          orderBy: { fase: "asc" },
        },
      },
      orderBy: { ano: "desc" },
    });

    return edicoes.map((edicao) => ({
      id: edicao.id,
      ano: edicao.ano,
      titulo: edicao.titulo,
      status: edicao.status,
      dataInicio: edicao.dataInicio?.toISOString() ?? null,
      dataFim: edicao.dataFim?.toISOString() ?? null,
      provas: edicao.provas.map((prova) => ({
        id: prova.id,
        fase: prova.fase,
        titulo: prova.titulo,
        duracaoMinutos: prova.duracaoMinutos,
        status: prova.status,
        janelaInicio: prova.janelaInicio?.toISOString() ?? null,
        janelaFim: prova.janelaFim?.toISOString() ?? null,
        totalQuestoes: prova._count.questoes,
        statusMonitoramento: this.derivarStatusProva(prova, agora),
      })),
    }));
  }

  async listarInscricoesPorProva(provaId: string) {
    const prova = await this.prisma.prova.findUnique({
      where: { id: provaId },
      select: { id: true, edicaoId: true, duracaoMinutos: true, fase: true },
    });

    if (!prova) {
      throw new NotFoundException("Prova não encontrada");
    }

    const totalQuestoes = await this.prisma.provaQuestao.count({
      where: { provaId: prova.id },
    });

    const inscricoes = await this.prisma.inscricao.findMany({
      where: { edicaoId: prova.edicaoId, status: "CONFIRMADA" },
      select: {
        id: true,
        fase1Inicio: true,
        fase1Fim: true,
        fase1Nota: true,
        fase1TempoExtraMinutos: true,
        user: {
          select: { id: true, nome: true, email: true },
        },
        curso: { select: { nome: true } },
      },
      orderBy: { user: { nome: "asc" } },
    });

    const agora = new Date();
    const duracaoMinutos = prova.duracaoMinutos || DURACAO_PROVA_MINUTOS;

    const linhas = await Promise.all(
      inscricoes.map(async (insc) => {
        const respondidas = await this.prisma.resposta.count({
          where: { inscricaoId: insc.id },
        });

        const { status, tempoRestanteMinutos } = this.derivarStatusAluno(
          insc.fase1Inicio,
          insc.fase1Fim,
          insc.fase1TempoExtraMinutos,
          duracaoMinutos,
          agora,
        );

        return {
          id: insc.id,
          userId: insc.user.id,
          nome: insc.user.nome,
          email: insc.user.email,
          curso: insc.curso?.nome || "—",
          status,
          fase1Inicio: insc.fase1Inicio?.toISOString() ?? null,
          fase1Fim: insc.fase1Fim?.toISOString() ?? null,
          fase1Nota: insc.fase1Nota,
          tempoExtraMinutos: insc.fase1TempoExtraMinutos || 0,
          tempoRestanteMinutos,
          respondidas,
          totalQuestoes,
        };
      }),
    );

    return { provaId, totalQuestoes, inscricoes: linhas };
  }

  async resetarTempo(inscricaoId: string, actorId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      select: {
        id: true,
        userId: true,
        edicaoId: true,
        fase1Inicio: true,
        fase1Fim: true,
        fase1TempoExtraMinutos: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    await this.validarJanelaFase1(inscricao.edicaoId);

    const estadoAnterior = {
      fase1Inicio: inscricao.fase1Inicio?.toISOString() ?? null,
      fase1Fim: inscricao.fase1Fim?.toISOString() ?? null,
      fase1TempoExtraMinutos: inscricao.fase1TempoExtraMinutos || 0,
    };

    const updated = await this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data: {
        fase1Inicio: new Date(),
        fase1Fim: null,
        fase1TempoExtraMinutos: 0,
      },
    });

    await this.auditoria.log(
      actorId,
      "RESETAR_TEMPO_PROVA",
      "Inscricao",
      inscricaoId,
      { estadoAnterior, userId: inscricao.userId },
    );

    return {
      message: "Tempo de prova resetado com sucesso",
      fase1Inicio: updated.fase1Inicio?.toISOString() ?? null,
      fase1TempoExtraMinutos: updated.fase1TempoExtraMinutos,
    };
  }

  async adicionarTempo(
    inscricaoId: string,
    minutos: number,
    actorId: string,
  ) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      select: {
        id: true,
        userId: true,
        edicaoId: true,
        fase1Inicio: true,
        fase1Fim: true,
        fase1TempoExtraMinutos: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    await this.validarJanelaFase1(inscricao.edicaoId);

    if (!inscricao.fase1Inicio) {
      throw new BadRequestException(
        "Aluno ainda não iniciou a prova, não é possível adicionar tempo",
      );
    }

    const tempoAnterior = inscricao.fase1TempoExtraMinutos || 0;
    const finalizada = inscricao.fase1Fim !== null;

    const data =
      finalizada
        ? // Reabre a prova do aluno: reinicia a contagem com o tempo informado.
          { fase1Inicio: new Date(), fase1Fim: null, fase1TempoExtraMinutos: minutos }
        : { fase1TempoExtraMinutos: tempoAnterior + minutos };

    const updated = await this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data,
    });

    const novoTempoExtra =
      finalizada ? minutos : tempoAnterior + minutos;

    await this.auditoria.log(
      actorId,
      "ADICIONAR_TEMPO_PROVA",
      "Inscricao",
      inscricaoId,
      {
        tempoAnterior,
        minutosAdicionados: minutos,
        novoTempoExtra,
        userId: inscricao.userId,
        reaberta: finalizada,
      },
    );

    return {
      message: `${minutos} minuto(s) adicionado(s) com sucesso`,
      reaberta: finalizada,
      fase1TempoExtraMinutos: updated.fase1TempoExtraMinutos,
      tempoExtraTotal: novoTempoExtra,
    };
  }

  private async validarJanelaFase1(edicaoId: string) {
    const agora = new Date();
    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId, fase: 1 },
      select: { janelaInicio: true, janelaFim: true },
    });

    if (
      !prova ||
      !prova.janelaInicio ||
      !prova.janelaFim ||
      agora < prova.janelaInicio ||
      agora > prova.janelaFim
    ) {
      throw new BadRequestException(
        "Só é possível ajustar tempo dentro da janela de realização da prova",
      );
    }
  }

  private derivarStatusProva(
    prova: {
      status: string;
      janelaInicio: Date | null;
      janelaFim: Date | null;
    },
    agora: Date,
  ): StatusProvaMonitoramento {
    if (prova.status === "ENCERRADA") {
      return "realizada";
    }

    if (prova.status === "EM_ANDAMENTO") {
      return "em_andamento";
    }

    if (prova.status === "PUBLICADA") {
      if (prova.janelaInicio && agora < prova.janelaInicio) {
        return "em_breve";
      }
      if (prova.janelaFim && agora > prova.janelaFim) {
        return "realizada";
      }
      return "em_andamento";
    }

    // RASCUNHO (ou status desconhecido)
    return "em_breve";
  }

  private derivarStatusAluno(
    fase1Inicio: Date | null,
    fase1Fim: Date | null,
    tempoExtra: number | null,
    duracaoMinutos: number,
    agora: Date,
  ): { status: StatusAlunoMonitoramento; tempoRestanteMinutos: number | null } {
    if (fase1Fim) {
      return { status: "finalizado", tempoRestanteMinutos: null };
    }

    if (!fase1Inicio) {
      return { status: "nao_iniciado", tempoRestanteMinutos: null };
    }

    const duracaoTotal = duracaoMinutos + (tempoExtra || 0);
    const fimCalculado = new Date(
      fase1Inicio.getTime() + duracaoTotal * 60 * 1000,
    );

    if (agora > fimCalculado) {
      return { status: "finalizado", tempoRestanteMinutos: null };
    }

    return {
      status: "em_andamento",
      tempoRestanteMinutos: Math.max(
        0,
        Math.ceil((fimCalculado.getTime() - agora.getTime()) / 60000),
      ),
    };
  }
}

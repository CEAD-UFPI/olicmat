import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomInt } from "node:crypto";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../auditoria/auditoria.service.js";

export type StatusProvaMonitoramento = "em_breve" | "em_andamento" | "realizada";
export type StatusAlunoMonitoramento =
  | "nao_iniciado"
  | "em_andamento"
  | "finalizado";

const DURACAO_PROVA_MINUTOS = 180; // 3h

/** O suporte continua atuando por este tempo depois que a janela fecha. */
const TOLERANCIA_SUPORTE_MS = 2 * 60 * 60 * 1000;

/** Mesmo valor de AuthService: sem atividade por este tempo, a sessão expirou. */
const SESSAO_ATIVA_MS = 90_000;

/**
 * Mesma regra de apps/exam/api (calcularFimProva): a prova acaba no que vier
 * primeiro, duração ou fechamento da janela, e o tempo extra soma depois disso.
 */
function calcularFimProva(
  inicio: Date,
  duracaoMinutos: number,
  janelaFim: Date | null,
  tempoExtraMinutos: number | null,
): Date {
  const pelaDuracao = inicio.getTime() + duracaoMinutos * 60_000;
  const base = janelaFim ? Math.min(pelaDuracao, janelaFim.getTime()) : pelaDuracao;
  return new Date(base + (tempoExtraMinutos || 0) * 60_000);
}

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
        limiteInicio: prova.limiteInicio?.toISOString() ?? null,
        totalQuestoes: prova._count.questoes,
        statusMonitoramento: this.derivarStatusProva(prova, agora),
      })),
    }));
  }

  async listarInscricoesPorProva(provaId: string) {
    const prova = await this.prisma.prova.findUnique({
      where: { id: provaId },
      select: { id: true, edicaoId: true, duracaoMinutos: true, fase: true, janelaFim: true },
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
        fase1Advertencias: true,
        fase1FimMotivo: true,
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            cpf: true,
            matricula: true,
            sessaoId: true,
            sessaoVistaEm: true,
            sessaoConflitoEm: true,
          },
        },
        curso: { select: { nome: true } },
      },
      orderBy: { user: { nome: "asc" } },
    });

    const agora = new Date();
    const duracaoMinutos = prova.duracaoMinutos || DURACAO_PROVA_MINUTOS;

    // Uma consulta só. Eram 567 COUNTs a cada 5s por painel aberto, disputando o
    // pool de conexões com o login dos participantes.
    const contagens = await this.prisma.resposta.groupBy({
      by: ["inscricaoId"],
      where: { provaId: prova.id },
      _count: { _all: true },
    });
    const respondidasPor = new Map(contagens.map((c) => [c.inscricaoId, c._count._all]));

    const linhas = inscricoes.map((insc) => {
      const { status, tempoRestanteMinutos, pendenteEncerramento } = this.derivarStatusAluno(
        insc.fase1Inicio,
        insc.fase1Fim,
        insc.fase1TempoExtraMinutos,
        duracaoMinutos,
        prova.janelaFim,
        agora,
      );

      return {
        id: insc.id,
        userId: insc.user.id,
        nome: insc.user.nome,
        email: insc.user.email,
        cpf: insc.user.cpf,
        matricula: insc.user.matricula,
        curso: insc.curso?.nome || "—",
        status,
        pendenteEncerramento,
        fase1Inicio: insc.fase1Inicio?.toISOString() ?? null,
        fase1Fim: insc.fase1Fim?.toISOString() ?? null,
        fase1Nota: insc.fase1Nota,
        fase1FimMotivo: insc.fase1FimMotivo,
        advertencias: insc.fase1Advertencias,
        outroAparelho:
          !!insc.user.sessaoConflitoEm &&
          agora.getTime() - insc.user.sessaoConflitoEm.getTime() < SESSAO_ATIVA_MS,
        sessaoAtiva:
          !!insc.user.sessaoId &&
          !!insc.user.sessaoVistaEm &&
          agora.getTime() - insc.user.sessaoVistaEm.getTime() < SESSAO_ATIVA_MS,
        tempoExtraMinutos: insc.fase1TempoExtraMinutos || 0,
        tempoRestanteMinutos,
        respondidas: respondidasPor.get(insc.id) ?? 0,
        totalQuestoes,
      };
    });

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
        fase1Nota: null,
        fase1FimMotivo: null,
        fase1Advertencias: 0,
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
        ? // Reabre mantendo o início. Reiniciar aqui dava a duração inteira de novo a
          // quem deveria ganhar só os minutos informados.
          {
            fase1Fim: null,
            fase1Nota: null,
            fase1FimMotivo: null,
            fase1TempoExtraMinutos: tempoAnterior + minutos,
          }
        : { fase1TempoExtraMinutos: tempoAnterior + minutos };

    const updated = await this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data,
    });

    const novoTempoExtra = tempoAnterior + minutos;

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

  /**
   * Devolve à prova quem foi encerrado (3 advertências, por exemplo) e pôde se
   * justificar. Mantém respostas e início, zera as advertências e soma os minutos
   * perdidos. A justificativa fica na auditoria: é uma decisão que pode ser contestada.
   */
  async destravar(
    inscricaoId: string,
    minutos: number,
    justificativa: string,
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
        fase1Nota: true,
        fase1FimMotivo: true,
        fase1Advertencias: true,
        fase1TempoExtraMinutos: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }
    if (!inscricao.fase1Inicio) {
      throw new BadRequestException("O participante ainda não iniciou a prova");
    }

    const prova = await this.validarJanelaFase1(inscricao.edicaoId);
    const novoExtra = (inscricao.fase1TempoExtraMinutos || 0) + minutos;
    const fim = calcularFimProva(
      inscricao.fase1Inicio,
      prova.duracaoMinutos || DURACAO_PROVA_MINUTOS,
      prova.janelaFim,
      novoExtra,
    );

    if (fim <= new Date()) {
      throw new BadRequestException(
        "Com esses minutos o tempo do participante já teria acabado. Informe mais minutos.",
      );
    }

    await this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data: {
        fase1Fim: null,
        fase1Nota: null,
        fase1FimMotivo: null,
        fase1Advertencias: 0,
        fase1TempoExtraMinutos: novoExtra,
      },
    });

    await this.auditoria.log(actorId, "DESTRAVAR_PROVA", "Inscricao", inscricaoId, {
      justificativa,
      minutos,
      userId: inscricao.userId,
      estadoAnterior: {
        fase1Fim: inscricao.fase1Fim?.toISOString() ?? null,
        fase1Nota: inscricao.fase1Nota,
        fase1FimMotivo: inscricao.fase1FimMotivo,
        fase1Advertencias: inscricao.fase1Advertencias,
      },
    });

    return { message: "Participante destravado", fim: fim.toISOString() };
  }

  /**
   * Senha provisória para quem não consegue entrar. No dia da prova não dá para
   * depender do e-mail de recuperação chegar a tempo. A senha aparece uma única
   * vez, e só o fato fica na auditoria, nunca o valor.
   */
  async senhaTemporaria(inscricaoId: string, actorId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      select: { userId: true, user: { select: { role: true } } },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }
    if (inscricao.user.role !== "ALUNO") {
      throw new BadRequestException("Disponível apenas para participantes");
    }

    // Sem caracteres ambíguos: será ditada por telefone ou WhatsApp.
    const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const senha = Array.from({ length: 10 }, () => alfabeto[randomInt(alfabeto.length)]).join("");

    await this.prisma.user.update({
      where: { id: inscricao.userId },
      // Quem perdeu o acesso costuma voltar por outro aparelho.
      data: {
        senhaHash: await bcrypt.hash(senha, 10),
        sessaoId: null,
        sessaoDispositivo: null,
        sessaoVistaEm: null,
      },
    });

    await this.auditoria.log(actorId, "SENHA_TEMPORARIA", "User", inscricao.userId, {
      inscricaoId,
    });

    return { senha };
  }

  /** Libera a conta para entrar em outro aparelho sem esperar a sessão expirar. */
  async liberarSessao(inscricaoId: string, actorId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      select: { userId: true },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    await this.prisma.user.update({
      where: { id: inscricao.userId },
      data: { sessaoId: null, sessaoDispositivo: null, sessaoVistaEm: null, sessaoConflitoEm: null },
    });

    await this.auditoria.log(actorId, "LIBERAR_SESSAO", "User", inscricao.userId, { inscricaoId });

    return { message: "Sessão liberada" };
  }

  /**
   * Fecha quem ficou sem finalizar (fechou o navegador, caiu a internet): sem
   * isto a pessoa fica sem nota, mesmo com as respostas salvas.
   */
  async encerrarPendentes(provaId: string, actorId: string) {
    const prova = await this.prisma.prova.findUnique({
      where: { id: provaId },
      select: { id: true, edicaoId: true, duracaoMinutos: true, janelaFim: true },
    });

    if (!prova) {
      throw new NotFoundException("Prova não encontrada");
    }

    const [abertas, totalQuestoes, corretas, semGabarito] = await Promise.all([
      this.prisma.inscricao.findMany({
        where: {
          edicaoId: prova.edicaoId,
          status: "CONFIRMADA",
          fase1Inicio: { not: null },
          fase1Fim: null,
        },
        select: { id: true, fase1Inicio: true, fase1TempoExtraMinutos: true },
      }),
      this.prisma.provaQuestao.count({ where: { provaId } }),
      this.prisma.resposta.groupBy({
        by: ["inscricaoId"],
        where: { provaId, correta: true },
        _count: { _all: true },
      }),
      this.prisma.questao.count({
        where: { correta: null, provas: { some: { provaId } } },
      }),
    ]);

    const corretasPor = new Map(corretas.map((c) => [c.inscricaoId, c._count._all]));
    const agora = new Date();
    const expiradas = abertas.filter(
      (insc) =>
        calcularFimProva(
          insc.fase1Inicio!,
          prova.duracaoMinutos || DURACAO_PROVA_MINUTOS,
          prova.janelaFim,
          insc.fase1TempoExtraMinutos,
        ) < agora,
    );

    for (const insc of expiradas) {
      const acertos = corretasPor.get(insc.id) ?? 0;
      const nota = totalQuestoes > 0 ? (acertos / totalQuestoes) * 100 : 0;
      await this.prisma.inscricao.updateMany({
        where: { id: insc.id, fase1Fim: null },
        data: {
          // Sem o gabarito oficial, a nota fica vazia até a correção.
          fase1Nota: semGabarito > 0 ? null : Math.round(nota * 100) / 100,
          fase1Fim: agora,
          fase1FimMotivo: "ENCERRAMENTO_ADMIN",
        },
      });
    }

    await this.auditoria.log(actorId, "ENCERRAR_PENDENTES", "Prova", provaId, {
      encerradas: expiradas.length,
    });

    return { encerradas: expiradas.length, aindaEmAndamento: abertas.length - expiradas.length };
  }

  private async validarJanelaFase1(edicaoId: string) {
    const agora = new Date();
    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId, fase: 1, status: { in: ["PUBLICADA", "EM_ANDAMENTO", "ENCERRADA"] } },
      orderBy: { publicadaEm: { sort: "desc", nulls: "last" } },
      select: { janelaInicio: true, janelaFim: true, duracaoMinutos: true },
    });

    if (
      !prova ||
      !prova.janelaInicio ||
      !prova.janelaFim ||
      agora < prova.janelaInicio ||
      agora.getTime() > prova.janelaFim.getTime() + TOLERANCIA_SUPORTE_MS
    ) {
      throw new BadRequestException(
        "Só é possível ajustar tempo durante a prova e até 2 horas depois do fechamento",
      );
    }

    return prova;
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
    janelaFim: Date | null,
    agora: Date,
  ): {
    status: StatusAlunoMonitoramento;
    tempoRestanteMinutos: number | null;
    pendenteEncerramento: boolean;
  } {
    if (fase1Fim) {
      return { status: "finalizado", tempoRestanteMinutos: null, pendenteEncerramento: false };
    }

    if (!fase1Inicio) {
      return { status: "nao_iniciado", tempoRestanteMinutos: null, pendenteEncerramento: false };
    }

    const fimCalculado = calcularFimProva(fase1Inicio, duracaoMinutos, janelaFim, tempoExtra);

    if (agora > fimCalculado) {
      return { status: "finalizado", tempoRestanteMinutos: null, pendenteEncerramento: true };
    }

    return {
      pendenteEncerramento: false,
      status: "em_andamento",
      tempoRestanteMinutos: Math.max(
        0,
        Math.ceil((fimCalculado.getTime() - agora.getTime()) / 60000),
      ),
    };
  }
}

import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { randomInt } from "node:crypto";
import { PrismaService } from "../prisma.service.js";
import { AuditoriaService } from "../admin/auditoria/auditoria.service.js";
import { EmailService } from "../email/email.service.js";
import { ALERTA_AVALIACAO_HORAS, distribuir, prazoDe, situacaoEnvio } from "./fase2.regras.js";
import { edicaoAtual } from "./fase2.edicao.js";

const HORA = 3600_000;

/** Início da Fase 2, e-mails, distribuição aos avaliadores e acompanhamento. */
@Injectable()
export class Fase2GestaoService {
  private readonly logger = new Logger(Fase2GestaoService.name);
  private enviandoEmails = false;

  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
    private email: EmailService,
  ) {}

  private async edicaoOuErro() {
    const edicao = await edicaoAtual(this.prisma);
    if (!edicao) throw new NotFoundException("Nenhuma edição cadastrada");
    return edicao;
  }

  // ─── Painel ────────────────────────────────────────────────────────────

  async painel(agora = new Date()) {
    const edicao = await this.edicaoOuErro();
    const iniciadaPor = edicao.fase2IniciadaPorId
      ? await this.prisma.user.findUnique({
          where: { id: edicao.fase2IniciadaPorId },
          select: { nome: true },
        })
      : null;

    const inscricoes = await this.prisma.inscricao.findMany({
      where: { edicaoId: edicao.id, fase2Classificado: true },
      select: {
        id: true,
        numero: true,
        fase2Nota: true,
        user: { select: { nome: true, email: true } },
        instituicao: { select: { sigla: true } },
        enviosFase2: {
          where: { tipo: "links" },
          orderBy: { enviadoEm: "desc" },
          select: { videoLink: true, portfolioLink: true, enviadoEm: true },
        },
        emailsFase2: { select: { status: true, erro: true } },
        atribuicoesFase2: {
          orderBy: [{ ordem: "asc" }, { atribuidoEm: "asc" }],
          select: {
            id: true,
            ordem: true,
            status: true,
            atribuidoEm: true,
            concluidoEm: true,
            avaliadorId: true,
            avaliador: { select: { nome: true } },
          },
        },
        avaliacoes: {
          where: { concluida: true },
          select: { avaliadorId: true, nota: true },
        },
      },
      orderBy: { user: { nome: "asc" } },
    });

    const participantes = inscricoes.map((i) => {
      const ultimo = i.enviosFase2[0] ?? null;
      const ativas = i.atribuicoesFase2.filter((a) => a.status !== "REMANEJADA");
      const notaDe = new Map(i.avaliacoes.map((a) => [a.avaliadorId, a.nota]));
      let situacaoAvaliacao: string;
      if (!ultimo) situacaoAvaliacao = "SEM_ENVIO";
      else if (i.fase2Nota != null) situacaoAvaliacao = "CONCLUIDA";
      else if (!ativas.length) situacaoAvaliacao = "AGUARDANDO_DISTRIBUICAO";
      else if (ativas.some((a) => a.ordem === 3)) situacaoAvaliacao = "TERCEIRO_AVALIADOR";
      else situacaoAvaliacao = "EM_AVALIACAO";
      return {
        inscricaoId: i.id,
        numero: i.numero,
        nome: i.user.nome,
        email: i.user.email,
        instituicao: i.instituicao.sigla,
        ultimoEnvio: ultimo
          ? { ...ultimo, enviadoEm: ultimo.enviadoEm.toISOString() }
          : null,
        totalEnvios: i.enviosFase2.length,
        emailInicio: i.emailsFase2[0] ?? null,
        fase2Nota: i.fase2Nota,
        situacaoAvaliacao,
        atribuicoes: ativas.map((a) => ({
          id: a.id,
          ordem: a.ordem,
          status: a.status,
          avaliadorId: a.avaliadorId,
          avaliador: a.avaliador.nome,
          atribuidoEm: a.atribuidoEm.toISOString(),
          concluidoEm: a.concluidoEm?.toISOString() ?? null,
          horasComAvaliador:
            Math.round(((a.concluidoEm ?? agora).getTime() - a.atribuidoEm.getTime()) / HORA * 10) / 10,
          nota: a.status === "CONCLUIDA" ? notaDe.get(a.avaliadorId) ?? null : null,
        })),
      };
    });

    // Por instituição: classificados × enviaram.
    const porInstituicao: Record<string, { classificados: number; enviaram: number }> = {};
    for (const p of participantes) {
      const r = (porInstituicao[p.instituicao] ??= { classificados: 0, enviaram: 0 });
      r.classificados++;
      if (p.ultimoEnvio) r.enviaram++;
    }

    // Por avaliador.
    const porAvaliador = new Map<
      string,
      { avaliadorId: string; nome: string; total: number; concluidas: number; pendentes: number; atrasadas: number; somaHoras: number }
    >();
    for (const p of participantes) {
      for (const a of p.atribuicoes) {
        const r =
          porAvaliador.get(a.avaliadorId) ??
          { avaliadorId: a.avaliadorId, nome: a.avaliador, total: 0, concluidas: 0, pendentes: 0, atrasadas: 0, somaHoras: 0 };
        r.total++;
        if (a.status === "CONCLUIDA") {
          r.concluidas++;
          r.somaHoras += a.horasComAvaliador;
        } else {
          r.pendentes++;
          if (a.horasComAvaliador > ALERTA_AVALIACAO_HORAS) r.atrasadas++;
        }
        porAvaliador.set(a.avaliadorId, r);
      }
    }

    const emails = { enviados: 0, falhas: 0, pendentes: 0 };
    for (const p of participantes) {
      const s = p.emailInicio?.status;
      if (s === "ENVIADO") emails.enviados++;
      else if (s === "FALHA") emails.falhas++;
      else if (s === "PENDENTE") emails.pendentes++;
    }

    return {
      agora: agora.toISOString(),
      edicao: { id: edicao.id, titulo: edicao.titulo },
      tema: edicao.fase2Tema,
      inicioEm: edicao.fase2InicioEm?.toISOString() ?? null,
      prazoEm: edicao.fase2PrazoEm?.toISOString() ?? null,
      iniciadaPor: iniciadaPor?.nome ?? null,
      situacao: situacaoEnvio(edicao.fase2InicioEm, edicao.fase2PrazoEm, agora),
      distribuida: participantes.some((p) => p.atribuicoes.length > 0),
      alertaHoras: ALERTA_AVALIACAO_HORAS,
      totais: {
        classificados: participantes.length,
        enviaram: participantes.filter((p) => p.ultimoEnvio).length,
        avaliados: participantes.filter((p) => p.fase2Nota != null).length,
        terceiroAvaliador: participantes.filter((p) => p.situacaoAvaliacao === "TERCEIRO_AVALIADOR").length,
      },
      emails,
      porInstituicao: Object.entries(porInstituicao).map(([sigla, v]) => ({ sigla, ...v })),
      avaliadores: [...porAvaliador.values()].map(({ somaHoras, ...r }) => ({
        ...r,
        mediaHoras: r.concluidas ? Math.round((somaHoras / r.concluidas) * 10) / 10 : null,
      })),
      participantes,
    };
  }

  // ─── Início ────────────────────────────────────────────────────────────

  async iniciar(temaBruto: string, actorId: string, agora = new Date()) {
    const tema = temaBruto.trim();
    if (tema.length < 3 || tema.length > 300) {
      throw new BadRequestException("Informe o tema da videoaula (3 a 300 caracteres).");
    }
    const edicao = await this.edicaoOuErro();
    const classificados = await this.prisma.inscricao.count({
      where: { edicaoId: edicao.id, fase2Classificado: true },
    });
    if (!classificados) {
      throw new BadRequestException("A relação de classificados para a Fase 2 ainda não foi carregada.");
    }
    const prazo = prazoDe(agora);
    // updateMany com a condição "ainda não iniciada" impede dois inícios
    // simultâneos: só um dos cliques altera a linha.
    const { count } = await this.prisma.edicao.updateMany({
      where: { id: edicao.id, fase2InicioEm: null },
      data: { fase2Tema: tema, fase2InicioEm: agora, fase2PrazoEm: prazo, fase2IniciadaPorId: actorId },
    });
    if (count === 0) throw new BadRequestException("A Fase 2 já foi iniciada.");

    await this.auditoria.log(actorId, "INICIAR_FASE2", "Edicao", edicao.id, {
      tema,
      inicioEm: agora.toISOString(),
      prazoEm: prazo.toISOString(),
      classificados,
    });

    // Prepara um registro por participante e dispara os e-mails em segundo plano.
    const alvos = await this.prisma.inscricao.findMany({
      where: { edicaoId: edicao.id, fase2Classificado: true },
      select: { id: true, user: { select: { email: true } } },
    });
    await this.prisma.emailFase2.createMany({
      data: alvos.map((a) => ({ inscricaoId: a.id, email: a.user.email, status: "PENDENTE" })),
      skipDuplicates: true,
    });
    void this.enviarEmailsPendentes(["PENDENTE"]);

    return { tema, inicioEm: agora.toISOString(), prazoEm: prazo.toISOString(), classificados };
  }

  async reenviarFalhas(actorId: string) {
    const edicao = await this.edicaoOuErro();
    if (!edicao.fase2InicioEm) throw new BadRequestException("A Fase 2 ainda não foi iniciada.");
    const falhas = await this.prisma.emailFase2.count({
      where: { status: { in: ["FALHA", "PENDENTE"] }, inscricao: { edicaoId: edicao.id } },
    });
    await this.auditoria.log(actorId, "REENVIAR_EMAILS_FASE2", "Edicao", edicao.id, { falhas });
    void this.enviarEmailsPendentes(["FALHA", "PENDENTE"]);
    return { reenviando: falhas };
  }

  /** Envia em sequência (sem rajada no provedor) e grava o resultado de cada um. */
  private async enviarEmailsPendentes(status: string[]) {
    if (this.enviandoEmails) return;
    this.enviandoEmails = true;
    try {
      const edicao = await this.edicaoOuErro();
      if (!edicao.fase2InicioEm || !edicao.fase2PrazoEm || !edicao.fase2Tema) return;
      const fila = await this.prisma.emailFase2.findMany({
        where: { status: { in: status }, inscricao: { edicaoId: edicao.id } },
        select: { id: true, email: true, inscricao: { select: { user: { select: { nome: true, nomeSocial: true } } } } },
      });
      for (const item of fila) {
        const nome = item.inscricao.user.nomeSocial || item.inscricao.user.nome;
        try {
          await this.email.enviarInicioFase2(item.email, nome, edicao.fase2Tema, edicao.fase2InicioEm, edicao.fase2PrazoEm);
          await this.prisma.emailFase2.update({
            where: { id: item.id },
            data: { status: "ENVIADO", erro: null, tentativas: { increment: 1 } },
          });
        } catch (e) {
          await this.prisma.emailFase2.update({
            where: { id: item.id },
            data: { status: "FALHA", erro: String((e as Error)?.message ?? e).slice(0, 500), tentativas: { increment: 1 } },
          });
        }
        await new Promise((r) => setTimeout(r, 150));
      }
    } catch (e) {
      this.logger.error(`Falha no envio dos e-mails da Fase 2: ${(e as Error).message}`);
    } finally {
      this.enviandoEmails = false;
    }
  }

  // ─── Distribuição ──────────────────────────────────────────────────────

  async listarAvaliadores() {
    return this.prisma.user.findMany({
      where: { role: "AVALIADOR" },
      select: { id: true, nome: true, email: true },
      orderBy: { nome: "asc" },
    });
  }

  async distribuirAvaliadores(avaliadorIds: string[], actorId: string, agora = new Date()) {
    const edicao = await this.edicaoOuErro();
    if (situacaoEnvio(edicao.fase2InicioEm, edicao.fase2PrazoEm, agora) !== "ENCERRADA") {
      throw new BadRequestException("A distribuição só pode ser feita após o encerramento do prazo de envio.");
    }
    const ids = [...new Set(avaliadorIds)];
    const validos = await this.prisma.user.count({ where: { id: { in: ids }, role: "AVALIADOR" } });
    if (validos !== ids.length) throw new BadRequestException("Lista de avaliadores inválida.");
    // 3 no mínimo: com só 2, não haveria quem fizesse a 3ª avaliação.
    if (ids.length < 3) throw new BadRequestException("Selecione pelo menos 3 avaliadores.");

    const ja = await this.prisma.atribuicaoFase2.count({ where: { inscricao: { edicaoId: edicao.id } } });
    if (ja > 0) throw new BadRequestException("A distribuição já foi feita.");

    const comEnvio = await this.prisma.inscricao.findMany({
      where: { edicaoId: edicao.id, fase2Classificado: true, enviosFase2: { some: { tipo: "links" } } },
      select: { id: true },
    });
    if (!comEnvio.length) throw new BadRequestException("Nenhum participante enviou os materiais.");

    // Embaralha (Fisher–Yates) para não concentrar uma instituição num avaliador.
    const ordem = comEnvio.map((i) => i.id);
    for (let i = ordem.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
    }
    const atribuicoes = distribuir(ordem, ids);
    await this.prisma.atribuicaoFase2.createMany({
      data: atribuicoes.map((a) => ({ ...a, atribuidoEm: agora, atribuidoPorId: actorId })),
    });
    await this.auditoria.log(actorId, "DISTRIBUIR_FASE2", "Edicao", edicao.id, {
      participantes: ordem.length,
      avaliadores: ids,
      atribuicoes: atribuicoes.length,
    });
    return { participantes: ordem.length, avaliadores: ids.length, atribuicoes: atribuicoes.length };
  }

  async remanejar(atribuicaoId: string, novoAvaliadorId: string, actorId: string) {
    const atual = await this.prisma.atribuicaoFase2.findUnique({ where: { id: atribuicaoId } });
    if (!atual) throw new NotFoundException("Atribuição não encontrada");
    if (atual.status !== "PENDENTE") {
      throw new BadRequestException("Só é possível remanejar uma avaliação pendente.");
    }
    const novo = await this.prisma.user.findFirst({ where: { id: novoAvaliadorId, role: "AVALIADOR" } });
    if (!novo) throw new BadRequestException("Avaliador inválido.");
    const conflito = await this.prisma.atribuicaoFase2.findUnique({
      where: { inscricaoId_avaliadorId: { inscricaoId: atual.inscricaoId, avaliadorId: novoAvaliadorId } },
    });
    if (conflito) throw new BadRequestException("Este avaliador já tem este participante.");

    const [, nova] = await this.prisma.$transaction([
      this.prisma.atribuicaoFase2.update({ where: { id: atual.id }, data: { status: "REMANEJADA" } }),
      this.prisma.atribuicaoFase2.create({
        data: { inscricaoId: atual.inscricaoId, avaliadorId: novoAvaliadorId, ordem: atual.ordem, atribuidoPorId: actorId },
      }),
      // O rascunho do avaliador anterior não conta para a nota.
      this.prisma.avaliacaoFase2.deleteMany({
        where: { inscricaoId: atual.inscricaoId, avaliadorId: atual.avaliadorId, concluida: false },
      }),
    ]);
    await this.auditoria.log(actorId, "REMANEJAR_FASE2", "AtribuicaoFase2", nova.id, {
      inscricaoId: atual.inscricaoId,
      de: atual.avaliadorId,
      para: novoAvaliadorId,
      ordem: atual.ordem,
    });
    return nova;
  }

  // ─── Exportação ────────────────────────────────────────────────────────

  async exportarCsv() {
    const p = await this.painel();
    const esc = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const fmt = (iso?: string | null) =>
      iso ? new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "";
    const linhas = [
      [
        "Inscrição", "Nome", "Instituição", "Enviou", "Último envio", "Link vídeo", "Link portfólio",
        "Avaliador 1", "Nota 1", "Avaliador 2", "Nota 2", "Avaliador 3", "Nota 3", "Nota Fase 2", "Situação",
      ].join(";"),
    ];
    for (const x of p.participantes) {
      const por = (o: number) => x.atribuicoes.find((a) => a.ordem === o);
      linhas.push(
        [
          x.numero, x.nome, x.instituicao, x.ultimoEnvio ? "Sim" : "Não", fmt(x.ultimoEnvio?.enviadoEm),
          x.ultimoEnvio?.videoLink, x.ultimoEnvio?.portfolioLink,
          por(1)?.avaliador, por(1)?.nota, por(2)?.avaliador, por(2)?.nota, por(3)?.avaliador, por(3)?.nota,
          x.fase2Nota, x.situacaoAvaliacao,
        ].map(esc).join(";"),
      );
    }
    return "﻿" + linhas.join("\n");
  }
}

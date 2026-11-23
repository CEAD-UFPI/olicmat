import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { randomInt } from "node:crypto";
import { PrismaService } from "../prisma.service.js";
import { AuditoriaService } from "../admin/auditoria/auditoria.service.js";
import { EmailService } from "../email/email.service.js";
import { ALERTA_AVALIACAO_HORAS, prazoDe, situacaoEnvio, type TipoArquivo } from "./fase2.regras.js";
import { CAPACIDADE_AVALIADOR, ehExterno, planejarDistribuicao, planejarRedistribuicao, podeAvaliar } from "./fase2-distribuicao.js";
import { edicaoAtual } from "./fase2.edicao.js";
import { Fase2ArmazenamentoService } from "./fase2-armazenamento.service.js";
import { formatarEnvio } from "./fase2-participante.service.js";
import { Fase2VideosService } from "./fase2-videos.service.js";

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
    private armazenamento: Fase2ArmazenamentoService,
    private videos: Fase2VideosService,
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
        fase2ReenvioVideo: true,
        fase2ReenvioPortfolio: true,
        user: { select: { nome: true, email: true } },
        instituicao: { select: { sigla: true } },
        enviosFase2: {
          orderBy: { enviadoEm: "desc" },
          select: {
            videoLink: true, portfolioLink: true, enviadoEm: true,
            videoKey: true, videoNome: true, videoBytes: true,
            portfolioKey: true, portfolioNome: true, portfolioBytes: true,
          },
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

    const mapaVideos = await this.videos.mapaPorChaves(inscricoes.map((i) => i.enviosFase2[0]?.videoKey));
    const participantes = inscricoes.map((i) => {
      const ultimo = formatarEnvio(i.enviosFase2[0], this.armazenamento, mapaVideos);
      const temVideo = !!(ultimo?.video || ultimo?.videoLink);
      const temPortfolio = !!(ultimo?.portfolio || ultimo?.portfolioLink);
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
        ultimoEnvio: ultimo,
        envioCompleto: temVideo && temPortfolio,
        totalEnvios: i.enviosFase2.length,
        reenvioLiberado: { video: i.fase2ReenvioVideo, portfolio: i.fase2ReenvioPortfolio },
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
        enviosCompletos: participantes.filter((p) => p.envioCompleto).length,
        avaliados: participantes.filter((p) => p.fase2Nota != null).length,
        terceiroAvaliador: participantes.filter((p) => p.situacaoAvaliacao === "TERCEIRO_AVALIADOR").length,
      },
      emails,
      videos: await this.videos.resumo(),
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
      throw new BadRequestException("Informe a competência sorteada (3 a 300 caracteres).");
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

  // ─── Liberação de reenvio (exceção ao envio único) ─────────────────────

  async liberarReenvio(inscricaoId: string, tipo: TipoArquivo, liberar: boolean, motivo: string, actorId: string, agora = new Date()) {
    const edicao = await this.edicaoOuErro();
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { id: inscricaoId, edicaoId: edicao.id, fase2Classificado: true },
      select: { id: true, user: { select: { email: true, nome: true, nomeSocial: true } } },
    });
    if (!inscricao) throw new NotFoundException("Participante não encontrado entre os classificados.");
    if (liberar && situacaoEnvio(edicao.fase2InicioEm, edicao.fase2PrazoEm, agora) !== "ABERTA") {
      throw new BadRequestException("Só é possível liberar um novo envio enquanto o prazo da Fase 2 estiver aberto.");
    }
    const campo = tipo === "video" ? "fase2ReenvioVideo" : "fase2ReenvioPortfolio";
    await this.prisma.inscricao.update({ where: { id: inscricao.id }, data: { [campo]: liberar } });
    await this.auditoria.log(actorId, liberar ? "LIBERAR_REENVIO_FASE2" : "REVOGAR_REENVIO_FASE2", "Inscricao", inscricao.id, {
      tipo,
      motivo,
    });
    if (liberar && edicao.fase2PrazoEm) {
      const nome = inscricao.user.nomeSocial || inscricao.user.nome;
      // Aviso por e-mail é cortesia: a liberação vale mesmo se o envio falhar.
      void this.email.enviarReenvioLiberado(inscricao.user.email, nome, tipo, edicao.fase2PrazoEm)
        .catch((e) => this.logger.warn(`Aviso de reenvio não enviado: ${(e as Error).message}`));
    }
    return { ok: true, tipo, liberado: liberar };
  }

  // ─── Distribuição ──────────────────────────────────────────────────────

  /** Quem pode avaliar: perfil principal AVALIADOR ou AVALIADOR como perfil extra. */
  private readonly ehAvaliador = { OR: [{ role: "AVALIADOR" as const }, { papeisExtras: { has: "AVALIADOR" as const } }] };

  /** Avaliadores com instituição, EXTERNO e carga atual (para a distribuição e o remanejamento). */
  async listarAvaliadores() {
    const edicao = await edicaoAtual(this.prisma);
    const users = await this.prisma.user.findMany({
      where: this.ehAvaliador,
      select: { id: true, nome: true, email: true, role: true, instituicaoId: true, instituicao: { select: { sigla: true, nome: true } } },
      orderBy: { nome: "asc" },
    });
    const cargas = edicao
      ? await this.prisma.atribuicaoFase2.groupBy({
          by: ["avaliadorId"],
          where: { inscricao: { edicaoId: edicao.id }, status: { not: "REMANEJADA" } },
          _count: { _all: true },
        })
      : [];
    const carga = new Map(cargas.map((c) => [c.avaliadorId, c._count._all]));
    return users.map((u) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      perfilPrincipal: u.role,
      instituicaoId: u.instituicaoId,
      instituicao: u.instituicao?.sigla ?? null,
      externo: ehExterno(u.instituicao),
      carga: carga.get(u.id) ?? 0,
      capacidade: CAPACIDADE_AVALIADOR,
    }));
  }

  /**
   * Distribui os participantes que enviaram materiais entre os avaliadores
   * escolhidos, pelas regras de fase2-distribuicao.ts. Com `simular`, só
   * devolve o plano (nada é gravado).
   */
  async distribuirAvaliadores(avaliadorIds: string[], actorId: string, { simular = false }: { simular?: boolean } = {}, agora = new Date()) {
    const edicao = await this.edicaoOuErro();
    if (situacaoEnvio(edicao.fase2InicioEm, edicao.fase2PrazoEm, agora) !== "ENCERRADA") {
      throw new BadRequestException("A distribuição só pode ser feita após o encerramento do prazo de envio.");
    }
    const ids = [...new Set(avaliadorIds)];
    const todos = await this.listarAvaliadores();
    const escolhidos = todos.filter((a) => ids.includes(a.id));
    if (escolhidos.length !== ids.length) throw new BadRequestException("Lista de avaliadores inválida.");
    // 3 no mínimo: com só 2, não haveria quem fizesse a 3ª avaliação.
    if (ids.length < 3) throw new BadRequestException("Selecione pelo menos 3 avaliadores.");

    const ja = await this.prisma.atribuicaoFase2.count({ where: { inscricao: { edicaoId: edicao.id } } });
    if (ja > 0) throw new BadRequestException("A distribuição já foi feita.");

    const comEnvio = await this.prisma.inscricao.findMany({
      where: { edicaoId: edicao.id, fase2Classificado: true, enviosFase2: { some: {} } },
      select: { id: true, instituicaoId: true, instituicao: { select: { sigla: true } } },
    });
    if (!comEnvio.length) throw new BadRequestException("Nenhum participante enviou os materiais.");

    const plano = planejarDistribuicao(
      comEnvio.map((i) => ({ id: i.id, instituicaoId: i.instituicaoId })),
      escolhidos.map((a) => ({ id: a.id, instituicaoId: a.instituicaoId, externo: a.externo, carga: a.carga })),
      { semente: randomInt(1, 2 ** 31 - 1) },
    );
    if (!plano.ok) throw new BadRequestException(plano.erro);

    const resumo = {
      participantes: comEnvio.length,
      avaliadores: escolhidos.length,
      atribuicoes: plano.atribuicoes.length,
      primeiroExterno: comEnvio.length - plano.primeiroNaoExterno,
      primeiroNaoExterno: plano.primeiroNaoExterno,
      vagasLivresPara3o: plano.vagasLivres,
      externos: escolhidos.filter((a) => a.externo).length,
      cargas: escolhidos
        .map((a) => ({ id: a.id, nome: a.nome, instituicao: a.instituicao, externo: a.externo, carga: plano.cargas[a.id] ?? 0 }))
        .sort((x, y) => y.carga - x.carga || x.nome.localeCompare(y.nome)),
      porInstituicao: Object.entries(
        comEnvio.reduce<Record<string, number>>((m, i) => ({ ...m, [i.instituicao.sigla]: (m[i.instituicao.sigla] ?? 0) + 1 }), {}),
      ).map(([sigla, participantes]) => ({ sigla, participantes })),
    };
    if (simular) return { simulacao: true, ...resumo };

    await this.prisma.$transaction(async (tx) => {
      // Trava contra dois cliques simultâneos.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${"distribuir:" + edicao.id}))`;
      const jaDentro = await tx.atribuicaoFase2.count({ where: { inscricao: { edicaoId: edicao.id } } });
      if (jaDentro > 0) throw new BadRequestException("A distribuição já foi feita.");
      await tx.atribuicaoFase2.createMany({
        data: plano.atribuicoes.map((a) => ({ ...a, atribuidoEm: agora, atribuidoPorId: actorId })),
      });
    });
    await this.auditoria.log(actorId, "DISTRIBUIR_FASE2", "Edicao", edicao.id, {
      participantes: resumo.participantes,
      avaliadores: ids,
      atribuicoes: resumo.atribuicoes,
      primeiroNaoExterno: resumo.primeiroNaoExterno,
    });
    return { simulacao: false, ...resumo };
  }

  /**
   * Redistribui as avaliações PENDENTES sem rascunho para equilibrar a carga
   * (ex.: avaliadores que aceitaram o convite depois da distribuição). As
   * concluídas e as que têm rascunho salvo não saem do avaliador. As regras
   * são as da distribuição. Com `simular`, só devolve o plano.
   */
  async redistribuirPendentes(avaliadorIds: string[] | undefined, actorId: string, { simular = false }: { simular?: boolean } = {}) {
    const edicao = await this.edicaoOuErro();
    const ativas = await this.prisma.atribuicaoFase2.findMany({
      where: { inscricao: { edicaoId: edicao.id }, status: { not: "REMANEJADA" } },
      select: { id: true, inscricaoId: true, avaliadorId: true, ordem: true, status: true, inscricao: { select: { instituicaoId: true } } },
    });
    if (!ativas.length) throw new BadRequestException("A distribuição ainda não foi feita.");
    const historico = await this.prisma.atribuicaoFase2.findMany({
      where: { inscricao: { edicaoId: edicao.id } },
      select: { inscricaoId: true, avaliadorId: true },
    });
    const rascunhos = await this.prisma.avaliacaoFase2.findMany({
      where: { concluida: false, inscricao: { edicaoId: edicao.id } },
      select: { inscricaoId: true, avaliadorId: true },
    });
    const comRascunho = new Set(rascunhos.map((r) => `${r.inscricaoId}|${r.avaliadorId}`));

    const lista = await this.listarAvaliadores();
    const conhecidos = new Set(lista.map((a) => a.id));
    // Quem tem atribuição mas deixou de ser avaliador: pode manter, não recebe.
    const extras = await this.prisma.user.findMany({
      where: { id: { in: [...new Set(ativas.map((a) => a.avaliadorId))].filter((id) => !conhecidos.has(id)) } },
      select: { id: true, nome: true, instituicaoId: true, instituicao: { select: { sigla: true, nome: true } } },
    });
    const selecionados = avaliadorIds?.length ? new Set(avaliadorIds) : null;
    const moveis = ativas.filter((a) => a.status === "PENDENTE" && !comRascunho.has(`${a.inscricaoId}|${a.avaliadorId}`));
    const idsMoveis = new Set(moveis.map((m) => m.id));
    const fixa = new Map<string, number>();
    for (const a of ativas) if (!idsMoveis.has(a.id)) fixa.set(a.avaliadorId, (fixa.get(a.avaliadorId) ?? 0) + 1);

    const avaliadores = [
      ...lista.map((a) => ({ id: a.id, nome: a.nome, instituicao: a.instituicao, instituicaoId: a.instituicaoId, externo: a.externo, cargaFixa: fixa.get(a.id) ?? 0, recebe: !!a.instituicaoId && (!selecionados || selecionados.has(a.id)) })),
      ...extras.map((u) => ({ id: u.id, nome: u.nome, instituicao: u.instituicao?.sigla ?? null, instituicaoId: u.instituicaoId, externo: ehExterno(u.instituicao), cargaFixa: fixa.get(u.id) ?? 0, recebe: false })),
    ];
    const jaAtribuidos = new Map<string, Set<string>>();
    for (const h of historico) jaAtribuidos.set(h.inscricaoId, new Set([...(jaAtribuidos.get(h.inscricaoId) ?? []), h.avaliadorId]));

    const plano = planejarRedistribuicao(
      moveis.map((m) => ({ atribuicaoId: m.id, inscricaoId: m.inscricaoId, participanteInstituicaoId: m.inscricao.instituicaoId, ordem: m.ordem, avaliadorAtualId: m.avaliadorId })),
      avaliadores,
      jaAtribuidos,
    );
    if (!plano.ok) throw new BadRequestException(plano.erro);

    const resumo = {
      pendentesMoveis: moveis.length,
      fixas: ativas.length - moveis.length,
      movimentos: plano.movimentos.length,
      semParticipantesAntes: avaliadores.filter((a) => (plano.cargasAntes[a.id] ?? 0) === 0 && a.recebe).length,
      semParticipantesDepois: avaliadores.filter((a) => (plano.cargasDepois[a.id] ?? 0) === 0 && a.recebe).length,
      cargas: avaliadores
        .map((a) => ({ id: a.id, nome: a.nome, instituicao: a.instituicao, externo: a.externo, recebe: a.recebe, antes: plano.cargasAntes[a.id] ?? 0, depois: plano.cargasDepois[a.id] ?? 0 }))
        .sort((x, y) => y.depois - x.depois || x.nome.localeCompare(y.nome)),
    };
    if (simular || !plano.movimentos.length) return { simulacao: simular, aplicados: 0, ...resumo };

    const agora = new Date();
    const aplicados = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${"distribuir:" + edicao.id}))`;
      let n = 0;
      for (const m of plano.movimentos) {
        // Confere de novo: o avaliador pode ter concluído ou salvo rascunho no meio-tempo.
        const atual = await tx.atribuicaoFase2.findUnique({ where: { id: m.atribuicaoId }, select: { status: true } });
        const rasc = await tx.avaliacaoFase2.findUnique({ where: { inscricaoId_avaliadorId: { inscricaoId: m.inscricaoId, avaliadorId: m.de } }, select: { id: true } });
        if (atual?.status !== "PENDENTE" || rasc) continue;
        await tx.atribuicaoFase2.update({ where: { id: m.atribuicaoId }, data: { status: "REMANEJADA" } });
        await tx.atribuicaoFase2.create({ data: { inscricaoId: m.inscricaoId, avaliadorId: m.para, ordem: m.ordem, atribuidoEm: agora, atribuidoPorId: actorId } });
        n++;
      }
      return n;
    });
    await this.auditoria.log(actorId, "REDISTRIBUIR_FASE2", "Edicao", edicao.id, {
      movimentos: plano.movimentos.length,
      aplicados,
      avaliadoresSelecionados: avaliadorIds ?? "todos com instituição",
    });
    return { simulacao: false, aplicados, ...resumo };
  }

  async remanejar(atribuicaoId: string, novoAvaliadorId: string, actorId: string) {
    const atual = await this.prisma.atribuicaoFase2.findUnique({ where: { id: atribuicaoId } });
    if (!atual) throw new NotFoundException("Atribuição não encontrada");
    if (atual.status !== "PENDENTE") {
      throw new BadRequestException("Só é possível remanejar uma avaliação pendente.");
    }
    const novo = (await this.listarAvaliadores()).find((x) => x.id === novoAvaliadorId);
    if (!novo) throw new BadRequestException("Avaliador inválido.");
    const insc = await this.prisma.inscricao.findUnique({ where: { id: atual.inscricaoId }, select: { instituicaoId: true } });
    if (!insc || !podeAvaliar(novo, insc.instituicaoId)) {
      throw new BadRequestException("O avaliador deve ser de instituição diferente da do participante (e ter instituição cadastrada).");
    }
    if (novo.carga >= CAPACIDADE_AVALIADOR) {
      throw new BadRequestException(`Este avaliador já tem ${novo.carga} participantes (máximo ${CAPACIDADE_AVALIADOR}).`);
    }
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
        "Inscrição", "Nome", "Instituição", "Enviou", "Envio completo", "Último envio", "Arquivo vídeo", "Arquivo portfólio", "Link vídeo", "Link portfólio",
        "Avaliador 1", "Nota 1", "Avaliador 2", "Nota 2", "Avaliador 3", "Nota 3", "Nota Fase 2", "Situação",
      ].join(";"),
    ];
    for (const x of p.participantes) {
      const por = (o: number) => x.atribuicoes.find((a) => a.ordem === o);
      linhas.push(
        [
          x.numero, x.nome, x.instituicao, x.ultimoEnvio ? "Sim" : "Não", x.envioCompleto ? "Sim" : "Não", fmt(x.ultimoEnvio?.enviadoEm),
          x.ultimoEnvio?.video?.nome, x.ultimoEnvio?.portfolio?.nome,
          x.ultimoEnvio?.videoLink, x.ultimoEnvio?.portfolioLink,
          por(1)?.avaliador, por(1)?.nota, por(2)?.avaliador, por(2)?.nota, por(3)?.avaliador, por(3)?.nota,
          x.fase2Nota, x.situacaoAvaliacao,
        ].map(esc).join(";"),
      );
    }
    return "﻿" + linhas.join("\n");
  }
}

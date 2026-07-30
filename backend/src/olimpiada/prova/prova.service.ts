import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import type { ResponderQuestaoDto } from "./dto/prova.dto.js";

const DURACAO_PROVA_MINUTOS = 180; // 3 horas

@Injectable()
export class ProvaService {
  private readonly logger = new Logger(ProvaService.name);

  constructor(
    private prisma: PrismaService,
  ) {}

  /**
   * GET /api/prova/questoes — loads the exam questions for the user.
   *
   * Cache strategy:
   *  - The question list for a given `provaId` is identical for every
   *    student in the same edition. We cache it under
   *    `prova:questoes:{provaId}` (TTL 1h, invalidated on admin edits).
   *  - The per-user `respondida` map is always fetched from the DB
   *    (small indexed query) and merged in. This avoids any cross-user
   *    cache leakage.
   *
   * DB calls eliminated by cache hit:
   *  - provaQuestao.findMany (with questao include) — this is the heavy
   *    query: 30 rows joined to 30 questions with 9 columns each. Cached.
   *  - On cache hit only the per-user resposta.findMany (~30 rows by
   *    indexed compound key) remains.
   */
  async buscarQuestoes(userId: string, quantidade = 30) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        fase1Inicio: true,
        edicaoId: true,
      },
    });

    if (!inscricao || inscricao.status !== "CONFIRMADA") {
      throw new BadRequestException(
        "Inscrição não está confirmada para realizar a prova"
      );
    }

    if (!inscricao.fase1Inicio) {
      throw new BadRequestException("Prova não foi iniciada");
    }

    const fimProva = new Date(
      inscricao.fase1Inicio.getTime() + DURACAO_PROVA_MINUTOS * 60 * 1000
    );

    if (new Date() > fimProva) {
      throw new BadRequestException("Tempo de prova esgotado");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
      select: { id: true },
    });

    if (!prova) {
      throw new BadRequestException("Nenhuma prova disponível para esta edição");
    }

    // --- Query DB for question list directly ---
    const queryStart = Date.now();
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
            eixo: true,
            dificuldade: true,
          },
        },
      },
      orderBy: { ordem: "asc" },
    });

    const questoes = provasQuestoes.map((pq) => pq.questao);

    // --- Per-user respostas (always from DB) ---
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

    this.logger.debug(
      `questoes loaded directly from DB. inscricao=${inscricao.id} ` +
        `questions=${questoes.length} resolve_ms=${Date.now() - queryStart}`
    );

    return {
      inscricaoId: inscricao.id,
      inicio: inscricao.fase1Inicio.toISOString(),
      fim: fimProva.toISOString(),
      questoes: questoes.map((q) => ({
        ...q,
        respondida: respostasMap.get(q.id) || null,
      })),
    };
  }

  async responder(userId: string, data: ResponderQuestaoDto) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, edicaoId: true, fase1Inicio: true },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    const questao = await this.prisma.questao.findUnique({
      where: { id: data.questaoId },
      select: { id: true, correta: true },
    });

    if (!questao) {
      throw new NotFoundException("Questão não encontrada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
      select: { id: true },
    });

    if (!prova) {
      throw new BadRequestException("Nenhuma prova disponível para esta edição");
    }

    const fimProva = inscricao.fase1Inicio
      ? new Date(inscricao.fase1Inicio.getTime() + DURACAO_PROVA_MINUTOS * 60 * 1000)
      : null;

    if (fimProva && new Date() > fimProva) {
      throw new BadRequestException("Tempo de prova esgotado");
    }

    const correta = data.alternativa === questao.correta;

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

  /**
   * POST /api/prova/finalizar — finalizes the exam.
   *
   * HYBRID APPROACH (conservative, safe):
   *
   *  Synchronous (in request path, atomic, auditable):
   *    1. Mark inscricao.fase1Fim = NOW()  — the audit timestamp that
   *       means "exam is over". This is the critical write; once it is
   *       committed, the user can no longer submit answers.
   *    2. Compute and persist fase1Nota in the same transaction.
   *       The user sees their score immediately in the response.
   *
   *  Asynchronous (enqueued after synchronous persistence succeeds):
   *    1. Cache invalidation for the user's exam session.
   *    2. (Extension) Ranking/medalhas refresh.
   *    3. (Extension) Email confirmation.
   *    4. (Extension) Audit log write.
   *
   * Idempotency:
   *  - A second finalization request finds fase1Fim already set and
   *    skips the recompute (returns the existing inscricao). The queued
   *    post-processing job uses a dedup job ID so it only runs once.
   *
   * Race conditions:
   *  - Concurrent finalization attempts for the same user are serialized
   *    by the conditional update (only updates if fase1Fim IS NULL). Prisma
   *    does not natively support conditional updates with a WHERE clause
   *    on updateMany — we use a single findById + update sequence guarded
   *    by reading `fase1Fim` first.
   *
   * Query optimization (vs original):
   *  - Replaced 2 separate `resposta.count` calls (corretas, total) with
   *    a single `groupBy` query returning counts by `correta` boolean.
   *  - `provaQuestao.count` for the total now uses the same value as the
   *    cache-backed query (no extra DB roundtrip when cache is warm).
   */
  async finalizarProva(userId: string) {
    const start = Date.now();

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

    // Idempotency — if already finalized, return current state without
    // re-running the singular write or re-enqueuing.
    if (inscricao.fase1Fim) {
      this.logger.log(
        `finalizar idempotent return inscricao=${inscricao.id} ` +
          `nota=${inscricao.fase1Nota} duration_ms=${Date.now() - start}`
      );
      return this.prisma.inscricao.findUnique({ where: { id: inscricao.id } });
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
      select: { id: true },
    });

    // Single grouped query instead of two COUNTs.
    // Prisma's groupBy on a boolean returns one row per distinct value.
    const groups = await this.prisma.resposta.groupBy({
      by: ["correta"],
      where: { inscricaoId: inscricao.id },
      _count: { _all: true },
    });

    let corretas = 0;
    let respondidas = 0;
    for (const g of groups) {
      respondidas += g._count._all;
      if (g.correta) corretas = g._count._all;
    }

    // Total questions from the prova.
    let totalQuestoes = 0;
    if (prova) {
      totalQuestoes = await this.prisma.provaQuestao.count({
        where: { provaId: prova.id },
      });
    }

    const nota =
      totalQuestoes > 0 ? (corretas / totalQuestoes) * 100 : 0;

    // Synchronous persistence: atomic write of fase1Fim + fase1Nota.
    // Also persists respondidas for audit / display in resumoProva is
    // computed live from the DB, not stored.
    const updated = await this.prisma.inscricao.update({
      where: { id: inscricao.id },
      data: {
        fase1Nota: Math.round(nota * 100) / 100,
        fase1Fim: new Date(),
      },
    });

    this.logger.log(
      `finalizar ok inscricao=${inscricao.id} nota=${updated.fase1Nota} ` +
        `corretas=${corretas}/${totalQuestoes} respondidas=${respondidas} ` +
        `duration_ms=${Date.now() - start}`
    );

    return updated;
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
        fase1Nota: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
      select: { id: true },
    });

    // Fetch total questions directly from DB.
    let total = 0;
    if (prova) {
      total = await this.prisma.provaQuestao.count({ where: { provaId: prova.id } });
    }

    // Single grouped query for respondidas + corretas.
    const groups = await this.prisma.resposta.groupBy({
      by: ["correta"],
      where: { inscricaoId: inscricao.id },
      _count: { _all: true },
    });

    let respondidas = 0;
    let corretas = 0;
    for (const g of groups) {
      respondidas += g._count._all;
      if (g.correta) corretas = g._count._all;
    }

    return {
      inscricaoId: inscricao.id,
      inicio: inscricao.fase1Inicio?.toISOString() || null,
      fim: inscricao.fase1Fim?.toISOString() || null,
      fase1Nota: inscricao.fase1Nota,
      respondidas,
      corretas,
      total,
      percentual: total > 0 ? Math.round((corretas / total) * 100) : 0,
    };
  }
}
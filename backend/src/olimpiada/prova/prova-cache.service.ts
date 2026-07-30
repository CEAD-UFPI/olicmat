import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../../redis/redis.service.js";

/**
 * ProvaCacheService — Redis-backed cache for the exam questions payload.
 *
 * Cache strategy:
 *  - The list of questions for a given `provaId` is identical for every
 *    student in the same edition. We cache that list (without per-user
 *    `respondida` field) under key `prova:questoes:{provaId}`.
 *  - The per-user `respondida` map is fetched from the DB on every request
 *    (a small, indexed query on Resposta) and merged in. This is cheap
 *    and avoids any cross-user cache leakage.
 *  - TTL is 1 hour. An exam lasts 3 hours, but admins may edit question
 *    sets, so a shorter TTL plus explicit invalidation is safer.
 *
 * Invalidation:
 *  - On any answer submission (responder) we do NOT invalidate the
 *    shared questions cache (questions themselves did not change).
 *  - On finalization we invalidate the per-user respostas + the user's
 *    ability to load questions (cache key for prova is shared, but
 *    finalization also sets fase1Fim so the service refuses to serve
 *    anyway).
 *  - Admin endpoints that mutate Prova/Questao/ProvaQuestao call
 *    `invalidateProvaQuestions(provaId)` to bust the cache.
 *
 * Fallback:
 *  - If Redis is unavailable, every method is a no-op and the service
 *    behaves as if there were no cache (DB is hit directly).
 */
const QUESTOES_TTL_SECONDS = 60 * 60; // 1 hour
const RANKING_TTL_SECONDS = 60 * 5; // 5 minutes

@Injectable()
export class ProvaCacheService {
  private readonly logger = new Logger(ProvaCacheService.name);

  // Metrics counters (in-memory, per-instance; not shared)
  private hits = 0;
  private misses = 0;

  constructor(private readonly redis: RedisService) {}

  // ---------- Exam questions cache ----------

  private questoesKey(provaId: string): string {
    return `prova:questoes:${provaId}`;
  }

  /**
   * Get the cached question list for a prova (without `respondida`).
   * Returns null on miss or when Redis is unavailable.
   */
  async getQuestoes(provaId: string): Promise<any[] | null> {
    const raw = await this.redis.get(this.questoesKey(provaId));
    if (!raw) {
      this.misses++;
      return null;
    }
    this.hits++;
    try {
      return JSON.parse(raw);
    } catch {
      this.logger.warn(`Corrupt cache at ${this.questoesKey(provaId)} — invalidating`);
      await this.invalidateProvaQuestions(provaId);
      return null;
    }
  }

  /** Cache the question list for a prova (without per-user data). */
  async setQuestoes(provaId: string, questoes: any[]): Promise<void> {
    await this.redis.set(
      this.questoesKey(provaId),
      JSON.stringify(questoes),
      QUESTOES_TTL_SECONDS
    );
  }

  /** Invalidate the shared question list for a prova. */
  async invalidateProvaQuestions(provaId: string): Promise<void> {
    await this.redis.del(this.questoesKey(provaId));
  }

  /**
   * Invalidate any per-user caches tied to a user finalizing/leaving the
   * exam. Currently a no-op because the question list is shared, but kept
   * as an extension point (e.g. for a per-user "exam status" cache).
   */
  async invalidateUserQuestions(userId: string): Promise<void> {
    // Intentionally empty — question cache is shared, not per-user.
    // Reserved for future per-user caches (e.g. exam progress).
    void userId;
  }

  // ---------- Ranking cache (reserved for ranking service) ----------

  private rankingKey(estado?: string): string {
    return `ranking:${estado || "all"}`;
  }

  async getRanking(estado?: string): Promise<any | null> {
    const raw = await this.redis.get(this.rankingKey(estado));
    return raw ? JSON.parse(raw) : null;
  }

  async setRanking(estado: string | undefined, data: any): Promise<void> {
    await this.redis.set(this.rankingKey(estado), JSON.stringify(data), RANKING_TTL_SECONDS);
  }

  async invalidateRanking(): Promise<void> {
    await this.redis.delByPattern("ranking:*");
  }

  // ---------- Metrics ----------

  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRatio: total > 0 ? this.hits / total : 0,
    };
  }
}
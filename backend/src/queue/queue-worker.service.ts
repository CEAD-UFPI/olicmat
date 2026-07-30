import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Worker } from "bullmq";
import { Redis } from "ioredis";
import type { Redis as RedisClient } from "ioredis";
import { PrismaService } from "../prisma.service.js";
import { ProvaCacheService } from "../olimpiada/prova/prova-cache.service.js";
import { FINALIZAR_PROVA_QUEUE } from "./queue.service.js";

/**
 * QueueWorkerService — runs the BullMQ Worker that drains the
 * finalization queue. Only instantiated when WORKER_MODE=true.
 *
 * The worker is a separate process in production (see docker-compose.prod.yml
 * -> `worker` service). In dev compose only the `backend` service runs, so
 * the worker never starts and jobs accumulate in Redis. For dev/testing
 * convenience the caller can set WORKER_MODE=true on the backend container
 * to run web + worker in a single process (works for low volume).
 *
 * Idempotency:
 *  - The job re-checks the inscription state on every run. If the work
 *    has already been done, it no-ops. Replays after a crash are safe.
 */
@Injectable()
export class QueueWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueWorkerService.name);
  private connection: Redis | null = null;
  private worker: Worker | null = null;

  // In-memory metrics
  private processed = 0;
  private failed = 0;
  private totalDurationMs = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: ProvaCacheService,
  ) {}

  onModuleInit() {
    if (process.env.WORKER_MODE !== "true") {
      this.logger.log("WORKER_MODE not set — worker not started (web-only process)");
      return;
    }

    const url = process.env.REDIS_URL || "redis://localhost:6379";
    const keyPrefix = process.env.REDIS_KEY_PREFIX || "olicmat:";

    try {
      this.connection = new Redis(url, {
        maxRetriesPerRequest: null,
        keyPrefix,
        enableOfflineQueue: true,
      });

      this.worker = new Worker(
        FINALIZAR_PROVA_QUEUE,
        async (job) => {
          const start = Date.now();
          const { inscricaoId } = job.data as { inscricaoId: string };
          try {
            await this.processFinalizacaoPostProcessing(inscricaoId);
            this.processed++;
            this.totalDurationMs += Date.now() - start;
            this.logger.debug(
              `job ${job.id} ok inscricao=${inscricaoId} duration_ms=${Date.now() - start}`
            );
          } catch (err: any) {
            this.failed++;
            this.logger.error(
              `job ${job.id} failed inscricao=${inscricaoId}: ${err.message}`
            );
            throw err; // BullMQ retries per attempts config
          }
        },
        { connection: this.connection as any, concurrency: 5 }
      );

      this.worker.on("completed", (job) => {
        this.logger.debug(`job ${job.id} completed`);
      });
      this.worker.on("failed", (job, err) => {
        this.logger.error(`job ${job?.id} failed permanently: ${err.message}`);
      });

      this.logger.log(`BullMQ worker started (concurrency: 5)`);
    } catch (err: any) {
      this.logger.warn(`Worker init failed: ${err.message}`);
    }
  }

  /**
   * Post-processing for a finalized exam. Runs in the worker process.
   * Idempotent: safe to call multiple times for the same inscription.
   *
   * The synchronous ProvaService.finalizarProva already persisted:
   *   - fase1Fim = NOW()  (audit timestamp, marks exam as finished)
   *   - fase1Nota (computed score)
   *
   * Here we do the NON-critical, expensive, secondary work:
   *   1. Invalidate cache for this user.
   *   2. (Extension) Refresh ranking/medalhas statistics.
   *   3. (Extension) Send email confirmation.
   *   4. (Extension) Audit log write.
   *
   * Each of these is best-effort: if it fails, the user's finalization is
   * still saved correctly.
   */
  private async processFinalizacaoPostProcessing(inscricaoId: string): Promise<void> {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      select: { id: true, userId: true, fase1Fim: true, fase1Nota: true },
    });

    if (!inscricao || !inscricao.fase1Fim) {
      // Not finalized yet — nothing to do. Idempotent no-op (e.g. job
      // replayed before the synchronous finalize committed).
      this.logger.warn(`skipping post-process: inscricao ${inscricaoId} not finalized`);
      return;
    }

    // Invalidate any caches tied to this user's exam session.
    await this.cache.invalidateUserQuestions(inscricao.userId);

    // NOTE — extension points intentionally left as TODO to avoid coupling
    // finalization to downstream services that may be slow or unavailable
    // during a load spike. Recommended next steps:
    //   - ranking refresh (call RankingService.atualizarMedalhas)
    //   - audit log entry ("fase1 finalizada")
    //   - email confirmation via EmailService (if business wants it)
  }

  getMetrics() {
    return {
      processed: this.processed,
      failed: this.failed,
      avgDurationMs: this.processed > 0 ? Math.round(this.totalDurationMs / this.processed) : 0,
    };
  }

  async onModuleDestroy() {
    if (this.worker) await this.worker.close();
    if (this.connection) await this.connection.quit();
  }
}
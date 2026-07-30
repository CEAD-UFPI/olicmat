import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const FINALIZAR_PROVA_QUEUE = "finalizar-prova";

/**
 * QueueService — owns the BullMQ Queue and exposes enqueue methods.
 *
 * Only the web process enqueues jobs. The worker process (started in
 * QueueWorkerService when WORKER_MODE=true) consumes them.
 *
 * Fallback:
 *  - If Redis is unavailable at startup, `queue` stays null and every
 *    enqueue call becomes a no-op (logged). The caller MUST ensure the
 *    critical persisted work is already done synchronously before
 *    calling enqueue — see ProvaService.finalizarProva.
 */
@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private connection: Redis | null = null;
  private queue: Queue | null = null;

  // In-memory metrics
  private enqueued = 0;
  private dropped = 0;

  onModuleInit() {
    const url = process.env.REDIS_URL || "redis://localhost:6379";
    const keyPrefix = process.env.REDIS_KEY_PREFIX || "olicmat:";

    try {
      this.connection = new Redis(url, {
        maxRetriesPerRequest: null, // BullMQ requires this
        keyPrefix,
        enableOfflineQueue: true,
      });

      this.queue = new Queue(FINALIZAR_PROVA_QUEUE, {
        connection: this.connection as any,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: "exponential", delay: 2000 },
          removeOnComplete: { count: 1000 },
          removeOnFail: { count: 5000 },
        },
      });

      this.logger.log(`BullMQ queue '${FINALIZAR_PROVA_QUEUE}' initialized`);
    } catch (err: any) {
      this.logger.warn(`Queue init failed — running without queue: ${err.message}`);
      this.connection = null;
      this.queue = null;
    }
  }

  /**
   * Enqueue a finalization post-processing job. No-op if Redis unavailable.
   * Uses a deduplication jobId so repeated finalization requests for the
   * same inscription are coalesced into a single job (idempotency).
   */
  async enqueueFinalizacao(inscricaoId: string): Promise<void> {
    if (!this.queue) {
      this.dropped++;
      this.logger.warn(
        `Queue unavailable — skipping enqueue for inscricao ${inscricaoId}. ` +
          `Synchronous finalization already persisted the result; post-processing will not run.`
      );
      return;
    }

    try {
      await this.queue.add(
        "finalizar",
        { inscricaoId },
        { jobId: `finalizar:${inscricaoId}` }
      );
      this.enqueued++;
    } catch (err: any) {
      this.dropped++;
      this.logger.warn(`Enqueue failed for inscricao ${inscricaoId}: ${err.message}`);
    }
  }

  async getQueueDepth(): Promise<number> {
    if (!this.queue) return 0;
    try {
      const counts = await this.queue.getJobCounts("wait", "active", "delayed");
      return counts.wait + counts.active + counts.delayed;
    } catch {
      return 0;
    }
  }

  getMetrics() {
    return { enqueued: this.enqueued, dropped: this.dropped };
  }

  async onModuleDestroy() {
    if (this.queue) await this.queue.close();
    if (this.connection) await this.connection.quit();
  }
}
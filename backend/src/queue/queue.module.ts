import { Module, Global } from "@nestjs/common";
import { QueueService } from "./queue.service.js";
import { QueueWorkerService } from "./queue-worker.service.js";

/**
 * QueueModule — global module exposing QueueService (enqueue) and
 * QueueWorkerService (consume). The worker is only active when
 * WORKER_MODE=true (separate process in production).
 */
@Global()
@Module({
  providers: [QueueService, QueueWorkerService],
  exports: [QueueService, QueueWorkerService],
})
export class QueueModule {}
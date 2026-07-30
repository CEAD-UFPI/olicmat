import { Module, Global } from "@nestjs/common";
import { ProvaCacheService } from "./prova-cache.service.js";

/**
 * ProvaCacheModule — global module exposing ProvaCacheService.
 * Made @Global so the QueueWorkerService (in QueueModule) can inject
 * ProvaCacheService without an explicit import cycle between QueueModule
 * and OlimpiadaModule.
 */
@Global()
@Module({
  providers: [ProvaCacheService],
  exports: [ProvaCacheService],
})
export class ProvaCacheModule {}
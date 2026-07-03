import { Global, Module } from "@nestjs/common";
import { AuditoriaService } from "./auditoria.service.js";
import { AuditoriaController } from "./auditoria.controller.js";

@Global()
@Module({
  controllers: [AuditoriaController],
  providers: [AuditoriaService],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}

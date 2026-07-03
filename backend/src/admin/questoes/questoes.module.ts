import { Module } from "@nestjs/common";
import { QuestoesService } from "./questoes.service.js";
import { QuestoesController } from "./questoes.controller.js";

@Module({
  controllers: [QuestoesController],
  providers: [QuestoesService],
  exports: [QuestoesService],
})
export class QuestoesModule {}

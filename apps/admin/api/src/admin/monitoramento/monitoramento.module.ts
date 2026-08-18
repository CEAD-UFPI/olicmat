import { Module } from "@nestjs/common";
import { MonitoramentoController } from "./monitoramento.controller.js";
import { MonitoramentoService } from "./monitoramento.service.js";

@Module({
  controllers: [MonitoramentoController],
  providers: [MonitoramentoService],
  exports: [MonitoramentoService],
})
export class MonitoramentoModule {}

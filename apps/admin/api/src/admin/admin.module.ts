import { Module } from "@nestjs/common";
import { ProvasModule } from "./provas/provas.module.js";
import { QuestoesModule } from "./questoes/questoes.module.js";
import { DashboardModule } from "./dashboard/dashboard.module.js";
import { AuditoriaModule } from "./auditoria/auditoria.module.js";
import { AdminUsuariosModule } from "./usuarios/usuarios.module.js";
import { CursosModule } from "./cursos/cursos.module.js";
import { MonitoramentoModule } from "./monitoramento/monitoramento.module.js";

@Module({
  imports: [
    ProvasModule, QuestoesModule, DashboardModule,
    AuditoriaModule, AdminUsuariosModule, CursosModule,
    MonitoramentoModule,
  ],
  exports: [
    ProvasModule, QuestoesModule, DashboardModule,
    AuditoriaModule, AdminUsuariosModule, CursosModule,
    MonitoramentoModule,
  ],
})
export class AdminModule {}

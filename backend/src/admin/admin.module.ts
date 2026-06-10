import { Module } from "@nestjs/common";
import { ProvasModule } from "./provas/provas.module.js";
import { QuestoesModule } from "./questoes/questoes.module.js";
import { AvaliacaoModule } from "./avaliacao/avaliacao.module.js";
import { DashboardModule } from "./dashboard/dashboard.module.js";
import { AuditoriaModule } from "./auditoria/auditoria.module.js";
import { AdminUsuariosModule } from "./usuarios/usuarios.module.js";

@Module({
  imports: [
    ProvasModule, QuestoesModule, AvaliacaoModule, DashboardModule,
    AuditoriaModule, AdminUsuariosModule,
  ],
  exports: [
    ProvasModule, QuestoesModule, AvaliacaoModule, DashboardModule,
    AuditoriaModule, AdminUsuariosModule,
  ],
})
export class AdminModule {}

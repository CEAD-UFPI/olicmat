import { Module } from "@nestjs/common";
import { ProvasModule } from "./provas/provas.module.js";
import { QuestoesModule } from "./questoes/questoes.module.js";
import { DashboardModule } from "./dashboard/dashboard.module.js";
import { AuditoriaModule } from "./auditoria/auditoria.module.js";
import { AdminUsuariosModule } from "./usuarios/usuarios.module.js";
import { CursosModule } from "./cursos/cursos.module.js";

@Module({
  imports: [
    ProvasModule, QuestoesModule, DashboardModule,
    AuditoriaModule, AdminUsuariosModule, CursosModule,
  ],
  exports: [
    ProvasModule, QuestoesModule, DashboardModule,
    AuditoriaModule, AdminUsuariosModule, CursosModule,
  ],
})
export class AdminModule {}

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { ProvasModule } from "./provas/provas.module.js";
import { QuestoesModule } from "./questoes/questoes.module.js";
import { AvaliacaoModule } from "./avaliacao/avaliacao.module.js";
import { DashboardModule } from "./dashboard/dashboard.module.js";
import { AuditoriaModule } from "./auditoria/auditoria.module.js";
import { AdminUsuariosModule } from "./usuarios/usuarios.module.js";
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    Module({
        imports: [
            ProvasModule, QuestoesModule, AvaliacaoModule, DashboardModule,
            AuditoriaModule, AdminUsuariosModule,
        ],
        exports: [
            ProvasModule, QuestoesModule, AvaliacaoModule, DashboardModule,
            AuditoriaModule, AdminUsuariosModule,
        ],
    })
], AdminModule);
export { AdminModule };
//# sourceMappingURL=admin.module.js.map
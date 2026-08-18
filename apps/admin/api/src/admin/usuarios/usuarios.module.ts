import { Module } from "@nestjs/common";
import { AdminUsuariosService } from "./usuarios.service.js";
import { AdminUsuariosController } from "./usuarios.controller.js";
import { EmailModule } from "../../email/email.module.js";
import { AuditoriaModule } from "../auditoria/auditoria.module.js";

@Module({
  imports: [EmailModule, AuditoriaModule],
  controllers: [AdminUsuariosController],
  providers: [AdminUsuariosService],
  exports: [AdminUsuariosService],
})
export class AdminUsuariosModule {}

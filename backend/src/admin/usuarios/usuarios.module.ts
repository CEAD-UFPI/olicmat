import { Module } from "@nestjs/common";
import { AdminUsuariosService } from "./usuarios.service.js";
import { AdminUsuariosController } from "./usuarios.controller.js";

@Module({
  controllers: [AdminUsuariosController],
  providers: [AdminUsuariosService],
  exports: [AdminUsuariosService],
})
export class AdminUsuariosModule {}

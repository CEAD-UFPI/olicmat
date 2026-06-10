import { Module } from "@nestjs/common";
import { AdminUsuariosService } from "./usuarios.service.js";
import { AdminUsuariosController } from "./usuarios.controller.js";
import { PrismaService } from "../../prisma.service.js";

@Module({
  controllers: [AdminUsuariosController],
  providers: [AdminUsuariosService, PrismaService],
  exports: [AdminUsuariosService],
})
export class AdminUsuariosModule {}

import { Module } from "@nestjs/common";
import { ModuloService } from "./modulos/modulo.service.js";
import { ModuloController } from "./modulos/modulo.controller.js";
import { CertificadoService } from "./certificado/certificado.service.js";
import { CertificadoController } from "./certificado/certificado.controller.js";
import { PrismaService } from "../prisma.service.js";

@Module({
  controllers: [ModuloController, CertificadoController],
  providers: [ModuloService, CertificadoService, PrismaService],
  exports: [ModuloService, CertificadoService],
})
export class LmsModule {}

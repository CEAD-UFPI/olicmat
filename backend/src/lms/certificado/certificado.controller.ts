import { Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { CertificadoService } from "./certificado.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("certificados")
@UseGuards(JwtAuthGuard)
export class CertificadoController {
  constructor(private readonly certificadoService: CertificadoService) {}

  @Post("emitir")
  async emitir(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.certificadoService.emitir(req.user.id);
  }

  @Get()
  async listar(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.certificadoService.meusCertificados(req.user.id);
  }
}

import { Controller, Get, Patch, Param, UseGuards, Request } from "@nestjs/common";
import { NotificacoesService } from "./notificacoes.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("notificacoes")
@UseGuards(JwtAuthGuard)
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Get()
  async listar(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.notificacoesService.listarPorUsuario(req.user.id);
  }

  @Patch(":id/lida")
  async marcarComoLida(
    @Param("id") id: string,
    @Request() req: ExpressReq & { user: AuthUser },
  ) {
    return this.notificacoesService.marcarComoLida(id, req.user.id);
  }
}

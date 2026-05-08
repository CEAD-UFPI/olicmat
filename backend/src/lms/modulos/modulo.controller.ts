import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ModuloService } from "./modulo.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("modulos")
@UseGuards(JwtAuthGuard)
export class ModuloController {
  constructor(private readonly moduloService: ModuloService) {}

  @Get()
  async listar() {
    return this.moduloService.listarTodos();
  }

  @Get("progresso")
  async progresso(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.moduloService.progressoGeral(req.user.id);
  }

  @Get(":id")
  async buscar(
    @Param("id") id: string,
    @Request() req: ExpressReq & { user: AuthUser }
  ) {
    return this.moduloService.buscarPorId(id, req.user.id);
  }

  @Post(":id/concluir")
  async concluir(
    @Param("id") id: string,
    @Request() req: ExpressReq & { user: AuthUser },
    @Body() body: { nota?: number }
  ) {
    return this.moduloService.concluirModulo(req.user.id, id, body.nota);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from "@nestjs/common";
import { ProvaService, MOTIVOS_FIM } from "./prova.service.js";
import type { MotivoFim } from "./prova.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { responderQuestaoSchema } from "./dto/prova.dto.js";
import type { ResponderQuestaoDto } from "./dto/prova.dto.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("prova")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvaController {
  constructor(private readonly provaService: ProvaService) {}

  @Post("iniciar")
  async iniciar(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.provaService.iniciarProva(req.user.id);
  }

  @Get("questoes")
  async buscarQuestoes(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.provaService.buscarQuestoes(req.user.id);
  }

  @Post("responder")
  async responder(
    @Request() req: ExpressReq & { user: AuthUser },
    @Body() body: ResponderQuestaoDto
  ) {
    const parsed = responderQuestaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.provaService.responder(req.user.id, parsed.data);
  }

  @Post("finalizar")
  async finalizar(
    @Request() req: ExpressReq & { user: AuthUser },
    @Body() body: { motivo?: string } | undefined,
  ) {
    const motivo = MOTIVOS_FIM.includes(body?.motivo as MotivoFim)
      ? (body?.motivo as MotivoFim)
      : "ALUNO";
    return this.provaService.finalizarProva(req.user.id, motivo);
  }

  @Get("estado")
  async estado(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.provaService.estadoProva(req.user.id);
  }

  @Post("advertencia")
  async advertencia(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.provaService.registrarAdvertencia(req.user.id);
  }

  @Get("resumo")
  async resumo(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.provaService.resumoProva(req.user.id);
  }
}

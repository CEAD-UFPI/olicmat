import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { MonitoramentoService } from "./monitoramento.service.js";
import { destravarSchema } from "./dto/monitoramento.dto.js";
import type { DestravarDto } from "./dto/monitoramento.dto.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("admin/monitoramento")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COMISSAO)
export class MonitoramentoController {
  constructor(private readonly monitoramentoService: MonitoramentoService) {}

  @Get()
  async listarEdicoesComProvas() {
    return this.monitoramentoService.listarEdicoesComProvas();
  }

  @Get("provas/:provaId/inscricoes")
  async listarInscricoesPorProva(@Param("provaId") provaId: string) {
    return this.monitoramentoService.listarInscricoesPorProva(provaId);
  }

  @Post("inscricoes/:id/reset-tempo")
  async resetarTempo(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser },
  ) {
    return this.monitoramentoService.resetarTempo(id, req.user.id);
  }

  @Post("inscricoes/:id/destravar")
  async destravar(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser },
    @Body() body: DestravarDto,
  ) {
    const parsed = destravarSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.monitoramentoService.destravar(
      id,
      parsed.data.justificativa,
      req.user.id,
    );
  }

  @Post("inscricoes/:id/senha-temporaria")
  async senhaTemporaria(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser },
  ) {
    return this.monitoramentoService.senhaTemporaria(id, req.user.id);
  }

  @Post("inscricoes/:id/liberar-sessao")
  async liberarSessao(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser },
  ) {
    return this.monitoramentoService.liberarSessao(id, req.user.id);
  }

  @Post("provas/:provaId/encerrar-pendentes")
  async encerrarPendentes(
    @Param("provaId") provaId: string,
    @Req() req: ExpressReq & { user: AuthUser },
  ) {
    return this.monitoramentoService.encerrarPendentes(provaId, req.user.id);
  }
}

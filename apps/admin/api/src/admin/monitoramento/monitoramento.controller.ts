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
import { adicionarTempoSchema } from "./dto/monitoramento.dto.js";
import type { AdicionarTempoDto } from "./dto/monitoramento.dto.js";
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

  @Post("inscricoes/:id/adicionar-tempo")
  async adicionarTempo(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser },
    @Body() body: AdicionarTempoDto,
  ) {
    const parsed = adicionarTempoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.monitoramentoService.adicionarTempo(
      id,
      parsed.data.minutos,
      req.user.id,
    );
  }
}

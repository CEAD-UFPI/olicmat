import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { AvaliacaoService } from "./avaliacao.service.js";
import { avaliarEnvioSchema } from "./dto/avaliacao.dto.js";
import type { AvaliarEnvioDto } from "./dto/avaliacao.dto.js";
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

@Controller("admin/avaliacao")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Get("pendentes")
  async listPending() {
    return this.avaliacaoService.listPending();
  }

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Post(":envioId/nota")
  async assignGrade(
    @Param("envioId") envioId: string,
    @Body() body: AvaliarEnvioDto,
    @Req() req: ExpressReq & { user: AuthUser }
  ) {
    const parsed = avaliarEnvioSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.avaliacaoService.assignGrade(envioId, parsed.data, req.user.id);
  }

  @Roles(Role.ADMIN, Role.AVALIADOR)
  @Get("historico")
  async listHistorico(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("nome") nome?: string,
  ) {
    return this.avaliacaoService.listHistorico(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      nome,
    );
  }
}

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
import { CorrecaoService } from "./correcao.service.js";
import { avaliarEnvioSchema } from "./dto/correcao.dto.js";
import type { AvaliarEnvioDto } from "./dto/correcao.dto.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("correcao")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CorrecaoController {
  constructor(private readonly correcaoService: CorrecaoService) {}

  @Roles(Role.AVALIADOR, Role.ADMIN, Role.COMISSAO)
  @Get("pendentes")
  async listPending() {
    return this.correcaoService.listPending();
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
    return this.correcaoService.assignGrade(envioId, parsed.data, req.user.id);
  }

  @Roles(Role.ADMIN, Role.AVALIADOR, Role.COMISSAO)
  @Get("historico")
  async listHistorico(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("nome") nome?: string,
  ) {
    return this.correcaoService.listHistorico(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      nome,
    );
  }
}

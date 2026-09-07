import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { CoordenacaoService } from "./coordenacao.service.js";
import { ConvitesService } from "../convites/convites.service.js";
import { convidarAlunosSchema } from "../convites/dto/convites.dto.js";
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

@Controller("coordenacao")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COORDENADOR_CURSO)
export class CoordenacaoController {
  constructor(
    private readonly coordenacaoService: CoordenacaoService,
    private readonly convitesService: ConvitesService,
  ) {}

  /**
   * Convida alunos do curso coordenado. Cada um recebe um link e completa o
   * próprio cadastro — a coordenação não precisa dos dados pessoais deles,
   * que é justamente o que o regulamento prevê.
   */
  @Post("convites")
  async convidarAlunos(
    @Req() req: ExpressReq & { user: AuthUser },
    @Body() body: unknown,
  ) {
    const parsed = convidarAlunosSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }

    return this.convitesService.convidarAlunos(
      parsed.data.alunos,
      req.user.id,
      parsed.data.cursoId,
      req.user.email,
    );
  }

  /** Acompanhamento dos convites já enviados pela coordenação. */
  @Get("convites")
  async listarConvites(@Req() req: ExpressReq & { user: AuthUser }) {
    const cursos = await this.coordenacaoService.listCursos(req.user.id);
    return this.convitesService.listarPorCursos(
      cursos.map((c: { id: string }) => c.id),
    );
  }

  @Get("alunos")
  async listAlunos(
    @Req() req: ExpressReq & { user: AuthUser },
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.coordenacaoService.listAlunos(req.user.id, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get("cursos")
  async listCursos(@Req() req: ExpressReq & { user: AuthUser }) {
    return this.coordenacaoService.listCursos(req.user.id);
  }

  @Get("inscricoes")
  async listInscricoes(
    @Req() req: ExpressReq & { user: AuthUser },
    @Query("cursoId") cursoId?: string,
    @Query("status") status?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.coordenacaoService.listInscricoes(
      req.user.id,
      { cursoId, status },
      {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      }
    );
  }

  @Get("monitoramento-inscricoes")
  async listMonitoramentoInscricoes(@Req() req: ExpressReq & { user: AuthUser }) {
    return this.coordenacaoService.listMonitoramentoInscricoes(req.user.id);
  }

  @Get("metricas")
  async getMetricas(@Req() req: ExpressReq & { user: AuthUser }) {
    return this.coordenacaoService.getMetricas(req.user.id);
  }
}

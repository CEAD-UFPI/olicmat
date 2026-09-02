import { Controller, Get, Post, Param, Query, Req, UseGuards } from "@nestjs/common";
import { Role } from "../../../generated/prisma/client.js";
import { RankingService } from "./ranking.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("ranking")
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  // Public: the landing page consumes this without an auth token.
  // Reads the published snapshot (controlled publication).
  @Get()
  async ranking(@Query("estado") estado?: string) {
    return this.rankingService.rankingPublicado(estado);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMISSAO)
  @Get("preview")
  async previewRanking(@Query("estado") estado?: string) {
    return this.rankingService.rankingPorEstado(estado);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("atualizar-medalhas")
  async atualizarMedalhas(@Req() req: ExpressReq & { user: AuthUser }) {
    return this.rankingService.atualizarMedalhas(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ALUNO, Role.COORDENADOR_CURSO, Role.COMISSAO, Role.AVALIADOR, Role.ADMIN)
  @Get("instituicoes")
  async rankingPorInstituicao() {
    return this.rankingService.rankingPorInstituicao();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ALUNO, Role.COORDENADOR_CURSO, Role.COMISSAO, Role.AVALIADOR, Role.ADMIN)
  @Get("curso")
  async rankingPorCurso(@Query("cursoId") cursoId?: string) {
    return this.rankingService.rankingPorCurso(cursoId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("publicar")
  async publicarRanking(
    @Req() req: ExpressReq & { user: AuthUser },
    @Query("edicaoId") edicaoId?: string,
  ) {
    return this.rankingService.publicarRanking(edicaoId, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ALUNO, Role.COORDENADOR_CURSO, Role.COMISSAO, Role.AVALIADOR, Role.ADMIN)
  @Get("publicado/:edicaoId")
  async getRankingPublicado(@Param("edicaoId") edicaoId: string) {
    return this.rankingService.getRankingPublicado(edicaoId);
  }
}

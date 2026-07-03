import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { Role } from "../../../generated/prisma/client.js";
import { RankingService } from "./ranking.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";

@Controller("ranking")
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ALUNO, Role.COORDENADOR_CURSO, Role.COMISSAO, Role.AVALIADOR, Role.ADMIN)
  @Get()
  async ranking(@Query("estado") estado?: string) {
    return this.rankingService.rankingPorEstado(estado);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("atualizar-medalhas")
  async atualizarMedalhas() {
    return this.rankingService.atualizarMedalhas();
  }
}

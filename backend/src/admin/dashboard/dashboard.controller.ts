import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Header,
  Query,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { z } from "zod";
import { DashboardService } from "./dashboard.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";

const criarEdicaoSchema = z.object({
  ano: z.number().int().min(2020, "Ano mínimo 2020"),
  titulo: z.string().min(2, "Título deve ter no mínimo 2 caracteres"),
});

const atualizarEdicaoSchema = z.object({
  titulo: z.string().min(2).optional(),
  status: z.enum(["PLANEJAMENTO", "ATIVA", "ENCERRADA"]).optional(),
});

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(Role.ADMIN)
  @Get("dashboard")
  async getMetrics() {
    return this.dashboardService.getMetrics();
  }

  @Roles(Role.ADMIN)
  @Get("metricas")
  async getResumo() {
    return this.dashboardService.getResumo();
  }

  @Roles(Role.ADMIN)
  @Get("export/inscricoes")
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", 'attachment; filename="inscricoes.csv"')
  async exportInscricoes(
    @Query("edicaoId") edicaoId?: string,
    @Query("estado") estado?: string,
    @Query("status") status?: string
  ) {
    return this.dashboardService.exportInscricoes({
      edicaoId,
      estado,
      status,
    });
  }

  @Roles(Role.ADMIN)
  @Get("export/usuarios")
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", 'attachment; filename="usuarios.csv"')
  async exportUsuarios() {
    return this.dashboardService.exportUsuarios();
  }

  @Roles(Role.ADMIN)
  @Get("export/provas")
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", 'attachment; filename="provas.csv"')
  async exportProvas() {
    return this.dashboardService.exportProvas();
  }

  @Roles(Role.ADMIN)
  @Get("export/resultados")
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", 'attachment; filename="resultados.csv"')
  async exportResultados() {
    return this.dashboardService.exportResultados();
  }

  @Roles(Role.ADMIN, Role.AVALIADOR)
  @Get("edicoes")
  async listEdicoes() {
    return this.dashboardService.listEdicoes();
  }

  @Roles(Role.ADMIN)
  @Post("edicoes")
  async createEdicao(@Body() body: unknown) {
    const parsed = criarEdicaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.dashboardService.createEdicao(parsed.data);
  }

  @Roles(Role.ADMIN)
  @Patch("edicoes/:id")
  async updateEdicao(@Param("id") id: string, @Body() body: unknown) {
    const parsed = atualizarEdicaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.dashboardService.updateEdicao(id, parsed.data);
  }

  @Roles(Role.ADMIN)
  @Delete("edicoes/:id")
  async deleteEdicao(@Param("id") id: string) {
    return this.dashboardService.deleteEdicao(id);
  }
}

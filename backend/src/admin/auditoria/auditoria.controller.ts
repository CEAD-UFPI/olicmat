import { Controller, Get, Query, Header, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { AuditoriaService } from "./auditoria.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";

@Controller("admin/auditoria")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Roles(Role.ADMIN, Role.COMISSAO)
  @Get()
  async findAll(
    @Query("entidade") entidade?: string,
    @Query("acao") acao?: string,
    @Query("actorId") actorId?: string,
    @Query("dataInicio") dataInicio?: string,
    @Query("dataFim") dataFim?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.auditoriaService.findAll({
      entidade,
      acao,
      actorId,
      dataInicio,
      dataFim,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Roles(Role.ADMIN, Role.COMISSAO)
  @Get("export")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", "attachment; filename=auditoria.csv")
  async exportCsv(
    @Query("entidade") entidade?: string,
    @Query("acao") acao?: string,
    @Query("dataInicio") dataInicio?: string,
    @Query("dataFim") dataFim?: string,
    @Res() res?: Response,
  ) {
    const csv = await this.auditoriaService.exportCsv({
      entidade,
      acao,
      dataInicio,
      dataFim,
    });
    res?.send(csv);
  }
}

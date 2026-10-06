import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { RelatoriosService } from "./relatorios.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";

@Controller("admin/relatorios")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RelatoriosController {
  constructor(private readonly service: RelatoriosService) {}

  @Roles(Role.ADMIN, Role.COMISSAO)
  @Get("inscricoes-confirmadas")
  async inscricoesConfirmadas(
    @Res() res: Response,
    @Query("edicaoId") edicaoId?: string,
  ) {
    const { buffer, filename } = await this.service.inscricoesConfirmadasPdf(edicaoId);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.length),
    });
    res.end(buffer);
  }
}

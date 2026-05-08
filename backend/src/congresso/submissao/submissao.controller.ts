import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SubmissaoService } from "./submissao.service.js";
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

@Controller("submissoes")
@UseGuards(JwtAuthGuard)
export class SubmissaoController {
  constructor(private readonly submissaoService: SubmissaoService) {}

  @Post()
  @UseInterceptors(FileInterceptor("arquivo"))
  async submeter(
    @Request() req: ExpressReq & { user: AuthUser },
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { titulo: string; resumo: string; tipo: "ARTIGO" | "POSTER" }
  ) {
    if (!file) throw new BadRequestException("Arquivo é obrigatório");
    if (!body.titulo) throw new BadRequestException("Título é obrigatório");
    if (!body.resumo) throw new BadRequestException("Resumo é obrigatório");
    if (!["ARTIGO", "POSTER"].includes(body.tipo)) throw new BadRequestException("Tipo inválido");

    return this.submissaoService.submeter(
      req.user.id,
      body.titulo,
      body.resumo,
      body.tipo,
      file
    );
  }

  @Get("minhas")
  async minhas(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.submissaoService.listarPorUsuario(req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles("ADMIN", "AVALIADOR")
  @Get()
  async listar(@Query("status") status?: string) {
    return this.submissaoService.listarTodas(status);
  }

  @UseGuards(RolesGuard)
  @Roles("ADMIN", "AVALIADOR")
  @Patch(":id")
  async atualizarStatus(
    @Param("id") id: string,
    @Body() body: { status: "APROVADO" | "REJEITADO" }
  ) {
    if (!["APROVADO", "REJEITADO"].includes(body.status)) {
      throw new BadRequestException("Status inválido");
    }
    return this.submissaoService.atualizarStatus(id, body.status);
  }
}

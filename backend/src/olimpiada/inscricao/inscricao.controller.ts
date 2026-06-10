import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { InscricaoService } from "./inscricao.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import {
  criarInscricaoSchema,
  editarInscricaoSchema,
} from "./dto/inscricao.dto.js";
import type { CriarInscricaoDto } from "./dto/inscricao.dto.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("inscricoes")
export class InscricaoController {
  constructor(private readonly inscricaoService: InscricaoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async criar(@Request() req: ExpressReq & { user: AuthUser }, @Body() body: CriarInscricaoDto) {
    const parsed = criarInscricaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.inscricaoService.criar(req.user.id, parsed.data);
  }

  @UseGuards(JwtAuthGuard)
  @Get("minha")
  async minha(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.inscricaoService.buscarPorUsuario(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("minha/iniciar-prova")
  async iniciarProva(@Request() req: ExpressReq & { user: AuthUser }) {
    const inscricao = await this.inscricaoService.buscarPorUsuario(req.user.id);
    return this.inscricaoService.iniciarProva(inscricao.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("minha/sortear-tema")
  async sortearTema(@Request() req: ExpressReq & { user: AuthUser }) {
    const inscricao = await this.inscricaoService.buscarPorUsuario(req.user.id);
    return this.inscricaoService.sortearTema(inscricao.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "AVALIADOR")
  @Get()
  async listar(@Query("status") status?: string) {
    return this.inscricaoService.listarTodas(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "AVALIADOR")
  @Patch(":id/confirmar")
  async confirmar(@Param("id") id: string) {
    return this.inscricaoService.confirmar(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "AVALIADOR")
  @Patch(":id/status")
  async atualizarStatus(
    @Param("id") id: string,
    @Body() body: { status: string }
  ) {
    const parsed = z.object({
      status: z.enum(["PENDENTE", "CONFIRMADA", "REJEITADA"]),
    }).safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.inscricaoService.atualizarStatus(id, parsed.data.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "AVALIADOR")
  @Patch(":id")
  async editar(@Param("id") id: string, @Body() body: unknown) {
    const parsed = editarInscricaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.inscricaoService.editar(id, parsed.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  async deletar(@Param("id") id: string) {
    return this.inscricaoService.deletar(id);
  }
}

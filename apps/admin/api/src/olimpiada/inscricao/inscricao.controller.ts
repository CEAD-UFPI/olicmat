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
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { z } from "zod";
import { InscricaoService } from "./inscricao.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
import {
  criarInscricaoSchema,
  editarInscricaoSchema,
} from "./dto/inscricao.dto.js";
import type { CriarInscricaoDto } from "./dto/inscricao.dto.js";
import type { Request as ExpressReq } from "express";
import { UploadService } from "../../upload/upload.service.js";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("inscricoes")
export class InscricaoController {
  constructor(
    private readonly inscricaoService: InscricaoService,
    private readonly uploadService: UploadService,
  ) {}

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
  @Roles(Role.ADMIN, Role.COMISSAO, Role.AVALIADOR)
  @Get()
  async listar(
    @Request() req: ExpressReq & { user: AuthUser },
    @Query("status") status?: string,
  ) {
    return this.inscricaoService.listarTodas(req.user.role, req.user.id, undefined, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMISSAO, Role.COORDENADOR_CURSO)
  @Patch(":id/confirmar")
  async confirmar(
    @Param("id") id: string,
    @Request() req: ExpressReq & { user: AuthUser },
  ) {
    return this.inscricaoService.confirmar(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMISSAO, Role.COORDENADOR_CURSO)
  @Patch(":id/status")
  async atualizarStatus(
    @Param("id") id: string,
    @Body() body: { status: string },
    @Request() req: ExpressReq & { user: AuthUser },
  ) {
    const parsed = z.object({
      status: z.enum(["PENDENTE", "CONFIRMADA", "REJEITADA"]),
    }).safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.inscricaoService.atualizarStatus(id, parsed.data.status, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(":id")
  async editar(@Param("id") id: string, @Body() body: unknown) {
    const parsed = editarInscricaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.inscricaoService.editar(id, parsed.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  async deletar(
    @Param("id") id: string,
    @Request() req: ExpressReq & { user: AuthUser },
  ) {
    return this.inscricaoService.deletar(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("comprovante")
  @UseInterceptors(FileInterceptor("comprovante"))
  async uploadComprovante(
    @Request() req: ExpressReq & { user: AuthUser },
    @UploadedFile() file: any,
  ) {
    const url = await this.uploadService.uploadArquivo(file, "comprovantes", "image");
    const inscricao = await this.inscricaoService.buscarPorUsuario(req.user.id);
    await this.inscricaoService.editar(inscricao.id, { comprovanteUrl: url });
    return { url };
  }
}

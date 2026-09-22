import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { LinksConviteService } from "./links-convite.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";
import {
  criarLinkConviteSchema,
  cadastrarPorLinkSchema,
} from "./dto/links-convite.dto.js";

interface ReqUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("coordenacao/link-convite")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COORDENADOR_CURSO)
export class CoordenacaoLinkConviteController {
  constructor(private readonly linksConviteService: LinksConviteService) {}

  @Get()
  async obter(@Req() req: Request) {
    const actor = req.user as ReqUser;
    return this.linksConviteService.obterLinkCoordenador(actor.id);
  }

  @Post()
  async gerar(@Req() req: Request) {
    const actor = req.user as ReqUser;
    return this.linksConviteService.gerarOuRegenerarLinkCoordenador(actor.id);
  }
}

@Controller("admin/links-convite")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COMISSAO)
export class AdminLinksConviteController {
  constructor(private readonly linksConviteService: LinksConviteService) {}

  @Get()
  async listar(@Query("page") page?: number, @Query("limit") limit?: number) {
    return this.linksConviteService.listarLinksAdmin({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post()
  async criar(@Body() body: unknown, @Req() req: Request) {
    const parsed = criarLinkConviteSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    const actor = req.user as ReqUser;
    return this.linksConviteService.criarLinkAdmin(parsed.data, actor);
  }

  @Post(":id/regenerar")
  async regenerar(@Param("id") id: string) {
    return this.linksConviteService.regenerarLinkAdmin(id);
  }
}

/**
 * Rota pública: quem se cadastra por aqui ainda não tem conta, então não há
 * como autenticar. O token no link é a credencial.
 */
@Controller("link-convite")
export class LinkConvitePublicoController {
  constructor(private readonly linksConviteService: LinksConviteService) {}

  @Get(":token")
  async buscar(@Param("token") token: string) {
    return this.linksConviteService.buscarPorToken(token);
  }

  @Post(":token/cadastrar")
  async cadastrar(@Param("token") token: string, @Body() body: unknown) {
    const parsed = cadastrarPorLinkSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.linksConviteService.cadastrar(token, parsed.data);
  }
}

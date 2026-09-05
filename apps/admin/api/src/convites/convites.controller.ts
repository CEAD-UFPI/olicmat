import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { ConvitesService } from "./convites.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";
import {
  aceitarConviteSchema,
  criarConvitesSchema,
} from "./dto/convites.dto.js";

interface ReqUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("admin/convites")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminConvitesController {
  constructor(private readonly convitesService: ConvitesService) {}

  @Post()
  async criar(@Body() body: unknown, @Req() req: Request) {
    const parsed = criarConvitesSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }

    const actor = req.user as ReqUser;
    return this.convitesService.criarEmLote(parsed.data.convites, actor.email);
  }

  @Get()
  async listar() {
    return this.convitesService.listar();
  }
}

/**
 * Rotas públicas: quem recebe o convite ainda não tem conta e, portanto,
 * não tem como autenticar. O token no link é a credencial.
 */
@Controller("convites")
export class ConvitesController {
  constructor(private readonly convitesService: ConvitesService) {}

  @Get(":token")
  async buscar(@Param("token") token: string) {
    return this.convitesService.buscarPorToken(token);
  }

  @Post(":token/aceitar")
  async aceitar(@Param("token") token: string, @Body() body: unknown) {
    const parsed = aceitarConviteSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }

    return this.convitesService.aceitar(token, parsed.data);
  }
}

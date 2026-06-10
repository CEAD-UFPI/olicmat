import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { z } from "zod";
import { InstituicoesService } from "./instituicoes.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";

const criarInstituicaoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  sigla: z.string().min(2, "Sigla deve ter no mínimo 2 caracteres").max(10),
  estado: z.string().length(2, "UF deve ter 2 caracteres").optional(),
});

const atualizarInstituicaoSchema = z.object({
  nome: z.string().min(2).optional(),
  sigla: z.string().min(2).max(10).optional(),
  estado: z.string().length(2).optional(),
});

@Controller()
export class InstituicoesController {
  constructor(private readonly instituicoesService: InstituicoesService) {}

  @Get("instituicoes")
  async findAll() {
    return this.instituicoesService.findAll();
  }

  @Get("instituicoes/:id")
  async findById(@Param("id") id: string) {
    return this.instituicoesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("admin/instituicoes")
  async create(@Body() body: unknown) {
    const parsed = criarInstituicaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.instituicoesService.create(parsed.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch("admin/instituicoes/:id")
  async update(@Param("id") id: string, @Body() body: unknown) {
    const parsed = atualizarInstituicaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.instituicoesService.update(id, parsed.data);
  }
}

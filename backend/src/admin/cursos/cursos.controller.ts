import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { z } from "zod";
import { CursosService } from "./cursos.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";

const criarCursoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  instituicaoId: z.string().uuid("Instituição inválida"),
});

const atualizarCursoSchema = z.object({
  nome: z.string().min(2).optional(),
  instituicaoId: z.string().uuid().optional(),
});

@Controller("admin/cursos")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Roles(Role.ADMIN, Role.AVALIADOR, Role.COMISSAO)
  @Get()
  async findAll(@Query("instituicaoId") instituicaoId?: string) {
    return this.cursosService.findAll(instituicaoId);
  }

  @Roles(Role.ADMIN, Role.AVALIADOR, Role.COMISSAO)
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.cursosService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: unknown) {
    const parsed = criarCursoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.cursosService.create(parsed.data);
  }

  @Roles(Role.ADMIN)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: unknown) {
    const parsed = atualizarCursoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.cursosService.update(id, parsed.data);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.cursosService.delete(id);
  }
}

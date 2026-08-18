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
import { InstituicoesService } from "./instituicoes.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";
import type { PaginationParams, PaginatedResult } from "../common/pagination.js";

const localizacaoEnum = z.enum(["URBANA", "RURAL"]);
const areaAssentamentoEnum = z.enum([
  "NAO_DIFERENCIADA", "AREA_ASSENTAMENTO", "TERRA_INDIGENA",
  "AREA_REMANESCENTE_QUILOMBO", "UNIDADE_USO_SUSTENTAVEL",
]);
const esferaAdministrativaEnum = z.enum([
  "FEDERAL", "ESTADUAL", "MUNICIPAL", "INSTITUTO_FEDERAL", "PRIVADA",
]);
const statusInstituicaoEnum = z.enum(["ATIVA", "INATIVA"]);
const tipoInstituicaoEnum = z.enum(["PERMANENTE", "TEMPORARIA"]);

const criarInstituicaoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  sigla: z.string().min(2, "Sigla deve ter no mínimo 2 caracteres").max(10),
  codigoInep: z.string().min(8, "Código INEP deve ter no mínimo 8 caracteres"),
  uf: z.string().length(2, "UF deve ter 2 caracteres").optional(),
  cep: z.string().optional(),
  municipio: z.string().optional(),
  complemento: z.string().optional(),
  pontoReferencia: z.string().optional(),
  localizacao: localizacaoEnum.optional(),
  areaAssentamento: areaAssentamentoEnum.optional(),
  esferaAdministrativa: esferaAdministrativaEnum.optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  status: statusInstituicaoEnum.optional(),
  tipo: tipoInstituicaoEnum.optional(),
});

const atualizarInstituicaoSchema = z.object({
  nome: z.string().min(2).optional(),
  sigla: z.string().min(2).max(10).optional(),
  codigoInep: z.string().min(8).optional(),
  uf: z.string().length(2).optional(),
  cep: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  complemento: z.string().nullable().optional(),
  pontoReferencia: z.string().nullable().optional(),
  localizacao: localizacaoEnum.nullable().optional(),
  areaAssentamento: areaAssentamentoEnum.nullable().optional(),
  esferaAdministrativa: esferaAdministrativaEnum.nullable().optional(),
  telefone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  status: statusInstituicaoEnum.optional(),
  tipo: tipoInstituicaoEnum.nullable().optional(),
});

@Controller()
export class InstituicoesController {
  constructor(private readonly instituicoesService: InstituicoesService) {}

  @Get("instituicoes")
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string
  ): Promise<PaginatedResult<any>> {
    return this.instituicoesService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
  }

  @Get("instituicoes/:id")
  async findById(@Param("id") id: string) {
    return this.instituicoesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMISSAO)
  @Post("admin/instituicoes")
  async create(@Body() body: unknown) {
    const parsed = criarInstituicaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.instituicoesService.create(parsed.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMISSAO)
  @Patch("admin/instituicoes/:id")
  async update(@Param("id") id: string, @Body() body: unknown) {
    const parsed = atualizarInstituicaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.instituicoesService.update(id, parsed.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMISSAO)
  @Delete("admin/instituicoes/:id")
  async delete(@Param("id") id: string) {
    return this.instituicoesService.delete(id);
  }
}

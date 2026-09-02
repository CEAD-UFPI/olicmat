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
  Req,
  BadRequestException,
} from "@nestjs/common";
import { ProvasService } from "./provas.service.js";
import {
  criarProvaSchema,
  atualizarProvaSchema,
  rejeitarProvaSchema,
} from "./dto/provas.dto.js";
import type {
  CriarProvaDto,
  AtualizarProvaDto,
  RejeitarProvaDto,
} from "./dto/provas.dto.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("admin/provas")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvasController {
  constructor(private readonly provasService: ProvasService) {}

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Post()
  async create(
    @Req() req: ExpressReq & { user: AuthUser },
    @Body() body: CriarProvaDto
  ) {
    const parsed = criarProvaSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.provasService.create(req.user.id, parsed.data);
  }

  @Roles(Role.AVALIADOR, Role.ADMIN, Role.COMISSAO)
  @Get()
  async findAll(
    @Query("edicaoId") edicaoId?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.provasService.findAll(edicaoId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Roles(Role.AVALIADOR, Role.ADMIN, Role.COMISSAO)
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.provasService.findById(id);
  }

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser },
    @Body() body: AtualizarProvaDto
  ) {
    const parsed = atualizarProvaSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }

    // AVALIADOR can only update draft exams
    if (req.user.role === Role.AVALIADOR) {
      const prova = await this.provasService.findById(id);
      if (prova.status !== "RASCUNHO") {
        throw new BadRequestException(
          "Apenas provas em rascunho podem ser editadas por avaliadores"
        );
      }
    }

    return this.provasService.update(id, parsed.data, req.user.id);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.provasService.delete(id);
  }

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Post(":id/submeter")
  async submeter(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser }
  ) {
    return this.provasService.submeterRevisao(id, req.user.id);
  }

  @Roles(Role.ADMIN)
  @Post(":id/rejeitar")
  async rejeitar(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser },
    @Body() body: RejeitarProvaDto
  ) {
    const parsed = rejeitarProvaSchema.safeParse(body ?? {});
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.provasService.rejeitar(id, req.user.id, parsed.data.observacao);
  }

  @Roles(Role.ADMIN)
  @Post(":id/publicar")
  async publicar(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser }
  ) {
    return this.provasService.publicar(id, req.user.id);
  }

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Post(":id/duplicar")
  async duplicar(
    @Param("id") id: string,
    @Req() req: ExpressReq & { user: AuthUser }
  ) {
    return this.provasService.duplicar(id, req.user.id);
  }
}

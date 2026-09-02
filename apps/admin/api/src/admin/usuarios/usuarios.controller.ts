import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { Request } from "express";
import { AdminUsuariosService } from "./usuarios.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
import {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
} from "./dto/usuarios.dto.js";

interface ReqUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("admin/usuarios")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COMISSAO, Role.COORDENADOR_CURSO)
export class AdminUsuariosController {
  constructor(private readonly usuariosService: AdminUsuariosService) {}

  @Get()
  async findAll(
    @Req() req: Request & { user: ReqUser },
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.usuariosService.findAll(req.user, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(":id")
  async findById(@Param("id") id: string, @Req() req: Request & { user: ReqUser }) {
    return this.usuariosService.findById(id, req.user);
  }

  @Post()
  async create(@Body() body: unknown, @Req() req: Request & { user: ReqUser }) {
    const parsed = criarUsuarioSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.usuariosService.create(parsed.data, req.user);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @Req() req: Request & { user: ReqUser }
  ) {
    const parsed = atualizarUsuarioSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.usuariosService.update(id, parsed.data, req.user);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: Request & { user: ReqUser }) {
    return this.usuariosService.delete(id, req.user);
  }
}

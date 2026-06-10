import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { AdminUsuariosService } from "./usuarios.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
import {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
} from "./dto/usuarios.dto.js";

@Controller("admin/usuarios")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminUsuariosController {
  constructor(private readonly usuariosService: AdminUsuariosService) {}

  @Get()
  async findAll() {
    return this.usuariosService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.usuariosService.findById(id);
  }

  @Post()
  async create(@Body() body: unknown) {
    const parsed = criarUsuarioSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.usuariosService.create(parsed.data);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: unknown) {
    const parsed = atualizarUsuarioSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.usuariosService.update(id, parsed.data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.usuariosService.delete(id);
  }
}

import { Controller, Get, Patch, Body, UseGuards, Req, BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "./users.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { atualizarPerfilSchema } from "../auth/dto/login.dto.js";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: Request & { user: { id: string; email: string; nome: string; role: string } }) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  async atualizarPerfil(
    @Req() req: Request & { user: { id: string } },
    @Body() body: unknown,
  ) {
    const parsed = atualizarPerfilSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.usersService.atualizarPerfil(req.user.id, parsed.data);
  }
}

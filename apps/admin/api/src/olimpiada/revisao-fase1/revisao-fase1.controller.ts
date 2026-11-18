import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { Role } from "../../../generated/prisma/client.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { RevisaoFase1Service } from "./revisao-fase1.service.js";

type Req = { user: { id: string } };
export const publicarRevisaoSchema = z.object({ publicar: z.boolean() });

@Controller("revisao-fase1")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RevisaoFase1Controller {
  constructor(private readonly service: RevisaoFase1Service) {}

  @Get("minha")
  @Roles(Role.ALUNO)
  minha(@Req() req: Req) {
    return this.service.minha(req.user.id);
  }

  @Get("situacao")
  @Roles(Role.ADMIN)
  situacao() {
    return this.service.situacao();
  }

  @Post("publicar")
  @Roles(Role.ADMIN)
  publicar(@Req() req: Req, @Body() body: unknown) {
    const r = publicarRevisaoSchema.safeParse(body);
    if (!r.success) throw new BadRequestException(r.error.flatten().fieldErrors);
    return this.service.publicar(r.data.publicar, req.user.id);
  }
}

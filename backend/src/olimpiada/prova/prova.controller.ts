import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from "@nestjs/common";
import { ProvaService } from "./prova.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { responderQuestaoSchema } from "./dto/prova.dto.js";
import type { ResponderQuestaoDto } from "./dto/prova.dto.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("prova")
@UseGuards(JwtAuthGuard)
export class ProvaController {
  constructor(private readonly provaService: ProvaService) {}

  @Get("questoes")
  async buscarQuestoes(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.provaService.buscarQuestoes(req.user.id);
  }

  @Post("responder")
  async responder(
    @Request() req: ExpressReq & { user: AuthUser },
    @Body() body: ResponderQuestaoDto
  ) {
    const parsed = responderQuestaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.provaService.responder(req.user.id, parsed.data);
  }

  @Post("finalizar")
  async finalizar(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.provaService.finalizarProva(req.user.id);
  }

  @Get("resumo")
  async resumo(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.provaService.resumoProva(req.user.id);
  }
}

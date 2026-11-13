import { BadRequestException, Body, Controller, Get, Header, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import type { Request as ExpressReq } from "express";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";
import { Fase2ParticipanteService } from "./fase2-participante.service.js";
import { Fase2GestaoService } from "./fase2-gestao.service.js";
import { Fase2AvaliadorService } from "./fase2-avaliador.service.js";

interface AuthUser { id: string; email: string; nome: string; role: string }
type Req = ExpressReq & { user: AuthUser };

function validar<T>(schema: z.ZodType<T>, body: unknown): T {
  const r = schema.safeParse(body);
  if (!r.success) throw new BadRequestException(r.error.flatten().fieldErrors);
  return r.data;
}

export const enviarLinksSchema = z.object({
  videoLink: z.string().min(1, "Informe o link da videoaula"),
  portfolioLink: z.string().min(1, "Informe o link do portfólio"),
});
export const iniciarSchema = z.object({ tema: z.string().min(3).max(300) });
export const distribuirSchema = z.object({ avaliadorIds: z.array(z.string().uuid()).min(3) });
export const remanejarSchema = z.object({ avaliadorId: z.string().uuid() });
const nota = z.number().nullable().optional();
export const fichaSchema = z.object({
  notas: z.object({
    dominioConteudo: nota,
    estrategiasEnsino: nota,
    usoTdics: nota,
    reflexaoCritica: nota,
    coerenciaPedagogica: nota,
  }),
  parecer: z.string().max(5000).optional(),
});

/** Participante classificado: status e envio dos links. */
@Controller("envio")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ALUNO)
export class Fase2ParticipanteController {
  constructor(private readonly service: Fase2ParticipanteService) {}

  @Get("status")
  status(@Req() req: Req) {
    return this.service.status(req.user.id);
  }

  @Post("links")
  enviar(@Req() req: Req, @Body() body: unknown) {
    const d = validar(enviarLinksSchema, body);
    return this.service.enviar(req.user.id, d.videoLink, d.portfolioLink);
  }
}

/** Admin e Comissão: início, e-mails, distribuição e acompanhamento. */
@Controller("admin/fase2")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COMISSAO)
export class Fase2GestaoController {
  constructor(private readonly service: Fase2GestaoService) {}

  @Get("painel")
  painel() {
    return this.service.painel();
  }

  @Post("iniciar")
  iniciar(@Req() req: Req, @Body() body: unknown) {
    return this.service.iniciar(validar(iniciarSchema, body).tema, req.user.id);
  }

  @Post("emails/reenviar")
  reenviar(@Req() req: Req) {
    return this.service.reenviarFalhas(req.user.id);
  }

  @Get("avaliadores")
  avaliadores() {
    return this.service.listarAvaliadores();
  }

  @Post("distribuir")
  distribuir(@Req() req: Req, @Body() body: unknown) {
    return this.service.distribuirAvaliadores(validar(distribuirSchema, body).avaliadorIds, req.user.id);
  }

  @Post("atribuicoes/:id/remanejar")
  remanejar(@Req() req: Req, @Param("id") id: string, @Body() body: unknown) {
    return this.service.remanejar(id, validar(remanejarSchema, body).avaliadorId, req.user.id);
  }

  @Get("exportar")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", 'attachment; filename="fase2.csv"')
  exportar() {
    return this.service.exportarCsv();
  }
}

/** Avaliador: apenas os participantes atribuídos a ele. */
@Controller("avaliador/fase2")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.AVALIADOR)
export class Fase2AvaliadorController {
  constructor(private readonly service: Fase2AvaliadorService) {}

  @Get("atribuicoes")
  listar(@Req() req: Req) {
    return this.service.listar(req.user.id);
  }

  @Get("atribuicoes/:id")
  ficha(@Req() req: Req, @Param("id") id: string) {
    return this.service.ficha(id, req.user.id);
  }

  @Put("atribuicoes/:id")
  rascunho(@Req() req: Req, @Param("id") id: string, @Body() body: unknown) {
    const d = validar(fichaSchema, body);
    return this.service.salvarRascunho(id, req.user.id, d.notas, d.parecer);
  }

  @Post("atribuicoes/:id/concluir")
  concluir(@Req() req: Req, @Param("id") id: string, @Body() body: unknown) {
    const d = validar(fichaSchema, body);
    return this.service.concluir(id, req.user.id, d.notas, d.parecer);
  }
}

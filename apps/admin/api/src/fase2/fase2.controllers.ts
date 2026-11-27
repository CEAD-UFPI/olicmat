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
const tipoArquivo = z.enum(["video", "portfolio"]);
export const iniciarUploadSchema = z.object({
  tipo: tipoArquivo,
  nome: z.string().min(1).max(255),
  bytes: z.number().int().positive(),
});
export const partesUploadSchema = z.object({
  chave: z.string().min(1).max(500),
  uploadId: z.string().min(1).max(1024),
  partes: z.array(z.number().int().min(1).max(10_000)).min(1).max(500),
});
export const concluirUploadSchema = z.object({
  tipo: tipoArquivo,
  chave: z.string().min(1).max(500),
  nome: z.string().min(1).max(255),
  bytes: z.number().int().positive(),
});
export const iniciarSchema = z.object({ tema: z.string().min(3).max(300) });
// IDs: qualquer texto não vazio (usuários criados por script podem fugir do formato UUID); o serviço confere se existem.
export const distribuirSchema = z.object({ avaliadorIds: z.array(z.string().min(1).max(64)).min(3), simular: z.boolean().optional() });
export const redistribuirSchema = z.object({ avaliadorIds: z.array(z.string().min(1).max(64)).optional(), simular: z.boolean().optional() });
export const remanejarLoteSchema = z.object({
  instrucoes: z.array(z.object({
    de: z.string().min(1).max(64),
    para: z.string().min(1).max(64),
    quantidade: z.number().int().min(1).max(10),
  })).min(1, "Inclua ao menos um pedido").max(40),
  simular: z.boolean().optional(),
});
export const remanejarSchema = z.object({ avaliadorId: z.string().min(1).max(64) });
export const liberarReenvioSchema = z.object({
  tipo: z.enum(["video", "portfolio"]),
  liberar: z.boolean(),
  motivo: z.string().trim().max(500).optional(),
}).refine((d) => !d.liberar || (d.motivo ?? "").length >= 5, { message: "Informe o motivo da liberação (mínimo 5 caracteres).", path: ["motivo"] });
const conceito = z.number().int().min(0).max(5).nullable().optional();
export const fichaSchema = z.object({
  notas: z.object({
    criterio1: conceito,
    criterio2: conceito,
    criterio3: conceito,
    criterio4: conceito,
    criterio5: conceito,
  }),
  parecer: z.string().max(5000).optional(),
});

/** Participante classificado: status e envio (upload na nuvem própria ou links). */
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

  @Post("upload/iniciar")
  iniciarUpload(@Req() req: Req, @Body() body: unknown) {
    const d = validar(iniciarUploadSchema, body);
    return this.service.iniciarUpload(req.user.id, d.tipo, d.nome, d.bytes);
  }

  @Post("upload/partes")
  partes(@Req() req: Req, @Body() body: unknown) {
    const d = validar(partesUploadSchema, body);
    return this.service.urlsDasPartes(req.user.id, d.chave, d.uploadId, d.partes);
  }

  @Post("upload/concluir")
  concluirUpload(@Req() req: Req, @Body() body: unknown) {
    const d = validar(concluirUploadSchema, body);
    return this.service.concluirUpload(req.user.id, d.tipo, d.chave, d.nome, d.bytes);
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
    const d = validar(distribuirSchema, body);
    return this.service.distribuirAvaliadores(d.avaliadorIds, req.user.id, { simular: d.simular });
  }

  @Post("remanejar-lote")
  remanejarLote(@Req() req: Req, @Body() body: unknown) {
    const d = validar(remanejarLoteSchema, body);
    return this.service.remanejarLote(d.instrucoes, req.user.id, { simular: d.simular });
  }

  @Post("redistribuir")
  redistribuir(@Req() req: Req, @Body() body: unknown) {
    const d = validar(redistribuirSchema, body);
    return this.service.redistribuirPendentes(d.avaliadorIds, req.user.id, { simular: d.simular });
  }

  @Post("atribuicoes/:id/remanejar")
  remanejar(@Req() req: Req, @Param("id") id: string, @Body() body: unknown) {
    return this.service.remanejar(id, validar(remanejarSchema, body).avaliadorId, req.user.id);
  }

  @Post("participantes/:inscricaoId/reenvio")
  liberarReenvio(@Req() req: Req, @Param("inscricaoId") inscricaoId: string, @Body() body: unknown) {
    const d = validar(liberarReenvioSchema, body);
    return this.service.liberarReenvio(inscricaoId, d.tipo, d.liberar, d.motivo ?? "", req.user.id);
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

import {
  BadRequestException, Body, CanActivate, Controller, ExecutionContext, HttpCode, Injectable,
  NotFoundException, Param, Post, UseGuards, Get,
} from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { Fase2VideosService } from "./fase2-videos.service.js";

/**
 * Acesso do compressor da VPS: cabeçalho `x-compressor-token` igual a
 * FASE2_COMPRESSOR_TOKEN. Sem a variável, as rotas não existem (404).
 */
@Injectable()
export class CompressorTokenGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const esperado = process.env.FASE2_COMPRESSOR_TOKEN?.trim();
    if (!esperado || esperado.length < 32) throw new NotFoundException();
    const recebido = String(ctx.switchToHttp().getRequest().headers["x-compressor-token"] ?? "");
    const a = Buffer.from(recebido);
    const b = Buffer.from(esperado);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new NotFoundException();
    return true;
  }
}

const concluidoSchema = z.object({
  chaveFinal: z.string().min(1).max(500),
  bytesFinal: z.number().int().positive(),
  duracaoSeg: z.number().nonnegative().nullable().optional(),
});
const falhaSchema = z.object({ erro: z.string().min(1).max(5000) });

function validar<T>(schema: z.ZodType<T>, body: unknown): T {
  const r = schema.safeParse(body);
  if (!r.success) throw new BadRequestException(r.error.flatten().fieldErrors);
  return r.data;
}

@Controller("interno/fase2/videos")
@UseGuards(CompressorTokenGuard)
export class Fase2CompressorController {
  constructor(private readonly videos: Fase2VideosService) {}

  @Post("proximo")
  @HttpCode(200)
  proximo() {
    return this.videos.proximo();
  }

  @Post(":id/concluido")
  @HttpCode(200)
  concluido(@Param("id") id: string, @Body() body: unknown) {
    const d = validar(concluidoSchema, body);
    return this.videos.concluido(id, d.chaveFinal, d.bytesFinal, d.duracaoSeg ?? null);
  }

  @Post(":id/falha")
  @HttpCode(200)
  falha(@Param("id") id: string, @Body() body: unknown) {
    return this.videos.falha(id, validar(falhaSchema, body).erro);
  }

  @Get("remocoes")
  remocoes() {
    return this.videos.remocoes();
  }

  @Post(":id/removido")
  @HttpCode(200)
  removido(@Param("id") id: string) {
    return this.videos.removido(id);
  }
}

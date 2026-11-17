import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { chaveFinalDe } from "./fase2.regras.js";

/** Um processamento parado há mais tempo que isto é devolvido à fila. */
const PROCESSAMENTO_TRAVADO_MIN = 180;
export const MAX_TENTATIVAS = 3;

export interface VideoInfo {
  status: string;
  chaveOriginal: string;
  nomeOriginal: string;
  bytesOriginal: bigint;
  chaveFinal: string | null;
  bytesFinal: bigint | null;
  duracaoSeg: number | null;
  arquivosRemovidos: boolean;
  tentativas: number;
}

/**
 * Fila de compressão dos vídeos da Fase 2.
 *
 * O participante envia o vídeo original; o compressor na VPS pede o próximo
 * vídeo (`proximo`), gera a versão final em MP4 720p, avisa (`concluido`) e
 * depois apaga o original (`remocoes` / `removido`). A API é a fonte da
 * verdade: só ela sabe qual é o vídeo atual de cada participante.
 */
@Injectable()
export class Fase2VideosService {
  constructor(private prisma: PrismaService) {}

  /** Novo vídeo enviado: entra na fila e os anteriores do participante saem. */
  async registrar(inscricaoId: string, chaveOriginal: string, nomeOriginal: string, bytes: number) {
    await this.prisma.$transaction([
      this.prisma.videoFase2.updateMany({
        where: { inscricaoId, status: { not: "SUBSTITUIDO" }, chaveOriginal: { not: chaveOriginal } },
        data: { status: "SUBSTITUIDO" },
      }),
      this.prisma.videoFase2.upsert({
        where: { chaveOriginal },
        create: { inscricaoId, chaveOriginal, nomeOriginal, bytesOriginal: BigInt(bytes) },
        update: {},
      }),
    ]);
  }

  async mapaPorChaves(chaves: Array<string | null | undefined>): Promise<Map<string, VideoInfo>> {
    const lista = chaves.filter((c): c is string => !!c);
    if (!lista.length) return new Map();
    const videos = await this.prisma.videoFase2.findMany({ where: { chaveOriginal: { in: lista } } });
    return new Map(videos.map((v) => [v.chaveOriginal, v]));
  }

  /** Reserva o próximo vídeo da fila para o compressor (seguro com vários compressores). */
  async proximo() {
    const linhas = await this.prisma.$queryRaw<Array<{ id: string; chaveOriginal: string; nomeOriginal: string; bytesOriginal: bigint }>>`
      UPDATE "VideoFase2"
         SET status = 'PROCESSANDO', "iniciadoEm" = now(), tentativas = tentativas + 1, erro = NULL
       WHERE id = (
         SELECT id FROM "VideoFase2"
          WHERE status = 'PENDENTE'
             OR (status = 'FALHA' AND tentativas < ${MAX_TENTATIVAS})
             OR (status = 'PROCESSANDO' AND "iniciadoEm" < now() - make_interval(mins => ${PROCESSAMENTO_TRAVADO_MIN}))
          ORDER BY "criadoEm"
          LIMIT 1
          FOR UPDATE SKIP LOCKED
       )
      RETURNING id, "chaveOriginal", "nomeOriginal", "bytesOriginal"`;
    const v = linhas[0];
    if (!v) return { video: null };
    return {
      video: {
        id: v.id,
        chaveOriginal: v.chaveOriginal,
        chaveFinal: chaveFinalDe(v.chaveOriginal),
        nomeOriginal: v.nomeOriginal,
        bytesOriginal: Number(v.bytesOriginal),
      },
    };
  }

  private async buscar(id: string) {
    const v = await this.prisma.videoFase2.findUnique({ where: { id } });
    if (!v) throw new NotFoundException("Vídeo não encontrado");
    return v;
  }

  async concluido(id: string, chaveFinal: string, bytesFinal: number, duracaoSeg: number | null) {
    const v = await this.buscar(id);
    if (chaveFinal !== chaveFinalDe(v.chaveOriginal)) throw new BadRequestException("Chave final inesperada.");
    // Se o participante trocou o vídeo durante a compressão, o resultado vai
    // direto para a remoção (status continua SUBSTITUIDO).
    await this.prisma.videoFase2.update({
      where: { id },
      data: {
        ...(v.status === "SUBSTITUIDO" ? {} : { status: "PRONTO" }),
        chaveFinal,
        bytesFinal: BigInt(bytesFinal),
        duracaoSeg: duracaoSeg == null ? null : Math.round(duracaoSeg),
        concluidoEm: new Date(),
        erro: null,
      },
    });
    return { ok: true };
  }

  async falha(id: string, erro: string) {
    const v = await this.buscar(id);
    await this.prisma.videoFase2.update({
      where: { id },
      data: { ...(v.status === "SUBSTITUIDO" ? {} : { status: "FALHA" }), erro: erro.slice(0, 1000) },
    });
    return { ok: true };
  }

  /**
   * Arquivos a apagar na nuvem: o original dos vídeos já comprimidos e todos os
   * arquivos dos vídeos substituídos (que não estejam sendo processados agora).
   */
  async remocoes() {
    const lista = await this.prisma.videoFase2.findMany({
      where: {
        arquivosRemovidos: false,
        OR: [
          { status: "PRONTO", chaveFinal: { not: null } },
          {
            status: "SUBSTITUIDO",
            OR: [
              { iniciadoEm: null },
              { concluidoEm: { not: null } },
              { erro: { not: null } },
              { iniciadoEm: { lt: new Date(Date.now() - PROCESSAMENTO_TRAVADO_MIN * 60_000) } },
            ],
          },
        ],
      },
      take: 50,
      orderBy: { criadoEm: "asc" },
    });
    return {
      remocoes: lista.map((v) => ({
        id: v.id,
        chaves: v.status === "PRONTO" ? [v.chaveOriginal] : [v.chaveOriginal, chaveFinalDe(v.chaveOriginal)],
      })),
    };
  }

  async removido(id: string) {
    await this.buscar(id);
    await this.prisma.videoFase2.update({ where: { id }, data: { arquivosRemovidos: true } });
    return { ok: true };
  }

  /** Admin: devolve à fila um vídeo que falhou. */
  async reprocessar(id: string) {
    const v = await this.buscar(id);
    if (v.status !== "FALHA") throw new BadRequestException("Só é possível reprocessar um vídeo com falha.");
    await this.prisma.videoFase2.update({ where: { id }, data: { status: "PENDENTE", tentativas: 0, erro: null } });
    return { ok: true };
  }

  async resumo() {
    const g = await this.prisma.videoFase2.groupBy({ by: ["status"], _count: { _all: true } });
    const r: Record<string, number> = { PENDENTE: 0, PROCESSANDO: 0, PRONTO: 0, FALHA: 0 };
    for (const x of g) if (x.status in r) r[x.status] = x._count._all;
    return r;
  }
}

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { AuditoriaService } from "../admin/auditoria/auditoria.service.js";
import type { AvaliarEnvioDto } from "./dto/correcao.dto.js";

@Injectable()
export class CorrecaoService {
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
  ) {}

  async listPending() {
    return this.prisma.envioFase2.findMany({
      where: { status: "ENVIADO" },
      include: {
        inscricao: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
            instituicao: { select: { id: true, nome: true, sigla: true } },
            curso: { select: { id: true, nome: true } },
          },
        },
      },
      orderBy: { enviadoEm: "asc" },
    });
  }

  async assignGrade(envioId: string, data: AvaliarEnvioDto, avaliadorId: string) {
    const envio = await this.prisma.envioFase2.findUnique({
      where: { id: envioId },
    });

    if (!envio) {
      throw new NotFoundException("Envio não encontrado");
    }

    if (envio.status !== "ENVIADO") {
      throw new BadRequestException("Envio já foi avaliado ou não está pendente");
    }

    const inscricaoId = envio.inscricaoId;

    const avaliacao = await this.prisma.avaliacaoFase2.upsert({
      where: {
        inscricaoId_avaliadorId: {
          inscricaoId,
          avaliadorId,
        },
      },
      create: {
        inscricaoId,
        avaliadorId,
        nota: data.nota,
        parecer: data.comentario,
      },
      update: {
        nota: data.nota,
        parecer: data.comentario,
      },
    });

    await this.prisma.envioFase2.update({
      where: { id: envioId },
      data: { status: "AVALIADO" },
    });

    const avaliacoes = await this.prisma.avaliacaoFase2.findMany({
      where: { inscricaoId },
    });

    const mediaNota =
      avaliacoes.reduce((sum: number, a: { nota: number }) => sum + a.nota, 0) / avaliacoes.length;

    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      include: { edicao: true },
    });

    if (inscricao) {
      const pesoFase1 = inscricao.edicao?.pesoFase1 ?? 0.5;
      const pesoFase2 = inscricao.edicao?.pesoFase2 ?? 0.5;
      const fase1Nota = inscricao.fase1Nota ?? 0;

      const notaFinal =
        Math.round((fase1Nota * pesoFase1 + mediaNota * pesoFase2) * 100) / 100;

      await this.prisma.inscricao.update({
        where: { id: inscricaoId },
        data: { notaFinal },
      });
    }

    await this.auditoria.log(avaliadorId, "AVALIAR_ENVIO", "EnvioFase2", envioId, {
      nota: data.nota,
      inscricaoId,
    });

    return avaliacao;
  }

  async listHistorico(page = 1, limit = 20, nome?: string) {
    const where: Record<string, unknown> = {
      status: "AVALIADO",
    };

    if (nome) {
      where.inscricao = {
        user: {
          nome: { contains: nome, mode: "insensitive" },
        },
      };
    }

    const [envios, total] = await Promise.all([
      this.prisma.envioFase2.findMany({
        where,
        include: {
          inscricao: {
            include: {
              user: {
                select: {
                  id: true,
                  nome: true,
                  email: true,
                },
              },
              instituicao: { select: { id: true, nome: true, sigla: true } },
              curso: { select: { id: true, nome: true } },
              avaliacoes: {
                include: {
                  avaliador: {
                    select: { id: true, nome: true },
                  },
                },
                orderBy: { avaliadoEm: "desc" },
              },
            },
          },
        },
        orderBy: { enviadoEm: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.envioFase2.count({ where }),
    ]);

    return {
      data: envios,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

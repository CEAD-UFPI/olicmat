import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { UploadService } from "../../upload/upload.service.js";

interface FileBuffer {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class EnvioService {
  constructor(
    private prisma: PrismaService,
    private upload: UploadService,
  ) {}

  async enviarVideoLink(userId: string, videoLink: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    if (!inscricao.fase2Tema) {
      throw new BadRequestException("Tema da Fase 2 ainda não foi sorteado");
    }

    if (inscricao.fase1Nota == null || inscricao.fase1Nota < 60) {
      throw new BadRequestException("Nota mínima da Fase 1 não atingida");
    }

    const existing = await this.prisma.envioFase2.findFirst({
      where: { inscricaoId: inscricao.id, tipo: "video" },
    });

    if (existing && existing.status !== "PENDENTE") {
      throw new BadRequestException("Vídeo já foi enviado e não pode ser alterado");
    }

    if (existing) {
      return this.prisma.envioFase2.update({
        where: { id: existing.id },
        data: { videoLink, status: "ENVIADO", enviadoEm: new Date() },
      });
    }

    return this.prisma.envioFase2.create({
      data: {
        inscricaoId: inscricao.id,
        tipo: "video",
        arquivoUrl: "",
        videoLink,
        status: "ENVIADO",
      },
    });
  }

  async uploadPortfolio(userId: string, file: FileBuffer) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    if (!inscricao.fase2Tema) {
      throw new BadRequestException("Tema da Fase 2 ainda não foi sorteado");
    }

    if (inscricao.fase1Nota == null || inscricao.fase1Nota < 60) {
      throw new BadRequestException("Nota mínima da Fase 1 não atingida");
    }

    const arquivoUrl = await this.upload.uploadBuffer(
      file.buffer,
      `fase2/${userId}`,
      file.originalname,
      "raw",
    );

    const existing = await this.prisma.envioFase2.findFirst({
      where: { inscricaoId: inscricao.id, tipo: "portfolio" },
    });

    if (existing && existing.status !== "PENDENTE") {
      throw new BadRequestException("Portfólio já foi enviado e não pode ser alterado");
    }

    if (existing) {
      return this.prisma.envioFase2.update({
        where: { id: existing.id },
        data: { arquivoUrl, status: "ENVIADO", enviadoEm: new Date() },
      });
    }

    return this.prisma.envioFase2.create({
      data: {
        inscricaoId: inscricao.id,
        tipo: "portfolio",
        arquivoUrl,
        status: "ENVIADO",
      },
    });
  }

  async statusEnvio(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      select: {
        id: true,
        fase2Tema: true,
        enviosFase2: {
          select: {
            id: true,
            tipo: true,
            arquivoUrl: true,
            videoLink: true,
            status: true,
            enviadoEm: true,
          },
        },
        avaliacoes: {
          select: {
            id: true,
            nota: true,
            parecer: true,
            avaliadoEm: true,
          },
        },
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    return inscricao;
  }
}

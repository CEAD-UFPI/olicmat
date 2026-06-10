import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { UploadService } from "../../upload/upload.service.js";

@Injectable()
export class EnvioService {
  constructor(
    private prisma: PrismaService,
    private upload: UploadService
  ) {}

  async uploadFase2(
    userId: string,
    file: Express.Multer.File,
    tipo: string
  ) {
    const inscricao = await this.prisma.inscricao.findUnique({
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

    const resourceType = tipo === "video" ? "video" : "raw";
    const arquivoUrl = await this.upload.uploadBuffer(
      file.buffer,
      `fase2/${userId}`,
      file.originalname,
      resourceType
    );

    // Create an EnvioFase2 record
    return this.prisma.envioFase2.create({
      data: {
        inscricaoId: inscricao.id,
        tipo,
        arquivoUrl,
        status: "ENVIADO",
      },
    });
  }

  async uploadVideo(
    userId: string,
    file: Express.Multer.File
  ) {
    return this.uploadFase2(userId, file, "video");
  }

  async uploadPortfolio(
    userId: string,
    file: Express.Multer.File
  ) {
    return this.uploadFase2(userId, file, "portfolio");
  }

  async statusEnvio(userId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { userId },
      select: {
        id: true,
        fase2Tema: true,
        enviosFase2: {
          select: {
            id: true,
            tipo: true,
            arquivoUrl: true,
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

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

  async uploadVideo(
    userId: string,
    file: Express.Multer.File
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

    const videoUrl = await this.upload.uploadBuffer(
      file.buffer,
      `fase2/${userId}`,
      file.originalname,
      "video"
    );

    return this.prisma.inscricao.update({
      where: { id: inscricao.id },
      data: { fase2VideoUrl: videoUrl },
    });
  }

  async uploadPortfolio(
    userId: string,
    file: Express.Multer.File
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

    const portfolioUrl = await this.upload.uploadBuffer(
      file.buffer,
      `portfolio/${userId}`,
      file.originalname,
      "raw"
    );

    return this.prisma.inscricao.update({
      where: { id: inscricao.id },
      data: { fase2PortfolioUrl: portfolioUrl },
    });
  }

  async statusEnvio(userId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { userId },
      select: {
        fase2Tema: true,
        fase2VideoUrl: true,
        fase2PortfolioUrl: true,
        fase2Nota: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    return inscricao;
  }
}

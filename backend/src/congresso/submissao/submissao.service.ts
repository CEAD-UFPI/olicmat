import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { UploadService } from "../../upload/upload.service.js";

@Injectable()
export class SubmissaoService {
  constructor(
    private prisma: PrismaService,
    private upload: UploadService
  ) {}

  async submeter(userId: string, titulo: string, resumo: string, tipo: "ARTIGO" | "POSTER", file: Express.Multer.File) {
    const arquivoUrl = await this.upload.uploadBuffer(
      file.buffer,
      `congemat/${userId}`,
      file.originalname,
      "raw"
    );

    return this.prisma.submissao.create({
      data: { userId, titulo, resumo, tipo, arquivoUrl },
    });
  }

  async listarPorUsuario(userId: string) {
    return this.prisma.submissao.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        titulo: true,
        tipo: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async listarTodas(status?: string) {
    return this.prisma.submissao.findMany({
      where: status ? { status: status as "EM_AVALIACAO" | "APROVADO" | "REJEITADO" } : undefined,
      include: {
        user: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async atualizarStatus(id: string, status: "APROVADO" | "REJEITADO") {
    const submissao = await this.prisma.submissao.findUnique({ where: { id } });
    if (!submissao) throw new NotFoundException("Submissão não encontrada");

    return this.prisma.submissao.update({
      where: { id },
      data: { status },
    });
  }
}

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { randomBytes } from "crypto";

@Injectable()
export class CertificadoService {
  constructor(private prisma: PrismaService) {}

  async emitir(userId: string) {
    const progresso = await this.prisma.progressoCurso.findMany({
      where: { userId, concluido: true },
      include: { modulo: { select: { cargaHoraria: true } } },
    });

    if (progresso.length === 0) {
      throw new BadRequestException("Nenhum módulo concluído");
    }

    const cargaHoraria = progresso.reduce((acc, p) => acc + p.modulo.cargaHoraria, 0);

    // Verificar se já existe certificado para essa carga horária
    const existente = await this.prisma.certificado.findFirst({
      where: { userId, cargaHoraria },
    });

    if (existente) {
      return existente;
    }

    const codigo = randomBytes(8).toString("hex").toUpperCase();

    return this.prisma.certificado.create({
      data: {
        userId,
        cargaHoraria,
        codigo,
      },
    });
  }

  async meusCertificados(userId: string) {
    return this.prisma.certificado.findMany({
      where: { userId },
      orderBy: { emitidoEm: "desc" },
    });
  }
}

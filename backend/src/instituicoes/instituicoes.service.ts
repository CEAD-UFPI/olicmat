import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";

@Injectable()
export class InstituicoesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.instituicao.findMany({
      include: {
        cursos: {
          select: { id: true, nome: true },
        },
      },
      orderBy: { nome: "asc" },
    });
  }

  async findById(id: string) {
    const instituicao = await this.prisma.instituicao.findUnique({
      where: { id },
      include: {
        cursos: {
          select: { id: true, nome: true },
        },
      },
    });

    if (!instituicao) {
      throw new NotFoundException("Instituição não encontrada");
    }

    return instituicao;
  }

  async create(data: { nome: string; sigla: string; estado?: string; codigoInep?: string }) {
    return this.prisma.instituicao.create({
      data: {
        nome: data.nome,
        sigla: data.sigla.toUpperCase(),
        codigoInep: data.codigoInep ?? "",
        estado: data.estado?.toUpperCase() ?? "",
      },
    });
  }

  async update(
    id: string,
    data: { nome?: string; sigla?: string; estado?: string; codigoInep?: string },
  ) {
    await this.findById(id);

    const updateData: Record<string, string> = {};
    if (data.nome) updateData.nome = data.nome;
    if (data.sigla) updateData.sigla = data.sigla.toUpperCase();
    if (data.estado) updateData.estado = data.estado.toUpperCase();
    if (data.codigoInep !== undefined) updateData.codigoInep = data.codigoInep;

    return this.prisma.instituicao.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.instituicao.delete({ where: { id } });
    return { deleted: true };
  }
}

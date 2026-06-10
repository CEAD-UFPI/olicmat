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

  async create(data: { nome: string; sigla: string; estado?: string }) {
    return this.prisma.instituicao.create({
      data: {
        nome: data.nome,
        sigla: data.sigla.toUpperCase(),
        estado: data.estado?.toUpperCase() ?? "",
      },
    });
  }

  async update(
    id: string,
    data: { nome?: string; sigla?: string; estado?: string }
  ) {
    await this.findById(id);

    const updateData: Record<string, string> = {};
    if (data.nome) updateData.nome = data.nome;
    if (data.sigla) updateData.sigla = data.sigla.toUpperCase();
    if (data.estado) updateData.estado = data.estado.toUpperCase();

    return this.prisma.instituicao.update({
      where: { id },
      data: updateData,
    });
  }
}

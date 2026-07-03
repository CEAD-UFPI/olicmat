import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  async findAll(instituicaoId?: string) {
    const where: Record<string, unknown> = {};
    if (instituicaoId) where.instituicaoId = instituicaoId;

    return this.prisma.curso.findMany({
      where,
      include: {
        instituicao: { select: { id: true, nome: true, sigla: true } },
        _count: { select: { usuarios: true, inscricoes: true } },
      },
      orderBy: { nome: "asc" },
    });
  }

  async findById(id: string) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        instituicao: { select: { id: true, nome: true, sigla: true } },
        _count: { select: { usuarios: true, inscricoes: true } },
      },
    });

    if (!curso) {
      throw new NotFoundException("Curso não encontrado");
    }

    return curso;
  }

  async create(data: { nome: string; instituicaoId: string }) {
    return this.prisma.curso.create({
      data: {
        nome: data.nome,
        instituicaoId: data.instituicaoId,
      },
      include: {
        instituicao: { select: { id: true, nome: true, sigla: true } },
      },
    });
  }

  async update(id: string, data: { nome?: string; instituicaoId?: string }) {
    await this.findById(id);
    return this.prisma.curso.update({
      where: { id },
      data,
      include: {
        instituicao: { select: { id: true, nome: true, sigla: true } },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.curso.delete({ where: { id } });
    return { deleted: true };
  }
}

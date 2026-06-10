import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import type { CriarProvaDto, AtualizarProvaDto } from "./dto/provas.dto.js";
import type { ProvaQuestao } from "../../../generated/prisma/client.js";

@Injectable()
export class ProvasService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CriarProvaDto) {
    return this.prisma.prova.create({
      data: {
        edicaoId: data.edicaoId,
        fase: data.fase,
        titulo: data.titulo,
        duracaoMinutos: data.duracaoMinutos,
        janelaInicio: data.janelaInicio ? new Date(data.janelaInicio) : undefined,
        janelaFim: data.janelaFim ? new Date(data.janelaFim) : undefined,
        status: "RASCUNHO",
        createdBy: userId,
      },
    });
  }

  async findAll(edicaoId?: string) {
    const where = edicaoId ? { edicaoId } : {};
    return this.prisma.prova.findMany({
      where,
      include: {
        edicao: { select: { id: true, ano: true, titulo: true } },
        _count: { select: { questoes: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const prova = await this.prisma.prova.findUnique({
      where: { id },
      include: {
        edicao: { select: { id: true, ano: true, titulo: true } },
        questoes: {
          include: {
            questao: true,
          },
          orderBy: { ordem: "asc" },
        },
      },
    });

    if (!prova) {
      throw new NotFoundException("Prova não encontrada");
    }

    return prova;
  }

  async update(id: string, data: AtualizarProvaDto) {
    await this.findById(id);

    return this.prisma.prova.update({
      where: { id },
      data: {
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.duracaoMinutos !== undefined && { duracaoMinutos: data.duracaoMinutos }),
        ...(data.janelaInicio && { janelaInicio: new Date(data.janelaInicio) }),
        ...(data.janelaFim && { janelaFim: new Date(data.janelaFim) }),
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    // Delete related ProvaQuestao entries first
    await this.prisma.provaQuestao.deleteMany({
      where: { provaId: id },
    });

    await this.prisma.prova.delete({
      where: { id },
    });

    return { deleted: true };
  }

  async publicar(id: string) {
    await this.findById(id);

    const questaoCount = await this.prisma.provaQuestao.count({
      where: { provaId: id },
    });

    if (questaoCount === 0) {
      throw new BadRequestException(
        "Não é possível publicar uma prova sem questões"
      );
    }

    return this.prisma.prova.update({
      where: { id },
      data: { status: "PUBLICADA" },
    });
  }

  async duplicar(id: string, userId: string) {
    const prova = await this.findById(id);

    const novaProva = await this.prisma.prova.create({
      data: {
        edicaoId: prova.edicaoId,
        fase: prova.fase,
        titulo: `${prova.titulo} (cópia)`,
        duracaoMinutos: prova.duracaoMinutos,
        janelaInicio: prova.janelaInicio,
        janelaFim: prova.janelaFim,
        status: "RASCUNHO",
        createdBy: userId,
      },
    });

    // Duplicate questions
    if (prova.questoes.length > 0) {
      await this.prisma.provaQuestao.createMany({
        data: prova.questoes.map((pq: ProvaQuestao) => ({
          provaId: novaProva.id,
          questaoId: pq.questaoId,
          ordem: pq.ordem,
        })),
      });
    }

    return this.findById(novaProva.id);
  }
}

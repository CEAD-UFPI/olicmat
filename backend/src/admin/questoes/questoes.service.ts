import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import type { CriarQuestaoDto, VincularQuestaoDto, AtualizarQuestaoDto } from "./dto/questoes.dto.js";
import type { ProvaQuestao } from "../../../generated/prisma/client.js";

@Injectable()
export class QuestoesService {
  constructor(private prisma: PrismaService) {}

  async addToExam(provaId: string, data: CriarQuestaoDto) {
    const prova = await this.prisma.prova.findUnique({
      where: { id: provaId },
    });

    if (!prova) {
      throw new NotFoundException("Prova não encontrada");
    }

    if (prova.status !== "RASCUNHO") {
      throw new BadRequestException("Só é possível adicionar questões a provas em rascunho");
    }

    // Create the question
    const questao = await this.prisma.questao.create({
      data: {
        enunciado: data.enunciado,
        alternativaA: data.alternativaA,
        alternativaB: data.alternativaB,
        alternativaC: data.alternativaC,
        alternativaD: data.alternativaD,
        alternativaE: data.alternativaE,
        correta: data.correta,
        eixo: data.eixo,
        dificuldade: data.dificuldade,
      },
    });

    // Determine the next order
    const maxOrdem = await this.prisma.provaQuestao.aggregate({
      where: { provaId },
      _max: { ordem: true },
    });

    const ordem = data.ordem ?? (maxOrdem._max.ordem ?? 0) + 1;

    await this.prisma.provaQuestao.create({
      data: {
        provaId,
        questaoId: questao.id,
        ordem,
      },
    });

    return questao;
  }

  async linkToExam(provaId: string, data: VincularQuestaoDto) {
    const prova = await this.prisma.prova.findUnique({
      where: { id: provaId },
    });

    if (!prova) {
      throw new NotFoundException("Prova não encontrada");
    }

    if (prova.status !== "RASCUNHO") {
      throw new BadRequestException("Só é possível adicionar questões a provas em rascunho");
    }

    const questao = await this.prisma.questao.findUnique({
      where: { id: data.questaoId },
    });

    if (!questao) {
      throw new NotFoundException("Questão não encontrada");
    }

    // Check if already linked
    const existing = await this.prisma.provaQuestao.findUnique({
      where: {
        provaId_questaoId: { provaId, questaoId: data.questaoId },
      },
    });

    if (existing) {
      throw new BadRequestException("Questão já está vinculada a esta prova");
    }

    const maxOrdem = await this.prisma.provaQuestao.aggregate({
      where: { provaId },
      _max: { ordem: true },
    });

    const ordem = data.ordem ?? (maxOrdem._max.ordem ?? 0) + 1;

    await this.prisma.provaQuestao.create({
      data: {
        provaId,
        questaoId: data.questaoId,
        ordem,
      },
    });

    return questao;
  }

  async findAll(filters?: { eixo?: string; dificuldade?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.eixo) where.eixo = filters.eixo;
    if (filters?.dificuldade) where.dificuldade = filters.dificuldade;

    return this.prisma.questao.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async findExamQuestions(provaId: string) {
    const prova = await this.prisma.prova.findUnique({
      where: { id: provaId },
    });

    if (!prova) {
      throw new NotFoundException("Prova não encontrada");
    }

    return this.prisma.provaQuestao.findMany({
      where: { provaId },
      include: {
        questao: true,
      },
      orderBy: { ordem: "asc" },
    });
  }

  async update(id: string, data: AtualizarQuestaoDto) {
    const questao = await this.prisma.questao.findUnique({
      where: { id },
    });

    if (!questao) {
      throw new NotFoundException("Questão não encontrada");
    }

    // Check if any linked exam is not draft
    const vinculadas = await this.prisma.provaQuestao.findMany({
      where: { questaoId: id },
      include: { prova: true },
    });

    const temProvaPublicada = vinculadas.some(
      (v: ProvaQuestao & { prova: { status: string } }) => v.prova.status !== "RASCUNHO"
    );
    if (temProvaPublicada) {
      throw new BadRequestException(
        "Não é possível editar questão vinculada a uma prova publicada"
      );
    }

    return this.prisma.questao.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const questao = await this.prisma.questao.findUnique({
      where: { id },
    });

    if (!questao) {
      throw new NotFoundException("Questão não encontrada");
    }

    // Check if any linked exam is not draft
    const vinculadas = await this.prisma.provaQuestao.findMany({
      where: { questaoId: id },
      include: { prova: true },
    });

    const temProvaPublicada = vinculadas.some(
      (v: ProvaQuestao & { prova: { status: string } }) => v.prova.status !== "RASCUNHO"
    );
    if (temProvaPublicada) {
      throw new BadRequestException(
        "Não é possível remover questão vinculada a uma prova publicada"
      );
    }

    // Remove all provaQuestao links
    await this.prisma.provaQuestao.deleteMany({
      where: { questaoId: id },
    });

    await this.prisma.questao.delete({
      where: { id },
    });

    return { deleted: true };
  }
}

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../auditoria/auditoria.service.js";
import type { CriarQuestaoDto, VincularQuestaoDto, AtualizarQuestaoDto } from "./dto/questoes.dto.js";
import type { ProvaQuestao } from "../../../generated/prisma/client.js";
import type { PaginationParams } from "../../common/pagination.js";
import { getSkipTake, paginate } from "../../common/pagination.js";

@Injectable()
export class QuestoesService {
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
  ) {}

  async addToExam(provaId: string, data: CriarQuestaoDto, userId?: string) {
    const prova = await this.prisma.prova.findUnique({
      where: { id: provaId },
    });

    if (!prova) {
      throw new NotFoundException("Prova não encontrada");
    }

    if (prova.status !== "RASCUNHO") {
      throw new BadRequestException("Só é possível adicionar questões a provas em rascunho");
    }

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

    const maxOrdem = await this.prisma.provaQuestao.aggregate({
      where: { provaId },
      _max: { ordem: true },
    });

    const ordem = data.ordem ?? (maxOrdem._max.ordem ?? 0) + 1;

    await this.prisma.provaQuestao.create({
      data: { provaId, questaoId: questao.id, ordem },
    });

    if (userId) {
      await this.auditoria.log(userId, "CRIAR_QUESTAO", "Questao", questao.id, {
        provaId,
        eixo: data.eixo,
      });
    }

    return questao;
  }

  async linkToExam(provaId: string, data: VincularQuestaoDto, userId?: string) {
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
      data: { provaId, questaoId: data.questaoId, ordem },
    });

    if (userId) {
      await this.auditoria.log(userId, "VINCULAR_QUESTAO", "ProvaQuestao", `${provaId}_${data.questaoId}`);
    }

    return questao;
  }

  async findAll(
    filters?: { eixo?: string; dificuldade?: string },
    params?: PaginationParams
  ) {
    const where: Record<string, unknown> = {};
    if (filters?.eixo) where.eixo = filters.eixo;
    if (filters?.dificuldade) where.dificuldade = filters.dificuldade;

    const orderBy = { createdAt: "desc" as const };

    if (params?.page === undefined && params?.limit === undefined) {
      return this.prisma.questao.findMany({ where, orderBy });
    }

    const { skip, take } = getSkipTake(params);
    const [data, total] = await Promise.all([
      this.prisma.questao.findMany({ where, orderBy, skip, take }),
      this.prisma.questao.count({ where }),
    ]);

    return paginate(data, total, params);
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
      include: { questao: true },
      orderBy: { ordem: "asc" },
    });
  }

  async update(id: string, data: AtualizarQuestaoDto, userId?: string) {
    const questao = await this.prisma.questao.findUnique({
      where: { id },
    });

    if (!questao) {
      throw new NotFoundException("Questão não encontrada");
    }

    const vinculadas = await this.prisma.provaQuestao.findMany({
      where: { questaoId: id },
      include: { prova: true },
    });

    const temProvaPublicada = vinculadas.some(
      (v: ProvaQuestao & { prova: { status: string } }) => v.prova.status !== "RASCUNHO",
    );
    if (temProvaPublicada) {
      throw new BadRequestException(
        "Não é possível editar questão vinculada a uma prova publicada",
      );
    }

    const result = await this.prisma.questao.update({
      where: { id },
      data,
    });

    if (userId) {
      await this.auditoria.log(userId, "ATUALIZAR_QUESTAO", "Questao", id, data);
    }

    return result;
  }

  async remove(id: string, userId?: string) {
    const questao = await this.prisma.questao.findUnique({
      where: { id },
    });

    if (!questao) {
      throw new NotFoundException("Questão não encontrada");
    }

    const vinculadas = await this.prisma.provaQuestao.findMany({
      where: { questaoId: id },
      include: { prova: true },
    });

    const temProvaPublicada = vinculadas.some(
      (v: ProvaQuestao & { prova: { status: string } }) => v.prova.status !== "RASCUNHO",
    );
    if (temProvaPublicada) {
      throw new BadRequestException(
        "Não é possível remover questão vinculada a uma prova publicada",
      );
    }

    await this.prisma.provaQuestao.deleteMany({
      where: { questaoId: id },
    });

    await this.prisma.questao.delete({
      where: { id },
    });

    if (userId) {
      await this.auditoria.log(userId, "DELETAR_QUESTAO", "Questao", id);
    }

    return { deleted: true };
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import type { ResponderQuestaoDto } from "./dto/prova.dto.js";

const DURACAO_PROVA_MINUTOS = 180; // 3 horas

@Injectable()
export class ProvaService {
  constructor(private prisma: PrismaService) {}

  async buscarQuestoes(userId: string, quantidade = 30) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { userId },
    });

    if (!inscricao || inscricao.status !== "CONFIRMADA") {
      throw new BadRequestException(
        "Inscrição não está confirmada para realizar a prova"
      );
    }

    if (!inscricao.fase1Inicio) {
      throw new BadRequestException("Prova não foi iniciada");
    }

    const fimProva = new Date(
      inscricao.fase1Inicio.getTime() + DURACAO_PROVA_MINUTOS * 60 * 1000
    );

    if (new Date() > fimProva) {
      throw new BadRequestException("Tempo de prova esgotado");
    }

    const questoes = await this.prisma.questao.findMany({
      take: quantidade,
      select: {
        id: true,
        enunciado: true,
        alternativaA: true,
        alternativaB: true,
        alternativaC: true,
        alternativaD: true,
        alternativaE: true,
        eixo: true,
        dificuldade: true,
      },
    });

    // Buscar respostas já dadas
    const respostas = await this.prisma.resposta.findMany({
      where: {
        inscricaoId: inscricao.id,
        questaoId: { in: questoes.map((q) => q.id) },
      },
    });

    const respostasMap = new Map(
      respostas.map((r) => [r.questaoId, r.alternativaMarcada])
    );

    return {
      inscricaoId: inscricao.id,
      inicio: inscricao.fase1Inicio.toISOString(),
      fim: fimProva.toISOString(),
      questoes: questoes.map((q) => ({
        ...q,
        respondida: respostasMap.get(q.id) || null,
      })),
    };
  }

  async responder(userId: string, data: ResponderQuestaoDto) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { userId },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    const questao = await this.prisma.questao.findUnique({
      where: { id: data.questaoId },
    });

    if (!questao) {
      throw new NotFoundException("Questão não encontrada");
    }

    // Find or create the Fase 1 prova for this inscricao's edition
    let prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
    });

    if (!prova) {
      prova = await this.prisma.prova.create({
        data: {
          edicaoId: inscricao.edicaoId,
          fase: 1,
          titulo: "Prova Fase 1",
          duracaoMinutos: DURACAO_PROVA_MINUTOS,
          createdBy: userId,
        },
      });
    }

    const fimProva = inscricao.fase1Inicio
      ? new Date(inscricao.fase1Inicio.getTime() + DURACAO_PROVA_MINUTOS * 60 * 1000)
      : null;

    if (fimProva && new Date() > fimProva) {
      throw new BadRequestException("Tempo de prova esgotado");
    }

    const correta = data.alternativa === questao.correta;

    return this.prisma.resposta.upsert({
      where: {
        inscricaoId_provaId_questaoId: {
          inscricaoId: inscricao.id,
          provaId: prova.id,
          questaoId: data.questaoId,
        },
      },
      create: {
        inscricaoId: inscricao.id,
        provaId: prova.id,
        questaoId: data.questaoId,
        alternativaMarcada: data.alternativa,
        correta,
      },
      update: {
        alternativaMarcada: data.alternativa,
        correta,
      },
    });
  }

  async finalizarProva(userId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { userId },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    const respostas = await this.prisma.resposta.findMany({
      where: { inscricaoId: inscricao.id, correta: true },
    });

    const totalQuestoes = await this.prisma.resposta.count({
      where: { inscricaoId: inscricao.id },
    });

    const nota =
      totalQuestoes > 0 ? (respostas.length / totalQuestoes) * 100 : 0;

    return this.prisma.inscricao.update({
      where: { id: inscricao.id },
      data: {
        fase1Nota: Math.round(nota * 100) / 100,
        fase1Fim: new Date(),
      },
    });
  }

  async resumoProva(userId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { userId },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    const [total, corretas, respondidas] = await Promise.all([
      this.prisma.resposta.count({
        where: { inscricaoId: inscricao.id },
      }),
      this.prisma.resposta.count({
        where: { inscricaoId: inscricao.id, correta: true },
      }),
      this.prisma.resposta.count({
        where: { inscricaoId: inscricao.id },
      }),
    ]);

    return {
      inscricaoId: inscricao.id,
      inicio: inscricao.fase1Inicio?.toISOString() || null,
      fim: inscricao.fase1Fim?.toISOString() || null,
      fase1Nota: inscricao.fase1Nota,
      respondidas,
      corretas,
      total,
      percentual: total > 0 ? Math.round((corretas / total) * 100) : 0,
    };
  }
}

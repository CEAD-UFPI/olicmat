import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import type { ResponderQuestaoDto } from "./dto/prova.dto.js";

const DURACAO_PROVA_MINUTOS = 180; // 3 horas

@Injectable()
export class ProvaService {
  private readonly logger = new Logger(ProvaService.name);

  constructor(private prisma: PrismaService) {}

  async iniciarProva(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, fase1Inicio: true, fase1Fim: true, edicaoId: true },
    });

    if (!inscricao || inscricao.status !== "CONFIRMADA") {
      throw new BadRequestException("Inscrição não confirmada para realizar a prova");
    }

    if (inscricao.fase1Fim) {
      throw new BadRequestException("Prova já foi finalizada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
      select: { id: true, janelaInicio: true, janelaFim: true },
    });

    if (!prova) {
      throw new BadRequestException("Nenhuma prova disponível para esta edição");
    }

    const agora = new Date();
    if (prova.janelaInicio && agora < prova.janelaInicio) {
      throw new BadRequestException("A prova ainda não está disponível para realização");
    }
    if (prova.janelaFim && agora > prova.janelaFim) {
      throw new BadRequestException("A janela de realização desta prova já se encerrou");
    }

    if (!inscricao.fase1Inicio) {
      const updated = await this.prisma.inscricao.update({
        where: { id: inscricao.id },
        data: { fase1Inicio: new Date() },
      });
      return { message: "Prova iniciada com sucesso", inicio: updated.fase1Inicio };
    }

    return { message: "Prova já em andamento", inicio: inscricao.fase1Inicio };
  }

  async buscarQuestoes(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        fase1Inicio: true,
        fase1Fim: true,
        edicaoId: true,
      },
    });

    if (!inscricao || inscricao.status !== "CONFIRMADA") {
      throw new BadRequestException("Inscrição não confirmada para realizar a prova");
    }

    if (!inscricao.fase1Inicio) {
      throw new BadRequestException("Prova não foi iniciada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
      select: { id: true, duracaoMinutos: true, janelaFim: true },
    });

    if (!prova) {
      throw new BadRequestException("Nenhuma prova disponível para esta edição");
    }

    const agora = new Date();
    if (prova.janelaFim && agora > prova.janelaFim) {
      throw new BadRequestException("A janela de realização desta prova já se encerrou");
    }

    const duracaoMinutos = prova.duracaoMinutos || 180;
    const fimProva = new Date(
      inscricao.fase1Inicio.getTime() + duracaoMinutos * 60 * 1000
    );

    if (agora > fimProva || inscricao.fase1Fim) {
      throw new BadRequestException("Tempo de prova esgotado ou já finalizada");
    }

    const provasQuestoes = await this.prisma.provaQuestao.findMany({
      where: { provaId: prova.id },
      include: {
        questao: {
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
        },
      },
      orderBy: { ordem: "asc" },
    });

    const questoes = provasQuestoes.map((pq) => pq.questao);

    const respostas = await this.prisma.resposta.findMany({
      where: {
        inscricaoId: inscricao.id,
        questaoId: { in: questoes.map((q) => q.id) },
      },
      select: { questaoId: true, alternativaMarcada: true },
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
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, edicaoId: true, fase1Inicio: true, fase1Fim: true },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    if (inscricao.fase1Fim) {
      throw new BadRequestException("Prova já foi finalizada");
    }

    const questao = await this.prisma.questao.findUnique({
      where: { id: data.questaoId },
      select: { id: true, correta: true },
    });

    if (!questao) {
      throw new NotFoundException("Questão não encontrada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
      select: { id: true, duracaoMinutos: true, janelaFim: true },
    });

    if (!prova) {
      throw new BadRequestException("Nenhuma prova disponível para esta edição");
    }

    const agora = new Date();
    if (prova.janelaFim && agora > prova.janelaFim) {
      throw new BadRequestException("A janela de realização desta prova já se encerrou");
    }

    const duracaoMinutos = prova.duracaoMinutos || 180;
    const fimProva = inscricao.fase1Inicio
      ? new Date(inscricao.fase1Inicio.getTime() + duracaoMinutos * 60 * 1000)
      : null;

    if (fimProva && agora > fimProva) {
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
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        edicaoId: true,
        fase1Fim: true,
        fase1Nota: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    if (inscricao.fase1Fim) {
      return this.prisma.inscricao.findUnique({ where: { id: inscricao.id } });
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
      select: { id: true },
    });

    const groups = await this.prisma.resposta.groupBy({
      by: ["correta"],
      where: { inscricaoId: inscricao.id },
      _count: { _all: true },
    });

    let corretas = 0;
    for (const g of groups) {
      if (g.correta) corretas = g._count._all;
    }

    let totalQuestoes = 0;
    if (prova) {
      totalQuestoes = await this.prisma.provaQuestao.count({
        where: { provaId: prova.id },
      });
    }

    const nota = totalQuestoes > 0 ? (corretas / totalQuestoes) * 100 : 0;

    return this.prisma.inscricao.update({
      where: { id: inscricao.id },
      data: {
        fase1Nota: Math.round(nota * 100) / 100,
        fase1Fim: new Date(),
      },
    });
  }

  async resumoProva(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        edicaoId: true,
        fase1Inicio: true,
        fase1Fim: true,
        fase1Nota: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    const prova = await this.prisma.prova.findFirst({
      where: { edicaoId: inscricao.edicaoId, fase: 1 },
      select: { id: true },
    });

    let total = 0;
    if (prova) {
      total = await this.prisma.provaQuestao.count({ where: { provaId: prova.id } });
    }

    const groups = await this.prisma.resposta.groupBy({
      by: ["correta"],
      where: { inscricaoId: inscricao.id },
      _count: { _all: true },
    });

    let respondidas = 0;
    let corretas = 0;
    for (const g of groups) {
      respondidas += g._count._all;
      if (g.correta) corretas = g._count._all;
    }

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

  async obterMonitoramento() {
    const emAndamento = await this.prisma.inscricao.count({
      where: {
        fase1Inicio: { not: null },
        fase1Fim: null,
      },
    });

    const finalizadas = await this.prisma.inscricao.count({
      where: {
        fase1Fim: { not: null },
      },
    });

    const mediaNota = await this.prisma.inscricao.aggregate({
      where: { fase1Nota: { not: null } },
      _avg: { fase1Nota: true },
    });

    return {
      emAndamento,
      finalizadas,
      totalAtivos: emAndamento + finalizadas,
      mediaNotaFase1: mediaNota._avg.fase1Nota ? Math.round(mediaNota._avg.fase1Nota * 100) / 100 : 0,
    };
  }
}

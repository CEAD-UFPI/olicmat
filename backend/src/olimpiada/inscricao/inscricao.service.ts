import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import type { CriarInscricaoDto, EditarInscricaoDto } from "./dto/inscricao.dto.js";

const TEMAS_GERADORES = [
  "Funções no Cotidiano",
  "Geometria e Arte",
  "Probabilidade e Jogos",
  "Matemática Financeira",
  "Trigonometria Aplicada",
  "Modelagem Matemática",
  "Educação Matemática Inclusiva",
  "Tecnologias no Ensino de Matemática",
  "Resolução de Problemas",
  "História da Matemática em Sala de Aula",
];

@Injectable()
export class InscricaoService {
  constructor(private prisma: PrismaService) {}

  async criar(userId: string, data: CriarInscricaoDto) {
    // Look up the first active edicao (simplified — proper selection TBD)
    let edicao = await this.prisma.edicao.findFirst({
      where: { status: "PLANEJAMENTO" },
      orderBy: { ano: "desc" },
    });

    if (!edicao) {
      // Fallback: create a default edition if none exists
      edicao = await this.prisma.edicao.create({
        data: {
          ano: new Date().getFullYear(),
          titulo: `OLICMAT ${new Date().getFullYear()}`,
          status: "PLANEJAMENTO",
        },
      });
    }

    // Check for existing enrollment in this edition
    const existente = await this.prisma.inscricao.findUnique({
      where: { userId_edicaoId: { userId, edicaoId: edicao.id } },
    });

    if (existente) {
      throw new ConflictException("Você já possui uma inscrição nesta edição");
    }

    return this.prisma.inscricao.create({
      data: {
        userId,
        edicaoId: edicao.id,
        estado: data.estado.toUpperCase(),
        municipio: data.municipio,
        instituicaoId: data.instituicaoId,
        cursoId: data.cursoId,
        periodo: data.periodo,
      },
    });
  }

  async buscarPorUsuario(userId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    return inscricao;
  }

  async confirmar(inscricaoId: string) {
    return this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data: { status: "CONFIRMADA" },
    });
  }

  async iniciarProva(inscricaoId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
    });

    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    if (inscricao.status !== "CONFIRMADA") {
      throw new BadRequestException(
        "Inscrição precisa estar confirmada para iniciar a prova"
      );
    }

    if (inscricao.fase1Inicio) {
      throw new BadRequestException("Prova já foi iniciada");
    }

    return this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data: { fase1Inicio: new Date() },
    });
  }

  async sortearTema(inscricaoId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
    });

    if (!inscricao || inscricao.status !== "CONFIRMADA") {
      throw new BadRequestException(
        "Inscrição não está apta para a Fase 2"
      );
    }

    if (!inscricao.fase1Nota || inscricao.fase1Nota < 60) {
      throw new BadRequestException(
        "Nota mínima da Fase 1 não atingida"
      );
    }

    if (inscricao.fase2Tema) {
      throw new BadRequestException("Tema já foi sorteado");
    }

    const tema = TEMAS_GERADORES[Math.floor(Math.random() * TEMAS_GERADORES.length)];

    return this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data: { fase2Tema: tema },
    });
  }

  async listarTodas(status?: string) {
    return this.prisma.inscricao.findMany({
      where: status ? { status: status as "PENDENTE" | "CONFIRMADA" | "REJEITADA" } : undefined,
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            instituicao: { select: { id: true, nome: true, sigla: true } },
          },
        },
        instituicao: { select: { id: true, nome: true, sigla: true } },
        curso: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async atualizarStatus(inscricaoId: string, status: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
    });
    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }
    return this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data: { status: status as "PENDENTE" | "CONFIRMADA" | "REJEITADA" },
    });
  }

  async editar(inscricaoId: string, data: EditarInscricaoDto) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
    });
    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }
    return this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data,
    });
  }

  async deletar(inscricaoId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
    });
    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    // Clean up related records first
    await this.prisma.resposta.deleteMany({ where: { inscricaoId } });
    await this.prisma.envioFase2.deleteMany({ where: { inscricaoId } });
    await this.prisma.avaliacaoFase2.deleteMany({ where: { inscricaoId } });

    return this.prisma.inscricao.delete({ where: { id: inscricaoId } });
  }
}

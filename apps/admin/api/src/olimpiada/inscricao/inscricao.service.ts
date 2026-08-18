import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../../admin/auditoria/auditoria.service.js";
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
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
  ) {}

  private async getCoordenadorCursos(coordenadorId: string) {
    const cursos = await this.prisma.coordenadorCurso.findMany({
      where: { userId: coordenadorId },
      select: { cursoId: true },
    });
    return cursos.map((c) => c.cursoId);
  }

  /**
   * Boundary enforcement for inscription status changes.
   * ADMIN and COMISSAO manage any inscription; COORDENADOR_CURSO
   * may only manage inscriptions of students in their own course.
   */
  private async enforceInscricaoScope(
    actor: { id: string; role: string },
    inscricao: { cursoId: string }
  ) {
    if (actor.role === "ADMIN" || actor.role === "COMISSAO") {
      return;
    }

    if (actor.role === "COORDENADOR_CURSO") {
      const cursos = await this.getCoordenadorCursos(actor.id);
      if (!cursos.includes(inscricao.cursoId)) {
        throw new ForbiddenException(
          "Você só pode gerenciar inscrições de participantes do seu curso"
        );
      }
      return;
    }

    throw new ForbiddenException("Acesso negado");
  }

  async criar(userId: string, data: CriarInscricaoDto) {
    let edicao = await this.prisma.edicao.findFirst({
      where: { status: "PLANEJAMENTO" },
      orderBy: { ano: "desc" },
    });

    if (!edicao) {
      edicao = await this.prisma.edicao.create({
        data: {
          ano: new Date().getFullYear(),
          titulo: `OLICMAT ${new Date().getFullYear()}`,
          status: "PLANEJAMENTO",
        },
      });
    }

    const existente = await this.prisma.inscricao.findUnique({
      where: { userId_edicaoId: { userId, edicaoId: edicao.id } },
    });

    if (existente) {
      throw new ConflictException("Você já possui uma inscrição nesta edição");
    }

    let instituicaoId = data.instituicaoId;
    let cursoId = data.cursoId;

    if (!instituicaoId && data.instituicao) {
      const inst = await this.prisma.instituicao.upsert({
        where: { sigla: data.instituicao.toUpperCase() },
        update: {},
        create: {
          nome: data.instituicao,
          sigla: data.instituicao.toUpperCase(),
          codigoInep: `AUTO_${Date.now()}`,
          uf: data.estado.toUpperCase(),
        },
        select: { id: true },
      });
      instituicaoId = inst.id;
    }

    if (!cursoId && data.curso && instituicaoId) {
      const curso = await this.prisma.curso.upsert({
        where: {
          nome_instituicaoId: { nome: data.curso, instituicaoId },
        },
        update: {},
        create: { nome: data.curso, instituicaoId },
        select: { id: true },
      });
      cursoId = curso.id;
    }

    return this.prisma.inscricao.create({
      data: {
        userId,
        edicaoId: edicao.id,
        estado: data.estado.toUpperCase(),
        municipio: data.municipio,
        instituicaoId: instituicaoId!,
        cursoId: cursoId!,
        periodo: data.periodo,
      },
    });
  }

  async buscarPorUsuario(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
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

  async confirmar(inscricaoId: string, actor: { id: string; role: string }) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
    });
    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    await this.enforceInscricaoScope(actor, inscricao);

    const result = await this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data: { status: "CONFIRMADA" },
    });

    await this.auditoria.log(actor.id, "CONFIRMAR_INSCRICAO", "Inscricao", inscricaoId);

    return result;
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
        "Inscrição precisa estar confirmada para iniciar a prova",
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
        "Inscrição não está apta para a Fase 2",
      );
    }

    if (!inscricao.fase1Nota || inscricao.fase1Nota < 60) {
      throw new BadRequestException(
        "Nota mínima da Fase 1 não atingida",
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

  async listarTodas(userRole?: string, userId?: string, cursoId?: string, status?: string) {
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status as "PENDENTE" | "CONFIRMADA" | "REJEITADA";
    }

    // Business rules: role-based access
    if (userRole === "ALUNO" && userId) {
      where.userId = userId;
    } else if (userRole === "COORDENADOR_CURSO" && cursoId) {
      where.cursoId = cursoId;
    }
    // ADMIN, COMISSAO, AVALIADOR see all

    return this.prisma.inscricao.findMany({
      where,
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

  async atualizarStatus(inscricaoId: string, status: string, actor: { id: string; role: string }) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
    });
    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    await this.enforceInscricaoScope(actor, inscricao);

    const result = await this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data: { status: status as "PENDENTE" | "CONFIRMADA" | "REJEITADA" },
    });

    await this.auditoria.log(actor.id, "ATUALIZAR_STATUS_INSCRICAO", "Inscricao", inscricaoId, { status });

    return result;
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

  async deletar(inscricaoId: string, actorId: string) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
    });
    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    await this.prisma.resposta.deleteMany({ where: { inscricaoId } });
    await this.prisma.envioFase2.deleteMany({ where: { inscricaoId } });
    await this.prisma.avaliacaoFase2.deleteMany({ where: { inscricaoId } });

    await this.auditoria.log(actorId, "DELETAR_INSCRICAO", "Inscricao", inscricaoId);

    return this.prisma.inscricao.delete({ where: { id: inscricaoId } });
  }
}

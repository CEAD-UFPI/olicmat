import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../../admin/auditoria/auditoria.service.js";
import { EmailService } from "../../email/email.service.js";
import { NotificacoesService } from "../../notificacoes/notificacoes.service.js";
import type { CriarInscricaoDto, EditarInscricaoDto } from "./dto/inscricao.dto.js";
import type { PaginationParams } from "../../common/pagination.js";
import { getSkipTake, paginate } from "../../common/pagination.js";

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
    private email: EmailService,
    private notificacoes: NotificacoesService,
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

  /**
   * Aplica a mudança de status com histórico, e-mail e notificação. Não é
   * chamado diretamente por rotas — `confirmar` e `atualizarStatus` delegam
   * para cá depois de resolver a inscrição e checar o escopo do ator.
   */
  private async aplicarMudancaStatus(
    inscricao: {
      id: string;
      status: string;
      user: { id: string; email: string; nome: string };
    },
    statusNovo: "PENDENTE" | "CONFIRMADA" | "REJEITADA",
    actor: { id: string; role: string },
    justificativa?: string,
  ) {
    // CONFIRMADA é definitivo: existe apenas 1 aceite válido por inscrição, e
    // nenhum ator (nem ADMIN) pode reabri-la pelos endpoints normais.
    if (inscricao.status === "CONFIRMADA") {
      throw new ConflictException(
        "Esta inscrição já foi confirmada e não pode mais ser alterada",
      );
    }

    if (statusNovo === "REJEITADA" && !justificativa) {
      throw new BadRequestException(
        "É obrigatório informar a justificativa ao rejeitar uma inscrição",
      );
    }

    const statusAnterior = inscricao.status as "PENDENTE" | "CONFIRMADA" | "REJEITADA";

    const result = await this.prisma.inscricao.update({
      where: { id: inscricao.id },
      data: { status: statusNovo },
    });

    await this.prisma.inscricaoHistorico.create({
      data: {
        inscricaoId: inscricao.id,
        statusAnterior,
        statusNovo,
        justificativa: statusNovo === "REJEITADA" ? justificativa : undefined,
        actorId: actor.id,
      },
    });

    if (statusNovo === "CONFIRMADA" || statusNovo === "REJEITADA") {
      await Promise.resolve(
        this.email.enviarStatusInscricao(inscricao.user.email, inscricao.user.nome, statusNovo, justificativa),
      ).catch(() => undefined); // e-mail é best-effort: falha de envio não pode reverter a decisão já gravada

      await this.notificacoes.criar(
        inscricao.user.id,
        statusNovo === "CONFIRMADA" ? "Inscrição confirmada" : "Inscrição rejeitada",
        statusNovo === "CONFIRMADA"
          ? "Sua inscrição na OLICMAT foi confirmada pela coordenação do seu curso."
          : `Sua inscrição foi rejeitada. Motivo: ${justificativa}`,
        "/competidor/inscricao",
      );
    }

    return result;
  }

  async listarEdicoesAbertas() {
    const agora = new Date();
    return this.prisma.edicao.findMany({
      where: {
        status: "ATIVA",
        dataInicio: { lte: agora },
        dataFim: { gte: agora },
      },
      select: { id: true, ano: true, semestre: true, titulo: true },
      orderBy: [{ ano: "desc" }, { semestre: "desc" }],
    });
  }

  async criar(userId: string, data: CriarInscricaoDto) {
    const agora = new Date();

    const edicoesAbertas = await this.prisma.edicao.findMany({
      where: {
        status: "ATIVA",
        dataInicio: { lte: agora },
        dataFim: { gte: agora },
      },
      select: { id: true, ano: true, semestre: true },
      orderBy: [{ ano: "desc" }, { semestre: "desc" }],
    });

    if (edicoesAbertas.length === 0) {
      throw new BadRequestException("Nenhuma edição aberta para inscrição");
    }

    let edicaoId: string;

    if (data.edicaoId) {
      const edicaoValida = edicoesAbertas.find((e) => e.id === data.edicaoId);
      if (!edicaoValida) {
        throw new BadRequestException(
          "A edição informada não está aberta para inscrição",
        );
      }
      edicaoId = edicaoValida.id;
    } else if (edicoesAbertas.length === 1) {
      edicaoId = edicoesAbertas[0].id;
    } else {
      throw new BadRequestException(
        "Há mais de uma edição aberta; informe edicaoId",
      );
    }

    const existente = await this.prisma.inscricao.findUnique({
      where: { userId_edicaoId: { userId, edicaoId } },
    });

    if (existente) {
      throw new ConflictException("Você já possui uma inscrição nesta edição");
    }

    // Quem foi convidado pela coordenação já tem curso e instituição
    // definidos por ela, e eles prevalecem sobre o que vier na requisição.
    //
    // Não é formalidade: a Fase 1 classifica até 50% dos participantes DE CADA
    // INSTITUIÇÃO e as bolsas são distribuídas por instituição. Deixar o
    // próprio inscrito declarar onde estuda permitiria escolher contra quem
    // competir — e, pelo upsert abaixo, até inventar uma instituição.
    const vinculo = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        instituicaoId: true,
        cursoId: true,
        curso: { select: { instituicaoId: true } },
      },
    });

    // A instituição é lida do curso, e não do campo do usuário: se os dois
    // divergirem por qualquer motivo, o curso é a fonte de verdade.
    const cursoVinculado = vinculo?.cursoId ?? null;
    let cursoId = cursoVinculado ?? data.cursoId;
    let instituicaoId = cursoVinculado
      ? (vinculo?.curso?.instituicaoId ?? vinculo?.instituicaoId)
      : data.instituicaoId;

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
        edicaoId,
        estado: data.estado.toUpperCase(),
        municipio: data.municipio,
        comprovanteUrl: data.comprovanteUrl ?? null,
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
      include: { user: { select: { id: true, email: true, nome: true } } },
    });
    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    await this.enforceInscricaoScope(actor, inscricao);

    const result = await this.aplicarMudancaStatus(inscricao, "CONFIRMADA", actor);

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

  async listarTodas(
    userRole?: string,
    userId?: string,
    cursoId?: string,
    status?: string,
    params?: PaginationParams
  ) {
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

    const include = {
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
    };
    const orderBy = { createdAt: "desc" as const };

    if (params?.page === undefined && params?.limit === undefined) {
      return this.prisma.inscricao.findMany({ where, include, orderBy });
    }

    const { skip, take } = getSkipTake(params);
    const [data, total] = await Promise.all([
      this.prisma.inscricao.findMany({ where, include, orderBy, skip, take }),
      this.prisma.inscricao.count({ where }),
    ]);

    return paginate(data, total, params);
  }

  async atualizarStatus(
    inscricaoId: string,
    status: string,
    actor: { id: string; role: string },
    justificativa?: string,
  ) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      include: { user: { select: { id: true, email: true, nome: true } } },
    });
    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }

    await this.enforceInscricaoScope(actor, inscricao);

    const result = await this.aplicarMudancaStatus(
      inscricao,
      status as "PENDENTE" | "CONFIRMADA" | "REJEITADA",
      actor,
      justificativa,
    );

    await this.auditoria.log(actor.id, "ATUALIZAR_STATUS_INSCRICAO", "Inscricao", inscricaoId, {
      status,
      justificativa,
    });

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

  async listarHistorico(inscricaoId: string) {
    return this.prisma.inscricaoHistorico.findMany({
      where: { inscricaoId },
      orderBy: { createdAt: "asc" },
      include: { actor: { select: { nome: true, role: true } } },
    });
  }

  /**
   * Reenvio pelo próprio aluno após rejeição. Só é permitido dentro do prazo
   * de inscrição da edição (ou se a edição não tiver prazo definido) — depois
   * disso o direito de reenviar se encerra junto com a inscrição.
   */
  async reenviar(inscricaoId: string, dados: EditarInscricaoDto, actor: { id: string; role: string }) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      include: { edicao: { select: { prazoInscricao: true } } },
    });
    if (!inscricao) {
      throw new NotFoundException("Inscrição não encontrada");
    }
    if (inscricao.userId !== actor.id) {
      throw new ForbiddenException("Você só pode reenviar sua própria inscrição");
    }
    if (inscricao.status !== "REJEITADA") {
      throw new BadRequestException("Só é possível reenviar uma inscrição rejeitada");
    }
    if (inscricao.edicao.prazoInscricao && new Date() > inscricao.edicao.prazoInscricao) {
      throw new BadRequestException("O prazo de inscrição desta edição já encerrou");
    }

    const result = await this.prisma.inscricao.update({
      where: { id: inscricaoId },
      data: { ...dados, status: "PENDENTE" },
    });

    await this.prisma.inscricaoHistorico.create({
      data: {
        inscricaoId,
        statusAnterior: "REJEITADA",
        statusNovo: "PENDENTE",
        actorId: actor.id,
      },
    });

    return result;
  }
}

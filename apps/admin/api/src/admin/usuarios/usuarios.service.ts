import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../auditoria/auditoria.service.js";
import { EmailService } from "../../email/email.service.js";
import type { CriarUsuarioDto, AtualizarUsuarioDto } from "./dto/usuarios.dto.js";
import type { PaginationParams } from "../../common/pagination.js";
import { getSkipTake, paginate } from "../../common/pagination.js";

@Injectable()
export class AdminUsuariosService {
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
    private emailService: EmailService,
  ) {}

  private async getCoordenadorCursos(coordenadorId: string) {
    const cursos = await this.prisma.coordenadorCurso.findMany({
      where: { userId: coordenadorId },
      select: { cursoId: true },
    });
    return cursos.map((c) => c.cursoId);
  }

  private async enforceScope(
    actor: { id: string; role: string },
    targetUser: { role: string; instituicaoId: string | null; cursoId: string | null }
  ) {
    if (actor.role === "ADMIN") {
      return;
    }

    if (actor.role === "COMISSAO") {
      const allowedRoles = ["COORDENADOR_CURSO", "AVALIADOR", "ALUNO"];
      if (!allowedRoles.includes(targetUser.role)) {
        throw new ForbiddenException(
          "A Comissão só pode gerenciar Coordenadores de Curso, Avaliadores e Alunos"
        );
      }
      return;
    }

    if (actor.role === "COORDENADOR_CURSO") {
      if (targetUser.role !== "ALUNO") {
        throw new ForbiddenException("Coordenadores de Curso só podem gerenciar Alunos");
      }

      const coordUser = await this.prisma.user.findUnique({
        where: { id: actor.id },
        select: { instituicaoId: true },
      });

      if (!coordUser || !coordUser.instituicaoId) {
        throw new ForbiddenException("Coordenador não possui instituição vinculada");
      }

      if (targetUser.instituicaoId !== coordUser.instituicaoId) {
        throw new ForbiddenException("O Aluno deve pertencer à mesma instituição do Coordenador");
      }

      const coordinatedCourses = await this.getCoordenadorCursos(actor.id);
      if (!targetUser.cursoId || !coordinatedCourses.includes(targetUser.cursoId)) {
        throw new ForbiddenException("O Aluno deve pertencer a um curso sob coordenação");
      }
      return;
    }

    throw new ForbiddenException("Acesso negado");
  }

  async findAll(actor: { id: string; role: string }, params?: PaginationParams) {
    const where: any = {};

    if (actor.role === "COMISSAO") {
      where.role = { in: ["COORDENADOR_CURSO", "AVALIADOR", "ALUNO"] };
    } else if (actor.role === "COORDENADOR_CURSO") {
      const coordUser = await this.prisma.user.findUnique({
        where: { id: actor.id },
        select: { instituicaoId: true }
      });
      if (!coordUser || !coordUser.instituicaoId) {
        return [];
      }
      const coordinatedCourses = await this.getCoordenadorCursos(actor.id);
      if (coordinatedCourses.length === 0) {
        return [];
      }
      where.role = "ALUNO";
      where.instituicaoId = coordUser.instituicaoId;
      where.cursoId = { in: coordinatedCourses };
    } else if (actor.role !== "ADMIN") {
      throw new ForbiddenException("Acesso negado");
    }

    const select = {
      id: true,
      nome: true,
      email: true,
      role: true,
      matricula: true,
      comprovanteUrl: true,
      createdAt: true,
      instituicao: { select: { nome: true, sigla: true } },
      curso: { select: { nome: true } },
    };
    const orderBy = { createdAt: "desc" as const };

    const toDto = (u: any) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      role: u.role,
      matricula: u.matricula,
      comprovanteUrl: u.comprovanteUrl,
      createdAt: u.createdAt,
      instituicao: u.instituicao?.sigla ?? u.instituicao?.nome ?? undefined,
      curso: u.curso?.nome ?? undefined,
    });

    if (params?.page === undefined && params?.limit === undefined) {
      const users = await this.prisma.user.findMany({ where, select, orderBy });
      return users.map(toDto);
    }

    const { skip, take } = getSkipTake(params);
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where, select, orderBy, skip, take }),
      this.prisma.user.count({ where }),
    ]);

    return paginate(users.map(toDto), total, params);
  }

  async findById(id: string, actor: { id: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        nomeSocial: true,
        nomeMae: true,
        email: true,
        cpf: true,
        role: true,
        matricula: true,
        comprovanteUrl: true,
        dataNascimento: true,
        telefone: true,
        celular: true,
        genero: true,
        racaCor: true,
        possuiDeficiencia: true,
        cotista: true,
        bolsista: true,
        tipoBolsa: true,
        documentoIdentificacao: true,
        nacionalidade: true,
        cep: true,
        numero: true,
        enderecoCompleto: true,
        complemento: true,
        bairro: true,
        uf: true,
        municipio: true,
        pontoReferencia: true,
        formacao: true,
        titulacao: true,
        areaFormacao: true,
        createdAt: true,
        updatedAt: true,
        instituicaoId: true,
        cursoId: true,
        instituicao: { select: { id: true, nome: true, sigla: true } },
        curso: { select: { id: true, nome: true } },
        inscricoes: {
          select: { id: true, status: true, edicao: { select: { ano: true } } },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    await this.enforceScope(actor, user);

    return user;
  }

  async create(data: CriarUsuarioDto, actor: { id: string; role: string }) {
    let instituicaoId: string | null = data.instituicaoId ?? null;
    let cursoId: string | null = data.cursoId ?? null;

    // Coordenadores cadastram Alunos do próprio curso: o Aluno herda
    // Instituição e Curso do coordenador, sem poder alterá-los depois.
    if (actor.role === "COORDENADOR_CURSO" && data.role === "ALUNO") {
      const vinculo = await this.prisma.coordenadorCurso.findUnique({
        where: { userId: actor.id },
        include: { curso: { select: { id: true, instituicaoId: true } } },
      });

      if (!vinculo) {
        throw new ForbiddenException("Coordenador não possui curso vinculado");
      }

      instituicaoId = vinculo.curso.instituicaoId;
      cursoId = vinculo.curso.id;
    }

    await this.enforceScope(actor, {
      role: data.role,
      instituicaoId,
      cursoId,
    });

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { cpf: data.cpf }],
      },
    });

    if (existing) {
      throw new ConflictException("Email ou CPF já cadastrado");
    }

    const rawSenha = data.senha || randomBytes(16).toString("hex");
    const senhaHash = await bcrypt.hash(rawSenha, 10);
    const { senha, ...rest } = data;

    const user = await this.prisma.user.create({
      data: {
        nome: rest.nome,
        nomeSocial: rest.nomeSocial ?? null,
        nomeMae: rest.nomeMae,
        email: rest.email,
        cpf: rest.cpf,
        role: rest.role as any,
        matricula: rest.matricula ?? "",
        dataNascimento: new Date(rest.dataNascimento),
        senhaHash,
        instituicaoId,
        cursoId,
        telefone: rest.telefone ?? null,
        celular: rest.celular ?? null,
        genero: rest.genero as never ?? null,
        racaCor: rest.racaCor as never ?? null,
        possuiDeficiencia: rest.possuiDeficiencia ?? null,
        cotista: rest.cotista ?? null,
        bolsista: rest.bolsista ?? null,
        tipoBolsa: rest.tipoBolsa as never ?? null,
        documentoIdentificacao: rest.documentoIdentificacao ?? null,
        nacionalidade: rest.nacionalidade ?? null,
        cep: rest.cep ?? null,
        numero: rest.numero ?? null,
        enderecoCompleto: rest.enderecoCompleto ?? null,
        complemento: rest.complemento ?? null,
        bairro: rest.bairro ?? null,
        uf: rest.uf ?? null,
        municipio: rest.municipio ?? null,
        pontoReferencia: rest.pontoReferencia ?? null,
        formacao: rest.formacao ?? null,
        titulacao: rest.titulacao as never ?? null,
        areaFormacao: rest.areaFormacao ?? null,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const tokenValue = randomBytes(32).toString("hex");
    await this.prisma.token.create({
      data: {
        userId: user.id,
        tipo: "PASSWORD_RESET",
        token: tokenValue,
        expiraEm: new Date(Date.now() + 24 * 60 * 60 * 1000), // expira em 24h
      },
    });

    try {
      await this.emailService.enviarDefinicaoSenha(user.email, user.nome, tokenValue);
    } catch (emailErr) {
      // Log do erro sem interromper o fluxo principal
      this.prisma.token.delete({ where: { token: tokenValue } }).catch(() => {});
      console.error(`Erro ao enviar email de definicao de senha para ${user.email}:`, emailErr);
    }

    await this.auditoria.log(actor.id, "CRIAR_USUARIO", "User", user.id, {
      email: data.email,
      role: data.role,
    });

    return user;
  }

  async update(id: string, data: AtualizarUsuarioDto, actor: { id: string; role: string }) {
    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException("Usuário não encontrado");
    }

    await this.enforceScope(actor, targetUser);

    const updatedState = {
      role: data.role ?? targetUser.role,
      instituicaoId: data.instituicaoId !== undefined ? data.instituicaoId : targetUser.instituicaoId,
      cursoId: data.cursoId !== undefined ? data.cursoId : targetUser.cursoId,
    };
    await this.enforceScope(actor, updatedState);

    if (data.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException("Email já está em uso por outro usuário");
      }
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields: (keyof AtualizarUsuarioDto)[] = [
      "nome", "nomeSocial", "nomeMae", "email", "role", "matricula",
      "instituicaoId", "cursoId", "comprovanteUrl", "telefone", "celular",
      "genero", "racaCor", "possuiDeficiencia", "cotista", "bolsista",
      "tipoBolsa", "documentoIdentificacao", "nacionalidade", "cep",
      "numero", "enderecoCompleto", "complemento", "bairro", "uf",
      "municipio", "pontoReferencia", "formacao", "titulacao", "areaFormacao",
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field] === null ? null : data[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException("Nenhum campo para atualizar");
    }

    const result = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        matricula: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.auditoria.log(actor.id, "ATUALIZAR_USUARIO", "User", id, updateData);

    return result;
  }

  async delete(id: string, actor: { id: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { inscricoes: { select: { id: true } } },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    await this.enforceScope(actor, user);

    if (user.inscricoes?.length) {
      throw new BadRequestException(
        "Não é possível excluir usuário com inscrições ativas. Remova as inscrições primeiro.",
      );
    }

    await this.prisma.user.delete({ where: { id } });

    await this.auditoria.log(actor.id, "DELETAR_USUARIO", "User", id);

    return { message: "Usuário excluído com sucesso" };
  }
}

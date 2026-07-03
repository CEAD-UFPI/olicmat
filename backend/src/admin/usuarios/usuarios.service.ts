import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../auditoria/auditoria.service.js";
import type { CriarUsuarioDto, AtualizarUsuarioDto } from "./dto/usuarios.dto.js";

@Injectable()
export class AdminUsuariosService {
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        matricula: true,
        comprovanteUrl: true,
        createdAt: true,
        instituicao: { select: { nome: true, sigla: true } },
        curso: { select: { nome: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return users.map((u) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      role: u.role,
      matricula: u.matricula,
      comprovanteUrl: u.comprovanteUrl,
      createdAt: u.createdAt,
      instituicao: u.instituicao?.sigla ?? u.instituicao?.nome ?? undefined,
      curso: u.curso?.nome ?? undefined,
    }));
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        role: true,
        matricula: true,
        dataNascimento: true,
        comprovanteUrl: true,
        createdAt: true,
        updatedAt: true,
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

    return user;
  }

  async create(data: CriarUsuarioDto, actorId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { cpf: data.cpf }],
      },
    });

    if (existing) {
      throw new ConflictException("Email ou CPF já cadastrado");
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);
    const { senha, ...rest } = data;

    const user = await this.prisma.user.create({
      data: {
        nome: rest.nome,
        email: rest.email,
        cpf: rest.cpf,
        role: rest.role,
        matricula: rest.matricula ?? "",
        dataNascimento: new Date(rest.dataNascimento),
        senhaHash,
        instituicaoId: rest.instituicaoId ?? null,
        cursoId: rest.cursoId ?? null,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (actorId) {
      await this.auditoria.log(actorId, "CRIAR_USUARIO", "User", user.id, {
        email: data.email,
        role: data.role,
      });
    }

    return user;
  }

  async update(id: string, data: AtualizarUsuarioDto, actorId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    if (data.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException("Email já está em uso por outro usuário");
      }
    }

    const result = await this.prisma.user.update({
      where: { id },
      data,
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

    if (actorId) {
      await this.auditoria.log(actorId, "ATUALIZAR_USUARIO", "User", id, data);
    }

    return result;
  }

  async delete(id: string, actorId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { inscricoes: { select: { id: true } } },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    if (user.inscricoes?.length) {
      throw new BadRequestException(
        "Não é possível excluir usuário com inscrições ativas. Remova as inscrições primeiro.",
      );
    }

    await this.prisma.user.delete({ where: { id } });

    if (actorId) {
      await this.auditoria.log(actorId, "DELETAR_USUARIO", "User", id);
    }

    return { message: "Usuário excluído com sucesso" };
  }
}

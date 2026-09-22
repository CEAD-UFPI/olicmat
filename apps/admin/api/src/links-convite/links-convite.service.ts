import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { PrismaService } from "../prisma.service.js";
import { Role } from "../../generated/prisma/enums.js";
import type { PaginationParams } from "../common/pagination.js";
import { getSkipTake, paginate } from "../common/pagination.js";
import type {
  CriarLinkConviteDto,
  CadastrarPorLinkDto,
} from "./dto/links-convite.dto.js";

@Injectable()
export class LinksConviteService {
  constructor(private prisma: PrismaService) {}

  // ── Coordenador ──────────────────────────────────────────────

  async obterLinkCoordenador(coordenadorId: string) {
    const link = await this.prisma.linkConvite.findFirst({
      where: { criadoPorId: coordenadorId, role: Role.ALUNO },
    });
    if (!link) {
      return { token: null, totalCadastros: 0 };
    }
    const totalCadastros = await this.prisma.user.count({
      where: { origemLinkId: link.id },
    });
    return { token: link.token, totalCadastros };
  }

  async gerarOuRegenerarLinkCoordenador(coordenadorId: string) {
    const vinculo = await this.prisma.coordenadorCurso.findUnique({
      where: { userId: coordenadorId },
      include: { curso: { select: { id: true, instituicaoId: true } } },
    });
    if (!vinculo) {
      throw new ForbiddenException("Coordenador não possui curso vinculado");
    }

    const token = randomBytes(32).toString("hex");
    const existente = await this.prisma.linkConvite.findFirst({
      where: { criadoPorId: coordenadorId, role: Role.ALUNO },
    });

    if (existente) {
      return this.prisma.linkConvite.update({
        where: { id: existente.id },
        data: { token },
      });
    }

    return this.prisma.linkConvite.create({
      data: {
        token,
        role: Role.ALUNO,
        cursoId: vinculo.curso.id,
        instituicaoId: vinculo.curso.instituicaoId,
        criadoPorId: coordenadorId,
      },
    });
  }

  // ── Admin/Comissão ───────────────────────────────────────────

  async listarLinksAdmin(params: PaginationParams) {
    const { skip, take } = getSkipTake(params);
    const [links, total] = await Promise.all([
      this.prisma.linkConvite.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          curso: { select: { id: true, nome: true } },
          instituicao: { select: { id: true, nome: true, sigla: true } },
          criadoPor: { select: { id: true, nome: true } },
        },
      }),
      this.prisma.linkConvite.count(),
    ]);

    const comContadores = await Promise.all(
      links.map(async (link: { id: string }) => ({
        ...link,
        totalCadastros: await this.prisma.user.count({
          where: { origemLinkId: link.id },
        }),
      })),
    );

    return paginate(comContadores, total, params);
  }

  async criarLinkAdmin(dados: CriarLinkConviteDto, actor: { id: string }) {
    let instituicaoId: string | null = null;

    if (dados.cursoId) {
      const curso = await this.prisma.curso.findUnique({
        where: { id: dados.cursoId },
        select: { instituicaoId: true },
      });
      if (!curso) {
        throw new BadRequestException("Curso não encontrado");
      }
      instituicaoId = curso.instituicaoId;
    }

    const token = randomBytes(32).toString("hex");
    return this.prisma.linkConvite.create({
      data: {
        token,
        role: dados.role as Role,
        cursoId: dados.cursoId ?? null,
        instituicaoId,
        criadoPorId: actor.id,
      },
    });
  }

  async regenerarLinkAdmin(id: string) {
    const link = await this.prisma.linkConvite.findUnique({ where: { id } });
    if (!link) {
      throw new NotFoundException("Link não encontrado");
    }

    const token = randomBytes(32).toString("hex");
    return this.prisma.linkConvite.update({
      where: { id },
      data: { token },
    });
  }
}

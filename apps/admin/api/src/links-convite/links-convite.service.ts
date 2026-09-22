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
}

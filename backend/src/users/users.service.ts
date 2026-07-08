import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import type { AtualizarPerfilDto } from "../auth/dto/login.dto.js";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        nomeSocial: true,
        email: true,
        cpf: true,
        role: true,
        emailConfirmado: true,
        dataNascimento: true,
        matricula: true,
        comprovanteUrl: true,
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
        instituicaoId: true,
        instituicao: { select: { id: true, nome: true, sigla: true } },
        cursoId: true,
        curso: { select: { id: true, nome: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return user;
  }

  async atualizarPerfil(id: string, data: AtualizarPerfilDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    const updateData: Record<string, unknown> = {};

    const perfilFields: (keyof AtualizarPerfilDto)[] = [
      "nome", "nomeSocial", "telefone", "celular", "genero", "racaCor",
      "possuiDeficiencia", "cotista", "bolsista", "tipoBolsa",
      "documentoIdentificacao", "nacionalidade", "cep", "numero",
      "enderecoCompleto", "complemento", "bairro", "uf", "municipio",
      "pontoReferencia", "formacao", "titulacao", "areaFormacao",
      "instituicaoId", "cursoId",
    ];

    for (const field of perfilFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field] === null ? null : data[field];
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        nomeSocial: true,
        email: true,
        role: true,
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
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        instituicaoId: true,
        createdAt: true,
      },
    });
  }
}

import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";

@Injectable()
export class InstituicoesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.instituicao.findMany({
      include: {
        cursos: {
          select: { id: true, nome: true },
        },
        _count: {
          select: { cursos: true, usuarios: true },
        },
      },
      orderBy: { nome: "asc" },
    });
  }

  async findById(id: string) {
    const instituicao = await this.prisma.instituicao.findUnique({
      where: { id },
      include: {
        cursos: {
          select: { id: true, nome: true },
        },
        _count: {
          select: { cursos: true, usuarios: true },
        },
      },
    });

    if (!instituicao) {
      throw new NotFoundException("Instituição não encontrada");
    }

    return instituicao;
  }

  async create(data: {
    nome: string;
    sigla: string;
    codigoInep: string;
    uf?: string;
    cep?: string;
    municipio?: string;
    complemento?: string;
    pontoReferencia?: string;
    localizacao?: string;
    areaAssentamento?: string;
    esferaAdministrativa?: string;
    telefone?: string;
    email?: string;
    status?: string;
    tipo?: string;
  }) {
    const existing = await this.prisma.instituicao.findUnique({
      where: { codigoInep: data.codigoInep },
    });
    if (existing) {
      throw new ConflictException("Código INEP já cadastrado");
    }

    return this.prisma.instituicao.create({
      data: {
        nome: data.nome,
        sigla: data.sigla.toUpperCase(),
        codigoInep: data.codigoInep,
        uf: data.uf?.toUpperCase() ?? "",
        cep: data.cep ?? null,
        municipio: data.municipio ?? null,
        complemento: data.complemento ?? null,
        pontoReferencia: data.pontoReferencia ?? null,
        localizacao: data.localizacao as never ?? null,
        areaAssentamento: data.areaAssentamento as never ?? null,
        esferaAdministrativa: data.esferaAdministrativa as never ?? null,
        telefone: data.telefone ?? null,
        email: data.email ?? null,
        status: (data.status as never) ?? "ATIVA",
        tipo: data.tipo as never ?? null,
      },
    });
  }

  async update(
    id: string,
    data: {
      nome?: string;
      sigla?: string;
      codigoInep?: string;
      uf?: string;
      cep?: string | null;
      municipio?: string | null;
      complemento?: string | null;
      pontoReferencia?: string | null;
      localizacao?: string | null;
      areaAssentamento?: string | null;
      esferaAdministrativa?: string | null;
      telefone?: string | null;
      email?: string | null;
      status?: string;
      tipo?: string | null;
    },
  ) {
    await this.findById(id);

    if (data.codigoInep) {
      const existing = await this.prisma.instituicao.findFirst({
        where: { codigoInep: data.codigoInep, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException("Código INEP já cadastrado");
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.sigla !== undefined) updateData.sigla = data.sigla.toUpperCase();
    if (data.codigoInep !== undefined) updateData.codigoInep = data.codigoInep;
    if (data.uf !== undefined) updateData.uf = data.uf.toUpperCase();
    if (data.cep !== undefined) updateData.cep = data.cep;
    if (data.municipio !== undefined) updateData.municipio = data.municipio;
    if (data.complemento !== undefined) updateData.complemento = data.complemento;
    if (data.pontoReferencia !== undefined) updateData.pontoReferencia = data.pontoReferencia;
    if (data.localizacao !== undefined) updateData.localizacao = data.localizacao;
    if (data.areaAssentamento !== undefined) updateData.areaAssentamento = data.areaAssentamento;
    if (data.esferaAdministrativa !== undefined) updateData.esferaAdministrativa = data.esferaAdministrativa;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;

    return this.prisma.instituicao.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.instituicao.delete({ where: { id } });
    return { deleted: true };
  }
}

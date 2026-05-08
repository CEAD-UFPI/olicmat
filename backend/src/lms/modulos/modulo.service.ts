import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";

@Injectable()
export class ModuloService {
  constructor(private prisma: PrismaService) {}

  async listarTodos() {
    return this.prisma.modulo.findMany({
      orderBy: { ordem: "asc" },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        ordem: true,
        cargaHoraria: true,
      },
    });
  }

  async buscarPorId(id: string, userId: string) {
    const modulo = await this.prisma.modulo.findUnique({
      where: { id },
      include: {
        progressos: {
          where: { userId },
          select: { concluido: true, nota: true },
        },
      },
    });

    if (!modulo) {
      throw new NotFoundException("Módulo não encontrado");
    }

    return {
      ...modulo,
      progresso: modulo.progressos[0] || null,
      progressos: undefined,
    };
  }

  async concluirModulo(userId: string, moduloId: string, nota?: number) {
    return this.prisma.progressoCurso.upsert({
      where: {
        userId_moduloId: { userId, moduloId },
      },
      create: {
        userId,
        moduloId,
        concluido: true,
        nota,
      },
      update: {
        concluido: true,
        nota: nota ?? undefined,
      },
    });
  }

  async progressoGeral(userId: string) {
    const modulos = await this.prisma.modulo.count();
    const concluidos = await this.prisma.progressoCurso.count({
      where: { userId, concluido: true },
    });

    const cargaTotal = await this.prisma.modulo.aggregate({
      _sum: { cargaHoraria: true },
    });

    const cargaConcluida = await this.prisma.progressoCurso.findMany({
      where: { userId, concluido: true },
      include: { modulo: { select: { cargaHoraria: true } } },
    });

    const horasConcluidas = cargaConcluida.reduce(
      (acc, p) => acc + p.modulo.cargaHoraria,
      0
    );

    return {
      totalModulos: modulos,
      concluidos,
      percentual: modulos > 0 ? Math.round((concluidos / modulos) * 100) : 0,
      cargaHorariaTotal: cargaTotal._sum.cargaHoraria || 0,
      cargaHorariaConcluida: horasConcluidas,
    };
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";

@Injectable()
export class NotificacoesService {
  constructor(private prisma: PrismaService) {}

  async criar(userId: string, titulo: string, mensagem: string, link?: string) {
    return this.prisma.notificacao.create({
      data: { userId, titulo, mensagem, link },
    });
  }

  async listarPorUsuario(userId: string) {
    const [notificacoes, naoLidas] = await Promise.all([
      this.prisma.notificacao.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      this.prisma.notificacao.count({ where: { userId, lida: false } }),
    ]);
    return { notificacoes, naoLidas };
  }

  async marcarComoLida(id: string, userId: string) {
    await this.prisma.notificacao.updateMany({
      where: { id, userId },
      data: { lida: true },
    });
    return { lida: true };
  }
}

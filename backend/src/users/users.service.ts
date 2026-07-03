import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        emailConfirmado: true,
        instituicaoId: true,
        instituicao: { select: { id: true, nome: true, sigla: true } },
        cursoId: true,
        curso: { select: { id: true, nome: true } },
        matricula: true,
        comprovanteUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return user;
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

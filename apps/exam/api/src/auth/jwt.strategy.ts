import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { getJwtSecret } from "@olicmat/shared";
import { PrismaService } from "../prisma.service.js";

/**
 * Evita uma escrita por requisição. Fica abaixo do intervalo de 30s da consulta
 * da prova: com um valor igual, metade das consultas não renovaria a sessão.
 */
const RENOVAR_SESSAO_MS = 15_000;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: any) {
    if (payload.role === "ALUNO") {
      await this.validarSessao(payload.sub, payload.sid);
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      nome: payload.nome,
    };
  }

  /** Uma conta, um aparelho: a sessão que entrou depois derruba esta. */
  private async validarSessao(userId: string, sid: string | undefined) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { sessaoId: true, sessaoVistaEm: true },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado");
    }
    if (!user.sessaoId) return;

    if (sid !== user.sessaoId) {
      throw new UnauthorizedException("Esta conta entrou em outro aparelho.");
    }

    const vistaEm = user.sessaoVistaEm?.getTime() ?? 0;
    if (Date.now() - vistaEm > RENOVAR_SESSAO_MS) {
      // Sem await: renovar a sessão nunca deve atrasar nem derrubar a resposta.
      this.prisma.user
        .updateMany({
          where: { id: userId, sessaoId: sid },
          data: { sessaoVistaEm: new Date() },
        })
        .catch(() => {});
    }
  }
}

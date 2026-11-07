import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma.service.js";
import { getJwtSecret } from "@olicmat/shared";

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  sid?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        nome: true,
        role: true,
        sessaoId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado");
    }

    const { sessaoId, ...dados } = user;

    // Só a prova renova a sessão. O painel consulta notificações sozinho, e uma
    // aba esquecida no notebook prenderia a conta e bloquearia a entrada no celular.
    if (user.role === "ALUNO" && sessaoId && payload.sid !== sessaoId) {
      throw new UnauthorizedException("Esta conta entrou em outro aparelho.");
    }

    return { ...dados, sid: payload.sid };
  }
}

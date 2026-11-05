import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service.js";
import { getJwtSecret, TOKEN_TYPE, EXAM_SESSION_TTL } from "@olicmat/shared";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async claimTransitionToken(transitionToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(transitionToken, {
        secret: getJwtSecret(),
      });
    } catch {
      throw new UnauthorizedException("Token de transição inválido ou expirado");
    }

    if (payload.type !== TOKEN_TYPE.EXAM_TRANSITION) {
      throw new UnauthorizedException("Tipo de token inválido para o portal de prova");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, nome: true, sessaoId: true },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado");
    }

    // O link de entrada só vale para a sessão que o gerou.
    if (user.role === "ALUNO" && user.sessaoId && payload.sid !== user.sessaoId) {
      throw new UnauthorizedException("Esta conta entrou em outro aparelho. Faça login novamente.");
    }

    // Link de uso único: abrir o mesmo link em outro aparelho colocaria dois
    // aparelhos na mesma sessão, sem passar pelo login.
    if (user.role === "ALUNO" && payload.nonce) {
      const { count } = await this.prisma.user.updateMany({
        where: {
          id: user.id,
          OR: [{ sessaoEntradaId: null }, { sessaoEntradaId: { not: payload.nonce } }],
        },
        data: { sessaoEntradaId: payload.nonce },
      });
      if (count === 0) {
        throw new UnauthorizedException(
          "Este link de entrada já foi usado. Volte ao painel e acesse a prova novamente.",
        );
      }
    }

    // Verify eligibility
    if (user.role === "ALUNO") {
      const inscricao = await this.prisma.inscricao.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true },
      });

      if (!inscricao || inscricao.status !== "CONFIRMADA") {
        throw new BadRequestException("Inscrição não confirmada para a realização da prova");
      }
    }

    // Generate exam session JWT (valid for 4 hours, enough to complete exam)
    const examSessionToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        nome: user.nome,
        sid: payload.sid,
        scope: TOKEN_TYPE.EXAM_SESSION,
      },
      { expiresIn: EXAM_SESSION_TTL }
    );

    return {
      user: { id: user.id, email: user.email, role: user.role, nome: user.nome },
      accessToken: examSessionToken,
    };
  }
}

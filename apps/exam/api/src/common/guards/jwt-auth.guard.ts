import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtAuthGuard as BaseJwtAuthGuard } from "@olicmat/shared";

/**
 * Guard de autenticação do módulo de Provas.
 * Reutiliza o guard base compartilhado e personaliza a mensagem de erro
 * para o contexto de sessão de prova.
 */
@Injectable()
export class JwtAuthGuard extends BaseJwtAuthGuard {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException("Sessão da prova inválida ou expirada");
    }
    return user;
  }
}

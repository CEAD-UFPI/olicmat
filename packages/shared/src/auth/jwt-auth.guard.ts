import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard base que valida o JWT via estratégia `jwt` do Passport.
 * O payload validado é anexado a `request.user` pela estratégia.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

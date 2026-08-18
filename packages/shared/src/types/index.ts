export type { Role } from "../auth/roles.js";

/** Payload padrão dos JWTs emitidos pela plataforma. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  nome?: string;
  type?: string;
  scope?: string;
  nonce?: string;
}

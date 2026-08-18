/**
 * Constantes de autenticação JWT compartilhadas entre o backend de
 * Cadastro/Configurações e o backend do módulo de Provas.
 *
 * IMPORTANTE: ambos os backends precisam usar o MESMO `JWT_SECRET`
 * para que a autenticação unificada funcione (o token emitido por um
 * é validado pelo outro).
 */

export const JWT_SECRET_ENV = "JWT_SECRET";

/** Valor de fallback usado apenas em desenvolvimento. Troque em produção. */
export const DEFAULT_JWT_SECRET = "dev_secret_change_in_production";

/** Retorna o segredo JWT configurado via variável de ambiente. */
export const getJwtSecret = (): string =>
  process.env[JWT_SECRET_ENV] || DEFAULT_JWT_SECRET;

/** Tipos de token do fluxo de autenticação unificada. */
export const TOKEN_TYPE = {
  /** Token curto emitido pelo backend principal para entrar no módulo de Provas. */
  EXAM_TRANSITION: "EXAM_TRANSITION",
  /** Token de sessão emitido pelo módulo de Provas após validar o token de transição. */
  EXAM_SESSION: "EXAM_SESSION",
} as const;

export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

/** TTL do token de transição (suficiente para o redirect + claim). */
export const TRANSITION_TOKEN_TTL = "120s";

/** TTL da sessão de prova (tempo máximo para concluir a prova). */
export const EXAM_SESSION_TTL = "4h";

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

/** Comprimento mínimo aceito para o segredo em produção. */
export const MIN_JWT_SECRET_LENGTH = 32;

/**
 * Retorna o segredo JWT configurado via variável de ambiente.
 *
 * Em produção o segredo é obrigatório: se estiver ausente, vazio, igual ao
 * fallback de desenvolvimento ou curto demais, o processo falha no boot em vez
 * de subir com um segredo conhecido publicamente. Um container que não sobe é
 * muito melhor do que um container que aceita tokens forjados — o fallback
 * está commitado no repositório e permitiria emitir um JWT com `role: ADMIN`.
 */
export const getJwtSecret = (): string => {
  const secret = process.env[JWT_SECRET_ENV];

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret === DEFAULT_JWT_SECRET) {
      throw new Error(
        `${JWT_SECRET_ENV} ausente ou igual ao valor de desenvolvimento. ` +
          `Defina um segredo forte e IDÊNTICO no Módulo Cadastro e no Módulo Provas.`,
      );
    }

    if (secret.length < MIN_JWT_SECRET_LENGTH) {
      throw new Error(
        `${JWT_SECRET_ENV} tem ${secret.length} caracteres; ` +
          `o mínimo em produção é ${MIN_JWT_SECRET_LENGTH}. ` +
          `Gere um novo com: openssl rand -base64 48`,
      );
    }

    return secret;
  }

  return secret || DEFAULT_JWT_SECRET;
};

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

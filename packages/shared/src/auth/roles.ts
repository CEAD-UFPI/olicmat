/**
 * Fonte única de verdade para os papéis (roles) do OLICMAT.
 * Mantém-se em sincronia com o enum `Role` do schema Prisma.
 */
export const Role = {
  ALUNO: "ALUNO",
  COORDENADOR_CURSO: "COORDENADOR_CURSO",
  AVALIADOR: "AVALIADOR",
  ADMIN: "ADMIN",
  COMISSAO: "COMISSAO",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ROLES = Object.values(Role) as Role[];

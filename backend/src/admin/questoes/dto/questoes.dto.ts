import { z } from "zod";

// Use string literals for enums to avoid import issues at schema level
// The service layer will handle mapping to Prisma enums
export const criarQuestaoSchema = z.object({
  enunciado: z.string().min(10, "Enunciado deve ter no mínimo 10 caracteres"),
  alternativaA: z.string().min(1),
  alternativaB: z.string().min(1),
  alternativaC: z.string().min(1),
  alternativaD: z.string().min(1),
  alternativaE: z.string().min(1),
  correta: z
    .string()
    .length(1)
    .regex(/^[A-E]$/, "Alternativa correta deve ser A, B, C, D ou E"),
  eixo: z.enum(["ALGEBRA", "GEOMETRIA", "ANALISE", "ESTATISTICA", "DIDATICA"]),
  dificuldade: z.enum(["FACIL", "MEDIO", "DIFICIL"]),
  ordem: z.number().int().min(0).optional(),
});

export type CriarQuestaoDto = z.infer<typeof criarQuestaoSchema>;

export const vincularQuestaoSchema = z.object({
  questaoId: z.string().uuid("ID da questão inválido"),
  ordem: z.number().int().min(0).optional(),
});

export type VincularQuestaoDto = z.infer<typeof vincularQuestaoSchema>;

export const atualizarQuestaoSchema = z.object({
  enunciado: z.string().min(10).optional(),
  alternativaA: z.string().min(1).optional(),
  alternativaB: z.string().min(1).optional(),
  alternativaC: z.string().min(1).optional(),
  alternativaD: z.string().min(1).optional(),
  alternativaE: z.string().min(1).optional(),
  correta: z
    .string()
    .length(1)
    .regex(/^[A-E]$/)
    .optional(),
  eixo: z.enum(["ALGEBRA", "GEOMETRIA", "ANALISE", "ESTATISTICA", "DIDATICA"]).optional(),
  dificuldade: z.enum(["FACIL", "MEDIO", "DIFICIL"]).optional(),
});

export type AtualizarQuestaoDto = z.infer<typeof atualizarQuestaoSchema>;

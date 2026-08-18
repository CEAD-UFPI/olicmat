import { z } from "zod";

export const criarInscricaoSchema = z.object({
  estado: z.string().length(2, "UF deve ter 2 caracteres"),
  municipio: z.string().optional(),
  edicaoId: z.string().uuid("ID da edição inválido").optional(),
  instituicaoId: z.string().uuid("ID da instituição inválido").optional(),
  cursoId: z.string().uuid("ID do curso inválido").optional(),
  instituicao: z.string().min(2, "Instituição é obrigatória").optional(),
  curso: z.string().min(2, "Curso é obrigatório").optional(),
  periodo: z.number().int().min(1).max(12).optional(),
}).refine(
  (data) => data.instituicaoId || data.instituicao,
  { message: "Instituição é obrigatória", path: ["instituicao"] }
).refine(
  (data) => data.cursoId || data.curso,
  { message: "Curso é obrigatório", path: ["curso"] }
);

export type CriarInscricaoDto = z.infer<typeof criarInscricaoSchema>;

export const editarInscricaoSchema = z.object({
  estado: z.string().length(2, "UF deve ter 2 caracteres").optional(),
  municipio: z.string().optional(),
  periodo: z.number().int().min(1).max(12).optional(),
  comprovanteUrl: z.string().url().nullable().optional(),
});

export type EditarInscricaoDto = z.infer<typeof editarInscricaoSchema>;

// Deprecated — kept for backward compatibility with existing code that references the type
export const atualizarInscricaoSchema = z.object({
  status: z.enum(["PENDENTE", "CONFIRMADA", "REJEITADA"]).optional(),
  fase2Tema: z.string().optional(),
});

export type AtualizarInscricaoDto = z.infer<typeof atualizarInscricaoSchema>;

import { z } from "zod";
import { MUNICIPIOS_PI } from "../municipios-pi.js";

const MUNICIPIOS_PI_SET = new Set<string>(MUNICIPIOS_PI);

export const criarInscricaoSchema = z.object({
  estado: z.literal("PI"),
  municipio: z
    .string()
    .min(1, "Cidade é obrigatória")
    .refine((m) => MUNICIPIOS_PI_SET.has(m), {
      message: "Cidade inválida para o estado do Piauí",
    }),
  comprovanteUrl: z.string().url("URL do comprovante inválida").nullable().optional(),
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

export const atualizarStatusInscricaoSchema = z
  .object({
    status: z.enum(["PENDENTE", "CONFIRMADA", "REJEITADA"]),
    justificativa: z.string().min(10, "Justificativa deve ter ao menos 10 caracteres").optional(),
  })
  .refine((d) => d.status !== "REJEITADA" || !!d.justificativa, {
    message: "Justificativa é obrigatória ao rejeitar uma inscrição",
    path: ["justificativa"],
  });

export type AtualizarStatusInscricaoDto = z.infer<typeof atualizarStatusInscricaoSchema>;

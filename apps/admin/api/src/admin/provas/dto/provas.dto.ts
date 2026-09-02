import { z } from "zod";

export const criarProvaSchema = z.object({
  edicaoId: z.string().uuid("ID da edição inválido"),
  fase: z.number().int().min(1, "Fase deve ser 1 ou 2").max(2),
  titulo: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  duracaoMinutos: z.number().int().min(1, "Duração mínima de 1 minuto"),
  janelaInicio: z.string().datetime().optional(),
  janelaFim: z.string().datetime().optional(),
});

export type CriarProvaDto = z.infer<typeof criarProvaSchema>;

export const atualizarProvaSchema = z.object({
  titulo: z.string().min(3).optional(),
  duracaoMinutos: z.number().int().min(1).optional(),
  janelaInicio: z.string().datetime().optional(),
  janelaFim: z.string().datetime().optional(),
});

export type AtualizarProvaDto = z.infer<typeof atualizarProvaSchema>;

export const publicarProvaSchema = z.object({
  status: z.literal("PUBLICADA"),
});

export type PublicarProvaDto = z.infer<typeof publicarProvaSchema>;

export const rejeitarProvaSchema = z.object({
  observacao: z.string().min(3, "Observação deve ter no mínimo 3 caracteres").optional(),
});

export type RejeitarProvaDto = z.infer<typeof rejeitarProvaSchema>;

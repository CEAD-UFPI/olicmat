import { z } from "zod";
export const criarProvaSchema = z.object({
    edicaoId: z.string().uuid("ID da edição inválido"),
    fase: z.number().int().min(1, "Fase deve ser 1 ou 2").max(2),
    titulo: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
    duracaoMinutos: z.number().int().min(1, "Duração mínima de 1 minuto"),
    janelaInicio: z.string().datetime().optional(),
    janelaFim: z.string().datetime().optional(),
});
export const atualizarProvaSchema = z.object({
    titulo: z.string().min(3).optional(),
    duracaoMinutos: z.number().int().min(1).optional(),
    janelaInicio: z.string().datetime().optional(),
    janelaFim: z.string().datetime().optional(),
});
export const publicarProvaSchema = z.object({
    status: z.literal("PUBLICADA"),
});
//# sourceMappingURL=provas.dto.js.map
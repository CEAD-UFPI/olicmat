import { z } from "zod";
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
export const vincularQuestaoSchema = z.object({
    questaoId: z.string().uuid("ID da questão inválido"),
    ordem: z.number().int().min(0).optional(),
});
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
//# sourceMappingURL=questoes.dto.js.map
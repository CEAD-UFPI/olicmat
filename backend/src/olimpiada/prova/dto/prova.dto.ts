import { z } from "zod";

export const responderQuestaoSchema = z.object({
  questaoId: z.string().uuid("ID da questão inválido"),
  alternativa: z.string().length(1).regex(/^[A-E]$/, "Alternativa deve ser A, B, C, D ou E"),
});

export type ResponderQuestaoDto = z.infer<typeof responderQuestaoSchema>;

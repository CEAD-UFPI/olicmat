import { z } from "zod";

export const responderQuestaoSchema = z.object({
  questaoId: z.string().min(1, "ID da questão é obrigatório"),
  alternativa: z.enum(["A", "B", "C", "D", "E"], {
    message: "Alternativa deve ser A, B, C, D ou E",
  }),
});

export type ResponderQuestaoDto = z.infer<typeof responderQuestaoSchema>;

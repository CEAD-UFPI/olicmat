import { z } from "zod";
export const responderQuestaoSchema = z.object({
    questaoId: z.string().uuid("ID da questão deve ser um UUID válido"),
    alternativa: z.enum(["A", "B", "C", "D", "E"], {
        message: "Alternativa deve ser A, B, C, D ou E",
    }),
});
//# sourceMappingURL=prova.dto.js.map
import { z } from "zod";
export declare const responderQuestaoSchema: z.ZodObject<{
    questaoId: z.ZodString;
    alternativa: z.ZodEnum<{
        D: "D";
        A: "A";
        B: "B";
        C: "C";
        E: "E";
    }>;
}, z.core.$strip>;
export type ResponderQuestaoDto = z.infer<typeof responderQuestaoSchema>;

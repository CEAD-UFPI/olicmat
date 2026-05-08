import { z } from "zod";
export declare const responderQuestaoSchema: z.ZodObject<{
    questaoId: z.ZodString;
    alternativa: z.ZodString;
}, z.core.$strip>;
export type ResponderQuestaoDto = z.infer<typeof responderQuestaoSchema>;

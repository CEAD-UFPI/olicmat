import { z } from "zod";
export declare const avaliarEnvioSchema: z.ZodObject<{
    nota: z.ZodNumber;
    comentario: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AvaliarEnvioDto = z.infer<typeof avaliarEnvioSchema>;

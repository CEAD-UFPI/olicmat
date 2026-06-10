import { z } from "zod";
export declare const criarProvaSchema: z.ZodObject<{
    edicaoId: z.ZodString;
    fase: z.ZodNumber;
    titulo: z.ZodString;
    duracaoMinutos: z.ZodNumber;
    janelaInicio: z.ZodOptional<z.ZodString>;
    janelaFim: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CriarProvaDto = z.infer<typeof criarProvaSchema>;
export declare const atualizarProvaSchema: z.ZodObject<{
    titulo: z.ZodOptional<z.ZodString>;
    duracaoMinutos: z.ZodOptional<z.ZodNumber>;
    janelaInicio: z.ZodOptional<z.ZodString>;
    janelaFim: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AtualizarProvaDto = z.infer<typeof atualizarProvaSchema>;
export declare const publicarProvaSchema: z.ZodObject<{
    status: z.ZodLiteral<"PUBLICADA">;
}, z.core.$strip>;
export type PublicarProvaDto = z.infer<typeof publicarProvaSchema>;

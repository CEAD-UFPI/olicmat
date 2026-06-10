import { z } from "zod";
export declare const exportInscricoesQuerySchema: z.ZodObject<{
    edicaoId: z.ZodOptional<z.ZodString>;
    estado: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDENTE: "PENDENTE";
        CONFIRMADA: "CONFIRMADA";
        REJEITADA: "REJEITADA";
    }>>;
}, z.core.$strip>;
export type ExportInscricoesQuery = z.infer<typeof exportInscricoesQuerySchema>;

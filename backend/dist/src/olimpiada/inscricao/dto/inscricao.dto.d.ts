import { z } from "zod";
export declare const criarInscricaoSchema: z.ZodObject<{
    estado: z.ZodString;
    municipio: z.ZodOptional<z.ZodString>;
    instituicao: z.ZodString;
    curso: z.ZodString;
    periodo: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CriarInscricaoDto = z.infer<typeof criarInscricaoSchema>;
export declare const atualizarInscricaoSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        PENDENTE: "PENDENTE";
        CONFIRMADA: "CONFIRMADA";
        REJEITADA: "REJEITADA";
    }>>;
    fase2Tema: z.ZodOptional<z.ZodString>;
    fase2VideoUrl: z.ZodOptional<z.ZodString>;
    fase2PortfolioUrl: z.ZodOptional<z.ZodString>;
    fase2Nota: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type AtualizarInscricaoDto = z.infer<typeof atualizarInscricaoSchema>;

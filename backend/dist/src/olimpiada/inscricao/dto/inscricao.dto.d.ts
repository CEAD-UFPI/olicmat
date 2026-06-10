import { z } from "zod";
export declare const criarInscricaoSchema: z.ZodObject<{
    estado: z.ZodString;
    municipio: z.ZodOptional<z.ZodString>;
    instituicaoId: z.ZodString;
    cursoId: z.ZodString;
    periodo: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CriarInscricaoDto = z.infer<typeof criarInscricaoSchema>;
export declare const editarInscricaoSchema: z.ZodObject<{
    estado: z.ZodOptional<z.ZodString>;
    municipio: z.ZodOptional<z.ZodString>;
    periodo: z.ZodOptional<z.ZodNumber>;
    comprovanteUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type EditarInscricaoDto = z.infer<typeof editarInscricaoSchema>;
export declare const atualizarInscricaoSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        PENDENTE: "PENDENTE";
        CONFIRMADA: "CONFIRMADA";
        REJEITADA: "REJEITADA";
    }>>;
    fase2Tema: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AtualizarInscricaoDto = z.infer<typeof atualizarInscricaoSchema>;

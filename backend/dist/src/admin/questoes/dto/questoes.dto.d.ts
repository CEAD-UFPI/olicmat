import { z } from "zod";
export declare const criarQuestaoSchema: z.ZodObject<{
    enunciado: z.ZodString;
    alternativaA: z.ZodString;
    alternativaB: z.ZodString;
    alternativaC: z.ZodString;
    alternativaD: z.ZodString;
    alternativaE: z.ZodString;
    correta: z.ZodString;
    eixo: z.ZodEnum<{
        ALGEBRA: "ALGEBRA";
        GEOMETRIA: "GEOMETRIA";
        ANALISE: "ANALISE";
        ESTATISTICA: "ESTATISTICA";
        DIDATICA: "DIDATICA";
    }>;
    dificuldade: z.ZodEnum<{
        FACIL: "FACIL";
        MEDIO: "MEDIO";
        DIFICIL: "DIFICIL";
    }>;
    ordem: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CriarQuestaoDto = z.infer<typeof criarQuestaoSchema>;
export declare const vincularQuestaoSchema: z.ZodObject<{
    questaoId: z.ZodString;
    ordem: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type VincularQuestaoDto = z.infer<typeof vincularQuestaoSchema>;
export declare const atualizarQuestaoSchema: z.ZodObject<{
    enunciado: z.ZodOptional<z.ZodString>;
    alternativaA: z.ZodOptional<z.ZodString>;
    alternativaB: z.ZodOptional<z.ZodString>;
    alternativaC: z.ZodOptional<z.ZodString>;
    alternativaD: z.ZodOptional<z.ZodString>;
    alternativaE: z.ZodOptional<z.ZodString>;
    correta: z.ZodOptional<z.ZodString>;
    eixo: z.ZodOptional<z.ZodEnum<{
        ALGEBRA: "ALGEBRA";
        GEOMETRIA: "GEOMETRIA";
        ANALISE: "ANALISE";
        ESTATISTICA: "ESTATISTICA";
        DIDATICA: "DIDATICA";
    }>>;
    dificuldade: z.ZodOptional<z.ZodEnum<{
        FACIL: "FACIL";
        MEDIO: "MEDIO";
        DIFICIL: "DIFICIL";
    }>>;
}, z.core.$strip>;
export type AtualizarQuestaoDto = z.infer<typeof atualizarQuestaoSchema>;

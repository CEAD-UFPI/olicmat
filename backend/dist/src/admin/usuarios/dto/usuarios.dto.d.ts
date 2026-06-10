import { z } from "zod";
export declare const criarUsuarioSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    cpf: z.ZodString;
    senha: z.ZodString;
    role: z.ZodEnum<{
        ALUNO: "ALUNO";
        COORDENADOR_CURSO: "COORDENADOR_CURSO";
        AVALIADOR: "AVALIADOR";
        ADMIN: "ADMIN";
    }>;
    matricula: z.ZodOptional<z.ZodString>;
    dataNascimento: z.ZodString;
    instituicaoId: z.ZodOptional<z.ZodString>;
    cursoId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CriarUsuarioDto = z.infer<typeof criarUsuarioSchema>;
export declare const atualizarUsuarioSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        ALUNO: "ALUNO";
        COORDENADOR_CURSO: "COORDENADOR_CURSO";
        AVALIADOR: "AVALIADOR";
        ADMIN: "ADMIN";
    }>>;
    matricula: z.ZodOptional<z.ZodString>;
    instituicaoId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cursoId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    comprovanteUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type AtualizarUsuarioDto = z.infer<typeof atualizarUsuarioSchema>;

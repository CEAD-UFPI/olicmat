import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
}, z.core.$strip>;
export type LoginDto = z.infer<typeof loginSchema>;
export declare const registerSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    cpf: z.ZodString;
    senha: z.ZodString;
    instituicao: z.ZodString;
    curso: z.ZodString;
    matricula: z.ZodString;
    dataNascimento: z.ZodString;
}, z.core.$strip>;
export type RegisterDto = z.infer<typeof registerSchema>;

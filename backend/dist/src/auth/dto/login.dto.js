import { z } from "zod";
export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});
export const registerSchema = z.object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    instituicao: z.string().min(2, "Instituição é obrigatória"),
    curso: z.string().min(2, "Curso é obrigatório"),
    matricula: z.string().min(3, "Matrícula é obrigatória"),
    dataNascimento: z.string().refine((val) => !isNaN(Date.parse(val)), "Data de nascimento inválida"),
});
//# sourceMappingURL=login.dto.js.map
import { z } from "zod";

export const criarUsuarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  role: z.enum(["ALUNO", "COORDENADOR_CURSO", "AVALIADOR", "ADMIN"]),
  matricula: z.string().optional(),
  dataNascimento: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    "Data de nascimento inválida"
  ),
  instituicaoId: z.string().uuid().optional(),
  cursoId: z.string().uuid().optional(),
});

export type CriarUsuarioDto = z.infer<typeof criarUsuarioSchema>;

export const atualizarUsuarioSchema = z.object({
  nome: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ALUNO", "COORDENADOR_CURSO", "AVALIADOR", "ADMIN"]).optional(),
  matricula: z.string().optional(),
  instituicaoId: z.string().uuid().nullable().optional(),
  cursoId: z.string().uuid().nullable().optional(),
  comprovanteUrl: z.string().url().nullable().optional(),
});

export type AtualizarUsuarioDto = z.infer<typeof atualizarUsuarioSchema>;

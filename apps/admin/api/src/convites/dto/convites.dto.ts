import { z } from "zod";
import { validarCPF } from "../../admin/usuarios/dto/usuarios.dto.js";

/**
 * Papéis que podem ser convidados. ALUNO fica de fora de propósito: o
 * estudante entra pelo cadastro público, indicado pela coordenação do curso.
 */
const rolesConvidaveis = z.enum([
  "COMISSAO",
  "COORDENADOR_CURSO",
  "AVALIADOR",
  "ADMIN",
]);

export const criarConvitesSchema = z.object({
  convites: z
    .array(
      z.object({
        nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
        email: z
          .string()
          .email("Email inválido")
          .transform((v) => v.toLowerCase().trim()),
        role: rolesConvidaveis,
      }),
    )
    .min(1, "Envie ao menos um convite")
    .max(500, "Envie no máximo 500 convites por vez"),
});

export const aceitarConviteSchema = z.object({
  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 11, "CPF deve ter 11 dígitos")
    .refine((val) => validarCPF(val), "CPF inválido"),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  dataNascimento: z
    .string()
    .refine(
      (v) => !Number.isNaN(new Date(v).getTime()),
      "Data de nascimento inválida",
    ),
  nomeMae: z.string().min(2).nullable().optional(),
  matricula: z.string().nullable().optional(),
  telefone: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? v.replace(/\D/g, "") : v))
    .refine(
      (v) => !v || (v.length >= 10 && v.length <= 11),
      "Telefone deve ter 10 ou 11 dígitos",
    ),
});

export type CriarConvitesDto = z.infer<typeof criarConvitesSchema>;
export type AceitarConviteDto = z.infer<typeof aceitarConviteSchema>;

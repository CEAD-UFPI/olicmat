import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const generoEnum = z.enum(["MASCULINO", "FEMININO", "OUTRO", "PREFIRO_NAO_INFORMAR"]);
export const racaCorEnum = z.enum(["BRANCA", "PRETA", "PARDA", "AMARELA", "INDIGENA", "OUTRO", "PREFIRO_NAO_INFORMAR"]);
export const tipoBolsaEnum = z.enum(["PIBIC", "PIBITI", "PIBEX", "PRAEC", "PET", "PROUNI", "FIES", "OUTRO"]);
export const titulacaoEnum = z.enum(["GRADUADO", "ESPECIALIZACAO", "MESTRE", "DOUTOR", "POS_DOUTOR"]);

export const registerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  nomeSocial: z.string().optional(),
  email: z.string().email("Email inválido"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  instituicao: z.string().min(2, "Instituição é obrigatória"),
  instituicaoId: z.string().uuid().optional(),
  curso: z.string().min(2, "Curso é obrigatório"),
  matricula: z.string().min(3, "Matrícula é obrigatória"),
  dataNascimento: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    "Data de nascimento inválida"
  ),
  telefone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
  genero: generoEnum,
  racaCor: racaCorEnum,
  possuiDeficiencia: z.boolean().optional(),
  cotista: z.boolean().optional(),
  bolsista: z.boolean().optional(),
  tipoBolsa: tipoBolsaEnum.optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const atualizarPerfilSchema = z.object({
  nome: z.string().min(3).optional(),
  nomeSocial: z.string().nullable().optional(),
  nomeMae: z.string().min(2, "Nome da mãe é obrigatório").optional(),
  telefone: z.string().min(10).optional(),
  celular: z.string().min(10).optional(),
  genero: generoEnum.nullable().optional(),
  racaCor: racaCorEnum.nullable().optional(),
  possuiDeficiencia: z.boolean().nullable().optional(),
  cotista: z.boolean().nullable().optional(),
  bolsista: z.boolean().nullable().optional(),
  tipoBolsa: tipoBolsaEnum.nullable().optional(),
  documentoIdentificacao: z.string().nullable().optional(),
  nacionalidade: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  numero: z.string().nullable().optional(),
  enderecoCompleto: z.string().nullable().optional(),
  complemento: z.string().nullable().optional(),
  bairro: z.string().nullable().optional(),
  uf: z.string().length(2).nullable().optional(),
  municipio: z.string().nullable().optional(),
  pontoReferencia: z.string().nullable().optional(),
  formacao: z.string().nullable().optional(),
  titulacao: titulacaoEnum.nullable().optional(),
  areaFormacao: z.string().nullable().optional(),
  instituicaoId: z.string().uuid().nullable().optional(),
  cursoId: z.string().uuid().nullable().optional(),
});

export type AtualizarPerfilDto = z.infer<typeof atualizarPerfilSchema>;

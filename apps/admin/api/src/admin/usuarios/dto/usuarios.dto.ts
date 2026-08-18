import { z } from "zod";

function validarCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i)) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i)) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10))) return false;

  return true;
}

const phoneSchema = z
  .string()
  .nullable()
  .optional()
  .transform((val) => (val ? val.replace(/\D/g, "") : val))
  .refine((val) => !val || (val.length >= 10 && val.length <= 11), "Telefone deve ter 10 ou 11 dígitos");

const cepSchema = z
  .string()
  .nullable()
  .optional()
  .transform((val) => (val ? val.replace(/\D/g, "") : val))
  .refine((val) => !val || val.length === 8, "CEP deve ter exatamente 8 dígitos");

const roleEnum = z.enum(["ALUNO", "COORDENADOR_CURSO", "AVALIADOR", "ADMIN", "COMISSAO"]);
const generoEnum = z.enum(["MASCULINO", "FEMININO", "OUTRO", "PREFIRO_NAO_INFORMAR"]);
const racaCorEnum = z.enum(["BRANCA", "PRETA", "PARDA", "AMARELA", "INDIGENA", "OUTRO", "PREFIRO_NAO_INFORMAR"]);
const tipoBolsaEnum = z.enum(["PIBIC", "PIBITI", "PIBEX", "PRAEC", "PET", "PROUNI", "FIES", "OUTRO"]);
const titulacaoEnum = z.enum(["GRADUADO", "ESPECIALIZACAO", "MESTRE", "DOUTOR", "POS_DOUTOR"]);

export const criarUsuarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  nomeSocial: z.string().nullable().optional(),
  nomeMae: z.string().min(2, "Nome da mãe é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 11, "CPF deve ter 11 dígitos")
    .refine((val) => validarCPF(val), "CPF inválido"),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").nullable().optional(),
  role: roleEnum,
  matricula: z.string().nullable().optional(),
  dataNascimento: z.string().refine(
    (val) => val.length > 0 && !isNaN(Date.parse(val)),
    "Data de nascimento inválida"
  ),
  instituicaoId: z.string().uuid().nullable().optional(),
  cursoId: z.string().uuid().nullable().optional(),
  telefone: phoneSchema,
  celular: phoneSchema,
  genero: generoEnum.nullable().optional(),
  racaCor: racaCorEnum.nullable().optional(),
  possuiDeficiencia: z.boolean().nullable().optional(),
  cotista: z.boolean().nullable().optional(),
  bolsista: z.boolean().nullable().optional(),
  tipoBolsa: tipoBolsaEnum.nullable().optional(),
  documentoIdentificacao: z.string().nullable().optional(),
  nacionalidade: z.string().nullable().optional(),
  cep: cepSchema,
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
});

export type CriarUsuarioDto = z.infer<typeof criarUsuarioSchema>;

export const atualizarUsuarioSchema = z.object({
  nome: z.string().min(2).optional(),
  nomeSocial: z.string().nullable().optional(),
  nomeMae: z.string().min(2, "Nome da mãe é obrigatório").optional(),
  email: z.string().email().optional(),
  role: roleEnum.optional(),
  matricula: z.string().nullable().optional(),
  instituicaoId: z.string().uuid().nullable().optional(),
  cursoId: z.string().uuid().nullable().optional(),
  comprovanteUrl: z.string().url().nullable().optional(),
  telefone: phoneSchema,
  celular: phoneSchema,
  genero: generoEnum.nullable().optional(),
  racaCor: racaCorEnum.nullable().optional(),
  possuiDeficiencia: z.boolean().nullable().optional(),
  cotista: z.boolean().nullable().optional(),
  bolsista: z.boolean().nullable().optional(),
  tipoBolsa: tipoBolsaEnum.nullable().optional(),
  documentoIdentificacao: z.string().nullable().optional(),
  nacionalidade: z.string().nullable().optional(),
  cep: cepSchema,
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
});

export type AtualizarUsuarioDto = z.infer<typeof atualizarUsuarioSchema>;

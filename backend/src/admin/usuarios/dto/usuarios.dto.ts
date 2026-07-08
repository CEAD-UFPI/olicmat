import { z } from "zod";

const roleEnum = z.enum(["ALUNO", "COORDENADOR_CURSO", "AVALIADOR", "ADMIN", "COMISSAO"]);
const generoEnum = z.enum(["MASCULINO", "FEMININO", "OUTRO", "PREFIRO_NAO_INFORMAR"]);
const racaCorEnum = z.enum(["BRANCA", "PRETA", "PARDA", "AMARELA", "INDIGENA", "OUTRO", "PREFIRO_NAO_INFORMAR"]);
const tipoBolsaEnum = z.enum(["PIBIC", "PIBITI", "PIBEX", "PRAEC", "PET", "PROUNI", "FIES", "OUTRO"]);
const titulacaoEnum = z.enum(["GRADUADO", "ESPECIALIZACAO", "MESTRE", "DOUTOR", "POS_DOUTOR"]);

export const criarUsuarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  nomeSocial: z.string().optional(),
  email: z.string().email("Email inválido"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  role: roleEnum,
  matricula: z.string().optional(),
  dataNascimento: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    "Data de nascimento inválida"
  ),
  instituicaoId: z.string().uuid().nullable().optional(),
  cursoId: z.string().uuid().nullable().optional(),
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
});

export type CriarUsuarioDto = z.infer<typeof criarUsuarioSchema>;

export const atualizarUsuarioSchema = z.object({
  nome: z.string().min(2).optional(),
  nomeSocial: z.string().nullable().optional(),
  email: z.string().email().optional(),
  role: roleEnum.optional(),
  matricula: z.string().optional(),
  instituicaoId: z.string().uuid().nullable().optional(),
  cursoId: z.string().uuid().nullable().optional(),
  comprovanteUrl: z.string().url().nullable().optional(),
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
});

export type AtualizarUsuarioDto = z.infer<typeof atualizarUsuarioSchema>;

export type Role = "ALUNO" | "COORDENADOR_CURSO" | "AVALIADOR" | "ADMIN" | "COMISSAO";

export type StatusInscricao = "PENDENTE" | "CONFIRMADA" | "REJEITADA";

export type Medalha = "OURO" | "PRATA" | "BRONZE";

export type Genero = "MASCULINO" | "FEMININO" | "OUTRO" | "PREFIRO_NAO_INFORMAR";

export type RacaCor = "BRANCA" | "PRETA" | "PARDA" | "AMARELA" | "INDIGENA" | "OUTRO" | "PREFIRO_NAO_INFORMAR";

export type TipoBolsa = "PIBIC" | "PIBITI" | "PIBEX" | "PRAEC" | "PET" | "PROUNI" | "FIES" | "OUTRO";

export type Titulacao = "GRADUADO" | "ESPECIALIZACAO" | "MESTRE" | "DOUTOR" | "POS_DOUTOR";

export type Localizacao = "URBANA" | "RURAL";

export type AreaAssentamento = "NAO_DIFERENCIADA" | "AREA_ASSENTAMENTO" | "TERRA_INDIGENA" | "AREA_REMANESCENTE_QUILOMBO" | "UNIDADE_USO_SUSTENTAVEL";

export type EsferaAdministrativa = "FEDERAL" | "ESTADUAL" | "MUNICIPAL" | "INSTITUTO_FEDERAL" | "PRIVADA";

export type StatusInstituicao = "ATIVA" | "INATIVA";

export type TipoInstituicao = "PERMANENTE" | "TEMPORARIA";

export interface User {
  id: string;
  nome: string;
  nomeSocial?: string | null;
  email: string;
  cpf?: string;
  role: Role;
  emailConfirmado?: boolean;
  instituicaoId?: string;
  cursoId?: string;
  matricula?: string;
  comprovanteUrl?: string;
  dataNascimento?: string;
  telefone?: string | null;
  celular?: string | null;
  genero?: Genero | null;
  racaCor?: RacaCor | null;
  possuiDeficiencia?: boolean | null;
  cotista?: boolean | null;
  bolsista?: boolean | null;
  tipoBolsa?: TipoBolsa | null;
  documentoIdentificacao?: string | null;
  nacionalidade?: string | null;
  cep?: string | null;
  numero?: string | null;
  enderecoCompleto?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  uf?: string | null;
  municipio?: string | null;
  pontoReferencia?: string | null;
  formacao?: string | null;
  titulacao?: Titulacao | null;
  areaFormacao?: string | null;
  createdAt: string;
}

export interface Inscricao {
  id: string;
  userId: string;
  edicaoId: string;
  status: StatusInscricao;
  estado: string;
  municipio?: string;
  instituicaoId: string;
  cursoId: string;
  periodo?: number;
  comprovanteUrl?: string;
  fase1Nota?: number;
  fase1Inicio?: string;
  fase1Fim?: string;
  fase2Tema?: string;
  fase2Nota?: number;
  notaFinal?: number;
  medalha?: Medalha;
  createdAt: string;
}

export interface Questao {
  id: string;
  enunciado: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaE: string;
  eixo: string;
  dificuldade: string;
}

export interface Edicao {
  id: string;
  ano: number;
  titulo: string;
  status: string;
  dataInicio?: string;
  dataFim?: string;
  pesoFase1: number;
  pesoFase2: number;
  createdAt: string;
}

export interface Prova {
  id: string;
  edicaoId: string;
  fase: number;
  titulo: string;
  duracaoMinutos: number;
  status: string;
  questoes?: Questao[];
}

export interface Instituicao {
  id: string;
  nome: string;
  sigla: string;
  codigoInep: string;
  uf: string;
  cep?: string | null;
  municipio?: string | null;
  complemento?: string | null;
  pontoReferencia?: string | null;
  localizacao?: Localizacao | null;
  areaAssentamento?: AreaAssentamento | null;
  esferaAdministrativa?: EsferaAdministrativa | null;
  telefone?: string | null;
  email?: string | null;
  status?: StatusInstituicao | null;
  tipo?: TipoInstituicao | null;
  cursos?: { id: string; nome: string }[];
  _count?: { cursos: number; usuarios: number };
  createdAt: string;
}

export interface Curso {
  id: string;
  nome: string;
  instituicaoId: string;
  notaEnade?: number | null;
  instituicao?: { id: string; nome: string; sigla: string };
  _count?: { usuarios: number; inscricoes: number };
  createdAt: string;
}

export interface Resposta {
  id: string;
  inscricaoId: string;
  provaId: string;
  questaoId: string;
  alternativaMarcada: string;
  correta: boolean;
}

export interface EnvioFase2 {
  id: string;
  inscricaoId: string;
  tipo: string;
  arquivoUrl: string;
  videoLink?: string;
  status: "PENDENTE" | "ENVIADO" | "AVALIADO";
  enviadoEm: string;
}

export interface AvaliacaoFase2 {
  id: string;
  inscricaoId: string;
  avaliadorId: string;
  nota: number;
  parecer?: string;
  avaliadoEm: string;
}

export interface ProvaQuestao {
  id: string;
  provaId: string;
  questaoId: string;
  ordem: number;
}

export interface RankingEntry {
  inscricaoId: string;
  nome: string;
  estado: string;
  fase1Nota: number;
  fase2Nota: number;
  notaFinal: number;
  medalha: Medalha | null;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  acao: string;
  entidade: string;
  entidadeId: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

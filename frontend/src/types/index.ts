export type Role = "ALUNO" | "COORDENADOR_CURSO" | "AVALIADOR" | "ADMIN" | "COMISSAO";

export type StatusInscricao = "PENDENTE" | "CONFIRMADA" | "REJEITADA";

export type Medalha = "OURO" | "PRATA" | "BRONZE";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
  emailConfirmado?: boolean;
  instituicaoId?: string;
  cursoId?: string;
  matricula?: string;
  comprovanteUrl?: string;
  dataNascimento?: string;
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
  codigoInep?: string;
  estado: string;
}

export interface Curso {
  id: string;
  nome: string;
  instituicaoId: string;
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

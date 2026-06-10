export type Role = "ALUNO" | "COORDENADOR_CURSO" | "AVALIADOR" | "ADMIN";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
  instituicao?: string;
  curso?: string;
  matricula?: string;
  comprovanteUrl?: string;
  createdAt: string;
}

export interface Inscricao {
  id: string;
  status: "PENDENTE" | "CONFIRMADA" | "REJEITADA";
  estado: string;
  municipio?: string;
  instituicao?: string;
  curso?: string;
  periodo?: number;
  fase1Nota?: number;
  fase1Inicio?: string;
  fase1Fim?: string;
  fase2Tema?: string;
  fase2Nota?: number;
  notaFinal?: number;
  medalha?: "OURO" | "PRATA" | "BRONZE";
  createdAt?: string;
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
  inscricaoInicio: string;
  inscricaoFim: string;
  fase1Data: string;
  fase2Inicio: string;
  fase2Fim: string;
  ativa: boolean;
}

export interface Prova {
  id: string;
  edicaoId: string;
  questoes: Questao[];
  duracaoMinutos: number;
}

export interface Instituicao {
  id: string;
  nome: string;
  sigla: string;
  estado: string;
  tipo: "PUBLICA" | "PRIVADA";
}

export interface Curso {
  id: string;
  nome: string;
  instituicaoId: string;
  tipo: "LICENCIATURA" | "BACHARELADO";
}

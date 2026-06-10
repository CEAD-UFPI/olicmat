import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Instituicao: "Instituicao";
    readonly Curso: "Curso";
    readonly User: "User";
    readonly CoordenadorCurso: "CoordenadorCurso";
    readonly Edicao: "Edicao";
    readonly Inscricao: "Inscricao";
    readonly Prova: "Prova";
    readonly Questao: "Questao";
    readonly ProvaQuestao: "ProvaQuestao";
    readonly Resposta: "Resposta";
    readonly EnvioFase2: "EnvioFase2";
    readonly AvaliacaoFase2: "AvaliacaoFase2";
    readonly RankingSnapshot: "RankingSnapshot";
    readonly AuditLog: "AuditLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const InstituicaoScalarFieldEnum: {
    readonly id: "id";
    readonly nome: "nome";
    readonly sigla: "sigla";
    readonly estado: "estado";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InstituicaoScalarFieldEnum = (typeof InstituicaoScalarFieldEnum)[keyof typeof InstituicaoScalarFieldEnum];
export declare const CursoScalarFieldEnum: {
    readonly id: "id";
    readonly nome: "nome";
    readonly instituicaoId: "instituicaoId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CursoScalarFieldEnum = (typeof CursoScalarFieldEnum)[keyof typeof CursoScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly nome: "nome";
    readonly email: "email";
    readonly cpf: "cpf";
    readonly senhaHash: "senhaHash";
    readonly role: "role";
    readonly instituicaoId: "instituicaoId";
    readonly cursoId: "cursoId";
    readonly matricula: "matricula";
    readonly comprovanteUrl: "comprovanteUrl";
    readonly dataNascimento: "dataNascimento";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CoordenadorCursoScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly cursoId: "cursoId";
};
export type CoordenadorCursoScalarFieldEnum = (typeof CoordenadorCursoScalarFieldEnum)[keyof typeof CoordenadorCursoScalarFieldEnum];
export declare const EdicaoScalarFieldEnum: {
    readonly id: "id";
    readonly ano: "ano";
    readonly titulo: "titulo";
    readonly status: "status";
    readonly dataInicio: "dataInicio";
    readonly dataFim: "dataFim";
    readonly pesoFase1: "pesoFase1";
    readonly pesoFase2: "pesoFase2";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EdicaoScalarFieldEnum = (typeof EdicaoScalarFieldEnum)[keyof typeof EdicaoScalarFieldEnum];
export declare const InscricaoScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly edicaoId: "edicaoId";
    readonly status: "status";
    readonly estado: "estado";
    readonly municipio: "municipio";
    readonly instituicaoId: "instituicaoId";
    readonly cursoId: "cursoId";
    readonly periodo: "periodo";
    readonly comprovanteUrl: "comprovanteUrl";
    readonly fase1Nota: "fase1Nota";
    readonly fase1Inicio: "fase1Inicio";
    readonly fase1Fim: "fase1Fim";
    readonly fase2Tema: "fase2Tema";
    readonly notaFinal: "notaFinal";
    readonly medalha: "medalha";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InscricaoScalarFieldEnum = (typeof InscricaoScalarFieldEnum)[keyof typeof InscricaoScalarFieldEnum];
export declare const ProvaScalarFieldEnum: {
    readonly id: "id";
    readonly edicaoId: "edicaoId";
    readonly fase: "fase";
    readonly titulo: "titulo";
    readonly duracaoMinutos: "duracaoMinutos";
    readonly status: "status";
    readonly publicadaEm: "publicadaEm";
    readonly janelaInicio: "janelaInicio";
    readonly janelaFim: "janelaFim";
    readonly versao: "versao";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProvaScalarFieldEnum = (typeof ProvaScalarFieldEnum)[keyof typeof ProvaScalarFieldEnum];
export declare const QuestaoScalarFieldEnum: {
    readonly id: "id";
    readonly enunciado: "enunciado";
    readonly alternativaA: "alternativaA";
    readonly alternativaB: "alternativaB";
    readonly alternativaC: "alternativaC";
    readonly alternativaD: "alternativaD";
    readonly alternativaE: "alternativaE";
    readonly correta: "correta";
    readonly eixo: "eixo";
    readonly dificuldade: "dificuldade";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type QuestaoScalarFieldEnum = (typeof QuestaoScalarFieldEnum)[keyof typeof QuestaoScalarFieldEnum];
export declare const ProvaQuestaoScalarFieldEnum: {
    readonly id: "id";
    readonly provaId: "provaId";
    readonly questaoId: "questaoId";
    readonly ordem: "ordem";
};
export type ProvaQuestaoScalarFieldEnum = (typeof ProvaQuestaoScalarFieldEnum)[keyof typeof ProvaQuestaoScalarFieldEnum];
export declare const RespostaScalarFieldEnum: {
    readonly id: "id";
    readonly inscricaoId: "inscricaoId";
    readonly provaId: "provaId";
    readonly questaoId: "questaoId";
    readonly alternativaMarcada: "alternativaMarcada";
    readonly correta: "correta";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RespostaScalarFieldEnum = (typeof RespostaScalarFieldEnum)[keyof typeof RespostaScalarFieldEnum];
export declare const EnvioFase2ScalarFieldEnum: {
    readonly id: "id";
    readonly inscricaoId: "inscricaoId";
    readonly tipo: "tipo";
    readonly arquivoUrl: "arquivoUrl";
    readonly status: "status";
    readonly enviadoEm: "enviadoEm";
};
export type EnvioFase2ScalarFieldEnum = (typeof EnvioFase2ScalarFieldEnum)[keyof typeof EnvioFase2ScalarFieldEnum];
export declare const AvaliacaoFase2ScalarFieldEnum: {
    readonly id: "id";
    readonly inscricaoId: "inscricaoId";
    readonly avaliadorId: "avaliadorId";
    readonly nota: "nota";
    readonly parecer: "parecer";
    readonly avaliadoEm: "avaliadoEm";
};
export type AvaliacaoFase2ScalarFieldEnum = (typeof AvaliacaoFase2ScalarFieldEnum)[keyof typeof AvaliacaoFase2ScalarFieldEnum];
export declare const RankingSnapshotScalarFieldEnum: {
    readonly id: "id";
    readonly edicaoId: "edicaoId";
    readonly estado: "estado";
    readonly dados: "dados";
    readonly publicadoEm: "publicadoEm";
    readonly createdAt: "createdAt";
};
export type RankingSnapshotScalarFieldEnum = (typeof RankingSnapshotScalarFieldEnum)[keyof typeof RankingSnapshotScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly actorId: "actorId";
    readonly acao: "acao";
    readonly entidade: "entidade";
    readonly entidadeId: "entidadeId";
    readonly payload: "payload";
    readonly createdAt: "createdAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

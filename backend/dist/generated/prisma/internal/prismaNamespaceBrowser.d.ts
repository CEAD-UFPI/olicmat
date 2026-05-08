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
    readonly User: "User";
    readonly Inscricao: "Inscricao";
    readonly Questao: "Questao";
    readonly Resposta: "Resposta";
    readonly Modulo: "Modulo";
    readonly ProgressoCurso: "ProgressoCurso";
    readonly Certificado: "Certificado";
    readonly Submissao: "Submissao";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly nome: "nome";
    readonly email: "email";
    readonly cpf: "cpf";
    readonly senha: "senha";
    readonly role: "role";
    readonly instituicao: "instituicao";
    readonly curso: "curso";
    readonly matricula: "matricula";
    readonly comprovanteUrl: "comprovanteUrl";
    readonly dataNascimento: "dataNascimento";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const InscricaoScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly status: "status";
    readonly estado: "estado";
    readonly municipio: "municipio";
    readonly instituicao: "instituicao";
    readonly curso: "curso";
    readonly periodo: "periodo";
    readonly comprovanteUrl: "comprovanteUrl";
    readonly fase1Nota: "fase1Nota";
    readonly fase1Inicio: "fase1Inicio";
    readonly fase1Fim: "fase1Fim";
    readonly fase2Tema: "fase2Tema";
    readonly fase2VideoUrl: "fase2VideoUrl";
    readonly fase2PortfolioUrl: "fase2PortfolioUrl";
    readonly fase2Nota: "fase2Nota";
    readonly notaFinal: "notaFinal";
    readonly medalha: "medalha";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InscricaoScalarFieldEnum = (typeof InscricaoScalarFieldEnum)[keyof typeof InscricaoScalarFieldEnum];
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
    readonly createdAt: "createdAt";
};
export type QuestaoScalarFieldEnum = (typeof QuestaoScalarFieldEnum)[keyof typeof QuestaoScalarFieldEnum];
export declare const RespostaScalarFieldEnum: {
    readonly id: "id";
    readonly inscricaoId: "inscricaoId";
    readonly questaoId: "questaoId";
    readonly alternativa: "alternativa";
    readonly correta: "correta";
    readonly respondedAt: "respondedAt";
};
export type RespostaScalarFieldEnum = (typeof RespostaScalarFieldEnum)[keyof typeof RespostaScalarFieldEnum];
export declare const ModuloScalarFieldEnum: {
    readonly id: "id";
    readonly titulo: "titulo";
    readonly descricao: "descricao";
    readonly ordem: "ordem";
    readonly cargaHoraria: "cargaHoraria";
    readonly conteudos: "conteudos";
    readonly questionario: "questionario";
};
export type ModuloScalarFieldEnum = (typeof ModuloScalarFieldEnum)[keyof typeof ModuloScalarFieldEnum];
export declare const ProgressoCursoScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly moduloId: "moduloId";
    readonly concluido: "concluido";
    readonly nota: "nota";
};
export type ProgressoCursoScalarFieldEnum = (typeof ProgressoCursoScalarFieldEnum)[keyof typeof ProgressoCursoScalarFieldEnum];
export declare const CertificadoScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly cargaHoraria: "cargaHoraria";
    readonly emitidoEm: "emitidoEm";
    readonly codigo: "codigo";
};
export type CertificadoScalarFieldEnum = (typeof CertificadoScalarFieldEnum)[keyof typeof CertificadoScalarFieldEnum];
export declare const SubmissaoScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly tipo: "tipo";
    readonly titulo: "titulo";
    readonly resumo: "resumo";
    readonly arquivoUrl: "arquivoUrl";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SubmissaoScalarFieldEnum = (typeof SubmissaoScalarFieldEnum)[keyof typeof SubmissaoScalarFieldEnum];
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

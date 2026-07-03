import * as runtime from "@prisma/client/runtime/client";
export const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export const PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export const PrismaClientValidationError = runtime.PrismaClientValidationError;
export const sql = runtime.sqltag;
export const empty = runtime.empty;
export const join = runtime.join;
export const raw = runtime.raw;
export const Sql = runtime.Sql;
export const Decimal = runtime.Decimal;
export const getExtensionContext = runtime.Extensions.getExtensionContext;
export const prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    Instituicao: 'Instituicao',
    Curso: 'Curso',
    User: 'User',
    CoordenadorCurso: 'CoordenadorCurso',
    Edicao: 'Edicao',
    Inscricao: 'Inscricao',
    Prova: 'Prova',
    Questao: 'Questao',
    ProvaQuestao: 'ProvaQuestao',
    Resposta: 'Resposta',
    EnvioFase2: 'EnvioFase2',
    AvaliacaoFase2: 'AvaliacaoFase2',
    Token: 'Token',
    RankingSnapshot: 'RankingSnapshot',
    AuditLog: 'AuditLog'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const InstituicaoScalarFieldEnum = {
    id: 'id',
    nome: 'nome',
    sigla: 'sigla',
    codigoInep: 'codigoInep',
    estado: 'estado',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const CursoScalarFieldEnum = {
    id: 'id',
    nome: 'nome',
    instituicaoId: 'instituicaoId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const UserScalarFieldEnum = {
    id: 'id',
    nome: 'nome',
    email: 'email',
    cpf: 'cpf',
    senhaHash: 'senhaHash',
    role: 'role',
    instituicaoId: 'instituicaoId',
    cursoId: 'cursoId',
    matricula: 'matricula',
    comprovanteUrl: 'comprovanteUrl',
    dataNascimento: 'dataNascimento',
    emailConfirmado: 'emailConfirmado',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const CoordenadorCursoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    cursoId: 'cursoId'
};
export const EdicaoScalarFieldEnum = {
    id: 'id',
    ano: 'ano',
    titulo: 'titulo',
    status: 'status',
    dataInicio: 'dataInicio',
    dataFim: 'dataFim',
    pesoFase1: 'pesoFase1',
    pesoFase2: 'pesoFase2',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const InscricaoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    edicaoId: 'edicaoId',
    status: 'status',
    estado: 'estado',
    municipio: 'municipio',
    instituicaoId: 'instituicaoId',
    cursoId: 'cursoId',
    periodo: 'periodo',
    comprovanteUrl: 'comprovanteUrl',
    fase1Nota: 'fase1Nota',
    fase1Inicio: 'fase1Inicio',
    fase1Fim: 'fase1Fim',
    fase2Tema: 'fase2Tema',
    notaFinal: 'notaFinal',
    medalha: 'medalha',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ProvaScalarFieldEnum = {
    id: 'id',
    edicaoId: 'edicaoId',
    fase: 'fase',
    titulo: 'titulo',
    duracaoMinutos: 'duracaoMinutos',
    status: 'status',
    publicadaEm: 'publicadaEm',
    janelaInicio: 'janelaInicio',
    janelaFim: 'janelaFim',
    versao: 'versao',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const QuestaoScalarFieldEnum = {
    id: 'id',
    enunciado: 'enunciado',
    alternativaA: 'alternativaA',
    alternativaB: 'alternativaB',
    alternativaC: 'alternativaC',
    alternativaD: 'alternativaD',
    alternativaE: 'alternativaE',
    correta: 'correta',
    eixo: 'eixo',
    dificuldade: 'dificuldade',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ProvaQuestaoScalarFieldEnum = {
    id: 'id',
    provaId: 'provaId',
    questaoId: 'questaoId',
    ordem: 'ordem'
};
export const RespostaScalarFieldEnum = {
    id: 'id',
    inscricaoId: 'inscricaoId',
    provaId: 'provaId',
    questaoId: 'questaoId',
    alternativaMarcada: 'alternativaMarcada',
    correta: 'correta',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const EnvioFase2ScalarFieldEnum = {
    id: 'id',
    inscricaoId: 'inscricaoId',
    tipo: 'tipo',
    arquivoUrl: 'arquivoUrl',
    videoLink: 'videoLink',
    status: 'status',
    enviadoEm: 'enviadoEm'
};
export const AvaliacaoFase2ScalarFieldEnum = {
    id: 'id',
    inscricaoId: 'inscricaoId',
    avaliadorId: 'avaliadorId',
    nota: 'nota',
    parecer: 'parecer',
    avaliadoEm: 'avaliadoEm'
};
export const TokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tipo: 'tipo',
    token: 'token',
    expiraEm: 'expiraEm',
    usadoEm: 'usadoEm',
    createdAt: 'createdAt'
};
export const RankingSnapshotScalarFieldEnum = {
    id: 'id',
    edicaoId: 'edicaoId',
    estado: 'estado',
    dados: 'dados',
    publicadoEm: 'publicadoEm',
    createdAt: 'createdAt'
};
export const AuditLogScalarFieldEnum = {
    id: 'id',
    actorId: 'actorId',
    acao: 'acao',
    entidade: 'entidade',
    entidadeId: 'entidadeId',
    payload: 'payload',
    createdAt: 'createdAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const JsonNullValueInput = {
    JsonNull: JsonNull
};
export const NullableJsonNullValueInput = {
    DbNull: DbNull,
    JsonNull: JsonNull
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
export const JsonNullValueFilter = {
    DbNull: DbNull,
    JsonNull: JsonNull,
    AnyNull: AnyNull
};
export const defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map
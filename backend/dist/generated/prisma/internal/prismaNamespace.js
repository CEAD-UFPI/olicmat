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
    User: 'User',
    Inscricao: 'Inscricao',
    Questao: 'Questao',
    Resposta: 'Resposta',
    Modulo: 'Modulo',
    ProgressoCurso: 'ProgressoCurso',
    Certificado: 'Certificado',
    Submissao: 'Submissao'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    nome: 'nome',
    email: 'email',
    cpf: 'cpf',
    senha: 'senha',
    role: 'role',
    instituicao: 'instituicao',
    curso: 'curso',
    matricula: 'matricula',
    comprovanteUrl: 'comprovanteUrl',
    dataNascimento: 'dataNascimento',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const InscricaoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    status: 'status',
    estado: 'estado',
    municipio: 'municipio',
    instituicao: 'instituicao',
    curso: 'curso',
    periodo: 'periodo',
    comprovanteUrl: 'comprovanteUrl',
    fase1Nota: 'fase1Nota',
    fase1Inicio: 'fase1Inicio',
    fase1Fim: 'fase1Fim',
    fase2Tema: 'fase2Tema',
    fase2VideoUrl: 'fase2VideoUrl',
    fase2PortfolioUrl: 'fase2PortfolioUrl',
    fase2Nota: 'fase2Nota',
    notaFinal: 'notaFinal',
    medalha: 'medalha',
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
    createdAt: 'createdAt'
};
export const RespostaScalarFieldEnum = {
    id: 'id',
    inscricaoId: 'inscricaoId',
    questaoId: 'questaoId',
    alternativa: 'alternativa',
    correta: 'correta',
    respondedAt: 'respondedAt'
};
export const ModuloScalarFieldEnum = {
    id: 'id',
    titulo: 'titulo',
    descricao: 'descricao',
    ordem: 'ordem',
    cargaHoraria: 'cargaHoraria',
    conteudos: 'conteudos',
    questionario: 'questionario'
};
export const ProgressoCursoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    moduloId: 'moduloId',
    concluido: 'concluido',
    nota: 'nota'
};
export const CertificadoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    cargaHoraria: 'cargaHoraria',
    emitidoEm: 'emitidoEm',
    codigo: 'codigo'
};
export const SubmissaoScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tipo: 'tipo',
    titulo: 'titulo',
    resumo: 'resumo',
    arquivoUrl: 'arquivoUrl',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
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
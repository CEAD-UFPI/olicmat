import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "inscricao" | "questao" | "resposta" | "modulo" | "progressoCurso" | "certificado" | "submissao";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Inscricao: {
            payload: Prisma.$InscricaoPayload<ExtArgs>;
            fields: Prisma.InscricaoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InscricaoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InscricaoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload>;
                };
                findFirst: {
                    args: Prisma.InscricaoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InscricaoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload>;
                };
                findMany: {
                    args: Prisma.InscricaoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload>[];
                };
                create: {
                    args: Prisma.InscricaoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload>;
                };
                createMany: {
                    args: Prisma.InscricaoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InscricaoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload>[];
                };
                delete: {
                    args: Prisma.InscricaoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload>;
                };
                update: {
                    args: Prisma.InscricaoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload>;
                };
                deleteMany: {
                    args: Prisma.InscricaoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InscricaoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InscricaoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload>[];
                };
                upsert: {
                    args: Prisma.InscricaoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InscricaoPayload>;
                };
                aggregate: {
                    args: Prisma.InscricaoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInscricao>;
                };
                groupBy: {
                    args: Prisma.InscricaoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InscricaoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InscricaoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InscricaoCountAggregateOutputType> | number;
                };
            };
        };
        Questao: {
            payload: Prisma.$QuestaoPayload<ExtArgs>;
            fields: Prisma.QuestaoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.QuestaoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.QuestaoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload>;
                };
                findFirst: {
                    args: Prisma.QuestaoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.QuestaoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload>;
                };
                findMany: {
                    args: Prisma.QuestaoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload>[];
                };
                create: {
                    args: Prisma.QuestaoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload>;
                };
                createMany: {
                    args: Prisma.QuestaoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.QuestaoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload>[];
                };
                delete: {
                    args: Prisma.QuestaoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload>;
                };
                update: {
                    args: Prisma.QuestaoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload>;
                };
                deleteMany: {
                    args: Prisma.QuestaoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.QuestaoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.QuestaoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload>[];
                };
                upsert: {
                    args: Prisma.QuestaoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestaoPayload>;
                };
                aggregate: {
                    args: Prisma.QuestaoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateQuestao>;
                };
                groupBy: {
                    args: Prisma.QuestaoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuestaoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.QuestaoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuestaoCountAggregateOutputType> | number;
                };
            };
        };
        Resposta: {
            payload: Prisma.$RespostaPayload<ExtArgs>;
            fields: Prisma.RespostaFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RespostaFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RespostaFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload>;
                };
                findFirst: {
                    args: Prisma.RespostaFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RespostaFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload>;
                };
                findMany: {
                    args: Prisma.RespostaFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload>[];
                };
                create: {
                    args: Prisma.RespostaCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload>;
                };
                createMany: {
                    args: Prisma.RespostaCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RespostaCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload>[];
                };
                delete: {
                    args: Prisma.RespostaDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload>;
                };
                update: {
                    args: Prisma.RespostaUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload>;
                };
                deleteMany: {
                    args: Prisma.RespostaDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RespostaUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RespostaUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload>[];
                };
                upsert: {
                    args: Prisma.RespostaUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RespostaPayload>;
                };
                aggregate: {
                    args: Prisma.RespostaAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateResposta>;
                };
                groupBy: {
                    args: Prisma.RespostaGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RespostaGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RespostaCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RespostaCountAggregateOutputType> | number;
                };
            };
        };
        Modulo: {
            payload: Prisma.$ModuloPayload<ExtArgs>;
            fields: Prisma.ModuloFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ModuloFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ModuloFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload>;
                };
                findFirst: {
                    args: Prisma.ModuloFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ModuloFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload>;
                };
                findMany: {
                    args: Prisma.ModuloFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload>[];
                };
                create: {
                    args: Prisma.ModuloCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload>;
                };
                createMany: {
                    args: Prisma.ModuloCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ModuloCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload>[];
                };
                delete: {
                    args: Prisma.ModuloDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload>;
                };
                update: {
                    args: Prisma.ModuloUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload>;
                };
                deleteMany: {
                    args: Prisma.ModuloDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ModuloUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ModuloUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload>[];
                };
                upsert: {
                    args: Prisma.ModuloUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModuloPayload>;
                };
                aggregate: {
                    args: Prisma.ModuloAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateModulo>;
                };
                groupBy: {
                    args: Prisma.ModuloGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ModuloGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ModuloCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ModuloCountAggregateOutputType> | number;
                };
            };
        };
        ProgressoCurso: {
            payload: Prisma.$ProgressoCursoPayload<ExtArgs>;
            fields: Prisma.ProgressoCursoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProgressoCursoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProgressoCursoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload>;
                };
                findFirst: {
                    args: Prisma.ProgressoCursoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProgressoCursoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload>;
                };
                findMany: {
                    args: Prisma.ProgressoCursoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload>[];
                };
                create: {
                    args: Prisma.ProgressoCursoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload>;
                };
                createMany: {
                    args: Prisma.ProgressoCursoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProgressoCursoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload>[];
                };
                delete: {
                    args: Prisma.ProgressoCursoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload>;
                };
                update: {
                    args: Prisma.ProgressoCursoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload>;
                };
                deleteMany: {
                    args: Prisma.ProgressoCursoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProgressoCursoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProgressoCursoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload>[];
                };
                upsert: {
                    args: Prisma.ProgressoCursoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProgressoCursoPayload>;
                };
                aggregate: {
                    args: Prisma.ProgressoCursoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProgressoCurso>;
                };
                groupBy: {
                    args: Prisma.ProgressoCursoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProgressoCursoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProgressoCursoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProgressoCursoCountAggregateOutputType> | number;
                };
            };
        };
        Certificado: {
            payload: Prisma.$CertificadoPayload<ExtArgs>;
            fields: Prisma.CertificadoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CertificadoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CertificadoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload>;
                };
                findFirst: {
                    args: Prisma.CertificadoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CertificadoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload>;
                };
                findMany: {
                    args: Prisma.CertificadoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload>[];
                };
                create: {
                    args: Prisma.CertificadoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload>;
                };
                createMany: {
                    args: Prisma.CertificadoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CertificadoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload>[];
                };
                delete: {
                    args: Prisma.CertificadoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload>;
                };
                update: {
                    args: Prisma.CertificadoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload>;
                };
                deleteMany: {
                    args: Prisma.CertificadoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CertificadoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CertificadoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload>[];
                };
                upsert: {
                    args: Prisma.CertificadoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificadoPayload>;
                };
                aggregate: {
                    args: Prisma.CertificadoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCertificado>;
                };
                groupBy: {
                    args: Prisma.CertificadoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CertificadoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CertificadoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CertificadoCountAggregateOutputType> | number;
                };
            };
        };
        Submissao: {
            payload: Prisma.$SubmissaoPayload<ExtArgs>;
            fields: Prisma.SubmissaoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SubmissaoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SubmissaoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload>;
                };
                findFirst: {
                    args: Prisma.SubmissaoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SubmissaoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload>;
                };
                findMany: {
                    args: Prisma.SubmissaoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload>[];
                };
                create: {
                    args: Prisma.SubmissaoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload>;
                };
                createMany: {
                    args: Prisma.SubmissaoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SubmissaoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload>[];
                };
                delete: {
                    args: Prisma.SubmissaoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload>;
                };
                update: {
                    args: Prisma.SubmissaoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload>;
                };
                deleteMany: {
                    args: Prisma.SubmissaoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SubmissaoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SubmissaoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload>[];
                };
                upsert: {
                    args: Prisma.SubmissaoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissaoPayload>;
                };
                aggregate: {
                    args: Prisma.SubmissaoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSubmissao>;
                };
                groupBy: {
                    args: Prisma.SubmissaoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubmissaoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SubmissaoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubmissaoCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
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
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
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
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>;
export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumStatusInscFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusInsc'>;
export type ListEnumStatusInscFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusInsc[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type EnumMedalhaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Medalha'>;
export type ListEnumMedalhaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Medalha[]'>;
export type EnumEixoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Eixo'>;
export type ListEnumEixoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Eixo[]'>;
export type EnumDificuldadeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Dificuldade'>;
export type ListEnumDificuldadeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Dificuldade[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumTipoSubmFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoSubm'>;
export type ListEnumTipoSubmFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoSubm[]'>;
export type EnumStatusSubmFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusSubm'>;
export type ListEnumStatusSubmFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusSubm[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    inscricao?: Prisma.InscricaoOmit;
    questao?: Prisma.QuestaoOmit;
    resposta?: Prisma.RespostaOmit;
    modulo?: Prisma.ModuloOmit;
    progressoCurso?: Prisma.ProgressoCursoOmit;
    certificado?: Prisma.CertificadoOmit;
    submissao?: Prisma.SubmissaoOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;

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
    readonly Token: "Token";
    readonly RankingSnapshot: "RankingSnapshot";
    readonly AuditLog: "AuditLog";
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
        modelProps: "instituicao" | "curso" | "user" | "coordenadorCurso" | "edicao" | "inscricao" | "prova" | "questao" | "provaQuestao" | "resposta" | "envioFase2" | "avaliacaoFase2" | "token" | "rankingSnapshot" | "auditLog";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Instituicao: {
            payload: Prisma.$InstituicaoPayload<ExtArgs>;
            fields: Prisma.InstituicaoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InstituicaoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InstituicaoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload>;
                };
                findFirst: {
                    args: Prisma.InstituicaoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InstituicaoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload>;
                };
                findMany: {
                    args: Prisma.InstituicaoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload>[];
                };
                create: {
                    args: Prisma.InstituicaoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload>;
                };
                createMany: {
                    args: Prisma.InstituicaoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InstituicaoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload>[];
                };
                delete: {
                    args: Prisma.InstituicaoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload>;
                };
                update: {
                    args: Prisma.InstituicaoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload>;
                };
                deleteMany: {
                    args: Prisma.InstituicaoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InstituicaoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InstituicaoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload>[];
                };
                upsert: {
                    args: Prisma.InstituicaoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstituicaoPayload>;
                };
                aggregate: {
                    args: Prisma.InstituicaoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInstituicao>;
                };
                groupBy: {
                    args: Prisma.InstituicaoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InstituicaoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InstituicaoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InstituicaoCountAggregateOutputType> | number;
                };
            };
        };
        Curso: {
            payload: Prisma.$CursoPayload<ExtArgs>;
            fields: Prisma.CursoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CursoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CursoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload>;
                };
                findFirst: {
                    args: Prisma.CursoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CursoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload>;
                };
                findMany: {
                    args: Prisma.CursoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload>[];
                };
                create: {
                    args: Prisma.CursoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload>;
                };
                createMany: {
                    args: Prisma.CursoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CursoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload>[];
                };
                delete: {
                    args: Prisma.CursoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload>;
                };
                update: {
                    args: Prisma.CursoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload>;
                };
                deleteMany: {
                    args: Prisma.CursoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CursoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CursoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload>[];
                };
                upsert: {
                    args: Prisma.CursoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CursoPayload>;
                };
                aggregate: {
                    args: Prisma.CursoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCurso>;
                };
                groupBy: {
                    args: Prisma.CursoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CursoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CursoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CursoCountAggregateOutputType> | number;
                };
            };
        };
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
        CoordenadorCurso: {
            payload: Prisma.$CoordenadorCursoPayload<ExtArgs>;
            fields: Prisma.CoordenadorCursoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CoordenadorCursoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CoordenadorCursoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload>;
                };
                findFirst: {
                    args: Prisma.CoordenadorCursoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CoordenadorCursoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload>;
                };
                findMany: {
                    args: Prisma.CoordenadorCursoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload>[];
                };
                create: {
                    args: Prisma.CoordenadorCursoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload>;
                };
                createMany: {
                    args: Prisma.CoordenadorCursoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CoordenadorCursoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload>[];
                };
                delete: {
                    args: Prisma.CoordenadorCursoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload>;
                };
                update: {
                    args: Prisma.CoordenadorCursoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload>;
                };
                deleteMany: {
                    args: Prisma.CoordenadorCursoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CoordenadorCursoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CoordenadorCursoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload>[];
                };
                upsert: {
                    args: Prisma.CoordenadorCursoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoordenadorCursoPayload>;
                };
                aggregate: {
                    args: Prisma.CoordenadorCursoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCoordenadorCurso>;
                };
                groupBy: {
                    args: Prisma.CoordenadorCursoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CoordenadorCursoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CoordenadorCursoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CoordenadorCursoCountAggregateOutputType> | number;
                };
            };
        };
        Edicao: {
            payload: Prisma.$EdicaoPayload<ExtArgs>;
            fields: Prisma.EdicaoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EdicaoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EdicaoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload>;
                };
                findFirst: {
                    args: Prisma.EdicaoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EdicaoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload>;
                };
                findMany: {
                    args: Prisma.EdicaoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload>[];
                };
                create: {
                    args: Prisma.EdicaoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload>;
                };
                createMany: {
                    args: Prisma.EdicaoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EdicaoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload>[];
                };
                delete: {
                    args: Prisma.EdicaoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload>;
                };
                update: {
                    args: Prisma.EdicaoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload>;
                };
                deleteMany: {
                    args: Prisma.EdicaoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EdicaoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EdicaoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload>[];
                };
                upsert: {
                    args: Prisma.EdicaoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EdicaoPayload>;
                };
                aggregate: {
                    args: Prisma.EdicaoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEdicao>;
                };
                groupBy: {
                    args: Prisma.EdicaoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EdicaoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EdicaoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EdicaoCountAggregateOutputType> | number;
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
        Prova: {
            payload: Prisma.$ProvaPayload<ExtArgs>;
            fields: Prisma.ProvaFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProvaFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProvaFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload>;
                };
                findFirst: {
                    args: Prisma.ProvaFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProvaFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload>;
                };
                findMany: {
                    args: Prisma.ProvaFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload>[];
                };
                create: {
                    args: Prisma.ProvaCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload>;
                };
                createMany: {
                    args: Prisma.ProvaCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProvaCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload>[];
                };
                delete: {
                    args: Prisma.ProvaDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload>;
                };
                update: {
                    args: Prisma.ProvaUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload>;
                };
                deleteMany: {
                    args: Prisma.ProvaDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProvaUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProvaUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload>[];
                };
                upsert: {
                    args: Prisma.ProvaUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaPayload>;
                };
                aggregate: {
                    args: Prisma.ProvaAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProva>;
                };
                groupBy: {
                    args: Prisma.ProvaGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProvaGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProvaCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProvaCountAggregateOutputType> | number;
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
        ProvaQuestao: {
            payload: Prisma.$ProvaQuestaoPayload<ExtArgs>;
            fields: Prisma.ProvaQuestaoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProvaQuestaoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProvaQuestaoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload>;
                };
                findFirst: {
                    args: Prisma.ProvaQuestaoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProvaQuestaoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload>;
                };
                findMany: {
                    args: Prisma.ProvaQuestaoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload>[];
                };
                create: {
                    args: Prisma.ProvaQuestaoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload>;
                };
                createMany: {
                    args: Prisma.ProvaQuestaoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProvaQuestaoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload>[];
                };
                delete: {
                    args: Prisma.ProvaQuestaoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload>;
                };
                update: {
                    args: Prisma.ProvaQuestaoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload>;
                };
                deleteMany: {
                    args: Prisma.ProvaQuestaoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProvaQuestaoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProvaQuestaoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload>[];
                };
                upsert: {
                    args: Prisma.ProvaQuestaoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProvaQuestaoPayload>;
                };
                aggregate: {
                    args: Prisma.ProvaQuestaoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProvaQuestao>;
                };
                groupBy: {
                    args: Prisma.ProvaQuestaoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProvaQuestaoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProvaQuestaoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProvaQuestaoCountAggregateOutputType> | number;
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
        EnvioFase2: {
            payload: Prisma.$EnvioFase2Payload<ExtArgs>;
            fields: Prisma.EnvioFase2FieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EnvioFase2FindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EnvioFase2FindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload>;
                };
                findFirst: {
                    args: Prisma.EnvioFase2FindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EnvioFase2FindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload>;
                };
                findMany: {
                    args: Prisma.EnvioFase2FindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload>[];
                };
                create: {
                    args: Prisma.EnvioFase2CreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload>;
                };
                createMany: {
                    args: Prisma.EnvioFase2CreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EnvioFase2CreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload>[];
                };
                delete: {
                    args: Prisma.EnvioFase2DeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload>;
                };
                update: {
                    args: Prisma.EnvioFase2UpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload>;
                };
                deleteMany: {
                    args: Prisma.EnvioFase2DeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EnvioFase2UpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EnvioFase2UpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload>[];
                };
                upsert: {
                    args: Prisma.EnvioFase2UpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EnvioFase2Payload>;
                };
                aggregate: {
                    args: Prisma.EnvioFase2AggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEnvioFase2>;
                };
                groupBy: {
                    args: Prisma.EnvioFase2GroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EnvioFase2GroupByOutputType>[];
                };
                count: {
                    args: Prisma.EnvioFase2CountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EnvioFase2CountAggregateOutputType> | number;
                };
            };
        };
        AvaliacaoFase2: {
            payload: Prisma.$AvaliacaoFase2Payload<ExtArgs>;
            fields: Prisma.AvaliacaoFase2FieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AvaliacaoFase2FindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AvaliacaoFase2FindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload>;
                };
                findFirst: {
                    args: Prisma.AvaliacaoFase2FindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AvaliacaoFase2FindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload>;
                };
                findMany: {
                    args: Prisma.AvaliacaoFase2FindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload>[];
                };
                create: {
                    args: Prisma.AvaliacaoFase2CreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload>;
                };
                createMany: {
                    args: Prisma.AvaliacaoFase2CreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AvaliacaoFase2CreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload>[];
                };
                delete: {
                    args: Prisma.AvaliacaoFase2DeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload>;
                };
                update: {
                    args: Prisma.AvaliacaoFase2UpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload>;
                };
                deleteMany: {
                    args: Prisma.AvaliacaoFase2DeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AvaliacaoFase2UpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AvaliacaoFase2UpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload>[];
                };
                upsert: {
                    args: Prisma.AvaliacaoFase2UpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AvaliacaoFase2Payload>;
                };
                aggregate: {
                    args: Prisma.AvaliacaoFase2AggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAvaliacaoFase2>;
                };
                groupBy: {
                    args: Prisma.AvaliacaoFase2GroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AvaliacaoFase2GroupByOutputType>[];
                };
                count: {
                    args: Prisma.AvaliacaoFase2CountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AvaliacaoFase2CountAggregateOutputType> | number;
                };
            };
        };
        Token: {
            payload: Prisma.$TokenPayload<ExtArgs>;
            fields: Prisma.TokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload>;
                };
                findFirst: {
                    args: Prisma.TokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload>;
                };
                findMany: {
                    args: Prisma.TokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload>[];
                };
                create: {
                    args: Prisma.TokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload>;
                };
                createMany: {
                    args: Prisma.TokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload>[];
                };
                delete: {
                    args: Prisma.TokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload>;
                };
                update: {
                    args: Prisma.TokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload>;
                };
                deleteMany: {
                    args: Prisma.TokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload>[];
                };
                upsert: {
                    args: Prisma.TokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPayload>;
                };
                aggregate: {
                    args: Prisma.TokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateToken>;
                };
                groupBy: {
                    args: Prisma.TokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TokenCountAggregateOutputType> | number;
                };
            };
        };
        RankingSnapshot: {
            payload: Prisma.$RankingSnapshotPayload<ExtArgs>;
            fields: Prisma.RankingSnapshotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RankingSnapshotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RankingSnapshotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>;
                };
                findFirst: {
                    args: Prisma.RankingSnapshotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RankingSnapshotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>;
                };
                findMany: {
                    args: Prisma.RankingSnapshotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>[];
                };
                create: {
                    args: Prisma.RankingSnapshotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>;
                };
                createMany: {
                    args: Prisma.RankingSnapshotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RankingSnapshotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>[];
                };
                delete: {
                    args: Prisma.RankingSnapshotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>;
                };
                update: {
                    args: Prisma.RankingSnapshotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>;
                };
                deleteMany: {
                    args: Prisma.RankingSnapshotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RankingSnapshotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RankingSnapshotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>[];
                };
                upsert: {
                    args: Prisma.RankingSnapshotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>;
                };
                aggregate: {
                    args: Prisma.RankingSnapshotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRankingSnapshot>;
                };
                groupBy: {
                    args: Prisma.RankingSnapshotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RankingSnapshotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RankingSnapshotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RankingSnapshotCountAggregateOutputType> | number;
                };
            };
        };
        AuditLog: {
            payload: Prisma.$AuditLogPayload<ExtArgs>;
            fields: Prisma.AuditLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AuditLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findFirst: {
                    args: Prisma.AuditLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findMany: {
                    args: Prisma.AuditLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                create: {
                    args: Prisma.AuditLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                createMany: {
                    args: Prisma.AuditLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                delete: {
                    args: Prisma.AuditLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                update: {
                    args: Prisma.AuditLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                deleteMany: {
                    args: Prisma.AuditLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AuditLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                upsert: {
                    args: Prisma.AuditLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                aggregate: {
                    args: Prisma.AuditLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAuditLog>;
                };
                groupBy: {
                    args: Prisma.AuditLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AuditLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogCountAggregateOutputType> | number;
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
export declare const InstituicaoScalarFieldEnum: {
    readonly id: "id";
    readonly nome: "nome";
    readonly sigla: "sigla";
    readonly codigoInep: "codigoInep";
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
    readonly emailConfirmado: "emailConfirmado";
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
    readonly videoLink: "videoLink";
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
export declare const TokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly tipo: "tipo";
    readonly token: "token";
    readonly expiraEm: "expiraEm";
    readonly usadoEm: "usadoEm";
    readonly createdAt: "createdAt";
};
export type TokenScalarFieldEnum = (typeof TokenScalarFieldEnum)[keyof typeof TokenScalarFieldEnum];
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
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>;
export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type EnumStatusInscFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusInsc'>;
export type ListEnumStatusInscFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusInsc[]'>;
export type EnumMedalhaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Medalha'>;
export type ListEnumMedalhaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Medalha[]'>;
export type EnumStatusProvaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusProva'>;
export type ListEnumStatusProvaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusProva[]'>;
export type EnumEixoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Eixo'>;
export type ListEnumEixoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Eixo[]'>;
export type EnumDificuldadeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Dificuldade'>;
export type ListEnumDificuldadeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Dificuldade[]'>;
export type EnumStatusEnvioFase2FieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusEnvioFase2'>;
export type ListEnumStatusEnvioFase2FieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusEnvioFase2[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
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
    instituicao?: Prisma.InstituicaoOmit;
    curso?: Prisma.CursoOmit;
    user?: Prisma.UserOmit;
    coordenadorCurso?: Prisma.CoordenadorCursoOmit;
    edicao?: Prisma.EdicaoOmit;
    inscricao?: Prisma.InscricaoOmit;
    prova?: Prisma.ProvaOmit;
    questao?: Prisma.QuestaoOmit;
    provaQuestao?: Prisma.ProvaQuestaoOmit;
    resposta?: Prisma.RespostaOmit;
    envioFase2?: Prisma.EnvioFase2Omit;
    avaliacaoFase2?: Prisma.AvaliacaoFase2Omit;
    token?: Prisma.TokenOmit;
    rankingSnapshot?: Prisma.RankingSnapshotOmit;
    auditLog?: Prisma.AuditLogOmit;
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

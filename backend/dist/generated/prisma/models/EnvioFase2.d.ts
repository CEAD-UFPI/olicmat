import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EnvioFase2Model = runtime.Types.Result.DefaultSelection<Prisma.$EnvioFase2Payload>;
export type AggregateEnvioFase2 = {
    _count: EnvioFase2CountAggregateOutputType | null;
    _min: EnvioFase2MinAggregateOutputType | null;
    _max: EnvioFase2MaxAggregateOutputType | null;
};
export type EnvioFase2MinAggregateOutputType = {
    id: string | null;
    inscricaoId: string | null;
    tipo: string | null;
    arquivoUrl: string | null;
    status: $Enums.StatusEnvioFase2 | null;
    enviadoEm: Date | null;
};
export type EnvioFase2MaxAggregateOutputType = {
    id: string | null;
    inscricaoId: string | null;
    tipo: string | null;
    arquivoUrl: string | null;
    status: $Enums.StatusEnvioFase2 | null;
    enviadoEm: Date | null;
};
export type EnvioFase2CountAggregateOutputType = {
    id: number;
    inscricaoId: number;
    tipo: number;
    arquivoUrl: number;
    status: number;
    enviadoEm: number;
    _all: number;
};
export type EnvioFase2MinAggregateInputType = {
    id?: true;
    inscricaoId?: true;
    tipo?: true;
    arquivoUrl?: true;
    status?: true;
    enviadoEm?: true;
};
export type EnvioFase2MaxAggregateInputType = {
    id?: true;
    inscricaoId?: true;
    tipo?: true;
    arquivoUrl?: true;
    status?: true;
    enviadoEm?: true;
};
export type EnvioFase2CountAggregateInputType = {
    id?: true;
    inscricaoId?: true;
    tipo?: true;
    arquivoUrl?: true;
    status?: true;
    enviadoEm?: true;
    _all?: true;
};
export type EnvioFase2AggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EnvioFase2WhereInput;
    orderBy?: Prisma.EnvioFase2OrderByWithRelationInput | Prisma.EnvioFase2OrderByWithRelationInput[];
    cursor?: Prisma.EnvioFase2WhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EnvioFase2CountAggregateInputType;
    _min?: EnvioFase2MinAggregateInputType;
    _max?: EnvioFase2MaxAggregateInputType;
};
export type GetEnvioFase2AggregateType<T extends EnvioFase2AggregateArgs> = {
    [P in keyof T & keyof AggregateEnvioFase2]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEnvioFase2[P]> : Prisma.GetScalarType<T[P], AggregateEnvioFase2[P]>;
};
export type EnvioFase2GroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EnvioFase2WhereInput;
    orderBy?: Prisma.EnvioFase2OrderByWithAggregationInput | Prisma.EnvioFase2OrderByWithAggregationInput[];
    by: Prisma.EnvioFase2ScalarFieldEnum[] | Prisma.EnvioFase2ScalarFieldEnum;
    having?: Prisma.EnvioFase2ScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EnvioFase2CountAggregateInputType | true;
    _min?: EnvioFase2MinAggregateInputType;
    _max?: EnvioFase2MaxAggregateInputType;
};
export type EnvioFase2GroupByOutputType = {
    id: string;
    inscricaoId: string;
    tipo: string;
    arquivoUrl: string;
    status: $Enums.StatusEnvioFase2;
    enviadoEm: Date;
    _count: EnvioFase2CountAggregateOutputType | null;
    _min: EnvioFase2MinAggregateOutputType | null;
    _max: EnvioFase2MaxAggregateOutputType | null;
};
export type GetEnvioFase2GroupByPayload<T extends EnvioFase2GroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EnvioFase2GroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EnvioFase2GroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EnvioFase2GroupByOutputType[P]> : Prisma.GetScalarType<T[P], EnvioFase2GroupByOutputType[P]>;
}>>;
export type EnvioFase2WhereInput = {
    AND?: Prisma.EnvioFase2WhereInput | Prisma.EnvioFase2WhereInput[];
    OR?: Prisma.EnvioFase2WhereInput[];
    NOT?: Prisma.EnvioFase2WhereInput | Prisma.EnvioFase2WhereInput[];
    id?: Prisma.StringFilter<"EnvioFase2"> | string;
    inscricaoId?: Prisma.StringFilter<"EnvioFase2"> | string;
    tipo?: Prisma.StringFilter<"EnvioFase2"> | string;
    arquivoUrl?: Prisma.StringFilter<"EnvioFase2"> | string;
    status?: Prisma.EnumStatusEnvioFase2Filter<"EnvioFase2"> | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFilter<"EnvioFase2"> | Date | string;
    inscricao?: Prisma.XOR<Prisma.InscricaoScalarRelationFilter, Prisma.InscricaoWhereInput>;
};
export type EnvioFase2OrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enviadoEm?: Prisma.SortOrder;
    inscricao?: Prisma.InscricaoOrderByWithRelationInput;
};
export type EnvioFase2WhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EnvioFase2WhereInput | Prisma.EnvioFase2WhereInput[];
    OR?: Prisma.EnvioFase2WhereInput[];
    NOT?: Prisma.EnvioFase2WhereInput | Prisma.EnvioFase2WhereInput[];
    inscricaoId?: Prisma.StringFilter<"EnvioFase2"> | string;
    tipo?: Prisma.StringFilter<"EnvioFase2"> | string;
    arquivoUrl?: Prisma.StringFilter<"EnvioFase2"> | string;
    status?: Prisma.EnumStatusEnvioFase2Filter<"EnvioFase2"> | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFilter<"EnvioFase2"> | Date | string;
    inscricao?: Prisma.XOR<Prisma.InscricaoScalarRelationFilter, Prisma.InscricaoWhereInput>;
}, "id">;
export type EnvioFase2OrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enviadoEm?: Prisma.SortOrder;
    _count?: Prisma.EnvioFase2CountOrderByAggregateInput;
    _max?: Prisma.EnvioFase2MaxOrderByAggregateInput;
    _min?: Prisma.EnvioFase2MinOrderByAggregateInput;
};
export type EnvioFase2ScalarWhereWithAggregatesInput = {
    AND?: Prisma.EnvioFase2ScalarWhereWithAggregatesInput | Prisma.EnvioFase2ScalarWhereWithAggregatesInput[];
    OR?: Prisma.EnvioFase2ScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EnvioFase2ScalarWhereWithAggregatesInput | Prisma.EnvioFase2ScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"EnvioFase2"> | string;
    inscricaoId?: Prisma.StringWithAggregatesFilter<"EnvioFase2"> | string;
    tipo?: Prisma.StringWithAggregatesFilter<"EnvioFase2"> | string;
    arquivoUrl?: Prisma.StringWithAggregatesFilter<"EnvioFase2"> | string;
    status?: Prisma.EnumStatusEnvioFase2WithAggregatesFilter<"EnvioFase2"> | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeWithAggregatesFilter<"EnvioFase2"> | Date | string;
};
export type EnvioFase2CreateInput = {
    id?: string;
    tipo: string;
    arquivoUrl: string;
    status?: $Enums.StatusEnvioFase2;
    enviadoEm?: Date | string;
    inscricao: Prisma.InscricaoCreateNestedOneWithoutEnviosFase2Input;
};
export type EnvioFase2UncheckedCreateInput = {
    id?: string;
    inscricaoId: string;
    tipo: string;
    arquivoUrl: string;
    status?: $Enums.StatusEnvioFase2;
    enviadoEm?: Date | string;
};
export type EnvioFase2UpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusEnvioFase2FieldUpdateOperationsInput | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneRequiredWithoutEnviosFase2NestedInput;
};
export type EnvioFase2UncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusEnvioFase2FieldUpdateOperationsInput | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EnvioFase2CreateManyInput = {
    id?: string;
    inscricaoId: string;
    tipo: string;
    arquivoUrl: string;
    status?: $Enums.StatusEnvioFase2;
    enviadoEm?: Date | string;
};
export type EnvioFase2UpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusEnvioFase2FieldUpdateOperationsInput | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EnvioFase2UncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusEnvioFase2FieldUpdateOperationsInput | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EnvioFase2ListRelationFilter = {
    every?: Prisma.EnvioFase2WhereInput;
    some?: Prisma.EnvioFase2WhereInput;
    none?: Prisma.EnvioFase2WhereInput;
};
export type EnvioFase2OrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EnvioFase2CountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enviadoEm?: Prisma.SortOrder;
};
export type EnvioFase2MaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enviadoEm?: Prisma.SortOrder;
};
export type EnvioFase2MinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enviadoEm?: Prisma.SortOrder;
};
export type EnvioFase2CreateNestedManyWithoutInscricaoInput = {
    create?: Prisma.XOR<Prisma.EnvioFase2CreateWithoutInscricaoInput, Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput> | Prisma.EnvioFase2CreateWithoutInscricaoInput[] | Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.EnvioFase2CreateOrConnectWithoutInscricaoInput | Prisma.EnvioFase2CreateOrConnectWithoutInscricaoInput[];
    createMany?: Prisma.EnvioFase2CreateManyInscricaoInputEnvelope;
    connect?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
};
export type EnvioFase2UncheckedCreateNestedManyWithoutInscricaoInput = {
    create?: Prisma.XOR<Prisma.EnvioFase2CreateWithoutInscricaoInput, Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput> | Prisma.EnvioFase2CreateWithoutInscricaoInput[] | Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.EnvioFase2CreateOrConnectWithoutInscricaoInput | Prisma.EnvioFase2CreateOrConnectWithoutInscricaoInput[];
    createMany?: Prisma.EnvioFase2CreateManyInscricaoInputEnvelope;
    connect?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
};
export type EnvioFase2UpdateManyWithoutInscricaoNestedInput = {
    create?: Prisma.XOR<Prisma.EnvioFase2CreateWithoutInscricaoInput, Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput> | Prisma.EnvioFase2CreateWithoutInscricaoInput[] | Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.EnvioFase2CreateOrConnectWithoutInscricaoInput | Prisma.EnvioFase2CreateOrConnectWithoutInscricaoInput[];
    upsert?: Prisma.EnvioFase2UpsertWithWhereUniqueWithoutInscricaoInput | Prisma.EnvioFase2UpsertWithWhereUniqueWithoutInscricaoInput[];
    createMany?: Prisma.EnvioFase2CreateManyInscricaoInputEnvelope;
    set?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
    disconnect?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
    delete?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
    connect?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
    update?: Prisma.EnvioFase2UpdateWithWhereUniqueWithoutInscricaoInput | Prisma.EnvioFase2UpdateWithWhereUniqueWithoutInscricaoInput[];
    updateMany?: Prisma.EnvioFase2UpdateManyWithWhereWithoutInscricaoInput | Prisma.EnvioFase2UpdateManyWithWhereWithoutInscricaoInput[];
    deleteMany?: Prisma.EnvioFase2ScalarWhereInput | Prisma.EnvioFase2ScalarWhereInput[];
};
export type EnvioFase2UncheckedUpdateManyWithoutInscricaoNestedInput = {
    create?: Prisma.XOR<Prisma.EnvioFase2CreateWithoutInscricaoInput, Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput> | Prisma.EnvioFase2CreateWithoutInscricaoInput[] | Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.EnvioFase2CreateOrConnectWithoutInscricaoInput | Prisma.EnvioFase2CreateOrConnectWithoutInscricaoInput[];
    upsert?: Prisma.EnvioFase2UpsertWithWhereUniqueWithoutInscricaoInput | Prisma.EnvioFase2UpsertWithWhereUniqueWithoutInscricaoInput[];
    createMany?: Prisma.EnvioFase2CreateManyInscricaoInputEnvelope;
    set?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
    disconnect?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
    delete?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
    connect?: Prisma.EnvioFase2WhereUniqueInput | Prisma.EnvioFase2WhereUniqueInput[];
    update?: Prisma.EnvioFase2UpdateWithWhereUniqueWithoutInscricaoInput | Prisma.EnvioFase2UpdateWithWhereUniqueWithoutInscricaoInput[];
    updateMany?: Prisma.EnvioFase2UpdateManyWithWhereWithoutInscricaoInput | Prisma.EnvioFase2UpdateManyWithWhereWithoutInscricaoInput[];
    deleteMany?: Prisma.EnvioFase2ScalarWhereInput | Prisma.EnvioFase2ScalarWhereInput[];
};
export type EnumStatusEnvioFase2FieldUpdateOperationsInput = {
    set?: $Enums.StatusEnvioFase2;
};
export type EnvioFase2CreateWithoutInscricaoInput = {
    id?: string;
    tipo: string;
    arquivoUrl: string;
    status?: $Enums.StatusEnvioFase2;
    enviadoEm?: Date | string;
};
export type EnvioFase2UncheckedCreateWithoutInscricaoInput = {
    id?: string;
    tipo: string;
    arquivoUrl: string;
    status?: $Enums.StatusEnvioFase2;
    enviadoEm?: Date | string;
};
export type EnvioFase2CreateOrConnectWithoutInscricaoInput = {
    where: Prisma.EnvioFase2WhereUniqueInput;
    create: Prisma.XOR<Prisma.EnvioFase2CreateWithoutInscricaoInput, Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput>;
};
export type EnvioFase2CreateManyInscricaoInputEnvelope = {
    data: Prisma.EnvioFase2CreateManyInscricaoInput | Prisma.EnvioFase2CreateManyInscricaoInput[];
    skipDuplicates?: boolean;
};
export type EnvioFase2UpsertWithWhereUniqueWithoutInscricaoInput = {
    where: Prisma.EnvioFase2WhereUniqueInput;
    update: Prisma.XOR<Prisma.EnvioFase2UpdateWithoutInscricaoInput, Prisma.EnvioFase2UncheckedUpdateWithoutInscricaoInput>;
    create: Prisma.XOR<Prisma.EnvioFase2CreateWithoutInscricaoInput, Prisma.EnvioFase2UncheckedCreateWithoutInscricaoInput>;
};
export type EnvioFase2UpdateWithWhereUniqueWithoutInscricaoInput = {
    where: Prisma.EnvioFase2WhereUniqueInput;
    data: Prisma.XOR<Prisma.EnvioFase2UpdateWithoutInscricaoInput, Prisma.EnvioFase2UncheckedUpdateWithoutInscricaoInput>;
};
export type EnvioFase2UpdateManyWithWhereWithoutInscricaoInput = {
    where: Prisma.EnvioFase2ScalarWhereInput;
    data: Prisma.XOR<Prisma.EnvioFase2UpdateManyMutationInput, Prisma.EnvioFase2UncheckedUpdateManyWithoutInscricaoInput>;
};
export type EnvioFase2ScalarWhereInput = {
    AND?: Prisma.EnvioFase2ScalarWhereInput | Prisma.EnvioFase2ScalarWhereInput[];
    OR?: Prisma.EnvioFase2ScalarWhereInput[];
    NOT?: Prisma.EnvioFase2ScalarWhereInput | Prisma.EnvioFase2ScalarWhereInput[];
    id?: Prisma.StringFilter<"EnvioFase2"> | string;
    inscricaoId?: Prisma.StringFilter<"EnvioFase2"> | string;
    tipo?: Prisma.StringFilter<"EnvioFase2"> | string;
    arquivoUrl?: Prisma.StringFilter<"EnvioFase2"> | string;
    status?: Prisma.EnumStatusEnvioFase2Filter<"EnvioFase2"> | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFilter<"EnvioFase2"> | Date | string;
};
export type EnvioFase2CreateManyInscricaoInput = {
    id?: string;
    tipo: string;
    arquivoUrl: string;
    status?: $Enums.StatusEnvioFase2;
    enviadoEm?: Date | string;
};
export type EnvioFase2UpdateWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusEnvioFase2FieldUpdateOperationsInput | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EnvioFase2UncheckedUpdateWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusEnvioFase2FieldUpdateOperationsInput | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EnvioFase2UncheckedUpdateManyWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusEnvioFase2FieldUpdateOperationsInput | $Enums.StatusEnvioFase2;
    enviadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EnvioFase2Select<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inscricaoId?: boolean;
    tipo?: boolean;
    arquivoUrl?: boolean;
    status?: boolean;
    enviadoEm?: boolean;
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["envioFase2"]>;
export type EnvioFase2SelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inscricaoId?: boolean;
    tipo?: boolean;
    arquivoUrl?: boolean;
    status?: boolean;
    enviadoEm?: boolean;
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["envioFase2"]>;
export type EnvioFase2SelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inscricaoId?: boolean;
    tipo?: boolean;
    arquivoUrl?: boolean;
    status?: boolean;
    enviadoEm?: boolean;
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["envioFase2"]>;
export type EnvioFase2SelectScalar = {
    id?: boolean;
    inscricaoId?: boolean;
    tipo?: boolean;
    arquivoUrl?: boolean;
    status?: boolean;
    enviadoEm?: boolean;
};
export type EnvioFase2Omit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "inscricaoId" | "tipo" | "arquivoUrl" | "status" | "enviadoEm", ExtArgs["result"]["envioFase2"]>;
export type EnvioFase2Include<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
};
export type EnvioFase2IncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
};
export type EnvioFase2IncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
};
export type $EnvioFase2Payload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EnvioFase2";
    objects: {
        inscricao: Prisma.$InscricaoPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        inscricaoId: string;
        tipo: string;
        arquivoUrl: string;
        status: $Enums.StatusEnvioFase2;
        enviadoEm: Date;
    }, ExtArgs["result"]["envioFase2"]>;
    composites: {};
};
export type EnvioFase2GetPayload<S extends boolean | null | undefined | EnvioFase2DefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload, S>;
export type EnvioFase2CountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EnvioFase2FindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EnvioFase2CountAggregateInputType | true;
};
export interface EnvioFase2Delegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EnvioFase2'];
        meta: {
            name: 'EnvioFase2';
        };
    };
    findUnique<T extends EnvioFase2FindUniqueArgs>(args: Prisma.SelectSubset<T, EnvioFase2FindUniqueArgs<ExtArgs>>): Prisma.Prisma__EnvioFase2Client<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EnvioFase2FindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EnvioFase2FindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EnvioFase2Client<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EnvioFase2FindFirstArgs>(args?: Prisma.SelectSubset<T, EnvioFase2FindFirstArgs<ExtArgs>>): Prisma.Prisma__EnvioFase2Client<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EnvioFase2FindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EnvioFase2FindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EnvioFase2Client<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EnvioFase2FindManyArgs>(args?: Prisma.SelectSubset<T, EnvioFase2FindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EnvioFase2CreateArgs>(args: Prisma.SelectSubset<T, EnvioFase2CreateArgs<ExtArgs>>): Prisma.Prisma__EnvioFase2Client<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EnvioFase2CreateManyArgs>(args?: Prisma.SelectSubset<T, EnvioFase2CreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EnvioFase2CreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EnvioFase2CreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EnvioFase2DeleteArgs>(args: Prisma.SelectSubset<T, EnvioFase2DeleteArgs<ExtArgs>>): Prisma.Prisma__EnvioFase2Client<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EnvioFase2UpdateArgs>(args: Prisma.SelectSubset<T, EnvioFase2UpdateArgs<ExtArgs>>): Prisma.Prisma__EnvioFase2Client<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EnvioFase2DeleteManyArgs>(args?: Prisma.SelectSubset<T, EnvioFase2DeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EnvioFase2UpdateManyArgs>(args: Prisma.SelectSubset<T, EnvioFase2UpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EnvioFase2UpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EnvioFase2UpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EnvioFase2UpsertArgs>(args: Prisma.SelectSubset<T, EnvioFase2UpsertArgs<ExtArgs>>): Prisma.Prisma__EnvioFase2Client<runtime.Types.Result.GetResult<Prisma.$EnvioFase2Payload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EnvioFase2CountArgs>(args?: Prisma.Subset<T, EnvioFase2CountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EnvioFase2CountAggregateOutputType> : number>;
    aggregate<T extends EnvioFase2AggregateArgs>(args: Prisma.Subset<T, EnvioFase2AggregateArgs>): Prisma.PrismaPromise<GetEnvioFase2AggregateType<T>>;
    groupBy<T extends EnvioFase2GroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EnvioFase2GroupByArgs['orderBy'];
    } : {
        orderBy?: EnvioFase2GroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EnvioFase2GroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnvioFase2GroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EnvioFase2FieldRefs;
}
export interface Prisma__EnvioFase2Client<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    inscricao<T extends Prisma.InscricaoDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.InscricaoDefaultArgs<ExtArgs>>): Prisma.Prisma__InscricaoClient<runtime.Types.Result.GetResult<Prisma.$InscricaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EnvioFase2FieldRefs {
    readonly id: Prisma.FieldRef<"EnvioFase2", 'String'>;
    readonly inscricaoId: Prisma.FieldRef<"EnvioFase2", 'String'>;
    readonly tipo: Prisma.FieldRef<"EnvioFase2", 'String'>;
    readonly arquivoUrl: Prisma.FieldRef<"EnvioFase2", 'String'>;
    readonly status: Prisma.FieldRef<"EnvioFase2", 'StatusEnvioFase2'>;
    readonly enviadoEm: Prisma.FieldRef<"EnvioFase2", 'DateTime'>;
}
export type EnvioFase2FindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
    where: Prisma.EnvioFase2WhereUniqueInput;
};
export type EnvioFase2FindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
    where: Prisma.EnvioFase2WhereUniqueInput;
};
export type EnvioFase2FindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
    where?: Prisma.EnvioFase2WhereInput;
    orderBy?: Prisma.EnvioFase2OrderByWithRelationInput | Prisma.EnvioFase2OrderByWithRelationInput[];
    cursor?: Prisma.EnvioFase2WhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EnvioFase2ScalarFieldEnum | Prisma.EnvioFase2ScalarFieldEnum[];
};
export type EnvioFase2FindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
    where?: Prisma.EnvioFase2WhereInput;
    orderBy?: Prisma.EnvioFase2OrderByWithRelationInput | Prisma.EnvioFase2OrderByWithRelationInput[];
    cursor?: Prisma.EnvioFase2WhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EnvioFase2ScalarFieldEnum | Prisma.EnvioFase2ScalarFieldEnum[];
};
export type EnvioFase2FindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
    where?: Prisma.EnvioFase2WhereInput;
    orderBy?: Prisma.EnvioFase2OrderByWithRelationInput | Prisma.EnvioFase2OrderByWithRelationInput[];
    cursor?: Prisma.EnvioFase2WhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EnvioFase2ScalarFieldEnum | Prisma.EnvioFase2ScalarFieldEnum[];
};
export type EnvioFase2CreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EnvioFase2CreateInput, Prisma.EnvioFase2UncheckedCreateInput>;
};
export type EnvioFase2CreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EnvioFase2CreateManyInput | Prisma.EnvioFase2CreateManyInput[];
    skipDuplicates?: boolean;
};
export type EnvioFase2CreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2SelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    data: Prisma.EnvioFase2CreateManyInput | Prisma.EnvioFase2CreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EnvioFase2IncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EnvioFase2UpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EnvioFase2UpdateInput, Prisma.EnvioFase2UncheckedUpdateInput>;
    where: Prisma.EnvioFase2WhereUniqueInput;
};
export type EnvioFase2UpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EnvioFase2UpdateManyMutationInput, Prisma.EnvioFase2UncheckedUpdateManyInput>;
    where?: Prisma.EnvioFase2WhereInput;
    limit?: number;
};
export type EnvioFase2UpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2SelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EnvioFase2UpdateManyMutationInput, Prisma.EnvioFase2UncheckedUpdateManyInput>;
    where?: Prisma.EnvioFase2WhereInput;
    limit?: number;
    include?: Prisma.EnvioFase2IncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EnvioFase2UpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
    where: Prisma.EnvioFase2WhereUniqueInput;
    create: Prisma.XOR<Prisma.EnvioFase2CreateInput, Prisma.EnvioFase2UncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EnvioFase2UpdateInput, Prisma.EnvioFase2UncheckedUpdateInput>;
};
export type EnvioFase2DeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
    where: Prisma.EnvioFase2WhereUniqueInput;
};
export type EnvioFase2DeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EnvioFase2WhereInput;
    limit?: number;
};
export type EnvioFase2DefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnvioFase2Select<ExtArgs> | null;
    omit?: Prisma.EnvioFase2Omit<ExtArgs> | null;
    include?: Prisma.EnvioFase2Include<ExtArgs> | null;
};

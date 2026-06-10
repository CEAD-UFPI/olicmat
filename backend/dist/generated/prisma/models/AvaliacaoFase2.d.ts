import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type AvaliacaoFase2Model = runtime.Types.Result.DefaultSelection<Prisma.$AvaliacaoFase2Payload>;
export type AggregateAvaliacaoFase2 = {
    _count: AvaliacaoFase2CountAggregateOutputType | null;
    _avg: AvaliacaoFase2AvgAggregateOutputType | null;
    _sum: AvaliacaoFase2SumAggregateOutputType | null;
    _min: AvaliacaoFase2MinAggregateOutputType | null;
    _max: AvaliacaoFase2MaxAggregateOutputType | null;
};
export type AvaliacaoFase2AvgAggregateOutputType = {
    nota: number | null;
};
export type AvaliacaoFase2SumAggregateOutputType = {
    nota: number | null;
};
export type AvaliacaoFase2MinAggregateOutputType = {
    id: string | null;
    inscricaoId: string | null;
    avaliadorId: string | null;
    nota: number | null;
    parecer: string | null;
    avaliadoEm: Date | null;
};
export type AvaliacaoFase2MaxAggregateOutputType = {
    id: string | null;
    inscricaoId: string | null;
    avaliadorId: string | null;
    nota: number | null;
    parecer: string | null;
    avaliadoEm: Date | null;
};
export type AvaliacaoFase2CountAggregateOutputType = {
    id: number;
    inscricaoId: number;
    avaliadorId: number;
    nota: number;
    parecer: number;
    avaliadoEm: number;
    _all: number;
};
export type AvaliacaoFase2AvgAggregateInputType = {
    nota?: true;
};
export type AvaliacaoFase2SumAggregateInputType = {
    nota?: true;
};
export type AvaliacaoFase2MinAggregateInputType = {
    id?: true;
    inscricaoId?: true;
    avaliadorId?: true;
    nota?: true;
    parecer?: true;
    avaliadoEm?: true;
};
export type AvaliacaoFase2MaxAggregateInputType = {
    id?: true;
    inscricaoId?: true;
    avaliadorId?: true;
    nota?: true;
    parecer?: true;
    avaliadoEm?: true;
};
export type AvaliacaoFase2CountAggregateInputType = {
    id?: true;
    inscricaoId?: true;
    avaliadorId?: true;
    nota?: true;
    parecer?: true;
    avaliadoEm?: true;
    _all?: true;
};
export type AvaliacaoFase2AggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AvaliacaoFase2WhereInput;
    orderBy?: Prisma.AvaliacaoFase2OrderByWithRelationInput | Prisma.AvaliacaoFase2OrderByWithRelationInput[];
    cursor?: Prisma.AvaliacaoFase2WhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AvaliacaoFase2CountAggregateInputType;
    _avg?: AvaliacaoFase2AvgAggregateInputType;
    _sum?: AvaliacaoFase2SumAggregateInputType;
    _min?: AvaliacaoFase2MinAggregateInputType;
    _max?: AvaliacaoFase2MaxAggregateInputType;
};
export type GetAvaliacaoFase2AggregateType<T extends AvaliacaoFase2AggregateArgs> = {
    [P in keyof T & keyof AggregateAvaliacaoFase2]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAvaliacaoFase2[P]> : Prisma.GetScalarType<T[P], AggregateAvaliacaoFase2[P]>;
};
export type AvaliacaoFase2GroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AvaliacaoFase2WhereInput;
    orderBy?: Prisma.AvaliacaoFase2OrderByWithAggregationInput | Prisma.AvaliacaoFase2OrderByWithAggregationInput[];
    by: Prisma.AvaliacaoFase2ScalarFieldEnum[] | Prisma.AvaliacaoFase2ScalarFieldEnum;
    having?: Prisma.AvaliacaoFase2ScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AvaliacaoFase2CountAggregateInputType | true;
    _avg?: AvaliacaoFase2AvgAggregateInputType;
    _sum?: AvaliacaoFase2SumAggregateInputType;
    _min?: AvaliacaoFase2MinAggregateInputType;
    _max?: AvaliacaoFase2MaxAggregateInputType;
};
export type AvaliacaoFase2GroupByOutputType = {
    id: string;
    inscricaoId: string;
    avaliadorId: string;
    nota: number;
    parecer: string | null;
    avaliadoEm: Date;
    _count: AvaliacaoFase2CountAggregateOutputType | null;
    _avg: AvaliacaoFase2AvgAggregateOutputType | null;
    _sum: AvaliacaoFase2SumAggregateOutputType | null;
    _min: AvaliacaoFase2MinAggregateOutputType | null;
    _max: AvaliacaoFase2MaxAggregateOutputType | null;
};
export type GetAvaliacaoFase2GroupByPayload<T extends AvaliacaoFase2GroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AvaliacaoFase2GroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AvaliacaoFase2GroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AvaliacaoFase2GroupByOutputType[P]> : Prisma.GetScalarType<T[P], AvaliacaoFase2GroupByOutputType[P]>;
}>>;
export type AvaliacaoFase2WhereInput = {
    AND?: Prisma.AvaliacaoFase2WhereInput | Prisma.AvaliacaoFase2WhereInput[];
    OR?: Prisma.AvaliacaoFase2WhereInput[];
    NOT?: Prisma.AvaliacaoFase2WhereInput | Prisma.AvaliacaoFase2WhereInput[];
    id?: Prisma.StringFilter<"AvaliacaoFase2"> | string;
    inscricaoId?: Prisma.StringFilter<"AvaliacaoFase2"> | string;
    avaliadorId?: Prisma.StringFilter<"AvaliacaoFase2"> | string;
    nota?: Prisma.FloatFilter<"AvaliacaoFase2"> | number;
    parecer?: Prisma.StringNullableFilter<"AvaliacaoFase2"> | string | null;
    avaliadoEm?: Prisma.DateTimeFilter<"AvaliacaoFase2"> | Date | string;
    inscricao?: Prisma.XOR<Prisma.InscricaoScalarRelationFilter, Prisma.InscricaoWhereInput>;
    avaliador?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type AvaliacaoFase2OrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    avaliadorId?: Prisma.SortOrder;
    nota?: Prisma.SortOrder;
    parecer?: Prisma.SortOrderInput | Prisma.SortOrder;
    avaliadoEm?: Prisma.SortOrder;
    inscricao?: Prisma.InscricaoOrderByWithRelationInput;
    avaliador?: Prisma.UserOrderByWithRelationInput;
};
export type AvaliacaoFase2WhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    inscricaoId_avaliadorId?: Prisma.AvaliacaoFase2InscricaoIdAvaliadorIdCompoundUniqueInput;
    AND?: Prisma.AvaliacaoFase2WhereInput | Prisma.AvaliacaoFase2WhereInput[];
    OR?: Prisma.AvaliacaoFase2WhereInput[];
    NOT?: Prisma.AvaliacaoFase2WhereInput | Prisma.AvaliacaoFase2WhereInput[];
    inscricaoId?: Prisma.StringFilter<"AvaliacaoFase2"> | string;
    avaliadorId?: Prisma.StringFilter<"AvaliacaoFase2"> | string;
    nota?: Prisma.FloatFilter<"AvaliacaoFase2"> | number;
    parecer?: Prisma.StringNullableFilter<"AvaliacaoFase2"> | string | null;
    avaliadoEm?: Prisma.DateTimeFilter<"AvaliacaoFase2"> | Date | string;
    inscricao?: Prisma.XOR<Prisma.InscricaoScalarRelationFilter, Prisma.InscricaoWhereInput>;
    avaliador?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "inscricaoId_avaliadorId">;
export type AvaliacaoFase2OrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    avaliadorId?: Prisma.SortOrder;
    nota?: Prisma.SortOrder;
    parecer?: Prisma.SortOrderInput | Prisma.SortOrder;
    avaliadoEm?: Prisma.SortOrder;
    _count?: Prisma.AvaliacaoFase2CountOrderByAggregateInput;
    _avg?: Prisma.AvaliacaoFase2AvgOrderByAggregateInput;
    _max?: Prisma.AvaliacaoFase2MaxOrderByAggregateInput;
    _min?: Prisma.AvaliacaoFase2MinOrderByAggregateInput;
    _sum?: Prisma.AvaliacaoFase2SumOrderByAggregateInput;
};
export type AvaliacaoFase2ScalarWhereWithAggregatesInput = {
    AND?: Prisma.AvaliacaoFase2ScalarWhereWithAggregatesInput | Prisma.AvaliacaoFase2ScalarWhereWithAggregatesInput[];
    OR?: Prisma.AvaliacaoFase2ScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AvaliacaoFase2ScalarWhereWithAggregatesInput | Prisma.AvaliacaoFase2ScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"AvaliacaoFase2"> | string;
    inscricaoId?: Prisma.StringWithAggregatesFilter<"AvaliacaoFase2"> | string;
    avaliadorId?: Prisma.StringWithAggregatesFilter<"AvaliacaoFase2"> | string;
    nota?: Prisma.FloatWithAggregatesFilter<"AvaliacaoFase2"> | number;
    parecer?: Prisma.StringNullableWithAggregatesFilter<"AvaliacaoFase2"> | string | null;
    avaliadoEm?: Prisma.DateTimeWithAggregatesFilter<"AvaliacaoFase2"> | Date | string;
};
export type AvaliacaoFase2CreateInput = {
    id?: string;
    nota: number;
    parecer?: string | null;
    avaliadoEm?: Date | string;
    inscricao: Prisma.InscricaoCreateNestedOneWithoutAvaliacoesInput;
    avaliador: Prisma.UserCreateNestedOneWithoutAvaliacoesInput;
};
export type AvaliacaoFase2UncheckedCreateInput = {
    id?: string;
    inscricaoId: string;
    avaliadorId: string;
    nota: number;
    parecer?: string | null;
    avaliadoEm?: Date | string;
};
export type AvaliacaoFase2UpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneRequiredWithoutAvaliacoesNestedInput;
    avaliador?: Prisma.UserUpdateOneRequiredWithoutAvaliacoesNestedInput;
};
export type AvaliacaoFase2UncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    avaliadorId?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AvaliacaoFase2CreateManyInput = {
    id?: string;
    inscricaoId: string;
    avaliadorId: string;
    nota: number;
    parecer?: string | null;
    avaliadoEm?: Date | string;
};
export type AvaliacaoFase2UpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AvaliacaoFase2UncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    avaliadorId?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AvaliacaoFase2ListRelationFilter = {
    every?: Prisma.AvaliacaoFase2WhereInput;
    some?: Prisma.AvaliacaoFase2WhereInput;
    none?: Prisma.AvaliacaoFase2WhereInput;
};
export type AvaliacaoFase2OrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AvaliacaoFase2InscricaoIdAvaliadorIdCompoundUniqueInput = {
    inscricaoId: string;
    avaliadorId: string;
};
export type AvaliacaoFase2CountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    avaliadorId?: Prisma.SortOrder;
    nota?: Prisma.SortOrder;
    parecer?: Prisma.SortOrder;
    avaliadoEm?: Prisma.SortOrder;
};
export type AvaliacaoFase2AvgOrderByAggregateInput = {
    nota?: Prisma.SortOrder;
};
export type AvaliacaoFase2MaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    avaliadorId?: Prisma.SortOrder;
    nota?: Prisma.SortOrder;
    parecer?: Prisma.SortOrder;
    avaliadoEm?: Prisma.SortOrder;
};
export type AvaliacaoFase2MinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    avaliadorId?: Prisma.SortOrder;
    nota?: Prisma.SortOrder;
    parecer?: Prisma.SortOrder;
    avaliadoEm?: Prisma.SortOrder;
};
export type AvaliacaoFase2SumOrderByAggregateInput = {
    nota?: Prisma.SortOrder;
};
export type AvaliacaoFase2CreateNestedManyWithoutAvaliadorInput = {
    create?: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput> | Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput[] | Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput[];
    connectOrCreate?: Prisma.AvaliacaoFase2CreateOrConnectWithoutAvaliadorInput | Prisma.AvaliacaoFase2CreateOrConnectWithoutAvaliadorInput[];
    createMany?: Prisma.AvaliacaoFase2CreateManyAvaliadorInputEnvelope;
    connect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
};
export type AvaliacaoFase2UncheckedCreateNestedManyWithoutAvaliadorInput = {
    create?: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput> | Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput[] | Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput[];
    connectOrCreate?: Prisma.AvaliacaoFase2CreateOrConnectWithoutAvaliadorInput | Prisma.AvaliacaoFase2CreateOrConnectWithoutAvaliadorInput[];
    createMany?: Prisma.AvaliacaoFase2CreateManyAvaliadorInputEnvelope;
    connect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
};
export type AvaliacaoFase2UpdateManyWithoutAvaliadorNestedInput = {
    create?: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput> | Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput[] | Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput[];
    connectOrCreate?: Prisma.AvaliacaoFase2CreateOrConnectWithoutAvaliadorInput | Prisma.AvaliacaoFase2CreateOrConnectWithoutAvaliadorInput[];
    upsert?: Prisma.AvaliacaoFase2UpsertWithWhereUniqueWithoutAvaliadorInput | Prisma.AvaliacaoFase2UpsertWithWhereUniqueWithoutAvaliadorInput[];
    createMany?: Prisma.AvaliacaoFase2CreateManyAvaliadorInputEnvelope;
    set?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    disconnect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    delete?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    connect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    update?: Prisma.AvaliacaoFase2UpdateWithWhereUniqueWithoutAvaliadorInput | Prisma.AvaliacaoFase2UpdateWithWhereUniqueWithoutAvaliadorInput[];
    updateMany?: Prisma.AvaliacaoFase2UpdateManyWithWhereWithoutAvaliadorInput | Prisma.AvaliacaoFase2UpdateManyWithWhereWithoutAvaliadorInput[];
    deleteMany?: Prisma.AvaliacaoFase2ScalarWhereInput | Prisma.AvaliacaoFase2ScalarWhereInput[];
};
export type AvaliacaoFase2UncheckedUpdateManyWithoutAvaliadorNestedInput = {
    create?: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput> | Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput[] | Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput[];
    connectOrCreate?: Prisma.AvaliacaoFase2CreateOrConnectWithoutAvaliadorInput | Prisma.AvaliacaoFase2CreateOrConnectWithoutAvaliadorInput[];
    upsert?: Prisma.AvaliacaoFase2UpsertWithWhereUniqueWithoutAvaliadorInput | Prisma.AvaliacaoFase2UpsertWithWhereUniqueWithoutAvaliadorInput[];
    createMany?: Prisma.AvaliacaoFase2CreateManyAvaliadorInputEnvelope;
    set?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    disconnect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    delete?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    connect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    update?: Prisma.AvaliacaoFase2UpdateWithWhereUniqueWithoutAvaliadorInput | Prisma.AvaliacaoFase2UpdateWithWhereUniqueWithoutAvaliadorInput[];
    updateMany?: Prisma.AvaliacaoFase2UpdateManyWithWhereWithoutAvaliadorInput | Prisma.AvaliacaoFase2UpdateManyWithWhereWithoutAvaliadorInput[];
    deleteMany?: Prisma.AvaliacaoFase2ScalarWhereInput | Prisma.AvaliacaoFase2ScalarWhereInput[];
};
export type AvaliacaoFase2CreateNestedManyWithoutInscricaoInput = {
    create?: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutInscricaoInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput> | Prisma.AvaliacaoFase2CreateWithoutInscricaoInput[] | Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.AvaliacaoFase2CreateOrConnectWithoutInscricaoInput | Prisma.AvaliacaoFase2CreateOrConnectWithoutInscricaoInput[];
    createMany?: Prisma.AvaliacaoFase2CreateManyInscricaoInputEnvelope;
    connect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
};
export type AvaliacaoFase2UncheckedCreateNestedManyWithoutInscricaoInput = {
    create?: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutInscricaoInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput> | Prisma.AvaliacaoFase2CreateWithoutInscricaoInput[] | Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.AvaliacaoFase2CreateOrConnectWithoutInscricaoInput | Prisma.AvaliacaoFase2CreateOrConnectWithoutInscricaoInput[];
    createMany?: Prisma.AvaliacaoFase2CreateManyInscricaoInputEnvelope;
    connect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
};
export type AvaliacaoFase2UpdateManyWithoutInscricaoNestedInput = {
    create?: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutInscricaoInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput> | Prisma.AvaliacaoFase2CreateWithoutInscricaoInput[] | Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.AvaliacaoFase2CreateOrConnectWithoutInscricaoInput | Prisma.AvaliacaoFase2CreateOrConnectWithoutInscricaoInput[];
    upsert?: Prisma.AvaliacaoFase2UpsertWithWhereUniqueWithoutInscricaoInput | Prisma.AvaliacaoFase2UpsertWithWhereUniqueWithoutInscricaoInput[];
    createMany?: Prisma.AvaliacaoFase2CreateManyInscricaoInputEnvelope;
    set?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    disconnect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    delete?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    connect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    update?: Prisma.AvaliacaoFase2UpdateWithWhereUniqueWithoutInscricaoInput | Prisma.AvaliacaoFase2UpdateWithWhereUniqueWithoutInscricaoInput[];
    updateMany?: Prisma.AvaliacaoFase2UpdateManyWithWhereWithoutInscricaoInput | Prisma.AvaliacaoFase2UpdateManyWithWhereWithoutInscricaoInput[];
    deleteMany?: Prisma.AvaliacaoFase2ScalarWhereInput | Prisma.AvaliacaoFase2ScalarWhereInput[];
};
export type AvaliacaoFase2UncheckedUpdateManyWithoutInscricaoNestedInput = {
    create?: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutInscricaoInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput> | Prisma.AvaliacaoFase2CreateWithoutInscricaoInput[] | Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.AvaliacaoFase2CreateOrConnectWithoutInscricaoInput | Prisma.AvaliacaoFase2CreateOrConnectWithoutInscricaoInput[];
    upsert?: Prisma.AvaliacaoFase2UpsertWithWhereUniqueWithoutInscricaoInput | Prisma.AvaliacaoFase2UpsertWithWhereUniqueWithoutInscricaoInput[];
    createMany?: Prisma.AvaliacaoFase2CreateManyInscricaoInputEnvelope;
    set?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    disconnect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    delete?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    connect?: Prisma.AvaliacaoFase2WhereUniqueInput | Prisma.AvaliacaoFase2WhereUniqueInput[];
    update?: Prisma.AvaliacaoFase2UpdateWithWhereUniqueWithoutInscricaoInput | Prisma.AvaliacaoFase2UpdateWithWhereUniqueWithoutInscricaoInput[];
    updateMany?: Prisma.AvaliacaoFase2UpdateManyWithWhereWithoutInscricaoInput | Prisma.AvaliacaoFase2UpdateManyWithWhereWithoutInscricaoInput[];
    deleteMany?: Prisma.AvaliacaoFase2ScalarWhereInput | Prisma.AvaliacaoFase2ScalarWhereInput[];
};
export type AvaliacaoFase2CreateWithoutAvaliadorInput = {
    id?: string;
    nota: number;
    parecer?: string | null;
    avaliadoEm?: Date | string;
    inscricao: Prisma.InscricaoCreateNestedOneWithoutAvaliacoesInput;
};
export type AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput = {
    id?: string;
    inscricaoId: string;
    nota: number;
    parecer?: string | null;
    avaliadoEm?: Date | string;
};
export type AvaliacaoFase2CreateOrConnectWithoutAvaliadorInput = {
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
    create: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput>;
};
export type AvaliacaoFase2CreateManyAvaliadorInputEnvelope = {
    data: Prisma.AvaliacaoFase2CreateManyAvaliadorInput | Prisma.AvaliacaoFase2CreateManyAvaliadorInput[];
    skipDuplicates?: boolean;
};
export type AvaliacaoFase2UpsertWithWhereUniqueWithoutAvaliadorInput = {
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
    update: Prisma.XOR<Prisma.AvaliacaoFase2UpdateWithoutAvaliadorInput, Prisma.AvaliacaoFase2UncheckedUpdateWithoutAvaliadorInput>;
    create: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutAvaliadorInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutAvaliadorInput>;
};
export type AvaliacaoFase2UpdateWithWhereUniqueWithoutAvaliadorInput = {
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
    data: Prisma.XOR<Prisma.AvaliacaoFase2UpdateWithoutAvaliadorInput, Prisma.AvaliacaoFase2UncheckedUpdateWithoutAvaliadorInput>;
};
export type AvaliacaoFase2UpdateManyWithWhereWithoutAvaliadorInput = {
    where: Prisma.AvaliacaoFase2ScalarWhereInput;
    data: Prisma.XOR<Prisma.AvaliacaoFase2UpdateManyMutationInput, Prisma.AvaliacaoFase2UncheckedUpdateManyWithoutAvaliadorInput>;
};
export type AvaliacaoFase2ScalarWhereInput = {
    AND?: Prisma.AvaliacaoFase2ScalarWhereInput | Prisma.AvaliacaoFase2ScalarWhereInput[];
    OR?: Prisma.AvaliacaoFase2ScalarWhereInput[];
    NOT?: Prisma.AvaliacaoFase2ScalarWhereInput | Prisma.AvaliacaoFase2ScalarWhereInput[];
    id?: Prisma.StringFilter<"AvaliacaoFase2"> | string;
    inscricaoId?: Prisma.StringFilter<"AvaliacaoFase2"> | string;
    avaliadorId?: Prisma.StringFilter<"AvaliacaoFase2"> | string;
    nota?: Prisma.FloatFilter<"AvaliacaoFase2"> | number;
    parecer?: Prisma.StringNullableFilter<"AvaliacaoFase2"> | string | null;
    avaliadoEm?: Prisma.DateTimeFilter<"AvaliacaoFase2"> | Date | string;
};
export type AvaliacaoFase2CreateWithoutInscricaoInput = {
    id?: string;
    nota: number;
    parecer?: string | null;
    avaliadoEm?: Date | string;
    avaliador: Prisma.UserCreateNestedOneWithoutAvaliacoesInput;
};
export type AvaliacaoFase2UncheckedCreateWithoutInscricaoInput = {
    id?: string;
    avaliadorId: string;
    nota: number;
    parecer?: string | null;
    avaliadoEm?: Date | string;
};
export type AvaliacaoFase2CreateOrConnectWithoutInscricaoInput = {
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
    create: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutInscricaoInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput>;
};
export type AvaliacaoFase2CreateManyInscricaoInputEnvelope = {
    data: Prisma.AvaliacaoFase2CreateManyInscricaoInput | Prisma.AvaliacaoFase2CreateManyInscricaoInput[];
    skipDuplicates?: boolean;
};
export type AvaliacaoFase2UpsertWithWhereUniqueWithoutInscricaoInput = {
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
    update: Prisma.XOR<Prisma.AvaliacaoFase2UpdateWithoutInscricaoInput, Prisma.AvaliacaoFase2UncheckedUpdateWithoutInscricaoInput>;
    create: Prisma.XOR<Prisma.AvaliacaoFase2CreateWithoutInscricaoInput, Prisma.AvaliacaoFase2UncheckedCreateWithoutInscricaoInput>;
};
export type AvaliacaoFase2UpdateWithWhereUniqueWithoutInscricaoInput = {
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
    data: Prisma.XOR<Prisma.AvaliacaoFase2UpdateWithoutInscricaoInput, Prisma.AvaliacaoFase2UncheckedUpdateWithoutInscricaoInput>;
};
export type AvaliacaoFase2UpdateManyWithWhereWithoutInscricaoInput = {
    where: Prisma.AvaliacaoFase2ScalarWhereInput;
    data: Prisma.XOR<Prisma.AvaliacaoFase2UpdateManyMutationInput, Prisma.AvaliacaoFase2UncheckedUpdateManyWithoutInscricaoInput>;
};
export type AvaliacaoFase2CreateManyAvaliadorInput = {
    id?: string;
    inscricaoId: string;
    nota: number;
    parecer?: string | null;
    avaliadoEm?: Date | string;
};
export type AvaliacaoFase2UpdateWithoutAvaliadorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneRequiredWithoutAvaliacoesNestedInput;
};
export type AvaliacaoFase2UncheckedUpdateWithoutAvaliadorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AvaliacaoFase2UncheckedUpdateManyWithoutAvaliadorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AvaliacaoFase2CreateManyInscricaoInput = {
    id?: string;
    avaliadorId: string;
    nota: number;
    parecer?: string | null;
    avaliadoEm?: Date | string;
};
export type AvaliacaoFase2UpdateWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    avaliador?: Prisma.UserUpdateOneRequiredWithoutAvaliacoesNestedInput;
};
export type AvaliacaoFase2UncheckedUpdateWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    avaliadorId?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AvaliacaoFase2UncheckedUpdateManyWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    avaliadorId?: Prisma.StringFieldUpdateOperationsInput | string;
    nota?: Prisma.FloatFieldUpdateOperationsInput | number;
    parecer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avaliadoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AvaliacaoFase2Select<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inscricaoId?: boolean;
    avaliadorId?: boolean;
    nota?: boolean;
    parecer?: boolean;
    avaliadoEm?: boolean;
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    avaliador?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["avaliacaoFase2"]>;
export type AvaliacaoFase2SelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inscricaoId?: boolean;
    avaliadorId?: boolean;
    nota?: boolean;
    parecer?: boolean;
    avaliadoEm?: boolean;
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    avaliador?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["avaliacaoFase2"]>;
export type AvaliacaoFase2SelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inscricaoId?: boolean;
    avaliadorId?: boolean;
    nota?: boolean;
    parecer?: boolean;
    avaliadoEm?: boolean;
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    avaliador?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["avaliacaoFase2"]>;
export type AvaliacaoFase2SelectScalar = {
    id?: boolean;
    inscricaoId?: boolean;
    avaliadorId?: boolean;
    nota?: boolean;
    parecer?: boolean;
    avaliadoEm?: boolean;
};
export type AvaliacaoFase2Omit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "inscricaoId" | "avaliadorId" | "nota" | "parecer" | "avaliadoEm", ExtArgs["result"]["avaliacaoFase2"]>;
export type AvaliacaoFase2Include<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    avaliador?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AvaliacaoFase2IncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    avaliador?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AvaliacaoFase2IncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    avaliador?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $AvaliacaoFase2Payload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AvaliacaoFase2";
    objects: {
        inscricao: Prisma.$InscricaoPayload<ExtArgs>;
        avaliador: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        inscricaoId: string;
        avaliadorId: string;
        nota: number;
        parecer: string | null;
        avaliadoEm: Date;
    }, ExtArgs["result"]["avaliacaoFase2"]>;
    composites: {};
};
export type AvaliacaoFase2GetPayload<S extends boolean | null | undefined | AvaliacaoFase2DefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload, S>;
export type AvaliacaoFase2CountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AvaliacaoFase2FindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AvaliacaoFase2CountAggregateInputType | true;
};
export interface AvaliacaoFase2Delegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AvaliacaoFase2'];
        meta: {
            name: 'AvaliacaoFase2';
        };
    };
    findUnique<T extends AvaliacaoFase2FindUniqueArgs>(args: Prisma.SelectSubset<T, AvaliacaoFase2FindUniqueArgs<ExtArgs>>): Prisma.Prisma__AvaliacaoFase2Client<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AvaliacaoFase2FindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AvaliacaoFase2FindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AvaliacaoFase2Client<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AvaliacaoFase2FindFirstArgs>(args?: Prisma.SelectSubset<T, AvaliacaoFase2FindFirstArgs<ExtArgs>>): Prisma.Prisma__AvaliacaoFase2Client<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AvaliacaoFase2FindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AvaliacaoFase2FindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AvaliacaoFase2Client<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AvaliacaoFase2FindManyArgs>(args?: Prisma.SelectSubset<T, AvaliacaoFase2FindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AvaliacaoFase2CreateArgs>(args: Prisma.SelectSubset<T, AvaliacaoFase2CreateArgs<ExtArgs>>): Prisma.Prisma__AvaliacaoFase2Client<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AvaliacaoFase2CreateManyArgs>(args?: Prisma.SelectSubset<T, AvaliacaoFase2CreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AvaliacaoFase2CreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AvaliacaoFase2CreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AvaliacaoFase2DeleteArgs>(args: Prisma.SelectSubset<T, AvaliacaoFase2DeleteArgs<ExtArgs>>): Prisma.Prisma__AvaliacaoFase2Client<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AvaliacaoFase2UpdateArgs>(args: Prisma.SelectSubset<T, AvaliacaoFase2UpdateArgs<ExtArgs>>): Prisma.Prisma__AvaliacaoFase2Client<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AvaliacaoFase2DeleteManyArgs>(args?: Prisma.SelectSubset<T, AvaliacaoFase2DeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AvaliacaoFase2UpdateManyArgs>(args: Prisma.SelectSubset<T, AvaliacaoFase2UpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AvaliacaoFase2UpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AvaliacaoFase2UpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AvaliacaoFase2UpsertArgs>(args: Prisma.SelectSubset<T, AvaliacaoFase2UpsertArgs<ExtArgs>>): Prisma.Prisma__AvaliacaoFase2Client<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AvaliacaoFase2CountArgs>(args?: Prisma.Subset<T, AvaliacaoFase2CountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AvaliacaoFase2CountAggregateOutputType> : number>;
    aggregate<T extends AvaliacaoFase2AggregateArgs>(args: Prisma.Subset<T, AvaliacaoFase2AggregateArgs>): Prisma.PrismaPromise<GetAvaliacaoFase2AggregateType<T>>;
    groupBy<T extends AvaliacaoFase2GroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AvaliacaoFase2GroupByArgs['orderBy'];
    } : {
        orderBy?: AvaliacaoFase2GroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AvaliacaoFase2GroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAvaliacaoFase2GroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AvaliacaoFase2FieldRefs;
}
export interface Prisma__AvaliacaoFase2Client<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    inscricao<T extends Prisma.InscricaoDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.InscricaoDefaultArgs<ExtArgs>>): Prisma.Prisma__InscricaoClient<runtime.Types.Result.GetResult<Prisma.$InscricaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    avaliador<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AvaliacaoFase2FieldRefs {
    readonly id: Prisma.FieldRef<"AvaliacaoFase2", 'String'>;
    readonly inscricaoId: Prisma.FieldRef<"AvaliacaoFase2", 'String'>;
    readonly avaliadorId: Prisma.FieldRef<"AvaliacaoFase2", 'String'>;
    readonly nota: Prisma.FieldRef<"AvaliacaoFase2", 'Float'>;
    readonly parecer: Prisma.FieldRef<"AvaliacaoFase2", 'String'>;
    readonly avaliadoEm: Prisma.FieldRef<"AvaliacaoFase2", 'DateTime'>;
}
export type AvaliacaoFase2FindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
};
export type AvaliacaoFase2FindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
};
export type AvaliacaoFase2FindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
    where?: Prisma.AvaliacaoFase2WhereInput;
    orderBy?: Prisma.AvaliacaoFase2OrderByWithRelationInput | Prisma.AvaliacaoFase2OrderByWithRelationInput[];
    cursor?: Prisma.AvaliacaoFase2WhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AvaliacaoFase2ScalarFieldEnum | Prisma.AvaliacaoFase2ScalarFieldEnum[];
};
export type AvaliacaoFase2FindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
    where?: Prisma.AvaliacaoFase2WhereInput;
    orderBy?: Prisma.AvaliacaoFase2OrderByWithRelationInput | Prisma.AvaliacaoFase2OrderByWithRelationInput[];
    cursor?: Prisma.AvaliacaoFase2WhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AvaliacaoFase2ScalarFieldEnum | Prisma.AvaliacaoFase2ScalarFieldEnum[];
};
export type AvaliacaoFase2FindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
    where?: Prisma.AvaliacaoFase2WhereInput;
    orderBy?: Prisma.AvaliacaoFase2OrderByWithRelationInput | Prisma.AvaliacaoFase2OrderByWithRelationInput[];
    cursor?: Prisma.AvaliacaoFase2WhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AvaliacaoFase2ScalarFieldEnum | Prisma.AvaliacaoFase2ScalarFieldEnum[];
};
export type AvaliacaoFase2CreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AvaliacaoFase2CreateInput, Prisma.AvaliacaoFase2UncheckedCreateInput>;
};
export type AvaliacaoFase2CreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AvaliacaoFase2CreateManyInput | Prisma.AvaliacaoFase2CreateManyInput[];
    skipDuplicates?: boolean;
};
export type AvaliacaoFase2CreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2SelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    data: Prisma.AvaliacaoFase2CreateManyInput | Prisma.AvaliacaoFase2CreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AvaliacaoFase2IncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AvaliacaoFase2UpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AvaliacaoFase2UpdateInput, Prisma.AvaliacaoFase2UncheckedUpdateInput>;
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
};
export type AvaliacaoFase2UpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AvaliacaoFase2UpdateManyMutationInput, Prisma.AvaliacaoFase2UncheckedUpdateManyInput>;
    where?: Prisma.AvaliacaoFase2WhereInput;
    limit?: number;
};
export type AvaliacaoFase2UpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2SelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AvaliacaoFase2UpdateManyMutationInput, Prisma.AvaliacaoFase2UncheckedUpdateManyInput>;
    where?: Prisma.AvaliacaoFase2WhereInput;
    limit?: number;
    include?: Prisma.AvaliacaoFase2IncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AvaliacaoFase2UpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
    create: Prisma.XOR<Prisma.AvaliacaoFase2CreateInput, Prisma.AvaliacaoFase2UncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AvaliacaoFase2UpdateInput, Prisma.AvaliacaoFase2UncheckedUpdateInput>;
};
export type AvaliacaoFase2DeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
    where: Prisma.AvaliacaoFase2WhereUniqueInput;
};
export type AvaliacaoFase2DeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AvaliacaoFase2WhereInput;
    limit?: number;
};
export type AvaliacaoFase2DefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AvaliacaoFase2Select<ExtArgs> | null;
    omit?: Prisma.AvaliacaoFase2Omit<ExtArgs> | null;
    include?: Prisma.AvaliacaoFase2Include<ExtArgs> | null;
};

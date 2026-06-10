import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProvaQuestaoModel = runtime.Types.Result.DefaultSelection<Prisma.$ProvaQuestaoPayload>;
export type AggregateProvaQuestao = {
    _count: ProvaQuestaoCountAggregateOutputType | null;
    _avg: ProvaQuestaoAvgAggregateOutputType | null;
    _sum: ProvaQuestaoSumAggregateOutputType | null;
    _min: ProvaQuestaoMinAggregateOutputType | null;
    _max: ProvaQuestaoMaxAggregateOutputType | null;
};
export type ProvaQuestaoAvgAggregateOutputType = {
    ordem: number | null;
};
export type ProvaQuestaoSumAggregateOutputType = {
    ordem: number | null;
};
export type ProvaQuestaoMinAggregateOutputType = {
    id: string | null;
    provaId: string | null;
    questaoId: string | null;
    ordem: number | null;
};
export type ProvaQuestaoMaxAggregateOutputType = {
    id: string | null;
    provaId: string | null;
    questaoId: string | null;
    ordem: number | null;
};
export type ProvaQuestaoCountAggregateOutputType = {
    id: number;
    provaId: number;
    questaoId: number;
    ordem: number;
    _all: number;
};
export type ProvaQuestaoAvgAggregateInputType = {
    ordem?: true;
};
export type ProvaQuestaoSumAggregateInputType = {
    ordem?: true;
};
export type ProvaQuestaoMinAggregateInputType = {
    id?: true;
    provaId?: true;
    questaoId?: true;
    ordem?: true;
};
export type ProvaQuestaoMaxAggregateInputType = {
    id?: true;
    provaId?: true;
    questaoId?: true;
    ordem?: true;
};
export type ProvaQuestaoCountAggregateInputType = {
    id?: true;
    provaId?: true;
    questaoId?: true;
    ordem?: true;
    _all?: true;
};
export type ProvaQuestaoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProvaQuestaoWhereInput;
    orderBy?: Prisma.ProvaQuestaoOrderByWithRelationInput | Prisma.ProvaQuestaoOrderByWithRelationInput[];
    cursor?: Prisma.ProvaQuestaoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProvaQuestaoCountAggregateInputType;
    _avg?: ProvaQuestaoAvgAggregateInputType;
    _sum?: ProvaQuestaoSumAggregateInputType;
    _min?: ProvaQuestaoMinAggregateInputType;
    _max?: ProvaQuestaoMaxAggregateInputType;
};
export type GetProvaQuestaoAggregateType<T extends ProvaQuestaoAggregateArgs> = {
    [P in keyof T & keyof AggregateProvaQuestao]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProvaQuestao[P]> : Prisma.GetScalarType<T[P], AggregateProvaQuestao[P]>;
};
export type ProvaQuestaoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProvaQuestaoWhereInput;
    orderBy?: Prisma.ProvaQuestaoOrderByWithAggregationInput | Prisma.ProvaQuestaoOrderByWithAggregationInput[];
    by: Prisma.ProvaQuestaoScalarFieldEnum[] | Prisma.ProvaQuestaoScalarFieldEnum;
    having?: Prisma.ProvaQuestaoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProvaQuestaoCountAggregateInputType | true;
    _avg?: ProvaQuestaoAvgAggregateInputType;
    _sum?: ProvaQuestaoSumAggregateInputType;
    _min?: ProvaQuestaoMinAggregateInputType;
    _max?: ProvaQuestaoMaxAggregateInputType;
};
export type ProvaQuestaoGroupByOutputType = {
    id: string;
    provaId: string;
    questaoId: string;
    ordem: number;
    _count: ProvaQuestaoCountAggregateOutputType | null;
    _avg: ProvaQuestaoAvgAggregateOutputType | null;
    _sum: ProvaQuestaoSumAggregateOutputType | null;
    _min: ProvaQuestaoMinAggregateOutputType | null;
    _max: ProvaQuestaoMaxAggregateOutputType | null;
};
export type GetProvaQuestaoGroupByPayload<T extends ProvaQuestaoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProvaQuestaoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProvaQuestaoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProvaQuestaoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProvaQuestaoGroupByOutputType[P]>;
}>>;
export type ProvaQuestaoWhereInput = {
    AND?: Prisma.ProvaQuestaoWhereInput | Prisma.ProvaQuestaoWhereInput[];
    OR?: Prisma.ProvaQuestaoWhereInput[];
    NOT?: Prisma.ProvaQuestaoWhereInput | Prisma.ProvaQuestaoWhereInput[];
    id?: Prisma.StringFilter<"ProvaQuestao"> | string;
    provaId?: Prisma.StringFilter<"ProvaQuestao"> | string;
    questaoId?: Prisma.StringFilter<"ProvaQuestao"> | string;
    ordem?: Prisma.IntFilter<"ProvaQuestao"> | number;
    prova?: Prisma.XOR<Prisma.ProvaScalarRelationFilter, Prisma.ProvaWhereInput>;
    questao?: Prisma.XOR<Prisma.QuestaoScalarRelationFilter, Prisma.QuestaoWhereInput>;
};
export type ProvaQuestaoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
    prova?: Prisma.ProvaOrderByWithRelationInput;
    questao?: Prisma.QuestaoOrderByWithRelationInput;
};
export type ProvaQuestaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    provaId_questaoId?: Prisma.ProvaQuestaoProvaIdQuestaoIdCompoundUniqueInput;
    provaId_ordem?: Prisma.ProvaQuestaoProvaIdOrdemCompoundUniqueInput;
    AND?: Prisma.ProvaQuestaoWhereInput | Prisma.ProvaQuestaoWhereInput[];
    OR?: Prisma.ProvaQuestaoWhereInput[];
    NOT?: Prisma.ProvaQuestaoWhereInput | Prisma.ProvaQuestaoWhereInput[];
    provaId?: Prisma.StringFilter<"ProvaQuestao"> | string;
    questaoId?: Prisma.StringFilter<"ProvaQuestao"> | string;
    ordem?: Prisma.IntFilter<"ProvaQuestao"> | number;
    prova?: Prisma.XOR<Prisma.ProvaScalarRelationFilter, Prisma.ProvaWhereInput>;
    questao?: Prisma.XOR<Prisma.QuestaoScalarRelationFilter, Prisma.QuestaoWhereInput>;
}, "id" | "provaId_questaoId" | "provaId_ordem">;
export type ProvaQuestaoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
    _count?: Prisma.ProvaQuestaoCountOrderByAggregateInput;
    _avg?: Prisma.ProvaQuestaoAvgOrderByAggregateInput;
    _max?: Prisma.ProvaQuestaoMaxOrderByAggregateInput;
    _min?: Prisma.ProvaQuestaoMinOrderByAggregateInput;
    _sum?: Prisma.ProvaQuestaoSumOrderByAggregateInput;
};
export type ProvaQuestaoScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProvaQuestaoScalarWhereWithAggregatesInput | Prisma.ProvaQuestaoScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProvaQuestaoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProvaQuestaoScalarWhereWithAggregatesInput | Prisma.ProvaQuestaoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProvaQuestao"> | string;
    provaId?: Prisma.StringWithAggregatesFilter<"ProvaQuestao"> | string;
    questaoId?: Prisma.StringWithAggregatesFilter<"ProvaQuestao"> | string;
    ordem?: Prisma.IntWithAggregatesFilter<"ProvaQuestao"> | number;
};
export type ProvaQuestaoCreateInput = {
    id?: string;
    ordem: number;
    prova: Prisma.ProvaCreateNestedOneWithoutQuestoesInput;
    questao: Prisma.QuestaoCreateNestedOneWithoutProvasInput;
};
export type ProvaQuestaoUncheckedCreateInput = {
    id?: string;
    provaId: string;
    questaoId: string;
    ordem: number;
};
export type ProvaQuestaoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
    prova?: Prisma.ProvaUpdateOneRequiredWithoutQuestoesNestedInput;
    questao?: Prisma.QuestaoUpdateOneRequiredWithoutProvasNestedInput;
};
export type ProvaQuestaoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ProvaQuestaoCreateManyInput = {
    id?: string;
    provaId: string;
    questaoId: string;
    ordem: number;
};
export type ProvaQuestaoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ProvaQuestaoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ProvaQuestaoListRelationFilter = {
    every?: Prisma.ProvaQuestaoWhereInput;
    some?: Prisma.ProvaQuestaoWhereInput;
    none?: Prisma.ProvaQuestaoWhereInput;
};
export type ProvaQuestaoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProvaQuestaoProvaIdQuestaoIdCompoundUniqueInput = {
    provaId: string;
    questaoId: string;
};
export type ProvaQuestaoProvaIdOrdemCompoundUniqueInput = {
    provaId: string;
    ordem: number;
};
export type ProvaQuestaoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
};
export type ProvaQuestaoAvgOrderByAggregateInput = {
    ordem?: Prisma.SortOrder;
};
export type ProvaQuestaoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
};
export type ProvaQuestaoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
};
export type ProvaQuestaoSumOrderByAggregateInput = {
    ordem?: Prisma.SortOrder;
};
export type ProvaQuestaoCreateNestedManyWithoutProvaInput = {
    create?: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutProvaInput, Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput> | Prisma.ProvaQuestaoCreateWithoutProvaInput[] | Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput[];
    connectOrCreate?: Prisma.ProvaQuestaoCreateOrConnectWithoutProvaInput | Prisma.ProvaQuestaoCreateOrConnectWithoutProvaInput[];
    createMany?: Prisma.ProvaQuestaoCreateManyProvaInputEnvelope;
    connect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
};
export type ProvaQuestaoUncheckedCreateNestedManyWithoutProvaInput = {
    create?: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutProvaInput, Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput> | Prisma.ProvaQuestaoCreateWithoutProvaInput[] | Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput[];
    connectOrCreate?: Prisma.ProvaQuestaoCreateOrConnectWithoutProvaInput | Prisma.ProvaQuestaoCreateOrConnectWithoutProvaInput[];
    createMany?: Prisma.ProvaQuestaoCreateManyProvaInputEnvelope;
    connect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
};
export type ProvaQuestaoUpdateManyWithoutProvaNestedInput = {
    create?: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutProvaInput, Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput> | Prisma.ProvaQuestaoCreateWithoutProvaInput[] | Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput[];
    connectOrCreate?: Prisma.ProvaQuestaoCreateOrConnectWithoutProvaInput | Prisma.ProvaQuestaoCreateOrConnectWithoutProvaInput[];
    upsert?: Prisma.ProvaQuestaoUpsertWithWhereUniqueWithoutProvaInput | Prisma.ProvaQuestaoUpsertWithWhereUniqueWithoutProvaInput[];
    createMany?: Prisma.ProvaQuestaoCreateManyProvaInputEnvelope;
    set?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    disconnect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    delete?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    connect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    update?: Prisma.ProvaQuestaoUpdateWithWhereUniqueWithoutProvaInput | Prisma.ProvaQuestaoUpdateWithWhereUniqueWithoutProvaInput[];
    updateMany?: Prisma.ProvaQuestaoUpdateManyWithWhereWithoutProvaInput | Prisma.ProvaQuestaoUpdateManyWithWhereWithoutProvaInput[];
    deleteMany?: Prisma.ProvaQuestaoScalarWhereInput | Prisma.ProvaQuestaoScalarWhereInput[];
};
export type ProvaQuestaoUncheckedUpdateManyWithoutProvaNestedInput = {
    create?: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutProvaInput, Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput> | Prisma.ProvaQuestaoCreateWithoutProvaInput[] | Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput[];
    connectOrCreate?: Prisma.ProvaQuestaoCreateOrConnectWithoutProvaInput | Prisma.ProvaQuestaoCreateOrConnectWithoutProvaInput[];
    upsert?: Prisma.ProvaQuestaoUpsertWithWhereUniqueWithoutProvaInput | Prisma.ProvaQuestaoUpsertWithWhereUniqueWithoutProvaInput[];
    createMany?: Prisma.ProvaQuestaoCreateManyProvaInputEnvelope;
    set?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    disconnect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    delete?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    connect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    update?: Prisma.ProvaQuestaoUpdateWithWhereUniqueWithoutProvaInput | Prisma.ProvaQuestaoUpdateWithWhereUniqueWithoutProvaInput[];
    updateMany?: Prisma.ProvaQuestaoUpdateManyWithWhereWithoutProvaInput | Prisma.ProvaQuestaoUpdateManyWithWhereWithoutProvaInput[];
    deleteMany?: Prisma.ProvaQuestaoScalarWhereInput | Prisma.ProvaQuestaoScalarWhereInput[];
};
export type ProvaQuestaoCreateNestedManyWithoutQuestaoInput = {
    create?: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutQuestaoInput, Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput> | Prisma.ProvaQuestaoCreateWithoutQuestaoInput[] | Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput[];
    connectOrCreate?: Prisma.ProvaQuestaoCreateOrConnectWithoutQuestaoInput | Prisma.ProvaQuestaoCreateOrConnectWithoutQuestaoInput[];
    createMany?: Prisma.ProvaQuestaoCreateManyQuestaoInputEnvelope;
    connect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
};
export type ProvaQuestaoUncheckedCreateNestedManyWithoutQuestaoInput = {
    create?: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutQuestaoInput, Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput> | Prisma.ProvaQuestaoCreateWithoutQuestaoInput[] | Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput[];
    connectOrCreate?: Prisma.ProvaQuestaoCreateOrConnectWithoutQuestaoInput | Prisma.ProvaQuestaoCreateOrConnectWithoutQuestaoInput[];
    createMany?: Prisma.ProvaQuestaoCreateManyQuestaoInputEnvelope;
    connect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
};
export type ProvaQuestaoUpdateManyWithoutQuestaoNestedInput = {
    create?: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutQuestaoInput, Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput> | Prisma.ProvaQuestaoCreateWithoutQuestaoInput[] | Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput[];
    connectOrCreate?: Prisma.ProvaQuestaoCreateOrConnectWithoutQuestaoInput | Prisma.ProvaQuestaoCreateOrConnectWithoutQuestaoInput[];
    upsert?: Prisma.ProvaQuestaoUpsertWithWhereUniqueWithoutQuestaoInput | Prisma.ProvaQuestaoUpsertWithWhereUniqueWithoutQuestaoInput[];
    createMany?: Prisma.ProvaQuestaoCreateManyQuestaoInputEnvelope;
    set?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    disconnect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    delete?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    connect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    update?: Prisma.ProvaQuestaoUpdateWithWhereUniqueWithoutQuestaoInput | Prisma.ProvaQuestaoUpdateWithWhereUniqueWithoutQuestaoInput[];
    updateMany?: Prisma.ProvaQuestaoUpdateManyWithWhereWithoutQuestaoInput | Prisma.ProvaQuestaoUpdateManyWithWhereWithoutQuestaoInput[];
    deleteMany?: Prisma.ProvaQuestaoScalarWhereInput | Prisma.ProvaQuestaoScalarWhereInput[];
};
export type ProvaQuestaoUncheckedUpdateManyWithoutQuestaoNestedInput = {
    create?: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutQuestaoInput, Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput> | Prisma.ProvaQuestaoCreateWithoutQuestaoInput[] | Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput[];
    connectOrCreate?: Prisma.ProvaQuestaoCreateOrConnectWithoutQuestaoInput | Prisma.ProvaQuestaoCreateOrConnectWithoutQuestaoInput[];
    upsert?: Prisma.ProvaQuestaoUpsertWithWhereUniqueWithoutQuestaoInput | Prisma.ProvaQuestaoUpsertWithWhereUniqueWithoutQuestaoInput[];
    createMany?: Prisma.ProvaQuestaoCreateManyQuestaoInputEnvelope;
    set?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    disconnect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    delete?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    connect?: Prisma.ProvaQuestaoWhereUniqueInput | Prisma.ProvaQuestaoWhereUniqueInput[];
    update?: Prisma.ProvaQuestaoUpdateWithWhereUniqueWithoutQuestaoInput | Prisma.ProvaQuestaoUpdateWithWhereUniqueWithoutQuestaoInput[];
    updateMany?: Prisma.ProvaQuestaoUpdateManyWithWhereWithoutQuestaoInput | Prisma.ProvaQuestaoUpdateManyWithWhereWithoutQuestaoInput[];
    deleteMany?: Prisma.ProvaQuestaoScalarWhereInput | Prisma.ProvaQuestaoScalarWhereInput[];
};
export type ProvaQuestaoCreateWithoutProvaInput = {
    id?: string;
    ordem: number;
    questao: Prisma.QuestaoCreateNestedOneWithoutProvasInput;
};
export type ProvaQuestaoUncheckedCreateWithoutProvaInput = {
    id?: string;
    questaoId: string;
    ordem: number;
};
export type ProvaQuestaoCreateOrConnectWithoutProvaInput = {
    where: Prisma.ProvaQuestaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutProvaInput, Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput>;
};
export type ProvaQuestaoCreateManyProvaInputEnvelope = {
    data: Prisma.ProvaQuestaoCreateManyProvaInput | Prisma.ProvaQuestaoCreateManyProvaInput[];
    skipDuplicates?: boolean;
};
export type ProvaQuestaoUpsertWithWhereUniqueWithoutProvaInput = {
    where: Prisma.ProvaQuestaoWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProvaQuestaoUpdateWithoutProvaInput, Prisma.ProvaQuestaoUncheckedUpdateWithoutProvaInput>;
    create: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutProvaInput, Prisma.ProvaQuestaoUncheckedCreateWithoutProvaInput>;
};
export type ProvaQuestaoUpdateWithWhereUniqueWithoutProvaInput = {
    where: Prisma.ProvaQuestaoWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProvaQuestaoUpdateWithoutProvaInput, Prisma.ProvaQuestaoUncheckedUpdateWithoutProvaInput>;
};
export type ProvaQuestaoUpdateManyWithWhereWithoutProvaInput = {
    where: Prisma.ProvaQuestaoScalarWhereInput;
    data: Prisma.XOR<Prisma.ProvaQuestaoUpdateManyMutationInput, Prisma.ProvaQuestaoUncheckedUpdateManyWithoutProvaInput>;
};
export type ProvaQuestaoScalarWhereInput = {
    AND?: Prisma.ProvaQuestaoScalarWhereInput | Prisma.ProvaQuestaoScalarWhereInput[];
    OR?: Prisma.ProvaQuestaoScalarWhereInput[];
    NOT?: Prisma.ProvaQuestaoScalarWhereInput | Prisma.ProvaQuestaoScalarWhereInput[];
    id?: Prisma.StringFilter<"ProvaQuestao"> | string;
    provaId?: Prisma.StringFilter<"ProvaQuestao"> | string;
    questaoId?: Prisma.StringFilter<"ProvaQuestao"> | string;
    ordem?: Prisma.IntFilter<"ProvaQuestao"> | number;
};
export type ProvaQuestaoCreateWithoutQuestaoInput = {
    id?: string;
    ordem: number;
    prova: Prisma.ProvaCreateNestedOneWithoutQuestoesInput;
};
export type ProvaQuestaoUncheckedCreateWithoutQuestaoInput = {
    id?: string;
    provaId: string;
    ordem: number;
};
export type ProvaQuestaoCreateOrConnectWithoutQuestaoInput = {
    where: Prisma.ProvaQuestaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutQuestaoInput, Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput>;
};
export type ProvaQuestaoCreateManyQuestaoInputEnvelope = {
    data: Prisma.ProvaQuestaoCreateManyQuestaoInput | Prisma.ProvaQuestaoCreateManyQuestaoInput[];
    skipDuplicates?: boolean;
};
export type ProvaQuestaoUpsertWithWhereUniqueWithoutQuestaoInput = {
    where: Prisma.ProvaQuestaoWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProvaQuestaoUpdateWithoutQuestaoInput, Prisma.ProvaQuestaoUncheckedUpdateWithoutQuestaoInput>;
    create: Prisma.XOR<Prisma.ProvaQuestaoCreateWithoutQuestaoInput, Prisma.ProvaQuestaoUncheckedCreateWithoutQuestaoInput>;
};
export type ProvaQuestaoUpdateWithWhereUniqueWithoutQuestaoInput = {
    where: Prisma.ProvaQuestaoWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProvaQuestaoUpdateWithoutQuestaoInput, Prisma.ProvaQuestaoUncheckedUpdateWithoutQuestaoInput>;
};
export type ProvaQuestaoUpdateManyWithWhereWithoutQuestaoInput = {
    where: Prisma.ProvaQuestaoScalarWhereInput;
    data: Prisma.XOR<Prisma.ProvaQuestaoUpdateManyMutationInput, Prisma.ProvaQuestaoUncheckedUpdateManyWithoutQuestaoInput>;
};
export type ProvaQuestaoCreateManyProvaInput = {
    id?: string;
    questaoId: string;
    ordem: number;
};
export type ProvaQuestaoUpdateWithoutProvaInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
    questao?: Prisma.QuestaoUpdateOneRequiredWithoutProvasNestedInput;
};
export type ProvaQuestaoUncheckedUpdateWithoutProvaInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ProvaQuestaoUncheckedUpdateManyWithoutProvaInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ProvaQuestaoCreateManyQuestaoInput = {
    id?: string;
    provaId: string;
    ordem: number;
};
export type ProvaQuestaoUpdateWithoutQuestaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
    prova?: Prisma.ProvaUpdateOneRequiredWithoutQuestoesNestedInput;
};
export type ProvaQuestaoUncheckedUpdateWithoutQuestaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ProvaQuestaoUncheckedUpdateManyWithoutQuestaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ProvaQuestaoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    provaId?: boolean;
    questaoId?: boolean;
    ordem?: boolean;
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["provaQuestao"]>;
export type ProvaQuestaoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    provaId?: boolean;
    questaoId?: boolean;
    ordem?: boolean;
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["provaQuestao"]>;
export type ProvaQuestaoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    provaId?: boolean;
    questaoId?: boolean;
    ordem?: boolean;
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["provaQuestao"]>;
export type ProvaQuestaoSelectScalar = {
    id?: boolean;
    provaId?: boolean;
    questaoId?: boolean;
    ordem?: boolean;
};
export type ProvaQuestaoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "provaId" | "questaoId" | "ordem", ExtArgs["result"]["provaQuestao"]>;
export type ProvaQuestaoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
};
export type ProvaQuestaoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
};
export type ProvaQuestaoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
};
export type $ProvaQuestaoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProvaQuestao";
    objects: {
        prova: Prisma.$ProvaPayload<ExtArgs>;
        questao: Prisma.$QuestaoPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        provaId: string;
        questaoId: string;
        ordem: number;
    }, ExtArgs["result"]["provaQuestao"]>;
    composites: {};
};
export type ProvaQuestaoGetPayload<S extends boolean | null | undefined | ProvaQuestaoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload, S>;
export type ProvaQuestaoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProvaQuestaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProvaQuestaoCountAggregateInputType | true;
};
export interface ProvaQuestaoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProvaQuestao'];
        meta: {
            name: 'ProvaQuestao';
        };
    };
    findUnique<T extends ProvaQuestaoFindUniqueArgs>(args: Prisma.SelectSubset<T, ProvaQuestaoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProvaQuestaoClient<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProvaQuestaoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProvaQuestaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProvaQuestaoClient<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProvaQuestaoFindFirstArgs>(args?: Prisma.SelectSubset<T, ProvaQuestaoFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProvaQuestaoClient<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProvaQuestaoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProvaQuestaoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProvaQuestaoClient<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProvaQuestaoFindManyArgs>(args?: Prisma.SelectSubset<T, ProvaQuestaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProvaQuestaoCreateArgs>(args: Prisma.SelectSubset<T, ProvaQuestaoCreateArgs<ExtArgs>>): Prisma.Prisma__ProvaQuestaoClient<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProvaQuestaoCreateManyArgs>(args?: Prisma.SelectSubset<T, ProvaQuestaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProvaQuestaoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProvaQuestaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProvaQuestaoDeleteArgs>(args: Prisma.SelectSubset<T, ProvaQuestaoDeleteArgs<ExtArgs>>): Prisma.Prisma__ProvaQuestaoClient<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProvaQuestaoUpdateArgs>(args: Prisma.SelectSubset<T, ProvaQuestaoUpdateArgs<ExtArgs>>): Prisma.Prisma__ProvaQuestaoClient<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProvaQuestaoDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProvaQuestaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProvaQuestaoUpdateManyArgs>(args: Prisma.SelectSubset<T, ProvaQuestaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProvaQuestaoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProvaQuestaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProvaQuestaoUpsertArgs>(args: Prisma.SelectSubset<T, ProvaQuestaoUpsertArgs<ExtArgs>>): Prisma.Prisma__ProvaQuestaoClient<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProvaQuestaoCountArgs>(args?: Prisma.Subset<T, ProvaQuestaoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProvaQuestaoCountAggregateOutputType> : number>;
    aggregate<T extends ProvaQuestaoAggregateArgs>(args: Prisma.Subset<T, ProvaQuestaoAggregateArgs>): Prisma.PrismaPromise<GetProvaQuestaoAggregateType<T>>;
    groupBy<T extends ProvaQuestaoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProvaQuestaoGroupByArgs['orderBy'];
    } : {
        orderBy?: ProvaQuestaoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProvaQuestaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProvaQuestaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProvaQuestaoFieldRefs;
}
export interface Prisma__ProvaQuestaoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    prova<T extends Prisma.ProvaDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProvaDefaultArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    questao<T extends Prisma.QuestaoDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.QuestaoDefaultArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProvaQuestaoFieldRefs {
    readonly id: Prisma.FieldRef<"ProvaQuestao", 'String'>;
    readonly provaId: Prisma.FieldRef<"ProvaQuestao", 'String'>;
    readonly questaoId: Prisma.FieldRef<"ProvaQuestao", 'String'>;
    readonly ordem: Prisma.FieldRef<"ProvaQuestao", 'Int'>;
}
export type ProvaQuestaoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
    where: Prisma.ProvaQuestaoWhereUniqueInput;
};
export type ProvaQuestaoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
    where: Prisma.ProvaQuestaoWhereUniqueInput;
};
export type ProvaQuestaoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
    where?: Prisma.ProvaQuestaoWhereInput;
    orderBy?: Prisma.ProvaQuestaoOrderByWithRelationInput | Prisma.ProvaQuestaoOrderByWithRelationInput[];
    cursor?: Prisma.ProvaQuestaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProvaQuestaoScalarFieldEnum | Prisma.ProvaQuestaoScalarFieldEnum[];
};
export type ProvaQuestaoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
    where?: Prisma.ProvaQuestaoWhereInput;
    orderBy?: Prisma.ProvaQuestaoOrderByWithRelationInput | Prisma.ProvaQuestaoOrderByWithRelationInput[];
    cursor?: Prisma.ProvaQuestaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProvaQuestaoScalarFieldEnum | Prisma.ProvaQuestaoScalarFieldEnum[];
};
export type ProvaQuestaoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
    where?: Prisma.ProvaQuestaoWhereInput;
    orderBy?: Prisma.ProvaQuestaoOrderByWithRelationInput | Prisma.ProvaQuestaoOrderByWithRelationInput[];
    cursor?: Prisma.ProvaQuestaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProvaQuestaoScalarFieldEnum | Prisma.ProvaQuestaoScalarFieldEnum[];
};
export type ProvaQuestaoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProvaQuestaoCreateInput, Prisma.ProvaQuestaoUncheckedCreateInput>;
};
export type ProvaQuestaoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProvaQuestaoCreateManyInput | Prisma.ProvaQuestaoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProvaQuestaoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    data: Prisma.ProvaQuestaoCreateManyInput | Prisma.ProvaQuestaoCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProvaQuestaoIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProvaQuestaoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProvaQuestaoUpdateInput, Prisma.ProvaQuestaoUncheckedUpdateInput>;
    where: Prisma.ProvaQuestaoWhereUniqueInput;
};
export type ProvaQuestaoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProvaQuestaoUpdateManyMutationInput, Prisma.ProvaQuestaoUncheckedUpdateManyInput>;
    where?: Prisma.ProvaQuestaoWhereInput;
    limit?: number;
};
export type ProvaQuestaoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProvaQuestaoUpdateManyMutationInput, Prisma.ProvaQuestaoUncheckedUpdateManyInput>;
    where?: Prisma.ProvaQuestaoWhereInput;
    limit?: number;
    include?: Prisma.ProvaQuestaoIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProvaQuestaoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
    where: Prisma.ProvaQuestaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProvaQuestaoCreateInput, Prisma.ProvaQuestaoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProvaQuestaoUpdateInput, Prisma.ProvaQuestaoUncheckedUpdateInput>;
};
export type ProvaQuestaoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
    where: Prisma.ProvaQuestaoWhereUniqueInput;
};
export type ProvaQuestaoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProvaQuestaoWhereInput;
    limit?: number;
};
export type ProvaQuestaoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaQuestaoSelect<ExtArgs> | null;
    omit?: Prisma.ProvaQuestaoOmit<ExtArgs> | null;
    include?: Prisma.ProvaQuestaoInclude<ExtArgs> | null;
};

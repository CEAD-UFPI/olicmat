import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RespostaModel = runtime.Types.Result.DefaultSelection<Prisma.$RespostaPayload>;
export type AggregateResposta = {
    _count: RespostaCountAggregateOutputType | null;
    _min: RespostaMinAggregateOutputType | null;
    _max: RespostaMaxAggregateOutputType | null;
};
export type RespostaMinAggregateOutputType = {
    id: string | null;
    inscricaoId: string | null;
    provaId: string | null;
    questaoId: string | null;
    alternativaMarcada: string | null;
    correta: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RespostaMaxAggregateOutputType = {
    id: string | null;
    inscricaoId: string | null;
    provaId: string | null;
    questaoId: string | null;
    alternativaMarcada: string | null;
    correta: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RespostaCountAggregateOutputType = {
    id: number;
    inscricaoId: number;
    provaId: number;
    questaoId: number;
    alternativaMarcada: number;
    correta: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type RespostaMinAggregateInputType = {
    id?: true;
    inscricaoId?: true;
    provaId?: true;
    questaoId?: true;
    alternativaMarcada?: true;
    correta?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RespostaMaxAggregateInputType = {
    id?: true;
    inscricaoId?: true;
    provaId?: true;
    questaoId?: true;
    alternativaMarcada?: true;
    correta?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RespostaCountAggregateInputType = {
    id?: true;
    inscricaoId?: true;
    provaId?: true;
    questaoId?: true;
    alternativaMarcada?: true;
    correta?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type RespostaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RespostaWhereInput;
    orderBy?: Prisma.RespostaOrderByWithRelationInput | Prisma.RespostaOrderByWithRelationInput[];
    cursor?: Prisma.RespostaWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RespostaCountAggregateInputType;
    _min?: RespostaMinAggregateInputType;
    _max?: RespostaMaxAggregateInputType;
};
export type GetRespostaAggregateType<T extends RespostaAggregateArgs> = {
    [P in keyof T & keyof AggregateResposta]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateResposta[P]> : Prisma.GetScalarType<T[P], AggregateResposta[P]>;
};
export type RespostaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RespostaWhereInput;
    orderBy?: Prisma.RespostaOrderByWithAggregationInput | Prisma.RespostaOrderByWithAggregationInput[];
    by: Prisma.RespostaScalarFieldEnum[] | Prisma.RespostaScalarFieldEnum;
    having?: Prisma.RespostaScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RespostaCountAggregateInputType | true;
    _min?: RespostaMinAggregateInputType;
    _max?: RespostaMaxAggregateInputType;
};
export type RespostaGroupByOutputType = {
    id: string;
    inscricaoId: string;
    provaId: string;
    questaoId: string;
    alternativaMarcada: string;
    correta: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: RespostaCountAggregateOutputType | null;
    _min: RespostaMinAggregateOutputType | null;
    _max: RespostaMaxAggregateOutputType | null;
};
export type GetRespostaGroupByPayload<T extends RespostaGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RespostaGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RespostaGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RespostaGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RespostaGroupByOutputType[P]>;
}>>;
export type RespostaWhereInput = {
    AND?: Prisma.RespostaWhereInput | Prisma.RespostaWhereInput[];
    OR?: Prisma.RespostaWhereInput[];
    NOT?: Prisma.RespostaWhereInput | Prisma.RespostaWhereInput[];
    id?: Prisma.StringFilter<"Resposta"> | string;
    inscricaoId?: Prisma.StringFilter<"Resposta"> | string;
    provaId?: Prisma.StringFilter<"Resposta"> | string;
    questaoId?: Prisma.StringFilter<"Resposta"> | string;
    alternativaMarcada?: Prisma.StringFilter<"Resposta"> | string;
    correta?: Prisma.BoolFilter<"Resposta"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Resposta"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Resposta"> | Date | string;
    inscricao?: Prisma.XOR<Prisma.InscricaoScalarRelationFilter, Prisma.InscricaoWhereInput>;
    prova?: Prisma.XOR<Prisma.ProvaScalarRelationFilter, Prisma.ProvaWhereInput>;
    questao?: Prisma.XOR<Prisma.QuestaoScalarRelationFilter, Prisma.QuestaoWhereInput>;
};
export type RespostaOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    alternativaMarcada?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    inscricao?: Prisma.InscricaoOrderByWithRelationInput;
    prova?: Prisma.ProvaOrderByWithRelationInput;
    questao?: Prisma.QuestaoOrderByWithRelationInput;
};
export type RespostaWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    inscricaoId_provaId_questaoId?: Prisma.RespostaInscricaoIdProvaIdQuestaoIdCompoundUniqueInput;
    AND?: Prisma.RespostaWhereInput | Prisma.RespostaWhereInput[];
    OR?: Prisma.RespostaWhereInput[];
    NOT?: Prisma.RespostaWhereInput | Prisma.RespostaWhereInput[];
    inscricaoId?: Prisma.StringFilter<"Resposta"> | string;
    provaId?: Prisma.StringFilter<"Resposta"> | string;
    questaoId?: Prisma.StringFilter<"Resposta"> | string;
    alternativaMarcada?: Prisma.StringFilter<"Resposta"> | string;
    correta?: Prisma.BoolFilter<"Resposta"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Resposta"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Resposta"> | Date | string;
    inscricao?: Prisma.XOR<Prisma.InscricaoScalarRelationFilter, Prisma.InscricaoWhereInput>;
    prova?: Prisma.XOR<Prisma.ProvaScalarRelationFilter, Prisma.ProvaWhereInput>;
    questao?: Prisma.XOR<Prisma.QuestaoScalarRelationFilter, Prisma.QuestaoWhereInput>;
}, "id" | "inscricaoId_provaId_questaoId">;
export type RespostaOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    alternativaMarcada?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RespostaCountOrderByAggregateInput;
    _max?: Prisma.RespostaMaxOrderByAggregateInput;
    _min?: Prisma.RespostaMinOrderByAggregateInput;
};
export type RespostaScalarWhereWithAggregatesInput = {
    AND?: Prisma.RespostaScalarWhereWithAggregatesInput | Prisma.RespostaScalarWhereWithAggregatesInput[];
    OR?: Prisma.RespostaScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RespostaScalarWhereWithAggregatesInput | Prisma.RespostaScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Resposta"> | string;
    inscricaoId?: Prisma.StringWithAggregatesFilter<"Resposta"> | string;
    provaId?: Prisma.StringWithAggregatesFilter<"Resposta"> | string;
    questaoId?: Prisma.StringWithAggregatesFilter<"Resposta"> | string;
    alternativaMarcada?: Prisma.StringWithAggregatesFilter<"Resposta"> | string;
    correta?: Prisma.BoolWithAggregatesFilter<"Resposta"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Resposta"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Resposta"> | Date | string;
};
export type RespostaCreateInput = {
    id?: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao: Prisma.InscricaoCreateNestedOneWithoutRespostasInput;
    prova: Prisma.ProvaCreateNestedOneWithoutRespostasInput;
    questao: Prisma.QuestaoCreateNestedOneWithoutRespostasInput;
};
export type RespostaUncheckedCreateInput = {
    id?: string;
    inscricaoId: string;
    provaId: string;
    questaoId: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RespostaUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneRequiredWithoutRespostasNestedInput;
    prova?: Prisma.ProvaUpdateOneRequiredWithoutRespostasNestedInput;
    questao?: Prisma.QuestaoUpdateOneRequiredWithoutRespostasNestedInput;
};
export type RespostaUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RespostaCreateManyInput = {
    id?: string;
    inscricaoId: string;
    provaId: string;
    questaoId: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RespostaUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RespostaUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RespostaListRelationFilter = {
    every?: Prisma.RespostaWhereInput;
    some?: Prisma.RespostaWhereInput;
    none?: Prisma.RespostaWhereInput;
};
export type RespostaOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RespostaInscricaoIdProvaIdQuestaoIdCompoundUniqueInput = {
    inscricaoId: string;
    provaId: string;
    questaoId: string;
};
export type RespostaCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    alternativaMarcada?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RespostaMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    alternativaMarcada?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RespostaMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inscricaoId?: Prisma.SortOrder;
    provaId?: Prisma.SortOrder;
    questaoId?: Prisma.SortOrder;
    alternativaMarcada?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RespostaCreateNestedManyWithoutInscricaoInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutInscricaoInput, Prisma.RespostaUncheckedCreateWithoutInscricaoInput> | Prisma.RespostaCreateWithoutInscricaoInput[] | Prisma.RespostaUncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutInscricaoInput | Prisma.RespostaCreateOrConnectWithoutInscricaoInput[];
    createMany?: Prisma.RespostaCreateManyInscricaoInputEnvelope;
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
};
export type RespostaUncheckedCreateNestedManyWithoutInscricaoInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutInscricaoInput, Prisma.RespostaUncheckedCreateWithoutInscricaoInput> | Prisma.RespostaCreateWithoutInscricaoInput[] | Prisma.RespostaUncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutInscricaoInput | Prisma.RespostaCreateOrConnectWithoutInscricaoInput[];
    createMany?: Prisma.RespostaCreateManyInscricaoInputEnvelope;
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
};
export type RespostaUpdateManyWithoutInscricaoNestedInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutInscricaoInput, Prisma.RespostaUncheckedCreateWithoutInscricaoInput> | Prisma.RespostaCreateWithoutInscricaoInput[] | Prisma.RespostaUncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutInscricaoInput | Prisma.RespostaCreateOrConnectWithoutInscricaoInput[];
    upsert?: Prisma.RespostaUpsertWithWhereUniqueWithoutInscricaoInput | Prisma.RespostaUpsertWithWhereUniqueWithoutInscricaoInput[];
    createMany?: Prisma.RespostaCreateManyInscricaoInputEnvelope;
    set?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    disconnect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    delete?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    update?: Prisma.RespostaUpdateWithWhereUniqueWithoutInscricaoInput | Prisma.RespostaUpdateWithWhereUniqueWithoutInscricaoInput[];
    updateMany?: Prisma.RespostaUpdateManyWithWhereWithoutInscricaoInput | Prisma.RespostaUpdateManyWithWhereWithoutInscricaoInput[];
    deleteMany?: Prisma.RespostaScalarWhereInput | Prisma.RespostaScalarWhereInput[];
};
export type RespostaUncheckedUpdateManyWithoutInscricaoNestedInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutInscricaoInput, Prisma.RespostaUncheckedCreateWithoutInscricaoInput> | Prisma.RespostaCreateWithoutInscricaoInput[] | Prisma.RespostaUncheckedCreateWithoutInscricaoInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutInscricaoInput | Prisma.RespostaCreateOrConnectWithoutInscricaoInput[];
    upsert?: Prisma.RespostaUpsertWithWhereUniqueWithoutInscricaoInput | Prisma.RespostaUpsertWithWhereUniqueWithoutInscricaoInput[];
    createMany?: Prisma.RespostaCreateManyInscricaoInputEnvelope;
    set?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    disconnect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    delete?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    update?: Prisma.RespostaUpdateWithWhereUniqueWithoutInscricaoInput | Prisma.RespostaUpdateWithWhereUniqueWithoutInscricaoInput[];
    updateMany?: Prisma.RespostaUpdateManyWithWhereWithoutInscricaoInput | Prisma.RespostaUpdateManyWithWhereWithoutInscricaoInput[];
    deleteMany?: Prisma.RespostaScalarWhereInput | Prisma.RespostaScalarWhereInput[];
};
export type RespostaCreateNestedManyWithoutProvaInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutProvaInput, Prisma.RespostaUncheckedCreateWithoutProvaInput> | Prisma.RespostaCreateWithoutProvaInput[] | Prisma.RespostaUncheckedCreateWithoutProvaInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutProvaInput | Prisma.RespostaCreateOrConnectWithoutProvaInput[];
    createMany?: Prisma.RespostaCreateManyProvaInputEnvelope;
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
};
export type RespostaUncheckedCreateNestedManyWithoutProvaInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutProvaInput, Prisma.RespostaUncheckedCreateWithoutProvaInput> | Prisma.RespostaCreateWithoutProvaInput[] | Prisma.RespostaUncheckedCreateWithoutProvaInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutProvaInput | Prisma.RespostaCreateOrConnectWithoutProvaInput[];
    createMany?: Prisma.RespostaCreateManyProvaInputEnvelope;
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
};
export type RespostaUpdateManyWithoutProvaNestedInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutProvaInput, Prisma.RespostaUncheckedCreateWithoutProvaInput> | Prisma.RespostaCreateWithoutProvaInput[] | Prisma.RespostaUncheckedCreateWithoutProvaInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutProvaInput | Prisma.RespostaCreateOrConnectWithoutProvaInput[];
    upsert?: Prisma.RespostaUpsertWithWhereUniqueWithoutProvaInput | Prisma.RespostaUpsertWithWhereUniqueWithoutProvaInput[];
    createMany?: Prisma.RespostaCreateManyProvaInputEnvelope;
    set?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    disconnect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    delete?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    update?: Prisma.RespostaUpdateWithWhereUniqueWithoutProvaInput | Prisma.RespostaUpdateWithWhereUniqueWithoutProvaInput[];
    updateMany?: Prisma.RespostaUpdateManyWithWhereWithoutProvaInput | Prisma.RespostaUpdateManyWithWhereWithoutProvaInput[];
    deleteMany?: Prisma.RespostaScalarWhereInput | Prisma.RespostaScalarWhereInput[];
};
export type RespostaUncheckedUpdateManyWithoutProvaNestedInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutProvaInput, Prisma.RespostaUncheckedCreateWithoutProvaInput> | Prisma.RespostaCreateWithoutProvaInput[] | Prisma.RespostaUncheckedCreateWithoutProvaInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutProvaInput | Prisma.RespostaCreateOrConnectWithoutProvaInput[];
    upsert?: Prisma.RespostaUpsertWithWhereUniqueWithoutProvaInput | Prisma.RespostaUpsertWithWhereUniqueWithoutProvaInput[];
    createMany?: Prisma.RespostaCreateManyProvaInputEnvelope;
    set?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    disconnect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    delete?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    update?: Prisma.RespostaUpdateWithWhereUniqueWithoutProvaInput | Prisma.RespostaUpdateWithWhereUniqueWithoutProvaInput[];
    updateMany?: Prisma.RespostaUpdateManyWithWhereWithoutProvaInput | Prisma.RespostaUpdateManyWithWhereWithoutProvaInput[];
    deleteMany?: Prisma.RespostaScalarWhereInput | Prisma.RespostaScalarWhereInput[];
};
export type RespostaCreateNestedManyWithoutQuestaoInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutQuestaoInput, Prisma.RespostaUncheckedCreateWithoutQuestaoInput> | Prisma.RespostaCreateWithoutQuestaoInput[] | Prisma.RespostaUncheckedCreateWithoutQuestaoInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutQuestaoInput | Prisma.RespostaCreateOrConnectWithoutQuestaoInput[];
    createMany?: Prisma.RespostaCreateManyQuestaoInputEnvelope;
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
};
export type RespostaUncheckedCreateNestedManyWithoutQuestaoInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutQuestaoInput, Prisma.RespostaUncheckedCreateWithoutQuestaoInput> | Prisma.RespostaCreateWithoutQuestaoInput[] | Prisma.RespostaUncheckedCreateWithoutQuestaoInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutQuestaoInput | Prisma.RespostaCreateOrConnectWithoutQuestaoInput[];
    createMany?: Prisma.RespostaCreateManyQuestaoInputEnvelope;
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
};
export type RespostaUpdateManyWithoutQuestaoNestedInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutQuestaoInput, Prisma.RespostaUncheckedCreateWithoutQuestaoInput> | Prisma.RespostaCreateWithoutQuestaoInput[] | Prisma.RespostaUncheckedCreateWithoutQuestaoInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutQuestaoInput | Prisma.RespostaCreateOrConnectWithoutQuestaoInput[];
    upsert?: Prisma.RespostaUpsertWithWhereUniqueWithoutQuestaoInput | Prisma.RespostaUpsertWithWhereUniqueWithoutQuestaoInput[];
    createMany?: Prisma.RespostaCreateManyQuestaoInputEnvelope;
    set?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    disconnect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    delete?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    update?: Prisma.RespostaUpdateWithWhereUniqueWithoutQuestaoInput | Prisma.RespostaUpdateWithWhereUniqueWithoutQuestaoInput[];
    updateMany?: Prisma.RespostaUpdateManyWithWhereWithoutQuestaoInput | Prisma.RespostaUpdateManyWithWhereWithoutQuestaoInput[];
    deleteMany?: Prisma.RespostaScalarWhereInput | Prisma.RespostaScalarWhereInput[];
};
export type RespostaUncheckedUpdateManyWithoutQuestaoNestedInput = {
    create?: Prisma.XOR<Prisma.RespostaCreateWithoutQuestaoInput, Prisma.RespostaUncheckedCreateWithoutQuestaoInput> | Prisma.RespostaCreateWithoutQuestaoInput[] | Prisma.RespostaUncheckedCreateWithoutQuestaoInput[];
    connectOrCreate?: Prisma.RespostaCreateOrConnectWithoutQuestaoInput | Prisma.RespostaCreateOrConnectWithoutQuestaoInput[];
    upsert?: Prisma.RespostaUpsertWithWhereUniqueWithoutQuestaoInput | Prisma.RespostaUpsertWithWhereUniqueWithoutQuestaoInput[];
    createMany?: Prisma.RespostaCreateManyQuestaoInputEnvelope;
    set?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    disconnect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    delete?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    connect?: Prisma.RespostaWhereUniqueInput | Prisma.RespostaWhereUniqueInput[];
    update?: Prisma.RespostaUpdateWithWhereUniqueWithoutQuestaoInput | Prisma.RespostaUpdateWithWhereUniqueWithoutQuestaoInput[];
    updateMany?: Prisma.RespostaUpdateManyWithWhereWithoutQuestaoInput | Prisma.RespostaUpdateManyWithWhereWithoutQuestaoInput[];
    deleteMany?: Prisma.RespostaScalarWhereInput | Prisma.RespostaScalarWhereInput[];
};
export type RespostaCreateWithoutInscricaoInput = {
    id?: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    prova: Prisma.ProvaCreateNestedOneWithoutRespostasInput;
    questao: Prisma.QuestaoCreateNestedOneWithoutRespostasInput;
};
export type RespostaUncheckedCreateWithoutInscricaoInput = {
    id?: string;
    provaId: string;
    questaoId: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RespostaCreateOrConnectWithoutInscricaoInput = {
    where: Prisma.RespostaWhereUniqueInput;
    create: Prisma.XOR<Prisma.RespostaCreateWithoutInscricaoInput, Prisma.RespostaUncheckedCreateWithoutInscricaoInput>;
};
export type RespostaCreateManyInscricaoInputEnvelope = {
    data: Prisma.RespostaCreateManyInscricaoInput | Prisma.RespostaCreateManyInscricaoInput[];
    skipDuplicates?: boolean;
};
export type RespostaUpsertWithWhereUniqueWithoutInscricaoInput = {
    where: Prisma.RespostaWhereUniqueInput;
    update: Prisma.XOR<Prisma.RespostaUpdateWithoutInscricaoInput, Prisma.RespostaUncheckedUpdateWithoutInscricaoInput>;
    create: Prisma.XOR<Prisma.RespostaCreateWithoutInscricaoInput, Prisma.RespostaUncheckedCreateWithoutInscricaoInput>;
};
export type RespostaUpdateWithWhereUniqueWithoutInscricaoInput = {
    where: Prisma.RespostaWhereUniqueInput;
    data: Prisma.XOR<Prisma.RespostaUpdateWithoutInscricaoInput, Prisma.RespostaUncheckedUpdateWithoutInscricaoInput>;
};
export type RespostaUpdateManyWithWhereWithoutInscricaoInput = {
    where: Prisma.RespostaScalarWhereInput;
    data: Prisma.XOR<Prisma.RespostaUpdateManyMutationInput, Prisma.RespostaUncheckedUpdateManyWithoutInscricaoInput>;
};
export type RespostaScalarWhereInput = {
    AND?: Prisma.RespostaScalarWhereInput | Prisma.RespostaScalarWhereInput[];
    OR?: Prisma.RespostaScalarWhereInput[];
    NOT?: Prisma.RespostaScalarWhereInput | Prisma.RespostaScalarWhereInput[];
    id?: Prisma.StringFilter<"Resposta"> | string;
    inscricaoId?: Prisma.StringFilter<"Resposta"> | string;
    provaId?: Prisma.StringFilter<"Resposta"> | string;
    questaoId?: Prisma.StringFilter<"Resposta"> | string;
    alternativaMarcada?: Prisma.StringFilter<"Resposta"> | string;
    correta?: Prisma.BoolFilter<"Resposta"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Resposta"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Resposta"> | Date | string;
};
export type RespostaCreateWithoutProvaInput = {
    id?: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao: Prisma.InscricaoCreateNestedOneWithoutRespostasInput;
    questao: Prisma.QuestaoCreateNestedOneWithoutRespostasInput;
};
export type RespostaUncheckedCreateWithoutProvaInput = {
    id?: string;
    inscricaoId: string;
    questaoId: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RespostaCreateOrConnectWithoutProvaInput = {
    where: Prisma.RespostaWhereUniqueInput;
    create: Prisma.XOR<Prisma.RespostaCreateWithoutProvaInput, Prisma.RespostaUncheckedCreateWithoutProvaInput>;
};
export type RespostaCreateManyProvaInputEnvelope = {
    data: Prisma.RespostaCreateManyProvaInput | Prisma.RespostaCreateManyProvaInput[];
    skipDuplicates?: boolean;
};
export type RespostaUpsertWithWhereUniqueWithoutProvaInput = {
    where: Prisma.RespostaWhereUniqueInput;
    update: Prisma.XOR<Prisma.RespostaUpdateWithoutProvaInput, Prisma.RespostaUncheckedUpdateWithoutProvaInput>;
    create: Prisma.XOR<Prisma.RespostaCreateWithoutProvaInput, Prisma.RespostaUncheckedCreateWithoutProvaInput>;
};
export type RespostaUpdateWithWhereUniqueWithoutProvaInput = {
    where: Prisma.RespostaWhereUniqueInput;
    data: Prisma.XOR<Prisma.RespostaUpdateWithoutProvaInput, Prisma.RespostaUncheckedUpdateWithoutProvaInput>;
};
export type RespostaUpdateManyWithWhereWithoutProvaInput = {
    where: Prisma.RespostaScalarWhereInput;
    data: Prisma.XOR<Prisma.RespostaUpdateManyMutationInput, Prisma.RespostaUncheckedUpdateManyWithoutProvaInput>;
};
export type RespostaCreateWithoutQuestaoInput = {
    id?: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao: Prisma.InscricaoCreateNestedOneWithoutRespostasInput;
    prova: Prisma.ProvaCreateNestedOneWithoutRespostasInput;
};
export type RespostaUncheckedCreateWithoutQuestaoInput = {
    id?: string;
    inscricaoId: string;
    provaId: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RespostaCreateOrConnectWithoutQuestaoInput = {
    where: Prisma.RespostaWhereUniqueInput;
    create: Prisma.XOR<Prisma.RespostaCreateWithoutQuestaoInput, Prisma.RespostaUncheckedCreateWithoutQuestaoInput>;
};
export type RespostaCreateManyQuestaoInputEnvelope = {
    data: Prisma.RespostaCreateManyQuestaoInput | Prisma.RespostaCreateManyQuestaoInput[];
    skipDuplicates?: boolean;
};
export type RespostaUpsertWithWhereUniqueWithoutQuestaoInput = {
    where: Prisma.RespostaWhereUniqueInput;
    update: Prisma.XOR<Prisma.RespostaUpdateWithoutQuestaoInput, Prisma.RespostaUncheckedUpdateWithoutQuestaoInput>;
    create: Prisma.XOR<Prisma.RespostaCreateWithoutQuestaoInput, Prisma.RespostaUncheckedCreateWithoutQuestaoInput>;
};
export type RespostaUpdateWithWhereUniqueWithoutQuestaoInput = {
    where: Prisma.RespostaWhereUniqueInput;
    data: Prisma.XOR<Prisma.RespostaUpdateWithoutQuestaoInput, Prisma.RespostaUncheckedUpdateWithoutQuestaoInput>;
};
export type RespostaUpdateManyWithWhereWithoutQuestaoInput = {
    where: Prisma.RespostaScalarWhereInput;
    data: Prisma.XOR<Prisma.RespostaUpdateManyMutationInput, Prisma.RespostaUncheckedUpdateManyWithoutQuestaoInput>;
};
export type RespostaCreateManyInscricaoInput = {
    id?: string;
    provaId: string;
    questaoId: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RespostaUpdateWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    prova?: Prisma.ProvaUpdateOneRequiredWithoutRespostasNestedInput;
    questao?: Prisma.QuestaoUpdateOneRequiredWithoutRespostasNestedInput;
};
export type RespostaUncheckedUpdateWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RespostaUncheckedUpdateManyWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RespostaCreateManyProvaInput = {
    id?: string;
    inscricaoId: string;
    questaoId: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RespostaUpdateWithoutProvaInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneRequiredWithoutRespostasNestedInput;
    questao?: Prisma.QuestaoUpdateOneRequiredWithoutRespostasNestedInput;
};
export type RespostaUncheckedUpdateWithoutProvaInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RespostaUncheckedUpdateManyWithoutProvaInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    questaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RespostaCreateManyQuestaoInput = {
    id?: string;
    inscricaoId: string;
    provaId: string;
    alternativaMarcada: string;
    correta?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RespostaUpdateWithoutQuestaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneRequiredWithoutRespostasNestedInput;
    prova?: Prisma.ProvaUpdateOneRequiredWithoutRespostasNestedInput;
};
export type RespostaUncheckedUpdateWithoutQuestaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RespostaUncheckedUpdateManyWithoutQuestaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inscricaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    provaId?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaMarcada?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RespostaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inscricaoId?: boolean;
    provaId?: boolean;
    questaoId?: boolean;
    alternativaMarcada?: boolean;
    correta?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["resposta"]>;
export type RespostaSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inscricaoId?: boolean;
    provaId?: boolean;
    questaoId?: boolean;
    alternativaMarcada?: boolean;
    correta?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["resposta"]>;
export type RespostaSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inscricaoId?: boolean;
    provaId?: boolean;
    questaoId?: boolean;
    alternativaMarcada?: boolean;
    correta?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["resposta"]>;
export type RespostaSelectScalar = {
    id?: boolean;
    inscricaoId?: boolean;
    provaId?: boolean;
    questaoId?: boolean;
    alternativaMarcada?: boolean;
    correta?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type RespostaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "inscricaoId" | "provaId" | "questaoId" | "alternativaMarcada" | "correta" | "createdAt" | "updatedAt", ExtArgs["result"]["resposta"]>;
export type RespostaInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
};
export type RespostaIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
};
export type RespostaIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.InscricaoDefaultArgs<ExtArgs>;
    prova?: boolean | Prisma.ProvaDefaultArgs<ExtArgs>;
    questao?: boolean | Prisma.QuestaoDefaultArgs<ExtArgs>;
};
export type $RespostaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Resposta";
    objects: {
        inscricao: Prisma.$InscricaoPayload<ExtArgs>;
        prova: Prisma.$ProvaPayload<ExtArgs>;
        questao: Prisma.$QuestaoPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        inscricaoId: string;
        provaId: string;
        questaoId: string;
        alternativaMarcada: string;
        correta: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["resposta"]>;
    composites: {};
};
export type RespostaGetPayload<S extends boolean | null | undefined | RespostaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RespostaPayload, S>;
export type RespostaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RespostaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RespostaCountAggregateInputType | true;
};
export interface RespostaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Resposta'];
        meta: {
            name: 'Resposta';
        };
    };
    findUnique<T extends RespostaFindUniqueArgs>(args: Prisma.SelectSubset<T, RespostaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RespostaClient<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RespostaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RespostaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RespostaClient<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RespostaFindFirstArgs>(args?: Prisma.SelectSubset<T, RespostaFindFirstArgs<ExtArgs>>): Prisma.Prisma__RespostaClient<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RespostaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RespostaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RespostaClient<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RespostaFindManyArgs>(args?: Prisma.SelectSubset<T, RespostaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RespostaCreateArgs>(args: Prisma.SelectSubset<T, RespostaCreateArgs<ExtArgs>>): Prisma.Prisma__RespostaClient<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RespostaCreateManyArgs>(args?: Prisma.SelectSubset<T, RespostaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RespostaCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RespostaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RespostaDeleteArgs>(args: Prisma.SelectSubset<T, RespostaDeleteArgs<ExtArgs>>): Prisma.Prisma__RespostaClient<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RespostaUpdateArgs>(args: Prisma.SelectSubset<T, RespostaUpdateArgs<ExtArgs>>): Prisma.Prisma__RespostaClient<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RespostaDeleteManyArgs>(args?: Prisma.SelectSubset<T, RespostaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RespostaUpdateManyArgs>(args: Prisma.SelectSubset<T, RespostaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RespostaUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RespostaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RespostaUpsertArgs>(args: Prisma.SelectSubset<T, RespostaUpsertArgs<ExtArgs>>): Prisma.Prisma__RespostaClient<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RespostaCountArgs>(args?: Prisma.Subset<T, RespostaCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RespostaCountAggregateOutputType> : number>;
    aggregate<T extends RespostaAggregateArgs>(args: Prisma.Subset<T, RespostaAggregateArgs>): Prisma.PrismaPromise<GetRespostaAggregateType<T>>;
    groupBy<T extends RespostaGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RespostaGroupByArgs['orderBy'];
    } : {
        orderBy?: RespostaGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RespostaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRespostaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RespostaFieldRefs;
}
export interface Prisma__RespostaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    inscricao<T extends Prisma.InscricaoDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.InscricaoDefaultArgs<ExtArgs>>): Prisma.Prisma__InscricaoClient<runtime.Types.Result.GetResult<Prisma.$InscricaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    prova<T extends Prisma.ProvaDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProvaDefaultArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    questao<T extends Prisma.QuestaoDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.QuestaoDefaultArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RespostaFieldRefs {
    readonly id: Prisma.FieldRef<"Resposta", 'String'>;
    readonly inscricaoId: Prisma.FieldRef<"Resposta", 'String'>;
    readonly provaId: Prisma.FieldRef<"Resposta", 'String'>;
    readonly questaoId: Prisma.FieldRef<"Resposta", 'String'>;
    readonly alternativaMarcada: Prisma.FieldRef<"Resposta", 'String'>;
    readonly correta: Prisma.FieldRef<"Resposta", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Resposta", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Resposta", 'DateTime'>;
}
export type RespostaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    where: Prisma.RespostaWhereUniqueInput;
};
export type RespostaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    where: Prisma.RespostaWhereUniqueInput;
};
export type RespostaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    where?: Prisma.RespostaWhereInput;
    orderBy?: Prisma.RespostaOrderByWithRelationInput | Prisma.RespostaOrderByWithRelationInput[];
    cursor?: Prisma.RespostaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RespostaScalarFieldEnum | Prisma.RespostaScalarFieldEnum[];
};
export type RespostaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    where?: Prisma.RespostaWhereInput;
    orderBy?: Prisma.RespostaOrderByWithRelationInput | Prisma.RespostaOrderByWithRelationInput[];
    cursor?: Prisma.RespostaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RespostaScalarFieldEnum | Prisma.RespostaScalarFieldEnum[];
};
export type RespostaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    where?: Prisma.RespostaWhereInput;
    orderBy?: Prisma.RespostaOrderByWithRelationInput | Prisma.RespostaOrderByWithRelationInput[];
    cursor?: Prisma.RespostaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RespostaScalarFieldEnum | Prisma.RespostaScalarFieldEnum[];
};
export type RespostaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RespostaCreateInput, Prisma.RespostaUncheckedCreateInput>;
};
export type RespostaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RespostaCreateManyInput | Prisma.RespostaCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RespostaCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    data: Prisma.RespostaCreateManyInput | Prisma.RespostaCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RespostaIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RespostaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RespostaUpdateInput, Prisma.RespostaUncheckedUpdateInput>;
    where: Prisma.RespostaWhereUniqueInput;
};
export type RespostaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RespostaUpdateManyMutationInput, Prisma.RespostaUncheckedUpdateManyInput>;
    where?: Prisma.RespostaWhereInput;
    limit?: number;
};
export type RespostaUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RespostaUpdateManyMutationInput, Prisma.RespostaUncheckedUpdateManyInput>;
    where?: Prisma.RespostaWhereInput;
    limit?: number;
    include?: Prisma.RespostaIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RespostaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    where: Prisma.RespostaWhereUniqueInput;
    create: Prisma.XOR<Prisma.RespostaCreateInput, Prisma.RespostaUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RespostaUpdateInput, Prisma.RespostaUncheckedUpdateInput>;
};
export type RespostaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    where: Prisma.RespostaWhereUniqueInput;
};
export type RespostaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RespostaWhereInput;
    limit?: number;
};
export type RespostaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
};

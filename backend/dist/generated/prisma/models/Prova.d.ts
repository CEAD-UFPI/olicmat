import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProvaModel = runtime.Types.Result.DefaultSelection<Prisma.$ProvaPayload>;
export type AggregateProva = {
    _count: ProvaCountAggregateOutputType | null;
    _avg: ProvaAvgAggregateOutputType | null;
    _sum: ProvaSumAggregateOutputType | null;
    _min: ProvaMinAggregateOutputType | null;
    _max: ProvaMaxAggregateOutputType | null;
};
export type ProvaAvgAggregateOutputType = {
    fase: number | null;
    duracaoMinutos: number | null;
    versao: number | null;
};
export type ProvaSumAggregateOutputType = {
    fase: number | null;
    duracaoMinutos: number | null;
    versao: number | null;
};
export type ProvaMinAggregateOutputType = {
    id: string | null;
    edicaoId: string | null;
    fase: number | null;
    titulo: string | null;
    duracaoMinutos: number | null;
    status: $Enums.StatusProva | null;
    publicadaEm: Date | null;
    janelaInicio: Date | null;
    janelaFim: Date | null;
    versao: number | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ProvaMaxAggregateOutputType = {
    id: string | null;
    edicaoId: string | null;
    fase: number | null;
    titulo: string | null;
    duracaoMinutos: number | null;
    status: $Enums.StatusProva | null;
    publicadaEm: Date | null;
    janelaInicio: Date | null;
    janelaFim: Date | null;
    versao: number | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ProvaCountAggregateOutputType = {
    id: number;
    edicaoId: number;
    fase: number;
    titulo: number;
    duracaoMinutos: number;
    status: number;
    publicadaEm: number;
    janelaInicio: number;
    janelaFim: number;
    versao: number;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ProvaAvgAggregateInputType = {
    fase?: true;
    duracaoMinutos?: true;
    versao?: true;
};
export type ProvaSumAggregateInputType = {
    fase?: true;
    duracaoMinutos?: true;
    versao?: true;
};
export type ProvaMinAggregateInputType = {
    id?: true;
    edicaoId?: true;
    fase?: true;
    titulo?: true;
    duracaoMinutos?: true;
    status?: true;
    publicadaEm?: true;
    janelaInicio?: true;
    janelaFim?: true;
    versao?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ProvaMaxAggregateInputType = {
    id?: true;
    edicaoId?: true;
    fase?: true;
    titulo?: true;
    duracaoMinutos?: true;
    status?: true;
    publicadaEm?: true;
    janelaInicio?: true;
    janelaFim?: true;
    versao?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ProvaCountAggregateInputType = {
    id?: true;
    edicaoId?: true;
    fase?: true;
    titulo?: true;
    duracaoMinutos?: true;
    status?: true;
    publicadaEm?: true;
    janelaInicio?: true;
    janelaFim?: true;
    versao?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ProvaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProvaWhereInput;
    orderBy?: Prisma.ProvaOrderByWithRelationInput | Prisma.ProvaOrderByWithRelationInput[];
    cursor?: Prisma.ProvaWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProvaCountAggregateInputType;
    _avg?: ProvaAvgAggregateInputType;
    _sum?: ProvaSumAggregateInputType;
    _min?: ProvaMinAggregateInputType;
    _max?: ProvaMaxAggregateInputType;
};
export type GetProvaAggregateType<T extends ProvaAggregateArgs> = {
    [P in keyof T & keyof AggregateProva]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProva[P]> : Prisma.GetScalarType<T[P], AggregateProva[P]>;
};
export type ProvaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProvaWhereInput;
    orderBy?: Prisma.ProvaOrderByWithAggregationInput | Prisma.ProvaOrderByWithAggregationInput[];
    by: Prisma.ProvaScalarFieldEnum[] | Prisma.ProvaScalarFieldEnum;
    having?: Prisma.ProvaScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProvaCountAggregateInputType | true;
    _avg?: ProvaAvgAggregateInputType;
    _sum?: ProvaSumAggregateInputType;
    _min?: ProvaMinAggregateInputType;
    _max?: ProvaMaxAggregateInputType;
};
export type ProvaGroupByOutputType = {
    id: string;
    edicaoId: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status: $Enums.StatusProva;
    publicadaEm: Date | null;
    janelaInicio: Date | null;
    janelaFim: Date | null;
    versao: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    _count: ProvaCountAggregateOutputType | null;
    _avg: ProvaAvgAggregateOutputType | null;
    _sum: ProvaSumAggregateOutputType | null;
    _min: ProvaMinAggregateOutputType | null;
    _max: ProvaMaxAggregateOutputType | null;
};
export type GetProvaGroupByPayload<T extends ProvaGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProvaGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProvaGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProvaGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProvaGroupByOutputType[P]>;
}>>;
export type ProvaWhereInput = {
    AND?: Prisma.ProvaWhereInput | Prisma.ProvaWhereInput[];
    OR?: Prisma.ProvaWhereInput[];
    NOT?: Prisma.ProvaWhereInput | Prisma.ProvaWhereInput[];
    id?: Prisma.StringFilter<"Prova"> | string;
    edicaoId?: Prisma.StringFilter<"Prova"> | string;
    fase?: Prisma.IntFilter<"Prova"> | number;
    titulo?: Prisma.StringFilter<"Prova"> | string;
    duracaoMinutos?: Prisma.IntFilter<"Prova"> | number;
    status?: Prisma.EnumStatusProvaFilter<"Prova"> | $Enums.StatusProva;
    publicadaEm?: Prisma.DateTimeNullableFilter<"Prova"> | Date | string | null;
    janelaInicio?: Prisma.DateTimeNullableFilter<"Prova"> | Date | string | null;
    janelaFim?: Prisma.DateTimeNullableFilter<"Prova"> | Date | string | null;
    versao?: Prisma.IntFilter<"Prova"> | number;
    createdBy?: Prisma.StringFilter<"Prova"> | string;
    createdAt?: Prisma.DateTimeFilter<"Prova"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Prova"> | Date | string;
    edicao?: Prisma.XOR<Prisma.EdicaoScalarRelationFilter, Prisma.EdicaoWhereInput>;
    questoes?: Prisma.ProvaQuestaoListRelationFilter;
    respostas?: Prisma.RespostaListRelationFilter;
};
export type ProvaOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    fase?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    duracaoMinutos?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    publicadaEm?: Prisma.SortOrderInput | Prisma.SortOrder;
    janelaInicio?: Prisma.SortOrderInput | Prisma.SortOrder;
    janelaFim?: Prisma.SortOrderInput | Prisma.SortOrder;
    versao?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    edicao?: Prisma.EdicaoOrderByWithRelationInput;
    questoes?: Prisma.ProvaQuestaoOrderByRelationAggregateInput;
    respostas?: Prisma.RespostaOrderByRelationAggregateInput;
};
export type ProvaWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ProvaWhereInput | Prisma.ProvaWhereInput[];
    OR?: Prisma.ProvaWhereInput[];
    NOT?: Prisma.ProvaWhereInput | Prisma.ProvaWhereInput[];
    edicaoId?: Prisma.StringFilter<"Prova"> | string;
    fase?: Prisma.IntFilter<"Prova"> | number;
    titulo?: Prisma.StringFilter<"Prova"> | string;
    duracaoMinutos?: Prisma.IntFilter<"Prova"> | number;
    status?: Prisma.EnumStatusProvaFilter<"Prova"> | $Enums.StatusProva;
    publicadaEm?: Prisma.DateTimeNullableFilter<"Prova"> | Date | string | null;
    janelaInicio?: Prisma.DateTimeNullableFilter<"Prova"> | Date | string | null;
    janelaFim?: Prisma.DateTimeNullableFilter<"Prova"> | Date | string | null;
    versao?: Prisma.IntFilter<"Prova"> | number;
    createdBy?: Prisma.StringFilter<"Prova"> | string;
    createdAt?: Prisma.DateTimeFilter<"Prova"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Prova"> | Date | string;
    edicao?: Prisma.XOR<Prisma.EdicaoScalarRelationFilter, Prisma.EdicaoWhereInput>;
    questoes?: Prisma.ProvaQuestaoListRelationFilter;
    respostas?: Prisma.RespostaListRelationFilter;
}, "id">;
export type ProvaOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    fase?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    duracaoMinutos?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    publicadaEm?: Prisma.SortOrderInput | Prisma.SortOrder;
    janelaInicio?: Prisma.SortOrderInput | Prisma.SortOrder;
    janelaFim?: Prisma.SortOrderInput | Prisma.SortOrder;
    versao?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ProvaCountOrderByAggregateInput;
    _avg?: Prisma.ProvaAvgOrderByAggregateInput;
    _max?: Prisma.ProvaMaxOrderByAggregateInput;
    _min?: Prisma.ProvaMinOrderByAggregateInput;
    _sum?: Prisma.ProvaSumOrderByAggregateInput;
};
export type ProvaScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProvaScalarWhereWithAggregatesInput | Prisma.ProvaScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProvaScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProvaScalarWhereWithAggregatesInput | Prisma.ProvaScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Prova"> | string;
    edicaoId?: Prisma.StringWithAggregatesFilter<"Prova"> | string;
    fase?: Prisma.IntWithAggregatesFilter<"Prova"> | number;
    titulo?: Prisma.StringWithAggregatesFilter<"Prova"> | string;
    duracaoMinutos?: Prisma.IntWithAggregatesFilter<"Prova"> | number;
    status?: Prisma.EnumStatusProvaWithAggregatesFilter<"Prova"> | $Enums.StatusProva;
    publicadaEm?: Prisma.DateTimeNullableWithAggregatesFilter<"Prova"> | Date | string | null;
    janelaInicio?: Prisma.DateTimeNullableWithAggregatesFilter<"Prova"> | Date | string | null;
    janelaFim?: Prisma.DateTimeNullableWithAggregatesFilter<"Prova"> | Date | string | null;
    versao?: Prisma.IntWithAggregatesFilter<"Prova"> | number;
    createdBy?: Prisma.StringWithAggregatesFilter<"Prova"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Prova"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Prova"> | Date | string;
};
export type ProvaCreateInput = {
    id?: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    edicao: Prisma.EdicaoCreateNestedOneWithoutProvasInput;
    questoes?: Prisma.ProvaQuestaoCreateNestedManyWithoutProvaInput;
    respostas?: Prisma.RespostaCreateNestedManyWithoutProvaInput;
};
export type ProvaUncheckedCreateInput = {
    id?: string;
    edicaoId: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    questoes?: Prisma.ProvaQuestaoUncheckedCreateNestedManyWithoutProvaInput;
    respostas?: Prisma.RespostaUncheckedCreateNestedManyWithoutProvaInput;
};
export type ProvaUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    edicao?: Prisma.EdicaoUpdateOneRequiredWithoutProvasNestedInput;
    questoes?: Prisma.ProvaQuestaoUpdateManyWithoutProvaNestedInput;
    respostas?: Prisma.RespostaUpdateManyWithoutProvaNestedInput;
};
export type ProvaUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    questoes?: Prisma.ProvaQuestaoUncheckedUpdateManyWithoutProvaNestedInput;
    respostas?: Prisma.RespostaUncheckedUpdateManyWithoutProvaNestedInput;
};
export type ProvaCreateManyInput = {
    id?: string;
    edicaoId: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ProvaUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProvaUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProvaListRelationFilter = {
    every?: Prisma.ProvaWhereInput;
    some?: Prisma.ProvaWhereInput;
    none?: Prisma.ProvaWhereInput;
};
export type ProvaOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProvaCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    fase?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    duracaoMinutos?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    publicadaEm?: Prisma.SortOrder;
    janelaInicio?: Prisma.SortOrder;
    janelaFim?: Prisma.SortOrder;
    versao?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProvaAvgOrderByAggregateInput = {
    fase?: Prisma.SortOrder;
    duracaoMinutos?: Prisma.SortOrder;
    versao?: Prisma.SortOrder;
};
export type ProvaMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    fase?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    duracaoMinutos?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    publicadaEm?: Prisma.SortOrder;
    janelaInicio?: Prisma.SortOrder;
    janelaFim?: Prisma.SortOrder;
    versao?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProvaMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    fase?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    duracaoMinutos?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    publicadaEm?: Prisma.SortOrder;
    janelaInicio?: Prisma.SortOrder;
    janelaFim?: Prisma.SortOrder;
    versao?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProvaSumOrderByAggregateInput = {
    fase?: Prisma.SortOrder;
    duracaoMinutos?: Prisma.SortOrder;
    versao?: Prisma.SortOrder;
};
export type ProvaScalarRelationFilter = {
    is?: Prisma.ProvaWhereInput;
    isNot?: Prisma.ProvaWhereInput;
};
export type ProvaCreateNestedManyWithoutEdicaoInput = {
    create?: Prisma.XOR<Prisma.ProvaCreateWithoutEdicaoInput, Prisma.ProvaUncheckedCreateWithoutEdicaoInput> | Prisma.ProvaCreateWithoutEdicaoInput[] | Prisma.ProvaUncheckedCreateWithoutEdicaoInput[];
    connectOrCreate?: Prisma.ProvaCreateOrConnectWithoutEdicaoInput | Prisma.ProvaCreateOrConnectWithoutEdicaoInput[];
    createMany?: Prisma.ProvaCreateManyEdicaoInputEnvelope;
    connect?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
};
export type ProvaUncheckedCreateNestedManyWithoutEdicaoInput = {
    create?: Prisma.XOR<Prisma.ProvaCreateWithoutEdicaoInput, Prisma.ProvaUncheckedCreateWithoutEdicaoInput> | Prisma.ProvaCreateWithoutEdicaoInput[] | Prisma.ProvaUncheckedCreateWithoutEdicaoInput[];
    connectOrCreate?: Prisma.ProvaCreateOrConnectWithoutEdicaoInput | Prisma.ProvaCreateOrConnectWithoutEdicaoInput[];
    createMany?: Prisma.ProvaCreateManyEdicaoInputEnvelope;
    connect?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
};
export type ProvaUpdateManyWithoutEdicaoNestedInput = {
    create?: Prisma.XOR<Prisma.ProvaCreateWithoutEdicaoInput, Prisma.ProvaUncheckedCreateWithoutEdicaoInput> | Prisma.ProvaCreateWithoutEdicaoInput[] | Prisma.ProvaUncheckedCreateWithoutEdicaoInput[];
    connectOrCreate?: Prisma.ProvaCreateOrConnectWithoutEdicaoInput | Prisma.ProvaCreateOrConnectWithoutEdicaoInput[];
    upsert?: Prisma.ProvaUpsertWithWhereUniqueWithoutEdicaoInput | Prisma.ProvaUpsertWithWhereUniqueWithoutEdicaoInput[];
    createMany?: Prisma.ProvaCreateManyEdicaoInputEnvelope;
    set?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
    disconnect?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
    delete?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
    connect?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
    update?: Prisma.ProvaUpdateWithWhereUniqueWithoutEdicaoInput | Prisma.ProvaUpdateWithWhereUniqueWithoutEdicaoInput[];
    updateMany?: Prisma.ProvaUpdateManyWithWhereWithoutEdicaoInput | Prisma.ProvaUpdateManyWithWhereWithoutEdicaoInput[];
    deleteMany?: Prisma.ProvaScalarWhereInput | Prisma.ProvaScalarWhereInput[];
};
export type ProvaUncheckedUpdateManyWithoutEdicaoNestedInput = {
    create?: Prisma.XOR<Prisma.ProvaCreateWithoutEdicaoInput, Prisma.ProvaUncheckedCreateWithoutEdicaoInput> | Prisma.ProvaCreateWithoutEdicaoInput[] | Prisma.ProvaUncheckedCreateWithoutEdicaoInput[];
    connectOrCreate?: Prisma.ProvaCreateOrConnectWithoutEdicaoInput | Prisma.ProvaCreateOrConnectWithoutEdicaoInput[];
    upsert?: Prisma.ProvaUpsertWithWhereUniqueWithoutEdicaoInput | Prisma.ProvaUpsertWithWhereUniqueWithoutEdicaoInput[];
    createMany?: Prisma.ProvaCreateManyEdicaoInputEnvelope;
    set?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
    disconnect?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
    delete?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
    connect?: Prisma.ProvaWhereUniqueInput | Prisma.ProvaWhereUniqueInput[];
    update?: Prisma.ProvaUpdateWithWhereUniqueWithoutEdicaoInput | Prisma.ProvaUpdateWithWhereUniqueWithoutEdicaoInput[];
    updateMany?: Prisma.ProvaUpdateManyWithWhereWithoutEdicaoInput | Prisma.ProvaUpdateManyWithWhereWithoutEdicaoInput[];
    deleteMany?: Prisma.ProvaScalarWhereInput | Prisma.ProvaScalarWhereInput[];
};
export type EnumStatusProvaFieldUpdateOperationsInput = {
    set?: $Enums.StatusProva;
};
export type ProvaCreateNestedOneWithoutQuestoesInput = {
    create?: Prisma.XOR<Prisma.ProvaCreateWithoutQuestoesInput, Prisma.ProvaUncheckedCreateWithoutQuestoesInput>;
    connectOrCreate?: Prisma.ProvaCreateOrConnectWithoutQuestoesInput;
    connect?: Prisma.ProvaWhereUniqueInput;
};
export type ProvaUpdateOneRequiredWithoutQuestoesNestedInput = {
    create?: Prisma.XOR<Prisma.ProvaCreateWithoutQuestoesInput, Prisma.ProvaUncheckedCreateWithoutQuestoesInput>;
    connectOrCreate?: Prisma.ProvaCreateOrConnectWithoutQuestoesInput;
    upsert?: Prisma.ProvaUpsertWithoutQuestoesInput;
    connect?: Prisma.ProvaWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProvaUpdateToOneWithWhereWithoutQuestoesInput, Prisma.ProvaUpdateWithoutQuestoesInput>, Prisma.ProvaUncheckedUpdateWithoutQuestoesInput>;
};
export type ProvaCreateNestedOneWithoutRespostasInput = {
    create?: Prisma.XOR<Prisma.ProvaCreateWithoutRespostasInput, Prisma.ProvaUncheckedCreateWithoutRespostasInput>;
    connectOrCreate?: Prisma.ProvaCreateOrConnectWithoutRespostasInput;
    connect?: Prisma.ProvaWhereUniqueInput;
};
export type ProvaUpdateOneRequiredWithoutRespostasNestedInput = {
    create?: Prisma.XOR<Prisma.ProvaCreateWithoutRespostasInput, Prisma.ProvaUncheckedCreateWithoutRespostasInput>;
    connectOrCreate?: Prisma.ProvaCreateOrConnectWithoutRespostasInput;
    upsert?: Prisma.ProvaUpsertWithoutRespostasInput;
    connect?: Prisma.ProvaWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProvaUpdateToOneWithWhereWithoutRespostasInput, Prisma.ProvaUpdateWithoutRespostasInput>, Prisma.ProvaUncheckedUpdateWithoutRespostasInput>;
};
export type ProvaCreateWithoutEdicaoInput = {
    id?: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    questoes?: Prisma.ProvaQuestaoCreateNestedManyWithoutProvaInput;
    respostas?: Prisma.RespostaCreateNestedManyWithoutProvaInput;
};
export type ProvaUncheckedCreateWithoutEdicaoInput = {
    id?: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    questoes?: Prisma.ProvaQuestaoUncheckedCreateNestedManyWithoutProvaInput;
    respostas?: Prisma.RespostaUncheckedCreateNestedManyWithoutProvaInput;
};
export type ProvaCreateOrConnectWithoutEdicaoInput = {
    where: Prisma.ProvaWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProvaCreateWithoutEdicaoInput, Prisma.ProvaUncheckedCreateWithoutEdicaoInput>;
};
export type ProvaCreateManyEdicaoInputEnvelope = {
    data: Prisma.ProvaCreateManyEdicaoInput | Prisma.ProvaCreateManyEdicaoInput[];
    skipDuplicates?: boolean;
};
export type ProvaUpsertWithWhereUniqueWithoutEdicaoInput = {
    where: Prisma.ProvaWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProvaUpdateWithoutEdicaoInput, Prisma.ProvaUncheckedUpdateWithoutEdicaoInput>;
    create: Prisma.XOR<Prisma.ProvaCreateWithoutEdicaoInput, Prisma.ProvaUncheckedCreateWithoutEdicaoInput>;
};
export type ProvaUpdateWithWhereUniqueWithoutEdicaoInput = {
    where: Prisma.ProvaWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProvaUpdateWithoutEdicaoInput, Prisma.ProvaUncheckedUpdateWithoutEdicaoInput>;
};
export type ProvaUpdateManyWithWhereWithoutEdicaoInput = {
    where: Prisma.ProvaScalarWhereInput;
    data: Prisma.XOR<Prisma.ProvaUpdateManyMutationInput, Prisma.ProvaUncheckedUpdateManyWithoutEdicaoInput>;
};
export type ProvaScalarWhereInput = {
    AND?: Prisma.ProvaScalarWhereInput | Prisma.ProvaScalarWhereInput[];
    OR?: Prisma.ProvaScalarWhereInput[];
    NOT?: Prisma.ProvaScalarWhereInput | Prisma.ProvaScalarWhereInput[];
    id?: Prisma.StringFilter<"Prova"> | string;
    edicaoId?: Prisma.StringFilter<"Prova"> | string;
    fase?: Prisma.IntFilter<"Prova"> | number;
    titulo?: Prisma.StringFilter<"Prova"> | string;
    duracaoMinutos?: Prisma.IntFilter<"Prova"> | number;
    status?: Prisma.EnumStatusProvaFilter<"Prova"> | $Enums.StatusProva;
    publicadaEm?: Prisma.DateTimeNullableFilter<"Prova"> | Date | string | null;
    janelaInicio?: Prisma.DateTimeNullableFilter<"Prova"> | Date | string | null;
    janelaFim?: Prisma.DateTimeNullableFilter<"Prova"> | Date | string | null;
    versao?: Prisma.IntFilter<"Prova"> | number;
    createdBy?: Prisma.StringFilter<"Prova"> | string;
    createdAt?: Prisma.DateTimeFilter<"Prova"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Prova"> | Date | string;
};
export type ProvaCreateWithoutQuestoesInput = {
    id?: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    edicao: Prisma.EdicaoCreateNestedOneWithoutProvasInput;
    respostas?: Prisma.RespostaCreateNestedManyWithoutProvaInput;
};
export type ProvaUncheckedCreateWithoutQuestoesInput = {
    id?: string;
    edicaoId: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    respostas?: Prisma.RespostaUncheckedCreateNestedManyWithoutProvaInput;
};
export type ProvaCreateOrConnectWithoutQuestoesInput = {
    where: Prisma.ProvaWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProvaCreateWithoutQuestoesInput, Prisma.ProvaUncheckedCreateWithoutQuestoesInput>;
};
export type ProvaUpsertWithoutQuestoesInput = {
    update: Prisma.XOR<Prisma.ProvaUpdateWithoutQuestoesInput, Prisma.ProvaUncheckedUpdateWithoutQuestoesInput>;
    create: Prisma.XOR<Prisma.ProvaCreateWithoutQuestoesInput, Prisma.ProvaUncheckedCreateWithoutQuestoesInput>;
    where?: Prisma.ProvaWhereInput;
};
export type ProvaUpdateToOneWithWhereWithoutQuestoesInput = {
    where?: Prisma.ProvaWhereInput;
    data: Prisma.XOR<Prisma.ProvaUpdateWithoutQuestoesInput, Prisma.ProvaUncheckedUpdateWithoutQuestoesInput>;
};
export type ProvaUpdateWithoutQuestoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    edicao?: Prisma.EdicaoUpdateOneRequiredWithoutProvasNestedInput;
    respostas?: Prisma.RespostaUpdateManyWithoutProvaNestedInput;
};
export type ProvaUncheckedUpdateWithoutQuestoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    respostas?: Prisma.RespostaUncheckedUpdateManyWithoutProvaNestedInput;
};
export type ProvaCreateWithoutRespostasInput = {
    id?: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    edicao: Prisma.EdicaoCreateNestedOneWithoutProvasInput;
    questoes?: Prisma.ProvaQuestaoCreateNestedManyWithoutProvaInput;
};
export type ProvaUncheckedCreateWithoutRespostasInput = {
    id?: string;
    edicaoId: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    questoes?: Prisma.ProvaQuestaoUncheckedCreateNestedManyWithoutProvaInput;
};
export type ProvaCreateOrConnectWithoutRespostasInput = {
    where: Prisma.ProvaWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProvaCreateWithoutRespostasInput, Prisma.ProvaUncheckedCreateWithoutRespostasInput>;
};
export type ProvaUpsertWithoutRespostasInput = {
    update: Prisma.XOR<Prisma.ProvaUpdateWithoutRespostasInput, Prisma.ProvaUncheckedUpdateWithoutRespostasInput>;
    create: Prisma.XOR<Prisma.ProvaCreateWithoutRespostasInput, Prisma.ProvaUncheckedCreateWithoutRespostasInput>;
    where?: Prisma.ProvaWhereInput;
};
export type ProvaUpdateToOneWithWhereWithoutRespostasInput = {
    where?: Prisma.ProvaWhereInput;
    data: Prisma.XOR<Prisma.ProvaUpdateWithoutRespostasInput, Prisma.ProvaUncheckedUpdateWithoutRespostasInput>;
};
export type ProvaUpdateWithoutRespostasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    edicao?: Prisma.EdicaoUpdateOneRequiredWithoutProvasNestedInput;
    questoes?: Prisma.ProvaQuestaoUpdateManyWithoutProvaNestedInput;
};
export type ProvaUncheckedUpdateWithoutRespostasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    questoes?: Prisma.ProvaQuestaoUncheckedUpdateManyWithoutProvaNestedInput;
};
export type ProvaCreateManyEdicaoInput = {
    id?: string;
    fase: number;
    titulo: string;
    duracaoMinutos: number;
    status?: $Enums.StatusProva;
    publicadaEm?: Date | string | null;
    janelaInicio?: Date | string | null;
    janelaFim?: Date | string | null;
    versao?: number;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ProvaUpdateWithoutEdicaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    questoes?: Prisma.ProvaQuestaoUpdateManyWithoutProvaNestedInput;
    respostas?: Prisma.RespostaUpdateManyWithoutProvaNestedInput;
};
export type ProvaUncheckedUpdateWithoutEdicaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    questoes?: Prisma.ProvaQuestaoUncheckedUpdateManyWithoutProvaNestedInput;
    respostas?: Prisma.RespostaUncheckedUpdateManyWithoutProvaNestedInput;
};
export type ProvaUncheckedUpdateManyWithoutEdicaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fase?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    duracaoMinutos?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumStatusProvaFieldUpdateOperationsInput | $Enums.StatusProva;
    publicadaEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    janelaFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versao?: Prisma.IntFieldUpdateOperationsInput | number;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProvaCountOutputType = {
    questoes: number;
    respostas: number;
};
export type ProvaCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    questoes?: boolean | ProvaCountOutputTypeCountQuestoesArgs;
    respostas?: boolean | ProvaCountOutputTypeCountRespostasArgs;
};
export type ProvaCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaCountOutputTypeSelect<ExtArgs> | null;
};
export type ProvaCountOutputTypeCountQuestoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProvaQuestaoWhereInput;
};
export type ProvaCountOutputTypeCountRespostasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RespostaWhereInput;
};
export type ProvaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    edicaoId?: boolean;
    fase?: boolean;
    titulo?: boolean;
    duracaoMinutos?: boolean;
    status?: boolean;
    publicadaEm?: boolean;
    janelaInicio?: boolean;
    janelaFim?: boolean;
    versao?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    edicao?: boolean | Prisma.EdicaoDefaultArgs<ExtArgs>;
    questoes?: boolean | Prisma.Prova$questoesArgs<ExtArgs>;
    respostas?: boolean | Prisma.Prova$respostasArgs<ExtArgs>;
    _count?: boolean | Prisma.ProvaCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["prova"]>;
export type ProvaSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    edicaoId?: boolean;
    fase?: boolean;
    titulo?: boolean;
    duracaoMinutos?: boolean;
    status?: boolean;
    publicadaEm?: boolean;
    janelaInicio?: boolean;
    janelaFim?: boolean;
    versao?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    edicao?: boolean | Prisma.EdicaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["prova"]>;
export type ProvaSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    edicaoId?: boolean;
    fase?: boolean;
    titulo?: boolean;
    duracaoMinutos?: boolean;
    status?: boolean;
    publicadaEm?: boolean;
    janelaInicio?: boolean;
    janelaFim?: boolean;
    versao?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    edicao?: boolean | Prisma.EdicaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["prova"]>;
export type ProvaSelectScalar = {
    id?: boolean;
    edicaoId?: boolean;
    fase?: boolean;
    titulo?: boolean;
    duracaoMinutos?: boolean;
    status?: boolean;
    publicadaEm?: boolean;
    janelaInicio?: boolean;
    janelaFim?: boolean;
    versao?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ProvaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "edicaoId" | "fase" | "titulo" | "duracaoMinutos" | "status" | "publicadaEm" | "janelaInicio" | "janelaFim" | "versao" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["prova"]>;
export type ProvaInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    edicao?: boolean | Prisma.EdicaoDefaultArgs<ExtArgs>;
    questoes?: boolean | Prisma.Prova$questoesArgs<ExtArgs>;
    respostas?: boolean | Prisma.Prova$respostasArgs<ExtArgs>;
    _count?: boolean | Prisma.ProvaCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ProvaIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    edicao?: boolean | Prisma.EdicaoDefaultArgs<ExtArgs>;
};
export type ProvaIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    edicao?: boolean | Prisma.EdicaoDefaultArgs<ExtArgs>;
};
export type $ProvaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Prova";
    objects: {
        edicao: Prisma.$EdicaoPayload<ExtArgs>;
        questoes: Prisma.$ProvaQuestaoPayload<ExtArgs>[];
        respostas: Prisma.$RespostaPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        edicaoId: string;
        fase: number;
        titulo: string;
        duracaoMinutos: number;
        status: $Enums.StatusProva;
        publicadaEm: Date | null;
        janelaInicio: Date | null;
        janelaFim: Date | null;
        versao: number;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["prova"]>;
    composites: {};
};
export type ProvaGetPayload<S extends boolean | null | undefined | ProvaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProvaPayload, S>;
export type ProvaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProvaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProvaCountAggregateInputType | true;
};
export interface ProvaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Prova'];
        meta: {
            name: 'Prova';
        };
    };
    findUnique<T extends ProvaFindUniqueArgs>(args: Prisma.SelectSubset<T, ProvaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProvaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProvaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProvaFindFirstArgs>(args?: Prisma.SelectSubset<T, ProvaFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProvaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProvaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProvaFindManyArgs>(args?: Prisma.SelectSubset<T, ProvaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProvaCreateArgs>(args: Prisma.SelectSubset<T, ProvaCreateArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProvaCreateManyArgs>(args?: Prisma.SelectSubset<T, ProvaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProvaCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProvaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProvaDeleteArgs>(args: Prisma.SelectSubset<T, ProvaDeleteArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProvaUpdateArgs>(args: Prisma.SelectSubset<T, ProvaUpdateArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProvaDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProvaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProvaUpdateManyArgs>(args: Prisma.SelectSubset<T, ProvaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProvaUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProvaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProvaUpsertArgs>(args: Prisma.SelectSubset<T, ProvaUpsertArgs<ExtArgs>>): Prisma.Prisma__ProvaClient<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProvaCountArgs>(args?: Prisma.Subset<T, ProvaCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProvaCountAggregateOutputType> : number>;
    aggregate<T extends ProvaAggregateArgs>(args: Prisma.Subset<T, ProvaAggregateArgs>): Prisma.PrismaPromise<GetProvaAggregateType<T>>;
    groupBy<T extends ProvaGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProvaGroupByArgs['orderBy'];
    } : {
        orderBy?: ProvaGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProvaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProvaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProvaFieldRefs;
}
export interface Prisma__ProvaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    edicao<T extends Prisma.EdicaoDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EdicaoDefaultArgs<ExtArgs>>): Prisma.Prisma__EdicaoClient<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    questoes<T extends Prisma.Prova$questoesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Prova$questoesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProvaQuestaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    respostas<T extends Prisma.Prova$respostasArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Prova$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProvaFieldRefs {
    readonly id: Prisma.FieldRef<"Prova", 'String'>;
    readonly edicaoId: Prisma.FieldRef<"Prova", 'String'>;
    readonly fase: Prisma.FieldRef<"Prova", 'Int'>;
    readonly titulo: Prisma.FieldRef<"Prova", 'String'>;
    readonly duracaoMinutos: Prisma.FieldRef<"Prova", 'Int'>;
    readonly status: Prisma.FieldRef<"Prova", 'StatusProva'>;
    readonly publicadaEm: Prisma.FieldRef<"Prova", 'DateTime'>;
    readonly janelaInicio: Prisma.FieldRef<"Prova", 'DateTime'>;
    readonly janelaFim: Prisma.FieldRef<"Prova", 'DateTime'>;
    readonly versao: Prisma.FieldRef<"Prova", 'Int'>;
    readonly createdBy: Prisma.FieldRef<"Prova", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Prova", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Prova", 'DateTime'>;
}
export type ProvaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
    where: Prisma.ProvaWhereUniqueInput;
};
export type ProvaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
    where: Prisma.ProvaWhereUniqueInput;
};
export type ProvaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
    where?: Prisma.ProvaWhereInput;
    orderBy?: Prisma.ProvaOrderByWithRelationInput | Prisma.ProvaOrderByWithRelationInput[];
    cursor?: Prisma.ProvaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProvaScalarFieldEnum | Prisma.ProvaScalarFieldEnum[];
};
export type ProvaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
    where?: Prisma.ProvaWhereInput;
    orderBy?: Prisma.ProvaOrderByWithRelationInput | Prisma.ProvaOrderByWithRelationInput[];
    cursor?: Prisma.ProvaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProvaScalarFieldEnum | Prisma.ProvaScalarFieldEnum[];
};
export type ProvaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
    where?: Prisma.ProvaWhereInput;
    orderBy?: Prisma.ProvaOrderByWithRelationInput | Prisma.ProvaOrderByWithRelationInput[];
    cursor?: Prisma.ProvaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProvaScalarFieldEnum | Prisma.ProvaScalarFieldEnum[];
};
export type ProvaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProvaCreateInput, Prisma.ProvaUncheckedCreateInput>;
};
export type ProvaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProvaCreateManyInput | Prisma.ProvaCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProvaCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    data: Prisma.ProvaCreateManyInput | Prisma.ProvaCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProvaIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProvaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProvaUpdateInput, Prisma.ProvaUncheckedUpdateInput>;
    where: Prisma.ProvaWhereUniqueInput;
};
export type ProvaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProvaUpdateManyMutationInput, Prisma.ProvaUncheckedUpdateManyInput>;
    where?: Prisma.ProvaWhereInput;
    limit?: number;
};
export type ProvaUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProvaUpdateManyMutationInput, Prisma.ProvaUncheckedUpdateManyInput>;
    where?: Prisma.ProvaWhereInput;
    limit?: number;
    include?: Prisma.ProvaIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProvaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
    where: Prisma.ProvaWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProvaCreateInput, Prisma.ProvaUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProvaUpdateInput, Prisma.ProvaUncheckedUpdateInput>;
};
export type ProvaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
    where: Prisma.ProvaWhereUniqueInput;
};
export type ProvaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProvaWhereInput;
    limit?: number;
};
export type Prova$questoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Prova$respostasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProvaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProvaSelect<ExtArgs> | null;
    omit?: Prisma.ProvaOmit<ExtArgs> | null;
    include?: Prisma.ProvaInclude<ExtArgs> | null;
};

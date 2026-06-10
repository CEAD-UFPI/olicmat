import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EdicaoModel = runtime.Types.Result.DefaultSelection<Prisma.$EdicaoPayload>;
export type AggregateEdicao = {
    _count: EdicaoCountAggregateOutputType | null;
    _avg: EdicaoAvgAggregateOutputType | null;
    _sum: EdicaoSumAggregateOutputType | null;
    _min: EdicaoMinAggregateOutputType | null;
    _max: EdicaoMaxAggregateOutputType | null;
};
export type EdicaoAvgAggregateOutputType = {
    ano: number | null;
    pesoFase1: number | null;
    pesoFase2: number | null;
};
export type EdicaoSumAggregateOutputType = {
    ano: number | null;
    pesoFase1: number | null;
    pesoFase2: number | null;
};
export type EdicaoMinAggregateOutputType = {
    id: string | null;
    ano: number | null;
    titulo: string | null;
    status: string | null;
    dataInicio: Date | null;
    dataFim: Date | null;
    pesoFase1: number | null;
    pesoFase2: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EdicaoMaxAggregateOutputType = {
    id: string | null;
    ano: number | null;
    titulo: string | null;
    status: string | null;
    dataInicio: Date | null;
    dataFim: Date | null;
    pesoFase1: number | null;
    pesoFase2: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EdicaoCountAggregateOutputType = {
    id: number;
    ano: number;
    titulo: number;
    status: number;
    dataInicio: number;
    dataFim: number;
    pesoFase1: number;
    pesoFase2: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type EdicaoAvgAggregateInputType = {
    ano?: true;
    pesoFase1?: true;
    pesoFase2?: true;
};
export type EdicaoSumAggregateInputType = {
    ano?: true;
    pesoFase1?: true;
    pesoFase2?: true;
};
export type EdicaoMinAggregateInputType = {
    id?: true;
    ano?: true;
    titulo?: true;
    status?: true;
    dataInicio?: true;
    dataFim?: true;
    pesoFase1?: true;
    pesoFase2?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EdicaoMaxAggregateInputType = {
    id?: true;
    ano?: true;
    titulo?: true;
    status?: true;
    dataInicio?: true;
    dataFim?: true;
    pesoFase1?: true;
    pesoFase2?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EdicaoCountAggregateInputType = {
    id?: true;
    ano?: true;
    titulo?: true;
    status?: true;
    dataInicio?: true;
    dataFim?: true;
    pesoFase1?: true;
    pesoFase2?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type EdicaoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EdicaoWhereInput;
    orderBy?: Prisma.EdicaoOrderByWithRelationInput | Prisma.EdicaoOrderByWithRelationInput[];
    cursor?: Prisma.EdicaoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EdicaoCountAggregateInputType;
    _avg?: EdicaoAvgAggregateInputType;
    _sum?: EdicaoSumAggregateInputType;
    _min?: EdicaoMinAggregateInputType;
    _max?: EdicaoMaxAggregateInputType;
};
export type GetEdicaoAggregateType<T extends EdicaoAggregateArgs> = {
    [P in keyof T & keyof AggregateEdicao]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEdicao[P]> : Prisma.GetScalarType<T[P], AggregateEdicao[P]>;
};
export type EdicaoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EdicaoWhereInput;
    orderBy?: Prisma.EdicaoOrderByWithAggregationInput | Prisma.EdicaoOrderByWithAggregationInput[];
    by: Prisma.EdicaoScalarFieldEnum[] | Prisma.EdicaoScalarFieldEnum;
    having?: Prisma.EdicaoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EdicaoCountAggregateInputType | true;
    _avg?: EdicaoAvgAggregateInputType;
    _sum?: EdicaoSumAggregateInputType;
    _min?: EdicaoMinAggregateInputType;
    _max?: EdicaoMaxAggregateInputType;
};
export type EdicaoGroupByOutputType = {
    id: string;
    ano: number;
    titulo: string;
    status: string;
    dataInicio: Date | null;
    dataFim: Date | null;
    pesoFase1: number;
    pesoFase2: number;
    createdAt: Date;
    updatedAt: Date;
    _count: EdicaoCountAggregateOutputType | null;
    _avg: EdicaoAvgAggregateOutputType | null;
    _sum: EdicaoSumAggregateOutputType | null;
    _min: EdicaoMinAggregateOutputType | null;
    _max: EdicaoMaxAggregateOutputType | null;
};
export type GetEdicaoGroupByPayload<T extends EdicaoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EdicaoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EdicaoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EdicaoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EdicaoGroupByOutputType[P]>;
}>>;
export type EdicaoWhereInput = {
    AND?: Prisma.EdicaoWhereInput | Prisma.EdicaoWhereInput[];
    OR?: Prisma.EdicaoWhereInput[];
    NOT?: Prisma.EdicaoWhereInput | Prisma.EdicaoWhereInput[];
    id?: Prisma.StringFilter<"Edicao"> | string;
    ano?: Prisma.IntFilter<"Edicao"> | number;
    titulo?: Prisma.StringFilter<"Edicao"> | string;
    status?: Prisma.StringFilter<"Edicao"> | string;
    dataInicio?: Prisma.DateTimeNullableFilter<"Edicao"> | Date | string | null;
    dataFim?: Prisma.DateTimeNullableFilter<"Edicao"> | Date | string | null;
    pesoFase1?: Prisma.FloatFilter<"Edicao"> | number;
    pesoFase2?: Prisma.FloatFilter<"Edicao"> | number;
    createdAt?: Prisma.DateTimeFilter<"Edicao"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Edicao"> | Date | string;
    provas?: Prisma.ProvaListRelationFilter;
    inscricoes?: Prisma.InscricaoListRelationFilter;
};
export type EdicaoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    ano?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dataInicio?: Prisma.SortOrderInput | Prisma.SortOrder;
    dataFim?: Prisma.SortOrderInput | Prisma.SortOrder;
    pesoFase1?: Prisma.SortOrder;
    pesoFase2?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    provas?: Prisma.ProvaOrderByRelationAggregateInput;
    inscricoes?: Prisma.InscricaoOrderByRelationAggregateInput;
};
export type EdicaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    ano?: number;
    AND?: Prisma.EdicaoWhereInput | Prisma.EdicaoWhereInput[];
    OR?: Prisma.EdicaoWhereInput[];
    NOT?: Prisma.EdicaoWhereInput | Prisma.EdicaoWhereInput[];
    titulo?: Prisma.StringFilter<"Edicao"> | string;
    status?: Prisma.StringFilter<"Edicao"> | string;
    dataInicio?: Prisma.DateTimeNullableFilter<"Edicao"> | Date | string | null;
    dataFim?: Prisma.DateTimeNullableFilter<"Edicao"> | Date | string | null;
    pesoFase1?: Prisma.FloatFilter<"Edicao"> | number;
    pesoFase2?: Prisma.FloatFilter<"Edicao"> | number;
    createdAt?: Prisma.DateTimeFilter<"Edicao"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Edicao"> | Date | string;
    provas?: Prisma.ProvaListRelationFilter;
    inscricoes?: Prisma.InscricaoListRelationFilter;
}, "id" | "ano">;
export type EdicaoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    ano?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dataInicio?: Prisma.SortOrderInput | Prisma.SortOrder;
    dataFim?: Prisma.SortOrderInput | Prisma.SortOrder;
    pesoFase1?: Prisma.SortOrder;
    pesoFase2?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.EdicaoCountOrderByAggregateInput;
    _avg?: Prisma.EdicaoAvgOrderByAggregateInput;
    _max?: Prisma.EdicaoMaxOrderByAggregateInput;
    _min?: Prisma.EdicaoMinOrderByAggregateInput;
    _sum?: Prisma.EdicaoSumOrderByAggregateInput;
};
export type EdicaoScalarWhereWithAggregatesInput = {
    AND?: Prisma.EdicaoScalarWhereWithAggregatesInput | Prisma.EdicaoScalarWhereWithAggregatesInput[];
    OR?: Prisma.EdicaoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EdicaoScalarWhereWithAggregatesInput | Prisma.EdicaoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Edicao"> | string;
    ano?: Prisma.IntWithAggregatesFilter<"Edicao"> | number;
    titulo?: Prisma.StringWithAggregatesFilter<"Edicao"> | string;
    status?: Prisma.StringWithAggregatesFilter<"Edicao"> | string;
    dataInicio?: Prisma.DateTimeNullableWithAggregatesFilter<"Edicao"> | Date | string | null;
    dataFim?: Prisma.DateTimeNullableWithAggregatesFilter<"Edicao"> | Date | string | null;
    pesoFase1?: Prisma.FloatWithAggregatesFilter<"Edicao"> | number;
    pesoFase2?: Prisma.FloatWithAggregatesFilter<"Edicao"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Edicao"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Edicao"> | Date | string;
};
export type EdicaoCreateInput = {
    id?: string;
    ano: number;
    titulo: string;
    status?: string;
    dataInicio?: Date | string | null;
    dataFim?: Date | string | null;
    pesoFase1?: number;
    pesoFase2?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    provas?: Prisma.ProvaCreateNestedManyWithoutEdicaoInput;
    inscricoes?: Prisma.InscricaoCreateNestedManyWithoutEdicaoInput;
};
export type EdicaoUncheckedCreateInput = {
    id?: string;
    ano: number;
    titulo: string;
    status?: string;
    dataInicio?: Date | string | null;
    dataFim?: Date | string | null;
    pesoFase1?: number;
    pesoFase2?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    provas?: Prisma.ProvaUncheckedCreateNestedManyWithoutEdicaoInput;
    inscricoes?: Prisma.InscricaoUncheckedCreateNestedManyWithoutEdicaoInput;
};
export type EdicaoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ano?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    dataInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dataFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    pesoFase1?: Prisma.FloatFieldUpdateOperationsInput | number;
    pesoFase2?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    provas?: Prisma.ProvaUpdateManyWithoutEdicaoNestedInput;
    inscricoes?: Prisma.InscricaoUpdateManyWithoutEdicaoNestedInput;
};
export type EdicaoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ano?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    dataInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dataFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    pesoFase1?: Prisma.FloatFieldUpdateOperationsInput | number;
    pesoFase2?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    provas?: Prisma.ProvaUncheckedUpdateManyWithoutEdicaoNestedInput;
    inscricoes?: Prisma.InscricaoUncheckedUpdateManyWithoutEdicaoNestedInput;
};
export type EdicaoCreateManyInput = {
    id?: string;
    ano: number;
    titulo: string;
    status?: string;
    dataInicio?: Date | string | null;
    dataFim?: Date | string | null;
    pesoFase1?: number;
    pesoFase2?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EdicaoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ano?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    dataInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dataFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    pesoFase1?: Prisma.FloatFieldUpdateOperationsInput | number;
    pesoFase2?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdicaoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ano?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    dataInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dataFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    pesoFase1?: Prisma.FloatFieldUpdateOperationsInput | number;
    pesoFase2?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdicaoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ano?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dataInicio?: Prisma.SortOrder;
    dataFim?: Prisma.SortOrder;
    pesoFase1?: Prisma.SortOrder;
    pesoFase2?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EdicaoAvgOrderByAggregateInput = {
    ano?: Prisma.SortOrder;
    pesoFase1?: Prisma.SortOrder;
    pesoFase2?: Prisma.SortOrder;
};
export type EdicaoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ano?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dataInicio?: Prisma.SortOrder;
    dataFim?: Prisma.SortOrder;
    pesoFase1?: Prisma.SortOrder;
    pesoFase2?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EdicaoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ano?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dataInicio?: Prisma.SortOrder;
    dataFim?: Prisma.SortOrder;
    pesoFase1?: Prisma.SortOrder;
    pesoFase2?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EdicaoSumOrderByAggregateInput = {
    ano?: Prisma.SortOrder;
    pesoFase1?: Prisma.SortOrder;
    pesoFase2?: Prisma.SortOrder;
};
export type EdicaoScalarRelationFilter = {
    is?: Prisma.EdicaoWhereInput;
    isNot?: Prisma.EdicaoWhereInput;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EdicaoCreateNestedOneWithoutInscricoesInput = {
    create?: Prisma.XOR<Prisma.EdicaoCreateWithoutInscricoesInput, Prisma.EdicaoUncheckedCreateWithoutInscricoesInput>;
    connectOrCreate?: Prisma.EdicaoCreateOrConnectWithoutInscricoesInput;
    connect?: Prisma.EdicaoWhereUniqueInput;
};
export type EdicaoUpdateOneRequiredWithoutInscricoesNestedInput = {
    create?: Prisma.XOR<Prisma.EdicaoCreateWithoutInscricoesInput, Prisma.EdicaoUncheckedCreateWithoutInscricoesInput>;
    connectOrCreate?: Prisma.EdicaoCreateOrConnectWithoutInscricoesInput;
    upsert?: Prisma.EdicaoUpsertWithoutInscricoesInput;
    connect?: Prisma.EdicaoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EdicaoUpdateToOneWithWhereWithoutInscricoesInput, Prisma.EdicaoUpdateWithoutInscricoesInput>, Prisma.EdicaoUncheckedUpdateWithoutInscricoesInput>;
};
export type EdicaoCreateNestedOneWithoutProvasInput = {
    create?: Prisma.XOR<Prisma.EdicaoCreateWithoutProvasInput, Prisma.EdicaoUncheckedCreateWithoutProvasInput>;
    connectOrCreate?: Prisma.EdicaoCreateOrConnectWithoutProvasInput;
    connect?: Prisma.EdicaoWhereUniqueInput;
};
export type EdicaoUpdateOneRequiredWithoutProvasNestedInput = {
    create?: Prisma.XOR<Prisma.EdicaoCreateWithoutProvasInput, Prisma.EdicaoUncheckedCreateWithoutProvasInput>;
    connectOrCreate?: Prisma.EdicaoCreateOrConnectWithoutProvasInput;
    upsert?: Prisma.EdicaoUpsertWithoutProvasInput;
    connect?: Prisma.EdicaoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EdicaoUpdateToOneWithWhereWithoutProvasInput, Prisma.EdicaoUpdateWithoutProvasInput>, Prisma.EdicaoUncheckedUpdateWithoutProvasInput>;
};
export type EdicaoCreateWithoutInscricoesInput = {
    id?: string;
    ano: number;
    titulo: string;
    status?: string;
    dataInicio?: Date | string | null;
    dataFim?: Date | string | null;
    pesoFase1?: number;
    pesoFase2?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    provas?: Prisma.ProvaCreateNestedManyWithoutEdicaoInput;
};
export type EdicaoUncheckedCreateWithoutInscricoesInput = {
    id?: string;
    ano: number;
    titulo: string;
    status?: string;
    dataInicio?: Date | string | null;
    dataFim?: Date | string | null;
    pesoFase1?: number;
    pesoFase2?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    provas?: Prisma.ProvaUncheckedCreateNestedManyWithoutEdicaoInput;
};
export type EdicaoCreateOrConnectWithoutInscricoesInput = {
    where: Prisma.EdicaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.EdicaoCreateWithoutInscricoesInput, Prisma.EdicaoUncheckedCreateWithoutInscricoesInput>;
};
export type EdicaoUpsertWithoutInscricoesInput = {
    update: Prisma.XOR<Prisma.EdicaoUpdateWithoutInscricoesInput, Prisma.EdicaoUncheckedUpdateWithoutInscricoesInput>;
    create: Prisma.XOR<Prisma.EdicaoCreateWithoutInscricoesInput, Prisma.EdicaoUncheckedCreateWithoutInscricoesInput>;
    where?: Prisma.EdicaoWhereInput;
};
export type EdicaoUpdateToOneWithWhereWithoutInscricoesInput = {
    where?: Prisma.EdicaoWhereInput;
    data: Prisma.XOR<Prisma.EdicaoUpdateWithoutInscricoesInput, Prisma.EdicaoUncheckedUpdateWithoutInscricoesInput>;
};
export type EdicaoUpdateWithoutInscricoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ano?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    dataInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dataFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    pesoFase1?: Prisma.FloatFieldUpdateOperationsInput | number;
    pesoFase2?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    provas?: Prisma.ProvaUpdateManyWithoutEdicaoNestedInput;
};
export type EdicaoUncheckedUpdateWithoutInscricoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ano?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    dataInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dataFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    pesoFase1?: Prisma.FloatFieldUpdateOperationsInput | number;
    pesoFase2?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    provas?: Prisma.ProvaUncheckedUpdateManyWithoutEdicaoNestedInput;
};
export type EdicaoCreateWithoutProvasInput = {
    id?: string;
    ano: number;
    titulo: string;
    status?: string;
    dataInicio?: Date | string | null;
    dataFim?: Date | string | null;
    pesoFase1?: number;
    pesoFase2?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricoes?: Prisma.InscricaoCreateNestedManyWithoutEdicaoInput;
};
export type EdicaoUncheckedCreateWithoutProvasInput = {
    id?: string;
    ano: number;
    titulo: string;
    status?: string;
    dataInicio?: Date | string | null;
    dataFim?: Date | string | null;
    pesoFase1?: number;
    pesoFase2?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricoes?: Prisma.InscricaoUncheckedCreateNestedManyWithoutEdicaoInput;
};
export type EdicaoCreateOrConnectWithoutProvasInput = {
    where: Prisma.EdicaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.EdicaoCreateWithoutProvasInput, Prisma.EdicaoUncheckedCreateWithoutProvasInput>;
};
export type EdicaoUpsertWithoutProvasInput = {
    update: Prisma.XOR<Prisma.EdicaoUpdateWithoutProvasInput, Prisma.EdicaoUncheckedUpdateWithoutProvasInput>;
    create: Prisma.XOR<Prisma.EdicaoCreateWithoutProvasInput, Prisma.EdicaoUncheckedCreateWithoutProvasInput>;
    where?: Prisma.EdicaoWhereInput;
};
export type EdicaoUpdateToOneWithWhereWithoutProvasInput = {
    where?: Prisma.EdicaoWhereInput;
    data: Prisma.XOR<Prisma.EdicaoUpdateWithoutProvasInput, Prisma.EdicaoUncheckedUpdateWithoutProvasInput>;
};
export type EdicaoUpdateWithoutProvasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ano?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    dataInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dataFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    pesoFase1?: Prisma.FloatFieldUpdateOperationsInput | number;
    pesoFase2?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricoes?: Prisma.InscricaoUpdateManyWithoutEdicaoNestedInput;
};
export type EdicaoUncheckedUpdateWithoutProvasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ano?: Prisma.IntFieldUpdateOperationsInput | number;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    dataInicio?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dataFim?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    pesoFase1?: Prisma.FloatFieldUpdateOperationsInput | number;
    pesoFase2?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricoes?: Prisma.InscricaoUncheckedUpdateManyWithoutEdicaoNestedInput;
};
export type EdicaoCountOutputType = {
    provas: number;
    inscricoes: number;
};
export type EdicaoCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    provas?: boolean | EdicaoCountOutputTypeCountProvasArgs;
    inscricoes?: boolean | EdicaoCountOutputTypeCountInscricoesArgs;
};
export type EdicaoCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoCountOutputTypeSelect<ExtArgs> | null;
};
export type EdicaoCountOutputTypeCountProvasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProvaWhereInput;
};
export type EdicaoCountOutputTypeCountInscricoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InscricaoWhereInput;
};
export type EdicaoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ano?: boolean;
    titulo?: boolean;
    status?: boolean;
    dataInicio?: boolean;
    dataFim?: boolean;
    pesoFase1?: boolean;
    pesoFase2?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    provas?: boolean | Prisma.Edicao$provasArgs<ExtArgs>;
    inscricoes?: boolean | Prisma.Edicao$inscricoesArgs<ExtArgs>;
    _count?: boolean | Prisma.EdicaoCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["edicao"]>;
export type EdicaoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ano?: boolean;
    titulo?: boolean;
    status?: boolean;
    dataInicio?: boolean;
    dataFim?: boolean;
    pesoFase1?: boolean;
    pesoFase2?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["edicao"]>;
export type EdicaoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ano?: boolean;
    titulo?: boolean;
    status?: boolean;
    dataInicio?: boolean;
    dataFim?: boolean;
    pesoFase1?: boolean;
    pesoFase2?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["edicao"]>;
export type EdicaoSelectScalar = {
    id?: boolean;
    ano?: boolean;
    titulo?: boolean;
    status?: boolean;
    dataInicio?: boolean;
    dataFim?: boolean;
    pesoFase1?: boolean;
    pesoFase2?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type EdicaoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "ano" | "titulo" | "status" | "dataInicio" | "dataFim" | "pesoFase1" | "pesoFase2" | "createdAt" | "updatedAt", ExtArgs["result"]["edicao"]>;
export type EdicaoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    provas?: boolean | Prisma.Edicao$provasArgs<ExtArgs>;
    inscricoes?: boolean | Prisma.Edicao$inscricoesArgs<ExtArgs>;
    _count?: boolean | Prisma.EdicaoCountOutputTypeDefaultArgs<ExtArgs>;
};
export type EdicaoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type EdicaoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $EdicaoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Edicao";
    objects: {
        provas: Prisma.$ProvaPayload<ExtArgs>[];
        inscricoes: Prisma.$InscricaoPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        ano: number;
        titulo: string;
        status: string;
        dataInicio: Date | null;
        dataFim: Date | null;
        pesoFase1: number;
        pesoFase2: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["edicao"]>;
    composites: {};
};
export type EdicaoGetPayload<S extends boolean | null | undefined | EdicaoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EdicaoPayload, S>;
export type EdicaoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EdicaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EdicaoCountAggregateInputType | true;
};
export interface EdicaoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Edicao'];
        meta: {
            name: 'Edicao';
        };
    };
    findUnique<T extends EdicaoFindUniqueArgs>(args: Prisma.SelectSubset<T, EdicaoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EdicaoClient<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EdicaoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EdicaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EdicaoClient<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EdicaoFindFirstArgs>(args?: Prisma.SelectSubset<T, EdicaoFindFirstArgs<ExtArgs>>): Prisma.Prisma__EdicaoClient<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EdicaoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EdicaoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EdicaoClient<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EdicaoFindManyArgs>(args?: Prisma.SelectSubset<T, EdicaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EdicaoCreateArgs>(args: Prisma.SelectSubset<T, EdicaoCreateArgs<ExtArgs>>): Prisma.Prisma__EdicaoClient<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EdicaoCreateManyArgs>(args?: Prisma.SelectSubset<T, EdicaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EdicaoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EdicaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EdicaoDeleteArgs>(args: Prisma.SelectSubset<T, EdicaoDeleteArgs<ExtArgs>>): Prisma.Prisma__EdicaoClient<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EdicaoUpdateArgs>(args: Prisma.SelectSubset<T, EdicaoUpdateArgs<ExtArgs>>): Prisma.Prisma__EdicaoClient<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EdicaoDeleteManyArgs>(args?: Prisma.SelectSubset<T, EdicaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EdicaoUpdateManyArgs>(args: Prisma.SelectSubset<T, EdicaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EdicaoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EdicaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EdicaoUpsertArgs>(args: Prisma.SelectSubset<T, EdicaoUpsertArgs<ExtArgs>>): Prisma.Prisma__EdicaoClient<runtime.Types.Result.GetResult<Prisma.$EdicaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EdicaoCountArgs>(args?: Prisma.Subset<T, EdicaoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EdicaoCountAggregateOutputType> : number>;
    aggregate<T extends EdicaoAggregateArgs>(args: Prisma.Subset<T, EdicaoAggregateArgs>): Prisma.PrismaPromise<GetEdicaoAggregateType<T>>;
    groupBy<T extends EdicaoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EdicaoGroupByArgs['orderBy'];
    } : {
        orderBy?: EdicaoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EdicaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEdicaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EdicaoFieldRefs;
}
export interface Prisma__EdicaoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    provas<T extends Prisma.Edicao$provasArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Edicao$provasArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProvaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    inscricoes<T extends Prisma.Edicao$inscricoesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Edicao$inscricoesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InscricaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EdicaoFieldRefs {
    readonly id: Prisma.FieldRef<"Edicao", 'String'>;
    readonly ano: Prisma.FieldRef<"Edicao", 'Int'>;
    readonly titulo: Prisma.FieldRef<"Edicao", 'String'>;
    readonly status: Prisma.FieldRef<"Edicao", 'String'>;
    readonly dataInicio: Prisma.FieldRef<"Edicao", 'DateTime'>;
    readonly dataFim: Prisma.FieldRef<"Edicao", 'DateTime'>;
    readonly pesoFase1: Prisma.FieldRef<"Edicao", 'Float'>;
    readonly pesoFase2: Prisma.FieldRef<"Edicao", 'Float'>;
    readonly createdAt: Prisma.FieldRef<"Edicao", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Edicao", 'DateTime'>;
}
export type EdicaoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
    where: Prisma.EdicaoWhereUniqueInput;
};
export type EdicaoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
    where: Prisma.EdicaoWhereUniqueInput;
};
export type EdicaoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
    where?: Prisma.EdicaoWhereInput;
    orderBy?: Prisma.EdicaoOrderByWithRelationInput | Prisma.EdicaoOrderByWithRelationInput[];
    cursor?: Prisma.EdicaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EdicaoScalarFieldEnum | Prisma.EdicaoScalarFieldEnum[];
};
export type EdicaoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
    where?: Prisma.EdicaoWhereInput;
    orderBy?: Prisma.EdicaoOrderByWithRelationInput | Prisma.EdicaoOrderByWithRelationInput[];
    cursor?: Prisma.EdicaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EdicaoScalarFieldEnum | Prisma.EdicaoScalarFieldEnum[];
};
export type EdicaoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
    where?: Prisma.EdicaoWhereInput;
    orderBy?: Prisma.EdicaoOrderByWithRelationInput | Prisma.EdicaoOrderByWithRelationInput[];
    cursor?: Prisma.EdicaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EdicaoScalarFieldEnum | Prisma.EdicaoScalarFieldEnum[];
};
export type EdicaoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EdicaoCreateInput, Prisma.EdicaoUncheckedCreateInput>;
};
export type EdicaoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EdicaoCreateManyInput | Prisma.EdicaoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EdicaoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    data: Prisma.EdicaoCreateManyInput | Prisma.EdicaoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EdicaoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EdicaoUpdateInput, Prisma.EdicaoUncheckedUpdateInput>;
    where: Prisma.EdicaoWhereUniqueInput;
};
export type EdicaoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EdicaoUpdateManyMutationInput, Prisma.EdicaoUncheckedUpdateManyInput>;
    where?: Prisma.EdicaoWhereInput;
    limit?: number;
};
export type EdicaoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EdicaoUpdateManyMutationInput, Prisma.EdicaoUncheckedUpdateManyInput>;
    where?: Prisma.EdicaoWhereInput;
    limit?: number;
};
export type EdicaoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
    where: Prisma.EdicaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.EdicaoCreateInput, Prisma.EdicaoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EdicaoUpdateInput, Prisma.EdicaoUncheckedUpdateInput>;
};
export type EdicaoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
    where: Prisma.EdicaoWhereUniqueInput;
};
export type EdicaoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EdicaoWhereInput;
    limit?: number;
};
export type Edicao$provasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Edicao$inscricoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InscricaoSelect<ExtArgs> | null;
    omit?: Prisma.InscricaoOmit<ExtArgs> | null;
    include?: Prisma.InscricaoInclude<ExtArgs> | null;
    where?: Prisma.InscricaoWhereInput;
    orderBy?: Prisma.InscricaoOrderByWithRelationInput | Prisma.InscricaoOrderByWithRelationInput[];
    cursor?: Prisma.InscricaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InscricaoScalarFieldEnum | Prisma.InscricaoScalarFieldEnum[];
};
export type EdicaoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdicaoSelect<ExtArgs> | null;
    omit?: Prisma.EdicaoOmit<ExtArgs> | null;
    include?: Prisma.EdicaoInclude<ExtArgs> | null;
};

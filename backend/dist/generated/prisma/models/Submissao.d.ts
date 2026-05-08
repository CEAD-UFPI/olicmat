import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SubmissaoModel = runtime.Types.Result.DefaultSelection<Prisma.$SubmissaoPayload>;
export type AggregateSubmissao = {
    _count: SubmissaoCountAggregateOutputType | null;
    _min: SubmissaoMinAggregateOutputType | null;
    _max: SubmissaoMaxAggregateOutputType | null;
};
export type SubmissaoMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    tipo: $Enums.TipoSubm | null;
    titulo: string | null;
    resumo: string | null;
    arquivoUrl: string | null;
    status: $Enums.StatusSubm | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubmissaoMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    tipo: $Enums.TipoSubm | null;
    titulo: string | null;
    resumo: string | null;
    arquivoUrl: string | null;
    status: $Enums.StatusSubm | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubmissaoCountAggregateOutputType = {
    id: number;
    userId: number;
    tipo: number;
    titulo: number;
    resumo: number;
    arquivoUrl: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SubmissaoMinAggregateInputType = {
    id?: true;
    userId?: true;
    tipo?: true;
    titulo?: true;
    resumo?: true;
    arquivoUrl?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubmissaoMaxAggregateInputType = {
    id?: true;
    userId?: true;
    tipo?: true;
    titulo?: true;
    resumo?: true;
    arquivoUrl?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubmissaoCountAggregateInputType = {
    id?: true;
    userId?: true;
    tipo?: true;
    titulo?: true;
    resumo?: true;
    arquivoUrl?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SubmissaoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissaoWhereInput;
    orderBy?: Prisma.SubmissaoOrderByWithRelationInput | Prisma.SubmissaoOrderByWithRelationInput[];
    cursor?: Prisma.SubmissaoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubmissaoCountAggregateInputType;
    _min?: SubmissaoMinAggregateInputType;
    _max?: SubmissaoMaxAggregateInputType;
};
export type GetSubmissaoAggregateType<T extends SubmissaoAggregateArgs> = {
    [P in keyof T & keyof AggregateSubmissao]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubmissao[P]> : Prisma.GetScalarType<T[P], AggregateSubmissao[P]>;
};
export type SubmissaoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissaoWhereInput;
    orderBy?: Prisma.SubmissaoOrderByWithAggregationInput | Prisma.SubmissaoOrderByWithAggregationInput[];
    by: Prisma.SubmissaoScalarFieldEnum[] | Prisma.SubmissaoScalarFieldEnum;
    having?: Prisma.SubmissaoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubmissaoCountAggregateInputType | true;
    _min?: SubmissaoMinAggregateInputType;
    _max?: SubmissaoMaxAggregateInputType;
};
export type SubmissaoGroupByOutputType = {
    id: string;
    userId: string;
    tipo: $Enums.TipoSubm;
    titulo: string;
    resumo: string;
    arquivoUrl: string;
    status: $Enums.StatusSubm;
    createdAt: Date;
    updatedAt: Date;
    _count: SubmissaoCountAggregateOutputType | null;
    _min: SubmissaoMinAggregateOutputType | null;
    _max: SubmissaoMaxAggregateOutputType | null;
};
export type GetSubmissaoGroupByPayload<T extends SubmissaoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubmissaoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubmissaoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubmissaoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubmissaoGroupByOutputType[P]>;
}>>;
export type SubmissaoWhereInput = {
    AND?: Prisma.SubmissaoWhereInput | Prisma.SubmissaoWhereInput[];
    OR?: Prisma.SubmissaoWhereInput[];
    NOT?: Prisma.SubmissaoWhereInput | Prisma.SubmissaoWhereInput[];
    id?: Prisma.StringFilter<"Submissao"> | string;
    userId?: Prisma.StringFilter<"Submissao"> | string;
    tipo?: Prisma.EnumTipoSubmFilter<"Submissao"> | $Enums.TipoSubm;
    titulo?: Prisma.StringFilter<"Submissao"> | string;
    resumo?: Prisma.StringFilter<"Submissao"> | string;
    arquivoUrl?: Prisma.StringFilter<"Submissao"> | string;
    status?: Prisma.EnumStatusSubmFilter<"Submissao"> | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFilter<"Submissao"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Submissao"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type SubmissaoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    resumo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type SubmissaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SubmissaoWhereInput | Prisma.SubmissaoWhereInput[];
    OR?: Prisma.SubmissaoWhereInput[];
    NOT?: Prisma.SubmissaoWhereInput | Prisma.SubmissaoWhereInput[];
    userId?: Prisma.StringFilter<"Submissao"> | string;
    tipo?: Prisma.EnumTipoSubmFilter<"Submissao"> | $Enums.TipoSubm;
    titulo?: Prisma.StringFilter<"Submissao"> | string;
    resumo?: Prisma.StringFilter<"Submissao"> | string;
    arquivoUrl?: Prisma.StringFilter<"Submissao"> | string;
    status?: Prisma.EnumStatusSubmFilter<"Submissao"> | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFilter<"Submissao"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Submissao"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type SubmissaoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    resumo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SubmissaoCountOrderByAggregateInput;
    _max?: Prisma.SubmissaoMaxOrderByAggregateInput;
    _min?: Prisma.SubmissaoMinOrderByAggregateInput;
};
export type SubmissaoScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubmissaoScalarWhereWithAggregatesInput | Prisma.SubmissaoScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubmissaoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubmissaoScalarWhereWithAggregatesInput | Prisma.SubmissaoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Submissao"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Submissao"> | string;
    tipo?: Prisma.EnumTipoSubmWithAggregatesFilter<"Submissao"> | $Enums.TipoSubm;
    titulo?: Prisma.StringWithAggregatesFilter<"Submissao"> | string;
    resumo?: Prisma.StringWithAggregatesFilter<"Submissao"> | string;
    arquivoUrl?: Prisma.StringWithAggregatesFilter<"Submissao"> | string;
    status?: Prisma.EnumStatusSubmWithAggregatesFilter<"Submissao"> | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Submissao"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Submissao"> | Date | string;
};
export type SubmissaoCreateInput = {
    id?: string;
    tipo: $Enums.TipoSubm;
    titulo: string;
    resumo: string;
    arquivoUrl: string;
    status?: $Enums.StatusSubm;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSubmissoesInput;
};
export type SubmissaoUncheckedCreateInput = {
    id?: string;
    userId: string;
    tipo: $Enums.TipoSubm;
    titulo: string;
    resumo: string;
    arquivoUrl: string;
    status?: $Enums.StatusSubm;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubmissaoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.EnumTipoSubmFieldUpdateOperationsInput | $Enums.TipoSubm;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    resumo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusSubmFieldUpdateOperationsInput | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSubmissoesNestedInput;
};
export type SubmissaoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.EnumTipoSubmFieldUpdateOperationsInput | $Enums.TipoSubm;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    resumo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusSubmFieldUpdateOperationsInput | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissaoCreateManyInput = {
    id?: string;
    userId: string;
    tipo: $Enums.TipoSubm;
    titulo: string;
    resumo: string;
    arquivoUrl: string;
    status?: $Enums.StatusSubm;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubmissaoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.EnumTipoSubmFieldUpdateOperationsInput | $Enums.TipoSubm;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    resumo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusSubmFieldUpdateOperationsInput | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissaoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.EnumTipoSubmFieldUpdateOperationsInput | $Enums.TipoSubm;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    resumo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusSubmFieldUpdateOperationsInput | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissaoListRelationFilter = {
    every?: Prisma.SubmissaoWhereInput;
    some?: Prisma.SubmissaoWhereInput;
    none?: Prisma.SubmissaoWhereInput;
};
export type SubmissaoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SubmissaoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    resumo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubmissaoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    resumo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubmissaoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    tipo?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    resumo?: Prisma.SortOrder;
    arquivoUrl?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubmissaoCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SubmissaoCreateWithoutUserInput, Prisma.SubmissaoUncheckedCreateWithoutUserInput> | Prisma.SubmissaoCreateWithoutUserInput[] | Prisma.SubmissaoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubmissaoCreateOrConnectWithoutUserInput | Prisma.SubmissaoCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SubmissaoCreateManyUserInputEnvelope;
    connect?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
};
export type SubmissaoUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SubmissaoCreateWithoutUserInput, Prisma.SubmissaoUncheckedCreateWithoutUserInput> | Prisma.SubmissaoCreateWithoutUserInput[] | Prisma.SubmissaoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubmissaoCreateOrConnectWithoutUserInput | Prisma.SubmissaoCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SubmissaoCreateManyUserInputEnvelope;
    connect?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
};
export type SubmissaoUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SubmissaoCreateWithoutUserInput, Prisma.SubmissaoUncheckedCreateWithoutUserInput> | Prisma.SubmissaoCreateWithoutUserInput[] | Prisma.SubmissaoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubmissaoCreateOrConnectWithoutUserInput | Prisma.SubmissaoCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SubmissaoUpsertWithWhereUniqueWithoutUserInput | Prisma.SubmissaoUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SubmissaoCreateManyUserInputEnvelope;
    set?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
    disconnect?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
    delete?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
    connect?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
    update?: Prisma.SubmissaoUpdateWithWhereUniqueWithoutUserInput | Prisma.SubmissaoUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SubmissaoUpdateManyWithWhereWithoutUserInput | Prisma.SubmissaoUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SubmissaoScalarWhereInput | Prisma.SubmissaoScalarWhereInput[];
};
export type SubmissaoUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SubmissaoCreateWithoutUserInput, Prisma.SubmissaoUncheckedCreateWithoutUserInput> | Prisma.SubmissaoCreateWithoutUserInput[] | Prisma.SubmissaoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubmissaoCreateOrConnectWithoutUserInput | Prisma.SubmissaoCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SubmissaoUpsertWithWhereUniqueWithoutUserInput | Prisma.SubmissaoUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SubmissaoCreateManyUserInputEnvelope;
    set?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
    disconnect?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
    delete?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
    connect?: Prisma.SubmissaoWhereUniqueInput | Prisma.SubmissaoWhereUniqueInput[];
    update?: Prisma.SubmissaoUpdateWithWhereUniqueWithoutUserInput | Prisma.SubmissaoUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SubmissaoUpdateManyWithWhereWithoutUserInput | Prisma.SubmissaoUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SubmissaoScalarWhereInput | Prisma.SubmissaoScalarWhereInput[];
};
export type EnumTipoSubmFieldUpdateOperationsInput = {
    set?: $Enums.TipoSubm;
};
export type EnumStatusSubmFieldUpdateOperationsInput = {
    set?: $Enums.StatusSubm;
};
export type SubmissaoCreateWithoutUserInput = {
    id?: string;
    tipo: $Enums.TipoSubm;
    titulo: string;
    resumo: string;
    arquivoUrl: string;
    status?: $Enums.StatusSubm;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubmissaoUncheckedCreateWithoutUserInput = {
    id?: string;
    tipo: $Enums.TipoSubm;
    titulo: string;
    resumo: string;
    arquivoUrl: string;
    status?: $Enums.StatusSubm;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubmissaoCreateOrConnectWithoutUserInput = {
    where: Prisma.SubmissaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubmissaoCreateWithoutUserInput, Prisma.SubmissaoUncheckedCreateWithoutUserInput>;
};
export type SubmissaoCreateManyUserInputEnvelope = {
    data: Prisma.SubmissaoCreateManyUserInput | Prisma.SubmissaoCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SubmissaoUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SubmissaoWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubmissaoUpdateWithoutUserInput, Prisma.SubmissaoUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SubmissaoCreateWithoutUserInput, Prisma.SubmissaoUncheckedCreateWithoutUserInput>;
};
export type SubmissaoUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SubmissaoWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubmissaoUpdateWithoutUserInput, Prisma.SubmissaoUncheckedUpdateWithoutUserInput>;
};
export type SubmissaoUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SubmissaoScalarWhereInput;
    data: Prisma.XOR<Prisma.SubmissaoUpdateManyMutationInput, Prisma.SubmissaoUncheckedUpdateManyWithoutUserInput>;
};
export type SubmissaoScalarWhereInput = {
    AND?: Prisma.SubmissaoScalarWhereInput | Prisma.SubmissaoScalarWhereInput[];
    OR?: Prisma.SubmissaoScalarWhereInput[];
    NOT?: Prisma.SubmissaoScalarWhereInput | Prisma.SubmissaoScalarWhereInput[];
    id?: Prisma.StringFilter<"Submissao"> | string;
    userId?: Prisma.StringFilter<"Submissao"> | string;
    tipo?: Prisma.EnumTipoSubmFilter<"Submissao"> | $Enums.TipoSubm;
    titulo?: Prisma.StringFilter<"Submissao"> | string;
    resumo?: Prisma.StringFilter<"Submissao"> | string;
    arquivoUrl?: Prisma.StringFilter<"Submissao"> | string;
    status?: Prisma.EnumStatusSubmFilter<"Submissao"> | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFilter<"Submissao"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Submissao"> | Date | string;
};
export type SubmissaoCreateManyUserInput = {
    id?: string;
    tipo: $Enums.TipoSubm;
    titulo: string;
    resumo: string;
    arquivoUrl: string;
    status?: $Enums.StatusSubm;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubmissaoUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.EnumTipoSubmFieldUpdateOperationsInput | $Enums.TipoSubm;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    resumo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusSubmFieldUpdateOperationsInput | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissaoUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.EnumTipoSubmFieldUpdateOperationsInput | $Enums.TipoSubm;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    resumo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusSubmFieldUpdateOperationsInput | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissaoUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tipo?: Prisma.EnumTipoSubmFieldUpdateOperationsInput | $Enums.TipoSubm;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    resumo?: Prisma.StringFieldUpdateOperationsInput | string;
    arquivoUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusSubmFieldUpdateOperationsInput | $Enums.StatusSubm;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissaoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    tipo?: boolean;
    titulo?: boolean;
    resumo?: boolean;
    arquivoUrl?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["submissao"]>;
export type SubmissaoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    tipo?: boolean;
    titulo?: boolean;
    resumo?: boolean;
    arquivoUrl?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["submissao"]>;
export type SubmissaoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    tipo?: boolean;
    titulo?: boolean;
    resumo?: boolean;
    arquivoUrl?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["submissao"]>;
export type SubmissaoSelectScalar = {
    id?: boolean;
    userId?: boolean;
    tipo?: boolean;
    titulo?: boolean;
    resumo?: boolean;
    arquivoUrl?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SubmissaoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "tipo" | "titulo" | "resumo" | "arquivoUrl" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["submissao"]>;
export type SubmissaoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type SubmissaoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type SubmissaoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $SubmissaoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Submissao";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        tipo: $Enums.TipoSubm;
        titulo: string;
        resumo: string;
        arquivoUrl: string;
        status: $Enums.StatusSubm;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["submissao"]>;
    composites: {};
};
export type SubmissaoGetPayload<S extends boolean | null | undefined | SubmissaoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload, S>;
export type SubmissaoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubmissaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubmissaoCountAggregateInputType | true;
};
export interface SubmissaoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Submissao'];
        meta: {
            name: 'Submissao';
        };
    };
    findUnique<T extends SubmissaoFindUniqueArgs>(args: Prisma.SelectSubset<T, SubmissaoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubmissaoClient<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubmissaoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubmissaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubmissaoClient<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubmissaoFindFirstArgs>(args?: Prisma.SelectSubset<T, SubmissaoFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubmissaoClient<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubmissaoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubmissaoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubmissaoClient<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubmissaoFindManyArgs>(args?: Prisma.SelectSubset<T, SubmissaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubmissaoCreateArgs>(args: Prisma.SelectSubset<T, SubmissaoCreateArgs<ExtArgs>>): Prisma.Prisma__SubmissaoClient<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubmissaoCreateManyArgs>(args?: Prisma.SelectSubset<T, SubmissaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubmissaoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubmissaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubmissaoDeleteArgs>(args: Prisma.SelectSubset<T, SubmissaoDeleteArgs<ExtArgs>>): Prisma.Prisma__SubmissaoClient<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubmissaoUpdateArgs>(args: Prisma.SelectSubset<T, SubmissaoUpdateArgs<ExtArgs>>): Prisma.Prisma__SubmissaoClient<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubmissaoDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubmissaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubmissaoUpdateManyArgs>(args: Prisma.SelectSubset<T, SubmissaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubmissaoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubmissaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubmissaoUpsertArgs>(args: Prisma.SelectSubset<T, SubmissaoUpsertArgs<ExtArgs>>): Prisma.Prisma__SubmissaoClient<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubmissaoCountArgs>(args?: Prisma.Subset<T, SubmissaoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubmissaoCountAggregateOutputType> : number>;
    aggregate<T extends SubmissaoAggregateArgs>(args: Prisma.Subset<T, SubmissaoAggregateArgs>): Prisma.PrismaPromise<GetSubmissaoAggregateType<T>>;
    groupBy<T extends SubmissaoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubmissaoGroupByArgs['orderBy'];
    } : {
        orderBy?: SubmissaoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubmissaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubmissaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubmissaoFieldRefs;
}
export interface Prisma__SubmissaoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubmissaoFieldRefs {
    readonly id: Prisma.FieldRef<"Submissao", 'String'>;
    readonly userId: Prisma.FieldRef<"Submissao", 'String'>;
    readonly tipo: Prisma.FieldRef<"Submissao", 'TipoSubm'>;
    readonly titulo: Prisma.FieldRef<"Submissao", 'String'>;
    readonly resumo: Prisma.FieldRef<"Submissao", 'String'>;
    readonly arquivoUrl: Prisma.FieldRef<"Submissao", 'String'>;
    readonly status: Prisma.FieldRef<"Submissao", 'StatusSubm'>;
    readonly createdAt: Prisma.FieldRef<"Submissao", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Submissao", 'DateTime'>;
}
export type SubmissaoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
    where: Prisma.SubmissaoWhereUniqueInput;
};
export type SubmissaoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
    where: Prisma.SubmissaoWhereUniqueInput;
};
export type SubmissaoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
    where?: Prisma.SubmissaoWhereInput;
    orderBy?: Prisma.SubmissaoOrderByWithRelationInput | Prisma.SubmissaoOrderByWithRelationInput[];
    cursor?: Prisma.SubmissaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubmissaoScalarFieldEnum | Prisma.SubmissaoScalarFieldEnum[];
};
export type SubmissaoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
    where?: Prisma.SubmissaoWhereInput;
    orderBy?: Prisma.SubmissaoOrderByWithRelationInput | Prisma.SubmissaoOrderByWithRelationInput[];
    cursor?: Prisma.SubmissaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubmissaoScalarFieldEnum | Prisma.SubmissaoScalarFieldEnum[];
};
export type SubmissaoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
    where?: Prisma.SubmissaoWhereInput;
    orderBy?: Prisma.SubmissaoOrderByWithRelationInput | Prisma.SubmissaoOrderByWithRelationInput[];
    cursor?: Prisma.SubmissaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubmissaoScalarFieldEnum | Prisma.SubmissaoScalarFieldEnum[];
};
export type SubmissaoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubmissaoCreateInput, Prisma.SubmissaoUncheckedCreateInput>;
};
export type SubmissaoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubmissaoCreateManyInput | Prisma.SubmissaoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubmissaoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    data: Prisma.SubmissaoCreateManyInput | Prisma.SubmissaoCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SubmissaoIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SubmissaoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubmissaoUpdateInput, Prisma.SubmissaoUncheckedUpdateInput>;
    where: Prisma.SubmissaoWhereUniqueInput;
};
export type SubmissaoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubmissaoUpdateManyMutationInput, Prisma.SubmissaoUncheckedUpdateManyInput>;
    where?: Prisma.SubmissaoWhereInput;
    limit?: number;
};
export type SubmissaoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubmissaoUpdateManyMutationInput, Prisma.SubmissaoUncheckedUpdateManyInput>;
    where?: Prisma.SubmissaoWhereInput;
    limit?: number;
    include?: Prisma.SubmissaoIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SubmissaoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
    where: Prisma.SubmissaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubmissaoCreateInput, Prisma.SubmissaoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubmissaoUpdateInput, Prisma.SubmissaoUncheckedUpdateInput>;
};
export type SubmissaoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
    where: Prisma.SubmissaoWhereUniqueInput;
};
export type SubmissaoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissaoWhereInput;
    limit?: number;
};
export type SubmissaoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissaoSelect<ExtArgs> | null;
    omit?: Prisma.SubmissaoOmit<ExtArgs> | null;
    include?: Prisma.SubmissaoInclude<ExtArgs> | null;
};

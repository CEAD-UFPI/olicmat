import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CoordenadorCursoModel = runtime.Types.Result.DefaultSelection<Prisma.$CoordenadorCursoPayload>;
export type AggregateCoordenadorCurso = {
    _count: CoordenadorCursoCountAggregateOutputType | null;
    _min: CoordenadorCursoMinAggregateOutputType | null;
    _max: CoordenadorCursoMaxAggregateOutputType | null;
};
export type CoordenadorCursoMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    cursoId: string | null;
};
export type CoordenadorCursoMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    cursoId: string | null;
};
export type CoordenadorCursoCountAggregateOutputType = {
    id: number;
    userId: number;
    cursoId: number;
    _all: number;
};
export type CoordenadorCursoMinAggregateInputType = {
    id?: true;
    userId?: true;
    cursoId?: true;
};
export type CoordenadorCursoMaxAggregateInputType = {
    id?: true;
    userId?: true;
    cursoId?: true;
};
export type CoordenadorCursoCountAggregateInputType = {
    id?: true;
    userId?: true;
    cursoId?: true;
    _all?: true;
};
export type CoordenadorCursoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CoordenadorCursoWhereInput;
    orderBy?: Prisma.CoordenadorCursoOrderByWithRelationInput | Prisma.CoordenadorCursoOrderByWithRelationInput[];
    cursor?: Prisma.CoordenadorCursoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CoordenadorCursoCountAggregateInputType;
    _min?: CoordenadorCursoMinAggregateInputType;
    _max?: CoordenadorCursoMaxAggregateInputType;
};
export type GetCoordenadorCursoAggregateType<T extends CoordenadorCursoAggregateArgs> = {
    [P in keyof T & keyof AggregateCoordenadorCurso]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCoordenadorCurso[P]> : Prisma.GetScalarType<T[P], AggregateCoordenadorCurso[P]>;
};
export type CoordenadorCursoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CoordenadorCursoWhereInput;
    orderBy?: Prisma.CoordenadorCursoOrderByWithAggregationInput | Prisma.CoordenadorCursoOrderByWithAggregationInput[];
    by: Prisma.CoordenadorCursoScalarFieldEnum[] | Prisma.CoordenadorCursoScalarFieldEnum;
    having?: Prisma.CoordenadorCursoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CoordenadorCursoCountAggregateInputType | true;
    _min?: CoordenadorCursoMinAggregateInputType;
    _max?: CoordenadorCursoMaxAggregateInputType;
};
export type CoordenadorCursoGroupByOutputType = {
    id: string;
    userId: string;
    cursoId: string;
    _count: CoordenadorCursoCountAggregateOutputType | null;
    _min: CoordenadorCursoMinAggregateOutputType | null;
    _max: CoordenadorCursoMaxAggregateOutputType | null;
};
export type GetCoordenadorCursoGroupByPayload<T extends CoordenadorCursoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CoordenadorCursoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CoordenadorCursoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CoordenadorCursoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CoordenadorCursoGroupByOutputType[P]>;
}>>;
export type CoordenadorCursoWhereInput = {
    AND?: Prisma.CoordenadorCursoWhereInput | Prisma.CoordenadorCursoWhereInput[];
    OR?: Prisma.CoordenadorCursoWhereInput[];
    NOT?: Prisma.CoordenadorCursoWhereInput | Prisma.CoordenadorCursoWhereInput[];
    id?: Prisma.StringFilter<"CoordenadorCurso"> | string;
    userId?: Prisma.StringFilter<"CoordenadorCurso"> | string;
    cursoId?: Prisma.StringFilter<"CoordenadorCurso"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    curso?: Prisma.XOR<Prisma.CursoScalarRelationFilter, Prisma.CursoWhereInput>;
};
export type CoordenadorCursoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cursoId?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    curso?: Prisma.CursoOrderByWithRelationInput;
};
export type CoordenadorCursoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId?: string;
    AND?: Prisma.CoordenadorCursoWhereInput | Prisma.CoordenadorCursoWhereInput[];
    OR?: Prisma.CoordenadorCursoWhereInput[];
    NOT?: Prisma.CoordenadorCursoWhereInput | Prisma.CoordenadorCursoWhereInput[];
    cursoId?: Prisma.StringFilter<"CoordenadorCurso"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    curso?: Prisma.XOR<Prisma.CursoScalarRelationFilter, Prisma.CursoWhereInput>;
}, "id" | "userId">;
export type CoordenadorCursoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cursoId?: Prisma.SortOrder;
    _count?: Prisma.CoordenadorCursoCountOrderByAggregateInput;
    _max?: Prisma.CoordenadorCursoMaxOrderByAggregateInput;
    _min?: Prisma.CoordenadorCursoMinOrderByAggregateInput;
};
export type CoordenadorCursoScalarWhereWithAggregatesInput = {
    AND?: Prisma.CoordenadorCursoScalarWhereWithAggregatesInput | Prisma.CoordenadorCursoScalarWhereWithAggregatesInput[];
    OR?: Prisma.CoordenadorCursoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CoordenadorCursoScalarWhereWithAggregatesInput | Prisma.CoordenadorCursoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CoordenadorCurso"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"CoordenadorCurso"> | string;
    cursoId?: Prisma.StringWithAggregatesFilter<"CoordenadorCurso"> | string;
};
export type CoordenadorCursoCreateInput = {
    id?: string;
    user: Prisma.UserCreateNestedOneWithoutCoordenadoriasInput;
    curso: Prisma.CursoCreateNestedOneWithoutCoordenadoresInput;
};
export type CoordenadorCursoUncheckedCreateInput = {
    id?: string;
    userId: string;
    cursoId: string;
};
export type CoordenadorCursoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneRequiredWithoutCoordenadoriasNestedInput;
    curso?: Prisma.CursoUpdateOneRequiredWithoutCoordenadoresNestedInput;
};
export type CoordenadorCursoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    cursoId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CoordenadorCursoCreateManyInput = {
    id?: string;
    userId: string;
    cursoId: string;
};
export type CoordenadorCursoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CoordenadorCursoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    cursoId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CoordenadorCursoListRelationFilter = {
    every?: Prisma.CoordenadorCursoWhereInput;
    some?: Prisma.CoordenadorCursoWhereInput;
    none?: Prisma.CoordenadorCursoWhereInput;
};
export type CoordenadorCursoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CoordenadorCursoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cursoId?: Prisma.SortOrder;
};
export type CoordenadorCursoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cursoId?: Prisma.SortOrder;
};
export type CoordenadorCursoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cursoId?: Prisma.SortOrder;
};
export type CoordenadorCursoCreateNestedManyWithoutCursoInput = {
    create?: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutCursoInput, Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput> | Prisma.CoordenadorCursoCreateWithoutCursoInput[] | Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput[];
    connectOrCreate?: Prisma.CoordenadorCursoCreateOrConnectWithoutCursoInput | Prisma.CoordenadorCursoCreateOrConnectWithoutCursoInput[];
    createMany?: Prisma.CoordenadorCursoCreateManyCursoInputEnvelope;
    connect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
};
export type CoordenadorCursoUncheckedCreateNestedManyWithoutCursoInput = {
    create?: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutCursoInput, Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput> | Prisma.CoordenadorCursoCreateWithoutCursoInput[] | Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput[];
    connectOrCreate?: Prisma.CoordenadorCursoCreateOrConnectWithoutCursoInput | Prisma.CoordenadorCursoCreateOrConnectWithoutCursoInput[];
    createMany?: Prisma.CoordenadorCursoCreateManyCursoInputEnvelope;
    connect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
};
export type CoordenadorCursoUpdateManyWithoutCursoNestedInput = {
    create?: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutCursoInput, Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput> | Prisma.CoordenadorCursoCreateWithoutCursoInput[] | Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput[];
    connectOrCreate?: Prisma.CoordenadorCursoCreateOrConnectWithoutCursoInput | Prisma.CoordenadorCursoCreateOrConnectWithoutCursoInput[];
    upsert?: Prisma.CoordenadorCursoUpsertWithWhereUniqueWithoutCursoInput | Prisma.CoordenadorCursoUpsertWithWhereUniqueWithoutCursoInput[];
    createMany?: Prisma.CoordenadorCursoCreateManyCursoInputEnvelope;
    set?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    disconnect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    delete?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    connect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    update?: Prisma.CoordenadorCursoUpdateWithWhereUniqueWithoutCursoInput | Prisma.CoordenadorCursoUpdateWithWhereUniqueWithoutCursoInput[];
    updateMany?: Prisma.CoordenadorCursoUpdateManyWithWhereWithoutCursoInput | Prisma.CoordenadorCursoUpdateManyWithWhereWithoutCursoInput[];
    deleteMany?: Prisma.CoordenadorCursoScalarWhereInput | Prisma.CoordenadorCursoScalarWhereInput[];
};
export type CoordenadorCursoUncheckedUpdateManyWithoutCursoNestedInput = {
    create?: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutCursoInput, Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput> | Prisma.CoordenadorCursoCreateWithoutCursoInput[] | Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput[];
    connectOrCreate?: Prisma.CoordenadorCursoCreateOrConnectWithoutCursoInput | Prisma.CoordenadorCursoCreateOrConnectWithoutCursoInput[];
    upsert?: Prisma.CoordenadorCursoUpsertWithWhereUniqueWithoutCursoInput | Prisma.CoordenadorCursoUpsertWithWhereUniqueWithoutCursoInput[];
    createMany?: Prisma.CoordenadorCursoCreateManyCursoInputEnvelope;
    set?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    disconnect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    delete?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    connect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    update?: Prisma.CoordenadorCursoUpdateWithWhereUniqueWithoutCursoInput | Prisma.CoordenadorCursoUpdateWithWhereUniqueWithoutCursoInput[];
    updateMany?: Prisma.CoordenadorCursoUpdateManyWithWhereWithoutCursoInput | Prisma.CoordenadorCursoUpdateManyWithWhereWithoutCursoInput[];
    deleteMany?: Prisma.CoordenadorCursoScalarWhereInput | Prisma.CoordenadorCursoScalarWhereInput[];
};
export type CoordenadorCursoCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutUserInput, Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput> | Prisma.CoordenadorCursoCreateWithoutUserInput[] | Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CoordenadorCursoCreateOrConnectWithoutUserInput | Prisma.CoordenadorCursoCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CoordenadorCursoCreateManyUserInputEnvelope;
    connect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
};
export type CoordenadorCursoUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutUserInput, Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput> | Prisma.CoordenadorCursoCreateWithoutUserInput[] | Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CoordenadorCursoCreateOrConnectWithoutUserInput | Prisma.CoordenadorCursoCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CoordenadorCursoCreateManyUserInputEnvelope;
    connect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
};
export type CoordenadorCursoUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutUserInput, Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput> | Prisma.CoordenadorCursoCreateWithoutUserInput[] | Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CoordenadorCursoCreateOrConnectWithoutUserInput | Prisma.CoordenadorCursoCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CoordenadorCursoUpsertWithWhereUniqueWithoutUserInput | Prisma.CoordenadorCursoUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CoordenadorCursoCreateManyUserInputEnvelope;
    set?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    disconnect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    delete?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    connect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    update?: Prisma.CoordenadorCursoUpdateWithWhereUniqueWithoutUserInput | Prisma.CoordenadorCursoUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CoordenadorCursoUpdateManyWithWhereWithoutUserInput | Prisma.CoordenadorCursoUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CoordenadorCursoScalarWhereInput | Prisma.CoordenadorCursoScalarWhereInput[];
};
export type CoordenadorCursoUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutUserInput, Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput> | Prisma.CoordenadorCursoCreateWithoutUserInput[] | Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CoordenadorCursoCreateOrConnectWithoutUserInput | Prisma.CoordenadorCursoCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CoordenadorCursoUpsertWithWhereUniqueWithoutUserInput | Prisma.CoordenadorCursoUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CoordenadorCursoCreateManyUserInputEnvelope;
    set?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    disconnect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    delete?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    connect?: Prisma.CoordenadorCursoWhereUniqueInput | Prisma.CoordenadorCursoWhereUniqueInput[];
    update?: Prisma.CoordenadorCursoUpdateWithWhereUniqueWithoutUserInput | Prisma.CoordenadorCursoUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CoordenadorCursoUpdateManyWithWhereWithoutUserInput | Prisma.CoordenadorCursoUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CoordenadorCursoScalarWhereInput | Prisma.CoordenadorCursoScalarWhereInput[];
};
export type CoordenadorCursoCreateWithoutCursoInput = {
    id?: string;
    user: Prisma.UserCreateNestedOneWithoutCoordenadoriasInput;
};
export type CoordenadorCursoUncheckedCreateWithoutCursoInput = {
    id?: string;
    userId: string;
};
export type CoordenadorCursoCreateOrConnectWithoutCursoInput = {
    where: Prisma.CoordenadorCursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutCursoInput, Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput>;
};
export type CoordenadorCursoCreateManyCursoInputEnvelope = {
    data: Prisma.CoordenadorCursoCreateManyCursoInput | Prisma.CoordenadorCursoCreateManyCursoInput[];
    skipDuplicates?: boolean;
};
export type CoordenadorCursoUpsertWithWhereUniqueWithoutCursoInput = {
    where: Prisma.CoordenadorCursoWhereUniqueInput;
    update: Prisma.XOR<Prisma.CoordenadorCursoUpdateWithoutCursoInput, Prisma.CoordenadorCursoUncheckedUpdateWithoutCursoInput>;
    create: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutCursoInput, Prisma.CoordenadorCursoUncheckedCreateWithoutCursoInput>;
};
export type CoordenadorCursoUpdateWithWhereUniqueWithoutCursoInput = {
    where: Prisma.CoordenadorCursoWhereUniqueInput;
    data: Prisma.XOR<Prisma.CoordenadorCursoUpdateWithoutCursoInput, Prisma.CoordenadorCursoUncheckedUpdateWithoutCursoInput>;
};
export type CoordenadorCursoUpdateManyWithWhereWithoutCursoInput = {
    where: Prisma.CoordenadorCursoScalarWhereInput;
    data: Prisma.XOR<Prisma.CoordenadorCursoUpdateManyMutationInput, Prisma.CoordenadorCursoUncheckedUpdateManyWithoutCursoInput>;
};
export type CoordenadorCursoScalarWhereInput = {
    AND?: Prisma.CoordenadorCursoScalarWhereInput | Prisma.CoordenadorCursoScalarWhereInput[];
    OR?: Prisma.CoordenadorCursoScalarWhereInput[];
    NOT?: Prisma.CoordenadorCursoScalarWhereInput | Prisma.CoordenadorCursoScalarWhereInput[];
    id?: Prisma.StringFilter<"CoordenadorCurso"> | string;
    userId?: Prisma.StringFilter<"CoordenadorCurso"> | string;
    cursoId?: Prisma.StringFilter<"CoordenadorCurso"> | string;
};
export type CoordenadorCursoCreateWithoutUserInput = {
    id?: string;
    curso: Prisma.CursoCreateNestedOneWithoutCoordenadoresInput;
};
export type CoordenadorCursoUncheckedCreateWithoutUserInput = {
    id?: string;
    cursoId: string;
};
export type CoordenadorCursoCreateOrConnectWithoutUserInput = {
    where: Prisma.CoordenadorCursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutUserInput, Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput>;
};
export type CoordenadorCursoCreateManyUserInputEnvelope = {
    data: Prisma.CoordenadorCursoCreateManyUserInput | Prisma.CoordenadorCursoCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type CoordenadorCursoUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.CoordenadorCursoWhereUniqueInput;
    update: Prisma.XOR<Prisma.CoordenadorCursoUpdateWithoutUserInput, Prisma.CoordenadorCursoUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.CoordenadorCursoCreateWithoutUserInput, Prisma.CoordenadorCursoUncheckedCreateWithoutUserInput>;
};
export type CoordenadorCursoUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.CoordenadorCursoWhereUniqueInput;
    data: Prisma.XOR<Prisma.CoordenadorCursoUpdateWithoutUserInput, Prisma.CoordenadorCursoUncheckedUpdateWithoutUserInput>;
};
export type CoordenadorCursoUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.CoordenadorCursoScalarWhereInput;
    data: Prisma.XOR<Prisma.CoordenadorCursoUpdateManyMutationInput, Prisma.CoordenadorCursoUncheckedUpdateManyWithoutUserInput>;
};
export type CoordenadorCursoCreateManyCursoInput = {
    id?: string;
    userId: string;
};
export type CoordenadorCursoUpdateWithoutCursoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneRequiredWithoutCoordenadoriasNestedInput;
};
export type CoordenadorCursoUncheckedUpdateWithoutCursoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CoordenadorCursoUncheckedUpdateManyWithoutCursoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CoordenadorCursoCreateManyUserInput = {
    id?: string;
    cursoId: string;
};
export type CoordenadorCursoUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.CursoUpdateOneRequiredWithoutCoordenadoresNestedInput;
};
export type CoordenadorCursoUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cursoId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CoordenadorCursoUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cursoId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CoordenadorCursoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    cursoId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    curso?: boolean | Prisma.CursoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["coordenadorCurso"]>;
export type CoordenadorCursoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    cursoId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    curso?: boolean | Prisma.CursoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["coordenadorCurso"]>;
export type CoordenadorCursoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    cursoId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    curso?: boolean | Prisma.CursoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["coordenadorCurso"]>;
export type CoordenadorCursoSelectScalar = {
    id?: boolean;
    userId?: boolean;
    cursoId?: boolean;
};
export type CoordenadorCursoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "cursoId", ExtArgs["result"]["coordenadorCurso"]>;
export type CoordenadorCursoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    curso?: boolean | Prisma.CursoDefaultArgs<ExtArgs>;
};
export type CoordenadorCursoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    curso?: boolean | Prisma.CursoDefaultArgs<ExtArgs>;
};
export type CoordenadorCursoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    curso?: boolean | Prisma.CursoDefaultArgs<ExtArgs>;
};
export type $CoordenadorCursoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CoordenadorCurso";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        curso: Prisma.$CursoPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        cursoId: string;
    }, ExtArgs["result"]["coordenadorCurso"]>;
    composites: {};
};
export type CoordenadorCursoGetPayload<S extends boolean | null | undefined | CoordenadorCursoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload, S>;
export type CoordenadorCursoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CoordenadorCursoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CoordenadorCursoCountAggregateInputType | true;
};
export interface CoordenadorCursoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CoordenadorCurso'];
        meta: {
            name: 'CoordenadorCurso';
        };
    };
    findUnique<T extends CoordenadorCursoFindUniqueArgs>(args: Prisma.SelectSubset<T, CoordenadorCursoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CoordenadorCursoClient<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CoordenadorCursoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CoordenadorCursoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CoordenadorCursoClient<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CoordenadorCursoFindFirstArgs>(args?: Prisma.SelectSubset<T, CoordenadorCursoFindFirstArgs<ExtArgs>>): Prisma.Prisma__CoordenadorCursoClient<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CoordenadorCursoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CoordenadorCursoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CoordenadorCursoClient<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CoordenadorCursoFindManyArgs>(args?: Prisma.SelectSubset<T, CoordenadorCursoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CoordenadorCursoCreateArgs>(args: Prisma.SelectSubset<T, CoordenadorCursoCreateArgs<ExtArgs>>): Prisma.Prisma__CoordenadorCursoClient<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CoordenadorCursoCreateManyArgs>(args?: Prisma.SelectSubset<T, CoordenadorCursoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CoordenadorCursoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CoordenadorCursoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CoordenadorCursoDeleteArgs>(args: Prisma.SelectSubset<T, CoordenadorCursoDeleteArgs<ExtArgs>>): Prisma.Prisma__CoordenadorCursoClient<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CoordenadorCursoUpdateArgs>(args: Prisma.SelectSubset<T, CoordenadorCursoUpdateArgs<ExtArgs>>): Prisma.Prisma__CoordenadorCursoClient<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CoordenadorCursoDeleteManyArgs>(args?: Prisma.SelectSubset<T, CoordenadorCursoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CoordenadorCursoUpdateManyArgs>(args: Prisma.SelectSubset<T, CoordenadorCursoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CoordenadorCursoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CoordenadorCursoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CoordenadorCursoUpsertArgs>(args: Prisma.SelectSubset<T, CoordenadorCursoUpsertArgs<ExtArgs>>): Prisma.Prisma__CoordenadorCursoClient<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CoordenadorCursoCountArgs>(args?: Prisma.Subset<T, CoordenadorCursoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CoordenadorCursoCountAggregateOutputType> : number>;
    aggregate<T extends CoordenadorCursoAggregateArgs>(args: Prisma.Subset<T, CoordenadorCursoAggregateArgs>): Prisma.PrismaPromise<GetCoordenadorCursoAggregateType<T>>;
    groupBy<T extends CoordenadorCursoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CoordenadorCursoGroupByArgs['orderBy'];
    } : {
        orderBy?: CoordenadorCursoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CoordenadorCursoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCoordenadorCursoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CoordenadorCursoFieldRefs;
}
export interface Prisma__CoordenadorCursoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    curso<T extends Prisma.CursoDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CursoDefaultArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CoordenadorCursoFieldRefs {
    readonly id: Prisma.FieldRef<"CoordenadorCurso", 'String'>;
    readonly userId: Prisma.FieldRef<"CoordenadorCurso", 'String'>;
    readonly cursoId: Prisma.FieldRef<"CoordenadorCurso", 'String'>;
}
export type CoordenadorCursoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
    where: Prisma.CoordenadorCursoWhereUniqueInput;
};
export type CoordenadorCursoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
    where: Prisma.CoordenadorCursoWhereUniqueInput;
};
export type CoordenadorCursoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
    where?: Prisma.CoordenadorCursoWhereInput;
    orderBy?: Prisma.CoordenadorCursoOrderByWithRelationInput | Prisma.CoordenadorCursoOrderByWithRelationInput[];
    cursor?: Prisma.CoordenadorCursoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CoordenadorCursoScalarFieldEnum | Prisma.CoordenadorCursoScalarFieldEnum[];
};
export type CoordenadorCursoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
    where?: Prisma.CoordenadorCursoWhereInput;
    orderBy?: Prisma.CoordenadorCursoOrderByWithRelationInput | Prisma.CoordenadorCursoOrderByWithRelationInput[];
    cursor?: Prisma.CoordenadorCursoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CoordenadorCursoScalarFieldEnum | Prisma.CoordenadorCursoScalarFieldEnum[];
};
export type CoordenadorCursoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
    where?: Prisma.CoordenadorCursoWhereInput;
    orderBy?: Prisma.CoordenadorCursoOrderByWithRelationInput | Prisma.CoordenadorCursoOrderByWithRelationInput[];
    cursor?: Prisma.CoordenadorCursoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CoordenadorCursoScalarFieldEnum | Prisma.CoordenadorCursoScalarFieldEnum[];
};
export type CoordenadorCursoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CoordenadorCursoCreateInput, Prisma.CoordenadorCursoUncheckedCreateInput>;
};
export type CoordenadorCursoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CoordenadorCursoCreateManyInput | Prisma.CoordenadorCursoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CoordenadorCursoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    data: Prisma.CoordenadorCursoCreateManyInput | Prisma.CoordenadorCursoCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CoordenadorCursoIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CoordenadorCursoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CoordenadorCursoUpdateInput, Prisma.CoordenadorCursoUncheckedUpdateInput>;
    where: Prisma.CoordenadorCursoWhereUniqueInput;
};
export type CoordenadorCursoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CoordenadorCursoUpdateManyMutationInput, Prisma.CoordenadorCursoUncheckedUpdateManyInput>;
    where?: Prisma.CoordenadorCursoWhereInput;
    limit?: number;
};
export type CoordenadorCursoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CoordenadorCursoUpdateManyMutationInput, Prisma.CoordenadorCursoUncheckedUpdateManyInput>;
    where?: Prisma.CoordenadorCursoWhereInput;
    limit?: number;
    include?: Prisma.CoordenadorCursoIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CoordenadorCursoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
    where: Prisma.CoordenadorCursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CoordenadorCursoCreateInput, Prisma.CoordenadorCursoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CoordenadorCursoUpdateInput, Prisma.CoordenadorCursoUncheckedUpdateInput>;
};
export type CoordenadorCursoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
    where: Prisma.CoordenadorCursoWhereUniqueInput;
};
export type CoordenadorCursoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CoordenadorCursoWhereInput;
    limit?: number;
};
export type CoordenadorCursoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CoordenadorCursoSelect<ExtArgs> | null;
    omit?: Prisma.CoordenadorCursoOmit<ExtArgs> | null;
    include?: Prisma.CoordenadorCursoInclude<ExtArgs> | null;
};

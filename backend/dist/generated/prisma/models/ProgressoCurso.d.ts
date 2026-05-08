import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProgressoCursoModel = runtime.Types.Result.DefaultSelection<Prisma.$ProgressoCursoPayload>;
export type AggregateProgressoCurso = {
    _count: ProgressoCursoCountAggregateOutputType | null;
    _avg: ProgressoCursoAvgAggregateOutputType | null;
    _sum: ProgressoCursoSumAggregateOutputType | null;
    _min: ProgressoCursoMinAggregateOutputType | null;
    _max: ProgressoCursoMaxAggregateOutputType | null;
};
export type ProgressoCursoAvgAggregateOutputType = {
    nota: number | null;
};
export type ProgressoCursoSumAggregateOutputType = {
    nota: number | null;
};
export type ProgressoCursoMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    moduloId: string | null;
    concluido: boolean | null;
    nota: number | null;
};
export type ProgressoCursoMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    moduloId: string | null;
    concluido: boolean | null;
    nota: number | null;
};
export type ProgressoCursoCountAggregateOutputType = {
    id: number;
    userId: number;
    moduloId: number;
    concluido: number;
    nota: number;
    _all: number;
};
export type ProgressoCursoAvgAggregateInputType = {
    nota?: true;
};
export type ProgressoCursoSumAggregateInputType = {
    nota?: true;
};
export type ProgressoCursoMinAggregateInputType = {
    id?: true;
    userId?: true;
    moduloId?: true;
    concluido?: true;
    nota?: true;
};
export type ProgressoCursoMaxAggregateInputType = {
    id?: true;
    userId?: true;
    moduloId?: true;
    concluido?: true;
    nota?: true;
};
export type ProgressoCursoCountAggregateInputType = {
    id?: true;
    userId?: true;
    moduloId?: true;
    concluido?: true;
    nota?: true;
    _all?: true;
};
export type ProgressoCursoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProgressoCursoWhereInput;
    orderBy?: Prisma.ProgressoCursoOrderByWithRelationInput | Prisma.ProgressoCursoOrderByWithRelationInput[];
    cursor?: Prisma.ProgressoCursoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProgressoCursoCountAggregateInputType;
    _avg?: ProgressoCursoAvgAggregateInputType;
    _sum?: ProgressoCursoSumAggregateInputType;
    _min?: ProgressoCursoMinAggregateInputType;
    _max?: ProgressoCursoMaxAggregateInputType;
};
export type GetProgressoCursoAggregateType<T extends ProgressoCursoAggregateArgs> = {
    [P in keyof T & keyof AggregateProgressoCurso]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProgressoCurso[P]> : Prisma.GetScalarType<T[P], AggregateProgressoCurso[P]>;
};
export type ProgressoCursoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProgressoCursoWhereInput;
    orderBy?: Prisma.ProgressoCursoOrderByWithAggregationInput | Prisma.ProgressoCursoOrderByWithAggregationInput[];
    by: Prisma.ProgressoCursoScalarFieldEnum[] | Prisma.ProgressoCursoScalarFieldEnum;
    having?: Prisma.ProgressoCursoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProgressoCursoCountAggregateInputType | true;
    _avg?: ProgressoCursoAvgAggregateInputType;
    _sum?: ProgressoCursoSumAggregateInputType;
    _min?: ProgressoCursoMinAggregateInputType;
    _max?: ProgressoCursoMaxAggregateInputType;
};
export type ProgressoCursoGroupByOutputType = {
    id: string;
    userId: string;
    moduloId: string;
    concluido: boolean;
    nota: number | null;
    _count: ProgressoCursoCountAggregateOutputType | null;
    _avg: ProgressoCursoAvgAggregateOutputType | null;
    _sum: ProgressoCursoSumAggregateOutputType | null;
    _min: ProgressoCursoMinAggregateOutputType | null;
    _max: ProgressoCursoMaxAggregateOutputType | null;
};
export type GetProgressoCursoGroupByPayload<T extends ProgressoCursoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProgressoCursoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProgressoCursoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProgressoCursoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProgressoCursoGroupByOutputType[P]>;
}>>;
export type ProgressoCursoWhereInput = {
    AND?: Prisma.ProgressoCursoWhereInput | Prisma.ProgressoCursoWhereInput[];
    OR?: Prisma.ProgressoCursoWhereInput[];
    NOT?: Prisma.ProgressoCursoWhereInput | Prisma.ProgressoCursoWhereInput[];
    id?: Prisma.StringFilter<"ProgressoCurso"> | string;
    userId?: Prisma.StringFilter<"ProgressoCurso"> | string;
    moduloId?: Prisma.StringFilter<"ProgressoCurso"> | string;
    concluido?: Prisma.BoolFilter<"ProgressoCurso"> | boolean;
    nota?: Prisma.FloatNullableFilter<"ProgressoCurso"> | number | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    modulo?: Prisma.XOR<Prisma.ModuloScalarRelationFilter, Prisma.ModuloWhereInput>;
};
export type ProgressoCursoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    moduloId?: Prisma.SortOrder;
    concluido?: Prisma.SortOrder;
    nota?: Prisma.SortOrderInput | Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    modulo?: Prisma.ModuloOrderByWithRelationInput;
};
export type ProgressoCursoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_moduloId?: Prisma.ProgressoCursoUserIdModuloIdCompoundUniqueInput;
    AND?: Prisma.ProgressoCursoWhereInput | Prisma.ProgressoCursoWhereInput[];
    OR?: Prisma.ProgressoCursoWhereInput[];
    NOT?: Prisma.ProgressoCursoWhereInput | Prisma.ProgressoCursoWhereInput[];
    userId?: Prisma.StringFilter<"ProgressoCurso"> | string;
    moduloId?: Prisma.StringFilter<"ProgressoCurso"> | string;
    concluido?: Prisma.BoolFilter<"ProgressoCurso"> | boolean;
    nota?: Prisma.FloatNullableFilter<"ProgressoCurso"> | number | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    modulo?: Prisma.XOR<Prisma.ModuloScalarRelationFilter, Prisma.ModuloWhereInput>;
}, "id" | "userId_moduloId">;
export type ProgressoCursoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    moduloId?: Prisma.SortOrder;
    concluido?: Prisma.SortOrder;
    nota?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ProgressoCursoCountOrderByAggregateInput;
    _avg?: Prisma.ProgressoCursoAvgOrderByAggregateInput;
    _max?: Prisma.ProgressoCursoMaxOrderByAggregateInput;
    _min?: Prisma.ProgressoCursoMinOrderByAggregateInput;
    _sum?: Prisma.ProgressoCursoSumOrderByAggregateInput;
};
export type ProgressoCursoScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProgressoCursoScalarWhereWithAggregatesInput | Prisma.ProgressoCursoScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProgressoCursoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProgressoCursoScalarWhereWithAggregatesInput | Prisma.ProgressoCursoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProgressoCurso"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"ProgressoCurso"> | string;
    moduloId?: Prisma.StringWithAggregatesFilter<"ProgressoCurso"> | string;
    concluido?: Prisma.BoolWithAggregatesFilter<"ProgressoCurso"> | boolean;
    nota?: Prisma.FloatNullableWithAggregatesFilter<"ProgressoCurso"> | number | null;
};
export type ProgressoCursoCreateInput = {
    id?: string;
    concluido?: boolean;
    nota?: number | null;
    user: Prisma.UserCreateNestedOneWithoutProgressoCursosInput;
    modulo: Prisma.ModuloCreateNestedOneWithoutProgressosInput;
};
export type ProgressoCursoUncheckedCreateInput = {
    id?: string;
    userId: string;
    moduloId: string;
    concluido?: boolean;
    nota?: number | null;
};
export type ProgressoCursoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    user?: Prisma.UserUpdateOneRequiredWithoutProgressoCursosNestedInput;
    modulo?: Prisma.ModuloUpdateOneRequiredWithoutProgressosNestedInput;
};
export type ProgressoCursoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    moduloId?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
};
export type ProgressoCursoCreateManyInput = {
    id?: string;
    userId: string;
    moduloId: string;
    concluido?: boolean;
    nota?: number | null;
};
export type ProgressoCursoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
};
export type ProgressoCursoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    moduloId?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
};
export type ProgressoCursoListRelationFilter = {
    every?: Prisma.ProgressoCursoWhereInput;
    some?: Prisma.ProgressoCursoWhereInput;
    none?: Prisma.ProgressoCursoWhereInput;
};
export type ProgressoCursoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProgressoCursoUserIdModuloIdCompoundUniqueInput = {
    userId: string;
    moduloId: string;
};
export type ProgressoCursoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    moduloId?: Prisma.SortOrder;
    concluido?: Prisma.SortOrder;
    nota?: Prisma.SortOrder;
};
export type ProgressoCursoAvgOrderByAggregateInput = {
    nota?: Prisma.SortOrder;
};
export type ProgressoCursoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    moduloId?: Prisma.SortOrder;
    concluido?: Prisma.SortOrder;
    nota?: Prisma.SortOrder;
};
export type ProgressoCursoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    moduloId?: Prisma.SortOrder;
    concluido?: Prisma.SortOrder;
    nota?: Prisma.SortOrder;
};
export type ProgressoCursoSumOrderByAggregateInput = {
    nota?: Prisma.SortOrder;
};
export type ProgressoCursoCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutUserInput, Prisma.ProgressoCursoUncheckedCreateWithoutUserInput> | Prisma.ProgressoCursoCreateWithoutUserInput[] | Prisma.ProgressoCursoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProgressoCursoCreateOrConnectWithoutUserInput | Prisma.ProgressoCursoCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProgressoCursoCreateManyUserInputEnvelope;
    connect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
};
export type ProgressoCursoUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutUserInput, Prisma.ProgressoCursoUncheckedCreateWithoutUserInput> | Prisma.ProgressoCursoCreateWithoutUserInput[] | Prisma.ProgressoCursoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProgressoCursoCreateOrConnectWithoutUserInput | Prisma.ProgressoCursoCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProgressoCursoCreateManyUserInputEnvelope;
    connect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
};
export type ProgressoCursoUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutUserInput, Prisma.ProgressoCursoUncheckedCreateWithoutUserInput> | Prisma.ProgressoCursoCreateWithoutUserInput[] | Prisma.ProgressoCursoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProgressoCursoCreateOrConnectWithoutUserInput | Prisma.ProgressoCursoCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProgressoCursoUpsertWithWhereUniqueWithoutUserInput | Prisma.ProgressoCursoUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProgressoCursoCreateManyUserInputEnvelope;
    set?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    disconnect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    delete?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    connect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    update?: Prisma.ProgressoCursoUpdateWithWhereUniqueWithoutUserInput | Prisma.ProgressoCursoUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProgressoCursoUpdateManyWithWhereWithoutUserInput | Prisma.ProgressoCursoUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProgressoCursoScalarWhereInput | Prisma.ProgressoCursoScalarWhereInput[];
};
export type ProgressoCursoUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutUserInput, Prisma.ProgressoCursoUncheckedCreateWithoutUserInput> | Prisma.ProgressoCursoCreateWithoutUserInput[] | Prisma.ProgressoCursoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProgressoCursoCreateOrConnectWithoutUserInput | Prisma.ProgressoCursoCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProgressoCursoUpsertWithWhereUniqueWithoutUserInput | Prisma.ProgressoCursoUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProgressoCursoCreateManyUserInputEnvelope;
    set?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    disconnect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    delete?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    connect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    update?: Prisma.ProgressoCursoUpdateWithWhereUniqueWithoutUserInput | Prisma.ProgressoCursoUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProgressoCursoUpdateManyWithWhereWithoutUserInput | Prisma.ProgressoCursoUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProgressoCursoScalarWhereInput | Prisma.ProgressoCursoScalarWhereInput[];
};
export type ProgressoCursoCreateNestedManyWithoutModuloInput = {
    create?: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutModuloInput, Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput> | Prisma.ProgressoCursoCreateWithoutModuloInput[] | Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput[];
    connectOrCreate?: Prisma.ProgressoCursoCreateOrConnectWithoutModuloInput | Prisma.ProgressoCursoCreateOrConnectWithoutModuloInput[];
    createMany?: Prisma.ProgressoCursoCreateManyModuloInputEnvelope;
    connect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
};
export type ProgressoCursoUncheckedCreateNestedManyWithoutModuloInput = {
    create?: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutModuloInput, Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput> | Prisma.ProgressoCursoCreateWithoutModuloInput[] | Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput[];
    connectOrCreate?: Prisma.ProgressoCursoCreateOrConnectWithoutModuloInput | Prisma.ProgressoCursoCreateOrConnectWithoutModuloInput[];
    createMany?: Prisma.ProgressoCursoCreateManyModuloInputEnvelope;
    connect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
};
export type ProgressoCursoUpdateManyWithoutModuloNestedInput = {
    create?: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutModuloInput, Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput> | Prisma.ProgressoCursoCreateWithoutModuloInput[] | Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput[];
    connectOrCreate?: Prisma.ProgressoCursoCreateOrConnectWithoutModuloInput | Prisma.ProgressoCursoCreateOrConnectWithoutModuloInput[];
    upsert?: Prisma.ProgressoCursoUpsertWithWhereUniqueWithoutModuloInput | Prisma.ProgressoCursoUpsertWithWhereUniqueWithoutModuloInput[];
    createMany?: Prisma.ProgressoCursoCreateManyModuloInputEnvelope;
    set?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    disconnect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    delete?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    connect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    update?: Prisma.ProgressoCursoUpdateWithWhereUniqueWithoutModuloInput | Prisma.ProgressoCursoUpdateWithWhereUniqueWithoutModuloInput[];
    updateMany?: Prisma.ProgressoCursoUpdateManyWithWhereWithoutModuloInput | Prisma.ProgressoCursoUpdateManyWithWhereWithoutModuloInput[];
    deleteMany?: Prisma.ProgressoCursoScalarWhereInput | Prisma.ProgressoCursoScalarWhereInput[];
};
export type ProgressoCursoUncheckedUpdateManyWithoutModuloNestedInput = {
    create?: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutModuloInput, Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput> | Prisma.ProgressoCursoCreateWithoutModuloInput[] | Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput[];
    connectOrCreate?: Prisma.ProgressoCursoCreateOrConnectWithoutModuloInput | Prisma.ProgressoCursoCreateOrConnectWithoutModuloInput[];
    upsert?: Prisma.ProgressoCursoUpsertWithWhereUniqueWithoutModuloInput | Prisma.ProgressoCursoUpsertWithWhereUniqueWithoutModuloInput[];
    createMany?: Prisma.ProgressoCursoCreateManyModuloInputEnvelope;
    set?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    disconnect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    delete?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    connect?: Prisma.ProgressoCursoWhereUniqueInput | Prisma.ProgressoCursoWhereUniqueInput[];
    update?: Prisma.ProgressoCursoUpdateWithWhereUniqueWithoutModuloInput | Prisma.ProgressoCursoUpdateWithWhereUniqueWithoutModuloInput[];
    updateMany?: Prisma.ProgressoCursoUpdateManyWithWhereWithoutModuloInput | Prisma.ProgressoCursoUpdateManyWithWhereWithoutModuloInput[];
    deleteMany?: Prisma.ProgressoCursoScalarWhereInput | Prisma.ProgressoCursoScalarWhereInput[];
};
export type ProgressoCursoCreateWithoutUserInput = {
    id?: string;
    concluido?: boolean;
    nota?: number | null;
    modulo: Prisma.ModuloCreateNestedOneWithoutProgressosInput;
};
export type ProgressoCursoUncheckedCreateWithoutUserInput = {
    id?: string;
    moduloId: string;
    concluido?: boolean;
    nota?: number | null;
};
export type ProgressoCursoCreateOrConnectWithoutUserInput = {
    where: Prisma.ProgressoCursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutUserInput, Prisma.ProgressoCursoUncheckedCreateWithoutUserInput>;
};
export type ProgressoCursoCreateManyUserInputEnvelope = {
    data: Prisma.ProgressoCursoCreateManyUserInput | Prisma.ProgressoCursoCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ProgressoCursoUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProgressoCursoWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProgressoCursoUpdateWithoutUserInput, Prisma.ProgressoCursoUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutUserInput, Prisma.ProgressoCursoUncheckedCreateWithoutUserInput>;
};
export type ProgressoCursoUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProgressoCursoWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProgressoCursoUpdateWithoutUserInput, Prisma.ProgressoCursoUncheckedUpdateWithoutUserInput>;
};
export type ProgressoCursoUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ProgressoCursoScalarWhereInput;
    data: Prisma.XOR<Prisma.ProgressoCursoUpdateManyMutationInput, Prisma.ProgressoCursoUncheckedUpdateManyWithoutUserInput>;
};
export type ProgressoCursoScalarWhereInput = {
    AND?: Prisma.ProgressoCursoScalarWhereInput | Prisma.ProgressoCursoScalarWhereInput[];
    OR?: Prisma.ProgressoCursoScalarWhereInput[];
    NOT?: Prisma.ProgressoCursoScalarWhereInput | Prisma.ProgressoCursoScalarWhereInput[];
    id?: Prisma.StringFilter<"ProgressoCurso"> | string;
    userId?: Prisma.StringFilter<"ProgressoCurso"> | string;
    moduloId?: Prisma.StringFilter<"ProgressoCurso"> | string;
    concluido?: Prisma.BoolFilter<"ProgressoCurso"> | boolean;
    nota?: Prisma.FloatNullableFilter<"ProgressoCurso"> | number | null;
};
export type ProgressoCursoCreateWithoutModuloInput = {
    id?: string;
    concluido?: boolean;
    nota?: number | null;
    user: Prisma.UserCreateNestedOneWithoutProgressoCursosInput;
};
export type ProgressoCursoUncheckedCreateWithoutModuloInput = {
    id?: string;
    userId: string;
    concluido?: boolean;
    nota?: number | null;
};
export type ProgressoCursoCreateOrConnectWithoutModuloInput = {
    where: Prisma.ProgressoCursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutModuloInput, Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput>;
};
export type ProgressoCursoCreateManyModuloInputEnvelope = {
    data: Prisma.ProgressoCursoCreateManyModuloInput | Prisma.ProgressoCursoCreateManyModuloInput[];
    skipDuplicates?: boolean;
};
export type ProgressoCursoUpsertWithWhereUniqueWithoutModuloInput = {
    where: Prisma.ProgressoCursoWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProgressoCursoUpdateWithoutModuloInput, Prisma.ProgressoCursoUncheckedUpdateWithoutModuloInput>;
    create: Prisma.XOR<Prisma.ProgressoCursoCreateWithoutModuloInput, Prisma.ProgressoCursoUncheckedCreateWithoutModuloInput>;
};
export type ProgressoCursoUpdateWithWhereUniqueWithoutModuloInput = {
    where: Prisma.ProgressoCursoWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProgressoCursoUpdateWithoutModuloInput, Prisma.ProgressoCursoUncheckedUpdateWithoutModuloInput>;
};
export type ProgressoCursoUpdateManyWithWhereWithoutModuloInput = {
    where: Prisma.ProgressoCursoScalarWhereInput;
    data: Prisma.XOR<Prisma.ProgressoCursoUpdateManyMutationInput, Prisma.ProgressoCursoUncheckedUpdateManyWithoutModuloInput>;
};
export type ProgressoCursoCreateManyUserInput = {
    id?: string;
    moduloId: string;
    concluido?: boolean;
    nota?: number | null;
};
export type ProgressoCursoUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    modulo?: Prisma.ModuloUpdateOneRequiredWithoutProgressosNestedInput;
};
export type ProgressoCursoUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduloId?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
};
export type ProgressoCursoUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduloId?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
};
export type ProgressoCursoCreateManyModuloInput = {
    id?: string;
    userId: string;
    concluido?: boolean;
    nota?: number | null;
};
export type ProgressoCursoUpdateWithoutModuloInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    user?: Prisma.UserUpdateOneRequiredWithoutProgressoCursosNestedInput;
};
export type ProgressoCursoUncheckedUpdateWithoutModuloInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
};
export type ProgressoCursoUncheckedUpdateManyWithoutModuloInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    concluido?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    nota?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
};
export type ProgressoCursoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    moduloId?: boolean;
    concluido?: boolean;
    nota?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    modulo?: boolean | Prisma.ModuloDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["progressoCurso"]>;
export type ProgressoCursoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    moduloId?: boolean;
    concluido?: boolean;
    nota?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    modulo?: boolean | Prisma.ModuloDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["progressoCurso"]>;
export type ProgressoCursoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    moduloId?: boolean;
    concluido?: boolean;
    nota?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    modulo?: boolean | Prisma.ModuloDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["progressoCurso"]>;
export type ProgressoCursoSelectScalar = {
    id?: boolean;
    userId?: boolean;
    moduloId?: boolean;
    concluido?: boolean;
    nota?: boolean;
};
export type ProgressoCursoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "moduloId" | "concluido" | "nota", ExtArgs["result"]["progressoCurso"]>;
export type ProgressoCursoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    modulo?: boolean | Prisma.ModuloDefaultArgs<ExtArgs>;
};
export type ProgressoCursoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    modulo?: boolean | Prisma.ModuloDefaultArgs<ExtArgs>;
};
export type ProgressoCursoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    modulo?: boolean | Prisma.ModuloDefaultArgs<ExtArgs>;
};
export type $ProgressoCursoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProgressoCurso";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        modulo: Prisma.$ModuloPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        moduloId: string;
        concluido: boolean;
        nota: number | null;
    }, ExtArgs["result"]["progressoCurso"]>;
    composites: {};
};
export type ProgressoCursoGetPayload<S extends boolean | null | undefined | ProgressoCursoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload, S>;
export type ProgressoCursoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProgressoCursoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProgressoCursoCountAggregateInputType | true;
};
export interface ProgressoCursoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProgressoCurso'];
        meta: {
            name: 'ProgressoCurso';
        };
    };
    findUnique<T extends ProgressoCursoFindUniqueArgs>(args: Prisma.SelectSubset<T, ProgressoCursoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProgressoCursoClient<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProgressoCursoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProgressoCursoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProgressoCursoClient<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProgressoCursoFindFirstArgs>(args?: Prisma.SelectSubset<T, ProgressoCursoFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProgressoCursoClient<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProgressoCursoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProgressoCursoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProgressoCursoClient<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProgressoCursoFindManyArgs>(args?: Prisma.SelectSubset<T, ProgressoCursoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProgressoCursoCreateArgs>(args: Prisma.SelectSubset<T, ProgressoCursoCreateArgs<ExtArgs>>): Prisma.Prisma__ProgressoCursoClient<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProgressoCursoCreateManyArgs>(args?: Prisma.SelectSubset<T, ProgressoCursoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProgressoCursoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProgressoCursoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProgressoCursoDeleteArgs>(args: Prisma.SelectSubset<T, ProgressoCursoDeleteArgs<ExtArgs>>): Prisma.Prisma__ProgressoCursoClient<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProgressoCursoUpdateArgs>(args: Prisma.SelectSubset<T, ProgressoCursoUpdateArgs<ExtArgs>>): Prisma.Prisma__ProgressoCursoClient<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProgressoCursoDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProgressoCursoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProgressoCursoUpdateManyArgs>(args: Prisma.SelectSubset<T, ProgressoCursoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProgressoCursoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProgressoCursoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProgressoCursoUpsertArgs>(args: Prisma.SelectSubset<T, ProgressoCursoUpsertArgs<ExtArgs>>): Prisma.Prisma__ProgressoCursoClient<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProgressoCursoCountArgs>(args?: Prisma.Subset<T, ProgressoCursoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProgressoCursoCountAggregateOutputType> : number>;
    aggregate<T extends ProgressoCursoAggregateArgs>(args: Prisma.Subset<T, ProgressoCursoAggregateArgs>): Prisma.PrismaPromise<GetProgressoCursoAggregateType<T>>;
    groupBy<T extends ProgressoCursoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProgressoCursoGroupByArgs['orderBy'];
    } : {
        orderBy?: ProgressoCursoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProgressoCursoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgressoCursoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProgressoCursoFieldRefs;
}
export interface Prisma__ProgressoCursoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    modulo<T extends Prisma.ModuloDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ModuloDefaultArgs<ExtArgs>>): Prisma.Prisma__ModuloClient<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProgressoCursoFieldRefs {
    readonly id: Prisma.FieldRef<"ProgressoCurso", 'String'>;
    readonly userId: Prisma.FieldRef<"ProgressoCurso", 'String'>;
    readonly moduloId: Prisma.FieldRef<"ProgressoCurso", 'String'>;
    readonly concluido: Prisma.FieldRef<"ProgressoCurso", 'Boolean'>;
    readonly nota: Prisma.FieldRef<"ProgressoCurso", 'Float'>;
}
export type ProgressoCursoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
    where: Prisma.ProgressoCursoWhereUniqueInput;
};
export type ProgressoCursoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
    where: Prisma.ProgressoCursoWhereUniqueInput;
};
export type ProgressoCursoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
    where?: Prisma.ProgressoCursoWhereInput;
    orderBy?: Prisma.ProgressoCursoOrderByWithRelationInput | Prisma.ProgressoCursoOrderByWithRelationInput[];
    cursor?: Prisma.ProgressoCursoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProgressoCursoScalarFieldEnum | Prisma.ProgressoCursoScalarFieldEnum[];
};
export type ProgressoCursoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
    where?: Prisma.ProgressoCursoWhereInput;
    orderBy?: Prisma.ProgressoCursoOrderByWithRelationInput | Prisma.ProgressoCursoOrderByWithRelationInput[];
    cursor?: Prisma.ProgressoCursoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProgressoCursoScalarFieldEnum | Prisma.ProgressoCursoScalarFieldEnum[];
};
export type ProgressoCursoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
    where?: Prisma.ProgressoCursoWhereInput;
    orderBy?: Prisma.ProgressoCursoOrderByWithRelationInput | Prisma.ProgressoCursoOrderByWithRelationInput[];
    cursor?: Prisma.ProgressoCursoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProgressoCursoScalarFieldEnum | Prisma.ProgressoCursoScalarFieldEnum[];
};
export type ProgressoCursoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProgressoCursoCreateInput, Prisma.ProgressoCursoUncheckedCreateInput>;
};
export type ProgressoCursoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProgressoCursoCreateManyInput | Prisma.ProgressoCursoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProgressoCursoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    data: Prisma.ProgressoCursoCreateManyInput | Prisma.ProgressoCursoCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProgressoCursoIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProgressoCursoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProgressoCursoUpdateInput, Prisma.ProgressoCursoUncheckedUpdateInput>;
    where: Prisma.ProgressoCursoWhereUniqueInput;
};
export type ProgressoCursoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProgressoCursoUpdateManyMutationInput, Prisma.ProgressoCursoUncheckedUpdateManyInput>;
    where?: Prisma.ProgressoCursoWhereInput;
    limit?: number;
};
export type ProgressoCursoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProgressoCursoUpdateManyMutationInput, Prisma.ProgressoCursoUncheckedUpdateManyInput>;
    where?: Prisma.ProgressoCursoWhereInput;
    limit?: number;
    include?: Prisma.ProgressoCursoIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProgressoCursoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
    where: Prisma.ProgressoCursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProgressoCursoCreateInput, Prisma.ProgressoCursoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProgressoCursoUpdateInput, Prisma.ProgressoCursoUncheckedUpdateInput>;
};
export type ProgressoCursoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
    where: Prisma.ProgressoCursoWhereUniqueInput;
};
export type ProgressoCursoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProgressoCursoWhereInput;
    limit?: number;
};
export type ProgressoCursoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProgressoCursoSelect<ExtArgs> | null;
    omit?: Prisma.ProgressoCursoOmit<ExtArgs> | null;
    include?: Prisma.ProgressoCursoInclude<ExtArgs> | null;
};

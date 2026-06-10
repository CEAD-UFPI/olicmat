import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CursoModel = runtime.Types.Result.DefaultSelection<Prisma.$CursoPayload>;
export type AggregateCurso = {
    _count: CursoCountAggregateOutputType | null;
    _min: CursoMinAggregateOutputType | null;
    _max: CursoMaxAggregateOutputType | null;
};
export type CursoMinAggregateOutputType = {
    id: string | null;
    nome: string | null;
    instituicaoId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CursoMaxAggregateOutputType = {
    id: string | null;
    nome: string | null;
    instituicaoId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CursoCountAggregateOutputType = {
    id: number;
    nome: number;
    instituicaoId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CursoMinAggregateInputType = {
    id?: true;
    nome?: true;
    instituicaoId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CursoMaxAggregateInputType = {
    id?: true;
    nome?: true;
    instituicaoId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CursoCountAggregateInputType = {
    id?: true;
    nome?: true;
    instituicaoId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CursoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CursoWhereInput;
    orderBy?: Prisma.CursoOrderByWithRelationInput | Prisma.CursoOrderByWithRelationInput[];
    cursor?: Prisma.CursoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CursoCountAggregateInputType;
    _min?: CursoMinAggregateInputType;
    _max?: CursoMaxAggregateInputType;
};
export type GetCursoAggregateType<T extends CursoAggregateArgs> = {
    [P in keyof T & keyof AggregateCurso]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCurso[P]> : Prisma.GetScalarType<T[P], AggregateCurso[P]>;
};
export type CursoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CursoWhereInput;
    orderBy?: Prisma.CursoOrderByWithAggregationInput | Prisma.CursoOrderByWithAggregationInput[];
    by: Prisma.CursoScalarFieldEnum[] | Prisma.CursoScalarFieldEnum;
    having?: Prisma.CursoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CursoCountAggregateInputType | true;
    _min?: CursoMinAggregateInputType;
    _max?: CursoMaxAggregateInputType;
};
export type CursoGroupByOutputType = {
    id: string;
    nome: string;
    instituicaoId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: CursoCountAggregateOutputType | null;
    _min: CursoMinAggregateOutputType | null;
    _max: CursoMaxAggregateOutputType | null;
};
export type GetCursoGroupByPayload<T extends CursoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CursoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CursoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CursoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CursoGroupByOutputType[P]>;
}>>;
export type CursoWhereInput = {
    AND?: Prisma.CursoWhereInput | Prisma.CursoWhereInput[];
    OR?: Prisma.CursoWhereInput[];
    NOT?: Prisma.CursoWhereInput | Prisma.CursoWhereInput[];
    id?: Prisma.StringFilter<"Curso"> | string;
    nome?: Prisma.StringFilter<"Curso"> | string;
    instituicaoId?: Prisma.StringFilter<"Curso"> | string;
    createdAt?: Prisma.DateTimeFilter<"Curso"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Curso"> | Date | string;
    instituicao?: Prisma.XOR<Prisma.InstituicaoScalarRelationFilter, Prisma.InstituicaoWhereInput>;
    coordenadores?: Prisma.CoordenadorCursoListRelationFilter;
    usuarios?: Prisma.UserListRelationFilter;
    inscricoes?: Prisma.InscricaoListRelationFilter;
};
export type CursoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    instituicao?: Prisma.InstituicaoOrderByWithRelationInput;
    coordenadores?: Prisma.CoordenadorCursoOrderByRelationAggregateInput;
    usuarios?: Prisma.UserOrderByRelationAggregateInput;
    inscricoes?: Prisma.InscricaoOrderByRelationAggregateInput;
};
export type CursoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    nome_instituicaoId?: Prisma.CursoNomeInstituicaoIdCompoundUniqueInput;
    AND?: Prisma.CursoWhereInput | Prisma.CursoWhereInput[];
    OR?: Prisma.CursoWhereInput[];
    NOT?: Prisma.CursoWhereInput | Prisma.CursoWhereInput[];
    nome?: Prisma.StringFilter<"Curso"> | string;
    instituicaoId?: Prisma.StringFilter<"Curso"> | string;
    createdAt?: Prisma.DateTimeFilter<"Curso"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Curso"> | Date | string;
    instituicao?: Prisma.XOR<Prisma.InstituicaoScalarRelationFilter, Prisma.InstituicaoWhereInput>;
    coordenadores?: Prisma.CoordenadorCursoListRelationFilter;
    usuarios?: Prisma.UserListRelationFilter;
    inscricoes?: Prisma.InscricaoListRelationFilter;
}, "id" | "nome_instituicaoId">;
export type CursoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CursoCountOrderByAggregateInput;
    _max?: Prisma.CursoMaxOrderByAggregateInput;
    _min?: Prisma.CursoMinOrderByAggregateInput;
};
export type CursoScalarWhereWithAggregatesInput = {
    AND?: Prisma.CursoScalarWhereWithAggregatesInput | Prisma.CursoScalarWhereWithAggregatesInput[];
    OR?: Prisma.CursoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CursoScalarWhereWithAggregatesInput | Prisma.CursoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Curso"> | string;
    nome?: Prisma.StringWithAggregatesFilter<"Curso"> | string;
    instituicaoId?: Prisma.StringWithAggregatesFilter<"Curso"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Curso"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Curso"> | Date | string;
};
export type CursoCreateInput = {
    id?: string;
    nome: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao: Prisma.InstituicaoCreateNestedOneWithoutCursosInput;
    coordenadores?: Prisma.CoordenadorCursoCreateNestedManyWithoutCursoInput;
    usuarios?: Prisma.UserCreateNestedManyWithoutCursoInput;
    inscricoes?: Prisma.InscricaoCreateNestedManyWithoutCursoInput;
};
export type CursoUncheckedCreateInput = {
    id?: string;
    nome: string;
    instituicaoId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    coordenadores?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutCursoInput;
    usuarios?: Prisma.UserUncheckedCreateNestedManyWithoutCursoInput;
    inscricoes?: Prisma.InscricaoUncheckedCreateNestedManyWithoutCursoInput;
};
export type CursoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneRequiredWithoutCursosNestedInput;
    coordenadores?: Prisma.CoordenadorCursoUpdateManyWithoutCursoNestedInput;
    usuarios?: Prisma.UserUpdateManyWithoutCursoNestedInput;
    inscricoes?: Prisma.InscricaoUpdateManyWithoutCursoNestedInput;
};
export type CursoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    instituicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    coordenadores?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutCursoNestedInput;
    usuarios?: Prisma.UserUncheckedUpdateManyWithoutCursoNestedInput;
    inscricoes?: Prisma.InscricaoUncheckedUpdateManyWithoutCursoNestedInput;
};
export type CursoCreateManyInput = {
    id?: string;
    nome: string;
    instituicaoId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CursoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CursoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    instituicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CursoListRelationFilter = {
    every?: Prisma.CursoWhereInput;
    some?: Prisma.CursoWhereInput;
    none?: Prisma.CursoWhereInput;
};
export type CursoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CursoNomeInstituicaoIdCompoundUniqueInput = {
    nome: string;
    instituicaoId: string;
};
export type CursoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CursoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CursoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CursoNullableScalarRelationFilter = {
    is?: Prisma.CursoWhereInput | null;
    isNot?: Prisma.CursoWhereInput | null;
};
export type CursoScalarRelationFilter = {
    is?: Prisma.CursoWhereInput;
    isNot?: Prisma.CursoWhereInput;
};
export type CursoCreateNestedManyWithoutInstituicaoInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutInstituicaoInput, Prisma.CursoUncheckedCreateWithoutInstituicaoInput> | Prisma.CursoCreateWithoutInstituicaoInput[] | Prisma.CursoUncheckedCreateWithoutInstituicaoInput[];
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutInstituicaoInput | Prisma.CursoCreateOrConnectWithoutInstituicaoInput[];
    createMany?: Prisma.CursoCreateManyInstituicaoInputEnvelope;
    connect?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
};
export type CursoUncheckedCreateNestedManyWithoutInstituicaoInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutInstituicaoInput, Prisma.CursoUncheckedCreateWithoutInstituicaoInput> | Prisma.CursoCreateWithoutInstituicaoInput[] | Prisma.CursoUncheckedCreateWithoutInstituicaoInput[];
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutInstituicaoInput | Prisma.CursoCreateOrConnectWithoutInstituicaoInput[];
    createMany?: Prisma.CursoCreateManyInstituicaoInputEnvelope;
    connect?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
};
export type CursoUpdateManyWithoutInstituicaoNestedInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutInstituicaoInput, Prisma.CursoUncheckedCreateWithoutInstituicaoInput> | Prisma.CursoCreateWithoutInstituicaoInput[] | Prisma.CursoUncheckedCreateWithoutInstituicaoInput[];
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutInstituicaoInput | Prisma.CursoCreateOrConnectWithoutInstituicaoInput[];
    upsert?: Prisma.CursoUpsertWithWhereUniqueWithoutInstituicaoInput | Prisma.CursoUpsertWithWhereUniqueWithoutInstituicaoInput[];
    createMany?: Prisma.CursoCreateManyInstituicaoInputEnvelope;
    set?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
    disconnect?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
    delete?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
    connect?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
    update?: Prisma.CursoUpdateWithWhereUniqueWithoutInstituicaoInput | Prisma.CursoUpdateWithWhereUniqueWithoutInstituicaoInput[];
    updateMany?: Prisma.CursoUpdateManyWithWhereWithoutInstituicaoInput | Prisma.CursoUpdateManyWithWhereWithoutInstituicaoInput[];
    deleteMany?: Prisma.CursoScalarWhereInput | Prisma.CursoScalarWhereInput[];
};
export type CursoUncheckedUpdateManyWithoutInstituicaoNestedInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutInstituicaoInput, Prisma.CursoUncheckedCreateWithoutInstituicaoInput> | Prisma.CursoCreateWithoutInstituicaoInput[] | Prisma.CursoUncheckedCreateWithoutInstituicaoInput[];
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutInstituicaoInput | Prisma.CursoCreateOrConnectWithoutInstituicaoInput[];
    upsert?: Prisma.CursoUpsertWithWhereUniqueWithoutInstituicaoInput | Prisma.CursoUpsertWithWhereUniqueWithoutInstituicaoInput[];
    createMany?: Prisma.CursoCreateManyInstituicaoInputEnvelope;
    set?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
    disconnect?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
    delete?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
    connect?: Prisma.CursoWhereUniqueInput | Prisma.CursoWhereUniqueInput[];
    update?: Prisma.CursoUpdateWithWhereUniqueWithoutInstituicaoInput | Prisma.CursoUpdateWithWhereUniqueWithoutInstituicaoInput[];
    updateMany?: Prisma.CursoUpdateManyWithWhereWithoutInstituicaoInput | Prisma.CursoUpdateManyWithWhereWithoutInstituicaoInput[];
    deleteMany?: Prisma.CursoScalarWhereInput | Prisma.CursoScalarWhereInput[];
};
export type CursoCreateNestedOneWithoutUsuariosInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutUsuariosInput, Prisma.CursoUncheckedCreateWithoutUsuariosInput>;
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutUsuariosInput;
    connect?: Prisma.CursoWhereUniqueInput;
};
export type CursoUpdateOneWithoutUsuariosNestedInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutUsuariosInput, Prisma.CursoUncheckedCreateWithoutUsuariosInput>;
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutUsuariosInput;
    upsert?: Prisma.CursoUpsertWithoutUsuariosInput;
    disconnect?: Prisma.CursoWhereInput | boolean;
    delete?: Prisma.CursoWhereInput | boolean;
    connect?: Prisma.CursoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CursoUpdateToOneWithWhereWithoutUsuariosInput, Prisma.CursoUpdateWithoutUsuariosInput>, Prisma.CursoUncheckedUpdateWithoutUsuariosInput>;
};
export type CursoCreateNestedOneWithoutCoordenadoresInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutCoordenadoresInput, Prisma.CursoUncheckedCreateWithoutCoordenadoresInput>;
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutCoordenadoresInput;
    connect?: Prisma.CursoWhereUniqueInput;
};
export type CursoUpdateOneRequiredWithoutCoordenadoresNestedInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutCoordenadoresInput, Prisma.CursoUncheckedCreateWithoutCoordenadoresInput>;
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutCoordenadoresInput;
    upsert?: Prisma.CursoUpsertWithoutCoordenadoresInput;
    connect?: Prisma.CursoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CursoUpdateToOneWithWhereWithoutCoordenadoresInput, Prisma.CursoUpdateWithoutCoordenadoresInput>, Prisma.CursoUncheckedUpdateWithoutCoordenadoresInput>;
};
export type CursoCreateNestedOneWithoutInscricoesInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutInscricoesInput, Prisma.CursoUncheckedCreateWithoutInscricoesInput>;
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutInscricoesInput;
    connect?: Prisma.CursoWhereUniqueInput;
};
export type CursoUpdateOneRequiredWithoutInscricoesNestedInput = {
    create?: Prisma.XOR<Prisma.CursoCreateWithoutInscricoesInput, Prisma.CursoUncheckedCreateWithoutInscricoesInput>;
    connectOrCreate?: Prisma.CursoCreateOrConnectWithoutInscricoesInput;
    upsert?: Prisma.CursoUpsertWithoutInscricoesInput;
    connect?: Prisma.CursoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CursoUpdateToOneWithWhereWithoutInscricoesInput, Prisma.CursoUpdateWithoutInscricoesInput>, Prisma.CursoUncheckedUpdateWithoutInscricoesInput>;
};
export type CursoCreateWithoutInstituicaoInput = {
    id?: string;
    nome: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    coordenadores?: Prisma.CoordenadorCursoCreateNestedManyWithoutCursoInput;
    usuarios?: Prisma.UserCreateNestedManyWithoutCursoInput;
    inscricoes?: Prisma.InscricaoCreateNestedManyWithoutCursoInput;
};
export type CursoUncheckedCreateWithoutInstituicaoInput = {
    id?: string;
    nome: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    coordenadores?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutCursoInput;
    usuarios?: Prisma.UserUncheckedCreateNestedManyWithoutCursoInput;
    inscricoes?: Prisma.InscricaoUncheckedCreateNestedManyWithoutCursoInput;
};
export type CursoCreateOrConnectWithoutInstituicaoInput = {
    where: Prisma.CursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CursoCreateWithoutInstituicaoInput, Prisma.CursoUncheckedCreateWithoutInstituicaoInput>;
};
export type CursoCreateManyInstituicaoInputEnvelope = {
    data: Prisma.CursoCreateManyInstituicaoInput | Prisma.CursoCreateManyInstituicaoInput[];
    skipDuplicates?: boolean;
};
export type CursoUpsertWithWhereUniqueWithoutInstituicaoInput = {
    where: Prisma.CursoWhereUniqueInput;
    update: Prisma.XOR<Prisma.CursoUpdateWithoutInstituicaoInput, Prisma.CursoUncheckedUpdateWithoutInstituicaoInput>;
    create: Prisma.XOR<Prisma.CursoCreateWithoutInstituicaoInput, Prisma.CursoUncheckedCreateWithoutInstituicaoInput>;
};
export type CursoUpdateWithWhereUniqueWithoutInstituicaoInput = {
    where: Prisma.CursoWhereUniqueInput;
    data: Prisma.XOR<Prisma.CursoUpdateWithoutInstituicaoInput, Prisma.CursoUncheckedUpdateWithoutInstituicaoInput>;
};
export type CursoUpdateManyWithWhereWithoutInstituicaoInput = {
    where: Prisma.CursoScalarWhereInput;
    data: Prisma.XOR<Prisma.CursoUpdateManyMutationInput, Prisma.CursoUncheckedUpdateManyWithoutInstituicaoInput>;
};
export type CursoScalarWhereInput = {
    AND?: Prisma.CursoScalarWhereInput | Prisma.CursoScalarWhereInput[];
    OR?: Prisma.CursoScalarWhereInput[];
    NOT?: Prisma.CursoScalarWhereInput | Prisma.CursoScalarWhereInput[];
    id?: Prisma.StringFilter<"Curso"> | string;
    nome?: Prisma.StringFilter<"Curso"> | string;
    instituicaoId?: Prisma.StringFilter<"Curso"> | string;
    createdAt?: Prisma.DateTimeFilter<"Curso"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Curso"> | Date | string;
};
export type CursoCreateWithoutUsuariosInput = {
    id?: string;
    nome: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao: Prisma.InstituicaoCreateNestedOneWithoutCursosInput;
    coordenadores?: Prisma.CoordenadorCursoCreateNestedManyWithoutCursoInput;
    inscricoes?: Prisma.InscricaoCreateNestedManyWithoutCursoInput;
};
export type CursoUncheckedCreateWithoutUsuariosInput = {
    id?: string;
    nome: string;
    instituicaoId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    coordenadores?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutCursoInput;
    inscricoes?: Prisma.InscricaoUncheckedCreateNestedManyWithoutCursoInput;
};
export type CursoCreateOrConnectWithoutUsuariosInput = {
    where: Prisma.CursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CursoCreateWithoutUsuariosInput, Prisma.CursoUncheckedCreateWithoutUsuariosInput>;
};
export type CursoUpsertWithoutUsuariosInput = {
    update: Prisma.XOR<Prisma.CursoUpdateWithoutUsuariosInput, Prisma.CursoUncheckedUpdateWithoutUsuariosInput>;
    create: Prisma.XOR<Prisma.CursoCreateWithoutUsuariosInput, Prisma.CursoUncheckedCreateWithoutUsuariosInput>;
    where?: Prisma.CursoWhereInput;
};
export type CursoUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: Prisma.CursoWhereInput;
    data: Prisma.XOR<Prisma.CursoUpdateWithoutUsuariosInput, Prisma.CursoUncheckedUpdateWithoutUsuariosInput>;
};
export type CursoUpdateWithoutUsuariosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneRequiredWithoutCursosNestedInput;
    coordenadores?: Prisma.CoordenadorCursoUpdateManyWithoutCursoNestedInput;
    inscricoes?: Prisma.InscricaoUpdateManyWithoutCursoNestedInput;
};
export type CursoUncheckedUpdateWithoutUsuariosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    instituicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    coordenadores?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutCursoNestedInput;
    inscricoes?: Prisma.InscricaoUncheckedUpdateManyWithoutCursoNestedInput;
};
export type CursoCreateWithoutCoordenadoresInput = {
    id?: string;
    nome: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao: Prisma.InstituicaoCreateNestedOneWithoutCursosInput;
    usuarios?: Prisma.UserCreateNestedManyWithoutCursoInput;
    inscricoes?: Prisma.InscricaoCreateNestedManyWithoutCursoInput;
};
export type CursoUncheckedCreateWithoutCoordenadoresInput = {
    id?: string;
    nome: string;
    instituicaoId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    usuarios?: Prisma.UserUncheckedCreateNestedManyWithoutCursoInput;
    inscricoes?: Prisma.InscricaoUncheckedCreateNestedManyWithoutCursoInput;
};
export type CursoCreateOrConnectWithoutCoordenadoresInput = {
    where: Prisma.CursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CursoCreateWithoutCoordenadoresInput, Prisma.CursoUncheckedCreateWithoutCoordenadoresInput>;
};
export type CursoUpsertWithoutCoordenadoresInput = {
    update: Prisma.XOR<Prisma.CursoUpdateWithoutCoordenadoresInput, Prisma.CursoUncheckedUpdateWithoutCoordenadoresInput>;
    create: Prisma.XOR<Prisma.CursoCreateWithoutCoordenadoresInput, Prisma.CursoUncheckedCreateWithoutCoordenadoresInput>;
    where?: Prisma.CursoWhereInput;
};
export type CursoUpdateToOneWithWhereWithoutCoordenadoresInput = {
    where?: Prisma.CursoWhereInput;
    data: Prisma.XOR<Prisma.CursoUpdateWithoutCoordenadoresInput, Prisma.CursoUncheckedUpdateWithoutCoordenadoresInput>;
};
export type CursoUpdateWithoutCoordenadoresInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneRequiredWithoutCursosNestedInput;
    usuarios?: Prisma.UserUpdateManyWithoutCursoNestedInput;
    inscricoes?: Prisma.InscricaoUpdateManyWithoutCursoNestedInput;
};
export type CursoUncheckedUpdateWithoutCoordenadoresInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    instituicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usuarios?: Prisma.UserUncheckedUpdateManyWithoutCursoNestedInput;
    inscricoes?: Prisma.InscricaoUncheckedUpdateManyWithoutCursoNestedInput;
};
export type CursoCreateWithoutInscricoesInput = {
    id?: string;
    nome: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao: Prisma.InstituicaoCreateNestedOneWithoutCursosInput;
    coordenadores?: Prisma.CoordenadorCursoCreateNestedManyWithoutCursoInput;
    usuarios?: Prisma.UserCreateNestedManyWithoutCursoInput;
};
export type CursoUncheckedCreateWithoutInscricoesInput = {
    id?: string;
    nome: string;
    instituicaoId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    coordenadores?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutCursoInput;
    usuarios?: Prisma.UserUncheckedCreateNestedManyWithoutCursoInput;
};
export type CursoCreateOrConnectWithoutInscricoesInput = {
    where: Prisma.CursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CursoCreateWithoutInscricoesInput, Prisma.CursoUncheckedCreateWithoutInscricoesInput>;
};
export type CursoUpsertWithoutInscricoesInput = {
    update: Prisma.XOR<Prisma.CursoUpdateWithoutInscricoesInput, Prisma.CursoUncheckedUpdateWithoutInscricoesInput>;
    create: Prisma.XOR<Prisma.CursoCreateWithoutInscricoesInput, Prisma.CursoUncheckedCreateWithoutInscricoesInput>;
    where?: Prisma.CursoWhereInput;
};
export type CursoUpdateToOneWithWhereWithoutInscricoesInput = {
    where?: Prisma.CursoWhereInput;
    data: Prisma.XOR<Prisma.CursoUpdateWithoutInscricoesInput, Prisma.CursoUncheckedUpdateWithoutInscricoesInput>;
};
export type CursoUpdateWithoutInscricoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneRequiredWithoutCursosNestedInput;
    coordenadores?: Prisma.CoordenadorCursoUpdateManyWithoutCursoNestedInput;
    usuarios?: Prisma.UserUpdateManyWithoutCursoNestedInput;
};
export type CursoUncheckedUpdateWithoutInscricoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    instituicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    coordenadores?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutCursoNestedInput;
    usuarios?: Prisma.UserUncheckedUpdateManyWithoutCursoNestedInput;
};
export type CursoCreateManyInstituicaoInput = {
    id?: string;
    nome: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CursoUpdateWithoutInstituicaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    coordenadores?: Prisma.CoordenadorCursoUpdateManyWithoutCursoNestedInput;
    usuarios?: Prisma.UserUpdateManyWithoutCursoNestedInput;
    inscricoes?: Prisma.InscricaoUpdateManyWithoutCursoNestedInput;
};
export type CursoUncheckedUpdateWithoutInstituicaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    coordenadores?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutCursoNestedInput;
    usuarios?: Prisma.UserUncheckedUpdateManyWithoutCursoNestedInput;
    inscricoes?: Prisma.InscricaoUncheckedUpdateManyWithoutCursoNestedInput;
};
export type CursoUncheckedUpdateManyWithoutInstituicaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CursoCountOutputType = {
    coordenadores: number;
    usuarios: number;
    inscricoes: number;
};
export type CursoCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    coordenadores?: boolean | CursoCountOutputTypeCountCoordenadoresArgs;
    usuarios?: boolean | CursoCountOutputTypeCountUsuariosArgs;
    inscricoes?: boolean | CursoCountOutputTypeCountInscricoesArgs;
};
export type CursoCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoCountOutputTypeSelect<ExtArgs> | null;
};
export type CursoCountOutputTypeCountCoordenadoresArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CoordenadorCursoWhereInput;
};
export type CursoCountOutputTypeCountUsuariosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type CursoCountOutputTypeCountInscricoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InscricaoWhereInput;
};
export type CursoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    instituicaoId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    instituicao?: boolean | Prisma.InstituicaoDefaultArgs<ExtArgs>;
    coordenadores?: boolean | Prisma.Curso$coordenadoresArgs<ExtArgs>;
    usuarios?: boolean | Prisma.Curso$usuariosArgs<ExtArgs>;
    inscricoes?: boolean | Prisma.Curso$inscricoesArgs<ExtArgs>;
    _count?: boolean | Prisma.CursoCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["curso"]>;
export type CursoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    instituicaoId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    instituicao?: boolean | Prisma.InstituicaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["curso"]>;
export type CursoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    instituicaoId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    instituicao?: boolean | Prisma.InstituicaoDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["curso"]>;
export type CursoSelectScalar = {
    id?: boolean;
    nome?: boolean;
    instituicaoId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CursoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "nome" | "instituicaoId" | "createdAt" | "updatedAt", ExtArgs["result"]["curso"]>;
export type CursoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    instituicao?: boolean | Prisma.InstituicaoDefaultArgs<ExtArgs>;
    coordenadores?: boolean | Prisma.Curso$coordenadoresArgs<ExtArgs>;
    usuarios?: boolean | Prisma.Curso$usuariosArgs<ExtArgs>;
    inscricoes?: boolean | Prisma.Curso$inscricoesArgs<ExtArgs>;
    _count?: boolean | Prisma.CursoCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CursoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    instituicao?: boolean | Prisma.InstituicaoDefaultArgs<ExtArgs>;
};
export type CursoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    instituicao?: boolean | Prisma.InstituicaoDefaultArgs<ExtArgs>;
};
export type $CursoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Curso";
    objects: {
        instituicao: Prisma.$InstituicaoPayload<ExtArgs>;
        coordenadores: Prisma.$CoordenadorCursoPayload<ExtArgs>[];
        usuarios: Prisma.$UserPayload<ExtArgs>[];
        inscricoes: Prisma.$InscricaoPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        nome: string;
        instituicaoId: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["curso"]>;
    composites: {};
};
export type CursoGetPayload<S extends boolean | null | undefined | CursoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CursoPayload, S>;
export type CursoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CursoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CursoCountAggregateInputType | true;
};
export interface CursoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Curso'];
        meta: {
            name: 'Curso';
        };
    };
    findUnique<T extends CursoFindUniqueArgs>(args: Prisma.SelectSubset<T, CursoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CursoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CursoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CursoFindFirstArgs>(args?: Prisma.SelectSubset<T, CursoFindFirstArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CursoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CursoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CursoFindManyArgs>(args?: Prisma.SelectSubset<T, CursoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CursoCreateArgs>(args: Prisma.SelectSubset<T, CursoCreateArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CursoCreateManyArgs>(args?: Prisma.SelectSubset<T, CursoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CursoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CursoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CursoDeleteArgs>(args: Prisma.SelectSubset<T, CursoDeleteArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CursoUpdateArgs>(args: Prisma.SelectSubset<T, CursoUpdateArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CursoDeleteManyArgs>(args?: Prisma.SelectSubset<T, CursoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CursoUpdateManyArgs>(args: Prisma.SelectSubset<T, CursoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CursoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CursoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CursoUpsertArgs>(args: Prisma.SelectSubset<T, CursoUpsertArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CursoCountArgs>(args?: Prisma.Subset<T, CursoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CursoCountAggregateOutputType> : number>;
    aggregate<T extends CursoAggregateArgs>(args: Prisma.Subset<T, CursoAggregateArgs>): Prisma.PrismaPromise<GetCursoAggregateType<T>>;
    groupBy<T extends CursoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CursoGroupByArgs['orderBy'];
    } : {
        orderBy?: CursoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CursoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCursoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CursoFieldRefs;
}
export interface Prisma__CursoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    instituicao<T extends Prisma.InstituicaoDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.InstituicaoDefaultArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    coordenadores<T extends Prisma.Curso$coordenadoresArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Curso$coordenadoresArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    usuarios<T extends Prisma.Curso$usuariosArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Curso$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    inscricoes<T extends Prisma.Curso$inscricoesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Curso$inscricoesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InscricaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CursoFieldRefs {
    readonly id: Prisma.FieldRef<"Curso", 'String'>;
    readonly nome: Prisma.FieldRef<"Curso", 'String'>;
    readonly instituicaoId: Prisma.FieldRef<"Curso", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Curso", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Curso", 'DateTime'>;
}
export type CursoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    where: Prisma.CursoWhereUniqueInput;
};
export type CursoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    where: Prisma.CursoWhereUniqueInput;
};
export type CursoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    where?: Prisma.CursoWhereInput;
    orderBy?: Prisma.CursoOrderByWithRelationInput | Prisma.CursoOrderByWithRelationInput[];
    cursor?: Prisma.CursoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CursoScalarFieldEnum | Prisma.CursoScalarFieldEnum[];
};
export type CursoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    where?: Prisma.CursoWhereInput;
    orderBy?: Prisma.CursoOrderByWithRelationInput | Prisma.CursoOrderByWithRelationInput[];
    cursor?: Prisma.CursoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CursoScalarFieldEnum | Prisma.CursoScalarFieldEnum[];
};
export type CursoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    where?: Prisma.CursoWhereInput;
    orderBy?: Prisma.CursoOrderByWithRelationInput | Prisma.CursoOrderByWithRelationInput[];
    cursor?: Prisma.CursoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CursoScalarFieldEnum | Prisma.CursoScalarFieldEnum[];
};
export type CursoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CursoCreateInput, Prisma.CursoUncheckedCreateInput>;
};
export type CursoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CursoCreateManyInput | Prisma.CursoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CursoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    data: Prisma.CursoCreateManyInput | Prisma.CursoCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CursoIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CursoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CursoUpdateInput, Prisma.CursoUncheckedUpdateInput>;
    where: Prisma.CursoWhereUniqueInput;
};
export type CursoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CursoUpdateManyMutationInput, Prisma.CursoUncheckedUpdateManyInput>;
    where?: Prisma.CursoWhereInput;
    limit?: number;
};
export type CursoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CursoUpdateManyMutationInput, Prisma.CursoUncheckedUpdateManyInput>;
    where?: Prisma.CursoWhereInput;
    limit?: number;
    include?: Prisma.CursoIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CursoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    where: Prisma.CursoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CursoCreateInput, Prisma.CursoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CursoUpdateInput, Prisma.CursoUncheckedUpdateInput>;
};
export type CursoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    where: Prisma.CursoWhereUniqueInput;
};
export type CursoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CursoWhereInput;
    limit?: number;
};
export type Curso$coordenadoresArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Curso$usuariosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type Curso$inscricoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CursoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
};

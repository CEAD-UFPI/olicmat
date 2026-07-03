import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type InstituicaoModel = runtime.Types.Result.DefaultSelection<Prisma.$InstituicaoPayload>;
export type AggregateInstituicao = {
    _count: InstituicaoCountAggregateOutputType | null;
    _min: InstituicaoMinAggregateOutputType | null;
    _max: InstituicaoMaxAggregateOutputType | null;
};
export type InstituicaoMinAggregateOutputType = {
    id: string | null;
    nome: string | null;
    sigla: string | null;
    codigoInep: string | null;
    estado: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type InstituicaoMaxAggregateOutputType = {
    id: string | null;
    nome: string | null;
    sigla: string | null;
    codigoInep: string | null;
    estado: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type InstituicaoCountAggregateOutputType = {
    id: number;
    nome: number;
    sigla: number;
    codigoInep: number;
    estado: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type InstituicaoMinAggregateInputType = {
    id?: true;
    nome?: true;
    sigla?: true;
    codigoInep?: true;
    estado?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type InstituicaoMaxAggregateInputType = {
    id?: true;
    nome?: true;
    sigla?: true;
    codigoInep?: true;
    estado?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type InstituicaoCountAggregateInputType = {
    id?: true;
    nome?: true;
    sigla?: true;
    codigoInep?: true;
    estado?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type InstituicaoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InstituicaoWhereInput;
    orderBy?: Prisma.InstituicaoOrderByWithRelationInput | Prisma.InstituicaoOrderByWithRelationInput[];
    cursor?: Prisma.InstituicaoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | InstituicaoCountAggregateInputType;
    _min?: InstituicaoMinAggregateInputType;
    _max?: InstituicaoMaxAggregateInputType;
};
export type GetInstituicaoAggregateType<T extends InstituicaoAggregateArgs> = {
    [P in keyof T & keyof AggregateInstituicao]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInstituicao[P]> : Prisma.GetScalarType<T[P], AggregateInstituicao[P]>;
};
export type InstituicaoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InstituicaoWhereInput;
    orderBy?: Prisma.InstituicaoOrderByWithAggregationInput | Prisma.InstituicaoOrderByWithAggregationInput[];
    by: Prisma.InstituicaoScalarFieldEnum[] | Prisma.InstituicaoScalarFieldEnum;
    having?: Prisma.InstituicaoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InstituicaoCountAggregateInputType | true;
    _min?: InstituicaoMinAggregateInputType;
    _max?: InstituicaoMaxAggregateInputType;
};
export type InstituicaoGroupByOutputType = {
    id: string;
    nome: string;
    sigla: string;
    codigoInep: string | null;
    estado: string;
    createdAt: Date;
    updatedAt: Date;
    _count: InstituicaoCountAggregateOutputType | null;
    _min: InstituicaoMinAggregateOutputType | null;
    _max: InstituicaoMaxAggregateOutputType | null;
};
export type GetInstituicaoGroupByPayload<T extends InstituicaoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InstituicaoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InstituicaoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InstituicaoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InstituicaoGroupByOutputType[P]>;
}>>;
export type InstituicaoWhereInput = {
    AND?: Prisma.InstituicaoWhereInput | Prisma.InstituicaoWhereInput[];
    OR?: Prisma.InstituicaoWhereInput[];
    NOT?: Prisma.InstituicaoWhereInput | Prisma.InstituicaoWhereInput[];
    id?: Prisma.StringFilter<"Instituicao"> | string;
    nome?: Prisma.StringFilter<"Instituicao"> | string;
    sigla?: Prisma.StringFilter<"Instituicao"> | string;
    codigoInep?: Prisma.StringNullableFilter<"Instituicao"> | string | null;
    estado?: Prisma.StringFilter<"Instituicao"> | string;
    createdAt?: Prisma.DateTimeFilter<"Instituicao"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Instituicao"> | Date | string;
    cursos?: Prisma.CursoListRelationFilter;
    usuarios?: Prisma.UserListRelationFilter;
    inscricoes?: Prisma.InscricaoListRelationFilter;
};
export type InstituicaoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    sigla?: Prisma.SortOrder;
    codigoInep?: Prisma.SortOrderInput | Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    cursos?: Prisma.CursoOrderByRelationAggregateInput;
    usuarios?: Prisma.UserOrderByRelationAggregateInput;
    inscricoes?: Prisma.InscricaoOrderByRelationAggregateInput;
};
export type InstituicaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    sigla?: string;
    codigoInep?: string;
    AND?: Prisma.InstituicaoWhereInput | Prisma.InstituicaoWhereInput[];
    OR?: Prisma.InstituicaoWhereInput[];
    NOT?: Prisma.InstituicaoWhereInput | Prisma.InstituicaoWhereInput[];
    nome?: Prisma.StringFilter<"Instituicao"> | string;
    estado?: Prisma.StringFilter<"Instituicao"> | string;
    createdAt?: Prisma.DateTimeFilter<"Instituicao"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Instituicao"> | Date | string;
    cursos?: Prisma.CursoListRelationFilter;
    usuarios?: Prisma.UserListRelationFilter;
    inscricoes?: Prisma.InscricaoListRelationFilter;
}, "id" | "sigla" | "codigoInep">;
export type InstituicaoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    sigla?: Prisma.SortOrder;
    codigoInep?: Prisma.SortOrderInput | Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.InstituicaoCountOrderByAggregateInput;
    _max?: Prisma.InstituicaoMaxOrderByAggregateInput;
    _min?: Prisma.InstituicaoMinOrderByAggregateInput;
};
export type InstituicaoScalarWhereWithAggregatesInput = {
    AND?: Prisma.InstituicaoScalarWhereWithAggregatesInput | Prisma.InstituicaoScalarWhereWithAggregatesInput[];
    OR?: Prisma.InstituicaoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InstituicaoScalarWhereWithAggregatesInput | Prisma.InstituicaoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Instituicao"> | string;
    nome?: Prisma.StringWithAggregatesFilter<"Instituicao"> | string;
    sigla?: Prisma.StringWithAggregatesFilter<"Instituicao"> | string;
    codigoInep?: Prisma.StringNullableWithAggregatesFilter<"Instituicao"> | string | null;
    estado?: Prisma.StringWithAggregatesFilter<"Instituicao"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Instituicao"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Instituicao"> | Date | string;
};
export type InstituicaoCreateInput = {
    id?: string;
    nome: string;
    sigla: string;
    codigoInep?: string | null;
    estado: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cursos?: Prisma.CursoCreateNestedManyWithoutInstituicaoInput;
    usuarios?: Prisma.UserCreateNestedManyWithoutInstituicaoInput;
    inscricoes?: Prisma.InscricaoCreateNestedManyWithoutInstituicaoInput;
};
export type InstituicaoUncheckedCreateInput = {
    id?: string;
    nome: string;
    sigla: string;
    codigoInep?: string | null;
    estado: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cursos?: Prisma.CursoUncheckedCreateNestedManyWithoutInstituicaoInput;
    usuarios?: Prisma.UserUncheckedCreateNestedManyWithoutInstituicaoInput;
    inscricoes?: Prisma.InscricaoUncheckedCreateNestedManyWithoutInstituicaoInput;
};
export type InstituicaoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cursos?: Prisma.CursoUpdateManyWithoutInstituicaoNestedInput;
    usuarios?: Prisma.UserUpdateManyWithoutInstituicaoNestedInput;
    inscricoes?: Prisma.InscricaoUpdateManyWithoutInstituicaoNestedInput;
};
export type InstituicaoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cursos?: Prisma.CursoUncheckedUpdateManyWithoutInstituicaoNestedInput;
    usuarios?: Prisma.UserUncheckedUpdateManyWithoutInstituicaoNestedInput;
    inscricoes?: Prisma.InscricaoUncheckedUpdateManyWithoutInstituicaoNestedInput;
};
export type InstituicaoCreateManyInput = {
    id?: string;
    nome: string;
    sigla: string;
    codigoInep?: string | null;
    estado: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InstituicaoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InstituicaoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InstituicaoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    sigla?: Prisma.SortOrder;
    codigoInep?: Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InstituicaoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    sigla?: Prisma.SortOrder;
    codigoInep?: Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InstituicaoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    sigla?: Prisma.SortOrder;
    codigoInep?: Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InstituicaoScalarRelationFilter = {
    is?: Prisma.InstituicaoWhereInput;
    isNot?: Prisma.InstituicaoWhereInput;
};
export type InstituicaoNullableScalarRelationFilter = {
    is?: Prisma.InstituicaoWhereInput | null;
    isNot?: Prisma.InstituicaoWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type InstituicaoCreateNestedOneWithoutCursosInput = {
    create?: Prisma.XOR<Prisma.InstituicaoCreateWithoutCursosInput, Prisma.InstituicaoUncheckedCreateWithoutCursosInput>;
    connectOrCreate?: Prisma.InstituicaoCreateOrConnectWithoutCursosInput;
    connect?: Prisma.InstituicaoWhereUniqueInput;
};
export type InstituicaoUpdateOneRequiredWithoutCursosNestedInput = {
    create?: Prisma.XOR<Prisma.InstituicaoCreateWithoutCursosInput, Prisma.InstituicaoUncheckedCreateWithoutCursosInput>;
    connectOrCreate?: Prisma.InstituicaoCreateOrConnectWithoutCursosInput;
    upsert?: Prisma.InstituicaoUpsertWithoutCursosInput;
    connect?: Prisma.InstituicaoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.InstituicaoUpdateToOneWithWhereWithoutCursosInput, Prisma.InstituicaoUpdateWithoutCursosInput>, Prisma.InstituicaoUncheckedUpdateWithoutCursosInput>;
};
export type InstituicaoCreateNestedOneWithoutUsuariosInput = {
    create?: Prisma.XOR<Prisma.InstituicaoCreateWithoutUsuariosInput, Prisma.InstituicaoUncheckedCreateWithoutUsuariosInput>;
    connectOrCreate?: Prisma.InstituicaoCreateOrConnectWithoutUsuariosInput;
    connect?: Prisma.InstituicaoWhereUniqueInput;
};
export type InstituicaoUpdateOneWithoutUsuariosNestedInput = {
    create?: Prisma.XOR<Prisma.InstituicaoCreateWithoutUsuariosInput, Prisma.InstituicaoUncheckedCreateWithoutUsuariosInput>;
    connectOrCreate?: Prisma.InstituicaoCreateOrConnectWithoutUsuariosInput;
    upsert?: Prisma.InstituicaoUpsertWithoutUsuariosInput;
    disconnect?: Prisma.InstituicaoWhereInput | boolean;
    delete?: Prisma.InstituicaoWhereInput | boolean;
    connect?: Prisma.InstituicaoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.InstituicaoUpdateToOneWithWhereWithoutUsuariosInput, Prisma.InstituicaoUpdateWithoutUsuariosInput>, Prisma.InstituicaoUncheckedUpdateWithoutUsuariosInput>;
};
export type InstituicaoCreateNestedOneWithoutInscricoesInput = {
    create?: Prisma.XOR<Prisma.InstituicaoCreateWithoutInscricoesInput, Prisma.InstituicaoUncheckedCreateWithoutInscricoesInput>;
    connectOrCreate?: Prisma.InstituicaoCreateOrConnectWithoutInscricoesInput;
    connect?: Prisma.InstituicaoWhereUniqueInput;
};
export type InstituicaoUpdateOneRequiredWithoutInscricoesNestedInput = {
    create?: Prisma.XOR<Prisma.InstituicaoCreateWithoutInscricoesInput, Prisma.InstituicaoUncheckedCreateWithoutInscricoesInput>;
    connectOrCreate?: Prisma.InstituicaoCreateOrConnectWithoutInscricoesInput;
    upsert?: Prisma.InstituicaoUpsertWithoutInscricoesInput;
    connect?: Prisma.InstituicaoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.InstituicaoUpdateToOneWithWhereWithoutInscricoesInput, Prisma.InstituicaoUpdateWithoutInscricoesInput>, Prisma.InstituicaoUncheckedUpdateWithoutInscricoesInput>;
};
export type InstituicaoCreateWithoutCursosInput = {
    id?: string;
    nome: string;
    sigla: string;
    codigoInep?: string | null;
    estado: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    usuarios?: Prisma.UserCreateNestedManyWithoutInstituicaoInput;
    inscricoes?: Prisma.InscricaoCreateNestedManyWithoutInstituicaoInput;
};
export type InstituicaoUncheckedCreateWithoutCursosInput = {
    id?: string;
    nome: string;
    sigla: string;
    codigoInep?: string | null;
    estado: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    usuarios?: Prisma.UserUncheckedCreateNestedManyWithoutInstituicaoInput;
    inscricoes?: Prisma.InscricaoUncheckedCreateNestedManyWithoutInstituicaoInput;
};
export type InstituicaoCreateOrConnectWithoutCursosInput = {
    where: Prisma.InstituicaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.InstituicaoCreateWithoutCursosInput, Prisma.InstituicaoUncheckedCreateWithoutCursosInput>;
};
export type InstituicaoUpsertWithoutCursosInput = {
    update: Prisma.XOR<Prisma.InstituicaoUpdateWithoutCursosInput, Prisma.InstituicaoUncheckedUpdateWithoutCursosInput>;
    create: Prisma.XOR<Prisma.InstituicaoCreateWithoutCursosInput, Prisma.InstituicaoUncheckedCreateWithoutCursosInput>;
    where?: Prisma.InstituicaoWhereInput;
};
export type InstituicaoUpdateToOneWithWhereWithoutCursosInput = {
    where?: Prisma.InstituicaoWhereInput;
    data: Prisma.XOR<Prisma.InstituicaoUpdateWithoutCursosInput, Prisma.InstituicaoUncheckedUpdateWithoutCursosInput>;
};
export type InstituicaoUpdateWithoutCursosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usuarios?: Prisma.UserUpdateManyWithoutInstituicaoNestedInput;
    inscricoes?: Prisma.InscricaoUpdateManyWithoutInstituicaoNestedInput;
};
export type InstituicaoUncheckedUpdateWithoutCursosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usuarios?: Prisma.UserUncheckedUpdateManyWithoutInstituicaoNestedInput;
    inscricoes?: Prisma.InscricaoUncheckedUpdateManyWithoutInstituicaoNestedInput;
};
export type InstituicaoCreateWithoutUsuariosInput = {
    id?: string;
    nome: string;
    sigla: string;
    codigoInep?: string | null;
    estado: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cursos?: Prisma.CursoCreateNestedManyWithoutInstituicaoInput;
    inscricoes?: Prisma.InscricaoCreateNestedManyWithoutInstituicaoInput;
};
export type InstituicaoUncheckedCreateWithoutUsuariosInput = {
    id?: string;
    nome: string;
    sigla: string;
    codigoInep?: string | null;
    estado: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cursos?: Prisma.CursoUncheckedCreateNestedManyWithoutInstituicaoInput;
    inscricoes?: Prisma.InscricaoUncheckedCreateNestedManyWithoutInstituicaoInput;
};
export type InstituicaoCreateOrConnectWithoutUsuariosInput = {
    where: Prisma.InstituicaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.InstituicaoCreateWithoutUsuariosInput, Prisma.InstituicaoUncheckedCreateWithoutUsuariosInput>;
};
export type InstituicaoUpsertWithoutUsuariosInput = {
    update: Prisma.XOR<Prisma.InstituicaoUpdateWithoutUsuariosInput, Prisma.InstituicaoUncheckedUpdateWithoutUsuariosInput>;
    create: Prisma.XOR<Prisma.InstituicaoCreateWithoutUsuariosInput, Prisma.InstituicaoUncheckedCreateWithoutUsuariosInput>;
    where?: Prisma.InstituicaoWhereInput;
};
export type InstituicaoUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: Prisma.InstituicaoWhereInput;
    data: Prisma.XOR<Prisma.InstituicaoUpdateWithoutUsuariosInput, Prisma.InstituicaoUncheckedUpdateWithoutUsuariosInput>;
};
export type InstituicaoUpdateWithoutUsuariosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cursos?: Prisma.CursoUpdateManyWithoutInstituicaoNestedInput;
    inscricoes?: Prisma.InscricaoUpdateManyWithoutInstituicaoNestedInput;
};
export type InstituicaoUncheckedUpdateWithoutUsuariosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cursos?: Prisma.CursoUncheckedUpdateManyWithoutInstituicaoNestedInput;
    inscricoes?: Prisma.InscricaoUncheckedUpdateManyWithoutInstituicaoNestedInput;
};
export type InstituicaoCreateWithoutInscricoesInput = {
    id?: string;
    nome: string;
    sigla: string;
    codigoInep?: string | null;
    estado: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cursos?: Prisma.CursoCreateNestedManyWithoutInstituicaoInput;
    usuarios?: Prisma.UserCreateNestedManyWithoutInstituicaoInput;
};
export type InstituicaoUncheckedCreateWithoutInscricoesInput = {
    id?: string;
    nome: string;
    sigla: string;
    codigoInep?: string | null;
    estado: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cursos?: Prisma.CursoUncheckedCreateNestedManyWithoutInstituicaoInput;
    usuarios?: Prisma.UserUncheckedCreateNestedManyWithoutInstituicaoInput;
};
export type InstituicaoCreateOrConnectWithoutInscricoesInput = {
    where: Prisma.InstituicaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.InstituicaoCreateWithoutInscricoesInput, Prisma.InstituicaoUncheckedCreateWithoutInscricoesInput>;
};
export type InstituicaoUpsertWithoutInscricoesInput = {
    update: Prisma.XOR<Prisma.InstituicaoUpdateWithoutInscricoesInput, Prisma.InstituicaoUncheckedUpdateWithoutInscricoesInput>;
    create: Prisma.XOR<Prisma.InstituicaoCreateWithoutInscricoesInput, Prisma.InstituicaoUncheckedCreateWithoutInscricoesInput>;
    where?: Prisma.InstituicaoWhereInput;
};
export type InstituicaoUpdateToOneWithWhereWithoutInscricoesInput = {
    where?: Prisma.InstituicaoWhereInput;
    data: Prisma.XOR<Prisma.InstituicaoUpdateWithoutInscricoesInput, Prisma.InstituicaoUncheckedUpdateWithoutInscricoesInput>;
};
export type InstituicaoUpdateWithoutInscricoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cursos?: Prisma.CursoUpdateManyWithoutInstituicaoNestedInput;
    usuarios?: Prisma.UserUpdateManyWithoutInstituicaoNestedInput;
};
export type InstituicaoUncheckedUpdateWithoutInscricoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    sigla?: Prisma.StringFieldUpdateOperationsInput | string;
    codigoInep?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cursos?: Prisma.CursoUncheckedUpdateManyWithoutInstituicaoNestedInput;
    usuarios?: Prisma.UserUncheckedUpdateManyWithoutInstituicaoNestedInput;
};
export type InstituicaoCountOutputType = {
    cursos: number;
    usuarios: number;
    inscricoes: number;
};
export type InstituicaoCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cursos?: boolean | InstituicaoCountOutputTypeCountCursosArgs;
    usuarios?: boolean | InstituicaoCountOutputTypeCountUsuariosArgs;
    inscricoes?: boolean | InstituicaoCountOutputTypeCountInscricoesArgs;
};
export type InstituicaoCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoCountOutputTypeSelect<ExtArgs> | null;
};
export type InstituicaoCountOutputTypeCountCursosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CursoWhereInput;
};
export type InstituicaoCountOutputTypeCountUsuariosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type InstituicaoCountOutputTypeCountInscricoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InscricaoWhereInput;
};
export type InstituicaoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    sigla?: boolean;
    codigoInep?: boolean;
    estado?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    cursos?: boolean | Prisma.Instituicao$cursosArgs<ExtArgs>;
    usuarios?: boolean | Prisma.Instituicao$usuariosArgs<ExtArgs>;
    inscricoes?: boolean | Prisma.Instituicao$inscricoesArgs<ExtArgs>;
    _count?: boolean | Prisma.InstituicaoCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["instituicao"]>;
export type InstituicaoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    sigla?: boolean;
    codigoInep?: boolean;
    estado?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["instituicao"]>;
export type InstituicaoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    sigla?: boolean;
    codigoInep?: boolean;
    estado?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["instituicao"]>;
export type InstituicaoSelectScalar = {
    id?: boolean;
    nome?: boolean;
    sigla?: boolean;
    codigoInep?: boolean;
    estado?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type InstituicaoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "nome" | "sigla" | "codigoInep" | "estado" | "createdAt" | "updatedAt", ExtArgs["result"]["instituicao"]>;
export type InstituicaoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cursos?: boolean | Prisma.Instituicao$cursosArgs<ExtArgs>;
    usuarios?: boolean | Prisma.Instituicao$usuariosArgs<ExtArgs>;
    inscricoes?: boolean | Prisma.Instituicao$inscricoesArgs<ExtArgs>;
    _count?: boolean | Prisma.InstituicaoCountOutputTypeDefaultArgs<ExtArgs>;
};
export type InstituicaoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type InstituicaoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $InstituicaoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Instituicao";
    objects: {
        cursos: Prisma.$CursoPayload<ExtArgs>[];
        usuarios: Prisma.$UserPayload<ExtArgs>[];
        inscricoes: Prisma.$InscricaoPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        nome: string;
        sigla: string;
        codigoInep: string | null;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["instituicao"]>;
    composites: {};
};
export type InstituicaoGetPayload<S extends boolean | null | undefined | InstituicaoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload, S>;
export type InstituicaoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InstituicaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InstituicaoCountAggregateInputType | true;
};
export interface InstituicaoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Instituicao'];
        meta: {
            name: 'Instituicao';
        };
    };
    findUnique<T extends InstituicaoFindUniqueArgs>(args: Prisma.SelectSubset<T, InstituicaoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends InstituicaoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InstituicaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends InstituicaoFindFirstArgs>(args?: Prisma.SelectSubset<T, InstituicaoFindFirstArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends InstituicaoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InstituicaoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends InstituicaoFindManyArgs>(args?: Prisma.SelectSubset<T, InstituicaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends InstituicaoCreateArgs>(args: Prisma.SelectSubset<T, InstituicaoCreateArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends InstituicaoCreateManyArgs>(args?: Prisma.SelectSubset<T, InstituicaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends InstituicaoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InstituicaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends InstituicaoDeleteArgs>(args: Prisma.SelectSubset<T, InstituicaoDeleteArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends InstituicaoUpdateArgs>(args: Prisma.SelectSubset<T, InstituicaoUpdateArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends InstituicaoDeleteManyArgs>(args?: Prisma.SelectSubset<T, InstituicaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends InstituicaoUpdateManyArgs>(args: Prisma.SelectSubset<T, InstituicaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends InstituicaoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InstituicaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends InstituicaoUpsertArgs>(args: Prisma.SelectSubset<T, InstituicaoUpsertArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends InstituicaoCountArgs>(args?: Prisma.Subset<T, InstituicaoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InstituicaoCountAggregateOutputType> : number>;
    aggregate<T extends InstituicaoAggregateArgs>(args: Prisma.Subset<T, InstituicaoAggregateArgs>): Prisma.PrismaPromise<GetInstituicaoAggregateType<T>>;
    groupBy<T extends InstituicaoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InstituicaoGroupByArgs['orderBy'];
    } : {
        orderBy?: InstituicaoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InstituicaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInstituicaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: InstituicaoFieldRefs;
}
export interface Prisma__InstituicaoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    cursos<T extends Prisma.Instituicao$cursosArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Instituicao$cursosArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    usuarios<T extends Prisma.Instituicao$usuariosArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Instituicao$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    inscricoes<T extends Prisma.Instituicao$inscricoesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Instituicao$inscricoesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InscricaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface InstituicaoFieldRefs {
    readonly id: Prisma.FieldRef<"Instituicao", 'String'>;
    readonly nome: Prisma.FieldRef<"Instituicao", 'String'>;
    readonly sigla: Prisma.FieldRef<"Instituicao", 'String'>;
    readonly codigoInep: Prisma.FieldRef<"Instituicao", 'String'>;
    readonly estado: Prisma.FieldRef<"Instituicao", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Instituicao", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Instituicao", 'DateTime'>;
}
export type InstituicaoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    where: Prisma.InstituicaoWhereUniqueInput;
};
export type InstituicaoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    where: Prisma.InstituicaoWhereUniqueInput;
};
export type InstituicaoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    where?: Prisma.InstituicaoWhereInput;
    orderBy?: Prisma.InstituicaoOrderByWithRelationInput | Prisma.InstituicaoOrderByWithRelationInput[];
    cursor?: Prisma.InstituicaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InstituicaoScalarFieldEnum | Prisma.InstituicaoScalarFieldEnum[];
};
export type InstituicaoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    where?: Prisma.InstituicaoWhereInput;
    orderBy?: Prisma.InstituicaoOrderByWithRelationInput | Prisma.InstituicaoOrderByWithRelationInput[];
    cursor?: Prisma.InstituicaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InstituicaoScalarFieldEnum | Prisma.InstituicaoScalarFieldEnum[];
};
export type InstituicaoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    where?: Prisma.InstituicaoWhereInput;
    orderBy?: Prisma.InstituicaoOrderByWithRelationInput | Prisma.InstituicaoOrderByWithRelationInput[];
    cursor?: Prisma.InstituicaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InstituicaoScalarFieldEnum | Prisma.InstituicaoScalarFieldEnum[];
};
export type InstituicaoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InstituicaoCreateInput, Prisma.InstituicaoUncheckedCreateInput>;
};
export type InstituicaoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.InstituicaoCreateManyInput | Prisma.InstituicaoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type InstituicaoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    data: Prisma.InstituicaoCreateManyInput | Prisma.InstituicaoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type InstituicaoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InstituicaoUpdateInput, Prisma.InstituicaoUncheckedUpdateInput>;
    where: Prisma.InstituicaoWhereUniqueInput;
};
export type InstituicaoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.InstituicaoUpdateManyMutationInput, Prisma.InstituicaoUncheckedUpdateManyInput>;
    where?: Prisma.InstituicaoWhereInput;
    limit?: number;
};
export type InstituicaoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InstituicaoUpdateManyMutationInput, Prisma.InstituicaoUncheckedUpdateManyInput>;
    where?: Prisma.InstituicaoWhereInput;
    limit?: number;
};
export type InstituicaoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    where: Prisma.InstituicaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.InstituicaoCreateInput, Prisma.InstituicaoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.InstituicaoUpdateInput, Prisma.InstituicaoUncheckedUpdateInput>;
};
export type InstituicaoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    where: Prisma.InstituicaoWhereUniqueInput;
};
export type InstituicaoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InstituicaoWhereInput;
    limit?: number;
};
export type Instituicao$cursosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Instituicao$usuariosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Instituicao$inscricoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InstituicaoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
};

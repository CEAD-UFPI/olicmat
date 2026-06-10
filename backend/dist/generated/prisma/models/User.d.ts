import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    nome: string | null;
    email: string | null;
    cpf: string | null;
    senhaHash: string | null;
    role: $Enums.Role | null;
    instituicaoId: string | null;
    cursoId: string | null;
    matricula: string | null;
    comprovanteUrl: string | null;
    dataNascimento: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    nome: string | null;
    email: string | null;
    cpf: string | null;
    senhaHash: string | null;
    role: $Enums.Role | null;
    instituicaoId: string | null;
    cursoId: string | null;
    matricula: string | null;
    comprovanteUrl: string | null;
    dataNascimento: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    nome: number;
    email: number;
    cpf: number;
    senhaHash: number;
    role: number;
    instituicaoId: number;
    cursoId: number;
    matricula: number;
    comprovanteUrl: number;
    dataNascimento: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    nome?: true;
    email?: true;
    cpf?: true;
    senhaHash?: true;
    role?: true;
    instituicaoId?: true;
    cursoId?: true;
    matricula?: true;
    comprovanteUrl?: true;
    dataNascimento?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    nome?: true;
    email?: true;
    cpf?: true;
    senhaHash?: true;
    role?: true;
    instituicaoId?: true;
    cursoId?: true;
    matricula?: true;
    comprovanteUrl?: true;
    dataNascimento?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    nome?: true;
    email?: true;
    cpf?: true;
    senhaHash?: true;
    role?: true;
    instituicaoId?: true;
    cursoId?: true;
    matricula?: true;
    comprovanteUrl?: true;
    dataNascimento?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role: $Enums.Role;
    instituicaoId: string | null;
    cursoId: string | null;
    matricula: string;
    comprovanteUrl: string | null;
    dataNascimento: Date;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    nome?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    cpf?: Prisma.StringFilter<"User"> | string;
    senhaHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    instituicaoId?: Prisma.StringNullableFilter<"User"> | string | null;
    cursoId?: Prisma.StringNullableFilter<"User"> | string | null;
    matricula?: Prisma.StringFilter<"User"> | string;
    comprovanteUrl?: Prisma.StringNullableFilter<"User"> | string | null;
    dataNascimento?: Prisma.DateTimeFilter<"User"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    instituicao?: Prisma.XOR<Prisma.InstituicaoNullableScalarRelationFilter, Prisma.InstituicaoWhereInput> | null;
    curso?: Prisma.XOR<Prisma.CursoNullableScalarRelationFilter, Prisma.CursoWhereInput> | null;
    inscricao?: Prisma.XOR<Prisma.InscricaoNullableScalarRelationFilter, Prisma.InscricaoWhereInput> | null;
    coordenadorias?: Prisma.CoordenadorCursoListRelationFilter;
    avaliacoes?: Prisma.AvaliacaoFase2ListRelationFilter;
    auditLogs?: Prisma.AuditLogListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrderInput | Prisma.SortOrder;
    cursoId?: Prisma.SortOrderInput | Prisma.SortOrder;
    matricula?: Prisma.SortOrder;
    comprovanteUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    dataNascimento?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    instituicao?: Prisma.InstituicaoOrderByWithRelationInput;
    curso?: Prisma.CursoOrderByWithRelationInput;
    inscricao?: Prisma.InscricaoOrderByWithRelationInput;
    coordenadorias?: Prisma.CoordenadorCursoOrderByRelationAggregateInput;
    avaliacoes?: Prisma.AvaliacaoFase2OrderByRelationAggregateInput;
    auditLogs?: Prisma.AuditLogOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    cpf?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    nome?: Prisma.StringFilter<"User"> | string;
    senhaHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    instituicaoId?: Prisma.StringNullableFilter<"User"> | string | null;
    cursoId?: Prisma.StringNullableFilter<"User"> | string | null;
    matricula?: Prisma.StringFilter<"User"> | string;
    comprovanteUrl?: Prisma.StringNullableFilter<"User"> | string | null;
    dataNascimento?: Prisma.DateTimeFilter<"User"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    instituicao?: Prisma.XOR<Prisma.InstituicaoNullableScalarRelationFilter, Prisma.InstituicaoWhereInput> | null;
    curso?: Prisma.XOR<Prisma.CursoNullableScalarRelationFilter, Prisma.CursoWhereInput> | null;
    inscricao?: Prisma.XOR<Prisma.InscricaoNullableScalarRelationFilter, Prisma.InscricaoWhereInput> | null;
    coordenadorias?: Prisma.CoordenadorCursoListRelationFilter;
    avaliacoes?: Prisma.AvaliacaoFase2ListRelationFilter;
    auditLogs?: Prisma.AuditLogListRelationFilter;
}, "id" | "email" | "cpf">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrderInput | Prisma.SortOrder;
    cursoId?: Prisma.SortOrderInput | Prisma.SortOrder;
    matricula?: Prisma.SortOrder;
    comprovanteUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    dataNascimento?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    nome?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    cpf?: Prisma.StringWithAggregatesFilter<"User"> | string;
    senhaHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    role?: Prisma.EnumRoleWithAggregatesFilter<"User"> | $Enums.Role;
    instituicaoId?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    cursoId?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    matricula?: Prisma.StringWithAggregatesFilter<"User"> | string;
    comprovanteUrl?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    dataNascimento?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao?: Prisma.InstituicaoCreateNestedOneWithoutUsuariosInput;
    curso?: Prisma.CursoCreateNestedOneWithoutUsuariosInput;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2CreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    instituicaoId?: string | null;
    cursoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedCreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneWithoutUsuariosNestedInput;
    curso?: Prisma.CursoUpdateOneWithoutUsuariosNestedInput;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicaoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cursoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedUpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    instituicaoId?: string | null;
    cursoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicaoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cursoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserListRelationFilter = {
    every?: Prisma.UserWhereInput;
    some?: Prisma.UserWhereInput;
    none?: Prisma.UserWhereInput;
};
export type UserOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrder;
    cursoId?: Prisma.SortOrder;
    matricula?: Prisma.SortOrder;
    comprovanteUrl?: Prisma.SortOrder;
    dataNascimento?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrder;
    cursoId?: Prisma.SortOrder;
    matricula?: Prisma.SortOrder;
    comprovanteUrl?: Prisma.SortOrder;
    dataNascimento?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicaoId?: Prisma.SortOrder;
    cursoId?: Prisma.SortOrder;
    matricula?: Prisma.SortOrder;
    comprovanteUrl?: Prisma.SortOrder;
    dataNascimento?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserCreateNestedManyWithoutInstituicaoInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInstituicaoInput, Prisma.UserUncheckedCreateWithoutInstituicaoInput> | Prisma.UserCreateWithoutInstituicaoInput[] | Prisma.UserUncheckedCreateWithoutInstituicaoInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInstituicaoInput | Prisma.UserCreateOrConnectWithoutInstituicaoInput[];
    createMany?: Prisma.UserCreateManyInstituicaoInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUncheckedCreateNestedManyWithoutInstituicaoInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInstituicaoInput, Prisma.UserUncheckedCreateWithoutInstituicaoInput> | Prisma.UserCreateWithoutInstituicaoInput[] | Prisma.UserUncheckedCreateWithoutInstituicaoInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInstituicaoInput | Prisma.UserCreateOrConnectWithoutInstituicaoInput[];
    createMany?: Prisma.UserCreateManyInstituicaoInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUpdateManyWithoutInstituicaoNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInstituicaoInput, Prisma.UserUncheckedCreateWithoutInstituicaoInput> | Prisma.UserCreateWithoutInstituicaoInput[] | Prisma.UserUncheckedCreateWithoutInstituicaoInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInstituicaoInput | Prisma.UserCreateOrConnectWithoutInstituicaoInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutInstituicaoInput | Prisma.UserUpsertWithWhereUniqueWithoutInstituicaoInput[];
    createMany?: Prisma.UserCreateManyInstituicaoInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutInstituicaoInput | Prisma.UserUpdateWithWhereUniqueWithoutInstituicaoInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutInstituicaoInput | Prisma.UserUpdateManyWithWhereWithoutInstituicaoInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserUncheckedUpdateManyWithoutInstituicaoNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInstituicaoInput, Prisma.UserUncheckedCreateWithoutInstituicaoInput> | Prisma.UserCreateWithoutInstituicaoInput[] | Prisma.UserUncheckedCreateWithoutInstituicaoInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInstituicaoInput | Prisma.UserCreateOrConnectWithoutInstituicaoInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutInstituicaoInput | Prisma.UserUpsertWithWhereUniqueWithoutInstituicaoInput[];
    createMany?: Prisma.UserCreateManyInstituicaoInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutInstituicaoInput | Prisma.UserUpdateWithWhereUniqueWithoutInstituicaoInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutInstituicaoInput | Prisma.UserUpdateManyWithWhereWithoutInstituicaoInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserCreateNestedManyWithoutCursoInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCursoInput, Prisma.UserUncheckedCreateWithoutCursoInput> | Prisma.UserCreateWithoutCursoInput[] | Prisma.UserUncheckedCreateWithoutCursoInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCursoInput | Prisma.UserCreateOrConnectWithoutCursoInput[];
    createMany?: Prisma.UserCreateManyCursoInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUncheckedCreateNestedManyWithoutCursoInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCursoInput, Prisma.UserUncheckedCreateWithoutCursoInput> | Prisma.UserCreateWithoutCursoInput[] | Prisma.UserUncheckedCreateWithoutCursoInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCursoInput | Prisma.UserCreateOrConnectWithoutCursoInput[];
    createMany?: Prisma.UserCreateManyCursoInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUpdateManyWithoutCursoNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCursoInput, Prisma.UserUncheckedCreateWithoutCursoInput> | Prisma.UserCreateWithoutCursoInput[] | Prisma.UserUncheckedCreateWithoutCursoInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCursoInput | Prisma.UserCreateOrConnectWithoutCursoInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutCursoInput | Prisma.UserUpsertWithWhereUniqueWithoutCursoInput[];
    createMany?: Prisma.UserCreateManyCursoInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutCursoInput | Prisma.UserUpdateWithWhereUniqueWithoutCursoInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutCursoInput | Prisma.UserUpdateManyWithWhereWithoutCursoInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserUncheckedUpdateManyWithoutCursoNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCursoInput, Prisma.UserUncheckedCreateWithoutCursoInput> | Prisma.UserCreateWithoutCursoInput[] | Prisma.UserUncheckedCreateWithoutCursoInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCursoInput | Prisma.UserCreateOrConnectWithoutCursoInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutCursoInput | Prisma.UserUpsertWithWhereUniqueWithoutCursoInput[];
    createMany?: Prisma.UserCreateManyCursoInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutCursoInput | Prisma.UserUpdateWithWhereUniqueWithoutCursoInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutCursoInput | Prisma.UserUpdateManyWithWhereWithoutCursoInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type UserCreateNestedOneWithoutCoordenadoriasInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCoordenadoriasInput, Prisma.UserUncheckedCreateWithoutCoordenadoriasInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCoordenadoriasInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutCoordenadoriasNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCoordenadoriasInput, Prisma.UserUncheckedCreateWithoutCoordenadoriasInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCoordenadoriasInput;
    upsert?: Prisma.UserUpsertWithoutCoordenadoriasInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCoordenadoriasInput, Prisma.UserUpdateWithoutCoordenadoriasInput>, Prisma.UserUncheckedUpdateWithoutCoordenadoriasInput>;
};
export type UserCreateNestedOneWithoutInscricaoInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInscricaoInput, Prisma.UserUncheckedCreateWithoutInscricaoInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInscricaoInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutInscricaoNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInscricaoInput, Prisma.UserUncheckedCreateWithoutInscricaoInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInscricaoInput;
    upsert?: Prisma.UserUpsertWithoutInscricaoInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutInscricaoInput, Prisma.UserUpdateWithoutInscricaoInput>, Prisma.UserUncheckedUpdateWithoutInscricaoInput>;
};
export type UserCreateNestedOneWithoutAvaliacoesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAvaliacoesInput, Prisma.UserUncheckedCreateWithoutAvaliacoesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAvaliacoesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutAvaliacoesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAvaliacoesInput, Prisma.UserUncheckedCreateWithoutAvaliacoesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAvaliacoesInput;
    upsert?: Prisma.UserUpsertWithoutAvaliacoesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAvaliacoesInput, Prisma.UserUpdateWithoutAvaliacoesInput>, Prisma.UserUncheckedUpdateWithoutAvaliacoesInput>;
};
export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuditLogsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuditLogsInput;
    upsert?: Prisma.UserUpsertWithoutAuditLogsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAuditLogsInput, Prisma.UserUpdateWithoutAuditLogsInput>, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
};
export type UserCreateWithoutInstituicaoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    curso?: Prisma.CursoCreateNestedOneWithoutUsuariosInput;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2CreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutInstituicaoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    cursoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedCreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutInstituicaoInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutInstituicaoInput, Prisma.UserUncheckedCreateWithoutInstituicaoInput>;
};
export type UserCreateManyInstituicaoInputEnvelope = {
    data: Prisma.UserCreateManyInstituicaoInput | Prisma.UserCreateManyInstituicaoInput[];
    skipDuplicates?: boolean;
};
export type UserUpsertWithWhereUniqueWithoutInstituicaoInput = {
    where: Prisma.UserWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserUpdateWithoutInstituicaoInput, Prisma.UserUncheckedUpdateWithoutInstituicaoInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutInstituicaoInput, Prisma.UserUncheckedCreateWithoutInstituicaoInput>;
};
export type UserUpdateWithWhereUniqueWithoutInstituicaoInput = {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutInstituicaoInput, Prisma.UserUncheckedUpdateWithoutInstituicaoInput>;
};
export type UserUpdateManyWithWhereWithoutInstituicaoInput = {
    where: Prisma.UserScalarWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyWithoutInstituicaoInput>;
};
export type UserScalarWhereInput = {
    AND?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    OR?: Prisma.UserScalarWhereInput[];
    NOT?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    nome?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    cpf?: Prisma.StringFilter<"User"> | string;
    senhaHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    instituicaoId?: Prisma.StringNullableFilter<"User"> | string | null;
    cursoId?: Prisma.StringNullableFilter<"User"> | string | null;
    matricula?: Prisma.StringFilter<"User"> | string;
    comprovanteUrl?: Prisma.StringNullableFilter<"User"> | string | null;
    dataNascimento?: Prisma.DateTimeFilter<"User"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
};
export type UserCreateWithoutCursoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao?: Prisma.InstituicaoCreateNestedOneWithoutUsuariosInput;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2CreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutCursoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    instituicaoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedCreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutCursoInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCursoInput, Prisma.UserUncheckedCreateWithoutCursoInput>;
};
export type UserCreateManyCursoInputEnvelope = {
    data: Prisma.UserCreateManyCursoInput | Prisma.UserCreateManyCursoInput[];
    skipDuplicates?: boolean;
};
export type UserUpsertWithWhereUniqueWithoutCursoInput = {
    where: Prisma.UserWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserUpdateWithoutCursoInput, Prisma.UserUncheckedUpdateWithoutCursoInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCursoInput, Prisma.UserUncheckedCreateWithoutCursoInput>;
};
export type UserUpdateWithWhereUniqueWithoutCursoInput = {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCursoInput, Prisma.UserUncheckedUpdateWithoutCursoInput>;
};
export type UserUpdateManyWithWhereWithoutCursoInput = {
    where: Prisma.UserScalarWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyWithoutCursoInput>;
};
export type UserCreateWithoutCoordenadoriasInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao?: Prisma.InstituicaoCreateNestedOneWithoutUsuariosInput;
    curso?: Prisma.CursoCreateNestedOneWithoutUsuariosInput;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2CreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutCoordenadoriasInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    instituicaoId?: string | null;
    cursoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedCreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutCoordenadoriasInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCoordenadoriasInput, Prisma.UserUncheckedCreateWithoutCoordenadoriasInput>;
};
export type UserUpsertWithoutCoordenadoriasInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCoordenadoriasInput, Prisma.UserUncheckedUpdateWithoutCoordenadoriasInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCoordenadoriasInput, Prisma.UserUncheckedCreateWithoutCoordenadoriasInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCoordenadoriasInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCoordenadoriasInput, Prisma.UserUncheckedUpdateWithoutCoordenadoriasInput>;
};
export type UserUpdateWithoutCoordenadoriasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneWithoutUsuariosNestedInput;
    curso?: Prisma.CursoUpdateOneWithoutUsuariosNestedInput;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutCoordenadoriasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicaoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cursoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedUpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutInscricaoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao?: Prisma.InstituicaoCreateNestedOneWithoutUsuariosInput;
    curso?: Prisma.CursoCreateNestedOneWithoutUsuariosInput;
    coordenadorias?: Prisma.CoordenadorCursoCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2CreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutInscricaoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    instituicaoId?: string | null;
    cursoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedCreateNestedManyWithoutAvaliadorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutInscricaoInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutInscricaoInput, Prisma.UserUncheckedCreateWithoutInscricaoInput>;
};
export type UserUpsertWithoutInscricaoInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutInscricaoInput, Prisma.UserUncheckedUpdateWithoutInscricaoInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutInscricaoInput, Prisma.UserUncheckedCreateWithoutInscricaoInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutInscricaoInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutInscricaoInput, Prisma.UserUncheckedUpdateWithoutInscricaoInput>;
};
export type UserUpdateWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneWithoutUsuariosNestedInput;
    curso?: Prisma.CursoUpdateOneWithoutUsuariosNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicaoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cursoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedUpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutAvaliacoesInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao?: Prisma.InstituicaoCreateNestedOneWithoutUsuariosInput;
    curso?: Prisma.CursoCreateNestedOneWithoutUsuariosInput;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutAvaliacoesInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    instituicaoId?: string | null;
    cursoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutAvaliacoesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAvaliacoesInput, Prisma.UserUncheckedCreateWithoutAvaliacoesInput>;
};
export type UserUpsertWithoutAvaliacoesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAvaliacoesInput, Prisma.UserUncheckedUpdateWithoutAvaliacoesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAvaliacoesInput, Prisma.UserUncheckedCreateWithoutAvaliacoesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAvaliacoesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAvaliacoesInput, Prisma.UserUncheckedUpdateWithoutAvaliacoesInput>;
};
export type UserUpdateWithoutAvaliacoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneWithoutUsuariosNestedInput;
    curso?: Prisma.CursoUpdateOneWithoutUsuariosNestedInput;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutAvaliacoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicaoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cursoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutAuditLogsInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    instituicao?: Prisma.InstituicaoCreateNestedOneWithoutUsuariosInput;
    curso?: Prisma.CursoCreateNestedOneWithoutUsuariosInput;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2CreateNestedManyWithoutAvaliadorInput;
};
export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    instituicaoId?: string | null;
    cursoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedCreateNestedManyWithoutUserInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedCreateNestedManyWithoutAvaliadorInput;
};
export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
};
export type UserUpsertWithoutAuditLogsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAuditLogsInput, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAuditLogsInput, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
};
export type UserUpdateWithoutAuditLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneWithoutUsuariosNestedInput;
    curso?: Prisma.CursoUpdateOneWithoutUsuariosNestedInput;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UpdateManyWithoutAvaliadorNestedInput;
};
export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicaoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cursoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedUpdateManyWithoutAvaliadorNestedInput;
};
export type UserCreateManyInstituicaoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    cursoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateWithoutInstituicaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    curso?: Prisma.CursoUpdateOneWithoutUsuariosNestedInput;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutInstituicaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    cursoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedUpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateManyWithoutInstituicaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    cursoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCreateManyCursoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senhaHash: string;
    role?: $Enums.Role;
    instituicaoId?: string | null;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateWithoutCursoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    instituicao?: Prisma.InstituicaoUpdateOneWithoutUsuariosNestedInput;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutCursoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicaoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    coordenadorias?: Prisma.CoordenadorCursoUncheckedUpdateManyWithoutUserNestedInput;
    avaliacoes?: Prisma.AvaliacaoFase2UncheckedUpdateManyWithoutAvaliadorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateManyWithoutCursoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicaoId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOutputType = {
    coordenadorias: number;
    avaliacoes: number;
    auditLogs: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    coordenadorias?: boolean | UserCountOutputTypeCountCoordenadoriasArgs;
    avaliacoes?: boolean | UserCountOutputTypeCountAvaliacoesArgs;
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountCoordenadoriasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CoordenadorCursoWhereInput;
};
export type UserCountOutputTypeCountAvaliacoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AvaliacaoFase2WhereInput;
};
export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuditLogWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    email?: boolean;
    cpf?: boolean;
    senhaHash?: boolean;
    role?: boolean;
    instituicaoId?: boolean;
    cursoId?: boolean;
    matricula?: boolean;
    comprovanteUrl?: boolean;
    dataNascimento?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    instituicao?: boolean | Prisma.User$instituicaoArgs<ExtArgs>;
    curso?: boolean | Prisma.User$cursoArgs<ExtArgs>;
    inscricao?: boolean | Prisma.User$inscricaoArgs<ExtArgs>;
    coordenadorias?: boolean | Prisma.User$coordenadoriasArgs<ExtArgs>;
    avaliacoes?: boolean | Prisma.User$avaliacoesArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.User$auditLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    email?: boolean;
    cpf?: boolean;
    senhaHash?: boolean;
    role?: boolean;
    instituicaoId?: boolean;
    cursoId?: boolean;
    matricula?: boolean;
    comprovanteUrl?: boolean;
    dataNascimento?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    instituicao?: boolean | Prisma.User$instituicaoArgs<ExtArgs>;
    curso?: boolean | Prisma.User$cursoArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    email?: boolean;
    cpf?: boolean;
    senhaHash?: boolean;
    role?: boolean;
    instituicaoId?: boolean;
    cursoId?: boolean;
    matricula?: boolean;
    comprovanteUrl?: boolean;
    dataNascimento?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    instituicao?: boolean | Prisma.User$instituicaoArgs<ExtArgs>;
    curso?: boolean | Prisma.User$cursoArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    nome?: boolean;
    email?: boolean;
    cpf?: boolean;
    senhaHash?: boolean;
    role?: boolean;
    instituicaoId?: boolean;
    cursoId?: boolean;
    matricula?: boolean;
    comprovanteUrl?: boolean;
    dataNascimento?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "nome" | "email" | "cpf" | "senhaHash" | "role" | "instituicaoId" | "cursoId" | "matricula" | "comprovanteUrl" | "dataNascimento" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    instituicao?: boolean | Prisma.User$instituicaoArgs<ExtArgs>;
    curso?: boolean | Prisma.User$cursoArgs<ExtArgs>;
    inscricao?: boolean | Prisma.User$inscricaoArgs<ExtArgs>;
    coordenadorias?: boolean | Prisma.User$coordenadoriasArgs<ExtArgs>;
    avaliacoes?: boolean | Prisma.User$avaliacoesArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.User$auditLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    instituicao?: boolean | Prisma.User$instituicaoArgs<ExtArgs>;
    curso?: boolean | Prisma.User$cursoArgs<ExtArgs>;
};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    instituicao?: boolean | Prisma.User$instituicaoArgs<ExtArgs>;
    curso?: boolean | Prisma.User$cursoArgs<ExtArgs>;
};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        instituicao: Prisma.$InstituicaoPayload<ExtArgs> | null;
        curso: Prisma.$CursoPayload<ExtArgs> | null;
        inscricao: Prisma.$InscricaoPayload<ExtArgs> | null;
        coordenadorias: Prisma.$CoordenadorCursoPayload<ExtArgs>[];
        avaliacoes: Prisma.$AvaliacaoFase2Payload<ExtArgs>[];
        auditLogs: Prisma.$AuditLogPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        nome: string;
        email: string;
        cpf: string;
        senhaHash: string;
        role: $Enums.Role;
        instituicaoId: string | null;
        cursoId: string | null;
        matricula: string;
        comprovanteUrl: string | null;
        dataNascimento: Date;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    instituicao<T extends Prisma.User$instituicaoArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$instituicaoArgs<ExtArgs>>): Prisma.Prisma__InstituicaoClient<runtime.Types.Result.GetResult<Prisma.$InstituicaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    curso<T extends Prisma.User$cursoArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$cursoArgs<ExtArgs>>): Prisma.Prisma__CursoClient<runtime.Types.Result.GetResult<Prisma.$CursoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    inscricao<T extends Prisma.User$inscricaoArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$inscricaoArgs<ExtArgs>>): Prisma.Prisma__InscricaoClient<runtime.Types.Result.GetResult<Prisma.$InscricaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    coordenadorias<T extends Prisma.User$coordenadoriasArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$coordenadoriasArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CoordenadorCursoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    avaliacoes<T extends Prisma.User$avaliacoesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$avaliacoesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AvaliacaoFase2Payload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    auditLogs<T extends Prisma.User$auditLogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly nome: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly cpf: Prisma.FieldRef<"User", 'String'>;
    readonly senhaHash: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'Role'>;
    readonly instituicaoId: Prisma.FieldRef<"User", 'String'>;
    readonly cursoId: Prisma.FieldRef<"User", 'String'>;
    readonly matricula: Prisma.FieldRef<"User", 'String'>;
    readonly comprovanteUrl: Prisma.FieldRef<"User", 'String'>;
    readonly dataNascimento: Prisma.FieldRef<"User", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
    include?: Prisma.UserIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$instituicaoArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InstituicaoSelect<ExtArgs> | null;
    omit?: Prisma.InstituicaoOmit<ExtArgs> | null;
    include?: Prisma.InstituicaoInclude<ExtArgs> | null;
    where?: Prisma.InstituicaoWhereInput;
};
export type User$cursoArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CursoSelect<ExtArgs> | null;
    omit?: Prisma.CursoOmit<ExtArgs> | null;
    include?: Prisma.CursoInclude<ExtArgs> | null;
    where?: Prisma.CursoWhereInput;
};
export type User$inscricaoArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InscricaoSelect<ExtArgs> | null;
    omit?: Prisma.InscricaoOmit<ExtArgs> | null;
    include?: Prisma.InscricaoInclude<ExtArgs> | null;
    where?: Prisma.InscricaoWhereInput;
};
export type User$coordenadoriasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$avaliacoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$auditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput | Prisma.AuditLogOrderByWithRelationInput[];
    cursor?: Prisma.AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuditLogScalarFieldEnum | Prisma.AuditLogScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};

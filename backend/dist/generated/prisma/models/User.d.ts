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
    senha: string | null;
    role: $Enums.Role | null;
    instituicao: string | null;
    curso: string | null;
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
    senha: string | null;
    role: $Enums.Role | null;
    instituicao: string | null;
    curso: string | null;
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
    senha: number;
    role: number;
    instituicao: number;
    curso: number;
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
    senha?: true;
    role?: true;
    instituicao?: true;
    curso?: true;
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
    senha?: true;
    role?: true;
    instituicao?: true;
    curso?: true;
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
    senha?: true;
    role?: true;
    instituicao?: true;
    curso?: true;
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
    senha: string;
    role: $Enums.Role;
    instituicao: string;
    curso: string;
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
    senha?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    instituicao?: Prisma.StringFilter<"User"> | string;
    curso?: Prisma.StringFilter<"User"> | string;
    matricula?: Prisma.StringFilter<"User"> | string;
    comprovanteUrl?: Prisma.StringNullableFilter<"User"> | string | null;
    dataNascimento?: Prisma.DateTimeFilter<"User"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    inscricao?: Prisma.XOR<Prisma.InscricaoNullableScalarRelationFilter, Prisma.InscricaoWhereInput> | null;
    submissoes?: Prisma.SubmissaoListRelationFilter;
    progressoCursos?: Prisma.ProgressoCursoListRelationFilter;
    certificados?: Prisma.CertificadoListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    senha?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicao?: Prisma.SortOrder;
    curso?: Prisma.SortOrder;
    matricula?: Prisma.SortOrder;
    comprovanteUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    dataNascimento?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    inscricao?: Prisma.InscricaoOrderByWithRelationInput;
    submissoes?: Prisma.SubmissaoOrderByRelationAggregateInput;
    progressoCursos?: Prisma.ProgressoCursoOrderByRelationAggregateInput;
    certificados?: Prisma.CertificadoOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    cpf?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    nome?: Prisma.StringFilter<"User"> | string;
    senha?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    instituicao?: Prisma.StringFilter<"User"> | string;
    curso?: Prisma.StringFilter<"User"> | string;
    matricula?: Prisma.StringFilter<"User"> | string;
    comprovanteUrl?: Prisma.StringNullableFilter<"User"> | string | null;
    dataNascimento?: Prisma.DateTimeFilter<"User"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    inscricao?: Prisma.XOR<Prisma.InscricaoNullableScalarRelationFilter, Prisma.InscricaoWhereInput> | null;
    submissoes?: Prisma.SubmissaoListRelationFilter;
    progressoCursos?: Prisma.ProgressoCursoListRelationFilter;
    certificados?: Prisma.CertificadoListRelationFilter;
}, "id" | "email" | "cpf">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    senha?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicao?: Prisma.SortOrder;
    curso?: Prisma.SortOrder;
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
    senha?: Prisma.StringWithAggregatesFilter<"User"> | string;
    role?: Prisma.EnumRoleWithAggregatesFilter<"User"> | $Enums.Role;
    instituicao?: Prisma.StringWithAggregatesFilter<"User"> | string;
    curso?: Prisma.StringWithAggregatesFilter<"User"> | string;
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
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    submissoes?: Prisma.SubmissaoCreateNestedManyWithoutUserInput;
    progressoCursos?: Prisma.ProgressoCursoCreateNestedManyWithoutUserInput;
    certificados?: Prisma.CertificadoCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    submissoes?: Prisma.SubmissaoUncheckedCreateNestedManyWithoutUserInput;
    progressoCursos?: Prisma.ProgressoCursoUncheckedCreateNestedManyWithoutUserInput;
    certificados?: Prisma.CertificadoUncheckedCreateNestedManyWithoutUserInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    submissoes?: Prisma.SubmissaoUpdateManyWithoutUserNestedInput;
    progressoCursos?: Prisma.ProgressoCursoUpdateManyWithoutUserNestedInput;
    certificados?: Prisma.CertificadoUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    submissoes?: Prisma.SubmissaoUncheckedUpdateManyWithoutUserNestedInput;
    progressoCursos?: Prisma.ProgressoCursoUncheckedUpdateManyWithoutUserNestedInput;
    certificados?: Prisma.CertificadoUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
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
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
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
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    senha?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicao?: Prisma.SortOrder;
    curso?: Prisma.SortOrder;
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
    senha?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicao?: Prisma.SortOrder;
    curso?: Prisma.SortOrder;
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
    senha?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    instituicao?: Prisma.SortOrder;
    curso?: Prisma.SortOrder;
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
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
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
export type UserCreateNestedOneWithoutProgressoCursosInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutProgressoCursosInput, Prisma.UserUncheckedCreateWithoutProgressoCursosInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutProgressoCursosInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutProgressoCursosNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutProgressoCursosInput, Prisma.UserUncheckedCreateWithoutProgressoCursosInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutProgressoCursosInput;
    upsert?: Prisma.UserUpsertWithoutProgressoCursosInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutProgressoCursosInput, Prisma.UserUpdateWithoutProgressoCursosInput>, Prisma.UserUncheckedUpdateWithoutProgressoCursosInput>;
};
export type UserCreateNestedOneWithoutCertificadosInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCertificadosInput, Prisma.UserUncheckedCreateWithoutCertificadosInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCertificadosInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutCertificadosNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCertificadosInput, Prisma.UserUncheckedCreateWithoutCertificadosInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCertificadosInput;
    upsert?: Prisma.UserUpsertWithoutCertificadosInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCertificadosInput, Prisma.UserUpdateWithoutCertificadosInput>, Prisma.UserUncheckedUpdateWithoutCertificadosInput>;
};
export type UserCreateNestedOneWithoutSubmissoesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSubmissoesInput, Prisma.UserUncheckedCreateWithoutSubmissoesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSubmissoesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSubmissoesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSubmissoesInput, Prisma.UserUncheckedCreateWithoutSubmissoesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSubmissoesInput;
    upsert?: Prisma.UserUpsertWithoutSubmissoesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSubmissoesInput, Prisma.UserUpdateWithoutSubmissoesInput>, Prisma.UserUncheckedUpdateWithoutSubmissoesInput>;
};
export type UserCreateWithoutInscricaoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    submissoes?: Prisma.SubmissaoCreateNestedManyWithoutUserInput;
    progressoCursos?: Prisma.ProgressoCursoCreateNestedManyWithoutUserInput;
    certificados?: Prisma.CertificadoCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutInscricaoInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    submissoes?: Prisma.SubmissaoUncheckedCreateNestedManyWithoutUserInput;
    progressoCursos?: Prisma.ProgressoCursoUncheckedCreateNestedManyWithoutUserInput;
    certificados?: Prisma.CertificadoUncheckedCreateNestedManyWithoutUserInput;
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
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    submissoes?: Prisma.SubmissaoUpdateManyWithoutUserNestedInput;
    progressoCursos?: Prisma.ProgressoCursoUpdateManyWithoutUserNestedInput;
    certificados?: Prisma.CertificadoUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutInscricaoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    submissoes?: Prisma.SubmissaoUncheckedUpdateManyWithoutUserNestedInput;
    progressoCursos?: Prisma.ProgressoCursoUncheckedUpdateManyWithoutUserNestedInput;
    certificados?: Prisma.CertificadoUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutProgressoCursosInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    submissoes?: Prisma.SubmissaoCreateNestedManyWithoutUserInput;
    certificados?: Prisma.CertificadoCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutProgressoCursosInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    submissoes?: Prisma.SubmissaoUncheckedCreateNestedManyWithoutUserInput;
    certificados?: Prisma.CertificadoUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutProgressoCursosInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutProgressoCursosInput, Prisma.UserUncheckedCreateWithoutProgressoCursosInput>;
};
export type UserUpsertWithoutProgressoCursosInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutProgressoCursosInput, Prisma.UserUncheckedUpdateWithoutProgressoCursosInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutProgressoCursosInput, Prisma.UserUncheckedCreateWithoutProgressoCursosInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutProgressoCursosInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutProgressoCursosInput, Prisma.UserUncheckedUpdateWithoutProgressoCursosInput>;
};
export type UserUpdateWithoutProgressoCursosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    submissoes?: Prisma.SubmissaoUpdateManyWithoutUserNestedInput;
    certificados?: Prisma.CertificadoUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutProgressoCursosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    submissoes?: Prisma.SubmissaoUncheckedUpdateManyWithoutUserNestedInput;
    certificados?: Prisma.CertificadoUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutCertificadosInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    submissoes?: Prisma.SubmissaoCreateNestedManyWithoutUserInput;
    progressoCursos?: Prisma.ProgressoCursoCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutCertificadosInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    submissoes?: Prisma.SubmissaoUncheckedCreateNestedManyWithoutUserInput;
    progressoCursos?: Prisma.ProgressoCursoUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutCertificadosInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCertificadosInput, Prisma.UserUncheckedCreateWithoutCertificadosInput>;
};
export type UserUpsertWithoutCertificadosInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCertificadosInput, Prisma.UserUncheckedUpdateWithoutCertificadosInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCertificadosInput, Prisma.UserUncheckedCreateWithoutCertificadosInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCertificadosInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCertificadosInput, Prisma.UserUncheckedUpdateWithoutCertificadosInput>;
};
export type UserUpdateWithoutCertificadosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    submissoes?: Prisma.SubmissaoUpdateManyWithoutUserNestedInput;
    progressoCursos?: Prisma.ProgressoCursoUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutCertificadosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    submissoes?: Prisma.SubmissaoUncheckedUpdateManyWithoutUserNestedInput;
    progressoCursos?: Prisma.ProgressoCursoUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutSubmissoesInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoCreateNestedOneWithoutUserInput;
    progressoCursos?: Prisma.ProgressoCursoCreateNestedManyWithoutUserInput;
    certificados?: Prisma.CertificadoCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSubmissoesInput = {
    id?: string;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    role?: $Enums.Role;
    instituicao: string;
    curso: string;
    matricula: string;
    comprovanteUrl?: string | null;
    dataNascimento: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inscricao?: Prisma.InscricaoUncheckedCreateNestedOneWithoutUserInput;
    progressoCursos?: Prisma.ProgressoCursoUncheckedCreateNestedManyWithoutUserInput;
    certificados?: Prisma.CertificadoUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSubmissoesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSubmissoesInput, Prisma.UserUncheckedCreateWithoutSubmissoesInput>;
};
export type UserUpsertWithoutSubmissoesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSubmissoesInput, Prisma.UserUncheckedUpdateWithoutSubmissoesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSubmissoesInput, Prisma.UserUncheckedCreateWithoutSubmissoesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSubmissoesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSubmissoesInput, Prisma.UserUncheckedUpdateWithoutSubmissoesInput>;
};
export type UserUpdateWithoutSubmissoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUpdateOneWithoutUserNestedInput;
    progressoCursos?: Prisma.ProgressoCursoUpdateManyWithoutUserNestedInput;
    certificados?: Prisma.CertificadoUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSubmissoesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    cpf?: Prisma.StringFieldUpdateOperationsInput | string;
    senha?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    instituicao?: Prisma.StringFieldUpdateOperationsInput | string;
    curso?: Prisma.StringFieldUpdateOperationsInput | string;
    matricula?: Prisma.StringFieldUpdateOperationsInput | string;
    comprovanteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataNascimento?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inscricao?: Prisma.InscricaoUncheckedUpdateOneWithoutUserNestedInput;
    progressoCursos?: Prisma.ProgressoCursoUncheckedUpdateManyWithoutUserNestedInput;
    certificados?: Prisma.CertificadoUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCountOutputType = {
    submissoes: number;
    progressoCursos: number;
    certificados: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    submissoes?: boolean | UserCountOutputTypeCountSubmissoesArgs;
    progressoCursos?: boolean | UserCountOutputTypeCountProgressoCursosArgs;
    certificados?: boolean | UserCountOutputTypeCountCertificadosArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountSubmissoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissaoWhereInput;
};
export type UserCountOutputTypeCountProgressoCursosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProgressoCursoWhereInput;
};
export type UserCountOutputTypeCountCertificadosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificadoWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    email?: boolean;
    cpf?: boolean;
    senha?: boolean;
    role?: boolean;
    instituicao?: boolean;
    curso?: boolean;
    matricula?: boolean;
    comprovanteUrl?: boolean;
    dataNascimento?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inscricao?: boolean | Prisma.User$inscricaoArgs<ExtArgs>;
    submissoes?: boolean | Prisma.User$submissoesArgs<ExtArgs>;
    progressoCursos?: boolean | Prisma.User$progressoCursosArgs<ExtArgs>;
    certificados?: boolean | Prisma.User$certificadosArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    email?: boolean;
    cpf?: boolean;
    senha?: boolean;
    role?: boolean;
    instituicao?: boolean;
    curso?: boolean;
    matricula?: boolean;
    comprovanteUrl?: boolean;
    dataNascimento?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nome?: boolean;
    email?: boolean;
    cpf?: boolean;
    senha?: boolean;
    role?: boolean;
    instituicao?: boolean;
    curso?: boolean;
    matricula?: boolean;
    comprovanteUrl?: boolean;
    dataNascimento?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    nome?: boolean;
    email?: boolean;
    cpf?: boolean;
    senha?: boolean;
    role?: boolean;
    instituicao?: boolean;
    curso?: boolean;
    matricula?: boolean;
    comprovanteUrl?: boolean;
    dataNascimento?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "nome" | "email" | "cpf" | "senha" | "role" | "instituicao" | "curso" | "matricula" | "comprovanteUrl" | "dataNascimento" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inscricao?: boolean | Prisma.User$inscricaoArgs<ExtArgs>;
    submissoes?: boolean | Prisma.User$submissoesArgs<ExtArgs>;
    progressoCursos?: boolean | Prisma.User$progressoCursosArgs<ExtArgs>;
    certificados?: boolean | Prisma.User$certificadosArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        inscricao: Prisma.$InscricaoPayload<ExtArgs> | null;
        submissoes: Prisma.$SubmissaoPayload<ExtArgs>[];
        progressoCursos: Prisma.$ProgressoCursoPayload<ExtArgs>[];
        certificados: Prisma.$CertificadoPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        nome: string;
        email: string;
        cpf: string;
        senha: string;
        role: $Enums.Role;
        instituicao: string;
        curso: string;
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
    inscricao<T extends Prisma.User$inscricaoArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$inscricaoArgs<ExtArgs>>): Prisma.Prisma__InscricaoClient<runtime.Types.Result.GetResult<Prisma.$InscricaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    submissoes<T extends Prisma.User$submissoesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$submissoesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    progressoCursos<T extends Prisma.User$progressoCursosArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$progressoCursosArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    certificados<T extends Prisma.User$certificadosArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$certificadosArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly nome: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly cpf: Prisma.FieldRef<"User", 'String'>;
    readonly senha: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'Role'>;
    readonly instituicao: Prisma.FieldRef<"User", 'String'>;
    readonly curso: Prisma.FieldRef<"User", 'String'>;
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
export type User$inscricaoArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InscricaoSelect<ExtArgs> | null;
    omit?: Prisma.InscricaoOmit<ExtArgs> | null;
    include?: Prisma.InscricaoInclude<ExtArgs> | null;
    where?: Prisma.InscricaoWhereInput;
};
export type User$submissoesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$progressoCursosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$certificadosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelect<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    include?: Prisma.CertificadoInclude<ExtArgs> | null;
    where?: Prisma.CertificadoWhereInput;
    orderBy?: Prisma.CertificadoOrderByWithRelationInput | Prisma.CertificadoOrderByWithRelationInput[];
    cursor?: Prisma.CertificadoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CertificadoScalarFieldEnum | Prisma.CertificadoScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};

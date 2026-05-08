import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CertificadoModel = runtime.Types.Result.DefaultSelection<Prisma.$CertificadoPayload>;
export type AggregateCertificado = {
    _count: CertificadoCountAggregateOutputType | null;
    _avg: CertificadoAvgAggregateOutputType | null;
    _sum: CertificadoSumAggregateOutputType | null;
    _min: CertificadoMinAggregateOutputType | null;
    _max: CertificadoMaxAggregateOutputType | null;
};
export type CertificadoAvgAggregateOutputType = {
    cargaHoraria: number | null;
};
export type CertificadoSumAggregateOutputType = {
    cargaHoraria: number | null;
};
export type CertificadoMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    cargaHoraria: number | null;
    emitidoEm: Date | null;
    codigo: string | null;
};
export type CertificadoMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    cargaHoraria: number | null;
    emitidoEm: Date | null;
    codigo: string | null;
};
export type CertificadoCountAggregateOutputType = {
    id: number;
    userId: number;
    cargaHoraria: number;
    emitidoEm: number;
    codigo: number;
    _all: number;
};
export type CertificadoAvgAggregateInputType = {
    cargaHoraria?: true;
};
export type CertificadoSumAggregateInputType = {
    cargaHoraria?: true;
};
export type CertificadoMinAggregateInputType = {
    id?: true;
    userId?: true;
    cargaHoraria?: true;
    emitidoEm?: true;
    codigo?: true;
};
export type CertificadoMaxAggregateInputType = {
    id?: true;
    userId?: true;
    cargaHoraria?: true;
    emitidoEm?: true;
    codigo?: true;
};
export type CertificadoCountAggregateInputType = {
    id?: true;
    userId?: true;
    cargaHoraria?: true;
    emitidoEm?: true;
    codigo?: true;
    _all?: true;
};
export type CertificadoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificadoWhereInput;
    orderBy?: Prisma.CertificadoOrderByWithRelationInput | Prisma.CertificadoOrderByWithRelationInput[];
    cursor?: Prisma.CertificadoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CertificadoCountAggregateInputType;
    _avg?: CertificadoAvgAggregateInputType;
    _sum?: CertificadoSumAggregateInputType;
    _min?: CertificadoMinAggregateInputType;
    _max?: CertificadoMaxAggregateInputType;
};
export type GetCertificadoAggregateType<T extends CertificadoAggregateArgs> = {
    [P in keyof T & keyof AggregateCertificado]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCertificado[P]> : Prisma.GetScalarType<T[P], AggregateCertificado[P]>;
};
export type CertificadoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificadoWhereInput;
    orderBy?: Prisma.CertificadoOrderByWithAggregationInput | Prisma.CertificadoOrderByWithAggregationInput[];
    by: Prisma.CertificadoScalarFieldEnum[] | Prisma.CertificadoScalarFieldEnum;
    having?: Prisma.CertificadoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CertificadoCountAggregateInputType | true;
    _avg?: CertificadoAvgAggregateInputType;
    _sum?: CertificadoSumAggregateInputType;
    _min?: CertificadoMinAggregateInputType;
    _max?: CertificadoMaxAggregateInputType;
};
export type CertificadoGroupByOutputType = {
    id: string;
    userId: string;
    cargaHoraria: number;
    emitidoEm: Date;
    codigo: string;
    _count: CertificadoCountAggregateOutputType | null;
    _avg: CertificadoAvgAggregateOutputType | null;
    _sum: CertificadoSumAggregateOutputType | null;
    _min: CertificadoMinAggregateOutputType | null;
    _max: CertificadoMaxAggregateOutputType | null;
};
export type GetCertificadoGroupByPayload<T extends CertificadoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CertificadoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CertificadoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CertificadoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CertificadoGroupByOutputType[P]>;
}>>;
export type CertificadoWhereInput = {
    AND?: Prisma.CertificadoWhereInput | Prisma.CertificadoWhereInput[];
    OR?: Prisma.CertificadoWhereInput[];
    NOT?: Prisma.CertificadoWhereInput | Prisma.CertificadoWhereInput[];
    id?: Prisma.StringFilter<"Certificado"> | string;
    userId?: Prisma.StringFilter<"Certificado"> | string;
    cargaHoraria?: Prisma.IntFilter<"Certificado"> | number;
    emitidoEm?: Prisma.DateTimeFilter<"Certificado"> | Date | string;
    codigo?: Prisma.StringFilter<"Certificado"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type CertificadoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
    emitidoEm?: Prisma.SortOrder;
    codigo?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type CertificadoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    codigo?: string;
    AND?: Prisma.CertificadoWhereInput | Prisma.CertificadoWhereInput[];
    OR?: Prisma.CertificadoWhereInput[];
    NOT?: Prisma.CertificadoWhereInput | Prisma.CertificadoWhereInput[];
    userId?: Prisma.StringFilter<"Certificado"> | string;
    cargaHoraria?: Prisma.IntFilter<"Certificado"> | number;
    emitidoEm?: Prisma.DateTimeFilter<"Certificado"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "codigo">;
export type CertificadoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
    emitidoEm?: Prisma.SortOrder;
    codigo?: Prisma.SortOrder;
    _count?: Prisma.CertificadoCountOrderByAggregateInput;
    _avg?: Prisma.CertificadoAvgOrderByAggregateInput;
    _max?: Prisma.CertificadoMaxOrderByAggregateInput;
    _min?: Prisma.CertificadoMinOrderByAggregateInput;
    _sum?: Prisma.CertificadoSumOrderByAggregateInput;
};
export type CertificadoScalarWhereWithAggregatesInput = {
    AND?: Prisma.CertificadoScalarWhereWithAggregatesInput | Prisma.CertificadoScalarWhereWithAggregatesInput[];
    OR?: Prisma.CertificadoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CertificadoScalarWhereWithAggregatesInput | Prisma.CertificadoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Certificado"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Certificado"> | string;
    cargaHoraria?: Prisma.IntWithAggregatesFilter<"Certificado"> | number;
    emitidoEm?: Prisma.DateTimeWithAggregatesFilter<"Certificado"> | Date | string;
    codigo?: Prisma.StringWithAggregatesFilter<"Certificado"> | string;
};
export type CertificadoCreateInput = {
    id?: string;
    cargaHoraria: number;
    emitidoEm?: Date | string;
    codigo: string;
    user: Prisma.UserCreateNestedOneWithoutCertificadosInput;
};
export type CertificadoUncheckedCreateInput = {
    id?: string;
    userId: string;
    cargaHoraria: number;
    emitidoEm?: Date | string;
    codigo: string;
};
export type CertificadoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    emitidoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    codigo?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneRequiredWithoutCertificadosNestedInput;
};
export type CertificadoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    emitidoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    codigo?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CertificadoCreateManyInput = {
    id?: string;
    userId: string;
    cargaHoraria: number;
    emitidoEm?: Date | string;
    codigo: string;
};
export type CertificadoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    emitidoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    codigo?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CertificadoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    emitidoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    codigo?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CertificadoListRelationFilter = {
    every?: Prisma.CertificadoWhereInput;
    some?: Prisma.CertificadoWhereInput;
    none?: Prisma.CertificadoWhereInput;
};
export type CertificadoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CertificadoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
    emitidoEm?: Prisma.SortOrder;
    codigo?: Prisma.SortOrder;
};
export type CertificadoAvgOrderByAggregateInput = {
    cargaHoraria?: Prisma.SortOrder;
};
export type CertificadoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
    emitidoEm?: Prisma.SortOrder;
    codigo?: Prisma.SortOrder;
};
export type CertificadoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
    emitidoEm?: Prisma.SortOrder;
    codigo?: Prisma.SortOrder;
};
export type CertificadoSumOrderByAggregateInput = {
    cargaHoraria?: Prisma.SortOrder;
};
export type CertificadoCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CertificadoCreateWithoutUserInput, Prisma.CertificadoUncheckedCreateWithoutUserInput> | Prisma.CertificadoCreateWithoutUserInput[] | Prisma.CertificadoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CertificadoCreateOrConnectWithoutUserInput | Prisma.CertificadoCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CertificadoCreateManyUserInputEnvelope;
    connect?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
};
export type CertificadoUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CertificadoCreateWithoutUserInput, Prisma.CertificadoUncheckedCreateWithoutUserInput> | Prisma.CertificadoCreateWithoutUserInput[] | Prisma.CertificadoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CertificadoCreateOrConnectWithoutUserInput | Prisma.CertificadoCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CertificadoCreateManyUserInputEnvelope;
    connect?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
};
export type CertificadoUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CertificadoCreateWithoutUserInput, Prisma.CertificadoUncheckedCreateWithoutUserInput> | Prisma.CertificadoCreateWithoutUserInput[] | Prisma.CertificadoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CertificadoCreateOrConnectWithoutUserInput | Prisma.CertificadoCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CertificadoUpsertWithWhereUniqueWithoutUserInput | Prisma.CertificadoUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CertificadoCreateManyUserInputEnvelope;
    set?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
    disconnect?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
    delete?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
    connect?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
    update?: Prisma.CertificadoUpdateWithWhereUniqueWithoutUserInput | Prisma.CertificadoUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CertificadoUpdateManyWithWhereWithoutUserInput | Prisma.CertificadoUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CertificadoScalarWhereInput | Prisma.CertificadoScalarWhereInput[];
};
export type CertificadoUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CertificadoCreateWithoutUserInput, Prisma.CertificadoUncheckedCreateWithoutUserInput> | Prisma.CertificadoCreateWithoutUserInput[] | Prisma.CertificadoUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CertificadoCreateOrConnectWithoutUserInput | Prisma.CertificadoCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CertificadoUpsertWithWhereUniqueWithoutUserInput | Prisma.CertificadoUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CertificadoCreateManyUserInputEnvelope;
    set?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
    disconnect?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
    delete?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
    connect?: Prisma.CertificadoWhereUniqueInput | Prisma.CertificadoWhereUniqueInput[];
    update?: Prisma.CertificadoUpdateWithWhereUniqueWithoutUserInput | Prisma.CertificadoUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CertificadoUpdateManyWithWhereWithoutUserInput | Prisma.CertificadoUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CertificadoScalarWhereInput | Prisma.CertificadoScalarWhereInput[];
};
export type CertificadoCreateWithoutUserInput = {
    id?: string;
    cargaHoraria: number;
    emitidoEm?: Date | string;
    codigo: string;
};
export type CertificadoUncheckedCreateWithoutUserInput = {
    id?: string;
    cargaHoraria: number;
    emitidoEm?: Date | string;
    codigo: string;
};
export type CertificadoCreateOrConnectWithoutUserInput = {
    where: Prisma.CertificadoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CertificadoCreateWithoutUserInput, Prisma.CertificadoUncheckedCreateWithoutUserInput>;
};
export type CertificadoCreateManyUserInputEnvelope = {
    data: Prisma.CertificadoCreateManyUserInput | Prisma.CertificadoCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type CertificadoUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.CertificadoWhereUniqueInput;
    update: Prisma.XOR<Prisma.CertificadoUpdateWithoutUserInput, Prisma.CertificadoUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.CertificadoCreateWithoutUserInput, Prisma.CertificadoUncheckedCreateWithoutUserInput>;
};
export type CertificadoUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.CertificadoWhereUniqueInput;
    data: Prisma.XOR<Prisma.CertificadoUpdateWithoutUserInput, Prisma.CertificadoUncheckedUpdateWithoutUserInput>;
};
export type CertificadoUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.CertificadoScalarWhereInput;
    data: Prisma.XOR<Prisma.CertificadoUpdateManyMutationInput, Prisma.CertificadoUncheckedUpdateManyWithoutUserInput>;
};
export type CertificadoScalarWhereInput = {
    AND?: Prisma.CertificadoScalarWhereInput | Prisma.CertificadoScalarWhereInput[];
    OR?: Prisma.CertificadoScalarWhereInput[];
    NOT?: Prisma.CertificadoScalarWhereInput | Prisma.CertificadoScalarWhereInput[];
    id?: Prisma.StringFilter<"Certificado"> | string;
    userId?: Prisma.StringFilter<"Certificado"> | string;
    cargaHoraria?: Prisma.IntFilter<"Certificado"> | number;
    emitidoEm?: Prisma.DateTimeFilter<"Certificado"> | Date | string;
    codigo?: Prisma.StringFilter<"Certificado"> | string;
};
export type CertificadoCreateManyUserInput = {
    id?: string;
    cargaHoraria: number;
    emitidoEm?: Date | string;
    codigo: string;
};
export type CertificadoUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    emitidoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    codigo?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CertificadoUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    emitidoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    codigo?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CertificadoUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    emitidoEm?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    codigo?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CertificadoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    cargaHoraria?: boolean;
    emitidoEm?: boolean;
    codigo?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["certificado"]>;
export type CertificadoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    cargaHoraria?: boolean;
    emitidoEm?: boolean;
    codigo?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["certificado"]>;
export type CertificadoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    cargaHoraria?: boolean;
    emitidoEm?: boolean;
    codigo?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["certificado"]>;
export type CertificadoSelectScalar = {
    id?: boolean;
    userId?: boolean;
    cargaHoraria?: boolean;
    emitidoEm?: boolean;
    codigo?: boolean;
};
export type CertificadoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "cargaHoraria" | "emitidoEm" | "codigo", ExtArgs["result"]["certificado"]>;
export type CertificadoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type CertificadoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type CertificadoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $CertificadoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Certificado";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        cargaHoraria: number;
        emitidoEm: Date;
        codigo: string;
    }, ExtArgs["result"]["certificado"]>;
    composites: {};
};
export type CertificadoGetPayload<S extends boolean | null | undefined | CertificadoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CertificadoPayload, S>;
export type CertificadoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CertificadoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CertificadoCountAggregateInputType | true;
};
export interface CertificadoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Certificado'];
        meta: {
            name: 'Certificado';
        };
    };
    findUnique<T extends CertificadoFindUniqueArgs>(args: Prisma.SelectSubset<T, CertificadoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CertificadoClient<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CertificadoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CertificadoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CertificadoClient<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CertificadoFindFirstArgs>(args?: Prisma.SelectSubset<T, CertificadoFindFirstArgs<ExtArgs>>): Prisma.Prisma__CertificadoClient<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CertificadoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CertificadoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CertificadoClient<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CertificadoFindManyArgs>(args?: Prisma.SelectSubset<T, CertificadoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CertificadoCreateArgs>(args: Prisma.SelectSubset<T, CertificadoCreateArgs<ExtArgs>>): Prisma.Prisma__CertificadoClient<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CertificadoCreateManyArgs>(args?: Prisma.SelectSubset<T, CertificadoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CertificadoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CertificadoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CertificadoDeleteArgs>(args: Prisma.SelectSubset<T, CertificadoDeleteArgs<ExtArgs>>): Prisma.Prisma__CertificadoClient<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CertificadoUpdateArgs>(args: Prisma.SelectSubset<T, CertificadoUpdateArgs<ExtArgs>>): Prisma.Prisma__CertificadoClient<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CertificadoDeleteManyArgs>(args?: Prisma.SelectSubset<T, CertificadoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CertificadoUpdateManyArgs>(args: Prisma.SelectSubset<T, CertificadoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CertificadoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CertificadoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CertificadoUpsertArgs>(args: Prisma.SelectSubset<T, CertificadoUpsertArgs<ExtArgs>>): Prisma.Prisma__CertificadoClient<runtime.Types.Result.GetResult<Prisma.$CertificadoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CertificadoCountArgs>(args?: Prisma.Subset<T, CertificadoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CertificadoCountAggregateOutputType> : number>;
    aggregate<T extends CertificadoAggregateArgs>(args: Prisma.Subset<T, CertificadoAggregateArgs>): Prisma.PrismaPromise<GetCertificadoAggregateType<T>>;
    groupBy<T extends CertificadoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CertificadoGroupByArgs['orderBy'];
    } : {
        orderBy?: CertificadoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CertificadoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCertificadoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CertificadoFieldRefs;
}
export interface Prisma__CertificadoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CertificadoFieldRefs {
    readonly id: Prisma.FieldRef<"Certificado", 'String'>;
    readonly userId: Prisma.FieldRef<"Certificado", 'String'>;
    readonly cargaHoraria: Prisma.FieldRef<"Certificado", 'Int'>;
    readonly emitidoEm: Prisma.FieldRef<"Certificado", 'DateTime'>;
    readonly codigo: Prisma.FieldRef<"Certificado", 'String'>;
}
export type CertificadoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelect<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    include?: Prisma.CertificadoInclude<ExtArgs> | null;
    where: Prisma.CertificadoWhereUniqueInput;
};
export type CertificadoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelect<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    include?: Prisma.CertificadoInclude<ExtArgs> | null;
    where: Prisma.CertificadoWhereUniqueInput;
};
export type CertificadoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CertificadoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CertificadoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CertificadoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelect<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    include?: Prisma.CertificadoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CertificadoCreateInput, Prisma.CertificadoUncheckedCreateInput>;
};
export type CertificadoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CertificadoCreateManyInput | Prisma.CertificadoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CertificadoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    data: Prisma.CertificadoCreateManyInput | Prisma.CertificadoCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CertificadoIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CertificadoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelect<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    include?: Prisma.CertificadoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CertificadoUpdateInput, Prisma.CertificadoUncheckedUpdateInput>;
    where: Prisma.CertificadoWhereUniqueInput;
};
export type CertificadoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CertificadoUpdateManyMutationInput, Prisma.CertificadoUncheckedUpdateManyInput>;
    where?: Prisma.CertificadoWhereInput;
    limit?: number;
};
export type CertificadoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CertificadoUpdateManyMutationInput, Prisma.CertificadoUncheckedUpdateManyInput>;
    where?: Prisma.CertificadoWhereInput;
    limit?: number;
    include?: Prisma.CertificadoIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CertificadoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelect<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    include?: Prisma.CertificadoInclude<ExtArgs> | null;
    where: Prisma.CertificadoWhereUniqueInput;
    create: Prisma.XOR<Prisma.CertificadoCreateInput, Prisma.CertificadoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CertificadoUpdateInput, Prisma.CertificadoUncheckedUpdateInput>;
};
export type CertificadoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelect<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    include?: Prisma.CertificadoInclude<ExtArgs> | null;
    where: Prisma.CertificadoWhereUniqueInput;
};
export type CertificadoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificadoWhereInput;
    limit?: number;
};
export type CertificadoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificadoSelect<ExtArgs> | null;
    omit?: Prisma.CertificadoOmit<ExtArgs> | null;
    include?: Prisma.CertificadoInclude<ExtArgs> | null;
};

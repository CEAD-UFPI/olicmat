import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ModuloModel = runtime.Types.Result.DefaultSelection<Prisma.$ModuloPayload>;
export type AggregateModulo = {
    _count: ModuloCountAggregateOutputType | null;
    _avg: ModuloAvgAggregateOutputType | null;
    _sum: ModuloSumAggregateOutputType | null;
    _min: ModuloMinAggregateOutputType | null;
    _max: ModuloMaxAggregateOutputType | null;
};
export type ModuloAvgAggregateOutputType = {
    ordem: number | null;
    cargaHoraria: number | null;
};
export type ModuloSumAggregateOutputType = {
    ordem: number | null;
    cargaHoraria: number | null;
};
export type ModuloMinAggregateOutputType = {
    id: string | null;
    titulo: string | null;
    descricao: string | null;
    ordem: number | null;
    cargaHoraria: number | null;
};
export type ModuloMaxAggregateOutputType = {
    id: string | null;
    titulo: string | null;
    descricao: string | null;
    ordem: number | null;
    cargaHoraria: number | null;
};
export type ModuloCountAggregateOutputType = {
    id: number;
    titulo: number;
    descricao: number;
    ordem: number;
    cargaHoraria: number;
    conteudos: number;
    questionario: number;
    _all: number;
};
export type ModuloAvgAggregateInputType = {
    ordem?: true;
    cargaHoraria?: true;
};
export type ModuloSumAggregateInputType = {
    ordem?: true;
    cargaHoraria?: true;
};
export type ModuloMinAggregateInputType = {
    id?: true;
    titulo?: true;
    descricao?: true;
    ordem?: true;
    cargaHoraria?: true;
};
export type ModuloMaxAggregateInputType = {
    id?: true;
    titulo?: true;
    descricao?: true;
    ordem?: true;
    cargaHoraria?: true;
};
export type ModuloCountAggregateInputType = {
    id?: true;
    titulo?: true;
    descricao?: true;
    ordem?: true;
    cargaHoraria?: true;
    conteudos?: true;
    questionario?: true;
    _all?: true;
};
export type ModuloAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModuloWhereInput;
    orderBy?: Prisma.ModuloOrderByWithRelationInput | Prisma.ModuloOrderByWithRelationInput[];
    cursor?: Prisma.ModuloWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ModuloCountAggregateInputType;
    _avg?: ModuloAvgAggregateInputType;
    _sum?: ModuloSumAggregateInputType;
    _min?: ModuloMinAggregateInputType;
    _max?: ModuloMaxAggregateInputType;
};
export type GetModuloAggregateType<T extends ModuloAggregateArgs> = {
    [P in keyof T & keyof AggregateModulo]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateModulo[P]> : Prisma.GetScalarType<T[P], AggregateModulo[P]>;
};
export type ModuloGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModuloWhereInput;
    orderBy?: Prisma.ModuloOrderByWithAggregationInput | Prisma.ModuloOrderByWithAggregationInput[];
    by: Prisma.ModuloScalarFieldEnum[] | Prisma.ModuloScalarFieldEnum;
    having?: Prisma.ModuloScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ModuloCountAggregateInputType | true;
    _avg?: ModuloAvgAggregateInputType;
    _sum?: ModuloSumAggregateInputType;
    _min?: ModuloMinAggregateInputType;
    _max?: ModuloMaxAggregateInputType;
};
export type ModuloGroupByOutputType = {
    id: string;
    titulo: string;
    descricao: string;
    ordem: number;
    cargaHoraria: number;
    conteudos: runtime.JsonValue;
    questionario: runtime.JsonValue | null;
    _count: ModuloCountAggregateOutputType | null;
    _avg: ModuloAvgAggregateOutputType | null;
    _sum: ModuloSumAggregateOutputType | null;
    _min: ModuloMinAggregateOutputType | null;
    _max: ModuloMaxAggregateOutputType | null;
};
export type GetModuloGroupByPayload<T extends ModuloGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ModuloGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ModuloGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ModuloGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ModuloGroupByOutputType[P]>;
}>>;
export type ModuloWhereInput = {
    AND?: Prisma.ModuloWhereInput | Prisma.ModuloWhereInput[];
    OR?: Prisma.ModuloWhereInput[];
    NOT?: Prisma.ModuloWhereInput | Prisma.ModuloWhereInput[];
    id?: Prisma.StringFilter<"Modulo"> | string;
    titulo?: Prisma.StringFilter<"Modulo"> | string;
    descricao?: Prisma.StringFilter<"Modulo"> | string;
    ordem?: Prisma.IntFilter<"Modulo"> | number;
    cargaHoraria?: Prisma.IntFilter<"Modulo"> | number;
    conteudos?: Prisma.JsonFilter<"Modulo">;
    questionario?: Prisma.JsonNullableFilter<"Modulo">;
    progressos?: Prisma.ProgressoCursoListRelationFilter;
};
export type ModuloOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
    conteudos?: Prisma.SortOrder;
    questionario?: Prisma.SortOrderInput | Prisma.SortOrder;
    progressos?: Prisma.ProgressoCursoOrderByRelationAggregateInput;
};
export type ModuloWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    ordem?: number;
    AND?: Prisma.ModuloWhereInput | Prisma.ModuloWhereInput[];
    OR?: Prisma.ModuloWhereInput[];
    NOT?: Prisma.ModuloWhereInput | Prisma.ModuloWhereInput[];
    titulo?: Prisma.StringFilter<"Modulo"> | string;
    descricao?: Prisma.StringFilter<"Modulo"> | string;
    cargaHoraria?: Prisma.IntFilter<"Modulo"> | number;
    conteudos?: Prisma.JsonFilter<"Modulo">;
    questionario?: Prisma.JsonNullableFilter<"Modulo">;
    progressos?: Prisma.ProgressoCursoListRelationFilter;
}, "id" | "ordem">;
export type ModuloOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
    conteudos?: Prisma.SortOrder;
    questionario?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ModuloCountOrderByAggregateInput;
    _avg?: Prisma.ModuloAvgOrderByAggregateInput;
    _max?: Prisma.ModuloMaxOrderByAggregateInput;
    _min?: Prisma.ModuloMinOrderByAggregateInput;
    _sum?: Prisma.ModuloSumOrderByAggregateInput;
};
export type ModuloScalarWhereWithAggregatesInput = {
    AND?: Prisma.ModuloScalarWhereWithAggregatesInput | Prisma.ModuloScalarWhereWithAggregatesInput[];
    OR?: Prisma.ModuloScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ModuloScalarWhereWithAggregatesInput | Prisma.ModuloScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Modulo"> | string;
    titulo?: Prisma.StringWithAggregatesFilter<"Modulo"> | string;
    descricao?: Prisma.StringWithAggregatesFilter<"Modulo"> | string;
    ordem?: Prisma.IntWithAggregatesFilter<"Modulo"> | number;
    cargaHoraria?: Prisma.IntWithAggregatesFilter<"Modulo"> | number;
    conteudos?: Prisma.JsonWithAggregatesFilter<"Modulo">;
    questionario?: Prisma.JsonNullableWithAggregatesFilter<"Modulo">;
};
export type ModuloCreateInput = {
    id?: string;
    titulo: string;
    descricao: string;
    ordem: number;
    cargaHoraria: number;
    conteudos: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    progressos?: Prisma.ProgressoCursoCreateNestedManyWithoutModuloInput;
};
export type ModuloUncheckedCreateInput = {
    id?: string;
    titulo: string;
    descricao: string;
    ordem: number;
    cargaHoraria: number;
    conteudos: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    progressos?: Prisma.ProgressoCursoUncheckedCreateNestedManyWithoutModuloInput;
};
export type ModuloUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    descricao?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    conteudos?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    progressos?: Prisma.ProgressoCursoUpdateManyWithoutModuloNestedInput;
};
export type ModuloUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    descricao?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    conteudos?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    progressos?: Prisma.ProgressoCursoUncheckedUpdateManyWithoutModuloNestedInput;
};
export type ModuloCreateManyInput = {
    id?: string;
    titulo: string;
    descricao: string;
    ordem: number;
    cargaHoraria: number;
    conteudos: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type ModuloUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    descricao?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    conteudos?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type ModuloUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    descricao?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    conteudos?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type ModuloCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
    conteudos?: Prisma.SortOrder;
    questionario?: Prisma.SortOrder;
};
export type ModuloAvgOrderByAggregateInput = {
    ordem?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
};
export type ModuloMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
};
export type ModuloMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    titulo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrder;
    ordem?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
};
export type ModuloSumOrderByAggregateInput = {
    ordem?: Prisma.SortOrder;
    cargaHoraria?: Prisma.SortOrder;
};
export type ModuloScalarRelationFilter = {
    is?: Prisma.ModuloWhereInput;
    isNot?: Prisma.ModuloWhereInput;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type ModuloCreateNestedOneWithoutProgressosInput = {
    create?: Prisma.XOR<Prisma.ModuloCreateWithoutProgressosInput, Prisma.ModuloUncheckedCreateWithoutProgressosInput>;
    connectOrCreate?: Prisma.ModuloCreateOrConnectWithoutProgressosInput;
    connect?: Prisma.ModuloWhereUniqueInput;
};
export type ModuloUpdateOneRequiredWithoutProgressosNestedInput = {
    create?: Prisma.XOR<Prisma.ModuloCreateWithoutProgressosInput, Prisma.ModuloUncheckedCreateWithoutProgressosInput>;
    connectOrCreate?: Prisma.ModuloCreateOrConnectWithoutProgressosInput;
    upsert?: Prisma.ModuloUpsertWithoutProgressosInput;
    connect?: Prisma.ModuloWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ModuloUpdateToOneWithWhereWithoutProgressosInput, Prisma.ModuloUpdateWithoutProgressosInput>, Prisma.ModuloUncheckedUpdateWithoutProgressosInput>;
};
export type ModuloCreateWithoutProgressosInput = {
    id?: string;
    titulo: string;
    descricao: string;
    ordem: number;
    cargaHoraria: number;
    conteudos: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type ModuloUncheckedCreateWithoutProgressosInput = {
    id?: string;
    titulo: string;
    descricao: string;
    ordem: number;
    cargaHoraria: number;
    conteudos: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type ModuloCreateOrConnectWithoutProgressosInput = {
    where: Prisma.ModuloWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModuloCreateWithoutProgressosInput, Prisma.ModuloUncheckedCreateWithoutProgressosInput>;
};
export type ModuloUpsertWithoutProgressosInput = {
    update: Prisma.XOR<Prisma.ModuloUpdateWithoutProgressosInput, Prisma.ModuloUncheckedUpdateWithoutProgressosInput>;
    create: Prisma.XOR<Prisma.ModuloCreateWithoutProgressosInput, Prisma.ModuloUncheckedCreateWithoutProgressosInput>;
    where?: Prisma.ModuloWhereInput;
};
export type ModuloUpdateToOneWithWhereWithoutProgressosInput = {
    where?: Prisma.ModuloWhereInput;
    data: Prisma.XOR<Prisma.ModuloUpdateWithoutProgressosInput, Prisma.ModuloUncheckedUpdateWithoutProgressosInput>;
};
export type ModuloUpdateWithoutProgressosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    descricao?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    conteudos?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type ModuloUncheckedUpdateWithoutProgressosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    titulo?: Prisma.StringFieldUpdateOperationsInput | string;
    descricao?: Prisma.StringFieldUpdateOperationsInput | string;
    ordem?: Prisma.IntFieldUpdateOperationsInput | number;
    cargaHoraria?: Prisma.IntFieldUpdateOperationsInput | number;
    conteudos?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    questionario?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type ModuloCountOutputType = {
    progressos: number;
};
export type ModuloCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    progressos?: boolean | ModuloCountOutputTypeCountProgressosArgs;
};
export type ModuloCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloCountOutputTypeSelect<ExtArgs> | null;
};
export type ModuloCountOutputTypeCountProgressosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProgressoCursoWhereInput;
};
export type ModuloSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    titulo?: boolean;
    descricao?: boolean;
    ordem?: boolean;
    cargaHoraria?: boolean;
    conteudos?: boolean;
    questionario?: boolean;
    progressos?: boolean | Prisma.Modulo$progressosArgs<ExtArgs>;
    _count?: boolean | Prisma.ModuloCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["modulo"]>;
export type ModuloSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    titulo?: boolean;
    descricao?: boolean;
    ordem?: boolean;
    cargaHoraria?: boolean;
    conteudos?: boolean;
    questionario?: boolean;
}, ExtArgs["result"]["modulo"]>;
export type ModuloSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    titulo?: boolean;
    descricao?: boolean;
    ordem?: boolean;
    cargaHoraria?: boolean;
    conteudos?: boolean;
    questionario?: boolean;
}, ExtArgs["result"]["modulo"]>;
export type ModuloSelectScalar = {
    id?: boolean;
    titulo?: boolean;
    descricao?: boolean;
    ordem?: boolean;
    cargaHoraria?: boolean;
    conteudos?: boolean;
    questionario?: boolean;
};
export type ModuloOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "titulo" | "descricao" | "ordem" | "cargaHoraria" | "conteudos" | "questionario", ExtArgs["result"]["modulo"]>;
export type ModuloInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    progressos?: boolean | Prisma.Modulo$progressosArgs<ExtArgs>;
    _count?: boolean | Prisma.ModuloCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ModuloIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ModuloIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ModuloPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Modulo";
    objects: {
        progressos: Prisma.$ProgressoCursoPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        titulo: string;
        descricao: string;
        ordem: number;
        cargaHoraria: number;
        conteudos: runtime.JsonValue;
        questionario: runtime.JsonValue | null;
    }, ExtArgs["result"]["modulo"]>;
    composites: {};
};
export type ModuloGetPayload<S extends boolean | null | undefined | ModuloDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ModuloPayload, S>;
export type ModuloCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ModuloFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ModuloCountAggregateInputType | true;
};
export interface ModuloDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Modulo'];
        meta: {
            name: 'Modulo';
        };
    };
    findUnique<T extends ModuloFindUniqueArgs>(args: Prisma.SelectSubset<T, ModuloFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ModuloClient<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ModuloFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ModuloFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModuloClient<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ModuloFindFirstArgs>(args?: Prisma.SelectSubset<T, ModuloFindFirstArgs<ExtArgs>>): Prisma.Prisma__ModuloClient<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ModuloFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ModuloFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModuloClient<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ModuloFindManyArgs>(args?: Prisma.SelectSubset<T, ModuloFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ModuloCreateArgs>(args: Prisma.SelectSubset<T, ModuloCreateArgs<ExtArgs>>): Prisma.Prisma__ModuloClient<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ModuloCreateManyArgs>(args?: Prisma.SelectSubset<T, ModuloCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ModuloCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ModuloCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ModuloDeleteArgs>(args: Prisma.SelectSubset<T, ModuloDeleteArgs<ExtArgs>>): Prisma.Prisma__ModuloClient<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ModuloUpdateArgs>(args: Prisma.SelectSubset<T, ModuloUpdateArgs<ExtArgs>>): Prisma.Prisma__ModuloClient<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ModuloDeleteManyArgs>(args?: Prisma.SelectSubset<T, ModuloDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ModuloUpdateManyArgs>(args: Prisma.SelectSubset<T, ModuloUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ModuloUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ModuloUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ModuloUpsertArgs>(args: Prisma.SelectSubset<T, ModuloUpsertArgs<ExtArgs>>): Prisma.Prisma__ModuloClient<runtime.Types.Result.GetResult<Prisma.$ModuloPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ModuloCountArgs>(args?: Prisma.Subset<T, ModuloCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ModuloCountAggregateOutputType> : number>;
    aggregate<T extends ModuloAggregateArgs>(args: Prisma.Subset<T, ModuloAggregateArgs>): Prisma.PrismaPromise<GetModuloAggregateType<T>>;
    groupBy<T extends ModuloGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ModuloGroupByArgs['orderBy'];
    } : {
        orderBy?: ModuloGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ModuloGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModuloGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ModuloFieldRefs;
}
export interface Prisma__ModuloClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    progressos<T extends Prisma.Modulo$progressosArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Modulo$progressosArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProgressoCursoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ModuloFieldRefs {
    readonly id: Prisma.FieldRef<"Modulo", 'String'>;
    readonly titulo: Prisma.FieldRef<"Modulo", 'String'>;
    readonly descricao: Prisma.FieldRef<"Modulo", 'String'>;
    readonly ordem: Prisma.FieldRef<"Modulo", 'Int'>;
    readonly cargaHoraria: Prisma.FieldRef<"Modulo", 'Int'>;
    readonly conteudos: Prisma.FieldRef<"Modulo", 'Json'>;
    readonly questionario: Prisma.FieldRef<"Modulo", 'Json'>;
}
export type ModuloFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
    where: Prisma.ModuloWhereUniqueInput;
};
export type ModuloFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
    where: Prisma.ModuloWhereUniqueInput;
};
export type ModuloFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
    where?: Prisma.ModuloWhereInput;
    orderBy?: Prisma.ModuloOrderByWithRelationInput | Prisma.ModuloOrderByWithRelationInput[];
    cursor?: Prisma.ModuloWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModuloScalarFieldEnum | Prisma.ModuloScalarFieldEnum[];
};
export type ModuloFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
    where?: Prisma.ModuloWhereInput;
    orderBy?: Prisma.ModuloOrderByWithRelationInput | Prisma.ModuloOrderByWithRelationInput[];
    cursor?: Prisma.ModuloWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModuloScalarFieldEnum | Prisma.ModuloScalarFieldEnum[];
};
export type ModuloFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
    where?: Prisma.ModuloWhereInput;
    orderBy?: Prisma.ModuloOrderByWithRelationInput | Prisma.ModuloOrderByWithRelationInput[];
    cursor?: Prisma.ModuloWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModuloScalarFieldEnum | Prisma.ModuloScalarFieldEnum[];
};
export type ModuloCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModuloCreateInput, Prisma.ModuloUncheckedCreateInput>;
};
export type ModuloCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ModuloCreateManyInput | Prisma.ModuloCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ModuloCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    data: Prisma.ModuloCreateManyInput | Prisma.ModuloCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ModuloUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModuloUpdateInput, Prisma.ModuloUncheckedUpdateInput>;
    where: Prisma.ModuloWhereUniqueInput;
};
export type ModuloUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ModuloUpdateManyMutationInput, Prisma.ModuloUncheckedUpdateManyInput>;
    where?: Prisma.ModuloWhereInput;
    limit?: number;
};
export type ModuloUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModuloUpdateManyMutationInput, Prisma.ModuloUncheckedUpdateManyInput>;
    where?: Prisma.ModuloWhereInput;
    limit?: number;
};
export type ModuloUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
    where: Prisma.ModuloWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModuloCreateInput, Prisma.ModuloUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ModuloUpdateInput, Prisma.ModuloUncheckedUpdateInput>;
};
export type ModuloDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
    where: Prisma.ModuloWhereUniqueInput;
};
export type ModuloDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModuloWhereInput;
    limit?: number;
};
export type Modulo$progressosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ModuloDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuloSelect<ExtArgs> | null;
    omit?: Prisma.ModuloOmit<ExtArgs> | null;
    include?: Prisma.ModuloInclude<ExtArgs> | null;
};

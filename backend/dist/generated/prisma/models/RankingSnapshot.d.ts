import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RankingSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$RankingSnapshotPayload>;
export type AggregateRankingSnapshot = {
    _count: RankingSnapshotCountAggregateOutputType | null;
    _min: RankingSnapshotMinAggregateOutputType | null;
    _max: RankingSnapshotMaxAggregateOutputType | null;
};
export type RankingSnapshotMinAggregateOutputType = {
    id: string | null;
    edicaoId: string | null;
    estado: string | null;
    publicadoEm: Date | null;
    createdAt: Date | null;
};
export type RankingSnapshotMaxAggregateOutputType = {
    id: string | null;
    edicaoId: string | null;
    estado: string | null;
    publicadoEm: Date | null;
    createdAt: Date | null;
};
export type RankingSnapshotCountAggregateOutputType = {
    id: number;
    edicaoId: number;
    estado: number;
    dados: number;
    publicadoEm: number;
    createdAt: number;
    _all: number;
};
export type RankingSnapshotMinAggregateInputType = {
    id?: true;
    edicaoId?: true;
    estado?: true;
    publicadoEm?: true;
    createdAt?: true;
};
export type RankingSnapshotMaxAggregateInputType = {
    id?: true;
    edicaoId?: true;
    estado?: true;
    publicadoEm?: true;
    createdAt?: true;
};
export type RankingSnapshotCountAggregateInputType = {
    id?: true;
    edicaoId?: true;
    estado?: true;
    dados?: true;
    publicadoEm?: true;
    createdAt?: true;
    _all?: true;
};
export type RankingSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RankingSnapshotWhereInput;
    orderBy?: Prisma.RankingSnapshotOrderByWithRelationInput | Prisma.RankingSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.RankingSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RankingSnapshotCountAggregateInputType;
    _min?: RankingSnapshotMinAggregateInputType;
    _max?: RankingSnapshotMaxAggregateInputType;
};
export type GetRankingSnapshotAggregateType<T extends RankingSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateRankingSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRankingSnapshot[P]> : Prisma.GetScalarType<T[P], AggregateRankingSnapshot[P]>;
};
export type RankingSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RankingSnapshotWhereInput;
    orderBy?: Prisma.RankingSnapshotOrderByWithAggregationInput | Prisma.RankingSnapshotOrderByWithAggregationInput[];
    by: Prisma.RankingSnapshotScalarFieldEnum[] | Prisma.RankingSnapshotScalarFieldEnum;
    having?: Prisma.RankingSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RankingSnapshotCountAggregateInputType | true;
    _min?: RankingSnapshotMinAggregateInputType;
    _max?: RankingSnapshotMaxAggregateInputType;
};
export type RankingSnapshotGroupByOutputType = {
    id: string;
    edicaoId: string;
    estado: string | null;
    dados: runtime.JsonValue;
    publicadoEm: Date | null;
    createdAt: Date;
    _count: RankingSnapshotCountAggregateOutputType | null;
    _min: RankingSnapshotMinAggregateOutputType | null;
    _max: RankingSnapshotMaxAggregateOutputType | null;
};
export type GetRankingSnapshotGroupByPayload<T extends RankingSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RankingSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RankingSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RankingSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RankingSnapshotGroupByOutputType[P]>;
}>>;
export type RankingSnapshotWhereInput = {
    AND?: Prisma.RankingSnapshotWhereInput | Prisma.RankingSnapshotWhereInput[];
    OR?: Prisma.RankingSnapshotWhereInput[];
    NOT?: Prisma.RankingSnapshotWhereInput | Prisma.RankingSnapshotWhereInput[];
    id?: Prisma.StringFilter<"RankingSnapshot"> | string;
    edicaoId?: Prisma.StringFilter<"RankingSnapshot"> | string;
    estado?: Prisma.StringNullableFilter<"RankingSnapshot"> | string | null;
    dados?: Prisma.JsonFilter<"RankingSnapshot">;
    publicadoEm?: Prisma.DateTimeNullableFilter<"RankingSnapshot"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"RankingSnapshot"> | Date | string;
};
export type RankingSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    estado?: Prisma.SortOrderInput | Prisma.SortOrder;
    dados?: Prisma.SortOrder;
    publicadoEm?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RankingSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RankingSnapshotWhereInput | Prisma.RankingSnapshotWhereInput[];
    OR?: Prisma.RankingSnapshotWhereInput[];
    NOT?: Prisma.RankingSnapshotWhereInput | Prisma.RankingSnapshotWhereInput[];
    edicaoId?: Prisma.StringFilter<"RankingSnapshot"> | string;
    estado?: Prisma.StringNullableFilter<"RankingSnapshot"> | string | null;
    dados?: Prisma.JsonFilter<"RankingSnapshot">;
    publicadoEm?: Prisma.DateTimeNullableFilter<"RankingSnapshot"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"RankingSnapshot"> | Date | string;
}, "id">;
export type RankingSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    estado?: Prisma.SortOrderInput | Prisma.SortOrder;
    dados?: Prisma.SortOrder;
    publicadoEm?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RankingSnapshotCountOrderByAggregateInput;
    _max?: Prisma.RankingSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.RankingSnapshotMinOrderByAggregateInput;
};
export type RankingSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.RankingSnapshotScalarWhereWithAggregatesInput | Prisma.RankingSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.RankingSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RankingSnapshotScalarWhereWithAggregatesInput | Prisma.RankingSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RankingSnapshot"> | string;
    edicaoId?: Prisma.StringWithAggregatesFilter<"RankingSnapshot"> | string;
    estado?: Prisma.StringNullableWithAggregatesFilter<"RankingSnapshot"> | string | null;
    dados?: Prisma.JsonWithAggregatesFilter<"RankingSnapshot">;
    publicadoEm?: Prisma.DateTimeNullableWithAggregatesFilter<"RankingSnapshot"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RankingSnapshot"> | Date | string;
};
export type RankingSnapshotCreateInput = {
    id?: string;
    edicaoId: string;
    estado?: string | null;
    dados: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    publicadoEm?: Date | string | null;
    createdAt?: Date | string;
};
export type RankingSnapshotUncheckedCreateInput = {
    id?: string;
    edicaoId: string;
    estado?: string | null;
    dados: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    publicadoEm?: Date | string | null;
    createdAt?: Date | string;
};
export type RankingSnapshotUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dados?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    publicadoEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RankingSnapshotUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dados?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    publicadoEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RankingSnapshotCreateManyInput = {
    id?: string;
    edicaoId: string;
    estado?: string | null;
    dados: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    publicadoEm?: Date | string | null;
    createdAt?: Date | string;
};
export type RankingSnapshotUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dados?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    publicadoEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RankingSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edicaoId?: Prisma.StringFieldUpdateOperationsInput | string;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dados?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    publicadoEm?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RankingSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    dados?: Prisma.SortOrder;
    publicadoEm?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RankingSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    publicadoEm?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RankingSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    edicaoId?: Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    publicadoEm?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RankingSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    edicaoId?: boolean;
    estado?: boolean;
    dados?: boolean;
    publicadoEm?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["rankingSnapshot"]>;
export type RankingSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    edicaoId?: boolean;
    estado?: boolean;
    dados?: boolean;
    publicadoEm?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["rankingSnapshot"]>;
export type RankingSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    edicaoId?: boolean;
    estado?: boolean;
    dados?: boolean;
    publicadoEm?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["rankingSnapshot"]>;
export type RankingSnapshotSelectScalar = {
    id?: boolean;
    edicaoId?: boolean;
    estado?: boolean;
    dados?: boolean;
    publicadoEm?: boolean;
    createdAt?: boolean;
};
export type RankingSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "edicaoId" | "estado" | "dados" | "publicadoEm" | "createdAt", ExtArgs["result"]["rankingSnapshot"]>;
export type $RankingSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RankingSnapshot";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        edicaoId: string;
        estado: string | null;
        dados: runtime.JsonValue;
        publicadoEm: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["rankingSnapshot"]>;
    composites: {};
};
export type RankingSnapshotGetPayload<S extends boolean | null | undefined | RankingSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload, S>;
export type RankingSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RankingSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RankingSnapshotCountAggregateInputType | true;
};
export interface RankingSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RankingSnapshot'];
        meta: {
            name: 'RankingSnapshot';
        };
    };
    findUnique<T extends RankingSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, RankingSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RankingSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RankingSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RankingSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RankingSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RankingSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, RankingSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__RankingSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RankingSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RankingSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RankingSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RankingSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, RankingSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RankingSnapshotCreateArgs>(args: Prisma.SelectSubset<T, RankingSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__RankingSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RankingSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, RankingSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RankingSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RankingSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RankingSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, RankingSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__RankingSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RankingSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, RankingSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__RankingSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RankingSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, RankingSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RankingSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, RankingSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RankingSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RankingSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RankingSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, RankingSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__RankingSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RankingSnapshotCountArgs>(args?: Prisma.Subset<T, RankingSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RankingSnapshotCountAggregateOutputType> : number>;
    aggregate<T extends RankingSnapshotAggregateArgs>(args: Prisma.Subset<T, RankingSnapshotAggregateArgs>): Prisma.PrismaPromise<GetRankingSnapshotAggregateType<T>>;
    groupBy<T extends RankingSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RankingSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: RankingSnapshotGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RankingSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRankingSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RankingSnapshotFieldRefs;
}
export interface Prisma__RankingSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RankingSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"RankingSnapshot", 'String'>;
    readonly edicaoId: Prisma.FieldRef<"RankingSnapshot", 'String'>;
    readonly estado: Prisma.FieldRef<"RankingSnapshot", 'String'>;
    readonly dados: Prisma.FieldRef<"RankingSnapshot", 'Json'>;
    readonly publicadoEm: Prisma.FieldRef<"RankingSnapshot", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"RankingSnapshot", 'DateTime'>;
}
export type RankingSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    where: Prisma.RankingSnapshotWhereUniqueInput;
};
export type RankingSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    where: Prisma.RankingSnapshotWhereUniqueInput;
};
export type RankingSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    where?: Prisma.RankingSnapshotWhereInput;
    orderBy?: Prisma.RankingSnapshotOrderByWithRelationInput | Prisma.RankingSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.RankingSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RankingSnapshotScalarFieldEnum | Prisma.RankingSnapshotScalarFieldEnum[];
};
export type RankingSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    where?: Prisma.RankingSnapshotWhereInput;
    orderBy?: Prisma.RankingSnapshotOrderByWithRelationInput | Prisma.RankingSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.RankingSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RankingSnapshotScalarFieldEnum | Prisma.RankingSnapshotScalarFieldEnum[];
};
export type RankingSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    where?: Prisma.RankingSnapshotWhereInput;
    orderBy?: Prisma.RankingSnapshotOrderByWithRelationInput | Prisma.RankingSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.RankingSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RankingSnapshotScalarFieldEnum | Prisma.RankingSnapshotScalarFieldEnum[];
};
export type RankingSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RankingSnapshotCreateInput, Prisma.RankingSnapshotUncheckedCreateInput>;
};
export type RankingSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RankingSnapshotCreateManyInput | Prisma.RankingSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RankingSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    data: Prisma.RankingSnapshotCreateManyInput | Prisma.RankingSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RankingSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RankingSnapshotUpdateInput, Prisma.RankingSnapshotUncheckedUpdateInput>;
    where: Prisma.RankingSnapshotWhereUniqueInput;
};
export type RankingSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RankingSnapshotUpdateManyMutationInput, Prisma.RankingSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.RankingSnapshotWhereInput;
    limit?: number;
};
export type RankingSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RankingSnapshotUpdateManyMutationInput, Prisma.RankingSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.RankingSnapshotWhereInput;
    limit?: number;
};
export type RankingSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    where: Prisma.RankingSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.RankingSnapshotCreateInput, Prisma.RankingSnapshotUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RankingSnapshotUpdateInput, Prisma.RankingSnapshotUncheckedUpdateInput>;
};
export type RankingSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
    where: Prisma.RankingSnapshotWhereUniqueInput;
};
export type RankingSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RankingSnapshotWhereInput;
    limit?: number;
};
export type RankingSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RankingSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RankingSnapshotOmit<ExtArgs> | null;
};

import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type QuestaoModel = runtime.Types.Result.DefaultSelection<Prisma.$QuestaoPayload>;
export type AggregateQuestao = {
    _count: QuestaoCountAggregateOutputType | null;
    _min: QuestaoMinAggregateOutputType | null;
    _max: QuestaoMaxAggregateOutputType | null;
};
export type QuestaoMinAggregateOutputType = {
    id: string | null;
    enunciado: string | null;
    alternativaA: string | null;
    alternativaB: string | null;
    alternativaC: string | null;
    alternativaD: string | null;
    alternativaE: string | null;
    correta: string | null;
    eixo: $Enums.Eixo | null;
    dificuldade: $Enums.Dificuldade | null;
    createdAt: Date | null;
};
export type QuestaoMaxAggregateOutputType = {
    id: string | null;
    enunciado: string | null;
    alternativaA: string | null;
    alternativaB: string | null;
    alternativaC: string | null;
    alternativaD: string | null;
    alternativaE: string | null;
    correta: string | null;
    eixo: $Enums.Eixo | null;
    dificuldade: $Enums.Dificuldade | null;
    createdAt: Date | null;
};
export type QuestaoCountAggregateOutputType = {
    id: number;
    enunciado: number;
    alternativaA: number;
    alternativaB: number;
    alternativaC: number;
    alternativaD: number;
    alternativaE: number;
    correta: number;
    eixo: number;
    dificuldade: number;
    createdAt: number;
    _all: number;
};
export type QuestaoMinAggregateInputType = {
    id?: true;
    enunciado?: true;
    alternativaA?: true;
    alternativaB?: true;
    alternativaC?: true;
    alternativaD?: true;
    alternativaE?: true;
    correta?: true;
    eixo?: true;
    dificuldade?: true;
    createdAt?: true;
};
export type QuestaoMaxAggregateInputType = {
    id?: true;
    enunciado?: true;
    alternativaA?: true;
    alternativaB?: true;
    alternativaC?: true;
    alternativaD?: true;
    alternativaE?: true;
    correta?: true;
    eixo?: true;
    dificuldade?: true;
    createdAt?: true;
};
export type QuestaoCountAggregateInputType = {
    id?: true;
    enunciado?: true;
    alternativaA?: true;
    alternativaB?: true;
    alternativaC?: true;
    alternativaD?: true;
    alternativaE?: true;
    correta?: true;
    eixo?: true;
    dificuldade?: true;
    createdAt?: true;
    _all?: true;
};
export type QuestaoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestaoWhereInput;
    orderBy?: Prisma.QuestaoOrderByWithRelationInput | Prisma.QuestaoOrderByWithRelationInput[];
    cursor?: Prisma.QuestaoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | QuestaoCountAggregateInputType;
    _min?: QuestaoMinAggregateInputType;
    _max?: QuestaoMaxAggregateInputType;
};
export type GetQuestaoAggregateType<T extends QuestaoAggregateArgs> = {
    [P in keyof T & keyof AggregateQuestao]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateQuestao[P]> : Prisma.GetScalarType<T[P], AggregateQuestao[P]>;
};
export type QuestaoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestaoWhereInput;
    orderBy?: Prisma.QuestaoOrderByWithAggregationInput | Prisma.QuestaoOrderByWithAggregationInput[];
    by: Prisma.QuestaoScalarFieldEnum[] | Prisma.QuestaoScalarFieldEnum;
    having?: Prisma.QuestaoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: QuestaoCountAggregateInputType | true;
    _min?: QuestaoMinAggregateInputType;
    _max?: QuestaoMaxAggregateInputType;
};
export type QuestaoGroupByOutputType = {
    id: string;
    enunciado: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    alternativaE: string;
    correta: string;
    eixo: $Enums.Eixo;
    dificuldade: $Enums.Dificuldade;
    createdAt: Date;
    _count: QuestaoCountAggregateOutputType | null;
    _min: QuestaoMinAggregateOutputType | null;
    _max: QuestaoMaxAggregateOutputType | null;
};
export type GetQuestaoGroupByPayload<T extends QuestaoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<QuestaoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof QuestaoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], QuestaoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], QuestaoGroupByOutputType[P]>;
}>>;
export type QuestaoWhereInput = {
    AND?: Prisma.QuestaoWhereInput | Prisma.QuestaoWhereInput[];
    OR?: Prisma.QuestaoWhereInput[];
    NOT?: Prisma.QuestaoWhereInput | Prisma.QuestaoWhereInput[];
    id?: Prisma.StringFilter<"Questao"> | string;
    enunciado?: Prisma.StringFilter<"Questao"> | string;
    alternativaA?: Prisma.StringFilter<"Questao"> | string;
    alternativaB?: Prisma.StringFilter<"Questao"> | string;
    alternativaC?: Prisma.StringFilter<"Questao"> | string;
    alternativaD?: Prisma.StringFilter<"Questao"> | string;
    alternativaE?: Prisma.StringFilter<"Questao"> | string;
    correta?: Prisma.StringFilter<"Questao"> | string;
    eixo?: Prisma.EnumEixoFilter<"Questao"> | $Enums.Eixo;
    dificuldade?: Prisma.EnumDificuldadeFilter<"Questao"> | $Enums.Dificuldade;
    createdAt?: Prisma.DateTimeFilter<"Questao"> | Date | string;
    respostas?: Prisma.RespostaListRelationFilter;
};
export type QuestaoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    enunciado?: Prisma.SortOrder;
    alternativaA?: Prisma.SortOrder;
    alternativaB?: Prisma.SortOrder;
    alternativaC?: Prisma.SortOrder;
    alternativaD?: Prisma.SortOrder;
    alternativaE?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    eixo?: Prisma.SortOrder;
    dificuldade?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    respostas?: Prisma.RespostaOrderByRelationAggregateInput;
};
export type QuestaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.QuestaoWhereInput | Prisma.QuestaoWhereInput[];
    OR?: Prisma.QuestaoWhereInput[];
    NOT?: Prisma.QuestaoWhereInput | Prisma.QuestaoWhereInput[];
    enunciado?: Prisma.StringFilter<"Questao"> | string;
    alternativaA?: Prisma.StringFilter<"Questao"> | string;
    alternativaB?: Prisma.StringFilter<"Questao"> | string;
    alternativaC?: Prisma.StringFilter<"Questao"> | string;
    alternativaD?: Prisma.StringFilter<"Questao"> | string;
    alternativaE?: Prisma.StringFilter<"Questao"> | string;
    correta?: Prisma.StringFilter<"Questao"> | string;
    eixo?: Prisma.EnumEixoFilter<"Questao"> | $Enums.Eixo;
    dificuldade?: Prisma.EnumDificuldadeFilter<"Questao"> | $Enums.Dificuldade;
    createdAt?: Prisma.DateTimeFilter<"Questao"> | Date | string;
    respostas?: Prisma.RespostaListRelationFilter;
}, "id">;
export type QuestaoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    enunciado?: Prisma.SortOrder;
    alternativaA?: Prisma.SortOrder;
    alternativaB?: Prisma.SortOrder;
    alternativaC?: Prisma.SortOrder;
    alternativaD?: Prisma.SortOrder;
    alternativaE?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    eixo?: Prisma.SortOrder;
    dificuldade?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.QuestaoCountOrderByAggregateInput;
    _max?: Prisma.QuestaoMaxOrderByAggregateInput;
    _min?: Prisma.QuestaoMinOrderByAggregateInput;
};
export type QuestaoScalarWhereWithAggregatesInput = {
    AND?: Prisma.QuestaoScalarWhereWithAggregatesInput | Prisma.QuestaoScalarWhereWithAggregatesInput[];
    OR?: Prisma.QuestaoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.QuestaoScalarWhereWithAggregatesInput | Prisma.QuestaoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Questao"> | string;
    enunciado?: Prisma.StringWithAggregatesFilter<"Questao"> | string;
    alternativaA?: Prisma.StringWithAggregatesFilter<"Questao"> | string;
    alternativaB?: Prisma.StringWithAggregatesFilter<"Questao"> | string;
    alternativaC?: Prisma.StringWithAggregatesFilter<"Questao"> | string;
    alternativaD?: Prisma.StringWithAggregatesFilter<"Questao"> | string;
    alternativaE?: Prisma.StringWithAggregatesFilter<"Questao"> | string;
    correta?: Prisma.StringWithAggregatesFilter<"Questao"> | string;
    eixo?: Prisma.EnumEixoWithAggregatesFilter<"Questao"> | $Enums.Eixo;
    dificuldade?: Prisma.EnumDificuldadeWithAggregatesFilter<"Questao"> | $Enums.Dificuldade;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Questao"> | Date | string;
};
export type QuestaoCreateInput = {
    id?: string;
    enunciado: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    alternativaE: string;
    correta: string;
    eixo: $Enums.Eixo;
    dificuldade: $Enums.Dificuldade;
    createdAt?: Date | string;
    respostas?: Prisma.RespostaCreateNestedManyWithoutQuestaoInput;
};
export type QuestaoUncheckedCreateInput = {
    id?: string;
    enunciado: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    alternativaE: string;
    correta: string;
    eixo: $Enums.Eixo;
    dificuldade: $Enums.Dificuldade;
    createdAt?: Date | string;
    respostas?: Prisma.RespostaUncheckedCreateNestedManyWithoutQuestaoInput;
};
export type QuestaoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enunciado?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaA?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaB?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaC?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaD?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaE?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.StringFieldUpdateOperationsInput | string;
    eixo?: Prisma.EnumEixoFieldUpdateOperationsInput | $Enums.Eixo;
    dificuldade?: Prisma.EnumDificuldadeFieldUpdateOperationsInput | $Enums.Dificuldade;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    respostas?: Prisma.RespostaUpdateManyWithoutQuestaoNestedInput;
};
export type QuestaoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enunciado?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaA?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaB?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaC?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaD?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaE?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.StringFieldUpdateOperationsInput | string;
    eixo?: Prisma.EnumEixoFieldUpdateOperationsInput | $Enums.Eixo;
    dificuldade?: Prisma.EnumDificuldadeFieldUpdateOperationsInput | $Enums.Dificuldade;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    respostas?: Prisma.RespostaUncheckedUpdateManyWithoutQuestaoNestedInput;
};
export type QuestaoCreateManyInput = {
    id?: string;
    enunciado: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    alternativaE: string;
    correta: string;
    eixo: $Enums.Eixo;
    dificuldade: $Enums.Dificuldade;
    createdAt?: Date | string;
};
export type QuestaoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enunciado?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaA?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaB?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaC?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaD?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaE?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.StringFieldUpdateOperationsInput | string;
    eixo?: Prisma.EnumEixoFieldUpdateOperationsInput | $Enums.Eixo;
    dificuldade?: Prisma.EnumDificuldadeFieldUpdateOperationsInput | $Enums.Dificuldade;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestaoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enunciado?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaA?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaB?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaC?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaD?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaE?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.StringFieldUpdateOperationsInput | string;
    eixo?: Prisma.EnumEixoFieldUpdateOperationsInput | $Enums.Eixo;
    dificuldade?: Prisma.EnumDificuldadeFieldUpdateOperationsInput | $Enums.Dificuldade;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestaoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    enunciado?: Prisma.SortOrder;
    alternativaA?: Prisma.SortOrder;
    alternativaB?: Prisma.SortOrder;
    alternativaC?: Prisma.SortOrder;
    alternativaD?: Prisma.SortOrder;
    alternativaE?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    eixo?: Prisma.SortOrder;
    dificuldade?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type QuestaoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    enunciado?: Prisma.SortOrder;
    alternativaA?: Prisma.SortOrder;
    alternativaB?: Prisma.SortOrder;
    alternativaC?: Prisma.SortOrder;
    alternativaD?: Prisma.SortOrder;
    alternativaE?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    eixo?: Prisma.SortOrder;
    dificuldade?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type QuestaoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    enunciado?: Prisma.SortOrder;
    alternativaA?: Prisma.SortOrder;
    alternativaB?: Prisma.SortOrder;
    alternativaC?: Prisma.SortOrder;
    alternativaD?: Prisma.SortOrder;
    alternativaE?: Prisma.SortOrder;
    correta?: Prisma.SortOrder;
    eixo?: Prisma.SortOrder;
    dificuldade?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type QuestaoScalarRelationFilter = {
    is?: Prisma.QuestaoWhereInput;
    isNot?: Prisma.QuestaoWhereInput;
};
export type EnumEixoFieldUpdateOperationsInput = {
    set?: $Enums.Eixo;
};
export type EnumDificuldadeFieldUpdateOperationsInput = {
    set?: $Enums.Dificuldade;
};
export type QuestaoCreateNestedOneWithoutRespostasInput = {
    create?: Prisma.XOR<Prisma.QuestaoCreateWithoutRespostasInput, Prisma.QuestaoUncheckedCreateWithoutRespostasInput>;
    connectOrCreate?: Prisma.QuestaoCreateOrConnectWithoutRespostasInput;
    connect?: Prisma.QuestaoWhereUniqueInput;
};
export type QuestaoUpdateOneRequiredWithoutRespostasNestedInput = {
    create?: Prisma.XOR<Prisma.QuestaoCreateWithoutRespostasInput, Prisma.QuestaoUncheckedCreateWithoutRespostasInput>;
    connectOrCreate?: Prisma.QuestaoCreateOrConnectWithoutRespostasInput;
    upsert?: Prisma.QuestaoUpsertWithoutRespostasInput;
    connect?: Prisma.QuestaoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.QuestaoUpdateToOneWithWhereWithoutRespostasInput, Prisma.QuestaoUpdateWithoutRespostasInput>, Prisma.QuestaoUncheckedUpdateWithoutRespostasInput>;
};
export type QuestaoCreateWithoutRespostasInput = {
    id?: string;
    enunciado: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    alternativaE: string;
    correta: string;
    eixo: $Enums.Eixo;
    dificuldade: $Enums.Dificuldade;
    createdAt?: Date | string;
};
export type QuestaoUncheckedCreateWithoutRespostasInput = {
    id?: string;
    enunciado: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    alternativaE: string;
    correta: string;
    eixo: $Enums.Eixo;
    dificuldade: $Enums.Dificuldade;
    createdAt?: Date | string;
};
export type QuestaoCreateOrConnectWithoutRespostasInput = {
    where: Prisma.QuestaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestaoCreateWithoutRespostasInput, Prisma.QuestaoUncheckedCreateWithoutRespostasInput>;
};
export type QuestaoUpsertWithoutRespostasInput = {
    update: Prisma.XOR<Prisma.QuestaoUpdateWithoutRespostasInput, Prisma.QuestaoUncheckedUpdateWithoutRespostasInput>;
    create: Prisma.XOR<Prisma.QuestaoCreateWithoutRespostasInput, Prisma.QuestaoUncheckedCreateWithoutRespostasInput>;
    where?: Prisma.QuestaoWhereInput;
};
export type QuestaoUpdateToOneWithWhereWithoutRespostasInput = {
    where?: Prisma.QuestaoWhereInput;
    data: Prisma.XOR<Prisma.QuestaoUpdateWithoutRespostasInput, Prisma.QuestaoUncheckedUpdateWithoutRespostasInput>;
};
export type QuestaoUpdateWithoutRespostasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enunciado?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaA?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaB?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaC?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaD?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaE?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.StringFieldUpdateOperationsInput | string;
    eixo?: Prisma.EnumEixoFieldUpdateOperationsInput | $Enums.Eixo;
    dificuldade?: Prisma.EnumDificuldadeFieldUpdateOperationsInput | $Enums.Dificuldade;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestaoUncheckedUpdateWithoutRespostasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enunciado?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaA?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaB?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaC?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaD?: Prisma.StringFieldUpdateOperationsInput | string;
    alternativaE?: Prisma.StringFieldUpdateOperationsInput | string;
    correta?: Prisma.StringFieldUpdateOperationsInput | string;
    eixo?: Prisma.EnumEixoFieldUpdateOperationsInput | $Enums.Eixo;
    dificuldade?: Prisma.EnumDificuldadeFieldUpdateOperationsInput | $Enums.Dificuldade;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestaoCountOutputType = {
    respostas: number;
};
export type QuestaoCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    respostas?: boolean | QuestaoCountOutputTypeCountRespostasArgs;
};
export type QuestaoCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoCountOutputTypeSelect<ExtArgs> | null;
};
export type QuestaoCountOutputTypeCountRespostasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RespostaWhereInput;
};
export type QuestaoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    enunciado?: boolean;
    alternativaA?: boolean;
    alternativaB?: boolean;
    alternativaC?: boolean;
    alternativaD?: boolean;
    alternativaE?: boolean;
    correta?: boolean;
    eixo?: boolean;
    dificuldade?: boolean;
    createdAt?: boolean;
    respostas?: boolean | Prisma.Questao$respostasArgs<ExtArgs>;
    _count?: boolean | Prisma.QuestaoCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["questao"]>;
export type QuestaoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    enunciado?: boolean;
    alternativaA?: boolean;
    alternativaB?: boolean;
    alternativaC?: boolean;
    alternativaD?: boolean;
    alternativaE?: boolean;
    correta?: boolean;
    eixo?: boolean;
    dificuldade?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["questao"]>;
export type QuestaoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    enunciado?: boolean;
    alternativaA?: boolean;
    alternativaB?: boolean;
    alternativaC?: boolean;
    alternativaD?: boolean;
    alternativaE?: boolean;
    correta?: boolean;
    eixo?: boolean;
    dificuldade?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["questao"]>;
export type QuestaoSelectScalar = {
    id?: boolean;
    enunciado?: boolean;
    alternativaA?: boolean;
    alternativaB?: boolean;
    alternativaC?: boolean;
    alternativaD?: boolean;
    alternativaE?: boolean;
    correta?: boolean;
    eixo?: boolean;
    dificuldade?: boolean;
    createdAt?: boolean;
};
export type QuestaoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "enunciado" | "alternativaA" | "alternativaB" | "alternativaC" | "alternativaD" | "alternativaE" | "correta" | "eixo" | "dificuldade" | "createdAt", ExtArgs["result"]["questao"]>;
export type QuestaoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    respostas?: boolean | Prisma.Questao$respostasArgs<ExtArgs>;
    _count?: boolean | Prisma.QuestaoCountOutputTypeDefaultArgs<ExtArgs>;
};
export type QuestaoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type QuestaoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $QuestaoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Questao";
    objects: {
        respostas: Prisma.$RespostaPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        enunciado: string;
        alternativaA: string;
        alternativaB: string;
        alternativaC: string;
        alternativaD: string;
        alternativaE: string;
        correta: string;
        eixo: $Enums.Eixo;
        dificuldade: $Enums.Dificuldade;
        createdAt: Date;
    }, ExtArgs["result"]["questao"]>;
    composites: {};
};
export type QuestaoGetPayload<S extends boolean | null | undefined | QuestaoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$QuestaoPayload, S>;
export type QuestaoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<QuestaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: QuestaoCountAggregateInputType | true;
};
export interface QuestaoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Questao'];
        meta: {
            name: 'Questao';
        };
    };
    findUnique<T extends QuestaoFindUniqueArgs>(args: Prisma.SelectSubset<T, QuestaoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends QuestaoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, QuestaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends QuestaoFindFirstArgs>(args?: Prisma.SelectSubset<T, QuestaoFindFirstArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends QuestaoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, QuestaoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends QuestaoFindManyArgs>(args?: Prisma.SelectSubset<T, QuestaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends QuestaoCreateArgs>(args: Prisma.SelectSubset<T, QuestaoCreateArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends QuestaoCreateManyArgs>(args?: Prisma.SelectSubset<T, QuestaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends QuestaoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, QuestaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends QuestaoDeleteArgs>(args: Prisma.SelectSubset<T, QuestaoDeleteArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends QuestaoUpdateArgs>(args: Prisma.SelectSubset<T, QuestaoUpdateArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends QuestaoDeleteManyArgs>(args?: Prisma.SelectSubset<T, QuestaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends QuestaoUpdateManyArgs>(args: Prisma.SelectSubset<T, QuestaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends QuestaoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, QuestaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends QuestaoUpsertArgs>(args: Prisma.SelectSubset<T, QuestaoUpsertArgs<ExtArgs>>): Prisma.Prisma__QuestaoClient<runtime.Types.Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends QuestaoCountArgs>(args?: Prisma.Subset<T, QuestaoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], QuestaoCountAggregateOutputType> : number>;
    aggregate<T extends QuestaoAggregateArgs>(args: Prisma.Subset<T, QuestaoAggregateArgs>): Prisma.PrismaPromise<GetQuestaoAggregateType<T>>;
    groupBy<T extends QuestaoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: QuestaoGroupByArgs['orderBy'];
    } : {
        orderBy?: QuestaoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, QuestaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: QuestaoFieldRefs;
}
export interface Prisma__QuestaoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    respostas<T extends Prisma.Questao$respostasArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Questao$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface QuestaoFieldRefs {
    readonly id: Prisma.FieldRef<"Questao", 'String'>;
    readonly enunciado: Prisma.FieldRef<"Questao", 'String'>;
    readonly alternativaA: Prisma.FieldRef<"Questao", 'String'>;
    readonly alternativaB: Prisma.FieldRef<"Questao", 'String'>;
    readonly alternativaC: Prisma.FieldRef<"Questao", 'String'>;
    readonly alternativaD: Prisma.FieldRef<"Questao", 'String'>;
    readonly alternativaE: Prisma.FieldRef<"Questao", 'String'>;
    readonly correta: Prisma.FieldRef<"Questao", 'String'>;
    readonly eixo: Prisma.FieldRef<"Questao", 'Eixo'>;
    readonly dificuldade: Prisma.FieldRef<"Questao", 'Dificuldade'>;
    readonly createdAt: Prisma.FieldRef<"Questao", 'DateTime'>;
}
export type QuestaoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
    where: Prisma.QuestaoWhereUniqueInput;
};
export type QuestaoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
    where: Prisma.QuestaoWhereUniqueInput;
};
export type QuestaoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
    where?: Prisma.QuestaoWhereInput;
    orderBy?: Prisma.QuestaoOrderByWithRelationInput | Prisma.QuestaoOrderByWithRelationInput[];
    cursor?: Prisma.QuestaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestaoScalarFieldEnum | Prisma.QuestaoScalarFieldEnum[];
};
export type QuestaoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
    where?: Prisma.QuestaoWhereInput;
    orderBy?: Prisma.QuestaoOrderByWithRelationInput | Prisma.QuestaoOrderByWithRelationInput[];
    cursor?: Prisma.QuestaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestaoScalarFieldEnum | Prisma.QuestaoScalarFieldEnum[];
};
export type QuestaoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
    where?: Prisma.QuestaoWhereInput;
    orderBy?: Prisma.QuestaoOrderByWithRelationInput | Prisma.QuestaoOrderByWithRelationInput[];
    cursor?: Prisma.QuestaoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestaoScalarFieldEnum | Prisma.QuestaoScalarFieldEnum[];
};
export type QuestaoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestaoCreateInput, Prisma.QuestaoUncheckedCreateInput>;
};
export type QuestaoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.QuestaoCreateManyInput | Prisma.QuestaoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type QuestaoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    data: Prisma.QuestaoCreateManyInput | Prisma.QuestaoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type QuestaoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestaoUpdateInput, Prisma.QuestaoUncheckedUpdateInput>;
    where: Prisma.QuestaoWhereUniqueInput;
};
export type QuestaoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.QuestaoUpdateManyMutationInput, Prisma.QuestaoUncheckedUpdateManyInput>;
    where?: Prisma.QuestaoWhereInput;
    limit?: number;
};
export type QuestaoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestaoUpdateManyMutationInput, Prisma.QuestaoUncheckedUpdateManyInput>;
    where?: Prisma.QuestaoWhereInput;
    limit?: number;
};
export type QuestaoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
    where: Prisma.QuestaoWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestaoCreateInput, Prisma.QuestaoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.QuestaoUpdateInput, Prisma.QuestaoUncheckedUpdateInput>;
};
export type QuestaoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
    where: Prisma.QuestaoWhereUniqueInput;
};
export type QuestaoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestaoWhereInput;
    limit?: number;
};
export type Questao$respostasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RespostaSelect<ExtArgs> | null;
    omit?: Prisma.RespostaOmit<ExtArgs> | null;
    include?: Prisma.RespostaInclude<ExtArgs> | null;
    where?: Prisma.RespostaWhereInput;
    orderBy?: Prisma.RespostaOrderByWithRelationInput | Prisma.RespostaOrderByWithRelationInput[];
    cursor?: Prisma.RespostaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RespostaScalarFieldEnum | Prisma.RespostaScalarFieldEnum[];
};
export type QuestaoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestaoSelect<ExtArgs> | null;
    omit?: Prisma.QuestaoOmit<ExtArgs> | null;
    include?: Prisma.QuestaoInclude<ExtArgs> | null;
};

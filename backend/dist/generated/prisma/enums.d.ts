export declare const Role: {
    readonly ALUNO: "ALUNO";
    readonly AVALIADOR: "AVALIADOR";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const StatusInsc: {
    readonly PENDENTE: "PENDENTE";
    readonly CONFIRMADA: "CONFIRMADA";
    readonly REJEITADA: "REJEITADA";
};
export type StatusInsc = (typeof StatusInsc)[keyof typeof StatusInsc];
export declare const Medalha: {
    readonly OURO: "OURO";
    readonly PRATA: "PRATA";
    readonly BRONZE: "BRONZE";
};
export type Medalha = (typeof Medalha)[keyof typeof Medalha];
export declare const Eixo: {
    readonly ALGEBRA: "ALGEBRA";
    readonly GEOMETRIA: "GEOMETRIA";
    readonly ANALISE: "ANALISE";
    readonly ESTATISTICA: "ESTATISTICA";
    readonly DIDATICA: "DIDATICA";
};
export type Eixo = (typeof Eixo)[keyof typeof Eixo];
export declare const Dificuldade: {
    readonly FACIL: "FACIL";
    readonly MEDIO: "MEDIO";
    readonly DIFICIL: "DIFICIL";
};
export type Dificuldade = (typeof Dificuldade)[keyof typeof Dificuldade];
export declare const TipoSubm: {
    readonly ARTIGO: "ARTIGO";
    readonly POSTER: "POSTER";
};
export type TipoSubm = (typeof TipoSubm)[keyof typeof TipoSubm];
export declare const StatusSubm: {
    readonly EM_AVALIACAO: "EM_AVALIACAO";
    readonly APROVADO: "APROVADO";
    readonly REJEITADO: "REJEITADO";
};
export type StatusSubm = (typeof StatusSubm)[keyof typeof StatusSubm];

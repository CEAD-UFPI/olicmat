export declare const Role: {
    readonly ALUNO: "ALUNO";
    readonly COORDENADOR_CURSO: "COORDENADOR_CURSO";
    readonly AVALIADOR: "AVALIADOR";
    readonly ADMIN: "ADMIN";
    readonly COMISSAO: "COMISSAO";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const StatusInsc: {
    readonly PENDENTE: "PENDENTE";
    readonly CONFIRMADA: "CONFIRMADA";
    readonly REJEITADA: "REJEITADA";
};
export type StatusInsc = (typeof StatusInsc)[keyof typeof StatusInsc];
export declare const StatusProva: {
    readonly RASCUNHO: "RASCUNHO";
    readonly PUBLICADA: "PUBLICADA";
    readonly EM_ANDAMENTO: "EM_ANDAMENTO";
    readonly ENCERRADA: "ENCERRADA";
};
export type StatusProva = (typeof StatusProva)[keyof typeof StatusProva];
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
export declare const StatusEnvioFase2: {
    readonly PENDENTE: "PENDENTE";
    readonly ENVIADO: "ENVIADO";
    readonly AVALIADO: "AVALIADO";
};
export type StatusEnvioFase2 = (typeof StatusEnvioFase2)[keyof typeof StatusEnvioFase2];

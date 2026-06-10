import { ProvaService } from "./prova.service.js";
import type { ResponderQuestaoDto } from "./dto/prova.dto.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class ProvaController {
    private readonly provaService;
    constructor(provaService: ProvaService);
    buscarQuestoes(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        inscricaoId: string;
        inicio: string;
        fim: string;
        questoes: {
            respondida: string | null;
            id: string;
            enunciado: string;
            alternativaA: string;
            alternativaB: string;
            alternativaC: string;
            alternativaD: string;
            alternativaE: string;
            eixo: import("../../../generated/prisma/enums.js").Eixo;
            dificuldade: import("../../../generated/prisma/enums.js").Dificuldade;
        }[];
    }>;
    responder(req: ExpressReq & {
        user: AuthUser;
    }, body: ResponderQuestaoDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        correta: boolean;
        provaId: string;
        questaoId: string;
        inscricaoId: string;
        alternativaMarcada: string;
    }>;
    finalizar(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        id: string;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
        instituicaoId: string;
        cursoId: string;
        comprovanteUrl: string | null;
        userId: string;
        status: import("../../../generated/prisma/enums.js").StatusInsc;
        edicaoId: string;
        municipio: string | null;
        periodo: number | null;
        fase1Nota: number | null;
        fase1Inicio: Date | null;
        fase1Fim: Date | null;
        fase2Tema: string | null;
        notaFinal: number | null;
        medalha: import("../../../generated/prisma/enums.js").Medalha | null;
    }>;
    resumo(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        inscricaoId: string;
        inicio: string | null;
        fim: string | null;
        fase1Nota: number | null;
        respondidas: number;
        corretas: number;
        total: number;
        percentual: number;
    }>;
}
export {};

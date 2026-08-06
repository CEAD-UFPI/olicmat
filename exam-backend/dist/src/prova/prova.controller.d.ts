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
    iniciar(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        message: string;
        inicio: any;
    }>;
    buscarQuestoes(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        inscricaoId: any;
        inicio: any;
        fim: string;
        questoes: any;
    }>;
    responder(req: ExpressReq & {
        user: AuthUser;
    }, body: ResponderQuestaoDto): Promise<any>;
    finalizar(req: ExpressReq & {
        user: AuthUser;
    }): Promise<any>;
    resumo(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        inscricaoId: any;
        inicio: any;
        fim: any;
        fase1Nota: any;
        respondidas: number;
        corretas: number;
        total: number;
        percentual: number;
    }>;
    monitoramento(): Promise<{
        emAndamento: any;
        finalizadas: any;
        totalAtivos: any;
        mediaNotaFase1: number;
    }>;
}
export {};

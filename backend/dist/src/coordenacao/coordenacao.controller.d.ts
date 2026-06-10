import { CoordenacaoService } from "./coordenacao.service.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class CoordenacaoController {
    private readonly coordenacaoService;
    constructor(coordenacaoService: CoordenacaoService);
    listAlunos(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        } | null;
        curso: {
            id: string;
            nome: string;
        } | null;
        email: string;
        matricula: string;
    }[]>;
    listInscricoes(req: ExpressReq & {
        user: AuthUser;
    }, cursoId?: string, status?: string): Promise<({
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        };
        curso: {
            id: string;
            nome: string;
        };
        user: {
            id: string;
            nome: string;
            email: string;
            matricula: string;
        };
        edicao: {
            id: string;
            ano: number;
            titulo: string;
        };
    } & {
        id: string;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
        instituicaoId: string;
        cursoId: string;
        comprovanteUrl: string | null;
        userId: string;
        status: import("../../generated/prisma/enums.js").StatusInsc;
        edicaoId: string;
        municipio: string | null;
        periodo: number | null;
        fase1Nota: number | null;
        fase1Inicio: Date | null;
        fase1Fim: Date | null;
        fase2Tema: string | null;
        notaFinal: number | null;
        medalha: import("../../generated/prisma/enums.js").Medalha | null;
    })[]>;
    getMetricas(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        total: number;
        porStatus: {
            status: import("../../generated/prisma/enums.js").StatusInsc;
            count: number;
        }[];
        porCurso: {
            cursoId: string;
            nome: string;
            count: number;
        }[];
    }>;
}
export {};

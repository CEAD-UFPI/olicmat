import { SubmissaoService } from "./submissao.service.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class SubmissaoController {
    private readonly submissaoService;
    constructor(submissaoService: SubmissaoService);
    submeter(req: ExpressReq & {
        user: AuthUser;
    }, file: Express.Multer.File, body: {
        titulo: string;
        resumo: string;
        tipo: "ARTIGO" | "POSTER";
    }): Promise<{
        id: string;
        titulo: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").StatusSubm;
        userId: string;
        resumo: string;
        tipo: import("../../../generated/prisma/enums.js").TipoSubm;
        arquivoUrl: string;
    }>;
    minhas(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        id: string;
        titulo: string;
        createdAt: Date;
        status: import("../../../generated/prisma/enums.js").StatusSubm;
        tipo: import("../../../generated/prisma/enums.js").TipoSubm;
    }[]>;
    listar(status?: string): Promise<({
        user: {
            id: string;
            nome: string;
        };
    } & {
        id: string;
        titulo: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").StatusSubm;
        userId: string;
        resumo: string;
        tipo: import("../../../generated/prisma/enums.js").TipoSubm;
        arquivoUrl: string;
    })[]>;
    atualizarStatus(id: string, body: {
        status: "APROVADO" | "REJEITADO";
    }): Promise<{
        id: string;
        titulo: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").StatusSubm;
        userId: string;
        resumo: string;
        tipo: import("../../../generated/prisma/enums.js").TipoSubm;
        arquivoUrl: string;
    }>;
}
export {};

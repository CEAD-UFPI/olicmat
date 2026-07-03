import { EnvioService } from "./envio.service.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class EnvioController {
    private readonly envioService;
    constructor(envioService: EnvioService);
    enviarVideoLink(req: ExpressReq & {
        user: AuthUser;
    }, body: {
        videoLink: string;
    }): Promise<{
        id: string;
        status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
        inscricaoId: string;
        tipo: string;
        arquivoUrl: string;
        videoLink: string | null;
        enviadoEm: Date;
    }>;
    uploadPortfolio(req: ExpressReq & {
        user: AuthUser;
    }, file: any): Promise<{
        id: string;
        status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
        inscricaoId: string;
        tipo: string;
        arquivoUrl: string;
        videoLink: string | null;
        enviadoEm: Date;
    }>;
    status(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        id: string;
        avaliacoes: {
            id: string;
            nota: number;
            parecer: string | null;
            avaliadoEm: Date;
        }[];
        fase2Tema: string | null;
        enviosFase2: {
            id: string;
            status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
            tipo: string;
            arquivoUrl: string;
            videoLink: string | null;
            enviadoEm: Date;
        }[];
    }>;
}
export {};

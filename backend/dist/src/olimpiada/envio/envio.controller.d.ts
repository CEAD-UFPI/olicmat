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
    uploadVideo(req: ExpressReq & {
        user: AuthUser;
    }, file: Express.Multer.File): Promise<{
        id: string;
        instituicao: string;
        curso: string;
        comprovanteUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        estado: string;
        municipio: string | null;
        periodo: number | null;
        status: import("../../../generated/prisma/enums.js").StatusInsc;
        fase2Tema: string | null;
        fase2VideoUrl: string | null;
        fase2PortfolioUrl: string | null;
        fase2Nota: number | null;
        userId: string;
        fase1Nota: number | null;
        fase1Inicio: Date | null;
        fase1Fim: Date | null;
        notaFinal: number | null;
        medalha: import("../../../generated/prisma/enums.js").Medalha | null;
    }>;
    uploadPortfolio(req: ExpressReq & {
        user: AuthUser;
    }, file: Express.Multer.File): Promise<{
        id: string;
        instituicao: string;
        curso: string;
        comprovanteUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        estado: string;
        municipio: string | null;
        periodo: number | null;
        status: import("../../../generated/prisma/enums.js").StatusInsc;
        fase2Tema: string | null;
        fase2VideoUrl: string | null;
        fase2PortfolioUrl: string | null;
        fase2Nota: number | null;
        userId: string;
        fase1Nota: number | null;
        fase1Inicio: Date | null;
        fase1Fim: Date | null;
        notaFinal: number | null;
        medalha: import("../../../generated/prisma/enums.js").Medalha | null;
    }>;
    status(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        fase2Tema: string | null;
        fase2VideoUrl: string | null;
        fase2PortfolioUrl: string | null;
        fase2Nota: number | null;
    }>;
}
export {};

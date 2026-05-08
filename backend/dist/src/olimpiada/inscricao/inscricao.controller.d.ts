import { InscricaoService } from "./inscricao.service.js";
import type { CriarInscricaoDto } from "./dto/inscricao.dto.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class InscricaoController {
    private readonly inscricaoService;
    constructor(inscricaoService: InscricaoService);
    criar(req: ExpressReq & {
        user: AuthUser;
    }, body: CriarInscricaoDto): Promise<{
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
    minha(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        user: {
            id: string;
            email: string;
            nome: string;
        };
    } & {
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
    iniciarProva(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
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
    sortearTema(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
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
    listar(status?: string): Promise<({
        user: {
            id: string;
            email: string;
            nome: string;
            instituicao: string;
        };
    } & {
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
    })[]>;
    confirmar(id: string): Promise<{
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
}
export {};

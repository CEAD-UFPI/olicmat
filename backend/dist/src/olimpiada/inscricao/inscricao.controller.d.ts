import { InscricaoService } from "./inscricao.service.js";
import type { CriarInscricaoDto } from "./dto/inscricao.dto.js";
import type { Request as ExpressReq } from "express";
import { UploadService } from "../../upload/upload.service.js";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class InscricaoController {
    private readonly inscricaoService;
    private readonly uploadService;
    constructor(inscricaoService: InscricaoService, uploadService: UploadService);
    criar(req: ExpressReq & {
        user: AuthUser;
    }, body: CriarInscricaoDto): Promise<{
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
    minha(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        user: {
            id: string;
            nome: string;
            email: string;
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
    iniciarProva(req: ExpressReq & {
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
    sortearTema(req: ExpressReq & {
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
    listar(req: ExpressReq & {
        user: AuthUser;
    }, status?: string): Promise<({
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
            instituicao: {
                id: string;
                sigla: string;
                nome: string;
            } | null;
            email: string;
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
    })[]>;
    confirmar(id: string, req: ExpressReq & {
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
    atualizarStatus(id: string, body: {
        status: string;
    }, req: ExpressReq & {
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
    editar(id: string, body: unknown): Promise<{
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
    deletar(id: string, req: ExpressReq & {
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
    uploadComprovante(req: ExpressReq & {
        user: AuthUser;
    }, file: any): Promise<{
        url: string;
    }>;
}
export {};

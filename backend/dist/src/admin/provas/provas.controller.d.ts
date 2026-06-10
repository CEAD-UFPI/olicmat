import { ProvasService } from "./provas.service.js";
import type { CriarProvaDto, AtualizarProvaDto } from "./dto/provas.dto.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class ProvasController {
    private readonly provasService;
    constructor(provasService: ProvasService);
    create(req: ExpressReq & {
        user: AuthUser;
    }, body: CriarProvaDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titulo: string;
        status: import("../../../generated/prisma/enums.js").StatusProva;
        createdBy: string;
        edicaoId: string;
        fase: number;
        duracaoMinutos: number;
        publicadaEm: Date | null;
        janelaInicio: Date | null;
        janelaFim: Date | null;
        versao: number;
    }>;
    findAll(edicaoId?: string): Promise<({
        edicao: {
            id: string;
            ano: number;
            titulo: string;
        };
        _count: {
            questoes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titulo: string;
        status: import("../../../generated/prisma/enums.js").StatusProva;
        createdBy: string;
        edicaoId: string;
        fase: number;
        duracaoMinutos: number;
        publicadaEm: Date | null;
        janelaInicio: Date | null;
        janelaFim: Date | null;
        versao: number;
    })[]>;
    findById(id: string): Promise<{
        edicao: {
            id: string;
            ano: number;
            titulo: string;
        };
        questoes: ({
            questao: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                enunciado: string;
                alternativaA: string;
                alternativaB: string;
                alternativaC: string;
                alternativaD: string;
                alternativaE: string;
                correta: string;
                eixo: import("../../../generated/prisma/enums.js").Eixo;
                dificuldade: import("../../../generated/prisma/enums.js").Dificuldade;
                createdBy: string | null;
            };
        } & {
            id: string;
            provaId: string;
            questaoId: string;
            ordem: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titulo: string;
        status: import("../../../generated/prisma/enums.js").StatusProva;
        createdBy: string;
        edicaoId: string;
        fase: number;
        duracaoMinutos: number;
        publicadaEm: Date | null;
        janelaInicio: Date | null;
        janelaFim: Date | null;
        versao: number;
    }>;
    update(id: string, req: ExpressReq & {
        user: AuthUser;
    }, body: AtualizarProvaDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titulo: string;
        status: import("../../../generated/prisma/enums.js").StatusProva;
        createdBy: string;
        edicaoId: string;
        fase: number;
        duracaoMinutos: number;
        publicadaEm: Date | null;
        janelaInicio: Date | null;
        janelaFim: Date | null;
        versao: number;
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
    publicar(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titulo: string;
        status: import("../../../generated/prisma/enums.js").StatusProva;
        createdBy: string;
        edicaoId: string;
        fase: number;
        duracaoMinutos: number;
        publicadaEm: Date | null;
        janelaInicio: Date | null;
        janelaFim: Date | null;
        versao: number;
    }>;
    duplicar(id: string, req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        edicao: {
            id: string;
            ano: number;
            titulo: string;
        };
        questoes: ({
            questao: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                enunciado: string;
                alternativaA: string;
                alternativaB: string;
                alternativaC: string;
                alternativaD: string;
                alternativaE: string;
                correta: string;
                eixo: import("../../../generated/prisma/enums.js").Eixo;
                dificuldade: import("../../../generated/prisma/enums.js").Dificuldade;
                createdBy: string | null;
            };
        } & {
            id: string;
            provaId: string;
            questaoId: string;
            ordem: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titulo: string;
        status: import("../../../generated/prisma/enums.js").StatusProva;
        createdBy: string;
        edicaoId: string;
        fase: number;
        duracaoMinutos: number;
        publicadaEm: Date | null;
        janelaInicio: Date | null;
        janelaFim: Date | null;
        versao: number;
    }>;
}
export {};

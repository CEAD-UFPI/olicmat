import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../auditoria/auditoria.service.js";
import type { CriarProvaDto, AtualizarProvaDto } from "./dto/provas.dto.js";
export declare class ProvasService {
    private prisma;
    private auditoria;
    constructor(prisma: PrismaService, auditoria: AuditoriaService);
    create(userId: string, data: CriarProvaDto): Promise<{
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
    update(id: string, data: AtualizarProvaDto, userId?: string): Promise<{
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
    delete(id: string, userId?: string): Promise<{
        deleted: boolean;
    }>;
    publicar(id: string, userId?: string): Promise<{
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
    duplicar(id: string, userId: string): Promise<{
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

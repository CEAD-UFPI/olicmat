import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../auditoria/auditoria.service.js";
import type { CriarQuestaoDto, VincularQuestaoDto, AtualizarQuestaoDto } from "./dto/questoes.dto.js";
export declare class QuestoesService {
    private prisma;
    private auditoria;
    constructor(prisma: PrismaService, auditoria: AuditoriaService);
    addToExam(provaId: string, data: CriarQuestaoDto, userId?: string): Promise<{
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
    }>;
    linkToExam(provaId: string, data: VincularQuestaoDto, userId?: string): Promise<{
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
    }>;
    findAll(filters?: {
        eixo?: string;
        dificuldade?: string;
    }): Promise<{
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
    }[]>;
    findExamQuestions(provaId: string): Promise<({
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
    })[]>;
    update(id: string, data: AtualizarQuestaoDto, userId?: string): Promise<{
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
    }>;
    remove(id: string, userId?: string): Promise<{
        deleted: boolean;
    }>;
}

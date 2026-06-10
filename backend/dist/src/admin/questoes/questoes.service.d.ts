import { PrismaService } from "../../prisma.service.js";
import type { CriarQuestaoDto, VincularQuestaoDto, AtualizarQuestaoDto } from "./dto/questoes.dto.js";
export declare class QuestoesService {
    private prisma;
    constructor(prisma: PrismaService);
    addToExam(provaId: string, data: CriarQuestaoDto): Promise<{
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
    linkToExam(provaId: string, data: VincularQuestaoDto): Promise<{
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
    update(id: string, data: AtualizarQuestaoDto): Promise<{
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
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}

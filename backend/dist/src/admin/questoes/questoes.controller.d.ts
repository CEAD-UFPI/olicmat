import { QuestoesService } from "./questoes.service.js";
import type { CriarQuestaoDto, VincularQuestaoDto, AtualizarQuestaoDto } from "./dto/questoes.dto.js";
export declare class QuestoesController {
    private readonly questoesService;
    constructor(questoesService: QuestoesService);
    addToExam(provaId: string, body: CriarQuestaoDto | VincularQuestaoDto): Promise<{
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
    findAll(eixo?: string, dificuldade?: string): Promise<{
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
    update(id: string, body: AtualizarQuestaoDto): Promise<{
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

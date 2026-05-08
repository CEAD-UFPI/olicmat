import { PrismaService } from "../../prisma.service.js";
import type { ResponderQuestaoDto } from "./dto/prova.dto.js";
export declare class ProvaService {
    private prisma;
    constructor(prisma: PrismaService);
    buscarQuestoes(userId: string, quantidade?: number): Promise<{
        inscricaoId: string;
        inicio: string;
        fim: string;
        questoes: {
            respondida: string | null;
            id: string;
            enunciado: string;
            alternativaA: string;
            alternativaB: string;
            alternativaC: string;
            alternativaD: string;
            alternativaE: string;
            eixo: import("../../../generated/prisma/enums.js").Eixo;
            dificuldade: import("../../../generated/prisma/enums.js").Dificuldade;
        }[];
    }>;
    responder(userId: string, data: ResponderQuestaoDto): Promise<{
        id: string;
        questaoId: string;
        alternativa: string;
        correta: boolean;
        inscricaoId: string;
        respondedAt: Date;
    }>;
    finalizarProva(userId: string): Promise<{
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
    resumoProva(userId: string): Promise<{
        inscricaoId: string;
        inicio: string | null;
        fim: string | null;
        fase1Nota: number | null;
        respondidas: number;
        corretas: number;
        total: number;
        percentual: number;
    }>;
}

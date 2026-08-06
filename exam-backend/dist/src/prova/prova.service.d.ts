import { PrismaService } from "../prisma.service.js";
import type { ResponderQuestaoDto } from "./dto/prova.dto.js";
export declare class ProvaService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    iniciarProva(userId: string): Promise<{
        message: string;
        inicio: any;
    }>;
    buscarQuestoes(userId: string): Promise<{
        inscricaoId: any;
        inicio: any;
        fim: string;
        questoes: any;
    }>;
    responder(userId: string, data: ResponderQuestaoDto): Promise<any>;
    finalizarProva(userId: string): Promise<any>;
    resumoProva(userId: string): Promise<{
        inscricaoId: any;
        inicio: any;
        fim: any;
        fase1Nota: any;
        respondidas: number;
        corretas: number;
        total: number;
        percentual: number;
    }>;
    obterMonitoramento(): Promise<{
        emAndamento: any;
        finalizadas: any;
        totalAtivos: any;
        mediaNotaFase1: number;
    }>;
}

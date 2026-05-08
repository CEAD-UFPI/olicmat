import { PrismaService } from "../../prisma.service.js";
export declare class RankingService {
    private prisma;
    constructor(prisma: PrismaService);
    rankingPorEstado(estado?: string): Promise<Record<"OURO" | "PRATA" | "BRONZE", {
        inscricaoId: string;
        nome: string;
        estado: string;
        fase1Nota: number;
        fase2Nota: number;
        notaFinal: number;
        dataNascimento: Date;
        medalha: import("../../../generated/prisma/enums.js").Medalha | null;
    }[]> | Record<string, Record<"OURO" | "PRATA" | "BRONZE", {
        inscricaoId: string;
        nome: string;
        estado: string;
        fase1Nota: number;
        fase2Nota: number;
        notaFinal: number;
        dataNascimento: Date;
        medalha: import("../../../generated/prisma/enums.js").Medalha | null;
    }[]>>>;
    atualizarMedalhas(): Promise<{
        atualizado: boolean;
    }>;
    private calcularNotaFinal;
}

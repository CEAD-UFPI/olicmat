import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../../admin/auditoria/auditoria.service.js";
export declare class RankingService {
    private prisma;
    private auditoria;
    constructor(prisma: PrismaService, auditoria: AuditoriaService);
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
    atualizarMedalhas(actorId?: string): Promise<{
        atualizado: boolean;
        total: number;
    }>;
}

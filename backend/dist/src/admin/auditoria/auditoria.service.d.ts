import { PrismaService } from "../../prisma.service.js";
export declare class AuditoriaService {
    private prisma;
    constructor(prisma: PrismaService);
    log(actorId: string, acao: string, entidade: string, entidadeId: string, payload?: Record<string, unknown>): Promise<{
        id: string;
        createdAt: Date;
        acao: string;
        entidade: string;
        entidadeId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
        actorId: string;
    }>;
    findAll(filters?: {
        entidade?: string;
        acao?: string;
        actorId?: string;
        dataInicio?: string;
        dataFim?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            actor: {
                id: string;
                nome: string;
                email: string;
                role: import("../../../generated/prisma/enums.js").Role;
            };
        } & {
            id: string;
            createdAt: Date;
            acao: string;
            entidade: string;
            entidadeId: string;
            payload: import("@prisma/client/runtime/client").JsonValue | null;
            actorId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    exportCsv(filters?: {
        entidade?: string;
        acao?: string;
        dataInicio?: string;
        dataFim?: string;
    }): Promise<string>;
}

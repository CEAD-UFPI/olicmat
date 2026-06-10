import type { Response } from "express";
import { AuditoriaService } from "./auditoria.service.js";
import { Role } from "../../../generated/prisma/client.js";
export declare class AuditoriaController {
    private readonly auditoriaService;
    constructor(auditoriaService: AuditoriaService);
    findAll(entidade?: string, acao?: string, actorId?: string, dataInicio?: string, dataFim?: string, page?: string, limit?: string): Promise<{
        data: ({
            actor: {
                id: string;
                nome: string;
                email: string;
                role: Role;
            };
        } & {
            id: string;
            createdAt: Date;
            entidade: string;
            acao: string;
            actorId: string;
            entidadeId: string;
            payload: import("@prisma/client/runtime/client").JsonValue | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    exportCsv(entidade?: string, acao?: string, dataInicio?: string, dataFim?: string, res?: Response): Promise<void>;
}

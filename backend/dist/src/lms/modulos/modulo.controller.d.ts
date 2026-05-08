import { ModuloService } from "./modulo.service.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class ModuloController {
    private readonly moduloService;
    constructor(moduloService: ModuloService);
    listar(): Promise<{
        id: string;
        ordem: number;
        titulo: string;
        descricao: string;
        cargaHoraria: number;
    }[]>;
    progresso(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        totalModulos: number;
        concluidos: number;
        percentual: number;
        cargaHorariaTotal: number;
        cargaHorariaConcluida: number;
    }>;
    buscar(id: string, req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        progresso: {
            concluido: boolean;
            nota: number | null;
        };
        progressos: undefined;
        id: string;
        ordem: number;
        titulo: string;
        descricao: string;
        cargaHoraria: number;
        conteudos: import("@prisma/client/runtime/client").JsonValue;
        questionario: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    concluir(id: string, req: ExpressReq & {
        user: AuthUser;
    }, body: {
        nota?: number;
    }): Promise<{
        id: string;
        userId: string;
        moduloId: string;
        concluido: boolean;
        nota: number | null;
    }>;
}
export {};

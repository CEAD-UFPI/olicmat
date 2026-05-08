import { PrismaService } from "../../prisma.service.js";
export declare class ModuloService {
    private prisma;
    constructor(prisma: PrismaService);
    listarTodos(): Promise<{
        id: string;
        ordem: number;
        titulo: string;
        descricao: string;
        cargaHoraria: number;
    }[]>;
    buscarPorId(id: string, userId: string): Promise<{
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
    concluirModulo(userId: string, moduloId: string, nota?: number): Promise<{
        id: string;
        userId: string;
        moduloId: string;
        concluido: boolean;
        nota: number | null;
    }>;
    progressoGeral(userId: string): Promise<{
        totalModulos: number;
        concluidos: number;
        percentual: number;
        cargaHorariaTotal: number;
        cargaHorariaConcluida: number;
    }>;
}

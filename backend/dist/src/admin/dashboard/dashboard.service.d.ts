import { PrismaService } from "../../prisma.service.js";
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getMetrics(): Promise<{
        totalInscricoes: number;
        porStatus: {
            status: string;
            count: number;
        }[];
        porEstado: {
            estado: string;
            count: number;
        }[];
        porInstituicao: {
            instituicaoId: string;
            nome: string;
            sigla: string;
            count: number;
        }[];
    }>;
    getResumo(): Promise<{
        totalUsuarios: number;
        totalInscricoes: number;
        pendentes: number;
    }>;
    exportInscricoes(filters?: {
        edicaoId?: string;
        estado?: string;
        status?: string;
    }): Promise<string>;
    exportUsuarios(): Promise<string>;
    exportProvas(): Promise<string>;
    exportResultados(): Promise<string>;
    listEdicoes(): Promise<{
        id: string;
        ano: number;
        titulo: string;
        status: string;
    }[]>;
    createEdicao(data: {
        ano: number;
        titulo: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ano: number;
        titulo: string;
        status: string;
        dataInicio: Date | null;
        dataFim: Date | null;
        pesoFase1: number;
        pesoFase2: number;
    }>;
    updateEdicao(id: string, data: {
        titulo?: string;
        status?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ano: number;
        titulo: string;
        status: string;
        dataInicio: Date | null;
        dataFim: Date | null;
        pesoFase1: number;
        pesoFase2: number;
    }>;
    deleteEdicao(id: string): Promise<{
        deleted: boolean;
    }>;
}

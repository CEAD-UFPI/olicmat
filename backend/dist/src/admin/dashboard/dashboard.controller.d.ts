import { DashboardService } from "./dashboard.service.js";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
    exportInscricoes(edicaoId?: string, estado?: string, status?: string): Promise<string>;
    exportUsuarios(): Promise<string>;
    exportProvas(): Promise<string>;
    exportResultados(): Promise<string>;
    listEdicoes(): Promise<{
        id: string;
        ano: number;
        titulo: string;
        status: string;
    }[]>;
}

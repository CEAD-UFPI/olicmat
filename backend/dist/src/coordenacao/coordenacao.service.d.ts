import { PrismaService } from "../prisma.service.js";
export declare class CoordenacaoService {
    private prisma;
    constructor(prisma: PrismaService);
    private getCoordenadorCursos;
    listAlunos(coordenadorId: string): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        } | null;
        curso: {
            id: string;
            nome: string;
        } | null;
        email: string;
        matricula: string;
    }[]>;
    listInscricoes(coordenadorId: string, filters?: {
        cursoId?: string;
        status?: string;
    }): Promise<({
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        };
        curso: {
            id: string;
            nome: string;
        };
        user: {
            id: string;
            nome: string;
            email: string;
            matricula: string;
        };
        edicao: {
            id: string;
            ano: number;
            titulo: string;
        };
    } & {
        id: string;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
        instituicaoId: string;
        cursoId: string;
        comprovanteUrl: string | null;
        userId: string;
        status: import("../../generated/prisma/enums.js").StatusInsc;
        edicaoId: string;
        municipio: string | null;
        periodo: number | null;
        fase1Nota: number | null;
        fase1Inicio: Date | null;
        fase1Fim: Date | null;
        fase2Tema: string | null;
        notaFinal: number | null;
        medalha: import("../../generated/prisma/enums.js").Medalha | null;
    })[]>;
    getMetricas(coordenadorId: string): Promise<{
        total: number;
        porStatus: {
            status: import("../../generated/prisma/enums.js").StatusInsc;
            count: number;
        }[];
        porCurso: {
            cursoId: string;
            nome: string;
            count: number;
        }[];
    }>;
}

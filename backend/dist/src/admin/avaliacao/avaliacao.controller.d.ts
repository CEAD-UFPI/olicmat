import { AvaliacaoService } from "./avaliacao.service.js";
import type { AvaliarEnvioDto } from "./dto/avaliacao.dto.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class AvaliacaoController {
    private readonly avaliacaoService;
    constructor(avaliacaoService: AvaliacaoService);
    listPending(): Promise<({
        inscricao: {
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
            status: import("../../../generated/prisma/enums.js").StatusInsc;
            edicaoId: string;
            municipio: string | null;
            periodo: number | null;
            fase1Nota: number | null;
            fase1Inicio: Date | null;
            fase1Fim: Date | null;
            fase2Tema: string | null;
            notaFinal: number | null;
            medalha: import("../../../generated/prisma/enums.js").Medalha | null;
        };
    } & {
        id: string;
        status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
        inscricaoId: string;
        tipo: string;
        arquivoUrl: string;
        videoLink: string | null;
        enviadoEm: Date;
    })[]>;
    assignGrade(envioId: string, body: AvaliarEnvioDto, req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        id: string;
        inscricaoId: string;
        avaliadorId: string;
        nota: number;
        parecer: string | null;
        avaliadoEm: Date;
    }>;
    listHistorico(page?: string, limit?: string, nome?: string): Promise<{
        data: ({
            inscricao: {
                instituicao: {
                    id: string;
                    sigla: string;
                    nome: string;
                };
                curso: {
                    id: string;
                    nome: string;
                };
                avaliacoes: ({
                    avaliador: {
                        id: string;
                        nome: string;
                    };
                } & {
                    id: string;
                    inscricaoId: string;
                    avaliadorId: string;
                    nota: number;
                    parecer: string | null;
                    avaliadoEm: Date;
                })[];
                user: {
                    id: string;
                    nome: string;
                    email: string;
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
                status: import("../../../generated/prisma/enums.js").StatusInsc;
                edicaoId: string;
                municipio: string | null;
                periodo: number | null;
                fase1Nota: number | null;
                fase1Inicio: Date | null;
                fase1Fim: Date | null;
                fase2Tema: string | null;
                notaFinal: number | null;
                medalha: import("../../../generated/prisma/enums.js").Medalha | null;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
            inscricaoId: string;
            tipo: string;
            arquivoUrl: string;
            videoLink: string | null;
            enviadoEm: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
export {};

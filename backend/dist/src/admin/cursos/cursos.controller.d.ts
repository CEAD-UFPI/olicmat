import { CursosService } from "./cursos.service.js";
export declare class CursosController {
    private readonly cursosService;
    constructor(cursosService: CursosService);
    findAll(instituicaoId?: string): Promise<({
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        };
        _count: {
            usuarios: number;
            inscricoes: number;
        };
    } & {
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        instituicaoId: string;
    })[]>;
    findById(id: string): Promise<{
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        };
        _count: {
            usuarios: number;
            inscricoes: number;
        };
    } & {
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        instituicaoId: string;
    }>;
    create(body: unknown): Promise<{
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        };
    } & {
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        instituicaoId: string;
    }>;
    update(id: string, body: unknown): Promise<{
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        };
    } & {
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        instituicaoId: string;
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}

import { InstituicoesService } from "./instituicoes.service.js";
export declare class InstituicoesController {
    private readonly instituicoesService;
    constructor(instituicoesService: InstituicoesService);
    findAll(): Promise<({
        cursos: {
            id: string;
            nome: string;
        }[];
    } & {
        id: string;
        sigla: string;
        codigoInep: string | null;
        nome: string;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string): Promise<{
        cursos: {
            id: string;
            nome: string;
        }[];
    } & {
        id: string;
        sigla: string;
        codigoInep: string | null;
        nome: string;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(body: unknown): Promise<{
        id: string;
        sigla: string;
        codigoInep: string | null;
        nome: string;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, body: unknown): Promise<{
        id: string;
        sigla: string;
        codigoInep: string | null;
        nome: string;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}

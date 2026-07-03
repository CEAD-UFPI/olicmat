import { PrismaService } from "../prisma.service.js";
export declare class InstituicoesService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(data: {
        nome: string;
        sigla: string;
        estado?: string;
        codigoInep?: string;
    }): Promise<{
        id: string;
        sigla: string;
        codigoInep: string | null;
        nome: string;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        nome?: string;
        sigla?: string;
        estado?: string;
        codigoInep?: string;
    }): Promise<{
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

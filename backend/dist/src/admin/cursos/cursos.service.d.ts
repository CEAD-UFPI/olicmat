import { PrismaService } from "../../prisma.service.js";
export declare class CursosService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(data: {
        nome: string;
        instituicaoId: string;
    }): Promise<{
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
    update(id: string, data: {
        nome?: string;
        instituicaoId?: string;
    }): Promise<{
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

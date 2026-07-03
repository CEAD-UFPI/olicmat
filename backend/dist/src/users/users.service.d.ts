import { PrismaService } from "../prisma.service.js";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        } | null;
        instituicaoId: string | null;
        curso: {
            id: string;
            nome: string;
        } | null;
        email: string;
        role: import("../../generated/prisma/enums.js").Role;
        cursoId: string | null;
        matricula: string;
        comprovanteUrl: string | null;
        emailConfirmado: boolean;
    }>;
    findAll(): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        instituicaoId: string | null;
        email: string;
        role: import("../../generated/prisma/enums.js").Role;
    }[]>;
}

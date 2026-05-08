import { PrismaService } from "../prisma.service.js";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        id: string;
        email: string;
        nome: string;
        instituicao: string;
        curso: string;
        matricula: string;
        role: import("../../generated/prisma/enums.js").Role;
        comprovanteUrl: string | null;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        nome: string;
        instituicao: string;
        role: import("../../generated/prisma/enums.js").Role;
        createdAt: Date;
    }[]>;
}

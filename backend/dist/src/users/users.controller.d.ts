import { Request } from "express";
import { UsersService } from "./users.service.js";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(req: Request & {
        user: {
            id: string;
            email: string;
            nome: string;
            role: string;
        };
    }): Promise<{
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
    }>;
}

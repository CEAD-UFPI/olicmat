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
        email: string;
        nome: string;
        instituicao: string;
        curso: string;
        matricula: string;
        role: import("../../generated/prisma/enums.js").Role;
        comprovanteUrl: string | null;
        createdAt: Date;
    }>;
}

import { AuthService } from "./auth.service.js";
import type { LoginDto, RegisterDto } from "./dto/login.dto.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<{
        user: {
            id: string;
            nome: string;
            createdAt: Date;
            email: string;
            role: import("../../generated/prisma/enums.js").Role;
            emailConfirmado: boolean;
        };
        accessToken: string;
    }>;
    login(body: LoginDto): Promise<{
        user: {
            id: string;
            nome: string;
            email: string;
            role: import("../../generated/prisma/enums.js").Role;
            emailConfirmado: boolean;
        };
        accessToken: string;
    }>;
    esqueciSenha(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    redefinirSenha(body: {
        token: string;
        novaSenha: string;
    }): Promise<{
        message: string;
    }>;
    confirmarEmail(body: {
        token: string;
    }): Promise<{
        message: string;
    }>;
    me(req: ExpressReq & {
        user: AuthUser;
    }): Promise<Express.User & AuthUser>;
}
export {};

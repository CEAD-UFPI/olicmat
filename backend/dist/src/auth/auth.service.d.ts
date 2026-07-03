import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service.js";
import { AuditoriaService } from "../admin/auditoria/auditoria.service.js";
import type { LoginDto, RegisterDto } from "./dto/login.dto.js";
export declare class AuthService {
    private prisma;
    private jwtService;
    private auditoria;
    constructor(prisma: PrismaService, jwtService: JwtService, auditoria: AuditoriaService);
    register(data: RegisterDto): Promise<{
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
    login(data: LoginDto): Promise<{
        user: {
            id: string;
            nome: string;
            email: string;
            role: import("../../generated/prisma/enums.js").Role;
            emailConfirmado: boolean;
        };
        accessToken: string;
    }>;
    esqueciSenha(email: string): Promise<{
        message: string;
    }>;
    redefinirSenha(token: string, novaSenha: string): Promise<{
        message: string;
    }>;
    confirmarEmail(token: string): Promise<{
        message: string;
    }>;
    private generateToken;
}

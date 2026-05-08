import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service.js";
import type { LoginDto, RegisterDto } from "./dto/login.dto.js";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            nome: string;
            role: import("../../generated/prisma/enums.js").Role;
            createdAt: Date;
        };
    }>;
    login(data: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            nome: string;
            email: string;
            role: import("../../generated/prisma/enums.js").Role;
        };
    }>;
    private generateToken;
}

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
            nome: string;
            createdAt: Date;
            email: string;
            role: import("../../generated/prisma/enums.js").Role;
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

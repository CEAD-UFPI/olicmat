import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service.js";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    claimTransitionToken(transitionToken: string): Promise<{
        user: any;
        accessToken: string;
    }>;
}

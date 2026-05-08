import { AuthService } from "./auth.service.js";
import type { LoginDto, RegisterDto } from "./dto/login.dto.js";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            nome: string;
            role: import("../../generated/prisma/enums.js").Role;
            createdAt: Date;
        };
    }>;
    login(body: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            nome: string;
            email: string;
            role: import("../../generated/prisma/enums.js").Role;
        };
    }>;
}

import { AuthService } from "./auth.service.js";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    claimToken(body: {
        token: string;
    }): Promise<{
        user: any;
        accessToken: string;
    }>;
}

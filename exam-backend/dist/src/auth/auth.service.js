var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service.js";
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async claimTransitionToken(transitionToken) {
        let payload;
        try {
            payload = this.jwtService.verify(transitionToken, {
                secret: process.env.JWT_SECRET || "dev_secret_change_in_production",
            });
        }
        catch {
            throw new UnauthorizedException("Token de transição inválido ou expirado");
        }
        if (payload.type !== "EXAM_TRANSITION") {
            throw new UnauthorizedException("Tipo de token inválido para o portal de prova");
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, role: true, nome: true },
        });
        if (!user) {
            throw new UnauthorizedException("Usuário não encontrado");
        }
        if (user.role === "ALUNO") {
            const inscricao = await this.prisma.inscricao.findFirst({
                where: { userId: user.id },
                orderBy: { createdAt: "desc" },
                select: { id: true, status: true },
            });
            if (!inscricao || inscricao.status !== "CONFIRMADA") {
                throw new BadRequestException("Inscrição não confirmada para a realização da prova");
            }
        }
        const examSessionToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
            nome: user.nome,
            scope: "EXAM_SESSION",
        }, { expiresIn: "4h" });
        return {
            user,
            accessToken: examSessionToken,
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map
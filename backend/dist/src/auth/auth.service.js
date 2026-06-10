var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, ConflictException, } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma.service.js";
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { cpf: data.cpf }],
            },
        });
        if (existing) {
            throw new ConflictException("Email ou CPF já cadastrado");
        }
        const senhaHash = await bcrypt.hash(data.senha, 10);
        const { senha, instituicao, curso, ...restData } = data;
        const user = await this.prisma.user.create({
            data: {
                ...restData,
                senhaHash,
                dataNascimento: new Date(restData.dataNascimento),
            },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        const token = this.generateToken(user.id, user.email, user.role);
        return { user, ...token };
    }
    async login(data) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new UnauthorizedException("Credenciais inválidas");
        }
        const senhaValida = await bcrypt.compare(data.senha, user.senhaHash);
        if (!senhaValida) {
            throw new UnauthorizedException("Credenciais inválidas");
        }
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
            },
            ...token,
        };
    }
    generateToken(userId, email, role) {
        const payload = { sub: userId, email, role };
        return {
            accessToken: this.jwtService.sign(payload),
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
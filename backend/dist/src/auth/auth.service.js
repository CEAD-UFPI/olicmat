var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, ConflictException, BadRequestException, } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { PrismaService } from "../prisma.service.js";
import { AuditoriaService } from "../admin/auditoria/auditoria.service.js";
let AuthService = class AuthService {
    prisma;
    jwtService;
    auditoria;
    constructor(prisma, jwtService, auditoria) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.auditoria = auditoria;
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
        const { senha, ...restData } = data;
        let instituicaoId;
        let cursoId;
        if (data.instituicao) {
            const inst = await this.prisma.instituicao.upsert({
                where: { sigla: data.instituicao.toUpperCase() },
                update: {},
                create: {
                    nome: data.instituicao,
                    sigla: data.instituicao.toUpperCase(),
                    estado: "PI",
                },
                select: { id: true },
            });
            instituicaoId = inst.id;
        }
        if (data.curso && instituicaoId) {
            const curso = await this.prisma.curso.upsert({
                where: {
                    nome_instituicaoId: { nome: data.curso, instituicaoId },
                },
                update: {},
                create: {
                    nome: data.curso,
                    instituicaoId,
                },
                select: { id: true },
            });
            cursoId = curso.id;
        }
        const user = await this.prisma.user.create({
            data: {
                nome: restData.nome,
                email: restData.email,
                cpf: restData.cpf,
                matricula: restData.matricula,
                dataNascimento: new Date(restData.dataNascimento),
                senhaHash,
                instituicaoId,
                cursoId,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                emailConfirmado: true,
                createdAt: true,
            },
        });
        const token = randomBytes(32).toString("hex");
        await this.prisma.token.create({
            data: {
                userId: user.id,
                tipo: "EMAIL_CONFIRM",
                token,
                expiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        console.log(`[EMAIL CONFIRM] ${user.nome} <${user.email}> -> ${process.env.FRONTEND_URL ?? "http://localhost:3000"}/confirmar-email?token=${token}`);
        const accessToken = this.generateToken(user.id, user.email, user.role);
        await this.auditoria.log(user.id, "REGISTRO", "User", user.id, { email: user.email });
        return { user, accessToken };
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
        const accessToken = this.generateToken(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                emailConfirmado: user.emailConfirmado,
            },
            accessToken,
        };
    }
    async esqueciSenha(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: "Se o email existir, um link de redefinição será enviado" };
        }
        const token = randomBytes(32).toString("hex");
        await this.prisma.token.create({
            data: {
                userId: user.id,
                tipo: "PASSWORD_RESET",
                token,
                expiraEm: new Date(Date.now() + 2 * 60 * 60 * 1000),
            },
        });
        console.log(`[PASSWORD RESET] ${user.nome} <${user.email}> -> ${process.env.FRONTEND_URL ?? "http://localhost:3000"}/redefinir-senha?token=${token}`);
        return { message: "Se o email existir, um link de redefinição será enviado" };
    }
    async redefinirSenha(token, novaSenha) {
        const record = await this.prisma.token.findUnique({ where: { token } });
        if (!record || record.tipo !== "PASSWORD_RESET" || record.usadoEm) {
            throw new BadRequestException("Token inválido ou já utilizado");
        }
        if (new Date() > record.expiraEm) {
            throw new BadRequestException("Token expirado. Solicite um novo link de recuperação");
        }
        const senhaHash = await bcrypt.hash(novaSenha, 10);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: record.userId },
                data: { senhaHash },
            }),
            this.prisma.token.update({
                where: { id: record.id },
                data: { usadoEm: new Date() },
            }),
        ]);
        return { message: "Senha redefinida com sucesso" };
    }
    async confirmarEmail(token) {
        const record = await this.prisma.token.findUnique({ where: { token } });
        if (!record || record.tipo !== "EMAIL_CONFIRM" || record.usadoEm) {
            throw new BadRequestException("Token inválido ou já utilizado");
        }
        if (new Date() > record.expiraEm) {
            throw new BadRequestException("Token expirado. Solicite um novo link de confirmação");
        }
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: record.userId },
                data: { emailConfirmado: true },
            }),
            this.prisma.token.update({
                where: { id: record.id },
                data: { usadoEm: new Date() },
            }),
        ]);
        return { message: "Email confirmado com sucesso" };
    }
    generateToken(userId, email, role) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload);
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService,
        AuditoriaService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, BadRequestException, } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma.service.js";
let AdminUsuariosService = class AdminUsuariosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                matricula: true,
                comprovanteUrl: true,
                createdAt: true,
                instituicao: { select: { nome: true, sigla: true } },
                curso: { select: { nome: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return users.map((u) => ({
            id: u.id,
            nome: u.nome,
            email: u.email,
            role: u.role,
            matricula: u.matricula,
            comprovanteUrl: u.comprovanteUrl,
            createdAt: u.createdAt,
            instituicao: u.instituicao?.sigla ?? u.instituicao?.nome ?? undefined,
            curso: u.curso?.nome ?? undefined,
        }));
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nome: true,
                email: true,
                cpf: true,
                role: true,
                matricula: true,
                dataNascimento: true,
                comprovanteUrl: true,
                createdAt: true,
                updatedAt: true,
                instituicao: { select: { id: true, nome: true, sigla: true } },
                curso: { select: { id: true, nome: true } },
                inscricao: {
                    select: { id: true, status: true, edicao: { select: { ano: true } } },
                },
            },
        });
        if (!user) {
            throw new NotFoundException("Usuário não encontrado");
        }
        return user;
    }
    async create(data) {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { cpf: data.cpf }],
            },
        });
        if (existing) {
            throw new ConflictException("Email ou CPF já cadastrado");
        }
        const senhaHash = await bcrypt.hash(data.senha, 10);
        const { senha, ...rest } = data;
        const user = await this.prisma.user.create({
            data: {
                nome: rest.nome,
                email: rest.email,
                cpf: rest.cpf,
                role: rest.role,
                matricula: rest.matricula ?? "",
                dataNascimento: new Date(rest.dataNascimento),
                senhaHash,
                instituicaoId: rest.instituicaoId ?? null,
                cursoId: rest.cursoId ?? null,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        return user;
    }
    async update(id, data) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException("Usuário não encontrado");
        }
        if (data.email) {
            const existing = await this.prisma.user.findFirst({
                where: { email: data.email, NOT: { id } },
            });
            if (existing) {
                throw new ConflictException("Email já está em uso por outro usuário");
            }
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                matricula: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async delete(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { inscricao: { select: { id: true } } },
        });
        if (!user) {
            throw new NotFoundException("Usuário não encontrado");
        }
        if (user.inscricao) {
            throw new BadRequestException("Não é possível excluir usuário com inscrições ativas. Remova as inscrições primeiro.");
        }
        await this.prisma.user.delete({ where: { id } });
        return { message: "Usuário excluído com sucesso" };
    }
};
AdminUsuariosService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AdminUsuariosService);
export { AdminUsuariosService };
//# sourceMappingURL=usuarios.service.js.map
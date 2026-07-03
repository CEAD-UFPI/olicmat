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
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../../admin/auditoria/auditoria.service.js";
const TEMAS_GERADORES = [
    "Funções no Cotidiano",
    "Geometria e Arte",
    "Probabilidade e Jogos",
    "Matemática Financeira",
    "Trigonometria Aplicada",
    "Modelagem Matemática",
    "Educação Matemática Inclusiva",
    "Tecnologias no Ensino de Matemática",
    "Resolução de Problemas",
    "História da Matemática em Sala de Aula",
];
let InscricaoService = class InscricaoService {
    prisma;
    auditoria;
    constructor(prisma, auditoria) {
        this.prisma = prisma;
        this.auditoria = auditoria;
    }
    async criar(userId, data) {
        let edicao = await this.prisma.edicao.findFirst({
            where: { status: "PLANEJAMENTO" },
            orderBy: { ano: "desc" },
        });
        if (!edicao) {
            edicao = await this.prisma.edicao.create({
                data: {
                    ano: new Date().getFullYear(),
                    titulo: `OLICMAT ${new Date().getFullYear()}`,
                    status: "PLANEJAMENTO",
                },
            });
        }
        const existente = await this.prisma.inscricao.findUnique({
            where: { userId_edicaoId: { userId, edicaoId: edicao.id } },
        });
        if (existente) {
            throw new ConflictException("Você já possui uma inscrição nesta edição");
        }
        let instituicaoId = data.instituicaoId;
        let cursoId = data.cursoId;
        if (!instituicaoId && data.instituicao) {
            const inst = await this.prisma.instituicao.upsert({
                where: { sigla: data.instituicao.toUpperCase() },
                update: {},
                create: {
                    nome: data.instituicao,
                    sigla: data.instituicao.toUpperCase(),
                    estado: data.estado.toUpperCase(),
                },
                select: { id: true },
            });
            instituicaoId = inst.id;
        }
        if (!cursoId && data.curso && instituicaoId) {
            const curso = await this.prisma.curso.upsert({
                where: {
                    nome_instituicaoId: { nome: data.curso, instituicaoId },
                },
                update: {},
                create: { nome: data.curso, instituicaoId },
                select: { id: true },
            });
            cursoId = curso.id;
        }
        return this.prisma.inscricao.create({
            data: {
                userId,
                edicaoId: edicao.id,
                estado: data.estado.toUpperCase(),
                municipio: data.municipio,
                instituicaoId: instituicaoId,
                cursoId: cursoId,
                periodo: data.periodo,
            },
        });
    }
    async buscarPorUsuario(userId) {
        const inscricao = await this.prisma.inscricao.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
            },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        return inscricao;
    }
    async confirmar(inscricaoId, actorId) {
        const result = await this.prisma.inscricao.update({
            where: { id: inscricaoId },
            data: { status: "CONFIRMADA" },
        });
        await this.auditoria.log(actorId, "CONFIRMAR_INSCRICAO", "Inscricao", inscricaoId);
        return result;
    }
    async iniciarProva(inscricaoId) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { id: inscricaoId },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        if (inscricao.status !== "CONFIRMADA") {
            throw new BadRequestException("Inscrição precisa estar confirmada para iniciar a prova");
        }
        if (inscricao.fase1Inicio) {
            throw new BadRequestException("Prova já foi iniciada");
        }
        return this.prisma.inscricao.update({
            where: { id: inscricaoId },
            data: { fase1Inicio: new Date() },
        });
    }
    async sortearTema(inscricaoId) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { id: inscricaoId },
        });
        if (!inscricao || inscricao.status !== "CONFIRMADA") {
            throw new BadRequestException("Inscrição não está apta para a Fase 2");
        }
        if (!inscricao.fase1Nota || inscricao.fase1Nota < 60) {
            throw new BadRequestException("Nota mínima da Fase 1 não atingida");
        }
        if (inscricao.fase2Tema) {
            throw new BadRequestException("Tema já foi sorteado");
        }
        const tema = TEMAS_GERADORES[Math.floor(Math.random() * TEMAS_GERADORES.length)];
        return this.prisma.inscricao.update({
            where: { id: inscricaoId },
            data: { fase2Tema: tema },
        });
    }
    async listarTodas(userRole, userId, cursoId, status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        if (userRole === "ALUNO" && userId) {
            where.userId = userId;
        }
        else if (userRole === "COORDENADOR_CURSO" && cursoId) {
            where.cursoId = cursoId;
        }
        return this.prisma.inscricao.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        instituicao: { select: { id: true, nome: true, sigla: true } },
                    },
                },
                instituicao: { select: { id: true, nome: true, sigla: true } },
                curso: { select: { id: true, nome: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async atualizarStatus(inscricaoId, status, actorId) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { id: inscricaoId },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        const result = await this.prisma.inscricao.update({
            where: { id: inscricaoId },
            data: { status: status },
        });
        await this.auditoria.log(actorId, "ATUALIZAR_STATUS_INSCRICAO", "Inscricao", inscricaoId, { status });
        return result;
    }
    async editar(inscricaoId, data) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { id: inscricaoId },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        return this.prisma.inscricao.update({
            where: { id: inscricaoId },
            data,
        });
    }
    async deletar(inscricaoId, actorId) {
        const inscricao = await this.prisma.inscricao.findUnique({
            where: { id: inscricaoId },
        });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada");
        }
        await this.prisma.resposta.deleteMany({ where: { inscricaoId } });
        await this.prisma.envioFase2.deleteMany({ where: { inscricaoId } });
        await this.prisma.avaliacaoFase2.deleteMany({ where: { inscricaoId } });
        await this.auditoria.log(actorId, "DELETAR_INSCRICAO", "Inscricao", inscricaoId);
        return this.prisma.inscricao.delete({ where: { id: inscricaoId } });
    }
};
InscricaoService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AuditoriaService])
], InscricaoService);
export { InscricaoService };
//# sourceMappingURL=inscricao.service.js.map
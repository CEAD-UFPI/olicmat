var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service.js";
let RankingService = class RankingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async rankingPorEstado(estado) {
        const edicao = await this.prisma.edicao.findFirst({
            orderBy: { ano: "desc" },
        });
        const whereClause = {
            status: "CONFIRMADA",
            fase1Nota: { not: null },
        };
        if (edicao) {
            whereClause.edicaoId = edicao.id;
        }
        if (estado) {
            whereClause.estado = estado.toUpperCase();
        }
        const inscricoes = await this.prisma.inscricao.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        dataNascimento: true,
                    },
                },
                avaliacoes: {
                    select: { nota: true },
                },
            },
        });
        const pesoFase1 = edicao?.pesoFase1 ?? 0.5;
        const pesoFase2 = edicao?.pesoFase2 ?? 0.5;
        const ordenado = inscricoes
            .map((i) => {
            const fase1Nota = i.fase1Nota || 0;
            const fase2Nota = i.avaliacoes.length > 0
                ? i.avaliacoes.reduce((sum, a) => sum + a.nota, 0) / i.avaliacoes.length
                : 0;
            const notaFinal = i.notaFinal || fase1Nota * pesoFase1 + fase2Nota * pesoFase2;
            return {
                inscricaoId: i.id,
                nome: i.user.nome,
                estado: i.estado,
                fase1Nota,
                fase2Nota,
                notaFinal,
                dataNascimento: i.user.dataNascimento,
                medalha: i.medalha,
            };
        })
            .sort((a, b) => {
            if (b.notaFinal !== a.notaFinal)
                return b.notaFinal - a.notaFinal;
            if (b.fase2Nota !== a.fase2Nota)
                return b.fase2Nota - a.fase2Nota;
            if (b.fase1Nota !== a.fase1Nota)
                return b.fase1Nota - a.fase1Nota;
            return a.dataNascimento.getTime() - b.dataNascimento.getTime();
        });
        const porEstado = new Map();
        for (const item of ordenado) {
            const items = porEstado.get(item.estado) || [];
            items.push(item);
            porEstado.set(item.estado, items);
        }
        const resultado = {};
        for (const [uf, items] of porEstado) {
            const total = items.length;
            const ouro = items.slice(0, Math.max(1, Math.floor(total * 0.05)));
            const prata = items.slice(ouro.length, ouro.length + Math.max(1, Math.floor(total * 0.10)));
            const bronze = items.slice(ouro.length + prata.length, ouro.length + prata.length + Math.max(1, Math.floor(total * 0.15)));
            resultado[uf] = { OURO: ouro, PRATA: prata, BRONZE: bronze };
        }
        return estado ? resultado[estado.toUpperCase()] || { OURO: [], PRATA: [], BRONZE: [] } : resultado;
    }
    async atualizarMedalhas() {
        const ranking = await this.rankingPorEstado();
        for (const medalhas of Object.values(ranking)) {
            for (const [medalha, items] of Object.entries(medalhas)) {
                for (const item of items) {
                    await this.prisma.inscricao.update({
                        where: { id: item.inscricaoId },
                        data: {
                            medalha: medalha,
                            notaFinal: item.notaFinal,
                        },
                    });
                }
            }
        }
        return { atualizado: true };
    }
};
RankingService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], RankingService);
export { RankingService };
//# sourceMappingURL=ranking.service.js.map
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { AuditoriaService } from "../admin/auditoria/auditoria.service.js";
import { CRITERIOS, ESCALA, ESCALA_MAX, conceitoValido, consolidarNotas, escolherTerceiro, pontosDoConceito, totalCriterios } from "./fase2.regras.js";
import { Fase2ArmazenamentoService } from "./fase2-armazenamento.service.js";
import { formatarEnvio } from "./fase2-participante.service.js";

type Notas = Partial<Record<string, unknown>>;

/** Ficha de avaliação por critérios, vista pelo avaliador. */
@Injectable()
export class Fase2AvaliadorService {
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
    private armazenamento: Fase2ArmazenamentoService,
  ) {}

  private async minhaAtribuicao(atribuicaoId: string, avaliadorId: string) {
    const a = await this.prisma.atribuicaoFase2.findUnique({
      where: { id: atribuicaoId },
      include: {
        inscricao: {
          select: {
            id: true,
            numero: true,
            user: { select: { nome: true } },
            instituicao: { select: { sigla: true } },
            curso: { select: { nome: true } },
            edicao: { select: { fase2Tema: true } },
            enviosFase2: {
              orderBy: { enviadoEm: "desc" },
              take: 1,
              select: {
                videoLink: true, portfolioLink: true, enviadoEm: true,
                videoKey: true, videoNome: true, videoBytes: true,
                portfolioKey: true, portfolioNome: true, portfolioBytes: true,
              },
            },
          },
        },
      },
    });
    if (!a || a.avaliadorId !== avaliadorId || a.status === "REMANEJADA") {
      throw new NotFoundException("Avaliação não encontrada");
    }
    return a;
  }

  private formatar(
    a: Awaited<ReturnType<Fase2AvaliadorService["minhaAtribuicao"]>>,
    av: { nota: number; parecer: string | null; concluida: boolean; [k: string]: unknown } | null,
  ) {
    const envio = formatarEnvio(a.inscricao.enviosFase2[0], this.armazenamento);
    return {
      id: a.id,
      status: a.status,
      atribuidoEm: a.atribuidoEm.toISOString(),
      concluidoEm: a.concluidoEm?.toISOString() ?? null,
      participante: {
        numero: a.inscricao.numero,
        nome: a.inscricao.user.nome,
        instituicao: a.inscricao.instituicao.sigla,
        curso: a.inscricao.curso.nome,
      },
      tema: a.inscricao.edicao.fase2Tema,
      videoLink: envio?.videoLink ?? null,
      portfolioLink: envio?.portfolioLink ?? null,
      video: envio?.video ?? null,
      portfolio: envio?.portfolio ?? null,
      enviadoEm: envio?.enviadoEm ?? null,
      avaliacao: av
        ? {
            nota: av.nota,
            parecer: av.parecer,
            concluida: av.concluida,
            notas: Object.fromEntries(CRITERIOS.map((c) => [c.chave, (av[c.chave] as number | null) ?? null])),
          }
        : null,
    };
  }

  async listar(avaliadorId: string) {
    const lista = await this.prisma.atribuicaoFase2.findMany({
      where: { avaliadorId, status: { not: "REMANEJADA" } },
      orderBy: [{ status: "asc" }, { atribuidoEm: "asc" }],
      select: { id: true },
    });
    const saida = [];
    for (const { id } of lista) saida.push(await this.ficha(id, avaliadorId));
    return { criterios: CRITERIOS, escala: ESCALA, escalaMax: ESCALA_MAX, atribuicoes: saida };
  }

  async ficha(atribuicaoId: string, avaliadorId: string) {
    const a = await this.minhaAtribuicao(atribuicaoId, avaliadorId);
    const av = await this.prisma.avaliacaoFase2.findUnique({
      where: { inscricaoId_avaliadorId: { inscricaoId: a.inscricaoId, avaliadorId } },
    });
    return this.formatar(a, av);
  }

  /** Rascunho: aceita critérios em branco, mas não conceitos fora de 0 a 5. */
  async salvarRascunho(atribuicaoId: string, avaliadorId: string, notas: Notas, parecer?: string) {
    const a = await this.minhaAtribuicao(atribuicaoId, avaliadorId);
    if (a.status === "CONCLUIDA") throw new BadRequestException("Avaliação já concluída.");
    const dados: Record<string, number | null> = {};
    let soma = 0;
    for (const c of CRITERIOS) {
      const v = notas[c.chave];
      if (v == null || v === "") {
        dados[c.chave] = null;
        continue;
      }
      if (!conceitoValido(v)) {
        throw new BadRequestException(`${c.nome}: o conceito deve ser um número inteiro de 0 a ${ESCALA_MAX}`);
      }
      dados[c.chave] = v;
      soma += pontosDoConceito(v);
    }
    const texto = parecer?.slice(0, 5000) ?? null;
    await this.prisma.avaliacaoFase2.upsert({
      where: { inscricaoId_avaliadorId: { inscricaoId: a.inscricaoId, avaliadorId } },
      create: { inscricaoId: a.inscricaoId, avaliadorId, nota: soma, parecer: texto, concluida: false, ...dados },
      update: { nota: soma, parecer: texto, ...dados },
    });
    return this.ficha(atribuicaoId, avaliadorId);
  }

  async concluir(atribuicaoId: string, avaliadorId: string, notas: Notas, parecer?: string) {
    const a = await this.minhaAtribuicao(atribuicaoId, avaliadorId);
    if (a.status === "CONCLUIDA") throw new BadRequestException("Avaliação já concluída.");
    if (!a.inscricao.enviosFase2.length) throw new ForbiddenException("Participante sem envio.");
    const r = totalCriterios(notas);
    if (!r.ok) throw new BadRequestException(r.erros);
    const texto = parecer?.trim().slice(0, 5000) || null;
    const agora = new Date();

    const resultado = await this.prisma.$transaction(async (tx) => {
      // Serializa as conclusões do mesmo participante: duas conclusões
      // simultâneas não podem criar dois 3ºs avaliadores.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${a.inscricaoId}))`;

      const atual = await tx.atribuicaoFase2.findUnique({ where: { id: a.id } });
      if (atual?.status !== "PENDENTE") throw new BadRequestException("Avaliação já concluída.");

      await tx.avaliacaoFase2.upsert({
        where: { inscricaoId_avaliadorId: { inscricaoId: a.inscricaoId, avaliadorId } },
        create: { inscricaoId: a.inscricaoId, avaliadorId, nota: r.total, parecer: texto, concluida: true, avaliadoEm: agora, ...r.notas },
        update: { nota: r.total, parecer: texto, concluida: true, avaliadoEm: agora, ...r.notas },
      });
      await tx.atribuicaoFase2.update({ where: { id: a.id }, data: { status: "CONCLUIDA", concluidoEm: agora } });

      const ativas = await tx.atribuicaoFase2.findMany({
        where: { inscricaoId: a.inscricaoId, status: "CONCLUIDA" },
        select: { avaliadorId: true },
      });
      const concluidas = await tx.avaliacaoFase2.findMany({
        where: { inscricaoId: a.inscricaoId, concluida: true, avaliadorId: { in: ativas.map((x) => x.avaliadorId) } },
        orderBy: { avaliadoEm: "asc" },
        select: { nota: true },
      });
      const consolidado = consolidarNotas(concluidas.map((c) => c.nota));

      if (consolidado.situacao === "FINAL") {
        await tx.inscricao.update({ where: { id: a.inscricaoId }, data: { fase2Nota: consolidado.nota } });
        return { consolidado, terceiro: null as string | null };
      }
      if (consolidado.situacao === "PRECISA_TERCEIRO") {
        const jaTem = await tx.atribuicaoFase2.findFirst({
          where: { inscricaoId: a.inscricaoId, ordem: 3, status: { not: "REMANEJADA" } },
        });
        if (jaTem) return { consolidado, terceiro: null };
        // Candidatos: avaliadores que participam da distribuição desta edição.
        const edicaoId = (await tx.inscricao.findUnique({ where: { id: a.inscricaoId }, select: { edicaoId: true } }))!.edicaoId;
        const cargas = await tx.atribuicaoFase2.groupBy({
          by: ["avaliadorId", "status"],
          where: { inscricao: { edicaoId }, status: { not: "REMANEJADA" } },
          _count: { _all: true },
        });
        const mapa = new Map<string, { avaliadorId: string; pendentes: number; total: number }>();
        for (const c of cargas) {
          const m = mapa.get(c.avaliadorId) ?? { avaliadorId: c.avaliadorId, pendentes: 0, total: 0 };
          m.total += c._count._all;
          if (c.status === "PENDENTE") m.pendentes += c._count._all;
          mapa.set(c.avaliadorId, m);
        }
        const todosDoParticipante = await tx.atribuicaoFase2.findMany({
          where: { inscricaoId: a.inscricaoId },
          select: { avaliadorId: true },
        });
        const escolhido = escolherTerceiro([...mapa.values()], todosDoParticipante.map((x) => x.avaliadorId));
        if (!escolhido) return { consolidado, terceiro: null };
        await tx.atribuicaoFase2.create({
          data: { inscricaoId: a.inscricaoId, avaliadorId: escolhido, ordem: 3 },
        });
        return { consolidado, terceiro: escolhido };
      }
      return { consolidado, terceiro: null };
    });

    await this.auditoria.log(avaliadorId, "AVALIAR_FASE2", "AtribuicaoFase2", a.id, {
      inscricaoId: a.inscricaoId,
      total: r.total,
      ...r.notas,
      resultado: resultado.consolidado.situacao,
      ...(resultado.terceiro ? { terceiroAvaliador: resultado.terceiro } : {}),
    });
    return this.ficha(atribuicaoId, avaliadorId);
  }
}

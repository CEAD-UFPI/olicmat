import { Controller, Get, Injectable, Req, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";
import { situacaoEnvio } from "./fase2.regras.js";
import { edicaoAtual } from "./fase2.edicao.js";
import { Fase2VideosService, MAX_TENTATIVAS, type VideoInfo } from "./fase2-videos.service.js";

export type SituacaoVideo = "PENDENTE" | "PREPARANDO" | "PRONTO" | "FALHA";

/** Situação do vídeo para acompanhamento (sem expor o arquivo). */
export function situacaoVideo(videoKey: string | null | undefined, videoLink: string | null | undefined, info?: VideoInfo): SituacaoVideo {
  if (!videoKey) return videoLink ? "PRONTO" : "PENDENTE";
  if (!info) return "PREPARANDO";
  if (info.status === "PRONTO") return "PRONTO";
  if (info.status === "FALHA" && info.tentativas >= MAX_TENTATIVAS) return "FALHA";
  return "PREPARANDO";
}

/**
 * Coordenador de curso: acompanha o envio da Fase 2 dos classificados da(s)
 * instituição(ões) dele. Só a situação do envio — os arquivos ficam restritos
 * à banca e à Comissão.
 */
@Injectable()
export class Fase2CoordenacaoService {
  constructor(private prisma: PrismaService, private videos: Fase2VideosService) {}

  /** Instituições do coordenador: as dos cursos que ele coordena e a do próprio cadastro. */
  async instituicoesDo(userId: string): Promise<string[]> {
    const [user, cursos] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: { instituicaoId: true } }),
      this.prisma.coordenadorCurso.findMany({ where: { userId }, select: { curso: { select: { instituicaoId: true } } } }),
    ]);
    const ids = new Set(cursos.map((c) => c.curso.instituicaoId));
    if (user?.instituicaoId) ids.add(user.instituicaoId);
    return [...ids];
  }

  async painel(userId: string, agora = new Date()) {
    const edicao = await edicaoAtual(this.prisma);
    const instituicaoIds = await this.instituicoesDo(userId);
    const instituicoes = await this.prisma.instituicao.findMany({
      where: { id: { in: instituicaoIds } },
      select: { nome: true, sigla: true },
      orderBy: { sigla: "asc" },
    });
    if (!edicao || !instituicaoIds.length) {
      return { instituicoes, situacao: "NAO_INICIADA" as const, tema: null, inicioEm: null, prazoEm: null, agora: agora.toISOString(), totais: null, participantes: [] };
    }

    const inscricoes = await this.prisma.inscricao.findMany({
      where: { edicaoId: edicao.id, fase2Classificado: true, instituicaoId: { in: instituicaoIds } },
      select: {
        numero: true,
        user: { select: { nome: true, nomeSocial: true, email: true } },
        instituicao: { select: { sigla: true } },
        curso: { select: { nome: true } },
        enviosFase2: {
          orderBy: { enviadoEm: "desc" },
          take: 1,
          select: { enviadoEm: true, videoKey: true, videoLink: true, portfolioKey: true, portfolioLink: true },
        },
      },
      orderBy: { user: { nome: "asc" } },
    });
    const mapa = await this.videos.mapaPorChaves(inscricoes.map((i) => i.enviosFase2[0]?.videoKey));

    const participantes = inscricoes.map((i) => {
      const e = i.enviosFase2[0];
      const video = situacaoVideo(e?.videoKey, e?.videoLink, e?.videoKey ? mapa.get(e.videoKey) : undefined);
      const portfolio = !!(e?.portfolioKey || e?.portfolioLink);
      const videoEnviado = video !== "PENDENTE" && video !== "FALHA";
      return {
        numero: i.numero,
        nome: i.user.nomeSocial || i.user.nome,
        email: i.user.email,
        instituicao: i.instituicao.sigla,
        curso: i.curso.nome,
        video,
        portfolio,
        completo: videoEnviado && portfolio,
        ultimoEnvioEm: e?.enviadoEm.toISOString() ?? null,
      };
    });

    return {
      instituicoes,
      situacao: situacaoEnvio(edicao.fase2InicioEm, edicao.fase2PrazoEm, agora),
      tema: edicao.fase2InicioEm ? edicao.fase2Tema : null,
      inicioEm: edicao.fase2InicioEm?.toISOString() ?? null,
      prazoEm: edicao.fase2PrazoEm?.toISOString() ?? null,
      agora: agora.toISOString(),
      totais: {
        classificados: participantes.length,
        completos: participantes.filter((p) => p.completo).length,
        soVideo: participantes.filter((p) => p.video !== "PENDENTE" && p.video !== "FALHA" && !p.portfolio).length,
        soPortfolio: participantes.filter((p) => p.portfolio && (p.video === "PENDENTE" || p.video === "FALHA")).length,
        // Vídeo ilegível conta como não enviado: o participante precisa reenviar.
        semEnvio: participantes.filter((p) => !p.portfolio && (p.video === "PENDENTE" || p.video === "FALHA")).length,
        videoComFalha: participantes.filter((p) => p.video === "FALHA").length,
      },
      participantes,
    };
  }
}

@Controller("coordenacao/fase2")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COORDENADOR_CURSO)
export class Fase2CoordenacaoController {
  constructor(private readonly service: Fase2CoordenacaoService) {}

  @Get()
  painel(@Req() req: { user: { id: string } }) {
    return this.service.painel(req.user.id);
  }
}

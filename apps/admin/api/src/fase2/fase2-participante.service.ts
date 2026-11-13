import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { linkValido, situacaoEnvio } from "./fase2.regras.js";
import { edicaoAtual } from "./fase2.edicao.js";

/** Envio dos links da Fase 2 pelo participante classificado. */
@Injectable()
export class Fase2ParticipanteService {
  constructor(private prisma: PrismaService) {}

  private async inscricaoClassificada(userId: string) {
    const edicao = await edicaoAtual(this.prisma);
    if (!edicao) return { edicao: null, inscricao: null };
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId, edicaoId: edicao.id, fase2Classificado: true },
      select: { id: true },
    });
    return { edicao, inscricao };
  }

  async status(userId: string, agora = new Date()) {
    const { edicao, inscricao } = await this.inscricaoClassificada(userId);
    if (!edicao || !inscricao) {
      return { classificado: false, agora: agora.toISOString() };
    }
    const situacao = situacaoEnvio(edicao.fase2InicioEm, edicao.fase2PrazoEm, agora);
    const envios = await this.prisma.envioFase2.findMany({
      where: { inscricaoId: inscricao.id, tipo: "links" },
      orderBy: { enviadoEm: "desc" },
      select: { videoLink: true, portfolioLink: true, enviadoEm: true },
    });
    return {
      classificado: true,
      agora: agora.toISOString(),
      situacao,
      tema: situacao === "NAO_INICIADA" ? null : edicao.fase2Tema,
      inicioEm: edicao.fase2InicioEm?.toISOString() ?? null,
      prazoEm: edicao.fase2PrazoEm?.toISOString() ?? null,
      ultimoEnvio: envios[0]
        ? { ...envios[0], enviadoEm: envios[0].enviadoEm.toISOString() }
        : null,
      totalEnvios: envios.length,
    };
  }

  async enviar(userId: string, videoLink: string, portfolioLink: string, agora = new Date()) {
    const { edicao, inscricao } = await this.inscricaoClassificada(userId);
    if (!edicao || !inscricao) {
      throw new ForbiddenException("Você não está na relação de classificados para a Fase 2.");
    }
    const situacao = situacaoEnvio(edicao.fase2InicioEm, edicao.fase2PrazoEm, agora);
    if (situacao === "NAO_INICIADA") {
      throw new BadRequestException("A Fase 2 ainda não foi iniciada.");
    }
    if (situacao === "ENCERRADA") {
      throw new BadRequestException("O prazo de envio da Fase 2 foi encerrado.");
    }
    const video = videoLink.trim();
    const portfolio = portfolioLink.trim();
    const erros: string[] = [];
    if (!linkValido(video)) erros.push("Link da videoaula inválido: use um endereço completo, começando com https://");
    if (!linkValido(portfolio)) erros.push("Link do portfólio inválido: use um endereço completo, começando com https://");
    if (erros.length) throw new BadRequestException(erros);

    const envio = await this.prisma.envioFase2.create({
      data: {
        inscricaoId: inscricao.id,
        tipo: "links",
        videoLink: video,
        portfolioLink: portfolio,
        status: "ENVIADO",
        enviadoEm: agora,
      },
      select: { videoLink: true, portfolioLink: true, enviadoEm: true },
    });
    return { ...envio, enviadoEm: envio.enviadoEm.toISOString() };
  }
}

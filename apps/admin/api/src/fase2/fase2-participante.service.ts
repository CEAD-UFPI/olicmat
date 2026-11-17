import { randomUUID } from "node:crypto";
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import {
  extensao,
  FORMATOS,
  limitesMb,
  linkValido,
  planoDePartes,
  prefixoArquivos,
  situacaoEnvio,
  validarArquivo,
  type TipoArquivo,
} from "./fase2.regras.js";
import { edicaoAtual } from "./fase2.edicao.js";
import { Fase2ArmazenamentoService } from "./fase2-armazenamento.service.js";

const camposEnvio = {
  videoLink: true,
  portfolioLink: true,
  videoKey: true,
  videoNome: true,
  videoBytes: true,
  portfolioKey: true,
  portfolioNome: true,
  portfolioBytes: true,
  enviadoEm: true,
} as const;

type EnvioBruto = {
  videoLink: string | null;
  portfolioLink: string | null;
  videoKey: string | null;
  videoNome: string | null;
  videoBytes: bigint | null;
  portfolioKey: string | null;
  portfolioNome: string | null;
  portfolioBytes: bigint | null;
  enviadoEm: Date;
};

/**
 * Converte o último envio para o formato da API. Os arquivos ganham uma URL
 * temporária de leitura (vale para participante, avaliador e gestão).
 */
export function formatarEnvio(e: EnvioBruto | null | undefined, armazenamento: Fase2ArmazenamentoService) {
  if (!e) return null;
  const arquivo = (chave: string | null, nome: string | null, bytes: bigint | null) =>
    chave && nome
      ? { nome, bytes: bytes == null ? null : Number(bytes), url: armazenamento.urlLeitura(chave, nome) }
      : null;
  return {
    enviadoEm: e.enviadoEm.toISOString(),
    videoLink: e.videoLink,
    portfolioLink: e.portfolioLink,
    video: arquivo(e.videoKey, e.videoNome, e.videoBytes),
    portfolio: arquivo(e.portfolioKey, e.portfolioNome, e.portfolioBytes),
  };
}

/** Envio da Fase 2 pelo participante classificado (upload ou links). */
@Injectable()
export class Fase2ParticipanteService {
  constructor(
    private prisma: PrismaService,
    private armazenamento: Fase2ArmazenamentoService,
  ) {}

  private async inscricaoClassificada(userId: string) {
    const edicao = await edicaoAtual(this.prisma);
    if (!edicao) return { edicao: null, inscricao: null };
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId, edicaoId: edicao.id, fase2Classificado: true },
      select: { id: true },
    });
    return { edicao, inscricao };
  }

  /** Classificado, com a Fase 2 aberta agora; senão, erro explicativo. */
  private async exigirAberta(userId: string, agora: Date) {
    const { edicao, inscricao } = await this.inscricaoClassificada(userId);
    if (!edicao || !inscricao) {
      throw new ForbiddenException("Você não está na relação de classificados para a Fase 2.");
    }
    const situacao = situacaoEnvio(edicao.fase2InicioEm, edicao.fase2PrazoEm, agora);
    if (situacao === "NAO_INICIADA") throw new BadRequestException("A Fase 2 ainda não foi iniciada.");
    if (situacao === "ENCERRADA") throw new BadRequestException("O prazo de envio da Fase 2 foi encerrado.");
    return { edicao, inscricao };
  }

  private ultimoEnvio(inscricaoId: string) {
    return this.prisma.envioFase2.findFirst({
      where: { inscricaoId },
      orderBy: { enviadoEm: "desc" },
      select: camposEnvio,
    });
  }

  async status(userId: string, agora = new Date()) {
    const { edicao, inscricao } = await this.inscricaoClassificada(userId);
    if (!edicao || !inscricao) {
      return { classificado: false, agora: agora.toISOString() };
    }
    const situacao = situacaoEnvio(edicao.fase2InicioEm, edicao.fase2PrazoEm, agora);
    const [ultimo, totalEnvios] = await Promise.all([
      this.ultimoEnvio(inscricao.id),
      this.prisma.envioFase2.count({ where: { inscricaoId: inscricao.id } }),
    ]);
    return {
      classificado: true,
      agora: agora.toISOString(),
      situacao,
      modo: this.armazenamento.disponivel ? ("upload" as const) : ("links" as const),
      limitesMb: limitesMb(),
      formatos: FORMATOS,
      tema: situacao === "NAO_INICIADA" ? null : edicao.fase2Tema,
      inicioEm: edicao.fase2InicioEm?.toISOString() ?? null,
      prazoEm: edicao.fase2PrazoEm?.toISOString() ?? null,
      ultimoEnvio: formatarEnvio(ultimo, this.armazenamento),
      totalEnvios,
    };
  }

  /** Modo alternativo (sem nuvem configurada): envio de dois links. */
  async enviar(userId: string, videoLink: string, portfolioLink: string, agora = new Date()) {
    const { inscricao } = await this.exigirAberta(userId, agora);
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
      select: camposEnvio,
    });
    return formatarEnvio(envio, this.armazenamento);
  }

  /* ----------------------------- Upload (S3) ----------------------------- */

  private exigirArmazenamento() {
    if (!this.armazenamento.disponivel) {
      throw new BadRequestException("O envio de arquivos não está habilitado. Use o envio por links.");
    }
  }

  /** 1º passo: valida o arquivo e devolve a chave e a URL para criar o upload. */
  async iniciarUpload(userId: string, tipo: TipoArquivo, nome: string, bytes: number, agora = new Date()) {
    this.exigirArmazenamento();
    const { edicao, inscricao } = await this.exigirAberta(userId, agora);
    const erro = validarArquivo(tipo, nome, bytes);
    if (erro) throw new BadRequestException(erro);
    const chave = `${prefixoArquivos(edicao.id, inscricao.id)}${tipo}-${agora.getTime()}-${randomUUID().slice(0, 8)}.${extensao(nome)}`;
    return {
      chave,
      urlCriar: this.armazenamento.urlCriarUpload(chave),
      ...planoDePartes(bytes),
    };
  }

  /** 2º passo: URLs assinadas para as partes (em lotes) e para concluir. */
  async urlsDasPartes(userId: string, chave: string, uploadId: string, partes: number[], agora = new Date()) {
    this.exigirArmazenamento();
    const { edicao, inscricao } = await this.exigirAberta(userId, agora);
    if (!chave.startsWith(prefixoArquivos(edicao.id, inscricao.id))) {
      throw new ForbiddenException("Arquivo de outro participante.");
    }
    return this.armazenamento.urlsDasPartes(chave, uploadId, partes);
  }

  /** 3º passo: o navegador concluiu o upload; registra o envio (vale o último). */
  async concluirUpload(userId: string, tipo: TipoArquivo, chave: string, nome: string, bytes: number, agora = new Date()) {
    this.exigirArmazenamento();
    const { edicao, inscricao } = await this.exigirAberta(userId, agora);
    if (!chave.startsWith(prefixoArquivos(edicao.id, inscricao.id)) || !chave.slice(chave.lastIndexOf("/") + 1).startsWith(`${tipo}-`)) {
      throw new ForbiddenException("Arquivo de outro participante.");
    }
    const erro = validarArquivo(tipo, nome, bytes);
    if (erro) throw new BadRequestException(erro);

    const conferencia = await this.armazenamento.verificar(chave, bytes);
    if (conferencia === "AUSENTE") {
      throw new BadRequestException("O arquivo não chegou à nuvem. Envie novamente.");
    }
    if (conferencia === "TAMANHO_DIVERGENTE") {
      throw new BadRequestException("O arquivo chegou incompleto à nuvem. Envie novamente.");
    }

    const anterior = await this.ultimoEnvio(inscricao.id);
    const dados =
      tipo === "video"
        ? { videoKey: chave, videoNome: nome, videoBytes: BigInt(bytes) }
        : { portfolioKey: chave, portfolioNome: nome, portfolioBytes: BigInt(bytes) };
    const envio = await this.prisma.envioFase2.create({
      data: {
        inscricaoId: inscricao.id,
        tipo: "upload",
        status: "ENVIADO",
        enviadoEm: agora,
        // Mantém o outro arquivo do envio anterior: cada registro é o estado completo.
        videoKey: anterior?.videoKey ?? null,
        videoNome: anterior?.videoNome ?? null,
        videoBytes: anterior?.videoBytes ?? null,
        portfolioKey: anterior?.portfolioKey ?? null,
        portfolioNome: anterior?.portfolioNome ?? null,
        portfolioBytes: anterior?.portfolioBytes ?? null,
        ...dados,
      },
      select: camposEnvio,
    });
    return { ...formatarEnvio(envio, this.armazenamento), conferencia };
  }
}

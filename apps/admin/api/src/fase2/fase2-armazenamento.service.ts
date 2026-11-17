import { Injectable, Logger } from "@nestjs/common";
import { presign, s3ConfigDoAmbiente, type S3Config } from "./s3-presign.js";

/** Validade das URLs de upload das partes: cobre um vídeo grande em conexão lenta. */
const EXPIRA_PARTES_S = 6 * 3600;
/** Validade das URLs de leitura entregues a avaliadores e à gestão. */
const EXPIRA_LEITURA_S = 6 * 3600;

export type ResultadoVerificacao = "OK" | "AUSENTE" | "TAMANHO_DIVERGENTE" | "INDISPONIVEL";

/**
 * Nuvem própria da Fase 2 (armazenamento compatível com S3 na VPS).
 *
 * A API só ASSINA URLs; o navegador envia e baixa os arquivos diretamente da
 * nuvem. A única chamada de rede feita daqui é a conferência (HEAD) ao fim do
 * upload, e ela é tolerante: se a nuvem não responder a partir da rede da UFPI,
 * o envio é aceito mesmo assim e registrado no log.
 */
@Injectable()
export class Fase2ArmazenamentoService {
  private readonly logger = new Logger("Fase2Armazenamento");
  private readonly cfg: S3Config | null = s3ConfigDoAmbiente();

  get disponivel(): boolean {
    return this.cfg !== null;
  }

  private config(): S3Config {
    if (!this.cfg) throw new Error("Armazenamento da Fase 2 não configurado (FASE2_S3_*).");
    return this.cfg;
  }

  /** POST ?uploads — o navegador cria o upload multipart e recebe o UploadId. */
  urlCriarUpload(chave: string): string {
    return presign(this.config(), "POST", chave, { query: { uploads: "" }, expiraEmSegundos: 3600 });
  }

  urlsDasPartes(chave: string, uploadId: string, partes: number[]) {
    const cfg = this.config();
    const urls: Record<number, string> = {};
    for (const n of partes) {
      urls[n] = presign(cfg, "PUT", chave, {
        query: { partNumber: String(n), uploadId },
        expiraEmSegundos: EXPIRA_PARTES_S,
      });
    }
    return {
      urls,
      urlConcluir: presign(cfg, "POST", chave, { query: { uploadId }, expiraEmSegundos: EXPIRA_PARTES_S }),
      urlAbortar: presign(cfg, "DELETE", chave, { query: { uploadId }, expiraEmSegundos: EXPIRA_PARTES_S }),
    };
  }

  /** URL temporária de leitura; `inline` abre no navegador (vídeo/PDF). */
  urlLeitura(chave: string, nomeArquivo: string, inline = true): string | null {
    if (!this.cfg) return null;
    const nome = nomeArquivo.replace(/["\\\r\n]/g, "_");
    return presign(this.cfg, "GET", chave, {
      query: {
        "response-content-disposition": `${inline ? "inline" : "attachment"}; filename="${nome}"`,
      },
      expiraEmSegundos: EXPIRA_LEITURA_S,
    });
  }

  /** Confere se o objeto existe e tem o tamanho informado (melhor esforço). */
  async verificar(chave: string, bytes: number): Promise<ResultadoVerificacao> {
    try {
      const r = await fetch(presign(this.config(), "HEAD", chave, { expiraEmSegundos: 300 }), {
        method: "HEAD",
        signal: AbortSignal.timeout(8000),
      });
      if (r.status === 404) return "AUSENTE";
      if (!r.ok) {
        this.logger.warn(`HEAD ${chave}: HTTP ${r.status}`);
        return "INDISPONIVEL";
      }
      const tamanho = Number(r.headers.get("content-length"));
      return Number.isFinite(tamanho) && tamanho !== bytes ? "TAMANHO_DIVERGENTE" : "OK";
    } catch (e) {
      this.logger.warn(`Nuvem inacessível ao conferir ${chave}: ${(e as Error).message}`);
      return "INDISPONIVEL";
    }
  }
}

/**
 * URLs pré-assinadas (AWS Signature V4, query string) para um armazenamento
 * compatível com S3 — no caso, a nuvem própria na VPS (SeaweedFS/Garage/MinIO).
 *
 * A assinatura é calculada localmente, sem nenhuma chamada de rede: a API da
 * UFPI só assina, e quem fala com o armazenamento é o navegador do participante
 * (upload) ou do avaliador (download). Isso evita depender da saída TLS da rede
 * da UFPI, que já bloqueou o Cloudinary no passado.
 */
import { createHash, createHmac } from "node:crypto";

export interface S3Config {
  /** Endereço público do armazenamento, ex.: https://arquivos.exemplo.com.br */
  endpoint: string;
  region: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
}

/** Lê a configuração do ambiente; null quando o upload não está configurado. */
export function s3ConfigDoAmbiente(env: NodeJS.ProcessEnv = process.env): S3Config | null {
  const endpoint = env.FASE2_S3_ENDPOINT?.trim();
  const bucket = env.FASE2_S3_BUCKET?.trim();
  const accessKey = env.FASE2_S3_ACCESS_KEY?.trim();
  const secretKey = env.FASE2_S3_SECRET_KEY?.trim();
  if (!endpoint || !bucket || !accessKey || !secretKey) return null;
  return {
    endpoint: endpoint.replace(/\/+$/, ""),
    region: env.FASE2_S3_REGION?.trim() || "us-east-1",
    bucket,
    accessKey,
    secretKey,
  };
}

/** Codificação RFC 3986 exigida pela SigV4. */
function enc(valor: string): string {
  return encodeURIComponent(valor).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");
const hmac = (k: Buffer | string, s: string) => createHmac("sha256", k).update(s, "utf8").digest();

function carimbo(d: Date) {
  const iso = d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); // 20261117T120000Z
  return { amzDate: iso, dia: iso.slice(0, 8) };
}

/**
 * Gera uma URL pré-assinada (estilo de caminho: endpoint/bucket/chave).
 * `query` recebe os sub-recursos da operação (uploads, uploadId, partNumber…).
 */
export function presign(
  cfg: S3Config,
  metodo: "GET" | "PUT" | "POST" | "HEAD" | "DELETE",
  chave: string,
  opcoes: { query?: Record<string, string>; expiraEmSegundos?: number; agora?: Date } = {},
): string {
  const url = new URL(cfg.endpoint);
  const basePath = url.pathname.replace(/\/+$/, "");
  const chaveCodificada = chave.split("/").map(enc).join("/");
  // Bucket vazio = estilo virtual-host (bucket já no endpoint).
  const caminho = cfg.bucket ? `${basePath}/${enc(cfg.bucket)}/${chaveCodificada}` : `${basePath}/${chaveCodificada}`;
  const { amzDate, dia } = carimbo(opcoes.agora ?? new Date());
  const escopo = `${dia}/${cfg.region}/s3/aws4_request`;

  const params: Record<string, string> = {
    ...(opcoes.query ?? {}),
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${cfg.accessKey}/${escopo}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(Math.min(Math.max(opcoes.expiraEmSegundos ?? 3600, 1), 604800)),
    "X-Amz-SignedHeaders": "host",
  };
  const queryCanonica = Object.keys(params)
    .sort()
    .map((k) => `${enc(k)}=${enc(params[k])}`)
    .join("&");

  const requisicaoCanonica = [
    metodo,
    caminho,
    queryCanonica,
    `host:${url.host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const textoAssinar = ["AWS4-HMAC-SHA256", amzDate, escopo, sha256(requisicaoCanonica)].join("\n");
  const kData = hmac(`AWS4${cfg.secretKey}`, dia);
  const kRegiao = hmac(kData, cfg.region);
  const kServico = hmac(kRegiao, "s3");
  const kAssinatura = hmac(kServico, "aws4_request");
  const assinatura = createHmac("sha256", kAssinatura).update(textoAssinar, "utf8").digest("hex");

  return `${url.protocol}//${url.host}${caminho}?${queryCanonica}&X-Amz-Signature=${assinatura}`;
}

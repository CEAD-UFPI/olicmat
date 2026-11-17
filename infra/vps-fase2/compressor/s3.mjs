// URLs pré-assinadas (AWS SigV4) — mesma lógica de
// apps/admin/api/src/fase2/s3-presign.ts, em JavaScript puro para o compressor.
import { createHash, createHmac } from "node:crypto";

const enc = (v) =>
  encodeURIComponent(v).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
const sha256 = (s) => createHash("sha256").update(s, "utf8").digest("hex");
const hmac = (k, s) => createHmac("sha256", k).update(s, "utf8").digest();

export function presign(cfg, metodo, chave, { query = {}, expira = 3600, agora = new Date() } = {}) {
  const url = new URL(cfg.endpoint);
  const base = url.pathname.replace(/\/+$/, "");
  const caminho = `${base}/${enc(cfg.bucket)}/${chave.split("/").map(enc).join("/")}`;
  const iso = agora.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const dia = iso.slice(0, 8);
  const escopo = `${dia}/${cfg.region}/s3/aws4_request`;
  const params = {
    ...query,
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${cfg.accessKey}/${escopo}`,
    "X-Amz-Date": iso,
    "X-Amz-Expires": String(expira),
    "X-Amz-SignedHeaders": "host",
  };
  const qs = Object.keys(params).sort().map((k) => `${enc(k)}=${enc(params[k])}`).join("&");
  const canonica = [metodo, caminho, qs, `host:${url.host}\n`, "host", "UNSIGNED-PAYLOAD"].join("\n");
  const assinar = ["AWS4-HMAC-SHA256", iso, escopo, sha256(canonica)].join("\n");
  const k = hmac(hmac(hmac(hmac(`AWS4${cfg.secretKey}`, dia), cfg.region), "s3"), "aws4_request");
  const assinatura = createHmac("sha256", k).update(assinar, "utf8").digest("hex");
  return `${url.protocol}//${url.host}${caminho}?${qs}&X-Amz-Signature=${assinatura}`;
}

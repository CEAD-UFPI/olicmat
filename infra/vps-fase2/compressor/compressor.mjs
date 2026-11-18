// Compressor de vídeos da Fase 2 (roda na VPS, ao lado da nuvem S3).
//
// Ciclo: pede à API da OLICMAT o próximo vídeo da fila, baixa o original da
// nuvem (rede interna), converte para MP4 H.264 720p com ffmpeg, confere a
// duração, grava a versão final na nuvem, avisa a API e apaga os originais já
// convertidos. A API é a fonte da verdade sobre qual vídeo vale.
//
// Variáveis: OLICMAT_API_URL, FASE2_COMPRESSOR_TOKEN, S3_ENDPOINT, S3_BUCKET,
// S3_ACCESS_KEY, S3_SECRET_KEY, [S3_REGION], [CONCORRENCIA=2], [THREADS=4],
// [PASTA_TRABALHO=/trabalho], [INTERVALO_S=20], [INCOMPLETOS_HORAS=8].
import { spawn } from "node:child_process";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { presign } from "./s3.mjs";

const env = process.env;
const API = (env.OLICMAT_API_URL || "https://olicmat.cead.ufpi.br/api").replace(/\/+$/, "");
const TOKEN = env.FASE2_COMPRESSOR_TOKEN || "";
const S3 = {
  endpoint: env.S3_ENDPOINT || "http://seaweedfs:8333",
  region: env.S3_REGION || "us-east-1",
  bucket: env.S3_BUCKET || "olicmat-fase2",
  accessKey: env.S3_ACCESS_KEY || "",
  secretKey: env.S3_SECRET_KEY || "",
};
const CONCORRENCIA = Number(env.CONCORRENCIA || 2);
const THREADS = String(env.THREADS || 4);
const PASTA = env.PASTA_TRABALHO || "/trabalho";
const INTERVALO = Number(env.INTERVALO_S || 20) * 1000;
// Uploads interrompidos (aba fechada, internet caída) deixam partes na nuvem.
// As URLs das partes valem 6 h; depois disso o upload não tem mais como terminar.
const INCOMPLETOS_HORAS = Number(env.INCOMPLETOS_HORAS || 8);

const log = (...a) => console.log(new Date().toISOString(), ...a);
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(metodo, caminho, corpo) {
  const r = await fetch(API + caminho, {
    method: metodo,
    headers: { "x-compressor-token": TOKEN, "content-type": "application/json" },
    body: corpo ? JSON.stringify(corpo) : undefined,
    signal: AbortSignal.timeout(30_000),
  });
  if (!r.ok) throw new Error(`API ${metodo} ${caminho}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

function executar(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err = (err + d).slice(-4000)));
    p.on("error", reject);
    p.on("close", (c) => (c === 0 ? resolve(out) : reject(new Error(`${cmd} saiu com código ${c}: ${err.slice(-1500)}`))));
  });
}

async function duracao(arquivo) {
  try {
    const s = await executar("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arquivo]);
    const n = Number(s.trim());
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

async function baixar(chave, destino) {
  const r = await fetch(presign(S3, "GET", chave, { expira: 6 * 3600 }));
  if (!r.ok || !r.body) throw new Error(`download de ${chave}: HTTP ${r.status}`);
  await pipeline(Readable.fromWeb(r.body), createWriteStream(destino));
}

async function enviar(arquivo, chave) {
  const { size } = await stat(arquivo);
  const r = await fetch(presign(S3, "PUT", chave, { expira: 6 * 3600 }), {
    method: "PUT",
    body: createReadStream(arquivo),
    duplex: "half",
    headers: { "content-length": String(size), "content-type": "video/mp4" },
  });
  if (!r.ok) throw new Error(`upload de ${chave}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
  return size;
}

async function apagar(chave) {
  const r = await fetch(presign(S3, "DELETE", chave), { method: "DELETE" });
  if (!r.ok && r.status !== 404) throw new Error(`remoção de ${chave}: HTTP ${r.status}`);
}

// 720p no lado menor (vídeo deitado ou em pé), sem ampliar, até 30 quadros/s.
const FILTRO =
  "scale='if(gt(iw,ih),-2,trunc(min(720,iw)/2)*2)':'if(gt(iw,ih),trunc(min(720,ih)/2)*2,-2)',format=yuv420p";

async function comprimir(video) {
  const dir = join(PASTA, video.id);
  await mkdir(dir, { recursive: true });
  const entrada = join(dir, "original");
  const saida = join(dir, "final.mp4");
  try {
    const t0 = Date.now();
    log(`[${video.id}] baixando ${video.chaveOriginal} (${(video.bytesOriginal / 1048576).toFixed(0)} MB)`);
    await baixar(video.chaveOriginal, entrada);
    const durIn = await duracao(entrada);
    log(`[${video.id}] comprimindo (${durIn ? Math.round(durIn) + " s" : "duração desconhecida"})`);
    await executar("ffmpeg", [
      "-hide_banner", "-nostdin", "-y", "-i", entrada,
      "-map", "0:v:0", "-map", "0:a:0?",
      "-vf", FILTRO, "-fpsmax", "30",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", "-maxrate", "2000k", "-bufsize", "4000k",
      "-c:a", "aac", "-b:a", "128k", "-ac", "2", "-ar", "44100",
      "-movflags", "+faststart", "-threads", THREADS,
      saida,
    ]);
    const durOut = await duracao(saida);
    if (durIn && (!durOut || Math.abs(durIn - durOut) > Math.max(3, durIn * 0.02))) {
      throw new Error(`duração divergente após a compressão (${durIn} s → ${durOut} s)`);
    }
    const bytes = await enviar(saida, video.chaveFinal);
    await api("POST", `/interno/fase2/videos/${video.id}/concluido`, {
      chaveFinal: video.chaveFinal,
      bytesFinal: bytes,
      duracaoSeg: durOut ?? durIn,
    });
    log(`[${video.id}] pronto: ${(video.bytesOriginal / 1048576).toFixed(0)} MB → ${(bytes / 1048576).toFixed(0)} MB em ${Math.round((Date.now() - t0) / 1000)} s`);
  } catch (e) {
    log(`[${video.id}] FALHA: ${e.message}`);
    await api("POST", `/interno/fase2/videos/${video.id}/falha`, { erro: e.message }).catch((x) => log("aviso de falha não chegou:", x.message));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function limpar() {
  const { remocoes } = await api("GET", "/interno/fase2/videos/remocoes");
  for (const r of remocoes) {
    try {
      for (const chave of r.chaves) await apagar(chave);
      await api("POST", `/interno/fase2/videos/${r.id}/removido`);
      log(`[${r.id}] removidos: ${r.chaves.join(", ")}`);
    } catch (e) {
      log(`[${r.id}] remoção falhou: ${e.message}`);
    }
  }
}

const xml = (texto, tag) => [...texto.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g"))].map((m) => m[1]);
const desescapar = (t) => t.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

/** Apaga as partes dos uploads abandonados há mais de INCOMPLETOS_HORAS. */
async function limparIncompletos() {
  const r = await fetch(presign(S3, "GET", "", { query: { uploads: "" } }));
  if (!r.ok) throw new Error(`listagem de uploads incompletos: HTTP ${r.status}`);
  const limite = Date.now() - INCOMPLETOS_HORAS * 3600_000;
  for (const bloco of xml(await r.text(), "Upload")) {
    const chave = desescapar(xml(bloco, "Key")[0] ?? "");
    const uploadId = desescapar(xml(bloco, "UploadId")[0] ?? "");
    const iniciado = Date.parse(xml(bloco, "Initiated")[0] ?? "");
    if (!chave || !uploadId || !(iniciado < limite)) continue;
    const d = await fetch(presign(S3, "DELETE", chave, { query: { uploadId } }), { method: "DELETE" });
    if (d.ok || d.status === 404) log(`upload incompleto descartado: ${chave}`);
    else log(`não foi possível descartar o upload incompleto ${chave}: HTTP ${d.status}`);
  }
}

let ultimaLimpezaIncompletos = 0;

async function trabalhador(n) {
  for (;;) {
    try {
      if (n === 0) {
        await limpar();
        if (Date.now() - ultimaLimpezaIncompletos > 30 * 60_000) {
          ultimaLimpezaIncompletos = Date.now();
          await limparIncompletos().catch((e) => log(e.message));
        }
      }
      const { video } = await api("POST", "/interno/fase2/videos/proximo");
      if (video) await comprimir(video);
      else await dormir(INTERVALO);
    } catch (e) {
      log(`trabalhador ${n}: ${e.message}`);
      await dormir(INTERVALO);
    }
  }
}

if (!TOKEN || !S3.accessKey || !S3.secretKey) {
  console.error("Defina FASE2_COMPRESSOR_TOKEN, S3_ACCESS_KEY e S3_SECRET_KEY.");
  process.exit(1);
}
log(`compressor iniciado: API ${API}, nuvem ${S3.endpoint}/${S3.bucket}, ${CONCORRENCIA} em paralelo × ${THREADS} threads`);
await mkdir(PASTA, { recursive: true });
await Promise.all(Array.from({ length: CONCORRENCIA }, (_, i) => trabalhador(i)));

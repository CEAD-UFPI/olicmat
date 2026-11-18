import api from "@/lib/api";

/**
 * Upload da Fase 2 direto do navegador para a nuvem própria (S3 multipart).
 *
 * A API da OLICMAT só assina as URLs; os bytes vão do navegador para a nuvem.
 * O arquivo é enviado em partes (8 MB), 3 de cada vez, e cada parte é
 * reenviada automaticamente se a conexão falhar — assim uma oscilação de rede
 * não obriga a recomeçar um vídeo de 1–2 GB do zero.
 */

export type TipoArquivo = "video" | "portfolio";

export interface Progresso {
  enviados: number;
  total: number;
  /** bytes/s, média dos últimos segundos */
  velocidade: number;
}

const PARALELO = 3;
const TENTATIVAS = 6;
const LOTE_URLS = 100;

export class UploadCancelado extends Error {
  constructor() {
    super("Envio cancelado.");
  }
}

function enviarParte(url: string, corpo: Blob, aoProgredir: (n: number) => void, sinal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) => aoProgredir(e.loaded);
    xhr.onload = () => {
      const etag = xhr.getResponseHeader("ETag");
      if (xhr.status >= 200 && xhr.status < 300 && etag) resolve(etag);
      else reject(new Error(`Parte recusada pela nuvem (HTTP ${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error("Falha de conexão ao enviar uma parte."));
    xhr.ontimeout = () => reject(new Error("Tempo esgotado ao enviar uma parte."));
    const abortar = () => xhr.abort();
    sinal.addEventListener("abort", abortar, { once: true });
    xhr.onabort = () => reject(new UploadCancelado());
    xhr.send(corpo);
  });
}

const esperar = (ms: number, sinal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    sinal.addEventListener("abort", () => { clearTimeout(t); reject(new UploadCancelado()); }, { once: true });
  });

export async function enviarArquivo(
  tipo: TipoArquivo,
  arquivo: File,
  aoProgredir: (p: Progresso) => void,
  sinal: AbortSignal,
) {
  // 1. A API valida o arquivo (formato, tamanho, prazo) e assina a criação.
  const { data: ini } = await api.post<{ chave: string; urlCriar: string; tamanhoParte: number; partes: number }>(
    "/envio/upload/iniciar",
    { tipo, nome: arquivo.name, bytes: arquivo.size },
  );

  // 2. Cria o upload multipart na nuvem.
  const criado = await fetch(ini.urlCriar, { method: "POST", signal: sinal });
  const xmlCriado = await criado.text();
  const uploadId = /<UploadId>([^<]+)<\/UploadId>/.exec(xmlCriado)?.[1];
  if (!criado.ok || !uploadId) throw new Error("A nuvem de arquivos não respondeu. Tente novamente em instantes.");

  // 3. URLs assinadas das partes, em lotes.
  const urls: Record<number, string> = {};
  let urlConcluir = "";
  let urlAbortar = "";
  const todas = Array.from({ length: ini.partes }, (_, i) => i + 1);
  for (let i = 0; i < todas.length; i += LOTE_URLS) {
    const { data } = await api.post<{ urls: Record<number, string>; urlConcluir: string; urlAbortar: string }>(
      "/envio/upload/partes",
      { chave: ini.chave, uploadId, partes: todas.slice(i, i + LOTE_URLS) },
    );
    Object.assign(urls, data.urls);
    urlConcluir = data.urlConcluir;
    urlAbortar = data.urlAbortar;
  }

  // 4. Envia as partes, PARALELO por vez, com novas tentativas.
  const porParte = new Map<number, number>();
  const etags = new Map<number, string>();
  const amostras: Array<{ t: number; b: number }> = [];
  const relatar = () => {
    let enviados = 0;
    porParte.forEach((v) => (enviados += v));
    const agora = performance.now();
    amostras.push({ t: agora, b: enviados });
    while (amostras.length > 1 && agora - amostras[0].t > 5000) amostras.shift();
    const dt = (agora - amostras[0].t) / 1000;
    aoProgredir({ enviados, total: arquivo.size, velocidade: dt > 0 ? (enviados - amostras[0].b) / dt : 0 });
  };

  const fila = [...todas];
  const trabalhador = async () => {
    for (let n = fila.shift(); n !== undefined; n = fila.shift()) {
      const inicio = (n - 1) * ini.tamanhoParte;
      const corpo = arquivo.slice(inicio, Math.min(inicio + ini.tamanhoParte, arquivo.size));
      for (let tentativa = 1; ; tentativa++) {
        try {
          const etag = await enviarParte(urls[n], corpo, (b) => { porParte.set(n!, b); relatar(); }, sinal);
          porParte.set(n, corpo.size);
          etags.set(n, etag);
          relatar();
          break;
        } catch (e) {
          if (e instanceof UploadCancelado || sinal.aborted) throw new UploadCancelado();
          porParte.set(n, 0);
          if (tentativa >= TENTATIVAS) throw new Error("A conexão falhou repetidamente. Verifique a internet e envie novamente.");
          await esperar(Math.min(30_000, 1000 * 2 ** tentativa), sinal);
        }
      }
    }
  };

  try {
    await Promise.all(Array.from({ length: Math.min(PARALELO, todas.length) }, trabalhador));
  } catch (e) {
    // Libera o espaço das partes já enviadas (melhor esforço).
    fetch(urlAbortar, { method: "DELETE" }).catch(() => {});
    throw e;
  }

  // 5. Conclui o upload na nuvem (a nuvem junta as partes).
  const corpoXml =
    "<CompleteMultipartUpload>" +
    todas.map((n) => `<Part><PartNumber>${n}</PartNumber><ETag>${etags.get(n)}</ETag></Part>`).join("") +
    "</CompleteMultipartUpload>";
  let concluido = false;
  for (let tentativa = 1; tentativa <= TENTATIVAS && !concluido; tentativa++) {
    try {
      const r = await fetch(urlConcluir, {
        method: "POST",
        body: corpoXml,
        headers: { "Content-Type": "application/xml" },
        signal: sinal,
      });
      const texto = await r.text();
      concluido = r.ok && !texto.includes("<Error>");
    } catch (e) {
      if (sinal.aborted) throw new UploadCancelado();
      void e;
    }
    if (!concluido && tentativa < TENTATIVAS) await esperar(1000 * 2 ** tentativa, sinal);
  }
  if (!concluido) throw new Error("Não foi possível finalizar o arquivo na nuvem. Envie novamente.");

  // 6. Registra o envio na OLICMAT (envio único).
  const { data } = await api.post("/envio/upload/concluir", {
    tipo,
    chave: ini.chave,
    nome: arquivo.name,
    bytes: arquivo.size,
  });
  return data;
}

export function formatarBytes(b: number | null | undefined): string {
  if (b == null) return "";
  if (b < 1024 * 1024) return `${(b / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
  return `${(b / 1024 ** 3).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} GB`;
}

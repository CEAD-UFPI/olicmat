// Confere a nuvem da Fase 2 com as variáveis FASE2_S3_* do ambiente.
//
// Faz o mesmo caminho do navegador: cria um upload multipart, envia 1 parte,
// conclui, confere com HEAD, baixa, testa o CORS para o domínio do admin e apaga
// o arquivo de teste. Não toca no banco.
//
// Uso (dentro do container admin-api):
//   npx tsx scripts/verificar-nuvem-fase2.ts
// Usa o código compilado da imagem (dist), que é o mesmo que a API usa.
import { presign, s3ConfigDoAmbiente } from "../dist/src/fase2/s3-presign.js";

const ORIGEM = process.env.ADMIN_ORIGIN || "https://admin.olicmat.cead.ufpi.br";

async function main() {
  const cfg = s3ConfigDoAmbiente();
  if (!cfg) {
    console.error("FASE2_S3_ENDPOINT, FASE2_S3_BUCKET, FASE2_S3_ACCESS_KEY e FASE2_S3_SECRET_KEY precisam estar definidos.");
    process.exit(1);
  }
  console.log(`Nuvem: ${cfg.endpoint} | bucket: ${cfg.bucket}`);
  const chave = `teste/verificacao-${Date.now()}.txt`;
  const conteudo = Buffer.from(`OLICMAT — teste de nuvem ${new Date().toISOString()}`);
  const passo = (ok: boolean, msg: string) => {
    console.log(`${ok ? "OK   " : "FALHA"} ${msg}`);
    if (!ok) process.exitCode = 1;
    return ok;
  };

  const pf = await fetch(presign(cfg, "PUT", chave), {
    method: "OPTIONS",
    headers: { Origin: ORIGEM, "Access-Control-Request-Method": "PUT", "Access-Control-Request-Headers": "content-type" },
  });
  const allow = pf.headers.get("access-control-allow-origin");
  passo(pf.ok && (allow === "*" || allow === ORIGEM), `CORS para ${ORIGEM} (allow-origin: ${allow ?? "ausente"})`);
  const expoe = (pf.headers.get("access-control-expose-headers") ?? "").toLowerCase();
  passo(expoe.includes("etag") || expoe === "*", `CORS expõe o cabeçalho ETag (${expoe || "ausente"})`);

  const c = await fetch(presign(cfg, "POST", chave, { query: { uploads: "" } }), { method: "POST" });
  const uploadId = /<UploadId>([^<]+)<\/UploadId>/.exec(await c.text())?.[1];
  if (!passo(c.ok && !!uploadId, `cria upload multipart (HTTP ${c.status})`)) return;

  const p = await fetch(presign(cfg, "PUT", chave, { query: { partNumber: "1", uploadId: uploadId! } }), { method: "PUT", body: conteudo });
  const etag = p.headers.get("etag");
  if (!passo(p.ok && !!etag, `envia a parte 1 (HTTP ${p.status})`)) return;

  const xml = `<CompleteMultipartUpload><Part><PartNumber>1</PartNumber><ETag>${etag}</ETag></Part></CompleteMultipartUpload>`;
  const f = await fetch(presign(cfg, "POST", chave, { query: { uploadId: uploadId! } }), { method: "POST", body: xml });
  const tf = await f.text();
  passo(f.ok && !tf.includes("<Error>"), `conclui o upload (HTTP ${f.status})`);

  const h = await fetch(presign(cfg, "HEAD", chave), { method: "HEAD" });
  passo(h.ok && Number(h.headers.get("content-length")) === conteudo.length, `confere com HEAD (HTTP ${h.status})`);

  const g = await fetch(presign(cfg, "GET", chave));
  passo(g.ok && Buffer.from(await g.arrayBuffer()).equals(conteudo), `baixa o arquivo (HTTP ${g.status})`);

  const sem = await fetch(`${cfg.endpoint}/${cfg.bucket}/${chave}`);
  passo(sem.status === 403 || sem.status === 401, `acesso sem assinatura é negado (HTTP ${sem.status})`);

  const d = await fetch(presign(cfg, "DELETE", chave), { method: "DELETE" });
  passo(d.ok || d.status === 204, `apaga o arquivo de teste (HTTP ${d.status})`);

  console.log(process.exitCode ? "\nHá falhas: veja docs/fase2-nuvem-arquivos.md." : "\nNuvem pronta para a Fase 2.");
}

main().catch((e) => {
  console.error("Erro ao acessar a nuvem:", (e as Error).message);
  process.exit(1);
});

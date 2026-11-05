#!/usr/bin/env node
/**
 * Simula N participantes percorrendo o caminho COMPLETO do navegador no dia da
 * prova, passando pelo mesmo proxy que eles usam:
 *
 *   /login -> auth/login -> users/me + inscricoes/minha -> transition-token ->
 *   /auth/claim -> auth/claim -> /prova -> prova/iniciar -> prova/questoes ->
 *   20x prova/responder -> prova/finalizar
 *
 * Cada aluno tem conexões próprias (como um navegador). Falhas são repetidas
 * como uma pessoa repetiria (até 3 tentativas, com espera), mas toda falha é
 * contada: "funcionou depois de tentar de novo" não é o mesmo que "funcionou".
 *
 * Variáveis: N, RAMP_S, THINK_MS, FINAL_RAMP_S, RELOAD_PCT, ADMIN_POLLERS,
 *            SENHA, BASE (réplica) | SITE_URL/ADMIN_URL/PROVA_URL (HTTPS real),
 *            FIRST (índice do 1º aluno), LABEL.
 */
import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { monitorEventLoopDelay } from "node:perf_hooks";

const env = process.env;
const N = +(env.N ?? 567);
const FIRST = +(env.FIRST ?? 1);
const RAMP_S = +(env.RAMP_S ?? 60);
const THINK_MS = +(env.THINK_MS ?? 3000);
const FINAL_RAMP_S = +(env.FINAL_RAMP_S ?? 10);
const RELOAD_PCT = +(env.RELOAD_PCT ?? 20);
const ADMIN_POLLERS = +(env.ADMIN_POLLERS ?? 2);
const SENHA = env.SENHA ?? "Carga@2026!";
const LABEL = env.LABEL ?? `n${N}-ramp${RAMP_S}`;
const TIMEOUT_MS = +(env.TIMEOUT_MS ?? 30000);
const QUESTOES = 20;

const BASE = env.BASE ?? "http://127.0.0.1:18080";
const hosts = {
  site: env.SITE_URL ?? `${BASE}|olicmat.cead.ufpi.br`,
  admin: env.ADMIN_URL ?? `${BASE}|admin.olicmat.cead.ufpi.br`,
  prova: env.PROVA_URL ?? `${BASE}|prova.olicmat.cead.ufpi.br`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (ms) => ms * (0.5 + Math.random());

const metrics = new Map();
const errorSamples = new Map();
function record(step, ms, status) {
  let m = metrics.get(step);
  if (!m) metrics.set(step, (m = { lat: [], status: {} }));
  m.lat.push(ms);
  m.status[status] = (m.status[status] ?? 0) + 1;
}

function makeClient() {
  const agents = {
    "http:": new http.Agent({ keepAlive: true, maxSockets: 6 }),
    "https:": new https.Agent({ keepAlive: true, maxSockets: 6 }),
  };
  const request = (hostKey, method, urlPath, { body, token, step }) =>
    new Promise((resolve) => {
      const [baseUrl, hostHeader] = hosts[hostKey].split("|");
      const url = new URL(urlPath, baseUrl);
      const payload = body === undefined ? undefined : JSON.stringify(body);
      const headers = {
        accept: "*/*",
        "user-agent": "olicmat-carga",
        ...(hostHeader ? { host: hostHeader } : {}),
        ...(payload ? { "content-type": "application/json", "content-length": Buffer.byteLength(payload) } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      };
      const started = performance.now();
      const finish = (status, text) => {
        record(step, performance.now() - started, status);
        let json = null;
        try { json = JSON.parse(text); } catch { /* HTML */ }
        if (status === "ERR" || status === "TIMEOUT" || status >= 400) {
          const key = `${step} ${status}`;
          if (!errorSamples.has(key)) errorSamples.set(key, String(text).slice(0, 200));
        }
        resolve({ status, json });
      };
      const lib = url.protocol === "https:" ? https : http;
      const req = lib.request(url, { method, headers, agent: agents[url.protocol] }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => finish(res.statusCode, Buffer.concat(chunks).toString()));
        res.on("error", (e) => finish("ERR", e.message));
      });
      req.setTimeout(TIMEOUT_MS, () => { req.destroy(new Error("timeout")); });
      req.on("error", (e) => finish(e.message === "timeout" ? "TIMEOUT" : "ERR", e.message));
      if (payload) req.write(payload);
      req.end();
    });
  return { request, close: () => Object.values(agents).forEach((a) => a.destroy()) };
}

/** Repete como uma pessoa: espera e tenta de novo. Devolve null se desistir. */
async function tentar(fn, ok = (r) => r.status >= 200 && r.status < 300) {
  for (let i = 0; i < 3; i++) {
    const r = await fn();
    if (ok(r)) return r;
    if (i < 2) { contadores.repeticoes++; await sleep(jitter(3000 * (i + 1))); }
  }
  return null;
}

const contadores = { repeticoes: 0, concluidos: 0, finalizados: 0, salvas: 0 };
const desistencias = {};
const desistir = (etapa) => { desistencias[etapa] = (desistencias[etapa] ?? 0) + 1; };
const esperados = {};
const tempos = [];

// Todos chegam ao fim juntos: é o pior caso (cronômetro zerando às 11:00).
let liberarFinal;
const sinalFinal = new Promise((r) => { liberarFinal = r; });
let chegaramAoFim = 0;

async function aluno(idx) {
  const c = makeClient();
  const email = `carga${idx}@carga.olicmat.test`;
  const t0 = performance.now();
  try {
    await c.request("admin", "GET", "/login", { step: "01 GET /login (html)" });

    const login = await tentar(() =>
      c.request("site", "POST", "/api/auth/login", { body: { email, senha: SENHA }, step: "02 POST auth/login" }));
    if (!login) return desistir("login");
    const painel = login.json.accessToken;

    await c.request("site", "GET", "/api/users/me", { token: painel, step: "03 GET users/me" });
    await c.request("site", "GET", "/api/inscricoes/minha", { token: painel, step: "04 GET inscricoes/minha" });

    const trans = await tentar(() =>
      c.request("site", "POST", "/api/auth/transition-token", { token: painel, step: "05 POST transition-token" }));
    if (!trans) return desistir("transition-token");
    const tt = trans.json.transitionToken;

    await c.request("prova", "GET", `/auth/claim?token=${tt}`, { step: "06 GET /auth/claim (html)" });
    const claim = await tentar(() =>
      c.request("prova", "POST", "/api/auth/claim", { body: { token: tt }, step: "07 POST auth/claim" }));
    if (!claim) return desistir("claim");
    const token = claim.json.accessToken;

    await c.request("prova", "GET", "/prova", { step: "08 GET /prova (html)" });

    const carregar = async () => {
      await tentar(() => c.request("prova", "POST", "/api/prova/iniciar", { token, step: "09 POST prova/iniciar" }));
      return tentar(() => c.request("prova", "GET", "/api/prova/questoes", { token, step: "10 GET prova/questoes" }));
    };
    const prova = await carregar();
    if (!prova) return desistir("questoes");
    tempos.push(performance.now() - t0);

    const questoes = prova.json.questoes;
    if (questoes.length !== QUESTOES) { desistir("questoes-incompletas"); return; }
    const reload = Math.random() * 100 < RELOAD_PCT ? Math.floor(Math.random() * QUESTOES) : -1;
    const minhas = (esperados[`lt-insc-${idx}`] = {});

    for (let i = 0; i < questoes.length; i++) {
      await sleep(jitter(THINK_MS));
      const q = questoes[i];
      const alternativa = "ABCDE"[Math.floor(Math.random() * 5)];
      const r = await tentar(() =>
        c.request("prova", "POST", "/api/prova/responder", {
          body: { questaoId: q.id, alternativa }, token, step: "11 POST prova/responder",
        }));
      if (!r) { desistir("responder"); continue; }
      minhas[q.id] = alternativa;
      contadores.salvas++;
      if (i === reload) await carregar(); // F5 no meio da prova
      if (i % 5 === 0) await c.request("prova", "GET", "/api/prova/estado", { token, step: "11b GET prova/estado" });
      if (i === 7 && idx % 10 === 0) await c.request("prova", "POST", "/api/prova/advertencia", { token, step: "11c POST prova/advertencia" });
    }

    await c.request("prova", "GET", "/api/prova/resumo", { token, step: "12 GET prova/resumo" });
    if (++chegaramAoFim >= N - Object.values(desistencias).reduce((a, b) => a + b, 0)) liberarFinal();
    await sinalFinal;
    await sleep(Math.random() * FINAL_RAMP_S * 1000);

    const fim = await tentar(() =>
      c.request("prova", "POST", "/api/prova/finalizar", { token, step: "13 POST prova/finalizar" }));
    if (!fim) return desistir("finalizar");
    contadores.finalizados++;
    contadores.concluidos++;
  } catch (e) {
    desistir(`excecao:${e.message}`);
  } finally {
    c.close();
    const total = Object.values(desistencias).reduce((a, b) => a + b, 0);
    if (chegaramAoFim >= N - total) liberarFinal();
  }
}

/** Equipe de suporte com o painel de monitoramento aberto (poll de 5s). */
async function adminPoller(stop) {
  const c = makeClient();
  const r = await tentar(() =>
    c.request("site", "POST", "/api/auth/login", {
      body: { email: "admin@carga.olicmat.test", senha: SENHA }, step: "A0 admin login",
    }));
  if (!r) return c.close();
  const token = r.json.accessToken;
  while (!stop.done) {
    await Promise.all([
      c.request("site", "GET", "/api/admin/monitoramento", { token, step: "A1 GET monitoramento" }),
      c.request("site", "GET", "/api/admin/monitoramento/provas/lt-prova/inscricoes", { token, step: "A2 GET monitoramento/inscricoes" }),
    ]);
    await sleep(5000);
  }
  c.close();
}

const pct = (sorted, p) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))] : 0);

async function main() {
  const lag = monitorEventLoopDelay({ resolution: 20 });
  lag.enable();
  console.log(`[carga] ${LABEL}: ${N} alunos | chegada em ${RAMP_S}s | leitura ~${THINK_MS}ms | F5 ${RELOAD_PCT}% | ${ADMIN_POLLERS} painéis`);
  const inicio = Date.now();
  const stop = { done: false };
  const pollers = Array.from({ length: ADMIN_POLLERS }, () => adminPoller(stop));
  const progresso = setInterval(() => {
    const logins = metrics.get("02 POST auth/login")?.lat.length ?? 0;
    const q = metrics.get("10 GET prova/questoes")?.lat.length ?? 0;
    console.log(`[${Math.round((Date.now() - inicio) / 1000)}s] logins=${logins} questoes=${q} salvas=${contadores.salvas} finalizados=${contadores.finalizados} repetições=${contadores.repeticoes}`);
  }, 15000);

  await Promise.all(
    Array.from({ length: N }, (_, i) =>
      sleep(Math.random() * RAMP_S * 1000).then(() => aluno(FIRST + i))),
  );
  stop.done = true;
  clearInterval(progresso);
  await Promise.all(pollers);

  const duracao = (Date.now() - inicio) / 1000;
  const linhas = [...metrics.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([step, m]) => {
    const s = [...m.lat].sort((a, b) => a - b);
    const falhas = Object.entries(m.status)
      .filter(([k]) => !(+k >= 200 && +k < 300))
      .reduce((a, [, v]) => a + v, 0);
    return {
      etapa: step, req: s.length, falhas,
      p50: Math.round(pct(s, 50)), p95: Math.round(pct(s, 95)), p99: Math.round(pct(s, 99)),
      max: Math.round(s.at(-1) ?? 0), status: m.status,
    };
  });
  const entrada = [...tempos].sort((a, b) => a - b);
  const resumo = {
    label: LABEL, config: { N, RAMP_S, THINK_MS, FINAL_RAMP_S, RELOAD_PCT, ADMIN_POLLERS, hosts },
    duracaoSegundos: Math.round(duracao),
    alunos: { concluiram: contadores.concluidos, desistencias, repeticoes: contadores.repeticoes, respostasConfirmadas: contadores.salvas },
    tempoAteVerQuestoesMs: { p50: Math.round(pct(entrada, 50)), p95: Math.round(pct(entrada, 95)), max: Math.round(entrada.at(-1) ?? 0) },
    geradorLagMs: { p99: Math.round(lag.percentile(99) / 1e6), max: Math.round(lag.max / 1e6) },
    etapas: linhas, amostrasDeErro: Object.fromEntries(errorSamples),
  };
  console.table(linhas.map(({ status, ...l }) => ({ ...l, status: JSON.stringify(status) })));
  console.log(JSON.stringify({ alunos: resumo.alunos, tempoAteVerQuestoesMs: resumo.tempoAteVerQuestoesMs, geradorLagMs: resumo.geradorLagMs, duracao: resumo.duracaoSegundos }, null, 1));
  if (errorSamples.size) console.log("Amostras de erro:", resumo.amostrasDeErro);

  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "results");
  fs.mkdirSync(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(path.join(dir, `${LABEL}_${ts}.json`), JSON.stringify(resumo, null, 2));
  fs.writeFileSync(path.join(dir, `${LABEL}_${ts}.esperado.json`), JSON.stringify(esperados));
  fs.writeFileSync(path.join(dir, "ultimo.esperado.json"), JSON.stringify(esperados));
}

main().catch((e) => { console.error(e); process.exit(1); });

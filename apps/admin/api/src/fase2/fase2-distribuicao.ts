/**
 * Distribuição dos participantes da Fase 2 entre os avaliadores (regras da
 * Comissão, 21/11/2026):
 *
 * 1. Cada avaliador recebe no máximo CAPACIDADE_AVALIADOR participantes
 *    (contando 1º, 2º e eventual 3º avaliador).
 * 2. O 1º avaliador deve ser EXTERNO. Se os externos estiverem lotados, o 1º
 *    deve ser de instituição diferente da do participante.
 * 3. O 2º e o 3º avaliadores devem ser de instituição diferente da do
 *    participante. Um externo também atende a essa regra.
 * 4. Nunca o mesmo avaliador duas vezes para o mesmo participante. Avaliador
 *    sem instituição cadastrada não entra, porque não dá para conferir a
 *    regra 3.
 *
 * A atribuição é resolvida como fluxo de custo mínimo. Cada participante tem
 * duas vagas, e um avaliador da mesma instituição nunca é ligado a ele. A 1ª
 * vaga custa PENALIDADE quando não vai para um externo. A carga de cada
 * avaliador tem custo crescente, para equilibrar. Assim, o resultado:
 * - maximiza o número de 1ºs avaliadores externos;
 * - equilibra as cargas;
 * - acha solução sempre que ela existir.
 * Um algoritmo guloso pode travar mesmo quando há solução.
 */

export const CAPACIDADE_AVALIADOR = 10;
const PENALIDADE_PRIMEIRO_NAO_EXTERNO = 100_000;

export interface AvaliadorDistribuicao {
  id: string;
  instituicaoId: string | null;
  externo: boolean;
  /** Participantes que o avaliador já tem (atribuições ativas). */
  carga?: number;
}

export interface ParticipanteDistribuicao {
  id: string;
  instituicaoId: string;
}

export interface Atribuicao {
  inscricaoId: string;
  avaliadorId: string;
  ordem: number;
}

export type ResultadoDistribuicao =
  | {
      ok: true;
      atribuicoes: Atribuicao[];
      /** Participantes cujo 1º avaliador não é externo (externos lotados). */
      primeiroNaoExterno: number;
      cargas: Record<string, number>;
      vagasLivres: number;
    }
  | { ok: false; erro: string; faltam?: number };

/** A instituição EXTERNO é reconhecida pela sigla ou pelo nome. */
export function ehExterno(inst: { sigla?: string | null; nome?: string | null } | null | undefined): boolean {
  const n = (t?: string | null) => (t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toUpperCase();
  return !!inst && (n(inst.sigla) === "EXTERNO" || n(inst.nome) === "EXTERNO");
}

/** O avaliador pode avaliar o participante? (Regras 3 e 4.) */
export function podeAvaliar(av: Pick<AvaliadorDistribuicao, "instituicaoId">, participanteInstituicaoId: string): boolean {
  return !!av.instituicaoId && av.instituicaoId !== participanteInstituicaoId;
}

/* ------------------------------------------------------------- fluxo ---- */

class Fluxo {
  private para: number[] = [];
  private cap: number[] = [];
  private custo: number[] = [];
  private adj: number[][];
  constructor(n: number) {
    this.adj = Array.from({ length: n }, () => []);
  }
  aresta(u: number, v: number, cap: number, custo: number) {
    this.adj[u].push(this.para.length); this.para.push(v); this.cap.push(cap); this.custo.push(custo);
    this.adj[v].push(this.para.length); this.para.push(u); this.cap.push(0); this.custo.push(-custo);
    return this.para.length - 2;
  }
  fluxoAtual(e: number) {
    return this.cap[e ^ 1];
  }
  /** Caminhos aumentantes de custo mínimo (SPFA); devolve o fluxo total. */
  resolver(s: number, t: number, limite: number): number {
    const n = this.adj.length;
    let total = 0;
    while (total < limite) {
      const dist = new Array<number>(n).fill(Infinity);
      const via = new Array<number>(n).fill(-1);
      const naFila = new Array<boolean>(n).fill(false);
      dist[s] = 0;
      const fila = [s];
      naFila[s] = true;
      for (let i = 0; i < fila.length; i++) {
        const u = fila[i];
        naFila[u] = false;
        for (const e of this.adj[u]) {
          if (this.cap[e] > 0 && dist[u] + this.custo[e] < dist[this.para[e]]) {
            const v = this.para[e];
            dist[v] = dist[u] + this.custo[e];
            via[v] = e;
            if (!naFila[v]) { naFila[v] = true; fila.push(v); }
          }
        }
      }
      if (dist[t] === Infinity) break;
      let f = limite - total;
      for (let v = t; v !== s; v = this.para[via[v] ^ 1]) f = Math.min(f, this.cap[via[v]]);
      for (let v = t; v !== s; v = this.para[via[v] ^ 1]) { this.cap[via[v]] -= f; this.cap[via[v] ^ 1] += f; }
      total += f;
    }
    return total;
  }
}

/** Embaralhamento determinístico (mulberry32) para não favorecer a ordem de cadastro. */
function embaralhar<T>(itens: T[], semente: number): T[] {
  let a = semente >>> 0;
  const rnd = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const arr = [...itens];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function planejarDistribuicao(
  participantes: ParticipanteDistribuicao[],
  avaliadoresEntrada: AvaliadorDistribuicao[],
  { capacidade = CAPACIDADE_AVALIADOR, semente = 1 }: { capacidade?: number; semente?: number } = {},
): ResultadoDistribuicao {
  if (!participantes.length) return { ok: false, erro: "Nenhum participante para distribuir." };
  const ids = new Set(avaliadoresEntrada.map((a) => a.id));
  if (ids.size !== avaliadoresEntrada.length) return { ok: false, erro: "Avaliador repetido na lista." };
  const semInst = avaliadoresEntrada.filter((a) => !a.instituicaoId);
  if (semInst.length) {
    return { ok: false, erro: `${semInst.length} avaliador(es) sem instituição cadastrada. Cadastre a instituição (ou EXTERNO) antes de distribuir.` };
  }
  const avaliadores = embaralhar(avaliadoresEntrada, semente);
  const parts = embaralhar(participantes, semente ^ 0x9e3779b9);

  const necessidade = parts.length * 2;
  const vagas = avaliadores.reduce((s, a) => s + Math.max(0, capacidade - (a.carga ?? 0)), 0);
  if (vagas < necessidade) {
    return { ok: false, erro: `Vagas insuficientes: são necessárias ${necessidade} avaliações (2 por participante) e há ${vagas} vagas (até ${capacidade} por avaliador).`, faltam: necessidade - vagas };
  }

  // Nós: 0 = fonte, 1 = sumidouro, depois vagas (2 por participante),
  // pares (participante, avaliador) e avaliadores.
  const P = parts.length, A = avaliadores.length;
  const S = 0, T = 1;
  const vaga = (p: number, k: number) => 2 + p * 2 + k;
  const noAv = (a: number) => 2 + P * 2 + a;
  let proximo = 2 + P * 2 + A;
  const pares: Array<{ p: number; a: number; no: number }> = [];
  for (let p = 0; p < P; p++) {
    for (let a = 0; a < A; a++) {
      if (podeAvaliar(avaliadores[a], parts[p].instituicaoId)) pares.push({ p, a, no: proximo++ });
    }
  }
  const g = new Fluxo(proximo);
  for (let p = 0; p < P; p++) { g.aresta(S, vaga(p, 0), 1, 0); g.aresta(S, vaga(p, 1), 1, 0); }
  const arestaVaga1: Array<{ e: number; p: number; a: number }> = [];
  const arestaVaga2: Array<{ e: number; p: number; a: number }> = [];
  for (const par of pares) {
    const custo1 = avaliadores[par.a].externo ? 0 : PENALIDADE_PRIMEIRO_NAO_EXTERNO;
    arestaVaga1.push({ e: g.aresta(vaga(par.p, 0), par.no, 1, custo1), p: par.p, a: par.a });
    arestaVaga2.push({ e: g.aresta(vaga(par.p, 1), par.no, 1, 0), p: par.p, a: par.a });
    g.aresta(par.no, noAv(par.a), 1, 0); // o mesmo avaliador não pega as duas vagas
  }
  for (let a = 0; a < A; a++) {
    const ja = avaliadores[a].carga ?? 0;
    // Custo crescente por unidade de carga: equilibra a distribuição.
    for (let u = ja; u < capacidade; u++) g.aresta(noAv(a), T, 1, u * u);
  }

  const fluxo = g.resolver(S, T, necessidade);
  if (fluxo < necessidade) {
    const semElegiveis = parts.filter((p) => avaliadores.filter((a) => podeAvaliar(a, p.instituicaoId)).length < 2).length;
    return {
      ok: false,
      erro: semElegiveis
        ? `${semElegiveis} participante(s) não têm 2 avaliadores de instituição diferente da sua.`
        : `Não há como respeitar as regras com os avaliadores selecionados (faltam ${necessidade - fluxo} avaliações). Inclua mais avaliadores de outras instituições ou externos.`,
      faltam: necessidade - fluxo,
    };
  }

  const atribuicoes: Atribuicao[] = [];
  const cargas: Record<string, number> = Object.fromEntries(avaliadores.map((a) => [a.id, a.carga ?? 0]));
  let primeiroNaoExterno = 0;
  for (const x of arestaVaga1) {
    if (g.fluxoAtual(x.e) > 0) {
      atribuicoes.push({ inscricaoId: parts[x.p].id, avaliadorId: avaliadores[x.a].id, ordem: 1 });
      cargas[avaliadores[x.a].id]++;
      if (!avaliadores[x.a].externo) primeiroNaoExterno++;
    }
  }
  for (const x of arestaVaga2) {
    if (g.fluxoAtual(x.e) > 0) {
      atribuicoes.push({ inscricaoId: parts[x.p].id, avaliadorId: avaliadores[x.a].id, ordem: 2 });
      cargas[avaliadores[x.a].id]++;
    }
  }
  return { ok: true, atribuicoes, primeiroNaoExterno, cargas, vagasLivres: vagas - necessidade };
}

/**
 * 3º avaliador (divergência > 20 pontos):
 * - instituição diferente da do participante;
 * - fora os que já avaliam esse participante;
 * - com vaga (carga < capacidade);
 * - o de menor carga, preferindo externos no empate.
 */
export function escolherTerceiro(
  candidatos: Array<{ avaliadorId: string; instituicaoId: string | null; externo: boolean; pendentes: number; total: number }>,
  participanteInstituicaoId: string,
  excluir: string[],
  capacidade = CAPACIDADE_AVALIADOR,
): string | null {
  const livres = candidatos.filter(
    (c) => !excluir.includes(c.avaliadorId) && c.total < capacidade && podeAvaliar(c, participanteInstituicaoId),
  );
  if (!livres.length) return null;
  livres.sort(
    (a, b) =>
      a.total - b.total ||
      a.pendentes - b.pendentes ||
      Number(b.externo) - Number(a.externo) ||
      a.avaliadorId.localeCompare(b.avaliadorId),
  );
  return livres[0].avaliadorId;
}

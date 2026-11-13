/**
 * Regras puras da Fase 2 (sem banco), testadas em fase2.regras.spec.ts.
 *
 * - O tema é sorteado fora do sistema; a Comissão informa o tema e dá o início.
 * - Prazo de envio: início + 24 horas, igual para todos, sem prorrogação.
 * - Cada participante que enviou recebe 2 avaliadores distintos. Se as notas
 *   diferirem mais de 20 pontos, um 3º avaliador avalia, e a nota da Fase 2 é
 *   a média das duas notas mais próximas.
 */

export const PRAZO_ENVIO_HORAS = 24;
export const LIMITE_DIVERGENCIA = 20;
export const ALERTA_AVALIACAO_HORAS = 48;

export const CRITERIOS = [
  { chave: "dominioConteudo", nome: "Domínio do conteúdo", descricao: "Rigor matemático, correção conceitual e linguagem adequada.", max: 25 },
  { chave: "estrategiasEnsino", nome: "Estratégias de ensino", descricao: "Clareza, adaptação ao público-alvo e mediação pedagógica.", max: 25 },
  { chave: "usoTdics", nome: "Uso de TDICs", descricao: "Integração criativa, funcional e ética de tecnologias digitais.", max: 20 },
  { chave: "reflexaoCritica", nome: "Reflexão crítica", descricao: "Análise fundamentada sobre as escolhas didáticas e limitações.", max: 15 },
  { chave: "coerenciaPedagogica", nome: "Coerência pedagógica", descricao: "Alinhamento entre plano, vídeo, portfólio e avaliação.", max: 15 },
] as const;

export type ChaveCriterio = (typeof CRITERIOS)[number]["chave"];
export type NotasCriterios = Record<ChaveCriterio, number>;

export function prazoDe(inicio: Date): Date {
  return new Date(inicio.getTime() + PRAZO_ENVIO_HORAS * 3600_000);
}

export type SituacaoEnvio = "NAO_INICIADA" | "ABERTA" | "ENCERRADA";

/** O envio vale até o prazo, inclusive o próprio instante do prazo. */
export function situacaoEnvio(
  inicio: Date | null | undefined,
  prazo: Date | null | undefined,
  agora: Date = new Date(),
): SituacaoEnvio {
  if (!inicio || !prazo) return "NAO_INICIADA";
  if (agora.getTime() < inicio.getTime()) return "NAO_INICIADA";
  return agora.getTime() <= prazo.getTime() ? "ABERTA" : "ENCERRADA";
}

/** Aceita qualquer endereço http(s) com host; o conteúdo é do participante. */
export function linkValido(valor: string): boolean {
  const texto = valor.trim();
  if (texto.length > 2000) return false;
  try {
    const url = new URL(texto);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Valida as notas dos critérios e devolve o total (ou a lista de erros). */
export function totalCriterios(
  notas: Partial<Record<string, unknown>>,
): { ok: true; total: number; notas: NotasCriterios } | { ok: false; erros: string[] } {
  const erros: string[] = [];
  const valores = {} as NotasCriterios;
  for (const c of CRITERIOS) {
    const v = notas[c.chave];
    if (typeof v !== "number" || !Number.isFinite(v)) {
      erros.push(`${c.nome}: informe a nota`);
      continue;
    }
    if (v < 0 || v > c.max) {
      erros.push(`${c.nome}: a nota deve estar entre 0 e ${c.max}`);
      continue;
    }
    if (Math.round(v * 10) !== v * 10) {
      erros.push(`${c.nome}: use no máximo uma casa decimal`);
      continue;
    }
    valores[c.chave] = v;
  }
  if (erros.length) return { ok: false, erros };
  const total = CRITERIOS.reduce((s, c) => s + valores[c.chave], 0);
  return { ok: true, total: Math.round(total * 10) / 10, notas: valores };
}

export type ResultadoNotas =
  | { situacao: "AGUARDANDO" }
  | { situacao: "PRECISA_TERCEIRO"; diferenca: number }
  | { situacao: "FINAL"; nota: number };

const arred2 = (n: number) => Math.round(n * 100) / 100;

/** Consolida as notas concluídas de um participante (em ordem de conclusão). */
export function consolidarNotas(notas: number[]): ResultadoNotas {
  if (notas.length < 2) return { situacao: "AGUARDANDO" };
  if (notas.length === 2) {
    const [a, b] = notas;
    const diferenca = Math.abs(a - b);
    if (diferenca > LIMITE_DIVERGENCIA) return { situacao: "PRECISA_TERCEIRO", diferenca };
    return { situacao: "FINAL", nota: arred2((a + b) / 2) };
  }
  // Três notas: média do par mais próximo. Empate entre pares: o de maior média
  // (favorece o participante, regra explícita e determinística).
  const [a, b, c] = notas;
  const pares: Array<[number, number]> = [[a, b], [a, c], [b, c]];
  pares.sort((p, q) => {
    const dp = Math.abs(p[0] - p[1]);
    const dq = Math.abs(q[0] - q[1]);
    if (dp !== dq) return dp - dq;
    return q[0] + q[1] - (p[0] + p[1]);
  });
  const [x, y] = pares[0];
  return { situacao: "FINAL", nota: arred2((x + y) / 2) };
}

/**
 * Distribuição simples e equilibrada: cada participante recebe 2 avaliadores
 * distintos; as cargas diferem no máximo em 1. Determinística para a mesma
 * entrada (participantes e avaliadores na ordem recebida).
 */
export function distribuir(
  participantes: string[],
  avaliadores: string[],
): Array<{ inscricaoId: string; avaliadorId: string; ordem: number }> {
  if (avaliadores.length < 2) {
    throw new Error("São necessários pelo menos 2 avaliadores");
  }
  if (new Set(avaliadores).size !== avaliadores.length) {
    throw new Error("Avaliador repetido na lista");
  }
  const n = avaliadores.length;
  const saida: Array<{ inscricaoId: string; avaliadorId: string; ordem: number }> = [];
  // Percorre as 2P vagas em sequência circular: a vaga k vai para o avaliador
  // k mod n. Como n >= 2, as duas vagas consecutivas de um participante caem em
  // avaliadores diferentes, e as cargas ficam equilibradas.
  let k = 0;
  for (const p of participantes) {
    saida.push({ inscricaoId: p, avaliadorId: avaliadores[k % n], ordem: 1 });
    saida.push({ inscricaoId: p, avaliadorId: avaliadores[(k + 1) % n], ordem: 2 });
    k += 2;
  }
  return saida;
}

/** Escolhe o 3º avaliador: menor carga pendente, excluindo quem já avaliou. */
export function escolherTerceiro(
  candidatos: Array<{ avaliadorId: string; pendentes: number; total: number }>,
  excluir: string[],
): string | null {
  const livres = candidatos.filter((c) => !excluir.includes(c.avaliadorId));
  if (!livres.length) return null;
  livres.sort((a, b) => a.pendentes - b.pendentes || a.total - b.total || a.avaliadorId.localeCompare(b.avaliadorId));
  return livres[0].avaliadorId;
}

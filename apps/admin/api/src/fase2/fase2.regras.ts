/**
 * Regras puras da Fase 2 (sem banco), testadas em fase2.regras.spec.ts.
 *
 * - A competência é sorteada fora do sistema; a Comissão a informa e dá o início.
 * - Prazo de envio: início + 24 horas, igual para todos, sem prorrogação.
 * - Cada participante que enviou recebe 2 avaliadores distintos. Se as notas
 *   diferirem mais de 20 pontos, um 3º avaliador avalia, e a nota da Fase 2 é
 *   a média das duas notas mais próximas.
 */

export const PRAZO_ENVIO_HORAS = 24;
export const LIMITE_DIVERGENCIA = 20;
export const ALERTA_AVALIACAO_HORAS = 48;

/**
 * Critérios do Manual do Participante — 2ª Fase. Cada critério vale até 20
 * pontos, mas o avaliador atribui um conceito inteiro de 0 a 5; o sistema
 * converte proporcionalmente (conceito × 4). Total: até 100 pontos.
 */
export const ESCALA_MAX = 5;
export const PONTOS_POR_CRITERIO = 20;
export const PESO_CONCEITO = PONTOS_POR_CRITERIO / ESCALA_MAX; // 4

export const CRITERIOS = [
  { chave: "criterio1", nome: "Adequação à competência sorteada e às habilidades escolhidas", descricao: "Coerência entre a competência, as habilidades selecionadas, os objetivos de ensino e o público-alvo.", max: PONTOS_POR_CRITERIO },
  { chave: "criterio2", nome: "Domínio do conteúdo e rigor matemático", descricao: "Correção de conceitos e procedimentos, precisão da linguagem e qualidade das representações, justificativas e conclusões.", max: PONTOS_POR_CRITERIO },
  { chave: "criterio3", nome: "Planejamento e organização da situação didática", descricao: "Progressão da aula, articulação entre objetivos e atividades, coerência entre portfólio e vídeo e gestão do tempo.", max: PONTOS_POR_CRITERIO },
  { chave: "criterio4", nome: "Clareza didática e mediação da aprendizagem", descricao: "Explicações compreensíveis, perguntas pertinentes e atenção às possíveis dificuldades dos estudantes.", max: PONTOS_POR_CRITERIO },
  { chave: "criterio5", nome: "Recursos didáticos, tecnologias e avaliação da aprendizagem", descricao: "Uso intencional de materiais e recursos, quando pertinentes, e estratégias para verificar a aprendizagem.", max: PONTOS_POR_CRITERIO },
] as const;

/** Conceitos de 0 a 5 e a faixa correspondente da escala orientadora do Manual. */
export const ESCALA = [
  { conceito: 0, pontos: 0, rotulo: "Ausência de evidência" },
  { conceito: 1, pontos: 4, rotulo: "Desempenho incipiente" },
  { conceito: 2, pontos: 8, rotulo: "Desempenho parcial, com lacunas importantes" },
  { conceito: 3, pontos: 12, rotulo: "Desempenho adequado, com limitações" },
  { conceito: 4, pontos: 16, rotulo: "Desempenho consistente" },
  { conceito: 5, pontos: 20, rotulo: "Desempenho consistente, com evidências claras e bem fundamentadas" },
] as const;

export type ChaveCriterio = (typeof CRITERIOS)[number]["chave"];
export type NotasCriterios = Record<ChaveCriterio, number>;

/** Converte um conceito (0 a 5) em pontos do critério (0 a 20). */
export const pontosDoConceito = (conceito: number) => conceito * PESO_CONCEITO;

/** Um conceito válido é um inteiro de 0 a 5. */
export const conceitoValido = (v: unknown): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= ESCALA_MAX;

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

/**
 * Valida os conceitos (0 a 5, inteiros) e devolve o total em pontos (0 a 100).
 * `notas` guarda os conceitos como informados pelo avaliador.
 */
export function totalCriterios(
  notas: Partial<Record<string, unknown>>,
): { ok: true; total: number; notas: NotasCriterios } | { ok: false; erros: string[] } {
  const erros: string[] = [];
  const valores = {} as NotasCriterios;
  for (const c of CRITERIOS) {
    const v = notas[c.chave];
    if (v == null || v === "") {
      erros.push(`${c.nome}: informe o conceito`);
      continue;
    }
    if (!conceitoValido(v)) {
      erros.push(`${c.nome}: o conceito deve ser um número inteiro de 0 a ${ESCALA_MAX}`);
      continue;
    }
    valores[c.chave] = v;
  }
  if (erros.length) return { ok: false, erros };
  const total = CRITERIOS.reduce((s, c) => s + pontosDoConceito(valores[c.chave]), 0);
  return { ok: true, total, notas: valores };
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

/* ---------------------------------------------------------------------------
 * Upload dos arquivos (videoaula e portfólio) para a nuvem própria (S3).
 * ------------------------------------------------------------------------- */

export type TipoArquivo = "video" | "portfolio";

export const FORMATOS: Record<TipoArquivo, string[]> = {
  video: ["mp4", "mov", "webm", "mkv", "m4v", "avi"],
  portfolio: ["pdf"],
};

const MB = 1024 * 1024;

/** Limites em MB, ajustáveis por ambiente (FASE2_VIDEO_MAX_MB, FASE2_PORTFOLIO_MAX_MB). */
export function limitesMb(env: NodeJS.ProcessEnv = process.env): Record<TipoArquivo, number> {
  const num = (v: string | undefined, padrao: number) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : padrao;
  };
  return {
    video: num(env.FASE2_VIDEO_MAX_MB, 3072),
    portfolio: num(env.FASE2_PORTFOLIO_MAX_MB, 50),
  };
}

export function extensao(nome: string): string {
  const i = nome.lastIndexOf(".");
  return i >= 0 ? nome.slice(i + 1).toLowerCase() : "";
}

/** Valida nome e tamanho do arquivo antes de liberar o upload. */
export function validarArquivo(
  tipo: TipoArquivo,
  nome: string,
  bytes: number,
  limites = limitesMb(),
): string | null {
  const ext = extensao(nome);
  if (!FORMATOS[tipo].includes(ext)) {
    return tipo === "video"
      ? `Formato de vídeo não aceito. Envie ${FORMATOS.video.map((f) => f.toUpperCase()).join(", ")}.`
      : "O portfólio deve ser um único arquivo PDF.";
  }
  if (!Number.isInteger(bytes) || bytes <= 0) return "Arquivo vazio.";
  if (bytes > limites[tipo] * MB) {
    const lim = limites[tipo] >= 1024 ? `${(limites[tipo] / 1024).toLocaleString("pt-BR")} GB` : `${limites[tipo]} MB`;
    return `Arquivo maior que o limite de ${lim}.`;
  }
  return null;
}

/**
 * Tamanho das partes do upload multipart: 8 MB, aumentando se preciso para não
 * passar de 10.000 partes (limite do S3). Partes pequenas permitem retomar
 * rapidamente quando a conexão oscila, e cada parte termina bem antes do
 * tempo-limite de leitura do proxy (Traefik: 60 s), mesmo em conexão de ~2 Mbps.
 */
export function planoDePartes(bytes: number): { tamanhoParte: number; partes: number } {
  let tamanhoParte = 8 * MB;
  while (Math.ceil(bytes / tamanhoParte) > 10_000) tamanhoParte *= 2;
  return { tamanhoParte, partes: Math.max(1, Math.ceil(bytes / tamanhoParte)) };
}

/** Prefixo das chaves de um participante; a API só aceita chaves sob ele. */
export const prefixoArquivos = (edicaoId: string, inscricaoId: string) => `fase2/${edicaoId}/${inscricaoId}/`;

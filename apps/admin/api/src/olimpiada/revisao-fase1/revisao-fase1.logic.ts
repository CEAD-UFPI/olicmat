import { permutacaoAlternativas } from "./shuffle.js";

const LETRAS = ["A", "B", "C", "D", "E"] as const;

export interface QuestaoGabarito {
  id: string;
  ordem: number;
  enunciado: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaE: string;
  correta: string | null;
}

export interface ItemRevisao {
  numero: number;
  enunciado: string;
  /** Na ordem em que o participante viu na prova (letras já embaralhadas). */
  alternativas: Array<{ letra: string; texto: string }>;
  /** Letra que o participante marcou, como ele viu (null = em branco). */
  marcada: string | null;
  /** Letra correta, na ordem que o participante viu. */
  correta: string;
  acertou: boolean;
}

/**
 * Monta a revisão da Fase 1 de um participante. As alternativas voltam na
 * ordem embaralhada que ele viu (semente `${inscricaoId}:${questaoId}`, a mesma
 * do exam-app), e a letra correta é convertida para essa ordem.
 */
export function montarRevisao(
  inscricaoId: string,
  questoes: QuestaoGabarito[],
  marcadas: Map<string, string>,
): { itens: ItemRevisao[]; acertos: number; total: number } {
  const itens = [...questoes]
    .sort((a, b) => a.ordem - b.ordem)
    .map((q, i) => {
      if (!q.correta || !LETRAS.includes(q.correta as (typeof LETRAS)[number])) {
        throw new Error(`Questão ${i + 1} sem gabarito oficial.`);
      }
      const perm = permutacaoAlternativas(`${inscricaoId}:${q.id}`);
      const alternativas = LETRAS.map((letra, idx) => ({
        letra,
        texto: q[`alternativa${perm[idx]}` as keyof QuestaoGabarito] as string,
      }));
      const correta = LETRAS[perm.indexOf(q.correta)];
      const m = marcadas.get(q.id);
      const marcada = m && LETRAS.includes(m as (typeof LETRAS)[number]) ? m : null;
      return { numero: i + 1, enunciado: q.enunciado, alternativas, marcada, correta, acertou: marcada === correta };
    });
  return { itens, acertos: itens.filter((x) => x.acertou).length, total: itens.length };
}

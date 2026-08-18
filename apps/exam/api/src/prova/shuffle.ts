// Embaralhamento determinístico (anti-cola).
// O mesmo aluno vê sempre a mesma ordem (consistente entre refreshes),
// mas alunos diferentes veem ordens diferentes (anti-cola entre carteiras).

const LETRAS_CANONICAS = ["A", "B", "C", "D", "E"] as const;

// xmur3: hash de string → seed numérico estável.
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

// mulberry32: PRNG determinístico a partir de uma seed numérica.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomSeeded(seed: string): () => number {
  return mulberry32(xmur3(seed)());
}

function shuffle<T>(items: readonly T[], seed: string): T[] {
  const rand = randomSeeded(seed);
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Embaralha IDs de questões com seed determinística (ex.: inscricao.id). */
export function shuffleIds(seed: string, ids: string[]): string[] {
  return shuffle(ids, seed);
}

/** Permutação das letras canônicas A–E para uma questão específica. */
export function permutacaoAlternativas(seed: string): string[] {
  return shuffle(LETRAS_CANONICAS, seed);
}

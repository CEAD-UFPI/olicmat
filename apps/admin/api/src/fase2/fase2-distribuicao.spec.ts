import {
  CAPACIDADE_AVALIADOR,
  ehExterno,
  escolherTerceiro,
  planejarDistribuicao,
  type AvaliadorDistribuicao,
  type ParticipanteDistribuicao,
} from "./fase2-distribuicao.js";

const EXT = "inst-externo";

function participantes(por: Record<string, number>): ParticipanteDistribuicao[] {
  const lista: ParticipanteDistribuicao[] = [];
  for (const [inst, n] of Object.entries(por)) for (let i = 0; i < n; i++) lista.push({ id: `${inst}-p${i}`, instituicaoId: inst });
  return lista;
}
function avaliadores(por: Record<string, number>): AvaliadorDistribuicao[] {
  const lista: AvaliadorDistribuicao[] = [];
  for (const [inst, n] of Object.entries(por)) for (let i = 0; i < n; i++) lista.push({ id: `${inst}-a${i}`, instituicaoId: inst, externo: inst === EXT });
  return lista;
}

/** Confere todas as regras num resultado. */
function conferir(ps: ParticipanteDistribuicao[], avs: AvaliadorDistribuicao[], r: ReturnType<typeof planejarDistribuicao>) {
  if (!r.ok) throw new Error(r.erro);
  const av = new Map(avs.map((a) => [a.id, a]));
  const carga = new Map<string, number>();
  for (const p of ps) {
    const minhas = r.atribuicoes.filter((x) => x.inscricaoId === p.id);
    expect(minhas.map((x) => x.ordem).sort()).toEqual([1, 2]);
    expect(new Set(minhas.map((x) => x.avaliadorId)).size).toBe(2);
    for (const x of minhas) {
      expect(av.get(x.avaliadorId)!.instituicaoId).not.toBe(p.instituicaoId);
      carga.set(x.avaliadorId, (carga.get(x.avaliadorId) ?? 0) + 1);
    }
  }
  for (const [id, c] of carga) expect(c + (av.get(id)!.carga ?? 0)).toBeLessThanOrEqual(CAPACIDADE_AVALIADOR);
  return carga;
}

describe("distribuição da Fase 2", () => {
  const ps118 = participantes({ IFPI: 50, UFPI: 35, UFDPAR: 23, UESPI: 10 });

  it("118 vídeos com externos suficientes: todo 1º avaliador é externo", () => {
    const avs = avaliadores({ [EXT]: 12, IFPI: 6, UFPI: 6, UFDPAR: 3, UESPI: 2 });
    const r = planejarDistribuicao(ps118, avs);
    conferir(ps118, avs, r);
    expect(r.ok && r.primeiroNaoExterno).toBe(0);
    expect(r.ok && r.atribuicoes.length).toBe(236);
  });

  it("externos lotados: o 1º passa a ser de instituição diferente, e o máximo possível continua externo", () => {
    const avs = avaliadores({ [EXT]: 3, IFPI: 9, UFPI: 8, UFDPAR: 4, UESPI: 2 });
    const r = planejarDistribuicao(ps118, avs);
    const carga = conferir(ps118, avs, r);
    expect(r.ok && r.primeiroNaoExterno).toBe(118 - 30);
    for (let i = 0; i < 3; i++) expect(carga.get(`${EXT}-a${i}`)).toBe(10);
  });

  it("externos ficam cheios (prioridade no 1º); os demais, equilibrados; ninguém acima de 10", () => {
    const avs = avaliadores({ [EXT]: 10, IFPI: 8, UFPI: 8, UFDPAR: 4, UESPI: 2 });
    const r = planejarDistribuicao(ps118, avs);
    const carga = conferir(ps118, avs, r);
    for (let i = 0; i < 10; i++) expect(carga.get(`${EXT}-a${i}`)).toBe(10);
    const internos = avs.filter((a) => !a.externo).map((a) => carga.get(a.id) ?? 0);
    expect(Math.max(...internos)).toBeLessThanOrEqual(10);
    expect(Math.max(...internos) - Math.min(...internos)).toBeLessThanOrEqual(3);
  });

  it("vagas insuficientes: informa quantas faltam", () => {
    const r = planejarDistribuicao(ps118, avaliadores({ [EXT]: 10, IFPI: 5, UFPI: 5 }));
    expect(r.ok).toBe(false);
    expect(!r.ok && r.faltam).toBe(36);
    expect(!r.ok && r.erro).toMatch(/236/);
  });

  it("sem avaliadores de outra instituição para alguém: recusa", () => {
    const ps = participantes({ IFPI: 5 });
    const r = planejarDistribuicao(ps, avaliadores({ IFPI: 3, UFPI: 1 }));
    expect(r.ok).toBe(false);
    expect(!r.ok && r.erro).toMatch(/instituição diferente/);
  });

  it("avaliador sem instituição cadastrada impede a distribuição", () => {
    const avs = [...avaliadores({ [EXT]: 30 }), { id: "x", instituicaoId: null, externo: false }];
    const r = planejarDistribuicao(ps118, avs);
    expect(!r.ok && r.erro).toMatch(/sem instituição/);
  });

  it("respeita a carga que o avaliador já tem", () => {
    const ps = participantes({ IFPI: 10 });
    const avs: AvaliadorDistribuicao[] = [
      { id: "e1", instituicaoId: EXT, externo: true, carga: 8 },
      { id: "e2", instituicaoId: EXT, externo: true },
      { id: "u1", instituicaoId: "UFPI", externo: false },
    ];
    const r = planejarDistribuicao(ps, avs);
    const carga = conferir(ps, avs, r);
    expect(carga.get("e1") ?? 0).toBeLessThanOrEqual(2);
  });

  it("caso apertado: capacidade exata ainda é resolvida (o guloso poderia falhar)", () => {
    const ps = participantes({ A: 5, B: 5 });
    const avs = avaliadores({ A: 1, B: 1 }); // só cruzado: A avalia B e vice-versa → 10 vagas para 20 → falta
    expect(planejarDistribuicao(ps, avs).ok).toBe(false);
    const avs2 = avaliadores({ A: 2, B: 2 }); // 40 vagas, mas cada lado só pode receber da outra instituição: 20 + 20
    conferir(ps, avs2, planejarDistribuicao(ps, avs2));
  });

  it("é determinística para a mesma semente", () => {
    const avs = avaliadores({ [EXT]: 12, IFPI: 6, UFPI: 6, UFDPAR: 3, UESPI: 2 });
    const a = planejarDistribuicao(ps118, avs, { semente: 7 });
    const b = planejarDistribuicao(ps118, avs, { semente: 7 });
    expect(a).toEqual(b);
  });

  it("reconhece a instituição EXTERNO pela sigla ou pelo nome", () => {
    expect(ehExterno({ sigla: "EXTERNO" })).toBe(true);
    expect(ehExterno({ sigla: "EXT", nome: "Externo" })).toBe(true);
    expect(ehExterno({ sigla: "UFPI", nome: "Universidade Federal do Piauí" })).toBe(false);
    expect(ehExterno(null)).toBe(false);
  });
});

describe("3º avaliador", () => {
  const c = (avaliadorId: string, instituicaoId: string | null, total: number, externo = false, pendentes = 0) => ({ avaliadorId, instituicaoId, externo, total, pendentes });

  it("instituição diferente, com vaga e fora dos dois primeiros", () => {
    const cand = [c("a", "IFPI", 2), c("b", "UFPI", 10), c("d", "UFPI", 5), c("e", null, 0), c("f", "UFPI", 6)];
    expect(escolherTerceiro(cand, "IFPI", ["d"])).toBe("f");
  });

  it("menor carga primeiro; empate: externo", () => {
    expect(escolherTerceiro([c("x", "UFPI", 4), c("y", "EXT", 4, true)], "IFPI", [])).toBe("y");
    expect(escolherTerceiro([c("x", "UFPI", 3), c("y", "EXT", 4, true)], "IFPI", [])).toBe("x");
  });

  it("ninguém elegível: null", () => {
    expect(escolherTerceiro([c("a", "IFPI", 0), c("b", "UFPI", 10)], "IFPI", [])).toBeNull();
  });
});

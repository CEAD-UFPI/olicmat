import { planejarDistribuicao, planejarRedistribuicao, type AvaliadorRedistribuicao, type VagaMovel } from "./fase2-distribuicao.js";

const EXT = "inst-externo";
const parts = (por: Record<string, number>) =>
  Object.entries(por).flatMap(([inst, n]) => Array.from({ length: n }, (_, i) => ({ id: `${inst}-p${i}`, instituicaoId: inst })));
const avs = (por: Record<string, number>, pref = "a") =>
  Object.entries(por).flatMap(([inst, n]) => Array.from({ length: n }, (_, i) => ({ id: `${pref}-${inst}-${i}`, instituicaoId: inst, externo: inst === EXT })));

/** Monta o cenário pós-distribuição: vagas móveis + mapa de quem já tem cada participante. */
function cenario(ps: ReturnType<typeof parts>, iniciais: ReturnType<typeof avs>, concluidas = new Set<string>()) {
  const r = planejarDistribuicao(ps, iniciais, { semente: 3 });
  if (!r.ok) throw new Error(r.erro);
  const inst = new Map(ps.map((p) => [p.id, p.instituicaoId]));
  const ja = new Map<string, Set<string>>();
  const vagas: VagaMovel[] = [];
  const fixa: Record<string, number> = {};
  r.atribuicoes.forEach((a, k) => {
    ja.set(a.inscricaoId, new Set([...(ja.get(a.inscricaoId) ?? []), a.avaliadorId]));
    const id = `atr${k}`;
    if (concluidas.has(id)) fixa[a.avaliadorId] = (fixa[a.avaliadorId] ?? 0) + 1;
    else vagas.push({ atribuicaoId: id, inscricaoId: a.inscricaoId, participanteInstituicaoId: inst.get(a.inscricaoId)!, ordem: a.ordem, avaliadorAtualId: a.avaliadorId });
  });
  return { r, vagas, ja, fixa, inst };
}

function conferir(vagas: VagaMovel[], ja: Map<string, Set<string>>, todos: AvaliadorRedistribuicao[], res: ReturnType<typeof planejarRedistribuicao>, fixas: Array<{ inscricaoId: string; avaliadorId: string }> = []) {
  if (!res.ok) throw new Error(res.erro);
  const avMap = new Map(todos.map((a) => [a.id, a]));
  const final = vagas.map((v) => ({ ...v, avaliadorId: res.movimentos.find((m) => m.atribuicaoId === v.atribuicaoId)?.para ?? v.avaliadorAtualId }));
  const porPart = new Map<string, string[]>();
  for (const f of [...final, ...fixas]) porPart.set(f.inscricaoId, [...(porPart.get(f.inscricaoId) ?? []), f.avaliadorId]);
  for (const l of porPart.values()) expect(new Set(l).size).toBe(l.length);
  for (const m of res.movimentos) {
    const v = vagas.find((x) => x.atribuicaoId === m.atribuicaoId)!;
    expect(avMap.get(m.para)!.instituicaoId).not.toBe(v.participanteInstituicaoId);
    expect(ja.get(v.inscricaoId)!.has(m.para)).toBe(false);
    expect(avMap.get(m.para)!.recebe).toBe(true);
  }
  for (const c of Object.values(res.cargasDepois)) expect(c).toBeLessThanOrEqual(10);
  return final;
}

describe("redistribuição das avaliações pendentes", () => {
  const ps = parts({ IFPI: 50, UFPI: 35, UFDPAR: 23, UESPI: 10 });
  const iniciais = avs({ [EXT]: 12, IFPI: 5, UFPI: 4, UFDPAR: 2, UESPI: 1 }); // 24 × 10 = 240 (quase cheio)

  it("novos avaliadores (antes sem nenhum) passam a receber; regras mantidas; 1º continua externo", () => {
    const { vagas, ja } = cenario(ps, iniciais);
    const novos = avs({ [EXT]: 3, IFPI: 3, UFPI: 2 }, "novo");
    const todos: AvaliadorRedistribuicao[] = [...iniciais, ...novos].map((a) => ({ ...a, cargaFixa: 0, recebe: true }));
    const res = planejarRedistribuicao(vagas, todos, ja);
    const final = conferir(vagas, ja, todos, res);
    if (!res.ok) return;
    for (const n of novos) expect(res.cargasDepois[n.id]).toBeGreaterThan(0);
    const ext = new Set(todos.filter((a) => a.externo).map((a) => a.id));
    expect(final.filter((f) => f.ordem === 1).every((f) => ext.has(f.avaliadorId))).toBe(true);
    const internos = todos.filter((a) => !a.externo).map((a) => res.cargasDepois[a.id]);
    expect(Math.max(...internos) - Math.min(...internos)).toBeLessThanOrEqual(2);
  });

  it("concluídas e com rascunho não saem; quem já teve o participante não o recebe de novo", () => {
    const concl = new Set(Array.from({ length: 60 }, (_, i) => `atr${i}`));
    const { r, vagas, ja, fixa } = cenario(ps, iniciais, concl);
    const novos = avs({ UFPI: 3 }, "novo");
    const todos: AvaliadorRedistribuicao[] = [...iniciais, ...novos].map((a) => ({ ...a, cargaFixa: fixa[a.id] ?? 0, recebe: true }));
    const res = planejarRedistribuicao(vagas, todos, ja);
    const fixas = r.atribuicoes.filter((_, k) => concl.has(`atr${k}`));
    conferir(vagas, ja, todos, res, fixas);
    if (res.ok) for (const m of res.movimentos) expect(concl.has(m.atribuicaoId)).toBe(false);
  });

  it("já equilibrado: nada muda", () => {
    const { vagas, ja } = cenario(ps, iniciais);
    const todos: AvaliadorRedistribuicao[] = iniciais.map((a) => ({ ...a, cargaFixa: 0, recebe: true }));
    const res = planejarRedistribuicao(vagas, todos, ja);
    expect(res.ok && res.movimentos.length).toBe(0);
  });

  it("só recebe quem foi selecionado", () => {
    const { vagas, ja } = cenario(ps, iniciais);
    const novos = avs({ UFPI: 2 }, "novo");
    const todos: AvaliadorRedistribuicao[] = [
      ...iniciais.map((a) => ({ ...a, cargaFixa: 0, recebe: true })),
      { ...novos[0], cargaFixa: 0, recebe: true },
      { ...novos[1], cargaFixa: 0, recebe: false },
    ];
    const res = planejarRedistribuicao(vagas, todos, ja);
    expect(res.ok && res.cargasDepois[novos[1].id]).toBe(0);
    expect(res.ok && res.cargasDepois[novos[0].id]).toBeGreaterThan(0);
  });

  it("corrige atribuição inválida (mesma instituição) quando há alternativa", () => {
    const vagas: VagaMovel[] = [{ atribuicaoId: "x", inscricaoId: "p1", participanteInstituicaoId: "IFPI", ordem: 2, avaliadorAtualId: "ifpi" }];
    const todos: AvaliadorRedistribuicao[] = [
      { id: "ifpi", instituicaoId: "IFPI", externo: false, cargaFixa: 0, recebe: true },
      { id: "ufpi", instituicaoId: "UFPI", externo: false, cargaFixa: 5, recebe: true },
    ];
    const res = planejarRedistribuicao(vagas, todos, new Map([["p1", new Set(["ifpi", "e1"])]]));
    expect(res.ok && res.movimentos).toEqual([{ atribuicaoId: "x", inscricaoId: "p1", ordem: 2, de: "ifpi", para: "ufpi" }]);
  });
});

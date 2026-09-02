import { shuffleIds, permutacaoAlternativas } from "./shuffle.js";

describe("shuffle (embaralhamento determinístico anti-cola)", () => {
  it("é determinístico para o mesmo seed", () => {
    const ids = ["q1", "q2", "q3", "q4", "q5"];
    expect(shuffleIds("aluno-1", ids)).toEqual(shuffleIds("aluno-1", ids));
  });

  it("preserva o conjunto de IDs (apenas reordena)", () => {
    const ids = ["q1", "q2", "q3", "q4", "q5"];
    const shuffled = shuffleIds("aluno-1", ids);
    expect([...shuffled].sort()).toEqual([...ids].sort());
    expect(shuffled).toHaveLength(ids.length);
  });

  it("permutacaoAlternativas retorna uma permutação de A–E", () => {
    const perm = permutacaoAlternativas("aluno-1:q1");
    expect([...perm].sort()).toEqual(["A", "B", "C", "D", "E"]);
    expect(new Set(perm).size).toBe(5);
  });

  it("seeds distintos produzem ordens distintas (anti-cola entre carteiras)", () => {
    const ids = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"];
    const a = shuffleIds("aluno-a", ids);
    const b = shuffleIds("aluno-b", ids);
    expect(a.join(",")).not.toEqual(b.join(","));
  });
});

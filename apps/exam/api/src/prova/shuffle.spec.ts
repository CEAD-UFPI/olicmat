import { permutacaoAlternativas } from "./shuffle.js";

describe("permutacaoAlternativas (embaralhamento determinístico anti-cola)", () => {
  it("é determinística para o mesmo seed", () => {
    expect(permutacaoAlternativas("i1:q1")).toEqual(permutacaoAlternativas("i1:q1"));
  });

  it("retorna uma permutação de A–E", () => {
    expect([...permutacaoAlternativas("i1:q1")].sort()).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("varia entre participantes", () => {
    const ordens = new Set(
      Array.from({ length: 50 }, (_, i) => permutacaoAlternativas(`i${i}:q1`).join("")),
    );
    expect(ordens.size).toBeGreaterThan(10);
  });
});

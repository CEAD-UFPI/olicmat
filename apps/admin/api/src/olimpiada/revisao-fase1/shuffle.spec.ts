import { permutacaoAlternativas } from "./shuffle.js";
import { permutacaoAlternativas as doExam } from "../../../../../exam/api/src/prova/shuffle.js";

describe("cópia do embaralhamento do exam-app", () => {
  it("gera exatamente a mesma permutação que o exam-app", () => {
    for (let i = 0; i < 2000; i++) {
      const seed = `${Math.random().toString(36).slice(2)}:${i}`;
      expect(permutacaoAlternativas(seed)).toEqual(doExam(seed));
    }
  });
});

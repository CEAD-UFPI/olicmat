import { montarRevisao, type QuestaoGabarito } from "./revisao-fase1.logic.js";
import { permutacaoAlternativas } from "./shuffle.js";
import { estaCorreta } from "../../../scripts/corrigir-fase1.logic.js";

const q = (id: string, ordem: number, correta: string | null = "C"): QuestaoGabarito => ({
  id, ordem, enunciado: `Enunciado ${id}`, correta,
  alternativaA: `${id}-A`, alternativaB: `${id}-B`, alternativaC: `${id}-C`, alternativaD: `${id}-D`, alternativaE: `${id}-E`,
});

describe("montarRevisao", () => {
  const insc = "insc-1";

  it("mostra as alternativas na ordem embaralhada que o participante viu", () => {
    const r = montarRevisao(insc, [q("q1", 1)], new Map());
    const perm = permutacaoAlternativas(`${insc}:q1`);
    expect(r.itens[0].alternativas.map((a) => a.texto)).toEqual(perm.map((l) => `q1-${l}`));
    expect(r.itens[0].alternativas.map((a) => a.letra)).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("a letra correta exibida aponta para o texto da alternativa correta canônica", () => {
    const r = montarRevisao(insc, [q("q1", 1, "D")], new Map());
    const item = r.itens[0];
    expect(item.alternativas.find((a) => a.letra === item.correta)!.texto).toBe("q1-D");
  });

  it("acerto coincide com a correção oficial (corrigir-fase1) para todas as letras", () => {
    for (const correta of ["A", "B", "C", "D", "E"]) {
      for (const marcada of ["A", "B", "C", "D", "E"]) {
        const r = montarRevisao(insc, [q("qx", 1, correta)], new Map([["qx", marcada]]));
        expect(r.itens[0].acertou).toBe(estaCorreta(insc, "qx", marcada, correta));
      }
    }
  });

  it("ordena pela ordem da prova, conta acertos e trata questão em branco", () => {
    const qs = [q("q2", 2), q("q1", 1)];
    const certaQ1 = montarRevisao(insc, [q("q1", 1)], new Map()).itens[0].correta;
    const r = montarRevisao(insc, qs, new Map([["q1", certaQ1]]));
    expect(r.itens.map((x) => x.enunciado)).toEqual(["Enunciado q1", "Enunciado q2"]);
    expect(r.itens[1].marcada).toBeNull();
    expect(r.itens[1].acertou).toBe(false);
    expect(r).toMatchObject({ acertos: 1, total: 2 });
  });

  it("recusa questão sem gabarito", () => {
    expect(() => montarRevisao(insc, [q("q1", 1, null)], new Map())).toThrow(/gabarito/);
  });
});

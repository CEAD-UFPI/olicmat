import { planejarRemanejamentoLote, type AvaliadorLote, type VagaMovel } from "./fase2-distribuicao.js";

const EXT = "EXT";
const av = (id: string, inst: string, carga: number, concluidas = 0): AvaliadorLote => ({ id, nome: id, instituicaoId: inst, externo: inst === EXT, carga, concluidas });

/** Cria n vagas pendentes de um avaliador, com participantes da instituição dada. */
let seq = 0;
function vagasDe(avaliadorId: string, n: number, partInst = "IFPI", ordem = 2): VagaMovel[] {
  return Array.from({ length: n }, () => {
    const k = seq++;
    return { atribuicaoId: `atr${String(k).padStart(4, "0")}`, inscricaoId: `p${k}`, participanteInstituicaoId: partInst, ordem, avaliadorAtualId: avaliadorId };
  });
}
const mapaJa = (vagas: VagaMovel[]) => new Map(vagas.map((v) => [v.inscricaoId, new Set([v.avaliadorAtualId])]));

describe("remanejamento por quantidade", () => {
  it("o pedido da Comissão: Luzia→Beto 3, Luzia→Breno 2, ociosos→Breno 1, qualquer→Anísia 4, Gilvan 4, Rubens 3", () => {
    const avaliadores = [
      av("Luzia", EXT, 10), av("Beto", EXT, 2), av("Breno", "UFPI", 3),
      av("Anisia", EXT, 0), av("Gilvan", "UESPI", 1), av("Rubens", "UFDPAR", 2),
      av("Parado", EXT, 9, 0), av("Ativo", "UFPI", 9, 5),
    ];
    const vagas = [...vagasDe("Luzia", 10), ...vagasDe("Parado", 9), ...vagasDe("Ativo", 4, "UESPI")];
    const r = planejarRemanejamentoLote(
      [
        { de: "Luzia", para: "Beto", quantidade: 3 },
        { de: "Luzia", para: "Breno", quantidade: 2 },
        { de: "OCIOSOS", para: "Breno", quantidade: 1 },
        { de: "QUALQUER", para: "Anisia", quantidade: 4 },
        { de: "QUALQUER", para: "Gilvan", quantidade: 4 },
        { de: "QUALQUER", para: "Rubens", quantidade: 3 },
      ],
      vagas, avaliadores, mapaJa(vagas),
    );
    expect(r.resultados.map((x) => x.feitos)).toEqual([3, 2, 1, 4, 4, 3]);
    expect(r.resultados[0].movimentos.every((m) => m.de === "Luzia" && m.para === "Beto")).toBe(true);
    expect(r.resultados[2].movimentos[0].de).toBe("Parado"); // quem não concluiu nenhuma
    expect(r.cargasDepois).toMatchObject({ Luzia: expect.any(Number), Beto: 5, Breno: 6, Anisia: 4, Gilvan: 5, Rubens: 5 });
    // ninguém recebeu da própria instituição: Gilvan (UESPI) não recebe participantes da UESPI
    const vagaPorId = new Map(vagas.map((v) => [v.atribuicaoId, v]));
    for (const m of r.resultados[4].movimentos) expect(vagaPorId.get(m.atribuicaoId)!.participanteInstituicaoId).not.toBe("UESPI");
    // "qualquer" tira primeiro de quem tem mais pendências
    expect(r.resultados[3].movimentos[0].de).toMatch(/Luzia|Parado/);
  });

  it("respeita o limite de 10 do destino e informa o motivo", () => {
    const avaliadores = [av("A", EXT, 10), av("B", "UFPI", 8)];
    const vagas = vagasDe("A", 10);
    const r = planejarRemanejamentoLote([{ de: "A", para: "B", quantidade: 5 }], vagas, avaliadores, mapaJa(vagas));
    expect(r.resultados[0].feitos).toBe(2);
    expect(r.resultados[0].motivo).toMatch(/já tem 10/);
  });

  it("não entrega participante da mesma instituição nem a quem já o teve", () => {
    const avaliadores = [av("A", EXT, 3), av("B", "IFPI", 0)];
    const vagas = vagasDe("A", 3, "IFPI");
    const r = planejarRemanejamentoLote([{ de: "A", para: "B", quantidade: 2 }], vagas, avaliadores, mapaJa(vagas));
    expect(r.resultados[0].feitos).toBe(0);
    expect(r.resultados[0].motivo).toMatch(/mesma instituição/);
    const ja = mapaJa(vagas); for (const v of vagas) ja.get(v.inscricaoId)!.add("C");
    const r2 = planejarRemanejamentoLote([{ de: "A", para: "C", quantidade: 1 }], vagas, [...avaliadores, av("C", "UFPI", 0)], ja);
    expect(r2.resultados[0].feitos).toBe(0);
  });

  it("não externo recebe 2º/3º de preferência; 1º só sem alternativa (e conta)", () => {
    const avaliadores = [av("A", EXT, 4), av("B", "UFPI", 0)];
    const vagas = [...vagasDe("A", 2, "IFPI", 1), ...vagasDe("A", 2, "IFPI", 2)];
    const r = planejarRemanejamentoLote([{ de: "A", para: "B", quantidade: 3 }], vagas, avaliadores, mapaJa(vagas));
    expect(r.resultados[0].movimentos.slice(0, 2).every((m) => m.ordem === 2)).toBe(true);
    expect(r.resultados[0].primeiroNaoExterno).toBe(1);
  });

  it("DEMAIS: tira de um e espalha entre os de menor carga", () => {
    const avaliadores = [av("A", EXT, 9), av("B", "UFPI", 1), av("C", "UFMA", 2), av("D", "UECE", 6)];
    const vagas = vagasDe("A", 9);
    const r = planejarRemanejamentoLote([{ de: "A", para: "DEMAIS", quantidade: 4 }], vagas, avaliadores, mapaJa(vagas));
    expect(r.resultados[0].feitos).toBe(4);
    expect(r.cargasDepois).toMatchObject({ A: 5, D: 6 }); // D (6) não recebe: os de menor carga recebem
    expect(r.cargasDepois.B + r.cargasDepois.C).toBe(7);
    expect(Math.abs(r.cargasDepois.B - r.cargasDepois.C)).toBeLessThanOrEqual(1);
  });

  it("uma avaliação muda no máximo uma vez por rodada", () => {
    const avaliadores = [av("A", EXT, 1), av("B", EXT, 0), av("C", EXT, 0)];
    const vagas = vagasDe("A", 1);
    const r = planejarRemanejamentoLote([{ de: "A", para: "B", quantidade: 1 }, { de: "B", para: "C", quantidade: 1 }], vagas, avaliadores, mapaJa(vagas));
    expect(r.resultados.map((x) => x.feitos)).toEqual([1, 0]);
  });
});

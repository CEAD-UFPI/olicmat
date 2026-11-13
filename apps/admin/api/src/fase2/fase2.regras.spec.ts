import {
  consolidarNotas,
  distribuir,
  escolherTerceiro,
  linkValido,
  prazoDe,
  situacaoEnvio,
  totalCriterios,
} from "./fase2.regras.js";

describe("prazo e situação do envio", () => {
  const inicio = new Date("2026-11-20T09:00:00-03:00");
  const prazo = prazoDe(inicio);

  it("prazo é exatamente 24h após o início", () => {
    expect(prazo.toISOString()).toBe(new Date("2026-11-21T09:00:00-03:00").toISOString());
  });

  it("não iniciada sem início", () => {
    expect(situacaoEnvio(null, null)).toBe("NAO_INICIADA");
  });

  it("aberta no último milissegundo e no próprio prazo", () => {
    expect(situacaoEnvio(inicio, prazo, new Date(prazo.getTime() - 1))).toBe("ABERTA");
    expect(situacaoEnvio(inicio, prazo, prazo)).toBe("ABERTA");
  });

  it("encerrada 1 ms após o prazo", () => {
    expect(situacaoEnvio(inicio, prazo, new Date(prazo.getTime() + 1))).toBe("ENCERRADA");
  });
});

describe("linkValido", () => {
  it.each([
    "https://youtu.be/abc",
    "https://drive.google.com/file/d/x/view",
    "http://exemplo.com.br/video",
  ])("aceita %s", (l) => expect(linkValido(l)).toBe(true));

  it.each(["", "youtube.com/abc", "ftp://x.com/a", "javascript:alert(1)", "https://localhost/x"])(
    "recusa %s",
    (l) => expect(linkValido(l)).toBe(false),
  );
});

describe("totalCriterios", () => {
  const ok = { dominioConteudo: 25, estrategiasEnsino: 20, usoTdics: 15.5, reflexaoCritica: 10, coerenciaPedagogica: 15 };

  it("soma os critérios", () => {
    const r = totalCriterios(ok);
    expect(r.ok && r.total).toBe(85.5);
  });

  it("recusa nota acima do máximo do critério", () => {
    const r = totalCriterios({ ...ok, usoTdics: 21 });
    expect(r.ok).toBe(false);
  });

  it("recusa critério ausente ou negativo", () => {
    expect(totalCriterios({ ...ok, reflexaoCritica: undefined }).ok).toBe(false);
    expect(totalCriterios({ ...ok, reflexaoCritica: -1 }).ok).toBe(false);
  });
});

describe("consolidarNotas", () => {
  it("aguarda enquanto houver menos de 2 notas", () => {
    expect(consolidarNotas([80])).toEqual({ situacao: "AGUARDANDO" });
  });

  it("média quando a diferença é até 20", () => {
    expect(consolidarNotas([70, 90])).toEqual({ situacao: "FINAL", nota: 80 });
  });

  it("pede 3º avaliador quando a diferença passa de 20", () => {
    expect(consolidarNotas([60, 80.5]).situacao).toBe("PRECISA_TERCEIRO");
  });

  it("com 3 notas, média das duas mais próximas", () => {
    expect(consolidarNotas([50, 90, 85])).toEqual({ situacao: "FINAL", nota: 87.5 });
    expect(consolidarNotas([40, 70, 45])).toEqual({ situacao: "FINAL", nota: 42.5 });
  });

  it("empate entre pares: fica o de maior média", () => {
    // 50–75 (25), 75–100 (25): escolhe 75–100.
    expect(consolidarNotas([50, 100, 75])).toEqual({ situacao: "FINAL", nota: 87.5 });
  });
});

describe("distribuir", () => {
  const parts = Array.from({ length: 182 }, (_, i) => `p${i}`);
  const avs = ["a", "b", "c", "d", "e"];

  it("2 avaliadores distintos por participante", () => {
    const r = distribuir(parts, avs);
    expect(r).toHaveLength(364);
    for (const p of parts) {
      const dele = r.filter((x) => x.inscricaoId === p);
      expect(dele).toHaveLength(2);
      expect(dele[0].avaliadorId).not.toBe(dele[1].avaliadorId);
    }
  });

  it("cargas diferem no máximo em 1", () => {
    const r = distribuir(parts, avs);
    const cargas = avs.map((a) => r.filter((x) => x.avaliadorId === a).length);
    expect(Math.max(...cargas) - Math.min(...cargas)).toBeLessThanOrEqual(1);
  });

  it("funciona com 2 avaliadores", () => {
    const r = distribuir(["p1", "p2", "p3"], ["a", "b"]);
    expect(r.filter((x) => x.avaliadorId === "a")).toHaveLength(3);
  });

  it("exige ao menos 2 avaliadores distintos", () => {
    expect(() => distribuir(parts, ["a"])).toThrow();
    expect(() => distribuir(parts, ["a", "a"])).toThrow();
  });
});

describe("escolherTerceiro", () => {
  it("menor carga pendente, fora dos dois primeiros", () => {
    const c = [
      { avaliadorId: "a", pendentes: 0, total: 10 },
      { avaliadorId: "b", pendentes: 1, total: 10 },
      { avaliadorId: "c", pendentes: 2, total: 10 },
    ];
    expect(escolherTerceiro(c, ["a"])).toBe("b");
    expect(escolherTerceiro(c, ["a", "b", "c"])).toBeNull();
  });
});

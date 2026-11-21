import {
  consolidarNotas,
  linkValido,
  prazoDe,
  situacaoEnvio,
  totalCriterios,
  ESCALA,
  CRITERIOS,
  pontosDoConceito,
  validarArquivo,
  planoDePartes,
  limitesMb,
  chaveFinalDe,
  nomeFinalDe,
  bloqueioDeEnvio,
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

describe("totalCriterios (conceitos 0 a 5 → pontos 0 a 20)", () => {
  const ok = { criterio1: 5, criterio2: 4, criterio3: 3, criterio4: 2, criterio5: 1 };

  it("converte proporcionalmente (conceito × 4) e soma", () => {
    const r = totalCriterios(ok);
    expect(r.ok && r.total).toBe(60);
  });

  it("nota máxima é 100 e mínima é 0", () => {
    const max = totalCriterios({ criterio1: 5, criterio2: 5, criterio3: 5, criterio4: 5, criterio5: 5 });
    const min = totalCriterios({ criterio1: 0, criterio2: 0, criterio3: 0, criterio4: 0, criterio5: 0 });
    expect(max.ok && max.total).toBe(100);
    expect(min.ok && min.total).toBe(0);
  });

  it("devolve os conceitos como informados", () => {
    const r = totalCriterios(ok);
    expect(r.ok && r.notas).toEqual(ok);
  });

  it.each([6, -1, 2.5, "3", NaN])("recusa conceito %p", (v) => {
    expect(totalCriterios({ ...ok, criterio3: v }).ok).toBe(false);
  });

  it("recusa critério ausente", () => {
    expect(totalCriterios({ ...ok, criterio5: undefined }).ok).toBe(false);
    expect(totalCriterios({ ...ok, criterio5: null }).ok).toBe(false);
  });

  it("a escala tem 6 conceitos que valem 0, 4, 8, 12, 16 e 20 pontos", () => {
    expect(ESCALA.map((e) => pontosDoConceito(e.conceito))).toEqual([0, 4, 8, 12, 16, 20]);
    expect(ESCALA.map((e) => e.pontos)).toEqual([0, 4, 8, 12, 16, 20]);
    expect(CRITERIOS.reduce((s, c) => s + c.max, 0)).toBe(100);
  });
});

describe("upload dos arquivos", () => {
  const lim = { video: 4096, portfolio: 10 };
  const MB = 1024 * 1024;

  it("aceita vídeo e PDF dentro do limite", () => {
    expect(validarArquivo("video", "Aula Final.MP4", 390 * MB, lim)).toBeNull();
    expect(validarArquivo("portfolio", "portfolio.pdf", 3 * MB, lim)).toBeNull();
  });

  it("recusa formato errado, vazio e acima do limite", () => {
    expect(validarArquivo("video", "aula.pdf", MB, lim)).toMatch(/Formato/);
    expect(validarArquivo("portfolio", "portfolio.docx", MB, lim)).toMatch(/PDF/);
    expect(validarArquivo("portfolio", "p.pdf", 0, lim)).toMatch(/vazio/);
    expect(validarArquivo("video", "a.mp4", 4097 * MB, lim)).toMatch(/4 GB/);
    expect(validarArquivo("portfolio", "p.pdf", 11 * MB, lim)).toMatch(/10 MB/);
  });

  it("partes de 8 MB, nunca mais de 10.000", () => {
    expect(planoDePartes(1)).toEqual({ tamanhoParte: 8 * MB, partes: 1 });
    expect(planoDePartes(3 * 1024 * MB).partes).toBe(384);
    const grande = planoDePartes(200 * 1024 * MB);
    expect(grande.partes).toBeLessThanOrEqual(10_000);
  });

  it("limites vêm do ambiente, com padrão", () => {
    expect(limitesMb({})).toEqual({ video: 4096, portfolio: 10 });
    expect(limitesMb({ FASE2_VIDEO_MAX_MB: "2048", FASE2_PORTFOLIO_MAX_MB: "x" })).toEqual({ video: 2048, portfolio: 10 });
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

describe("compressão", () => {
  it("chave e nome da versão final", () => {
    expect(chaveFinalDe("fase2/e/i/video-1-ab.MOV")).toBe("fase2/e/i/video-1-ab.final.mp4");
    expect(chaveFinalDe("fase2/e.x/i/video-1")).toBe("fase2/e.x/i/video-1.final.mp4");
    expect(nomeFinalDe("Minha aula.final.MOV")).toBe("Minha aula.final.mp4");
  });
});

describe("envio único", () => {
  const nada = { videoKey: null, portfolioKey: null };
  it("permite o primeiro envio de cada arquivo", () => {
    expect(bloqueioDeEnvio("video", null)).toBeNull();
    expect(bloqueioDeEnvio("portfolio", nada)).toBeNull();
    expect(bloqueioDeEnvio("video", { videoKey: null, portfolioKey: "p" })).toBeNull();
    expect(bloqueioDeEnvio("portfolio", { videoKey: "v", portfolioKey: null })).toBeNull();
  });
  it("bloqueia o segundo envio do mesmo arquivo", () => {
    expect(bloqueioDeEnvio("video", { videoKey: "v", portfolioKey: null })).toMatch(/videoaula/);
    expect(bloqueioDeEnvio("portfolio", { videoKey: null, portfolioKey: "p" })).toMatch(/portfólio/);
  });
  it("reenvio liberado pela Comissão", () => {
    expect(bloqueioDeEnvio("portfolio", { videoKey: "v", portfolioKey: "p" }, false, true)).toBeNull();
    expect(bloqueioDeEnvio("video", { videoKey: "v", portfolioKey: "p" }, false, true)).toBeNull();
  });
  it("libera o reenvio do vídeo que falhou definitivamente (só o vídeo)", () => {
    expect(bloqueioDeEnvio("video", { videoKey: "v", portfolioKey: "p" }, true)).toBeNull();
    expect(bloqueioDeEnvio("portfolio", { videoKey: "v", portfolioKey: "p" }, true)).not.toBeNull();
  });
});

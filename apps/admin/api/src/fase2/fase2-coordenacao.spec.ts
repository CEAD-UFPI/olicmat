import { situacaoVideo } from "./fase2-coordenacao.service.js";

const info = (status: string, tentativas = 1) => ({ status, tentativas } as never);

describe("situação do vídeo para o coordenador", () => {
  it("sem envio é pendente; link é pronto", () => {
    expect(situacaoVideo(null, null)).toBe("PENDENTE");
    expect(situacaoVideo(null, "https://x")).toBe("PRONTO");
  });
  it("na fila ou com falha ainda em nova tentativa é 'preparando'", () => {
    expect(situacaoVideo("k", null)).toBe("PREPARANDO");
    expect(situacaoVideo("k", null, info("PENDENTE"))).toBe("PREPARANDO");
    expect(situacaoVideo("k", null, info("FALHA", 1))).toBe("PREPARANDO");
  });
  it("pronto e falha definitiva", () => {
    expect(situacaoVideo("k", null, info("PRONTO"))).toBe("PRONTO");
    expect(situacaoVideo("k", null, info("FALHA", 3))).toBe("FALHA");
  });
});

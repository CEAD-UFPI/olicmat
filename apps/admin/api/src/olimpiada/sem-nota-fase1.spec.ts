import { semNotaFase1 } from "./sem-nota-fase1.js";

describe("semNotaFase1", () => {
  it("remove a nota da Fase 1 e preserva os demais campos", () => {
    const r = semNotaFase1({ id: "i1", fase1Nota: 72.5, fase1Fim: "fim", status: "CONFIRMADA" });
    expect(r).toEqual({ id: "i1", fase1Fim: "fim", status: "CONFIRMADA" });
    expect(r).not.toHaveProperty("fase1Nota");
  });

  it("devolve null quando não há inscrição", () => {
    expect(semNotaFase1(null)).toBeNull();
  });
});

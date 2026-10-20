import { BadRequestException } from "@nestjs/common";
import {
  exigirFase2Liberada,
  fase2Liberada,
  fase2LiberadaEm,
  FASE2_LIBERADA_EM_PADRAO,
} from "./fase2-liberacao.js";

describe("liberação da Fase 2", () => {
  const original = process.env.FASE2_LIBERADA_EM;
  afterEach(() => {
    if (original === undefined) delete process.env.FASE2_LIBERADA_EM;
    else process.env.FASE2_LIBERADA_EM = original;
  });

  it("fica bloqueada antes da data da convocação", () => {
    delete process.env.FASE2_LIBERADA_EM;
    expect(fase2Liberada(new Date("2026-11-10T23:59:59-03:00"))).toBe(false);
    expect(() => exigirFase2Liberada(new Date("2026-10-19T12:00:00-03:00"))).toThrow(
      BadRequestException,
    );
  });

  it("a mensagem informa a data da convocação", () => {
    delete process.env.FASE2_LIBERADA_EM;
    expect(() => exigirFase2Liberada(new Date("2026-10-19T12:00:00-03:00"))).toThrow(
      /11\/11\/2026/,
    );
  });

  it("abre na data da convocação e depois dela", () => {
    delete process.env.FASE2_LIBERADA_EM;
    expect(fase2Liberada(new Date("2026-11-11T00:00:00-03:00"))).toBe(true);
    expect(() => exigirFase2Liberada(new Date("2026-11-12T10:00:00-03:00"))).not.toThrow();
  });

  it("aceita ajuste da data por variável de ambiente", () => {
    process.env.FASE2_LIBERADA_EM = "2026-12-01T00:00:00-03:00";
    expect(fase2Liberada(new Date("2026-11-20T00:00:00-03:00"))).toBe(false);
    expect(fase2Liberada(new Date("2026-12-01T00:00:00-03:00"))).toBe(true);
  });

  it("ignora valor inválido e usa a data padrão", () => {
    process.env.FASE2_LIBERADA_EM = "isto-nao-e-data";
    expect(fase2LiberadaEm().toISOString()).toBe(new Date(FASE2_LIBERADA_EM_PADRAO).toISOString());
  });
});

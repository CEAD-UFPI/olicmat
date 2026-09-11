import { criarInscricaoSchema } from "./inscricao.dto.js";

describe("criarInscricaoSchema", () => {
  const base = {
    estado: "PI",
    municipio: "Teresina",
  };

  it("trata instituicao/curso vazios como ausentes (frontend antigo)", () => {
    const result = criarInscricaoSchema.safeParse({
      ...base,
      instituicao: "",
      curso: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.instituicao).toBeUndefined();
      expect(result.data.curso).toBeUndefined();
    }
  });

  it("trata instituicao/curso só-com-espacos como ausentes", () => {
    const result = criarInscricaoSchema.safeParse({
      ...base,
      instituicao: "   ",
      curso: "\t",
    });

    expect(result.success).toBe(true);
  });

  it("continua rejeitando instituicao/curso com menos de 2 caracteres", () => {
    const result = criarInscricaoSchema.safeParse({
      ...base,
      instituicao: "A",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.instituicao).toEqual([
        "Instituição é obrigatória",
      ]);
    }
  });

  it("aceita instituicao/curso válidos", () => {
    const result = criarInscricaoSchema.safeParse({
      ...base,
      instituicao: "UFPI",
      curso: "Matemática",
    });

    expect(result.success).toBe(true);
  });
});

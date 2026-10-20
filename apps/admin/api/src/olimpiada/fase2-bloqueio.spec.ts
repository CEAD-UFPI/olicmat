import { jest } from "@jest/globals";
import { BadRequestException } from "@nestjs/common";
import { EnvioService } from "./envio/envio.service.js";
import { InscricaoService } from "./inscricao/inscricao.service.js";

/**
 * Antes da convocação, nenhuma ação da Fase 2 pode sequer consultar o banco:
 * consultar a nota para recusar já seria um jeito de o participante descobrir
 * se passou.
 */
describe("Fase 2 bloqueada antes da convocação", () => {
  const original = process.env.FASE2_LIBERADA_EM;
  beforeEach(() => {
    process.env.FASE2_LIBERADA_EM = "2999-01-01T00:00:00-03:00";
  });
  afterEach(() => {
    if (original === undefined) delete process.env.FASE2_LIBERADA_EM;
    else process.env.FASE2_LIBERADA_EM = original;
  });

  const prisma: any = {
    inscricao: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    envioFase2: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  };
  const upload: any = { uploadPortfolio: jest.fn(), upload: jest.fn() };

  it("enviar link do vídeo", async () => {
    const service = new EnvioService(prisma, upload);
    await expect(service.enviarVideoLink("u1", "https://exemplo.com/v")).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.inscricao.findFirst).not.toHaveBeenCalled();
  });

  it("enviar portfólio (sem subir arquivo)", async () => {
    const service = new EnvioService(prisma, upload);
    await expect(
      service.uploadPortfolio("u1", {
        buffer: Buffer.from("x"), originalname: "p.pdf", mimetype: "application/pdf", size: 1,
      }),
    ).rejects.toThrow(/Fase 2 ainda não foi liberada/);
    expect(prisma.inscricao.findFirst).not.toHaveBeenCalled();
  });

  it("sortear tema", async () => {
    const service = new InscricaoService(prisma, {} as any, {} as any, {} as any);
    await expect(service.sortearTema("i1")).rejects.toThrow(/Fase 2 ainda não foi liberada/);
    expect(prisma.inscricao.findUnique).not.toHaveBeenCalled();
  });
});

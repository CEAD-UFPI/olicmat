import { jest } from "@jest/globals";
import { ConflictException } from "@nestjs/common";
import { DashboardService } from "./dashboard.service.js";

describe("DashboardService — edicoes", () => {
  let service: DashboardService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      edicao: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new DashboardService(prisma as any);
  });

  it("createEdicao lança ConflictException para ano+semestre duplicado", async () => {
    prisma.edicao.findUnique.mockResolvedValue({ id: "existing" });

    await expect(
      service.createEdicao({ ano: 2026, semestre: 1, titulo: "OLICMAT 2026.1" }),
    ).rejects.toThrow(ConflictException);

    expect(prisma.edicao.findUnique).toHaveBeenCalledWith({
      where: { ano_semestre: { ano: 2026, semestre: 1 } },
    });
    expect(prisma.edicao.create).not.toHaveBeenCalled();
  });

  it("createEdicao cria edição com datas convertidas para Date", async () => {
    prisma.edicao.findUnique.mockResolvedValue(null);
    prisma.edicao.create.mockResolvedValue({ id: "new" });

    await service.createEdicao({
      ano: 2026,
      semestre: 2,
      titulo: "OLICMAT 2026.2",
      dataInicio: "2026-08-01T00:00:00.000Z",
      dataFim: "2026-12-01T00:00:00.000Z",
    });

    const chamada = prisma.edicao.create.mock.calls[0][0];
    expect(chamada.data.ano).toBe(2026);
    expect(chamada.data.semestre).toBe(2);
    expect(chamada.data.status).toBe("PLANEJAMENTO");
    expect(chamada.data.dataInicio).toBeInstanceOf(Date);
    expect(chamada.data.dataFim).toBeInstanceOf(Date);
  });

  it("updateEdicao converte datas e repassa campos (inclusive null)", async () => {
    prisma.edicao.update.mockResolvedValue({ id: "1" });

    await service.updateEdicao("1", {
      titulo: "Novo título",
      status: "ATIVA",
      dataInicio: "2026-08-01T00:00:00.000Z",
      dataFim: null,
      pesoFase1: 0.6,
    });

    const chamada = prisma.edicao.update.mock.calls[0][0];
    expect(chamada.where.id).toBe("1");
    expect(chamada.data.titulo).toBe("Novo título");
    expect(chamada.data.status).toBe("ATIVA");
    expect(chamada.data.dataInicio).toBeInstanceOf(Date);
    expect(chamada.data.dataFim).toBeNull();
    expect(chamada.data.pesoFase1).toBe(0.6);
    expect(chamada.data.pesoFase2).toBeUndefined();
  });
});

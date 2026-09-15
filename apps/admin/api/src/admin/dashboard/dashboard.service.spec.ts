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

describe("DashboardService — getAcompanhamento", () => {
  let service: DashboardService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      convite: { count: jest.fn() },
      inscricao: { count: jest.fn() },
      edicao: { findFirst: jest.fn() },
      user: { count: jest.fn(), findMany: jest.fn() },
      instituicao: { findMany: jest.fn() },
    };
    service = new DashboardService(prisma as any);
  });

  it("monta o funil e as ações a partir das contagens", async () => {
    prisma.convite.count
      .mockResolvedValueOnce(10) // total (convidados)
      .mockResolvedValueOnce(7) // usados (cadastrados)
      .mockResolvedValueOnce(2); // expirados sem uso
    prisma.edicao.findFirst.mockResolvedValue({ id: "ed1" });
    prisma.inscricao.count
      .mockResolvedValueOnce(5) // inscritos na edição ativa
      .mockResolvedValueOnce(3) // confirmados
      .mockResolvedValueOnce(1); // pendentes
    prisma.user.count.mockResolvedValueOnce(4); // cadastradosSemInscricao
    prisma.instituicao.findMany.mockResolvedValue([]);

    const resultado = await service.getAcompanhamento();

    expect(resultado.funil).toEqual({
      convidados: 10,
      cadastrados: 7,
      inscritos: 5,
      confirmados: 3,
    });
    expect(resultado.acoes).toEqual({
      convitesExpirados: 2,
      cadastradosSemInscricao: 4,
      inscricoesPendentes: 1,
    });
    expect(prisma.convite.count).toHaveBeenNthCalledWith(3, {
      where: { usadoEm: null, expiraEm: { lt: expect.any(Date) } },
    });
  });

  it("sem edição ativa, inscritos e confirmados ficam zerados", async () => {
    prisma.convite.count.mockResolvedValue(0);
    prisma.edicao.findFirst.mockResolvedValue(null);
    prisma.inscricao.count.mockResolvedValue(0);
    prisma.user.count.mockResolvedValue(0);
    prisma.instituicao.findMany.mockResolvedValue([]);

    const resultado = await service.getAcompanhamento();

    expect(resultado.funil.inscritos).toBe(0);
    expect(resultado.funil.confirmados).toBe(0);
    expect(prisma.inscricao.count).toHaveBeenCalledTimes(1); // só a chamada de "pendentes"
  });
});

import { Test } from "@nestjs/testing";
import { NotificacoesService } from "./notificacoes.service.js";
import { PrismaService } from "../prisma.service.js";

describe("NotificacoesService", () => {
  let service: NotificacoesService;
  let prisma: {
    notificacao: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      notificacao: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [NotificacoesService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(NotificacoesService);
  });

  it("cria uma notificação com os campos esperados", async () => {
    await service.criar("user-1", "Título", "Mensagem", "/link");
    expect(prisma.notificacao.create).toHaveBeenCalledWith({
      data: { userId: "user-1", titulo: "Título", mensagem: "Mensagem", link: "/link" },
    });
  });

  it("marca uma notificação como lida somente se pertence ao usuário", async () => {
    prisma.notificacao.updateMany.mockResolvedValue({ count: 1 });
    const result = await service.marcarComoLida("notif-1", "user-1");
    expect(prisma.notificacao.updateMany).toHaveBeenCalledWith({
      where: { id: "notif-1", userId: "user-1" },
      data: { lida: true },
    });
    expect(result).toEqual({ lida: true });
  });
});

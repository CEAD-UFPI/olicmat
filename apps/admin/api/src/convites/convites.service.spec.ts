import { jest } from "@jest/globals";
import { BadRequestException } from "@nestjs/common";
import { ConvitesService } from "./convites.service.js";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(async () => "hashed"),
    compare: jest.fn(async () => true),
  },
}));

describe("ConvitesService", () => {
  let service: ConvitesService;
  let prisma: any;
  let email: any;
  let tx: any;

  beforeEach(() => {
    tx = {
      user: { create: jest.fn() },
      coordenadorCurso: { create: jest.fn() },
      convite: { update: jest.fn() },
    };
    prisma = {
      user: { findUnique: jest.fn() },
      convite: { upsert: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
      coordenadorCurso: { findFirst: jest.fn() },
      curso: { findUnique: jest.fn() },
      instituicao: { findUnique: jest.fn() },
      $transaction: jest.fn(async (fn: (t: any) => Promise<any>) => fn(tx)),
    };
    email = { enviarConvite: jest.fn(async () => undefined) };
    service = new ConvitesService(prisma as any, email as any);
  });

  describe("convidarAlunos", () => {
    it("grava criadoPorId do coordenador no convite", async () => {
      prisma.coordenadorCurso.findFirst.mockResolvedValue({ id: "v1" });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.convite.upsert.mockResolvedValue({});

      await service.convidarAlunos(
        [{ nome: "Ana", email: "ana@ufpi.edu.br", instituicaoId: "inst1" }],
        "coord1",
        "curso1",
        "coord@ufpi.edu.br",
      );

      expect(prisma.convite.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ criadoPorId: "coord1" }),
          create: expect.objectContaining({ criadoPorId: "coord1" }),
        }),
      );
    });

    it("lança BadRequestException quando o coordenador não coordena o curso", async () => {
      prisma.coordenadorCurso.findFirst.mockResolvedValue(null);

      await expect(
        service.convidarAlunos(
          [{ nome: "Ana", email: "ana@ufpi.edu.br" }],
          "coord1",
          "curso1",
          "coord@ufpi.edu.br",
        ),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.convite.upsert).not.toHaveBeenCalled();
    });
  });
});

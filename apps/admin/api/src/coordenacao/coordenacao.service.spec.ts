import { jest } from "@jest/globals";
import { ForbiddenException } from "@nestjs/common";
import { CoordenacaoService } from "./coordenacao.service.js";

describe("CoordenacaoService", () => {
  let service: CoordenacaoService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      coordenadorCurso: { findMany: jest.fn() },
      user: { findMany: jest.fn(), count: jest.fn() },
      inscricao: { findMany: jest.fn(), count: jest.fn(), groupBy: jest.fn() },
      curso: { findMany: jest.fn() },
    };
    service = new CoordenacaoService(prisma as any);
  });

  describe("listAlunos", () => {
    it("filtra alunos pelo coordenador que os convidou", async () => {
      prisma.user.findMany.mockResolvedValue([]);

      await service.listAlunos("coord1");

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { role: "ALUNO", coordenadorId: "coord1" } }),
      );
    });
  });

  describe("listInscricoes", () => {
    it("filtra inscrições pelo vínculo pessoal do coordenador", async () => {
      prisma.inscricao.findMany.mockResolvedValue([]);

      await service.listInscricoes("coord1");

      expect(prisma.inscricao.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user: { coordenadorId: "coord1" } } }),
      );
    });

    it("aplica refinamento por cursoId/status apenas sobre o próprio escopo", async () => {
      prisma.coordenadorCurso.findMany.mockResolvedValue([{ cursoId: "curso1" }]);
      prisma.inscricao.findMany.mockResolvedValue([]);

      await service.listInscricoes("coord1", { cursoId: "curso1", status: "PENDENTE" });

      expect(prisma.inscricao.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user: { coordenadorId: "coord1" }, cursoId: "curso1", status: "PENDENTE" },
        }),
      );
    });

    it("lança ForbiddenException quando o coordenador não coordena o curso filtrado", async () => {
      prisma.coordenadorCurso.findMany.mockResolvedValue([{ cursoId: "outro" }]);

      await expect(
        service.listInscricoes("coord1", { cursoId: "curso1" }),
      ).rejects.toThrow(ForbiddenException);

      expect(prisma.inscricao.findMany).not.toHaveBeenCalled();
    });
  });

  describe("listMonitoramentoInscricoes", () => {
    it("monitora apenas alunos e inscrições do vínculo pessoal", async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.inscricao.findMany.mockResolvedValue([]);

      await service.listMonitoramentoInscricoes("coord1");

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { role: "ALUNO", coordenadorId: "coord1" } }),
      );
      expect(prisma.inscricao.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user: { coordenadorId: "coord1" } } }),
      );
    });
  });

  describe("getMetricas", () => {
    it("calcula métricas sobre as inscrições do vínculo pessoal", async () => {
      prisma.inscricao.groupBy.mockResolvedValue([]);
      prisma.inscricao.count.mockResolvedValue(0);
      prisma.user.count.mockResolvedValue(0);
      prisma.curso.findMany.mockResolvedValue([]);

      await service.getMetricas("coord1");

      expect(prisma.inscricao.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user: { coordenadorId: "coord1" } } }),
      );
      expect(prisma.inscricao.count).toHaveBeenCalledWith({
        where: { user: { coordenadorId: "coord1" } },
      });
      expect(prisma.user.count).toHaveBeenCalledWith({
        where: { role: "ALUNO", coordenadorId: "coord1" },
      });
    });
  });
});

import type { PrismaService } from "../prisma.service.js";

/** Edição corrente: a mais recente (mesmo critério do ranking). */
export function edicaoAtual(prisma: PrismaService) {
  return prisma.edicao.findFirst({ orderBy: [{ ano: "desc" }, { semestre: "desc" }] });
}

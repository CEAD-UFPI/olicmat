import { z } from "zod";

export const exportInscricoesQuerySchema = z.object({
  edicaoId: z.string().uuid().optional(),
  estado: z.string().length(2).optional(),
  status: z.enum(["PENDENTE", "CONFIRMADA", "REJEITADA"]).optional(),
});

export type ExportInscricoesQuery = z.infer<typeof exportInscricoesQuerySchema>;

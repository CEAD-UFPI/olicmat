import { z } from "zod";

export const auditLogQuerySchema = z.object({
  entidade: z.string().optional(),
  acao: z.string().optional(),
  actorId: z.string().uuid().optional(),
});

export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;

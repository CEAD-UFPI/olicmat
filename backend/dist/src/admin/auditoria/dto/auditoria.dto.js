import { z } from "zod";
export const auditLogQuerySchema = z.object({
    entidade: z.string().optional(),
    acao: z.string().optional(),
    actorId: z.string().uuid().optional(),
});
//# sourceMappingURL=auditoria.dto.js.map
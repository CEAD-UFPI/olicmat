import { z } from "zod";
export declare const auditLogQuerySchema: z.ZodObject<{
    entidade: z.ZodOptional<z.ZodString>;
    acao: z.ZodOptional<z.ZodString>;
    actorId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;

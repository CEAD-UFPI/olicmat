import { z } from "zod";

export const destravarSchema = z.object({
  minutos: z.number().int().min(0).max(480),
  justificativa: z.string().trim().min(5, "Registre a justificativa"),
});

export type DestravarDto = z.infer<typeof destravarSchema>;

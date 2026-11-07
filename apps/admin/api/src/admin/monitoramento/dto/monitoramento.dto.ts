import { z } from "zod";

export const destravarSchema = z.object({
  justificativa: z.string().trim().min(5, "Registre a justificativa"),
});

export type DestravarDto = z.infer<typeof destravarSchema>;

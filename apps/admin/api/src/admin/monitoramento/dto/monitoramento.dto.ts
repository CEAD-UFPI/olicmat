import { z } from "zod";

export const adicionarTempoSchema = z.object({
  minutos: z
    .number()
    .int()
    .min(1, "Mínimo de 1 minuto")
    .max(480, "Máximo de 480 minutos"),
});

export const destravarSchema = z.object({
  minutos: z.number().int().min(0).max(480),
  justificativa: z.string().trim().min(5, "Registre a justificativa"),
});

export type DestravarDto = z.infer<typeof destravarSchema>;

export type AdicionarTempoDto = z.infer<typeof adicionarTempoSchema>;

import { z } from "zod";

export const adicionarTempoSchema = z.object({
  minutos: z
    .number()
    .int()
    .min(1, "Mínimo de 1 minuto")
    .max(480, "Máximo de 480 minutos"),
});

export type AdicionarTempoDto = z.infer<typeof adicionarTempoSchema>;

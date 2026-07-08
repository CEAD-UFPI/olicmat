import { z } from "zod";

export const avaliarEnvioSchema = z.object({
  nota: z.number().min(0, "Nota mínima é 0").max(100, "Nota máxima é 100"),
  comentario: z.string().optional(),
});

export type AvaliarEnvioDto = z.infer<typeof avaliarEnvioSchema>;

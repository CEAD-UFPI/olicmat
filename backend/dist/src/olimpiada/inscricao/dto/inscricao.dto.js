import { z } from "zod";
export const criarInscricaoSchema = z.object({
    estado: z.string().length(2, "UF deve ter 2 caracteres"),
    municipio: z.string().optional(),
    instituicao: z.string().min(2, "Instituição é obrigatória"),
    curso: z.string().min(2, "Curso é obrigatório"),
    periodo: z.number().int().min(1).max(12).optional(),
});
export const atualizarInscricaoSchema = z.object({
    status: z.enum(["PENDENTE", "CONFIRMADA", "REJEITADA"]).optional(),
    fase2Tema: z.string().optional(),
    fase2VideoUrl: z.string().url().optional(),
    fase2PortfolioUrl: z.string().url().optional(),
    fase2Nota: z.number().min(0).max(100).optional(),
});
//# sourceMappingURL=inscricao.dto.js.map
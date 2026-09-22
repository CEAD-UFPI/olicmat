import { z } from "zod";
import { aceitarConviteSchema } from "../../convites/dto/convites.dto.js";

/**
 * Papel do link gerado por Admin/Comissão. ALUNO fica de fora — só o
 * coordenador gera link de Aluno, e ADMIN não é convidável por link (mesma
 * regra de segurança que já vale para o fluxo de Convite).
 */
export const criarLinkConviteSchema = z
  .object({
    role: z.enum(["COORDENADOR_CURSO", "AVALIADOR", "COMISSAO"]),
    cursoId: z.string().uuid("Curso inválido").optional(),
  })
  .refine((d) => d.role !== "COORDENADOR_CURSO" || !!d.cursoId, {
    message: "Selecione o curso para um link de Coordenador de Curso",
    path: ["cursoId"],
  })
  .refine((d) => d.role === "COORDENADOR_CURSO" || !d.cursoId, {
    message: "Curso só se aplica a um link de Coordenador de Curso",
    path: ["cursoId"],
  });

/**
 * Cadastro público pelo link reutilizável. Reaproveita aceitarConviteSchema
 * (cpf/senha/dataNascimento/nomeMae/matricula/telefone), removendo
 * instituicaoId/cursoId — aqui eles vêm sempre do LinkConvite, nunca do
 * corpo da requisição — e acrescentando nome/email, que no fluxo de Convite
 * já vinham fixados no convite e aqui a pessoa precisa informar.
 */
export const cadastrarPorLinkSchema = aceitarConviteSchema
  .omit({ instituicaoId: true, cursoId: true })
  .extend({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z
      .string()
      .email("Email inválido")
      .transform((v) => v.toLowerCase().trim()),
  });

export type CriarLinkConviteDto = z.infer<typeof criarLinkConviteSchema>;
export type CadastrarPorLinkDto = z.infer<typeof cadastrarPorLinkSchema>;

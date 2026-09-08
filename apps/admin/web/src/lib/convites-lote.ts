/**
 * Interpretação da lista colada no convite em lote da equipe.
 *
 * Vive fora da página para poder ser exercitada isoladamente: é o ponto onde
 * um engano silencioso custa caro — uma linha lida errado vira um convite com
 * o papel errado, e papel errado é acesso indevido ao painel.
 */

export interface InstituicaoBasica {
  id: string;
  nome: string;
  sigla: string;
}

export interface LinhaConvite {
  nome: string;
  email: string;
  role: string;
  instituicaoId: string | null;
  instituicaoRotulo: string | null;
  erro?: string;
}

export const ROTULO_PAPEL: Record<string, string> = {
  COMISSAO: "Comissão",
  COORDENADOR_CURSO: "Coordenação de Curso",
  AVALIADOR: "Avaliador",
  ADMIN: "Administrador",
};

/**
 * Aceita as grafias que uma pessoa realmente digita — com ou sem acento,
 * com espaço, hífen ou sublinhado. Recusar "Comissão" por causa do til seria
 * transformar a lista num exercício de adivinhação.
 */
const PAPEIS: Record<string, string> = {
  comissao: "COMISSAO",
  comissao_organizadora: "COMISSAO",
  coordenador: "COORDENADOR_CURSO",
  coordenadora: "COORDENADOR_CURSO",
  coordenacao: "COORDENADOR_CURSO",
  coordenador_curso: "COORDENADOR_CURSO",
  coordenador_de_curso: "COORDENADOR_CURSO",
  coordenacao_de_curso: "COORDENADOR_CURSO",
  avaliador: "AVALIADOR",
  avaliadora: "AVALIADOR",
  admin: "ADMIN",
  administrador: "ADMIN",
  administradora: "ADMIN",
};

export const normalizar = (v: string): string =>
  v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");

/**
 * Uma linha por pessoa, em um destes dois formatos:
 *
 *   Nome; email; papel
 *   Nome; email; instituição; papel
 *
 * O papel é sempre o último campo — é o que distingue os dois formatos sem
 * exigir que quem digita se lembre de uma ordem arbitrária.
 */
export function interpretarLote(
  texto: string,
  instituicoes: InstituicaoBasica[],
): LinhaConvite[] {
  const vazia = (extra: Partial<LinhaConvite>): LinhaConvite => ({
    nome: "",
    email: "",
    role: "",
    instituicaoId: null,
    instituicaoRotulo: null,
    ...extra,
  });

  return texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linha) => {
      // Um separador sobrando no fim da linha é erro de digitação comum ao
      // colar de planilha; descartá-lo evita reprovar a linha por isso.
      const partes = linha.split(/[;,\t]/).map((p) => p.trim());
      while (partes.length && partes[partes.length - 1] === "") partes.pop();

      const nome = partes[0] ?? "";
      const email = (partes[1] ?? "").toLowerCase();

      if (partes.length < 3) {
        return vazia({ nome, email, erro: "informe nome, e-mail e papel" });
      }
      if (partes.length > 4) {
        return vazia({ nome, email, erro: "campos demais nesta linha" });
      }
      if (nome.length < 3) {
        return vazia({ nome, email, erro: "nome muito curto" });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return vazia({ nome, email, erro: "e-mail inválido" });
      }

      const rotuloPapel = partes[partes.length - 1];
      const role = PAPEIS[normalizar(rotuloPapel)];
      if (!role) {
        return vazia({
          nome,
          email,
          erro: `papel "${rotuloPapel}" não reconhecido`,
        });
      }

      let instituicaoId: string | null = null;
      let instituicaoRotulo: string | null = null;

      if (partes.length === 4) {
        const busca = normalizar(partes[2]);
        const achada = instituicoes.find(
          (i) => normalizar(i.sigla) === busca || normalizar(i.nome) === busca,
        );
        if (!achada) {
          return vazia({
            nome,
            email,
            role,
            erro: `instituição "${partes[2]}" não encontrada`,
          });
        }
        instituicaoId = achada.id;
        instituicaoRotulo = achada.sigla;
      }

      // Sem instituição, a coordenação escolheria sozinha onde se vincular no
      // aceite — e a contagem de participantes por instituição, que orienta a
      // classificação e as bolsas, deixaria de ser decisão da organização.
      if (role === "COORDENADOR_CURSO" && !instituicaoId) {
        return vazia({
          nome,
          email,
          role,
          erro: "coordenação exige a instituição antes do papel",
        });
      }

      return { nome, email, role, instituicaoId, instituicaoRotulo };
    });
}

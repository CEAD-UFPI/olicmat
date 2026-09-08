/**
 * Cronograma oficial da 1ª OLICMAT — fonte única.
 *
 * As datas viviam copiadas em quatro lugares (regulamento, seção da home,
 * página /cronograma e destaques do topo) e divergiram: o site anunciava a
 * Fase 1 em 21/10 enquanto o regulamento dizia 24/10, e mais quatro etapas
 * batiam diferente. Quem lia a home e quem lia o regulamento se preparava
 * para dias distintos.
 *
 * Qualquer alteração de data acontece AQUI e em nenhum outro lugar. O
 * regulamento publicado é a autoridade sobre estes valores.
 */

export interface EtapaCronograma {
  /** Identificador estável, usado para montar recortes sem repetir datas. */
  id: string;
  atividade: string;
  data: string;
  /** Marca os marcos que o participante precisa reter. */
  destaque: boolean;
}

export const CRONOGRAMA: EtapaCronograma[] = [
  {
    id: "lancamento",
    atividade: "Lançamento oficial",
    data: "19/08/2026",
    destaque: false,
  },
  {
    id: "inscricoes",
    atividade: "Período de inscrições",
    data: "01/09/2026 a 25/09/2026",
    destaque: true,
  },
  {
    id: "inscricoes-validadas",
    atividade: "Divulgação das inscrições validadas",
    data: "05/10/2026",
    destaque: false,
  },
  {
    id: "fase1",
    atividade: "Aplicação da Fase 1 (on-line)",
    data: "24/10/2026",
    destaque: true,
  },
  {
    id: "resultado-fase1",
    atividade: "Resultado da Fase 1 e convocação para a Fase 2",
    data: "30/10/2026",
    destaque: false,
  },
  {
    id: "orientacoes-fase2",
    atividade: "Divulgação das orientações da Fase 2",
    data: "05/11/2026 a 10/11/2026",
    destaque: false,
  },
  {
    id: "envio-fase2",
    atividade: "Envio dos vídeos e portfólios (Fase 2)",
    data: "18/11/2026 a 20/11/2026",
    destaque: true,
  },
  {
    id: "avaliacao-fase2",
    atividade: "Avaliação pela banca examinadora",
    data: "21/11/2026 a 29/11/2026",
    destaque: false,
  },
  {
    id: "resultado",
    atividade: "Resultado preliminar e medalhistas",
    data: "30/11/2026",
    destaque: true,
  },
  {
    id: "premiacao",
    atividade: "Cerimônia de premiação e encerramento",
    data: "04/12/2026",
    destaque: true,
  },
  {
    id: "bolsas",
    atividade: "Implementação das bolsas FAPEPI",
    data: "Dez/2026 a Jan/2027",
    destaque: false,
  },
  // As duas etapas abaixo constam do cronograma do Regulamento publicado e são
  // reproduzidas por fidelidade a ele. São eventos do programa, não módulos
  // desta plataforma: não há aqui cadastro, submissão ou certificado para eles.
  {
    id: "forpemat",
    atividade: "Realização do FORPEMAT",
    data: "Janeiro/2027",
    destaque: false,
  },
  {
    id: "congemat",
    atividade: "Realização do CONGEMAT",
    data: "Fevereiro/2027",
    destaque: false,
  },
];

const porId = (id: string): EtapaCronograma => {
  const etapa = CRONOGRAMA.find((e) => e.id === id);
  if (!etapa) {
    throw new Error(`Etapa "${id}" não existe no cronograma.`);
  }
  return etapa;
};

/**
 * Os quatro marcos exibidos no topo da home. Os rótulos são mais curtos que os
 * do cronograma completo, mas as datas vêm da mesma lista — foi justamente
 * uma segunda cópia de datas aqui que produziu a divergência anterior.
 */
export const DESTAQUES_HOME: { data: string; evento: string }[] = [
  { data: porId("inscricoes").data, evento: "Inscrições" },
  { data: porId("fase1").data, evento: "Fase 1 — Prova on-line" },
  { data: porId("envio-fase2").data, evento: "Fase 2 — Vídeos e portfólios" },
  { data: porId("resultado").data, evento: "Resultado e medalhistas" },
];

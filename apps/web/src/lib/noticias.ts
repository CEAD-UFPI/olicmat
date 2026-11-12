/**
 * Notícias da OLICMAT — fonte única.
 *
 * Para publicar uma notícia, acrescente um item a NOTICIAS (a ordem não
 * importa: a exibição é sempre da mais recente para a mais antiga). Arquivos
 * anexos ficam em public/arquivos/ e são referenciados por caminho absoluto.
 * Datas de etapas do certame vêm de lib/cronograma.ts, nunca escritas aqui.
 */
import { dataDe } from "@/lib/cronograma";

export interface AnexoNoticia {
  rotulo: string;
  href: string;
  /** Texto curto exibido ao lado do botão, ex.: "PDF · 478 KB". */
  detalhe?: string;
}

export interface Noticia {
  slug: string;
  titulo: string;
  /** Data de publicação no formato AAAA-MM-DD. */
  data: string;
  resumo: string;
  /** Um parágrafo por item. */
  corpo: string[];
  anexos?: AnexoNoticia[];
}

export const NOTICIAS: Noticia[] = [
  {
    slug: "classificados-fase-2",
    titulo: "Divulgada a relação dos classificados para a Fase 2 da 1ª OLICMAT",
    data: "2026-11-11",
    resumo:
      "181 participantes foram classificados para a Fase 2. Consulte a relação completa, organizada por instituição.",
    corpo: [
      "A Comissão Organizadora da 1ª Olimpíada de Licenciandos em Matemática (OLICMAT) torna pública a relação dos participantes classificados para a Fase 2, totalizando 181 licenciandos: IFPI (78), UFPI (53), UFDPar (36) e UESPI (14).",
      "A relação está disponível em PDF, organizada por instituição e em ordem alfabética pelo nome do participante.",
      `As orientações da Fase 2 serão divulgadas de ${dataDe("orientacoes-fase2")}, e o envio dos vídeos e portfólios ocorrerá de ${dataDe("envio-fase2")}. Acompanhe os canais oficiais da OLICMAT.`,
    ],
    anexos: [
      {
        rotulo: "Baixar a relação dos classificados para a Fase 2",
        href: "/arquivos/classificados-fase2-2026.pdf",
        detalhe: "PDF · 7 páginas",
      },
    ],
  },
  {
    slug: "resolucao-prova-fase-1",
    titulo: "Divulgada a resolução comentada da prova da Fase 1 da 1ª OLICMAT",
    data: "2026-11-09",
    resumo:
      "Consulte as 20 questões da prova da Fase 1 com o gabarito e o comentário pedagógico-matemático de cada uma.",
    corpo: [
      `A Comissão Organizadora da 1ª Olimpíada de Licenciandos em Matemática (OLICMAT) torna pública a resolução comentada da prova da Fase 1, aplicada em ${dataDe("fase1")}.`,
      "O documento, disponível em PDF, apresenta as 20 questões da prova, o gabarito e um comentário pedagógico-matemático sobre cada uma delas.",
      "Atenção ao conferir suas respostas: durante a prova, a ordem das alternativas foi embaralhada para cada participante. Por isso, as letras da resolução podem não coincidir com as que apareceram na sua tela. Compare o conteúdo da alternativa escolhida, e não apenas a letra. A ordem das questões foi a mesma para todos.",
      `O resultado da Fase 1 e a convocação para a Fase 2 serão divulgados em ${dataDe("resultado-fase1")}, conforme o cronograma oficial.`,
    ],
    anexos: [
      {
        rotulo: "Baixar a resolução comentada da Fase 1",
        href: "/arquivos/resolucao-fase1-2026.pdf",
        detalhe: "PDF · 18 páginas",
      },
    ],
  },
  {
    slug: "inscricoes-confirmadas",
    titulo: "Divulgada a relação das inscrições confirmadas da 1ª OLICMAT",
    data: "2026-10-06",
    resumo:
      "566 inscrições foram confirmadas. Consulte a relação completa, em ordem alfabética, com o número de inscrição de cada candidato.",
    corpo: [
      "A Comissão Organizadora da 1ª Olimpíada de Licenciandos em Matemática (OLICMAT) torna pública a relação das inscrições confirmadas, totalizando 566 candidatos habilitados a participar da competição.",
      "A relação está disponível em PDF, organizada em ordem alfabética pelo nome do candidato, e informa o número de inscrição, o curso e a situação de cada inscrição. Guarde o seu número de inscrição: ele identifica você em todas as etapas do certame.",
      `A Fase 1, prova on-line, será aplicada em ${dataDe("fase1")}. Todas as divulgações oficiais são realizadas nos canais institucionais da OLICMAT.`,
      "Caso não localize a sua inscrição ou identifique alguma incorreção nos dados, procure a coordenação do seu curso ou a Comissão Organizadora pelos canais oficiais da OLICMAT.",
    ],
    anexos: [
      {
        rotulo: "Baixar a relação de inscrições confirmadas",
        href: "/arquivos/inscricoes-confirmadas-2026.pdf",
        detalhe: "PDF · 20 páginas",
      },
    ],
  },
];

/** Notícias da mais recente para a mais antiga. */
export function noticiasOrdenadas(): Noticia[] {
  return [...NOTICIAS].sort((a, b) => b.data.localeCompare(a.data));
}

export function noticiaPorSlug(slug: string): Noticia | undefined {
  return NOTICIAS.find((n) => n.slug === slug);
}

/** "2026-10-06" → "06/10/2026", sem passar por Date (evita deslocar o dia por fuso). */
export function formatarDataNoticia(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

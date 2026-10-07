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

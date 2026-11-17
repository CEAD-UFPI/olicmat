/**
 * Documentos para os participantes — fonte única da seção "Documentos" da
 * página /regulamento.
 *
 * Para publicar um documento: copie o arquivo para apps/web/public/arquivos/ e
 * acrescente um item ao grupo certo abaixo (a ordem do array é a ordem de
 * exibição). O tamanho do arquivo é calculado automaticamente no build a
 * partir de public/; o tipo vem da extensão.
 */

export interface Documento {
  titulo: string;
  /** Linha curta exibida abaixo do título (data, nº de páginas...). */
  detalhe?: string;
  /** Caminho público, ex.: "/arquivos/edital-01-2026.pdf". */
  href: string;
  /** Destaque visual + selo "Novo". */
  novo?: boolean;
  /** Versão substituída por outra (aparece esmaecida, com aviso). */
  substituido?: string;
  /**
   * Força o download (atributo `download`) em vez de abrir no navegador.
   * Padrão: true para arquivos que não são PDF (ex.: .docx).
   */
  baixar?: boolean;
}

export interface GrupoDocumentos {
  id: string;
  titulo: string;
  descricao?: string;
  documentos: Documento[];
}

export const GRUPOS_DOCUMENTOS: GrupoDocumentos[] = [
  {
    id: "edital",
    titulo: "Edital e retificações",
    documentos: [
      {
        titulo: "Edital nº 01/2026",
        detalhe: "Edital de abertura, de 27/08/2026 · 6 páginas",
        href: "/arquivos/edital-01-2026.pdf",
      },
      {
        titulo: "Retificação do Edital nº 01/2026",
        detalhe: "Errata do cronograma, publicada em 06/10/2026 · 2 páginas",
        href: "/arquivos/retificacao-edital-01-2026.pdf",
      },
    ],
  },
  {
    id: "fase2",
    titulo: "2ª Fase — Desafio Didático-Tecnológico",
    descricao: "Leia o manual e use o template oficial para montar o seu portfólio.",
    documentos: [
      {
        titulo: "Manual do Participante — 2ª Fase",
        detalhe: "Como funciona a 2ª fase: sorteio, videoaula, portfólio e avaliação · 5 páginas",
        href: "/arquivos/manual-participante-fase2-2026.pdf",
        novo: true,
      },
      {
        titulo: "Template do Portfólio — 2ª Fase",
        detalhe: "Arquivo do Word para baixar, preencher e enviar em PDF",
        href: "/arquivos/OLICMAT_2026_Template_Portfolio.docx",
        novo: true,
        baixar: true,
      },
      {
        titulo: "Relação de classificados para a 2ª Fase (retificada)",
        detalhe: "Retificada em 12/11/2026 · 182 classificados · 7 páginas",
        href: "/arquivos/classificados-fase2-2026-retificada.pdf",
      },
      {
        titulo: "Relação de classificados para a 2ª Fase (versão original)",
        detalhe: "Divulgada em 11/11/2026 · 7 páginas",
        href: "/arquivos/classificados-fase2-2026.pdf",
        substituido: "Substituída pela versão retificada",
      },
    ],
  },
  {
    id: "fase1",
    titulo: "1ª Fase — Avaliação de Conhecimentos",
    documentos: [
      {
        titulo: "Resolução comentada da prova da 1ª Fase",
        detalhe: "Questões, gabarito e comentários · 18 páginas",
        href: "/arquivos/resolucao-fase1-2026.pdf",
      },
    ],
  },
  {
    id: "inscricoes",
    titulo: "Inscrições e resultados",
    documentos: [
      {
        titulo: "Relação das inscrições confirmadas",
        detalhe: "Divulgada em 06/10/2026 · 20 páginas",
        href: "/arquivos/inscricoes-confirmadas-2026.pdf",
      },
    ],
  },
];

/** "PDF", "DOCX"... a partir da extensão do arquivo. */
export function tipoDocumento(href: string): string {
  const ext = href.split("?")[0].split(".").pop() ?? "";
  return ext.toUpperCase();
}

/** 131,9 KB / 2,4 MB (formato pt-BR). */
export function formatarTamanho(bytes: number): string {
  const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  if (bytes < 1024 * 1024) return `${fmt(bytes / 1024)} KB`;
  return `${fmt(bytes / (1024 * 1024))} MB`;
}

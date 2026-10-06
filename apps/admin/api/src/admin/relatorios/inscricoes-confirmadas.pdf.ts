import PDFDocument from "pdfkit";
import { LOGO_PNG_BASE64 } from "./logo-base64.js";

export interface LinhaInscricaoConfirmada {
  numero: string;
  nome: string;
  curso: string;
  status: string;
}

export interface DadosRelatorioInscricoes {
  titulo: string;
  geradoEm: Date;
  linhas: LinhaInscricaoConfirmada[];
}

const MARGEM = 40;
const ALTURA_CABECALHO = 92;
const ALTURA_RODAPE = 36;
const PADDING_CELULA = 5;
const COLUNAS = [
  { chave: "numero", titulo: "Nº de Inscrição", largura: 85 },
  { chave: "nome", titulo: "Nome do Candidato", largura: 205 },
  { chave: "curso", titulo: "Curso", largura: 160 },
  { chave: "status", titulo: "Status", largura: 65 },
] as const;

const COR_TEXTO = "#1a1a24";
const COR_DESTAQUE = "#B8860B";
const COR_FUNDO_TITULO = "#2a2a3a";
const COR_ZEBRA = "#f4f2ec";

/** Ordem alfabética pt-BR, ignorando acentos e caixa; desempata pelo número. */
export function ordenarAlfabeticamente<T extends { nome: string; numero: string }>(
  linhas: T[],
): T[] {
  const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
  return [...linhas].sort(
    (a, b) => collator.compare(a.nome, b.nome) || a.numero.localeCompare(b.numero),
  );
}

export function gerarPdfInscricoesConfirmadas(
  dados: DadosRelatorioInscricoes,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGEM, bottom: MARGEM, left: MARGEM, right: MARGEM },
      bufferPages: true,
      info: { Title: dados.titulo, Author: "OLICMAT" },
    });
    const partes: Buffer[] = [];
    doc.on("data", (c: Buffer) => partes.push(c));
    doc.on("end", () => resolve(Buffer.concat(partes)));
    doc.on("error", reject);

    const logo = Buffer.from(LOGO_PNG_BASE64, "base64");
    const larguraUtil = doc.page.width - MARGEM * 2;
    const limiteInferior = doc.page.height - MARGEM - ALTURA_RODAPE;
    const emitidoEm = dados.geradoEm.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      dateStyle: "short",
      timeStyle: "short",
    });

    const desenharCabecalho = () => {
      doc.image(logo, MARGEM, MARGEM - 8, { height: 56 });
      doc
        .fillColor(COR_TEXTO)
        .font("Helvetica-Bold")
        .fontSize(15)
        .text(dados.titulo, MARGEM + 80, MARGEM + 2, {
          width: larguraUtil - 80,
          align: "right",
        });
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#555566")
        .text("Relatório de Inscrições Confirmadas", MARGEM + 80, MARGEM + 22, {
          width: larguraUtil - 80,
          align: "right",
        })
        .text(`Emitido em ${emitidoEm}`, MARGEM + 80, MARGEM + 35, {
          width: larguraUtil - 80,
          align: "right",
        });
      doc
        .moveTo(MARGEM, MARGEM + 56)
        .lineTo(MARGEM + larguraUtil, MARGEM + 56)
        .lineWidth(1.5)
        .strokeColor(COR_DESTAQUE)
        .stroke();
    };

    const desenharTitulosColunas = (y: number) => {
      doc.rect(MARGEM, y, larguraUtil, 20).fill(COR_FUNDO_TITULO);
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
      let x = MARGEM;
      for (const col of COLUNAS) {
        doc.text(col.titulo, x + PADDING_CELULA, y + 6, {
          width: col.largura - PADDING_CELULA * 2,
          lineBreak: false,
        });
        x += col.largura;
      }
      return y + 20;
    };

    const novaPagina = () => {
      desenharCabecalho();
      return desenharTitulosColunas(MARGEM + ALTURA_CABECALHO - 24);
    };

    let y = novaPagina();

    doc.font("Helvetica").fontSize(9.5);
    dados.linhas.forEach((linha, i) => {
      const alturas = COLUNAS.map((col) =>
        doc.heightOfString(linha[col.chave], {
          width: col.largura - PADDING_CELULA * 2,
        }),
      );
      const alturaLinha = Math.max(...alturas) + PADDING_CELULA * 2;

      if (y + alturaLinha > limiteInferior) {
        doc.addPage();
        y = novaPagina();
        doc.font("Helvetica").fontSize(9.5);
      }

      if (i % 2 === 1) {
        doc.rect(MARGEM, y, larguraUtil, alturaLinha).fill(COR_ZEBRA);
      }
      doc.fillColor(COR_TEXTO);
      let x = MARGEM;
      for (const col of COLUNAS) {
        doc.text(linha[col.chave], x + PADDING_CELULA, y + PADDING_CELULA, {
          width: col.largura - PADDING_CELULA * 2,
        });
        x += col.largura;
      }
      y += alturaLinha;
    });

    if (dados.linhas.length === 0) {
      doc
        .fillColor("#555566")
        .text("Nenhuma inscrição confirmada.", MARGEM, y + 12, {
          width: larguraUtil,
          align: "center",
        });
    }

    // Rodapé com paginação "Página X de Y" em todas as páginas.
    const { start, count } = doc.bufferedPageRange();
    for (let i = 0; i < count; i++) {
      doc.switchToPage(start + i);
      doc.page.margins.bottom = 0; // evita que o texto do rodapé gere nova página
      const yRodape = doc.page.height - MARGEM - 14;
      doc
        .moveTo(MARGEM, yRodape - 6)
        .lineTo(MARGEM + larguraUtil, yRodape - 6)
        .lineWidth(0.5)
        .strokeColor("#bbbbbb")
        .stroke();
      doc.font("Helvetica").fontSize(8.5).fillColor("#555566");
      doc.text(`Total de inscritos confirmados: ${dados.linhas.length}`, MARGEM, yRodape, {
        width: larguraUtil / 2,
        align: "left",
        lineBreak: false,
      });
      doc.text(`Página ${i + 1} de ${count}`, MARGEM + larguraUtil / 2, yRodape, {
        width: larguraUtil / 2,
        align: "right",
        lineBreak: false,
      });
    }

    doc.end();
  });
}

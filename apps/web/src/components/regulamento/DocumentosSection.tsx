import { statSync } from "node:fs";
import { join } from "node:path";
import { Download, FileText, FileType2, Sparkles } from "lucide-react";
import {
  GRUPOS_DOCUMENTOS,
  formatarTamanho,
  tipoDocumento,
  type Documento,
} from "@/lib/documentos";

/** Tamanho do arquivo em public/ (calculado no build; omitido se não existir). */
function tamanho(href: string): string | null {
  try {
    return formatarTamanho(statSync(join(process.cwd(), "public", decodeURI(href))).size);
  } catch {
    return null;
  }
}

function ItemDocumento({ doc }: { doc: Documento }) {
  const tipo = tipoDocumento(doc.href);
  const size = tamanho(doc.href);
  const baixar = doc.baixar ?? tipo !== "PDF";
  const Icone = tipo === "PDF" ? FileText : FileType2;
  const nomeArquivo = doc.href.split("/").pop();

  return (
    <li
      className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-5 ${
        doc.novo
          ? "border-[var(--color-gold)] bg-[var(--color-gold)]/[0.08] shadow-sm"
          : "border-[var(--border-color)] bg-[var(--bg-secondary)]"
      } ${doc.substituido ? "opacity-75" : ""}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          tipo === "PDF"
            ? "bg-red-500/10 text-red-300"
            : "bg-blue-500/10 text-blue-300"
        }`}
        aria-hidden
      >
        <Icone size={22} />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[var(--text-primary)]">{doc.titulo}</span>
          {doc.novo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-gold)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[var(--on-accent)]">
              <Sparkles size={11} aria-hidden /> Novo
            </span>
          )}
          {doc.substituido && (
            <span className="rounded-full border border-[var(--border-strong)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-tertiary)]">
              {doc.substituido}
            </span>
          )}
        </span>
        {doc.detalhe && (
          <span className="text-sm text-[var(--text-tertiary)]">{doc.detalhe}</span>
        )}
        <span className="text-xs font-medium text-[var(--text-muted)] font-[family-name:var(--font-jetbrains-mono)]">
          {tipo}
          {size ? ` · ${size}` : ""}
        </span>
      </span>

      <a
        href={doc.href}
        {...(baixar
          ? { download: nomeArquivo }
          : { target: "_blank", rel: "noopener noreferrer" })}
        aria-label={`${baixar ? "Baixar" : "Abrir"} ${doc.titulo} (${tipo}${size ? `, ${size}` : ""})`}
        className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
          doc.novo
            ? "bg-[var(--color-gold)] text-[var(--on-accent)] hover:bg-[var(--color-gold-hover)]"
            : "border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--color-gold)] hover:bg-[var(--surface)]"
        }`}
      >
        <Download size={16} aria-hidden />
        {baixar ? `Baixar ${tipo}` : "Baixar PDF"}
      </a>
    </li>
  );
}

/** Seção "Documentos": todos os arquivos para os participantes, por grupo. */
export function DocumentosSection() {
  return (
    <section id="documentos" aria-labelledby="documentos-titulo" className="scroll-mt-28 space-y-6">
      <div>
        <h2
          id="documentos-titulo"
          className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]"
        >
          Documentos
        </h2>
        <p className="mt-1 text-sm text-[var(--text-tertiary)]">
          Edital, retificações, manuais e relações oficiais da OLICMAT 2026 para baixar.
        </p>
      </div>

      {GRUPOS_DOCUMENTOS.map((g) => (
        <div key={g.id} className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-ink)]">
              {g.titulo}
            </h3>
            {g.descricao && <p className="mt-1 text-sm text-[var(--text-secondary)]">{g.descricao}</p>}
          </div>
          <ul className="space-y-3">
            {g.documentos.map((d) => (
              <ItemDocumento key={d.href} doc={d} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

import type { Metadata } from "next";
import { DocumentosSection } from "@/components/regulamento/DocumentosSection";
import { RegulamentoConteudo } from "./RegulamentoConteudo";

export const metadata: Metadata = {
  title: "Regulamento, Edital e Documentos - OLICMAT",
  description:
    "Regulamento oficial, Edital nº 01/2026, retificações, manual e template da 2ª Fase e demais documentos da 1ª Olimpíada de Licenciandos em Matemática (OLICMAT).",
};

export default function RegulamentoPage() {
  return (
    <div className="space-y-12">
      <header>
        <p className="text-xs tracking-[0.18em] uppercase text-[var(--color-gold-ink)] font-medium">
          OLICMAT 2026
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mt-3 font-[family-name:var(--font-fraunces)]">
          Regulamento, Edital e Documentos
        </h1>
        <p className="text-[var(--text-tertiary)] mt-3 leading-relaxed">
          Todos os documentos oficiais para os participantes e, logo abaixo, o
          regulamento completo da 1ª Olimpíada de Licenciandos em Matemática.
        </p>
        <nav aria-label="Nesta página" className="mt-5 flex flex-wrap gap-2 text-sm">
          <a
            href="#documentos"
            className="rounded-full border border-[var(--border-strong)] px-3 py-1.5 text-[var(--text-secondary)] hover:border-[var(--color-gold)] hover:text-[var(--text-primary)]"
          >
            Documentos
          </a>
          <a
            href="#regulamento"
            className="rounded-full border border-[var(--border-strong)] px-3 py-1.5 text-[var(--text-secondary)] hover:border-[var(--color-gold)] hover:text-[var(--text-primary)]"
          >
            Regulamento
          </a>
        </nav>
      </header>

      <DocumentosSection />

      <hr className="border-[var(--border-color)]" />

      <RegulamentoConteudo />
    </div>
  );
}

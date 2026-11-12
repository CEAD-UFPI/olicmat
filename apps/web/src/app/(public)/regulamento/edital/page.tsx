import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edital nº 01/2026 - OLICMAT",
  description:
    "Edital da 1ª Olimpíada de Licenciandos em Matemática (OLICMAT) e documentos oficiais, em ordem de publicação.",
};

/** Documentos oficiais em ordem de publicação. Arquivos em public/arquivos/. */
const DOCUMENTOS = [
  {
    titulo: "Edital nº 01/2026, de 27 de agosto de 2026",
    detalhe: "Edital de abertura · PDF · 6 páginas",
    href: "/arquivos/edital-01-2026.pdf",
  },
  {
    titulo: "Relação das inscrições confirmadas",
    detalhe: "Divulgada em 06/10/2026 · PDF · 20 páginas",
    href: "/arquivos/inscricoes-confirmadas-2026.pdf",
  },
  {
    titulo: "Retificação do Edital nº 01/2026 (cronograma)",
    detalhe: "Publicada em 06/10/2026 · PDF · 2 páginas",
    href: "/arquivos/retificacao-edital-01-2026.pdf",
  },
];

export default function EditalPage() {
  return (
    <article className="space-y-8">
      <Link href="/regulamento" className="text-sm text-[#E8B829] hover:underline">
        ← Regulamento
      </Link>

      <header>
        <p className="text-xs tracking-[0.18em] uppercase text-[#E8B829] font-medium">
          Documentos oficiais
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#f0ece4] mt-3 font-[family-name:var(--font-fraunces)]">
          Edital nº 01/2026
        </h1>
      </header>

      <p className="text-base text-[#d6d2c8] leading-relaxed">
        A Universidade Federal do Piauí (UFPI), por meio do Centro de Educação Aberta e a Distância
        (CEAD), torna pública a abertura das inscrições para a 1ª Olimpíada de Licenciandos em
        Matemática (OLICMAT), primeira edição estadual, destinada a estudantes regularmente
        matriculados em cursos de Licenciatura em Matemática das instituições Universidade Federal do
        Piauí (UFPI), Instituto Federal do Piauí (IFPI), Universidade Estadual do Piauí (UESPI) e
        Universidade Federal do Delta do Parnaíba (UFDPar) participantes, nos termos deste Edital.
      </p>

      <ol className="space-y-3">
        {DOCUMENTOS.map((d, i) => (
          <li key={d.href}>
            <a
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-[#E8B829]/30 bg-[#E8B829]/5 p-5 transition-colors hover:bg-[#E8B829]/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8B829]/40 text-sm font-semibold text-[#E8B829]">
                {i + 1}
              </span>
              <span className="flex flex-col">
                <span className="font-semibold text-[#f0ece4]">{d.titulo}</span>
                <span className="text-sm text-[#9895a4]">{d.detalhe}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </article>
  );
}

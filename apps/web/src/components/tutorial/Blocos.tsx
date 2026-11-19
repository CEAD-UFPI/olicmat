import Image from "next/image";

/** Blocos visuais dos tutoriais (participante e avaliador). */
/* ------------------------------------------------------------ componentes */

export function Secao({ n, id, titulo, children }: { n: number; id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 bg-[var(--bg-secondary)]">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-[var(--color-gold-ink)] font-[family-name:var(--font-jetbrains-mono)] text-sm tabular-nums">
          {String(n).padStart(2, "0")}
        </span>
        <h2 className="text-xl lg:text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">{titulo}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">{children}</p>;
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="text-[var(--text-primary)] font-semibold">{children}</strong>;
}

export function Link({ href, children }: { href: string; children: React.ReactNode }) {
  const externo = href.startsWith("http");
  return (
    <a
      href={href}
      {...(externo || href.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-[var(--color-blue-ink)] underline underline-offset-2 hover:no-underline"
    >
      {children}
    </a>
  );
}

export function Lista({ itens, marcador = "●" }: { itens: React.ReactNode[]; marcador?: string }) {
  return (
    <ul className="space-y-3">
      {itens.map((item, i) => (
        <li key={i} className="text-[15px] text-[var(--text-secondary)] leading-relaxed flex gap-3">
          <span className={`text-[var(--color-gold-ink)] shrink-0 ${marcador === "●" ? "text-[8px] mt-2" : "font-bold"}`}>{marcador}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Passos({ itens }: { itens: React.ReactNode[] }) {
  return (
    <ol className="space-y-3">
      {itens.map((item, i) => (
        <li key={i} className="text-[15px] text-[var(--text-secondary)] leading-relaxed flex gap-3">
          <span
            className="shrink-0 w-7 h-7 rounded-full grid place-items-center text-sm font-bold"
            style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}
          >
            {i + 1}
          </span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/[0.08] p-4 text-[15px] text-[var(--text-secondary)] leading-relaxed">
      {children}
    </div>
  );
}

export function Figura({
  src, alt, legenda, largura = 1280, altura = 820,
}: { src: string; alt: string; legenda: string; largura?: number; altura?: number }) {
  return (
    <figure className="space-y-2">
      <Image
        src={src}
        alt={alt}
        width={largura}
        height={altura}
        sizes="(max-width: 896px) 100vw, 832px"
        className="w-full h-auto rounded-xl border border-[var(--border-color)] shadow-sm"
      />
      <figcaption className="text-xs text-[var(--text-tertiary)] text-center">{legenda}</figcaption>
    </figure>
  );
}

export function Faq({ itens }: { itens: Array<[string, string]> }) {
  return (
    <div className="divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
      {itens.map(([q, r]) => (
        <details key={q} className="group p-4">
          <summary className="cursor-pointer list-none flex justify-between gap-3 font-semibold text-[var(--text-primary)]">
            {q}
            <span className="text-[var(--color-gold-ink)] transition-transform group-open:rotate-45 shrink-0">+</span>
          </summary>
          <p className="mt-2 text-[15px] text-[var(--text-secondary)] leading-relaxed">{r}</p>
        </details>
      ))}
    </div>
  );
}

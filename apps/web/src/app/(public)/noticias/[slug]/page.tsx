import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  NOTICIAS,
  noticiaPorSlug,
  formatarDataNoticia,
} from "@/lib/noticias";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NOTICIAS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = noticiaPorSlug(slug);
  if (!noticia) return {};
  return {
    title: `${noticia.titulo} - OLICMAT`,
    description: noticia.resumo,
    openGraph: { title: noticia.titulo, description: noticia.resumo, type: "article" },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const noticia = noticiaPorSlug(slug);
  if (!noticia) notFound();

  return (
    <article className="space-y-8">
      <Link href="/#noticias" className="text-sm text-[#E8B829] hover:underline">
        ← Todas as notícias
      </Link>

      <header>
        <time
          dateTime={noticia.data}
          className="text-xs font-semibold uppercase tracking-widest text-[#E8B829]"
        >
          {formatarDataNoticia(noticia.data)}
        </time>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)] leading-tight">
          {noticia.titulo}
        </h1>
      </header>

      <div className="space-y-5 text-base text-[#d6d2c8] leading-relaxed">
        {noticia.corpo.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {noticia.anexos && noticia.anexos.length > 0 && (
        <div className="space-y-3">
          {noticia.anexos.map((a) => (
            <a
              key={a.href}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-[#E8B829]/30 bg-[#E8B829]/5 p-5 transition-colors hover:bg-[#E8B829]/10"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-[#E8B829]"
                aria-hidden
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="flex flex-col">
                <span className="font-semibold text-[#f0ece4]">{a.rotulo}</span>
                {a.detalhe && <span className="text-sm text-[#9895a4]">{a.detalhe}</span>}
              </span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { noticiasOrdenadas, formatarDataNoticia } from "@/lib/noticias";

const MAX_NA_HOME = 3;

export function Noticias() {
  const noticias = noticiasOrdenadas().slice(0, MAX_NA_HOME);
  if (noticias.length === 0) return null;

  return (
    <section id="noticias" className="relative py-24 lg:py-32">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-fraunces)] text-[var(--text-primary)] mb-4">
            Notícias
          </h2>
          <p className="text-[var(--text-tertiary)] text-lg">
            Comunicados e divulgações oficiais da OLICMAT
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n, i) => (
            <motion.article
              key={n.slug}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] transition-colors hover:border-[var(--color-gold)]/40"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={`/noticias/${n.slug}`} className="flex h-full flex-col p-6">
                <time
                  dateTime={n.data}
                  className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-ink)]"
                >
                  {formatarDataNoticia(n.data)}
                </time>
                <h3 className="mt-3 text-xl font-bold font-[family-name:var(--font-fraunces)] text-[var(--text-primary)] leading-snug">
                  {n.titulo}
                </h3>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{n.resumo}</p>
                <span className="mt-auto pt-5 text-sm font-medium text-[var(--color-gold-ink)]">
                  Ler notícia →
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-fraunces)] text-[#f0ece4] mb-4">
            Notícias
          </h2>
          <p className="text-[#9895a4] text-lg">
            Comunicados e divulgações oficiais da OLICMAT
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n, i) => (
            <motion.article
              key={n.slug}
              className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] transition-colors hover:border-[#E8B829]/40"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={`/noticias/${n.slug}`} className="flex h-full flex-col p-6">
                <time
                  dateTime={n.data}
                  className="text-xs font-semibold uppercase tracking-widest text-[#E8B829]"
                >
                  {formatarDataNoticia(n.data)}
                </time>
                <h3 className="mt-3 text-xl font-bold font-[family-name:var(--font-fraunces)] text-[#f0ece4] leading-snug">
                  {n.titulo}
                </h3>
                <p className="mt-3 text-sm text-[#b0adc0] leading-relaxed">{n.resumo}</p>
                <span className="mt-auto pt-5 text-sm font-medium text-[#E8B829]">
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

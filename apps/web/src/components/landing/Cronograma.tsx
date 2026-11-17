"use client";

import { motion } from "framer-motion";
import { CRONOGRAMA } from "@/lib/cronograma";

const etapas = CRONOGRAMA;

export function Cronograma() {
  return (
    <section id="cronograma" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 gradient-orb-gold opacity-20" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-fraunces)] text-[var(--text-primary)] mb-4">
            Cronograma Oficial
          </h2>
          <p className="text-[var(--text-tertiary)] text-lg">
            1ª OLICMAT — Para Licenciandos em Matemática — Datas e prazos oficiais
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-[var(--border-color)]" />
          <div className="space-y-6">
            {etapas.map((etapa, i) => (
              <motion.div
                key={i}
                className="relative pl-14"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div
                  className={`absolute left-2 top-1 w-[33px] h-[33px] rounded-full border-2 flex items-center justify-center -translate-x-1/2 ${
                    etapa.destaque
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                      : "border-[var(--border-strong)] bg-[var(--bg-secondary)]"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${etapa.destaque ? "bg-[var(--color-gold)]" : "bg-[var(--border-strong)]"}`} />
                </div>

                <div
                  className={`rounded-2xl p-5 ${
                    etapa.destaque
                      ? "border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5"
                      : "border border-[var(--border-color)] bg-[var(--bg-secondary)]"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-ink)]">
                    {etapa.data}
                  </span>
                  <p className="text-sm text-[var(--text-primary)] mt-1.5 leading-relaxed">
                    {etapa.atividade}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-10 border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Observações:</strong> As datas poderão sofrer ajustes, caso necessário, e serão comunicadas com antecedência. Todas as divulgações oficiais serão realizadas nos canais institucionais da OLICMAT.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="/cronograma"
            className="text-sm text-[var(--color-gold-ink)] hover:underline font-medium"
          >
            Ver página completa do cronograma →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

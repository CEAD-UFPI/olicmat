"use client";

import { motion } from "framer-motion";
import { CRONOGRAMA } from "@/lib/cronograma";

const cronograma = CRONOGRAMA;

export default function CronogramaPage() {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
          Cronograma Oficial
        </h1>
        <p className="text-[var(--text-tertiary)] mt-2">
          1ª OLICMAT — Ensino Superior
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-[var(--border-color)]" />

        <div className="space-y-6">
          {cronograma.map((etapa, i) => (
            <motion.div
              key={i}
              className="relative pl-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              {/* Dot */}
              <div
                className={`absolute left-2.5 top-1.5 w-[33px] h-[33px] rounded-full border-2 flex items-center justify-center -translate-x-1/2 ${
                  etapa.destaque
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                    : "border-[var(--border-strong)] bg-[var(--bg-secondary)]"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    etapa.destaque ? "bg-[var(--color-gold)]" : "bg-[var(--border-strong)]"
                  }`}
                />
              </div>

              {/* Content */}
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

      <div className="border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)]">
        <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
          <strong className="text-[var(--text-primary)]">Observações:</strong> As datas poderão sofrer ajustes, caso necessário, e serão comunicadas com antecedência. Todas as divulgações oficiais serão realizadas nos canais institucionais da OLICMAT.
        </p>
      </div>
    </motion.div>
  );
}

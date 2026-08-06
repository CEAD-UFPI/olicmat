"use client";

import { motion } from "framer-motion";

const parceiros = [
  { nome: "MEC", sigla: "Ministério da Educação" },
  { nome: "SEDUC", sigla: "Secretaria de Estado da Educação" },
  { nome: "SBM", sigla: "Sociedade Brasileira de Matemática" },
  { nome: "UAB", sigla: "Universidade Aberta do Brasil" },
  { nome: "UESPI", sigla: "Universidade Estadual do Piauí" },
  { nome: "IFs", sigla: "Institutos Federais" },
];

export function Parceiros() {
  return (
    <section id="parceiros" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 gradient-orb-pi opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-fraunces)] text-[#f0ece4] mb-4">
            Realização e Apoio
          </h2>
          <p className="text-[#9895a4] text-lg max-w-2xl mx-auto">
            Instituições e organizações que tornam a OLICMAT possível
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {parceiros.map((p, i) => (
            <motion.div
              key={p.nome}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-[#2a2a3a] bg-[#12121a]/60 hover:bg-[#1a1a26] hover:border-[#3a3a4a] transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)] group-hover:text-[var(--pi-laranja)] transition-colors">
                {p.nome}
              </span>
              <span className="text-[10px] text-[#9895a4] mt-1 text-center leading-tight">
                {p.sigla}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

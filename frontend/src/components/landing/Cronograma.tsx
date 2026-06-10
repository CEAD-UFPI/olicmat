"use client";

import { motion } from "framer-motion";

const eventos = [
  {
    data: "01 a 30 de Junho, 2026",
    titulo: "Inscrições Abertas",
    descricao: "Período de inscrições para a OLICMAT. Envio do comprovante de matrícula obrigatório.",
    cor: "var(--pi-laranja)",
    tipo: "inscricao",
  },
  {
    data: "15 de Julho, 2026",
    titulo: "Fase 1 — Prova Online",
    descricao: "Prova objetiva com 30 questões de múltipla escolha. Duração de 3 horas.",
    cor: "var(--sigma-azul)",
    tipo: "prova",
  },
  {
    data: "01 a 20 de Agosto, 2026",
    titulo: "Fase 2 — Videoaula e Portfólio",
    descricao: "Sorteio do tema gerador. Produção de videoaula (20 min) e portfólio digital.",
    cor: "var(--integral-verde)",
    tipo: "envio",
  },
  {
    data: "Novembro, 2026",
    titulo: "Resultado Final e Premiação",
    descricao: "Divulgação do ranking estadual. Entrega de medalhas e certificados.",
    cor: "var(--pi-laranja)",
    tipo: "premiacao",
  },
];

export function Cronograma() {
  return (
    <section id="cronograma" className="relative py-24 lg:py-32 bg-[#0a0a0f]">
      <div className="absolute inset-0 gradient-orb-sigma opacity-20" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-fraunces)] text-[#f0ece4] mb-4">
            Cronograma de Prazos
          </h2>
          <p className="text-[#9895a4] text-lg">
            Datas importantes da edição 2026
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
            style={{
              background: "linear-gradient(to bottom, var(--pi-laranja), var(--integral-verde), var(--sigma-azul), var(--pi-laranja))",
            }}
          />

          <div className="space-y-8">
            {eventos.map((evento, i) => (
              <motion.div
                key={evento.titulo}
                className={`relative pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Dot on timeline */}
                <div
                  className="absolute left-[10px] md:left-auto top-1.5 w-2.5 h-2.5 rounded-full z-10 ring-4 ring-[#0a0a0f]"
                  style={{
                    backgroundColor: evento.cor,
                    [i % 2 === 0 ? "right" : "left"]: i % 2 === 0 ? "-5px" : "",
                    [i % 2 === 0 ? "left" : "right"]: i % 2 === 0 ? "auto" : "-5px",
                  }}
                />

                <div className="border border-[#2a2a3a] rounded-xl p-6 bg-[#12121a]/80 backdrop-blur-sm hover:border-[#3a3a4a] transition-colors">
                  <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: evento.cor }}>
                    {evento.data}
                  </span>
                  <h3 className="text-lg font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
                    {evento.titulo}
                  </h3>
                  <p className="text-sm text-[#9895a4] leading-relaxed">
                    {evento.descricao}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

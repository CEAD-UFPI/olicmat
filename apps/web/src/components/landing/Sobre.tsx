"use client";

import { motion } from "framer-motion";

const destaques = [
  {
    simbolo: "π",
    cor: "#E8B829",
    titulo: "Fase 1",
    descricao:
      "Prova online com 30 questões de múltipla escolha, abrangendo matemática e didática. Duração de 3 horas com tempo cronometrado.",
    detalhes: ["Prova cronometrada", "30 questões", "Online"],
  },
  {
    simbolo: "∫",
    cor: "var(--integral-verde)",
    titulo: "Fase 2",
    descricao:
      "Sorteio de tema gerador seguido da produção de uma videoaula de 20 minutos e portfólio digital com planejamento pedagógico.",
    detalhes: ["Videoaula 20min", "Portfólio digital", "Sorteio de tema"],
  },
  {
    simbolo: "Σ",
    cor: "var(--sigma-azul)",
    titulo: "Premiação",
    descricao:
      "Medalhas de ouro, prata e bronze por estado. Ranking estadual e nacional com certificados digitais para todos os participantes.",
    detalhes: ["Medalhas estaduais", "Ranking", "Certificado digital"],
  },
];

export function Sobre() {
  return (
    <section id="sobre" className="relative py-24 lg:py-32 math-grid">
      <div className="absolute inset-0 gradient-orb-integral opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-fraunces)] text-[#f0ece4] mb-4">
            Sobre a Olimpíada
          </h2>
          <p className="text-[#9895a4] max-w-2xl mx-auto text-lg">
            Uma competição em duas fases que avalia e valoriza o conhecimento dos licenciandos em matemática
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {destaques.map((item, i) => (
            <motion.div
              key={item.titulo}
              className="relative group rounded-2xl p-8 lg:p-10 border border-[#2a2a3a] bg-[#12121a]/80 backdrop-blur-sm hover:bg-[#1a1a26] transition-colors duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                className="text-5xl lg:text-6xl font-bold font-[family-name:var(--font-fraunces)] mb-5"
                style={{ color: item.cor }}
              >
                {item.simbolo}
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
                {item.titulo}
              </h3>
              <p
                className="text-xs uppercase tracking-widest mb-5 font-[family-name:var(--font-outfit)]"
                style={{ color: item.cor }}
              >
                OLICMAT
              </p>
              <p className="text-[#9895a4] text-sm leading-relaxed mb-6">
                {item.descricao}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.detalhes.map((d) => (
                  <span
                    key={d}
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `${item.cor}15`,
                      color: item.cor,
                      border: `1px solid ${item.cor}30`,
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Hover border glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${item.cor}08, transparent 60%)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

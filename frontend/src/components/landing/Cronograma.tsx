"use client";

import { motion } from "framer-motion";

interface Etapa {
  data: string;
  descricao: string;
  destaque?: boolean;
}

const etapas: Etapa[] = [
  { data: "15/08/2026", descricao: "Live de lançamento da 1ª OLICMAT — Ensino Superior e do Regulamento", destaque: true },
  { data: "15/08 a 05/09/2026", descricao: "Inscrições" },
  { data: "10/09/2026", descricao: "Divulgação das inscrições validadas" },
  { data: "20/09/2026", descricao: "Realização do primeiro teste da Fase I: Avaliação do conhecimento matemático pedagógico", destaque: true },
  { data: "Até 30/09/2026", descricao: "Divulgação do resultado do primeiro teste da Fase I e dos(as) aprovados(as) para o desafio (Fase II)" },
  { data: "30/09 a 10/10/2026", descricao: "Divulgação de informações sobre o desafio (Fase II): Desafio didático-tecnológico" },
  { data: "Até 20/10/2026", descricao: "Realização do desafio (Fase II) e envio dos vídeos (envio no mesmo dia do desafio)", destaque: true },
  { data: "Até 20/11/2026", descricao: "Análise dos vídeos do desafio" },
  { data: "03/11/2026", descricao: "Divulgação do resultado do desafio (Fase II) e dos(as) medalhistas da 1ª OLICMAT — Ensino Superior", destaque: true },
  { data: "Até 30/11/2026", descricao: "Cerimônia de premiação e encerramento da 1ª OLICMAT — Ensino Superior" },
  { data: "2º semestre de 2027", descricao: "Realização da missão de imersão profissional" },
  { data: "2º semestre de 2027", descricao: "Participação na formação oferecida pela SBM no Rio de Janeiro" },
  { data: "2027", descricao: "Workshops de disseminação" },
];

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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-fraunces)] text-[#f0ece4] mb-4">
            Cronograma Oficial
          </h2>
          <p className="text-[#9895a4] text-lg">
            1ª OLICMAT — Ensino Superior — Datas e prazos oficiais
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-[#2a2a3a]" />
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
                      ? "border-[#E8B829] bg-[#E8B829]/10"
                      : "border-[#3a3a4a] bg-[#12121a]"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${etapa.destaque ? "bg-[#E8B829]" : "bg-[#3a3a4a]"}`} />
                </div>

                <div
                  className={`rounded-2xl p-5 ${
                    etapa.destaque
                      ? "border border-[#E8B829]/30 bg-[#E8B829]/5"
                      : "border border-[#2a2a3a] bg-[#12121a]"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#E8B829]">
                    {etapa.data}
                  </span>
                  <p className="text-sm text-[#f0ece4] mt-1.5 leading-relaxed">
                    {etapa.descricao}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-10 border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs text-[#9895a4] leading-relaxed">
            <strong className="text-[#f0ece4]">Observações:</strong> As datas poderão sofrer ajustes, caso necessário, e serão comunicadas com antecedência. Todas as divulgações oficiais serão realizadas nos canais institucionais da OLICMAT.
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
            className="text-sm text-[#E8B829] hover:underline font-medium"
          >
            Ver página completa do cronograma →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

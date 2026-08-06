"use client";

import { motion } from "framer-motion";

interface Etapa {
  data: string;
  descricao: string;
  destaque?: boolean;
}

const etapas: Etapa[] = [
  { data: "12/08/2026", descricao: "Lançamento da 1ª OLICMAT incluindo: Olimpíada, Formação e Congresso", destaque: true },
  { data: "30/08 a 25/09/2026", descricao: "Inscrições" },
  { data: "05/10/2026", descricao: "Divulgação das inscrições validadas" },
  { data: "21/10/2026", descricao: "Realização do teste I", destaque: true },
  { data: "30/10/2026", descricao: "Divulgação do resultado do teste I e dos(as) aprovados(as) para a Fase II" },
  { data: "05/11 a 10/11/2026", descricao: "Divulgação de informações sobre a Fase II" },
  { data: "11/11 a 13/11/2026", descricao: "Realização do teste II e envio dos vídeos (envio no mesmo dia do desafio)", destaque: true },
  { data: "16/11 a 24/11/2026", descricao: "Análise da Fase II" },
  { data: "25/11/2026", descricao: "Divulgação do resultado e dos(as) medalhistas da 1ª OLICMAT", destaque: true },
  { data: "30/11/2026", descricao: "Cerimônia de premiação e encerramento da 1ª OLICMAT - Com a divulgação das/os medalhistas de ouro, prata e bronze" },
  { data: "Novembro e Dezembro/2026", descricao: "Desenvolvimento e Realização da Formação no Programa Olicmat - Forpemat" },
  { data: "Dezembro/2026 e Janeiro/2027", descricao: "Desenvolvimento e realização do Congresso no Programa Olicmat – Congemat" },
  { data: "Até Março de 2027", descricao: "Demais etapas formativas e Conclusão das ações do programa Olicmat" },
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
            1ª OLICMAT — Para Licenciandos em Matemática — Datas e prazos oficiais
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

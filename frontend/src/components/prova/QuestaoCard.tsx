"use client";

import { motion } from "framer-motion";
import type { Questao } from "@/types";

interface QuestaoCardProps {
  questao: Questao & { respondida?: string | null };
  onResponder: (questaoId: string, alternativa: string) => void;
}

const alternativas = ["A", "B", "C", "D", "E"] as const;

export function QuestaoCard({ questao, onResponder }: QuestaoCardProps) {
  return (
    <motion.div
      key={questao.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]"
    >
      <div className="flex items-center gap-3 mb-6">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: "var(--sigma-azul)/15",
            color: "var(--sigma-azul)",
            border: "1px solid var(--sigma-azul)/30",
          } as React.CSSProperties}
        >
          {questao.eixo}
        </span>
        <span className="text-xs text-[#9895a4] capitalize">{questao.dificuldade.toLowerCase()}</span>
      </div>

      <p className="text-[#f0ece4] text-base lg:text-lg leading-relaxed mb-8">
        {questao.enunciado}
      </p>

      <div className="space-y-3">
        {alternativas.map((letra) => {
          const key = `alternativa${letra}` as keyof Questao;
          const texto = questao[key] as string;
          const selecionada = questao.respondida === letra;

          return (
            <button
              key={letra}
              onClick={() => onResponder(questao.id, letra)}
              className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                selecionada
                  ? "border-[var(--pi-laranja)] bg-[var(--pi-laranja)]/10"
                  : "border-[#2a2a3a] hover:border-[#3a3a4a] hover:bg-[#1a1a26]"
              }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 transition-colors ${
                  selecionada
                    ? "bg-[var(--pi-laranja)] text-white"
                    : "bg-[#1a1a26] text-[#9895a4]"
                }`}
              >
                {letra}
              </span>
              <span className={`text-sm ${selecionada ? "text-[#f0ece4]" : "text-[#9895a4]"}`}>
                {texto}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

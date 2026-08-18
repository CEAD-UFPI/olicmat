"use client";

import type { Questao } from "@/stores/provaStore";
import { MathText } from "../ui/math-text";

interface QuestaoCardProps {
  questao: Questao;
  selecionada: string | null;
  onSelecionar: (letra: string) => void;
}

export function QuestaoCard({ questao, selecionada, onSelecionar }: QuestaoCardProps) {
  const alternativas: { letra: string; texto: string }[] = [
    { letra: "A", texto: questao.alternativaA },
    { letra: "B", texto: questao.alternativaB },
    { letra: "C", texto: questao.alternativaC },
    { letra: "D", texto: questao.alternativaD },
    { letra: "E", texto: questao.alternativaE },
  ];

  return (
    <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs text-[#9895a4] uppercase tracking-wider">
        <span>Eixo: {questao.eixo}</span>
        <span>Dificuldade: {questao.dificuldade}</span>
      </div>

      <div className="text-lg font-medium leading-relaxed text-[#f0ece4] whitespace-pre-wrap">
        <MathText text={questao.enunciado} />
      </div>

      <div className="space-y-3">
        {alternativas.map(({ letra, texto }) => {
          const ativa = selecionada === letra;
          return (
            <button
              key={letra}
              onClick={() => onSelecionar(letra)}
              className={`w-full p-4 rounded-xl text-left border flex items-start gap-4 transition-all ${
                ativa
                  ? "border-[#E85D04] bg-[#E85D04]/10 text-[#f0ece4]"
                  : "border-[#2a2a3a] bg-[#0a0a0f]/60 text-[#9895a4] hover:border-[#3a3a4a] hover:text-[#f0ece4]"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center shrink-0 ${
                  ativa ? "bg-[#E85D04] text-white" : "bg-[#1f1f2e] text-[#9895a4]"
                }`}
              >
                {letra}
              </span>
              <span className="text-base pt-0.5 leading-snug">
                <MathText text={texto} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

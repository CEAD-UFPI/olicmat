"use client";

import { useEffect, useRef, useState } from "react";

/** Em segundos, do maior para o menor. */
const AVISOS = [600, 300, 60];

const textoAviso = (segundos: number) =>
  segundos === 60
    ? "Falta 1 minuto para o encerramento da prova. Salve suas respostas!"
    : `Faltam ${segundos / 60} minutos para o encerramento da prova.`;

interface TimerProps {
  fim: string;
  /** servidor - navegador, em ms. */
  offset?: number;
  onTimeUp: () => void;
}

export function Timer({ fim, offset = 0, onTimeUp }: TimerProps) {
  const [restante, setRestante] = useState<number | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const ultimoAviso = useRef<number | null>(null);

  useEffect(() => {
    const calcular = () => {
      const diff = Math.max(0, Math.floor((new Date(fim).getTime() - (Date.now() + offset)) / 1000));
      setRestante(diff);
      if (diff <= 0) {
        onTimeUp();
      }
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [fim, offset, onTimeUp]);

  // Compara por faixa, não por segundo exato: o celular congela a página em
  // segundo plano, e quem volta com 4 minutos ainda precisa ver o aviso de 5.
  useEffect(() => {
    if (restante === null || restante <= 0) return;
    // Sem .at(): não existe em iPhones com iOS antigo.
    const faixas = AVISOS.filter((s) => restante <= s);
    const faixa = faixas.length > 0 ? faixas[faixas.length - 1] : null;
    if (faixa !== null && faixa !== ultimoAviso.current) {
      ultimoAviso.current = faixa;
      setAviso(textoAviso(faixa));
    }
  }, [restante]);

  useEffect(() => {
    if (aviso) {
      const timeout = setTimeout(() => {
        setAviso(null);
      }, 15000); // 15 segundos
      return () => clearTimeout(timeout);
    }
  }, [aviso]);

  if (restante === null) return null;

  const horas = Math.floor(restante / 3600);
  const minutos = Math.floor((restante % 3600) / 60);
  const segundos = restante % 60;

  const formatado = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  const alerta = restante < 600; // < 10min

  return (
    <>
      <div
        className={`px-4 py-2 rounded-xl text-sm font-mono font-bold tracking-wider transition-colors border ${
          alerta
            ? "bg-[#E85D04]/10 border-[#E85D04]/40 text-[#E85D04] animate-pulse"
            : "bg-[#12121a] border-[#2a2a3a] text-[#2EC4B6]"
        }`}
      >
        ⏱ {formatado}
      </div>

      {aviso && (
        <div className="fixed top-6 right-6 z-50 bg-[#12121a] border border-[#E85D04]/50 text-[#f0ece4] px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-full bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] text-lg">
            ⚠️
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#f0ece4]">Aviso de Tempo</h4>
            <p className="text-xs text-[#9895a4] mt-0.5">{aviso}</p>
          </div>
          <button 
            onClick={() => setAviso(null)} 
            className="ml-2 text-[#9895a4] hover:text-[#f0ece4] transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

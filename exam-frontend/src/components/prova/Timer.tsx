"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  fim: string;
  onTimeUp: () => void;
}

export function Timer({ fim, onTimeUp }: TimerProps) {
  const [restante, setRestante] = useState<number | null>(null);

  useEffect(() => {
    const calcular = () => {
      const diff = Math.max(0, Math.floor((new Date(fim).getTime() - Date.now()) / 1000));
      setRestante(diff);
      if (diff <= 0) {
        onTimeUp();
      }
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [fim, onTimeUp]);

  if (restante === null) return null;

  const horas = Math.floor(restante / 3600);
  const minutos = Math.floor((restante % 3600) / 60);
  const segundos = restante % 60;

  const formatado = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  const alerta = restante < 600; // < 10min

  return (
    <div
      className={`px-4 py-2 rounded-xl text-sm font-mono font-bold tracking-wider transition-colors border ${
        alerta
          ? "bg-[#E85D04]/10 border-[#E85D04]/40 text-[#E85D04] animate-pulse"
          : "bg-[#12121a] border-[#2a2a3a] text-[#2EC4B6]"
      }`}
    >
      ⏱ {formatado}
    </div>
  );
}

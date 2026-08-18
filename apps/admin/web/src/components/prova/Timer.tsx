"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  fim: string;
  onTimeUp: () => void;
}

export function Timer({ fim, onTimeUp }: TimerProps) {
  const [restante, setRestante] = useState(0);
  const [urgente, setUrgente] = useState(false);

  useEffect(() => {
    const fimDate = new Date(fim).getTime();

    const tick = () => {
      const agora = Date.now();
      const diff = Math.max(0, fimDate - agora);
      setRestante(diff);
      setUrgente(diff < 60000); // último minuto

      if (diff <= 0) {
        onTimeUp();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [fim, onTimeUp]);

  const horas = Math.floor(restante / 3600000);
  const minutos = Math.floor((restante % 3600000) / 60000);
  const segundos = Math.floor((restante % 60000) / 1000);

  return (
    <div
      className={`flex items-center gap-2 font-mono text-lg tabular-nums ${
        urgente
          ? "text-red-400 animate-timer-urgent"
          : "text-[#f0ece4]"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
      <span>
        {String(horas).padStart(2, "0")}:{String(minutos).padStart(2, "0")}:{String(segundos).padStart(2, "0")}
      </span>
    </div>
  );
}

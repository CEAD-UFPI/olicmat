"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  fim: string;
  onTimeUp: () => void;
}

export function Timer({ fim, onTimeUp }: TimerProps) {
  const [restante, setRestante] = useState<number | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [avisado30, setAvisado30] = useState(false);
  const [avisado10, setAvisado10] = useState(false);
  const [avisado1, setAvisado1] = useState(false);

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

  useEffect(() => {
    if (restante !== null) {
      // 30 minutos = 1800 segundos
      if (restante <= 1800 && restante > 1790 && !avisado30) {
        setAviso("Restam 30 minutos para o fim do tempo de prova.");
        setAvisado30(true);
      }
      // 10 minutos = 600 segundos
      else if (restante <= 600 && restante > 590 && !avisado10) {
        setAviso("Restam 10 minutos para o fim do tempo de prova.");
        setAvisado10(true);
      }
      // 1 minuto = 60 segundos
      else if (restante <= 60 && restante > 50 && !avisado1) {
        setAviso("Restam apenas 1 minuto para o fim do tempo de prova!");
        setAvisado1(true);
      }
    }
  }, [restante, avisado30, avisado10, avisado1]);

  useEffect(() => {
    if (aviso) {
      const timeout = setTimeout(() => {
        setAviso(null);
      }, 10000); // 10 segundos
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

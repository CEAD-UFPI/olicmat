"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import type { Inscricao } from "@/types";

export default function CompetidorResultadoPage() {
  const { user } = useAuthStore();
  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get("/inscricoes/minha")
      .then(({ data }) => setInscricao(data))
      .catch(() => setInscricao(null))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const medalhaInfo: Record<string, { cor: string; label: string }> = {
    OURO: { cor: "#f59e0b", label: "Ouro" },
    PRATA: { cor: "#94a3b8", label: "Prata" },
    BRONZE: { cor: "#d97706", label: "Bronze" },
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Resultado
        </h1>
        <p className="text-[#9895a4] mt-1">Seu desempenho na OLICMAT</p>
      </div>

      {!inscricao ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#b0adc0]">
            Voce ainda nao possui inscricao. Inscreva-se para participar da OLICMAT.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {inscricao.medalha && (
            <div
              className="border rounded-2xl p-8 text-center"
              style={{
                borderColor: `${medalhaInfo[inscricao.medalha]?.cor}40`,
                backgroundColor: `${medalhaInfo[inscricao.medalha]?.cor}10`,
              }}
            >
              <p className="text-5xl mb-3">
                {inscricao.medalha === "OURO" ? "🥇" : inscricao.medalha === "PRATA" ? "🥈" : "🥉"}
              </p>
              <h2
                className="text-2xl font-bold font-[family-name:var(--font-fraunces)]"
                style={{ color: medalhaInfo[inscricao.medalha]?.cor }}
              >
                Medalha de {medalhaInfo[inscricao.medalha]?.label}
              </h2>
              <p className="text-base text-[#b0adc0] mt-1">Parabens pelo seu desempenho</p>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="border border-[#2a2a3a] rounded-2xl p-5 bg-[#12121a] text-center">
              <p className="text-sm text-[#b0adc0] uppercase tracking-widest mb-2">Fase 1</p>
              <p className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
                {inscricao.fase1Nota != null ? `${inscricao.fase1Nota} pts` : "-"}
              </p>
            </div>
            <div className="border border-[#2a2a3a] rounded-2xl p-5 bg-[#12121a] text-center">
              <p className="text-sm text-[#b0adc0] uppercase tracking-widest mb-2">Fase 2</p>
              <p className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
                {inscricao.fase2Nota != null ? `${inscricao.fase2Nota} pts` : "-"}
              </p>
            </div>
            <div className="border border-[#2a2a3a] rounded-2xl p-5 bg-[#12121a] text-center">
              <p className="text-sm text-[#b0adc0] uppercase tracking-widest mb-2">Nota Final</p>
              <p className="text-3xl font-bold font-[family-name:var(--font-fraunces)]" style={{ color: "var(--pi-laranja)" }}>
                {inscricao.notaFinal != null ? `${inscricao.notaFinal} pts` : "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

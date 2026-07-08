"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";

interface Competidor {
  inscricaoId: string;
  nome: string;
  estado: string;
  fase1Nota: number;
  fase2Nota: number;
  notaFinal: number;
  medalha: string | null;
}

const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const medalhaCores: Record<string, string> = {
  OURO: "#f59e0b",
  PRATA: "#94a3b8",
  BRONZE: "#d97706",
};

const medalhaEmoji: Record<string, string> = {
  OURO: "\u{1F947}",
  PRATA: "\u{1F948}",
  BRONZE: "\u{1F949}",
};

export default function RankingPage() {
  const [estado, setEstado] = useState("");
  const [ranking, setRanking] = useState<Record<string, Competidor[]>>({});
  const [carregando, setCarregando] = useState(false);

  const buscarRanking = async (uf: string) => {
    setCarregando(true);
    try {
      const { data } = await api.get(`/ranking${uf ? `?estado=${uf}` : ""}`);
      setRanking(uf ? { [uf]: [...(data.OURO || []), ...(data.PRATA || []), ...(data.BRONZE || [])] } : data);
    } catch {
      setRanking({});
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarRanking(estado);
  }, [estado]);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-4xl font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Ranking OLICMAT
        </h1>
        <p className="text-[#9895a4] text-lg">Resultados por estado</p>
      </motion.div>

      <div className="flex justify-center mb-10">
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="h-12 px-4 rounded-xl bg-[#12121a] border border-[#2a2a3a] text-[#f0ece4] text-base focus:outline-none focus:border-[#E8B829] min-w-[200px]"
        >
          <option value="">Todos os estados</option>
          {ESTADOS.map((uf) => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>
      </div>

      {carregando ? (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(ranking).map(([uf, competidores]) => (
            <motion.div
              key={uf}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)] flex items-center gap-3">
                <span className="text-sm px-3 py-1 rounded-full bg-[#1a1a26] text-[#9895a4]">{uf}</span>
                {competidores.filter((c) => c.medalha).length > 0 && (
                  <span className="text-sm font-normal text-[#9895a4]">
                    {competidores.filter((c) => c.medalha).length} medalhistas
                  </span>
                )}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-[#2a2a3a]">
                      <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">#</th>
                      <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Nome</th>
                      <th className="text-right py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Fase 1</th>
                      <th className="text-right py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Fase 2</th>
                      <th className="text-right py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Final</th>
                      <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Medalha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competidores.map((c, i) => (
                      <tr key={c.inscricaoId} className="border-b border-[#2a2a3a]/50 hover:bg-[#1a1a26]/50 transition-colors">
                        <td className="py-4 px-5 text-[#9895a4]">{i + 1}</td>
                        <td className="py-4 px-5 text-[#f0ece4] font-medium">{c.nome}</td>
                        <td className="py-4 px-5 text-right text-[#9895a4]">{c.fase1Nota}</td>
                        <td className="py-4 px-5 text-right text-[#9895a4]">{c.fase2Nota || "-"}</td>
                        <td className="py-4 px-5 text-right text-[#f0ece4] font-semibold">{c.notaFinal.toFixed(1)}</td>
                        <td className="py-4 px-5 text-center">
                          {c.medalha && (
                            <span
                              className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: `${medalhaCores[c.medalha]}18`,
                                color: medalhaCores[c.medalha],
                              }}
                            >
                              {medalhaEmoji[c.medalha]} {c.medalha}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

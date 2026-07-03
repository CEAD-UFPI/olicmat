"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CursoMetrica {
  curso: string;
  total: number;
  confirmadas: number;
  pendentes: number;
  rejeitadas: number;
}

interface MetricasData {
  totalAlunos: number;
  totalInscricoes: number;
  confirmadas: number;
  pendentes: number;
  rejeitadas: number;
  porCurso?: CursoMetrica[];
}

export default function CoordenadorMetricasPage() {
  const [metricas, setMetricas] = useState<MetricasData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api
      .get("/coordenacao/metricas")
      .then(({ data }) => setMetricas(data))
      .catch(() => setErro("Erro ao carregar metricas."))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (erro || !metricas) {
    return (
      <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
        <p className="text-[#9895a4]">{erro || "Nenhuma metrica disponivel."}</p>
      </div>
    );
  }

  const total = metricas.totalInscricoes || 0;
  const taxaConfirmacao = total > 0 ? Math.round((metricas.confirmadas / total) * 100) : 0;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Metricas
        </h1>
        <p className="text-[#9895a4] mt-1">Estatisticas de inscricao por curso</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">{metricas.totalAlunos}</p>
          </CardContent>
        </Card>
        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest">Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">{metricas.totalInscricoes}</p>
          </CardContent>
        </Card>
        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest">Confirmadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#4CAF50] font-[family-name:var(--font-fraunces)]">{metricas.confirmadas}</p>
          </CardContent>
        </Card>
        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest">Taxa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">{taxaConfirmacao}%</p>
          </CardContent>
        </Card>
      </div>

      {metricas.porCurso && metricas.porCurso.length > 0 && (
        <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
          <div className="p-6 border-b border-[#2a2a3a]">
            <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
              Por Curso
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Curso</th>
                  <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Total</th>
                  <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Confirmadas</th>
                  <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Pendentes</th>
                  <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Rejeitadas</th>
                </tr>
              </thead>
              <tbody>
                {metricas.porCurso.map((c, i) => (
                  <tr key={i} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                    <td className="py-3 px-4 text-[#f0ece4] font-medium">{c.curso}</td>
                    <td className="py-3 px-4 text-center text-[#f0ece4]">{c.total}</td>
                    <td className="py-3 px-4 text-center text-[#4CAF50]">{c.confirmadas}</td>
                    <td className="py-3 px-4 text-center text-[#f59e0b]">{c.pendentes}</td>
                    <td className="py-3 px-4 text-center text-[#e53e3e]">{c.rejeitadas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a]">
        <h3 className="text-sm font-semibold text-[#f0ece4] mb-3">Resumo</h3>
        <div className="h-4 bg-[#0a0a0f] rounded-full overflow-hidden flex">
          {total > 0 && (
            <>
              <div
                className="h-full"
                style={{
                  width: `${total > 0 ? (metricas.confirmadas / total) * 100 : 0}%`,
                  backgroundColor: "#4CAF50",
                }}
              />
              <div
                className="h-full"
                style={{
                  width: `${total > 0 ? (metricas.pendentes / total) * 100 : 0}%`,
                  backgroundColor: "#f59e0b",
                }}
              />
              <div
                className="h-full"
                style={{
                  width: `${total > 0 ? (metricas.rejeitadas / total) * 100 : 0}%`,
                  backgroundColor: "#e53e3e",
                }}
              />
            </>
          )}
        </div>
        <div className="flex gap-6 mt-3 text-xs text-[#9895a4]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#4CAF50" }} />
            Confirmadas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
            Pendentes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#e53e3e" }} />
            Rejeitadas
          </span>
        </div>
      </div>
    </motion.div>
  );
}

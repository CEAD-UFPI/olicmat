"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckSquare, Clock } from "lucide-react";

interface Resumo {
  totalProvas?: number;
  totalPendentes?: number;
  totalAvaliadas?: number;
}

export default function AvaliadorPage() {
  const { user } = useAuthStore();
  const [resumo, setResumo] = useState<Resumo>({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/provas").then(({ data }) => data).catch(() => []),
      api.get("/admin/avaliacao/pendentes").then(({ data }) => data).catch(() => []),
    ])
      .then(([provas, pendentes]) => {
        setResumo({
          totalProvas: Array.isArray(provas) ? provas.length : 0,
          totalPendentes: Array.isArray(pendentes) ? pendentes.length : 0,
          totalAvaliadas: 0,
        });
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Ola, {user?.nome?.split(" ")[0]}
        </h1>
        <p className="text-[#9895a4] mt-1">Painel do avaliador</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={14} className="text-[#3AAFE0]" />
              Provas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
              {resumo.totalProvas ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-[#f59e0b]" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]" style={{ color: "#f59e0b" }}>
              {resumo.totalPendentes ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest flex items-center gap-2">
              <CheckSquare size={14} className="text-[#4CAF50]" />
              Avaliadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]" style={{ color: "#4CAF50" }}>
              {resumo.totalAvaliadas ?? "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a]">
        <h2 className="text-lg font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
          Acoes Rapidas
        </h2>
        <p className="text-sm text-[#9895a4] mb-4">Acesse as ferramentas de avaliacao</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/avaliador/provas"
            className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors"
          >
            <BookOpen size={18} className="text-[#3AAFE0]" />
            <div>
              <p className="text-sm font-medium text-[#f0ece4]">Gerenciar Provas</p>
              <p className="text-xs text-[#9895a4]">Criar e editar provas da Fase 1</p>
            </div>
          </a>
          <a
            href="/avaliador/fase2"
            className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors"
          >
            <CheckSquare size={18} className="text-[#4CAF50]" />
            <div>
              <p className="text-sm font-medium text-[#f0ece4]">Avaliar Fase 2</p>
              <p className="text-xs text-[#9895a4]">Avaliar videoaulas e portfolios</p>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

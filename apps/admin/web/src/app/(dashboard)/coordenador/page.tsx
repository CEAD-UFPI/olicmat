"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Clock, BookOpen } from "lucide-react";

interface Metricas {
  totalAlunos?: number;
  totalInscricoes?: number;
  confirmadas?: number;
  pendentes?: number;
}

export default function CoordenadorPage() {
  const { user } = useAuthStore();
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get("/coordenacao/metricas")
      .then(({ data }) => setMetricas(data))
      .catch(() => setMetricas({}))
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
        <p className="text-[#9895a4] mt-1">Painel de coordenacao de curso</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest flex items-center gap-2">
              <Users size={14} className="text-[#3AAFE0]" />
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
              {metricas?.totalAlunos ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={14} className="text-[#E8B829]" />
              Inscritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
              {metricas?.totalInscricoes ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#9895a4] text-xs uppercase tracking-widest flex items-center gap-2">
              <UserCheck size={14} className="text-[#4CAF50]" />
              Confirmadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]" style={{ color: "#4CAF50" }}>
              {metricas?.confirmadas ?? "-"}
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
              {metricas?.pendentes ?? "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a]">
        <h2 className="text-lg font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
          Acoes Rapidas
        </h2>
        <p className="text-sm text-[#9895a4] mb-4">Gerencie seus alunos e acompanhe o desempenho</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/coordenador/alunos"
            className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors"
          >
            <Users size={18} className="text-[#3AAFE0]" />
            <div>
              <p className="text-sm font-medium text-[#f0ece4]">Ver Alunos</p>
              <p className="text-xs text-[#9895a4]">Lista completa de alunos do curso</p>
            </div>
          </a>
          <a
            href="/coordenador/metricas"
            className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors"
          >
            <BookOpen size={18} className="text-[#E8B829]" />
            <div>
              <p className="text-sm font-medium text-[#f0ece4]">Ver Metricas</p>
              <p className="text-xs text-[#9895a4]">Estatisticas e graficos de desempenho</p>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

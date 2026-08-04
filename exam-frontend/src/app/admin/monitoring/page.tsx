"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

interface LiveStats {
  emAndamento: number;
  finalizadas: number;
  totalAtivos: number;
  mediaNotaFase1: number;
}

export default function AdminMonitoringPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/prova/monitoring/live-stats");
        setStats(data);
      } catch (err) {
        // Ignorar
      } finally {
        setCarregando(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Live poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f0ece4]">Painel de Monitoramento da Prova</h1>
          <p className="text-sm text-[#9895a4] mt-1">
            Operação em tempo real no servidor isolado de prova · Usuário: {user?.nome} ({user?.role})
          </p>
        </div>
        <a
          href="https://olicmat.cead.ufpi.br/admin"
          className="px-4 py-2 bg-[#2a2a3a] text-[#f0ece4] rounded-xl text-sm font-semibold hover:bg-[#3a3a4a]"
        >
          Voltar ao Admin Principal
        </a>
      </div>

      {carregando ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            titulo="Em Andamento"
            valor={stats?.emAndamento ?? 0}
            subtext="Alunos realizando a prova agora"
            cor="#FAA307"
          />
          <StatCard
            titulo="Finalizadas"
            valor={stats?.finalizadas ?? 0}
            subtext="Provas concluídas nesta edição"
            cor="#2EC4B6"
          />
          <StatCard
            titulo="Total de Participantes"
            valor={stats?.totalAtivos ?? 0}
            subtext="Total em execução + finalizadas"
            cor="#3A86EF"
          />
          <StatCard
            titulo="Média Fase 1"
            valor={stats?.mediaNotaFase1 != null ? `${stats.mediaNotaFase1} pts` : "---"}
            subtext="Média geral de desempenho"
            cor="#E85D04"
          />
        </div>
      )}
    </div>
  );
}

function StatCard({
  titulo,
  valor,
  subtext,
  cor,
}: {
  titulo: string;
  valor: string | number;
  subtext: string;
  cor: string;
}) {
  return (
    <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] space-y-2">
      <p className="text-xs uppercase tracking-wider text-[#9895a4]">{titulo}</p>
      <p className="text-3xl font-bold font-mono" style={{ color: cor }}>
        {valor}
      </p>
      <p className="text-xs text-[#9895a4] pt-1">{subtext}</p>
    </div>
  );
}

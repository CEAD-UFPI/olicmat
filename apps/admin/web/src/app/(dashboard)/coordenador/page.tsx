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
        <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
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
        <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
          Ola, {user?.nome?.split(" ")[0]}
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">Painel de coordenacao de curso</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-tertiary)] text-xs uppercase tracking-widest flex items-center gap-2">
              <Users size={14} className="text-[var(--color-blue-ink)]" />
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
              {metricas?.totalAlunos ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-tertiary)] text-xs uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={14} className="text-[var(--color-gold-ink)]" />
              Inscritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
              {metricas?.totalInscricoes ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-tertiary)] text-xs uppercase tracking-widest flex items-center gap-2">
              <UserCheck size={14} className="text-[var(--color-green-ink)]" />
              Confirmadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]" style={{ color: "var(--color-green-ink)" }}>
              {metricas?.confirmadas ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-tertiary)] text-xs uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-[var(--color-amber-ink)]" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]" style={{ color: "var(--color-amber-ink)" }}>
              {metricas?.pendentes ?? "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)]">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1 font-[family-name:var(--font-fraunces)]">
          Acoes Rapidas
        </h2>
        <p className="text-sm text-[var(--text-tertiary)] mb-4">Gerencie seus alunos e acompanhe o desempenho</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/coordenador/alunos"
            className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--border-strong)] transition-colors"
          >
            <Users size={18} className="text-[var(--color-blue-ink)]" />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Ver Alunos</p>
              <p className="text-xs text-[var(--text-tertiary)]">Lista completa de alunos do curso</p>
            </div>
          </a>
          <a
            href="/coordenador/metricas"
            className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--border-strong)] transition-colors"
          >
            <BookOpen size={18} className="text-[var(--color-gold-ink)]" />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Ver Metricas</p>
              <p className="text-xs text-[var(--text-tertiary)]">Estatisticas e graficos de desempenho</p>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

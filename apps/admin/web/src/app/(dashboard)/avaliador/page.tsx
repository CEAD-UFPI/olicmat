"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckSquare, Clock, HelpCircle } from "lucide-react";
import { SITE_URL } from "@/lib/site";

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
      api.get<{ atribuicoes: Array<{ status: string }> }>("/avaliador/fase2/atribuicoes").then(({ data }) => data.atribuicoes).catch(() => []),
    ])
      .then(([provas, fichas]) => {
        setResumo({
          totalProvas: Array.isArray(provas) ? provas.length : 0,
          totalPendentes: fichas.filter((f) => f.status === "PENDENTE").length,
          totalAvaliadas: fichas.filter((f) => f.status === "CONCLUIDA").length,
        });
      })
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
          Olá, {user?.nome?.split(" ")[0]}
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">Painel do avaliador</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={18} className="text-[var(--color-blue-ink)]" />
              Provas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
              {resumo.totalProvas ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-2">
              <Clock size={18} className="text-[var(--color-amber-ink)]" />
              Pendentes (Fase 2)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]" style={{ color: "var(--color-amber-ink)" }}>
              {resumo.totalPendentes ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-2">
              <CheckSquare size={18} className="text-[var(--color-green-ink)]" />
              Avaliadas (Fase 2)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]" style={{ color: "var(--color-green-ink)" }}>
              {resumo.totalAvaliadas ?? "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)]">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1 font-[family-name:var(--font-fraunces)]">
          Ações rápidas
        </h2>
        <p className="text-sm text-[var(--text-tertiary)] mb-4">Acesse as ferramentas de avaliação</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/avaliador/provas"
            className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--border-strong)] transition-colors"
          >
            <BookOpen size={20} className="text-[var(--color-blue-ink)]" />
            <div>
              <p className="text-base font-medium text-[var(--text-primary)]">Gerenciar Provas</p>
              <p className="text-sm text-[var(--text-secondary)]">Criar e editar provas da Fase 1</p>
            </div>
          </a>
          <a
            href="/avaliador/fase2"
            className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--border-strong)] transition-colors"
          >
            <CheckSquare size={20} className="text-[var(--color-green-ink)]" />
            <div>
              <p className="text-base font-medium text-[var(--text-primary)]">Avaliar Fase 2</p>
              <p className="text-sm text-[var(--text-secondary)]">Avaliar videoaulas e portfólios</p>
            </div>
          </a>
          <a
            href={`${SITE_URL}/tutorial-avaliador`}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--color-gold)]/40 hover:border-[var(--color-gold)] transition-colors"
          >
            <HelpCircle size={20} className="text-[var(--color-gold-ink)]" />
            <div>
              <p className="text-base font-medium text-[var(--text-primary)]">Tutorial do avaliador</p>
              <p className="text-sm text-[var(--text-secondary)]">Passo a passo da avaliação da Fase 2: critérios, conceitos de 0 a 5 e conclusão</p>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { tinta } from "@/lib/tema";

interface ProvaItem {
  id: string;
  titulo?: string;
  edicaoId?: string;
  duracaoMinutos?: number;
  status?: string;
  questoes?: unknown[];
}

export default function AvaliadorProvasPage() {
  const [provas, setProvas] = useState<ProvaItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get("/admin/provas")
      .then(({ data }) => setProvas(Array.isArray(data) ? data : []))
      .catch(() => setProvas([]))
      .finally(() => setCarregando(false));
  }, []);

  const statusColors: Record<string, string> = {
    RASCUNHO: "#9895a4",
    PUBLICADA: "#4CAF50",
    ENCERRADA: "#e53e3e",
  };

  const statusLabels: Record<string, string> = {
    RASCUNHO: "Rascunho",
    PUBLICADA: "Publicada",
    ENCERRADA: "Encerrada",
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
            Provas
          </h1>
          <p className="text-[var(--text-tertiary)] mt-1">Gerenciamento de provas da Fase 1</p>
        </div>
        <Button
          render={<Link href="/avaliador/provas/nova" />}
          style={{ backgroundColor: "var(--color-green)", color: "#fff" }}
          className="gap-2"
        >
          <Plus size={16} />
          Nova Prova
        </Button>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : provas.length === 0 ? (
        <div className="border border-[var(--border-color)] rounded-2xl p-8 bg-[var(--bg-secondary)] text-center">
          <p className="text-[var(--text-secondary)] mb-2">Nenhuma prova cadastrada.</p>
          <p className="text-sm text-[var(--text-secondary)]">Clique em Nova Prova para criar a primeira.</p>
        </div>
      ) : (
        <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Titulo</th>
                  <th className="text-center py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Duracao</th>
                  <th className="text-center py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Questoes</th>
                  <th className="text-center py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {provas.map((prova) => (
                  <tr key={prova.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-primary)]/50 transition-colors">
                    <td className="py-4 px-5">
                      <Link href={`/avaliador/provas/${prova.id}`} className="text-[var(--text-primary)] font-medium hover:text-[var(--color-green-ink)] transition-colors">
                        {prova.titulo || "Prova sem titulo"}
                      </Link>
                    </td>
                    <td className="py-4 px-5 text-center text-[var(--text-tertiary)]">
                      {prova.duracaoMinutos ? `${prova.duracaoMinutos} min` : "-"}
                    </td>
                    <td className="py-4 px-5 text-center text-[var(--text-tertiary)]">
                      {Array.isArray(prova.questoes) ? prova.questoes.length : 0}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className="text-sm font-medium px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${statusColors[prova.status || "RASCUNHO"]}20`,
                          color: tinta(statusColors[prova.status || "RASCUNHO"]),
                        }}
                      >
                        {statusLabels[prova.status || "RASCUNHO"]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

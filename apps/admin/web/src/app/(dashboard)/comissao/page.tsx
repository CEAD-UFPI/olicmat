"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, BookOpen, Clock, Download, Eye, BarChart3 } from "lucide-react";
import { tinta } from "@/lib/tema";

interface Resumo {
  totalInscricoes?: number;
  pendentes?: number;
}

export default function ComissaoPage() {
  const [resumo, setResumo] = useState<Resumo>({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get("/admin/metricas")
      .then(({ data }) => setResumo(data))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const links = [
    { href: "/comissao/acompanhamento", label: "Acompanhamento", descricao: "Funil de convites, cadastros e inscrições", icon: BarChart3, cor: "#4CAF50" },
    { href: "/comissao/inscricoes", label: "Inscrições", descricao: "Visualizar inscrições dos competidores", icon: ClipboardList, cor: "#E8B829" },
    { href: "/comissao/provas", label: "Provas", descricao: "Consultar provas cadastradas", icon: BookOpen, cor: "#3AAFE0" },
    { href: "/comissao/avaliacao", label: "Avaliação", descricao: "Acompanhar avaliações da Fase 2", icon: Eye, cor: "#4CAF50" },
    { href: "/comissao/exportar", label: "Exportar", descricao: "Exportar dados e resultados", icon: Download, cor: "#3AAFE0" },
    { href: "/comissao/auditoria", label: "Auditoria", descricao: "Visualizar log de ações do sistema", icon: Clock, cor: "#9895a4" },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
          Painel da Comissão
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">Acompanhamento geral da OLICMAT</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={18} style={{ color: "var(--color-gold-ink)" }} />
              Inscrições
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
              {resumo.totalInscricoes ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-2">
              <Clock size={18} style={{ color: "var(--color-amber-ink)" }} />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-[family-name:var(--font-fraunces)]" style={{ color: "var(--color-amber-ink)" }}>
              {resumo.pendentes ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-2">
              <Eye size={18} style={{ color: "var(--color-green-ink)" }} />
              Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-[var(--text-secondary)]">
              Visualização de dados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)]">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 font-[family-name:var(--font-fraunces)]">
          Seções
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--border-strong)] transition-colors"
            >
              <link.icon size={20} style={{ color: tinta(link.cor) }} />
              <div>
                <p className="text-base font-medium text-[var(--text-primary)]">{link.label}</p>
                <p className="text-sm text-[var(--text-secondary)]">{link.descricao}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

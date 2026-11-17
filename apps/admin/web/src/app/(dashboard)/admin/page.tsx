"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Clock, BookOpen, Building2, GraduationCap, Calendar, Trophy, UserX, BarChart3 } from "lucide-react";
import { tinta } from "@/lib/tema";

interface AdminResumo {
  totalUsuarios?: number;
  totalInscricoes?: number;
  pendentes?: number;
  cadastradosSemInscricao?: number;
}

export default function AdminPage() {
  const { user } = useAuthStore();
  const [resumo, setResumo] = useState<AdminResumo>({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/metricas").then(({ data }) => data).catch(() => ({})),
    ])
      .then(([metricas]) => setResumo(metricas))
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
    { href: "/admin/acompanhamento", label: "Acompanhamento", descricao: "Funil de convites, cadastros e inscrições", icon: BarChart3, cor: "#4CAF50" },
    { href: "/admin/instituicoes", label: "Instituicoes", descricao: "Gerenciar instituicoes", icon: Building2, cor: "#E8B829" },
    { href: "/admin/cursos", label: "Cursos", descricao: "Gerenciar cursos", icon: GraduationCap, cor: "#4CAF50" },
    { href: "/admin/edicoes", label: "Edicoes", descricao: "Gerenciar edicoes", icon: Calendar, cor: "#3AAFE0" },
    { href: "/admin/usuarios", label: "Usuarios", descricao: "Gerenciar usuarios e permissoes", icon: Users, cor: "#3AAFE0" },
    { href: "/admin/inscricoes", label: "Inscricoes", descricao: "Validar e gerenciar inscricoes", icon: ClipboardList, cor: "#E8B829" },
    { href: "/admin/provas", label: "Provas", descricao: "Criar e gerenciar provas", icon: BookOpen, cor: "#4CAF50" },
    { href: "/admin/avaliacao", label: "Avaliacao", descricao: "Avaliar Fase 2", icon: ClipboardList, cor: "#E8B829" },
    { href: "/admin/exportar", label: "Exportar", descricao: "Exportar dados dos resultados", icon: BookOpen, cor: "#3AAFE0" },
    { href: "/admin/ranking", label: "Ranking", descricao: "Calcular medalhas e publicar resultado", icon: Trophy, cor: "#f59e0b" },
    { href: "/admin/auditoria", label: "Auditoria", descricao: "Log de acoes do sistema", icon: Clock, cor: "#9895a4" },
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
          Painel Admin
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">Bem-vindo, {user?.nome?.split(" ")[0]}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-2">
              <Users size={18} className="text-[var(--color-blue-ink)]" />
              Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
              {resumo.totalUsuarios ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={18} className="text-[var(--color-gold-ink)]" />
              Inscricoes
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
              <Clock size={18} className="text-[var(--color-amber-ink)]" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]" style={{ color: "var(--color-amber-ink)" }}>
              {resumo.pendentes ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-2">
              <UserX size={18} className="text-[var(--color-gold-ink)]" />
              Sem inscrição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
              {resumo.cadastradosSemInscricao ?? "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)]">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 font-[family-name:var(--font-fraunces)]">
          Acoes Rapidas
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

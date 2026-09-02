"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Clock, BookOpen, Building2, GraduationCap, Calendar, Trophy } from "lucide-react";

interface AdminResumo {
  totalUsuarios?: number;
  totalInscricoes?: number;
  pendentes?: number;
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
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const links = [
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
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Painel Admin
        </h1>
        <p className="text-[#9895a4] mt-1">Bem-vindo, {user?.nome?.split(" ")[0]}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#b0adc0] text-sm uppercase tracking-widest flex items-center gap-2">
              <Users size={18} className="text-[#3AAFE0]" />
              Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
              {resumo.totalUsuarios ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#b0adc0] text-sm uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={18} className="text-[#E8B829]" />
              Inscricoes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
              {resumo.totalInscricoes ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#b0adc0] text-sm uppercase tracking-widest flex items-center gap-2">
              <Clock size={18} className="text-[#f59e0b]" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]" style={{ color: "#f59e0b" }}>
              {resumo.pendentes ?? "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a]">
        <h2 className="text-lg font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Acoes Rapidas
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors"
            >
              <link.icon size={20} style={{ color: link.cor }} />
              <div>
                <p className="text-base font-medium text-[#f0ece4]">{link.label}</p>
                <p className="text-sm text-[#b0adc0]">{link.descricao}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

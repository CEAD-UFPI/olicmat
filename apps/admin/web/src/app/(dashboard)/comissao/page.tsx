"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, BookOpen, Clock, Download, Eye } from "lucide-react";

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
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const links = [
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
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Painel da Comissão
        </h1>
        <p className="text-[#9895a4] mt-1">Acompanhamento geral da OLICMAT</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#b0adc0] text-sm uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={18} style={{ color: "#E8B829" }} />
              Inscrições
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
              <Clock size={18} style={{ color: "#f59e0b" }} />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-[family-name:var(--font-fraunces)]" style={{ color: "#f59e0b" }}>
              {resumo.pendentes ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#b0adc0] text-sm uppercase tracking-widest flex items-center gap-2">
              <Eye size={18} style={{ color: "#4CAF50" }} />
              Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-[#b0adc0]">
              Visualização de dados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a]">
        <h2 className="text-lg font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Seções
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

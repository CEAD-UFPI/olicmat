"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function ComissaoExportarPage() {
  const [exportando, setExportando] = useState<string | null>(null);

  const exportarCSV = async (tipo: string) => {
    setExportando(tipo);
    try {
      const response = await api.get(`/admin/export/${tipo}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tipo}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // silently fail
    } finally {
      setExportando(null);
    }
  };

  const opcoes = [
    { tipo: "inscricoes", label: "Inscrições", descricao: "Lista completa de inscrições com status e dados" },
    { tipo: "usuarios", label: "Usuários", descricao: "Lista de todos os usuários da plataforma" },
    { tipo: "provas", label: "Provas", descricao: "Lista de provas com quantidade de questões e status" },
    { tipo: "resultados", label: "Resultados", descricao: "Notas finais, medalhas e desempenho por competidor" },
    { tipo: "auditoria", label: "Auditoria", descricao: "Log de ações do sistema" },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Exportar Dados
        </h1>
        <p className="text-[#9895a4] mt-1">Exporte dados da plataforma em formato CSV</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {opcoes.map((op) => (
          <Card key={op.tipo} className="border-[#2a2a3a] bg-[#12121a]">
            <CardHeader>
              <CardTitle className="text-[#f0ece4]">{op.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-[#b0adc0] mb-4">{op.descricao}</p>
              <Button
                variant="outline"
                onClick={() => exportarCSV(op.tipo)}
                disabled={exportando === op.tipo}
                className="border-[#2a2a3a] text-[#f0ece4] gap-2 cursor-pointer"
              >
                <Download size={18} />
                {exportando === op.tipo ? "Exportando..." : `Exportar ${op.label}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

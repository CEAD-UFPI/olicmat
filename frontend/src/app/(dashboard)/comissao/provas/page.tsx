"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import { EdicaoSelector } from "@/components/shared/edicao-selector";

interface ProvaItem {
  id: string;
  titulo?: string;
  edicao?: { id: string; ano: number; titulo: string };
  duracaoMinutos?: number;
  status?: string;
  _count?: { questoes: number };
}

export default function ComissaoProvasPage() {
  const [provas, setProvas] = useState<ProvaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [edicaoId, setEdicaoId] = useState("");

  useEffect(() => {
    api
      .get("/admin/provas", { params: edicaoId ? { edicaoId } : {} })
      .then(({ data }) => setProvas(Array.isArray(data) ? data : []))
      .catch(() => setProvas([]))
      .finally(() => setCarregando(false));
  }, [edicaoId]);

  const statusColors: Record<string, string> = {
    RASCUNHO: "#9895a4",
    PUBLICADA: "#4CAF50",
    EM_ANDAMENTO: "#E8B829",
    ENCERRADA: "#e53e3e",
  };

  const statusLabels: Record<string, string> = {
    RASCUNHO: "Rascunho",
    PUBLICADA: "Publicada",
    EM_ANDAMENTO: "Em andamento",
    ENCERRADA: "Encerrada",
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Provas
        </h1>
        <p className="text-[#9895a4] mt-1">Consulta de provas cadastradas</p>
      </div>

      <div className="flex items-center gap-3">
        <EdicaoSelector value={edicaoId} onChange={(id) => setEdicaoId(id)} />
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : provas.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#9895a4]">Nenhuma prova cadastrada.</p>
        </div>
      ) : (
        <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Título</th>
                  <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Edição</th>
                  <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Duração</th>
                  <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Questões</th>
                  <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {provas.map((prova) => (
                  <tr key={prova.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/admin/provas/${prova.id}`} className="text-[#f0ece4] font-medium hover:text-[#E8B829] transition-colors">
                        {prova.titulo || "Prova sem título"}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center text-[#9895a4]">
                      {prova.edicao?.ano || "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-[#9895a4]">
                      {prova.duracaoMinutos ? `${prova.duracaoMinutos} min` : "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-[#9895a4]">
                      {prova._count?.questoes ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${statusColors[prova.status || "RASCUNHO"]}20`,
                          color: statusColors[prova.status || "RASCUNHO"],
                        }}
                      >
                        {statusLabels[prova.status || "RASCUNHO"] || prova.status}
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

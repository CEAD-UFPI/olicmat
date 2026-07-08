"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { EdicaoSelector } from "@/components/shared/edicao-selector";
import { Plus, Copy, Trash2 } from "lucide-react";

interface ProvaItem {
  id: string;
  titulo?: string;
  edicao?: { id: string; ano: number; titulo: string };
  duracaoMinutos?: number;
  status?: string;
  _count?: { questoes: number };
}

export default function AdminProvasPage() {
  const [provas, setProvas] = useState<ProvaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState<Record<string, boolean>>({});
  const [edicaoId, setEdicaoId] = useState("");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<ProvaItem | null>(null);
  const [deletando, setDeletando] = useState(false);

  // Pagination
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 10;

  useEffect(() => {
    api
      .get("/admin/provas", { params: edicaoId ? { edicaoId } : {} })
      .then(({ data }) => setProvas(Array.isArray(data) ? data : []))
      .catch(() => setProvas([]))
      .finally(() => setCarregando(false));
  }, [edicaoId]);

  const alterarStatus = async (id: string, novoStatus: string) => {
    setProcessando((prev) => ({ ...prev, [id]: true }));
    try {
      await api.patch(`/admin/provas/${id}`, { status: novoStatus });
      setProvas((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p))
      );
    } catch {
      // silently fail
    } finally {
      setProcessando((prev) => ({ ...prev, [id]: false }));
    }
  };

  const duplicar = async (id: string) => {
    setProcessando((prev) => ({ ...prev, [`dup-${id}`]: true }));
    try {
      const { data } = await api.post(`/admin/provas/${id}/duplicar`);
      setProvas((prev) => [data, ...prev]);
    } catch {
      // silently fail
    } finally {
      setProcessando((prev) => ({ ...prev, [`dup-${id}`]: false }));
    }
  };

  const confirmarDelete = async () => {
    if (!deleteTarget) return;
    setDeletando(true);
    try {
      await api.delete(`/admin/provas/${deleteTarget.id}`);
      setProvas((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // silently fail
    } finally {
      setDeletando(false);
    }
  };

  const totalPaginas = Math.max(1, Math.ceil(provas.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const paginados = provas.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            Provas
          </h1>
          <p className="text-[#9895a4] mt-1">Gerenciamento completo de provas</p>
        </div>
        <Button
          render={<Link href="/admin/provas/nova" />}
          style={{ backgroundColor: "#4CAF50", color: "#fff" }}
          className="gap-2"
        >
          <Plus size={16} />
          Nova Prova
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <EdicaoSelector value={edicaoId} onChange={(id) => { setEdicaoId(id); setPagina(1); }} />
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : provas.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#b0adc0] mb-2">Nenhuma prova cadastrada.</p>
          <p className="text-sm text-[#b0adc0]">Clique em Nova Prova para criar a primeira.</p>
        </div>
      ) : (
        <>
          <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Título</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Edição</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Duração</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Questões</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Status</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginados.map((prova) => (
                    <tr key={prova.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                      <td className="py-4 px-5">
                        <Link href={`/admin/provas/${prova.id}`} className="text-[#f0ece4] font-medium hover:text-[#4CAF50] transition-colors">
                          {prova.titulo || "Prova sem título"}
                        </Link>
                      </td>
                      <td className="py-4 px-5 text-center text-[#9895a4]">
                        {prova.edicao?.ano || "-"}
                      </td>
                      <td className="py-4 px-5 text-center text-[#9895a4]">
                        {prova.duracaoMinutos ? `${prova.duracaoMinutos} min` : "-"}
                      </td>
                      <td className="py-4 px-5 text-center text-[#9895a4]">
                        {prova._count?.questoes ?? 0}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span
                          className="text-sm font-medium px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: `${statusColors[prova.status || "RASCUNHO"]}20`,
                            color: statusColors[prova.status || "RASCUNHO"],
                          }}
                        >
                          {statusLabels[prova.status || "RASCUNHO"] || prova.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {prova.status === "RASCUNHO" && (
                            <Button
                              size="default"
                              variant="ghost"
                              disabled={processando[prova.id]}
                              onClick={() => alterarStatus(prova.id, "PUBLICADA")}
                              className="text-[#4CAF50] hover:bg-[#4CAF50]/10 text-sm cursor-pointer"
                            >
                              Publicar
                            </Button>
                          )}
                          {(prova.status === "PUBLICADA" || prova.status === "EM_ANDAMENTO") && (
                            <Button
                              size="default"
                              variant="ghost"
                              disabled={processando[prova.id]}
                              onClick={() => alterarStatus(prova.id, "ENCERRADA")}
                              className="text-red-400 hover:bg-red-400/10 text-sm cursor-pointer"
                            >
                              Encerrar
                            </Button>
                          )}
                          <button
                            onClick={() => duplicar(prova.id)}
                            disabled={processando[`dup-${prova.id}`]}
                            className="text-[#9895a4] hover:text-[#3AAFE0] transition-colors p-1 cursor-pointer"
                            title="Duplicar"
                          >
                            <Copy size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(prova)}
                            className="text-[#9895a4] hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination pagina={paginaAtual} totalPaginas={totalPaginas} onPageChange={setPagina} />
        </>
      )}

      <ConfirmDialog
        aberto={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmarDelete}
        titulo="Excluir Prova"
        mensagem={`Tem certeza que deseja excluir "${deleteTarget?.titulo || "Prova sem título"}"? As questões vinculadas apenas a esta prova também serão removidas.`}
        confirmando={deletando}
      />
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Eye, FileText } from "lucide-react";

interface InscricaoItem {
  id: string;
  nome?: string;
  email?: string;
  estado?: string;
  municipio?: string;
  instituicao?: string;
  curso?: string;
  periodo?: number;
  status: string;
  comprovanteUrl?: string;
  createdAt?: string;
}

export default function ComissaoInscricoesPage() {
  const [inscricoes, setInscricoes] = useState<InscricaoItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  const [detailTarget, setDetailTarget] = useState<InscricaoItem | null>(null);

  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 10;

  useEffect(() => {
    api.get("/inscricoes")
      .then(({ data }) => {
        const flatData = (Array.isArray(data) ? data : []).map((item: Record<string, unknown>) => ({
          id: item.id as string,
          nome: (item.user as Record<string, string>)?.nome ?? (item.nome as string),
          email: (item.user as Record<string, string>)?.email ?? (item.email as string),
          estado: item.estado as string,
          municipio: item.municipio as string,
          instituicao:
            ((item.instituicao as Record<string, string>)?.sigla as string) ??
            ((item.instituicao as Record<string, string>)?.nome as string) ??
            (item.instituicao as string) ?? "",
          curso: ((item.curso as Record<string, string>)?.nome as string) ?? (item.curso as string) ?? "",
          periodo: item.periodo as number,
          status: item.status as string,
          comprovanteUrl: item.comprovanteUrl as string,
          createdAt: item.createdAt as string,
        }));
        setInscricoes(flatData);
      })
      .catch(() => setInscricoes([]))
      .finally(() => setCarregando(false));
  }, []);

  const filtered = inscricoes.filter((i) => {
    const matchTexto =
      !filtro ||
      (i.nome && i.nome.toLowerCase().includes(filtro.toLowerCase())) ||
      (i.email && i.email.toLowerCase().includes(filtro.toLowerCase())) ||
      (i.instituicao && i.instituicao.toLowerCase().includes(filtro.toLowerCase()));
    const matchStatus = !statusFiltro || i.status === statusFiltro;
    return matchTexto && matchStatus;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtered.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const paginados = filtered.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const statusColors: Record<string, string> = {
    CONFIRMADA: "#4CAF50",
    PENDENTE: "#f59e0b",
    REJEITADA: "#e53e3e",
  };

  const statusLabels: Record<string, string> = {
    CONFIRMADA: "Confirmada",
    PENDENTE: "Pendente",
    REJEITADA: "Rejeitada",
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
          Inscrições
        </h1>
        <p className="text-[#9895a4] mt-1">Consulta de inscrições dos competidores</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por nome, email ou instituição..."
          value={filtro}
          onChange={(e) => { setFiltro(e.target.value); setPagina(1); }}
          className="flex-1 min-w-[200px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
        />
        <select
          value={statusFiltro}
          onChange={(e) => { setStatusFiltro(e.target.value); setPagina(1); }}
          className="h-10 px-3 rounded-lg bg-[#12121a] border border-[#2a2a3a] text-[#f0ece4] text-sm cursor-pointer"
        >
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="REJEITADA">Rejeitada</option>
        </select>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#9895a4]">Nenhuma inscrição encontrada.</p>
        </div>
      ) : (
        <>
          <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Nome</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Estado</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Instituição</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Curso</th>
                    <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Status</th>
                    <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginados.map((insc) => (
                    <tr key={insc.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                      <td className="py-3 px-4 text-[#f0ece4] font-medium">{insc.nome || "-"}</td>
                      <td className="py-3 px-4 text-[#9895a4]">{insc.estado || "-"}</td>
                      <td className="py-3 px-4 text-[#9895a4]">{insc.instituicao || "-"}</td>
                      <td className="py-3 px-4 text-[#9895a4]">{insc.curso || "-"}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${statusColors[insc.status] || "#9895a4"}20`,
                            color: statusColors[insc.status] || "#9895a4",
                          }}
                        >
                          {statusLabels[insc.status] || insc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setDetailTarget(insc)}
                            className="text-[#9895a4] hover:text-[#E8B829] transition-colors p-1 cursor-pointer"
                            title="Detalhes"
                          >
                            <Eye size={14} />
                          </button>
                          {insc.comprovanteUrl && (
                            <a
                              href={insc.comprovanteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#9895a4] hover:text-[#E8B829] transition-colors p-1 cursor-pointer"
                              title="Ver comprovante"
                            >
                              <FileText size={14} />
                            </a>
                          )}
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

      <Modal
        aberto={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        titulo="Detalhes da Inscrição"
      >
        {detailTarget && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[#9895a4]">Nome:</span><p className="text-[#f0ece4]">{detailTarget.nome || "-"}</p></div>
              <div><span className="text-[#9895a4]">Email:</span><p className="text-[#f0ece4]">{detailTarget.email || "-"}</p></div>
              <div><span className="text-[#9895a4]">Estado:</span><p className="text-[#f0ece4]">{detailTarget.estado || "-"}</p></div>
              <div><span className="text-[#9895a4]">Município:</span><p className="text-[#f0ece4]">{detailTarget.municipio || "-"}</p></div>
              <div><span className="text-[#9895a4]">Instituição:</span><p className="text-[#f0ece4]">{detailTarget.instituicao || "-"}</p></div>
              <div><span className="text-[#9895a4]">Curso:</span><p className="text-[#f0ece4]">{detailTarget.curso || "-"}</p></div>
              <div><span className="text-[#9895a4]">Período:</span><p className="text-[#f0ece4]">{detailTarget.periodo ?? "-"}</p></div>
              <div><span className="text-[#9895a4]">Status:</span>
                <p style={{ color: statusColors[detailTarget.status] || "#9895a4" }} className="font-medium">
                  {statusLabels[detailTarget.status] || detailTarget.status}
                </p>
              </div>
            </div>
            {detailTarget.comprovanteUrl && (
              <a
                href={detailTarget.comprovanteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8B829] hover:underline text-sm inline-block mt-2"
              >
                Ver comprovante →
              </a>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

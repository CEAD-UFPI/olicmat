"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Download } from "lucide-react";

interface LogEntry {
  id: string;
  entidade: string;
  acao: string;
  usuarioNome?: string;
  detalhes?: string;
  createdAt: string;
}

const ITENS_POR_PAGINA = 20;

export default function AdminAuditoriaPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [entidadeFiltro, setEntidadeFiltro] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [pagina, setPagina] = useState(1);
  const [exportando, setExportando] = useState(false);

  const carregar = () => {
    setCarregando(true);
    api
      .get("/admin/auditoria", {
        params: {
          page: pagina,
          limit: ITENS_POR_PAGINA,
          ...(entidadeFiltro ? { entidade: entidadeFiltro } : {}),
          ...(dataInicio ? { dataInicio } : {}),
          ...(dataFim ? { dataFim } : {}),
        },
      })
      .then(({ data }) => {
        const responseData = data.data ?? data;
        const arr = Array.isArray(responseData) ? responseData : [];
        const flatLogs = arr.map((log: Record<string, unknown>) => ({
          id: log.id as string,
          entidade: log.entidade as string,
          acao: log.acao as string,
          usuarioNome: (log.actor as Record<string, string>)?.nome ?? "Sistema",
          detalhes:
            typeof log.payload === "object"
              ? JSON.stringify(log.payload).substring(0, 200)
              : String(log.payload ?? ""),
          createdAt: log.createdAt as string,
        }));
        setLogs(flatLogs);
        setTotal((data.total as number) ?? arr.length);
      })
      .catch(() => {
        setLogs([]);
        setTotal(0);
      })
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, entidadeFiltro, dataInicio, dataFim]);

  const exportarCSV = async () => {
    setExportando(true);
    try {
      const response = await api.get("/admin/auditoria/export", {
        params: {
          ...(entidadeFiltro ? { entidade: entidadeFiltro } : {}),
          ...(dataInicio ? { dataInicio } : {}),
          ...(dataFim ? { dataFim } : {}),
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // silently fail
    } finally {
      setExportando(false);
    }
  };

  const entidades = [...new Set(logs.map((l) => l.entidade).filter(Boolean))];
  const totalPaginas = Math.max(1, Math.ceil(total / ITENS_POR_PAGINA));

  const acaoColors: Record<string, string> = {
    CREATE: "#4CAF50",
    UPDATE: "#3AAFE0",
    DELETE: "#e53e3e",
    LOGIN: "#E8B829",
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
            Auditoria
          </h1>
          <p className="text-[#9895a4] mt-1">Registro de ações do sistema</p>
        </div>
        <Button
          variant="outline"
          onClick={exportarCSV}
          disabled={exportando}
          className="border-[#2a2a3a] text-[#f0ece4] gap-2 cursor-pointer"
        >
          <Download size={14} />
          {exportando ? "Exportando..." : "Exportar CSV"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por usuário, ação ou detalhes..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 min-w-[200px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
        />
        <select
          value={entidadeFiltro}
          onChange={(e) => {
            setEntidadeFiltro(e.target.value);
            setPagina(1);
          }}
          className="h-10 px-3 rounded-lg bg-[#12121a] border border-[#2a2a3a] text-[#f0ece4] text-sm cursor-pointer"
        >
          <option value="">Todas as entidades</option>
          {entidades.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <Input
          type="date"
          value={dataInicio}
          onChange={(e) => {
            setDataInicio(e.target.value);
            setPagina(1);
          }}
          className="w-[160px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4]"
          title="Data início"
        />
        <Input
          type="date"
          value={dataFim}
          onChange={(e) => {
            setDataFim(e.target.value);
            setPagina(1);
          }}
          className="w-[160px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4]"
          title="Data fim"
        />
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#9895a4]">Nenhum registro de auditoria encontrado.</p>
        </div>
      ) : (
        <>
          <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Data</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Usuário</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Entidade</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Ação</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {logs
                    .filter((l) => {
                      if (!filtro) return true;
                      const f = filtro.toLowerCase();
                      return (
                        (l.usuarioNome && l.usuarioNome.toLowerCase().includes(f)) ||
                        l.acao.toLowerCase().includes(f) ||
                        (l.detalhes && l.detalhes.toLowerCase().includes(f))
                      );
                    })
                    .map((log) => (
                      <tr key={log.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                        <td className="py-3 px-4 text-[#9895a4] text-xs whitespace-nowrap">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString("pt-BR") : "-"}
                        </td>
                        <td className="py-3 px-4 text-[#f0ece4]">{log.usuarioNome || "-"}</td>
                        <td className="py-3 px-4 text-[#9895a4]">{log.entidade}</td>
                        <td className="py-3 px-4">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${acaoColors[log.acao] || "#9895a4"}20`,
                              color: acaoColors[log.acao] || "#9895a4",
                            }}
                          >
                            {log.acao}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#9895a4] text-xs max-w-xs truncate">
                          {log.detalhes || "-"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination pagina={pagina} totalPaginas={totalPaginas} onPageChange={setPagina} />
        </>
      )}
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { tinta } from "@/lib/tema";

interface LogEntry {
  id: string;
  entidade: string;
  acao: string;
  usuarioNome?: string;
  detalhes?: string;
  createdAt: string;
}

const ITENS_POR_PAGINA = 20;

export default function ComissaoAuditoriaPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [entidadeFiltro, setEntidadeFiltro] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
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
      .catch(() => { setLogs([]); setTotal(0); })
      .finally(() => setCarregando(false));
  }, [pagina, entidadeFiltro, dataInicio, dataFim]);

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
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
          Auditoria
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">Registro de ações do sistema</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por usuário, ação ou detalhes..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 min-w-[200px] bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
        />
        <select
          value={entidadeFiltro}
          onChange={(e) => { setEntidadeFiltro(e.target.value); setPagina(1); }}
          className="h-10 px-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-base cursor-pointer"
        >
          <option value="">Todas as entidades</option>
          {entidades.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <Input
          type="date"
          value={dataInicio}
          onChange={(e) => { setDataInicio(e.target.value); setPagina(1); }}
          className="w-[160px] bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]"
          title="Data início"
        />
        <Input
          type="date"
          value={dataFim}
          onChange={(e) => { setDataFim(e.target.value); setPagina(1); }}
          className="w-[160px] bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]"
          title="Data fim"
        />
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="border border-[var(--border-color)] rounded-2xl p-8 bg-[var(--bg-secondary)] text-center">
          <p className="text-[var(--text-secondary)]">Nenhum registro de auditoria encontrado.</p>
        </div>
      ) : (
        <>
          <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                    <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Data</th>
                    <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Usuário</th>
                    <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Entidade</th>
                    <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Ação</th>
                    <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Detalhes</th>
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
                      <tr key={log.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-primary)]/50 transition-colors">
                        <td className="py-4 px-5 text-[var(--text-tertiary)] text-sm whitespace-nowrap">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString("pt-BR") : "-"}
                        </td>
                        <td className="py-4 px-5 text-[var(--text-primary)]">{log.usuarioNome || "-"}</td>
                        <td className="py-4 px-5 text-[var(--text-tertiary)]">{log.entidade}</td>
                        <td className="py-4 px-5">
                          <span
                            className="text-sm font-medium px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: `${acaoColors[log.acao] || "#9895a4"}20`,
                              color: tinta(acaoColors[log.acao] || "var(--text-tertiary)"),
                            }}
                          >
                            {log.acao}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-[var(--text-tertiary)] text-sm max-w-xs truncate">
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

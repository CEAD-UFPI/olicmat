"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";

interface Submissao {
  id: string;
  nome: string;
  estado: string;
  curso: string;
  instituicao?: string;
  fase2Tema: string;
  fase2VideoUrl: string;
  fase2PortfolioUrl: string;
  fase2Nota: number | null;
}

interface HistoricoItem {
  id: string;
  nome: string;
  estado: string;
  curso: string;
  nota?: number;
  comentario?: string;
  avaliador?: string;
  avaliadoEm?: string;
}

export default function ComissaoAvaliacaoPage() {
  const [submissoes, setSubmissoes] = useState<Submissao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState("pendentes");
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [paginaHistorico, setPaginaHistorico] = useState(1);
  const [totalHistorico, setTotalHistorico] = useState(0);
  const [filtroNome, setFiltroNome] = useState("");

  useEffect(() => {
    api
      .get("/admin/avaliacao/pendentes")
      .then(({ data }) => {
        const arr = Array.isArray(data) ? data : [];
        const grouped = new Map<string, Submissao>();
        for (const envio of arr) {
          const inscId = envio.inscricaoId ?? envio.inscricao?.id;
          if (!grouped.has(inscId)) {
            grouped.set(inscId, {
              id: envio.id,
              nome: envio.inscricao?.user?.nome ?? "-",
              estado: envio.inscricao?.estado ?? "-",
              curso: envio.inscricao?.curso?.nome ?? "-",
              instituicao: envio.inscricao?.instituicao?.sigla ?? envio.inscricao?.instituicao?.nome ?? "-",
              fase2Tema: envio.inscricao?.fase2Tema ?? "-",
              fase2VideoUrl: "",
              fase2PortfolioUrl: "",
              fase2Nota: null,
            });
          }
          const entry = grouped.get(inscId)!;
          if (envio.tipo === "VIDEO") entry.fase2VideoUrl = envio.arquivoUrl ?? "";
          if (envio.tipo === "PORTFOLIO") entry.fase2PortfolioUrl = envio.arquivoUrl ?? "";
        }
        setSubmissoes(Array.from(grouped.values()));
      })
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  const carregarHistorico = async () => {
    setCarregandoHistorico(true);
    try {
      const { data } = await api.get("/admin/avaliacao/historico", {
        params: { page: paginaHistorico, limit: 5, ...(filtroNome ? { nome: filtroNome } : {}) },
      });
      const envios = data.data ?? [];
      const items: HistoricoItem[] = envios.map((envio: Record<string, unknown>) => {
        const insc = envio.inscricao as Record<string, unknown> | undefined;
        const user = insc?.user as Record<string, string> | undefined;
        const cursoObj = insc?.curso as Record<string, string> | undefined;
        const avaliacoes = (insc?.avaliacoes as Array<Record<string, unknown>>) ?? [];
        const ultima = avaliacoes[0];
        const avaliador = ultima?.avaliador as Record<string, string> | undefined;
        return {
          id: envio.id as string,
          nome: user?.nome ?? "-",
          estado: (insc?.estado as string) ?? "-",
          curso: cursoObj?.nome ?? "-",
          nota: (ultima?.nota as number) ?? undefined,
          comentario: (ultima?.parecer as string) ?? undefined,
          avaliador: avaliador?.nome ?? "-",
          avaliadoEm: (ultima?.avaliadoEm as string) ?? undefined,
        };
      });
      setHistorico(items);
      setTotalHistorico(data.total ?? 0);
    } catch {
      setHistorico([]);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  useEffect(() => {
    if (aba === "historico") carregarHistorico();
  }, [aba, paginaHistorico, filtroNome]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Avaliação — Fase 2
        </h1>
        <p className="text-[#9895a4] mt-1">Acompanhamento das avaliações</p>
      </div>

      {/* Tab toggle */}
      <div className="flex border-b border-[#2a2a3a]">
        <button
          onClick={() => setAba("pendentes")}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            aba === "pendentes"
              ? "text-[#E8B829] border-b-2 border-[#E8B829]"
              : "text-[#9895a4] hover:text-[#f0ece4]"
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setAba("historico")}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            aba === "historico"
              ? "text-[#E8B829] border-b-2 border-[#E8B829]"
              : "text-[#9895a4] hover:text-[#f0ece4]"
          }`}
        >
          Histórico
        </button>
      </div>

      {aba === "pendentes" && (
        <>
          {carregando ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : submissoes.length === 0 ? (
            <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
              <p className="text-[#9895a4]">Nenhuma submissão pendente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissoes.map((s) => (
                <Card key={s.id} className="border-[#2a2a3a] bg-[#12121a]">
                  <CardHeader>
                    <CardTitle className="text-[#f0ece4] text-base flex items-center justify-between">
                      <span>{s.nome}</span>
                      <span className="text-xs text-[#9895a4] font-normal">
                        {s.curso} — {s.estado}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-[#9895a4] uppercase tracking-widest">Tema</p>
                    <p className="text-sm text-[#f0ece4]">{s.fase2Tema}</p>
                    <div className="flex gap-4">
                      {s.fase2VideoUrl && (
                        <a href={s.fase2VideoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#3AAFE0] hover:underline">
                          Ver videoaula
                        </a>
                      )}
                      {s.fase2PortfolioUrl && (
                        <a href={s.fase2PortfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#3AAFE0] hover:underline">
                          Ver portfólio
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {aba === "historico" && (
        <div className="space-y-4">
          <Input
            placeholder="Buscar por nome..."
            value={filtroNome}
            onChange={(e) => { setFiltroNome(e.target.value); setPaginaHistorico(1); }}
            className="max-w-[300px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
          />

          {carregandoHistorico ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : historico.length === 0 ? (
            <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
              <p className="text-[#9895a4]">Nenhuma avaliação no histórico.</p>
            </div>
          ) : (
            <>
              {historico.map((h) => (
                <Card key={h.id} className="border-[#2a2a3a] bg-[#12121a]">
                  <CardHeader>
                    <CardTitle className="text-[#f0ece4] text-base flex items-center justify-between">
                      <span>{h.nome}</span>
                      <span className="text-xs text-[#9895a4] font-normal">
                        {h.curso} — {h.estado}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[#9895a4]">Nota:</span>
                        <span className="text-[#4CAF50] ml-2 font-medium">{h.nota ?? "-"}</span>
                      </div>
                      <div>
                        <span className="text-[#9895a4]">Avaliador:</span>
                        <span className="text-[#f0ece4] ml-2">{h.avaliador || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[#9895a4]">Data:</span>
                        <span className="text-[#f0ece4] ml-2">
                          {h.avaliadoEm ? new Date(h.avaliadoEm).toLocaleDateString("pt-BR") : "-"}
                        </span>
                      </div>
                    </div>
                    {h.comentario && (
                      <div>
                        <span className="text-[#9895a4]">Parecer:</span>
                        <p className="text-[#f0ece4] mt-1 bg-[#0a0a0f] rounded-lg p-2 text-xs">{h.comentario}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              <Pagination
                pagina={paginaHistorico}
                totalPaginas={Math.max(1, Math.ceil(totalHistorico / 5))}
                onPageChange={setPaginaHistorico}
              />
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

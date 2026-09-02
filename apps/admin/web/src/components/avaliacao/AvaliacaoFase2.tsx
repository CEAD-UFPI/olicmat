"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  fase2Tema?: string;
  nota?: number;
  comentario?: string;
  avaliador?: string;
  avaliadoEm?: string;
}

export interface AvaliacaoFase2Props {
  titulo: string;
  subtitulo: string;
  /** Habilita o formulário de lançamento de nota/parecer. */
  canAssign?: boolean;
  /** Exibe a aba "Histórico" (com busca e paginação). */
  showHistorico?: boolean;
  /** Exibe a coluna "Tema" no histórico. */
  showTemaHistorico?: boolean;
  /** Cor de destaque da aba ativa. */
  accent?: string;
  /** Separador entre curso e estado nos cabeçalhos dos cards. */
  separador?: string;
  /** Mensagem exibida quando não há submissões pendentes. */
  vazioPendentes?: string;
  /** Exibe ícone de "check" no estado vazio de pendentes. */
  vazioComIcone?: boolean;
  /** Mensagem de erro ao carregar pendentes (se omitida, o erro é ignorado). */
  erroPendentes?: string;
}

const ITENS_POR_PAGINA = 5;

export default function AvaliacaoFase2({
  titulo,
  subtitulo,
  canAssign = false,
  showHistorico = false,
  showTemaHistorico = false,
  accent = "#4CAF50",
  separador = " - ",
  vazioPendentes = "Nenhuma submissão pendente de avaliação.",
  vazioComIcone = false,
  erroPendentes,
}: AvaliacaoFase2Props) {
  const [submissoes, setSubmissoes] = useState<Submissao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [notaInput, setNotaInput] = useState<Record<string, string>>({});
  const [comentarioInput, setComentarioInput] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState<Record<string, boolean>>({});
  const [mensagem, setMensagem] = useState<Record<string, string>>({});

  const [aba, setAba] = useState("pendentes");
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [paginaHistorico, setPaginaHistorico] = useState(1);
  const [totalHistorico, setTotalHistorico] = useState(0);
  const [filtroNome, setFiltroNome] = useState("");

  useEffect(() => {
    carregarPendentes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarPendentes = async () => {
    setCarregando(true);
    try {
      const { data } = await api.get("/correcao/pendentes");
      const arr = Array.isArray(data) ? data : [];
      // Agrupa VIDEO + PORTFOLIO por inscricaoId
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
      const submissoesData = Array.from(grouped.values());
      setSubmissoes(submissoesData);
      const notas: Record<string, string> = {};
      const comentarios: Record<string, string> = {};
      submissoesData.forEach((s) => {
        notas[s.id] = s.fase2Nota != null ? String(s.fase2Nota) : "";
        comentarios[s.id] = "";
      });
      setNotaInput(notas);
      setComentarioInput(comentarios);
    } catch {
      if (erroPendentes) setErro(erroPendentes);
    } finally {
      setCarregando(false);
    }
  };

  const carregarHistorico = async () => {
    setCarregandoHistorico(true);
    try {
      const { data } = await api.get("/correcao/historico", {
        params: {
          page: paginaHistorico,
          limit: ITENS_POR_PAGINA,
          ...(filtroNome ? { nome: filtroNome } : {}),
        },
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
          fase2Tema: (insc?.fase2Tema as string) ?? "-",
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
    if (showHistorico && aba === "historico") carregarHistorico();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba, paginaHistorico, filtroNome]);

  const atribuirNota = async (id: string) => {
    const nota = parseFloat(notaInput[id]);
    if (isNaN(nota) || nota < 0 || nota > 100) {
      setMensagem((prev) => ({ ...prev, [id]: "Nota deve ser entre 0 e 100." }));
      return;
    }

    setEnviando((prev) => ({ ...prev, [id]: true }));
    setMensagem((prev) => ({ ...prev, [id]: "" }));

    try {
      await api.post(`/correcao/${id}/nota`, {
        nota,
        comentario: comentarioInput[id] || undefined,
      });
      setMensagem((prev) => ({ ...prev, [id]: "Nota salva com sucesso." }));
      setSubmissoes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, fase2Nota: nota } : s))
      );
    } catch {
      setMensagem((prev) => ({ ...prev, [id]: "Erro ao salvar nota." }));
    } finally {
      setEnviando((prev) => ({ ...prev, [id]: false }));
    }
  };

  const totalPaginasHistorico = Math.max(1, Math.ceil(totalHistorico / ITENS_POR_PAGINA));

  const renderPendentes = () => {
    if (carregando) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (erro) {
      return (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#9895a4]">{erro}</p>
        </div>
      );
    }

    if (submissoes.length === 0) {
      return (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          {vazioComIcone && (
            <CheckCircle size={40} className="text-[#4CAF50] mx-auto mb-3" />
          )}
          <p className="text-[#9895a4]">{vazioPendentes}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {submissoes.map((s) => (
          <Card key={s.id} className="border-[#2a2a3a] bg-[#12121a]">
            <CardHeader>
              <CardTitle className="text-[#f0ece4] text-lg flex items-center justify-between">
                <span>{s.nome}</span>
                <span className="text-sm text-[#b0adc0] font-normal">
                  {s.curso}
                  {separador}
                  {s.estado}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className={canAssign ? "space-y-4" : "space-y-3"}>
              <div>
                <p className="text-sm text-[#b0adc0] uppercase tracking-widest">Tema</p>
                <p className="text-base text-[#f0ece4]">{s.fase2Tema}</p>
              </div>

              <div className="flex gap-4">
                {s.fase2VideoUrl && (
                  <a
                    href={s.fase2VideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#3AAFE0] hover:underline"
                  >
                    Ver videoaula
                  </a>
                )}
                {s.fase2PortfolioUrl && (
                  <a
                    href={s.fase2PortfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#3AAFE0] hover:underline"
                  >
                    Ver portfólio
                  </a>
                )}
              </div>

              {canAssign && (
                <div className="border-t border-[#2a2a3a] pt-4 space-y-3">
                  <div>
                    <Label className="text-[#f0ece4] text-base">Nota (0-100)</Label>
                    <div className="flex gap-3 mt-1.5">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={notaInput[s.id] || ""}
                        onChange={(e) =>
                          setNotaInput((prev) => ({ ...prev, [s.id]: e.target.value }))
                        }
                        placeholder="Ex: 85"
                        className="bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] max-w-[120px]"
                      />
                      <Button
                        size="sm"
                        onClick={() => atribuirNota(s.id)}
                        disabled={enviando[s.id]}
                        style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                        className="cursor-pointer"
                      >
                        {enviando[s.id] ? "Salvando..." : s.fase2Nota != null ? "Atualizar" : "Salvar nota"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#f0ece4] text-base">Comentário / Parecer</Label>
                    <textarea
                      value={comentarioInput[s.id] || ""}
                      onChange={(e) =>
                        setComentarioInput((prev) => ({ ...prev, [s.id]: e.target.value }))
                      }
                      rows={2}
                      className="mt-1.5 w-full rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm px-3 py-2 outline-none focus:border-[#4CAF50] transition-colors resize-vertical"
                      placeholder="Parecer sobre a submissão (opcional)..."
                    />
                  </div>

                  {mensagem[s.id] && (
                    <p
                      className={`text-sm ${
                        mensagem[s.id].includes("Erro") ? "text-red-400" : "text-[#4CAF50]"
                      }`}
                    >
                      {mensagem[s.id]}
                    </p>
                  )}
                  {s.fase2Nota != null && (
                    <p className="text-sm text-[#4CAF50]">Nota atual: {s.fase2Nota}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderHistorico = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar por nome..."
            value={filtroNome}
            onChange={(e) => {
              setFiltroNome(e.target.value);
              setPaginaHistorico(1);
            }}
            className="max-w-[300px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
          />
        </div>

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
            <div className="space-y-3">
              {historico.map((h) => (
                <Card key={h.id} className="border-[#2a2a3a] bg-[#12121a]">
                  <CardHeader>
                    <CardTitle className="text-[#f0ece4] text-lg flex items-center justify-between">
                      <span>{h.nome}</span>
                      <span className="text-sm text-[#b0adc0] font-normal">
                        {h.curso}
                        {separador}
                        {h.estado}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-base">
                    <div className="grid grid-cols-2 gap-2">
                      {showTemaHistorico && (
                        <div>
                          <span className="text-[#b0adc0]">Tema:</span>
                          <span className="text-[#f0ece4] ml-2">{h.fase2Tema || "-"}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[#b0adc0]">Nota:</span>
                        <span className="text-[#4CAF50] ml-2 font-medium">{h.nota ?? "-"}</span>
                      </div>
                      <div>
                        <span className="text-[#b0adc0]">Avaliador:</span>
                        <span className="text-[#f0ece4] ml-2">{h.avaliador || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[#b0adc0]">Data:</span>
                        <span className="text-[#f0ece4] ml-2">
                          {h.avaliadoEm ? new Date(h.avaliadoEm).toLocaleDateString("pt-BR") : "-"}
                        </span>
                      </div>
                    </div>
                    {h.comentario && (
                      <div>
                        <span className="text-[#b0adc0]">Parecer:</span>
                        <p className="text-[#f0ece4] mt-1 bg-[#0a0a0f] rounded-lg p-2 text-sm">
                          {h.comentario}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Pagination
              pagina={paginaHistorico}
              totalPaginas={totalPaginasHistorico}
              onPageChange={setPaginaHistorico}
            />
          </>
        )}
      </div>
    );
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
          {titulo}
        </h1>
        <p className="text-[#9895a4] mt-1">{subtitulo}</p>
      </div>

      {showHistorico ? (
        <div>
          <div className="flex border-b border-[#2a2a3a]">
            <button
              onClick={() => setAba("pendentes")}
              className={`px-5 py-2.5 text-base font-medium transition-colors cursor-pointer ${
                aba === "pendentes" ? "border-b-2" : "text-[#b0adc0] hover:text-[#f0ece4]"
              }`}
              style={aba === "pendentes" ? { color: accent, borderColor: accent } : undefined}
            >
              Pendentes
            </button>
            <button
              onClick={() => setAba("historico")}
              className={`px-5 py-2.5 text-base font-medium transition-colors cursor-pointer ${
                aba === "historico" ? "border-b-2" : "text-[#b0adc0] hover:text-[#f0ece4]"
              }`}
              style={aba === "historico" ? { color: accent, borderColor: accent } : undefined}
            >
              Histórico
            </button>
          </div>

          <div className="mt-6">{aba === "pendentes" ? renderPendentes() : renderHistorico()}</div>
        </div>
      ) : (
        renderPendentes()
      )}
    </motion.div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";

type StatusProva = "em_breve" | "em_andamento" | "realizada";
type StatusAluno = "nao_iniciado" | "em_andamento" | "finalizado";

interface ProvaMonitor {
  id: string;
  fase: number;
  titulo: string;
  duracaoMinutos: number;
  status: string;
  janelaInicio: string | null;
  janelaFim: string | null;
  totalQuestoes: number;
  statusMonitoramento: StatusProva;
}

interface EdicaoMonitor {
  id: string;
  ano: number;
  titulo: string;
  status: string;
  dataInicio: string | null;
  dataFim: string | null;
  provas: ProvaMonitor[];
}

interface InscricaoStatus {
  id: string;
  userId: string;
  nome: string;
  email: string;
  curso: string;
  status: StatusAluno;
  fase1Inicio: string | null;
  fase1Fim: string | null;
  fase1Nota: number | null;
  tempoExtraMinutos: number;
  tempoRestanteMinutos: number | null;
  respondidas: number;
  totalQuestoes: number;
}

const STATUS_PROVA_LABEL: Record<StatusProva, string> = {
  em_breve: "Em Breve",
  em_andamento: "Em Andamento",
  realizada: "Realizada",
};

const STATUS_PROVA_COR: Record<StatusProva, string> = {
  em_breve: "#9895a4",
  em_andamento: "#E8B829",
  realizada: "#2EC4B6",
};

function formatarTempo(minutos: number): string {
  if (minutos <= 0) return "Esgotado";
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}min`;
  return `${m}min`;
}

export function MonitoramentoPanel() {
  const [edicoes, setEdicoes] = useState<EdicaoMonitor[]>([]);
  const [carregandoEdicoes, setCarregandoEdicoes] = useState(true);

  const [provaSelecionada, setProvaSelecionada] = useState<ProvaMonitor | null>(null);
  const [inscricoes, setInscricoes] = useState<InscricaoStatus[]>([]);
  const [totalQuestoes, setTotalQuestoes] = useState(0);
  const [carregandoLista, setCarregandoLista] = useState(false);

  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; mensagem: string } | null>(null);
  const [modalReset, setModalReset] = useState<InscricaoStatus | null>(null);
  const [modalTempo, setModalTempo] = useState<InscricaoStatus | null>(null);
  const [minutosInput, setMinutosInput] = useState("30");
  const [acaoLoading, setAcaoLoading] = useState(false);

  const mostrarFeedback = useCallback((tipo: "sucesso" | "erro", mensagem: string) => {
    setFeedback({ tipo, mensagem });
    setTimeout(() => setFeedback(null), 4000);
  }, []);

  const fetchEdicoes = useCallback(async () => {
    try {
      const { data } = await api.get<EdicaoMonitor[]>("/admin/monitoramento");
      setEdicoes(Array.isArray(data) ? data : []);
    } catch {
      // Silencioso
    } finally {
      setCarregandoEdicoes(false);
    }
  }, []);

  const fetchInscricoes = useCallback(async (provaId: string) => {
    try {
      const { data } = await api.get<{ provaId: string; totalQuestoes: number; inscricoes: InscricaoStatus[] }>(
        `/admin/monitoramento/provas/${provaId}/inscricoes`,
      );
      setInscricoes(Array.isArray(data.inscricoes) ? data.inscricoes : []);
      setTotalQuestoes(data.totalQuestoes ?? 0);
    } catch {
      // Silencioso
    } finally {
      setCarregandoLista(false);
    }
  }, []);

  // Poll de edições a cada 5s (mantém os status das provas em tempo real).
  useEffect(() => {
    fetchEdicoes();
    const interval = setInterval(fetchEdicoes, 5000);
    return () => clearInterval(interval);
  }, [fetchEdicoes]);

  // Poll de inscrições apenas quando há prova selecionada.
  useEffect(() => {
    if (!provaSelecionada) return;
    setCarregandoLista(true);
    fetchInscricoes(provaSelecionada.id);
    const interval = setInterval(() => fetchInscricoes(provaSelecionada.id), 5000);
    return () => clearInterval(interval);
  }, [provaSelecionada, fetchInscricoes]);

  const selecionarProva = (prova: ProvaMonitor) => {
    if (prova.statusMonitoramento !== "em_andamento") return;
    setProvaSelecionada(prova);
  };

  const voltar = () => {
    setProvaSelecionada(null);
    setInscricoes([]);
    setTotalQuestoes(0);
  };

  const handleResetTempo = async () => {
    if (!modalReset) return;
    setAcaoLoading(true);
    try {
      await api.post(`/admin/monitoramento/inscricoes/${modalReset.id}/reset-tempo`);
      mostrarFeedback("sucesso", `Tempo de prova de ${modalReset.nome} foi resetado.`);
      setModalReset(null);
      if (provaSelecionada) fetchInscricoes(provaSelecionada.id);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao resetar tempo de prova.";
      mostrarFeedback("erro", msg);
    } finally {
      setAcaoLoading(false);
    }
  };

  const handleAdicionarTempo = async () => {
    if (!modalTempo) return;
    const mins = parseInt(minutosInput, 10);
    if (isNaN(mins) || mins < 1 || mins > 480) {
      mostrarFeedback("erro", "Informe um valor entre 1 e 480 minutos.");
      return;
    }
    setAcaoLoading(true);
    try {
      await api.post(`/admin/monitoramento/inscricoes/${modalTempo.id}/adicionar-tempo`, { minutos: mins });
      mostrarFeedback("sucesso", `${mins} minuto(s) adicionado(s) para ${modalTempo.nome}.`);
      setModalTempo(null);
      setMinutosInput("30");
      if (provaSelecionada) fetchInscricoes(provaSelecionada.id);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao adicionar tempo.";
      mostrarFeedback("erro", msg);
    } finally {
      setAcaoLoading(false);
    }
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
          Monitoramento de Provas
        </h1>
        <p className="text-[#9895a4] mt-1">
          Acompanhamento em tempo real das edições, provas e status dos alunos
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium ${
            feedback.tipo === "sucesso"
              ? "border-[#2EC4B6]/40 bg-[#2EC4B6]/10 text-[#2EC4B6]"
              : "border-[#e53e3e]/40 bg-[#e53e3e]/10 text-[#e53e3e]"
          }`}
        >
          {feedback.mensagem}
        </div>
      )}

      {provaSelecionada ? (
        <TabelaAlunos
          prova={provaSelecionada}
          inscricoes={inscricoes}
          totalQuestoes={totalQuestoes}
          carregando={carregandoLista}
          onVoltar={voltar}
          onReset={(insc) => setModalReset(insc)}
          onTempo={(insc) => { setModalTempo(insc); setMinutosInput("30"); }}
        />
      ) : (
        <ListaEdicoes
          edicoes={edicoes}
          carregando={carregandoEdicoes}
          onSelecionar={selecionarProva}
        />
      )}

      {modalReset && (
        <Modal
          onClose={() => setModalReset(null)}
          loading={acaoLoading}
          onConfirm={handleResetTempo}
          cor="#E8B829"
          titulo="Resetar Tempo de Prova"
          confirmarLabel={acaoLoading ? "Resetando..." : "Confirmar Reset"}
        >
          <p className="text-sm text-[#9895a4]">
            Isso irá <strong className="text-[#f0ece4]">reiniciar o cronômetro</strong> de{" "}
            <strong className="text-[#f0ece4]">{modalReset.nome}</strong>.
          </p>
          <p className="text-sm text-[#9895a4]">
            O aluno começará a prova do zero, com o tempo cheio. As respostas já salvas serão mantidas.
          </p>
          {modalReset.tempoExtraMinutos > 0 && (
            <p className="text-sm text-[#E8B829]">
              O tempo extra atual de +{modalReset.tempoExtraMinutos}min será zerado.
            </p>
          )}
        </Modal>
      )}

      {modalTempo && (
        <Modal
          onClose={() => setModalTempo(null)}
          loading={acaoLoading}
          onConfirm={handleAdicionarTempo}
          cor="#3A86EF"
          titulo="Adicionar Tempo Extra"
          confirmarLabel={acaoLoading ? "Adicionando..." : "Confirmar"}
        >
          <p className="text-sm text-[#9895a4]">
            Adicionar minutos extras ao cronômetro de{" "}
            <strong className="text-[#f0ece4]">{modalTempo.nome}</strong>.
          </p>
          {modalTempo.status === "finalizado" && (
            <p className="text-sm text-[#FAA307]">
              A prova deste aluno já foi encerrada — o tempo adicionado reabrirá a prova.
            </p>
          )}
          <div className="text-left space-y-1.5">
            <p className="text-xs text-[#9895a4]">
              Tempo extra atual:{" "}
              <span className="text-[#FAA307] font-medium">+{modalTempo.tempoExtraMinutos}min</span>
            </p>
            {modalTempo.tempoRestanteMinutos != null && (
              <p className="text-xs text-[#9895a4]">
                Tempo restante:{" "}
                <span className="text-[#f0ece4] font-medium">{formatarTempo(modalTempo.tempoRestanteMinutos)}</span>
              </p>
            )}
          </div>
          <div>
            <label htmlFor="minutos" className="block text-xs text-[#9895a4] mb-2 text-left">
              Minutos a adicionar (1–480)
            </label>
            <input
              id="minutos"
              type="number"
              min={1}
              max={480}
              value={minutosInput}
              onChange={(e) => setMinutosInput(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f0ece4] text-center text-lg font-mono focus:outline-none focus:border-[#3A86EF] transition-colors"
            />
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

function ListaEdicoes({
  edicoes,
  carregando,
  onSelecionar,
}: {
  edicoes: EdicaoMonitor[];
  carregando: boolean;
  onSelecionar: (prova: ProvaMonitor) => void;
}) {
  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (edicoes.length === 0) {
    return (
      <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
        <p className="text-[#b0adc0]">Nenhuma edição cadastrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {edicoes.map((edicao) => (
        <div key={edicao.id} className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a3a] bg-[#0a0a0f]">
            <div>
              <h2 className="text-lg font-bold text-[#f0ece4]">
                Edição {edicao.ano}
              </h2>
              <p className="text-xs text-[#9895a4]">{edicao.titulo}</p>
            </div>
            <span className="text-xs text-[#9895a4] font-mono">
              {edicao.provas.length} prova(s)
            </span>
          </div>

          {edicao.provas.length === 0 ? (
            <p className="px-6 py-4 text-sm text-[#9895a4]">Nenhuma prova cadastrada nesta edição.</p>
          ) : (
            <div className="divide-y divide-[#2a2a3a]/50">
              {edicao.provas.map((prova) => {
                const selecionavel = prova.statusMonitoramento === "em_andamento";
                return (
                  <button
                    key={prova.id}
                    type="button"
                    disabled={!selecionavel}
                    onClick={() => onSelecionar(prova)}
                    className={`w-full flex items-center justify-between gap-4 px-6 py-4 text-left transition-colors ${
                      selecionavel
                        ? "hover:bg-[#0a0a0f]/60 cursor-pointer"
                        : "cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-[#9895a4] w-16 shrink-0">
                        Fase {prova.fase}
                      </span>
                      <div>
                        <p className="text-[#f0ece4] font-medium">{prova.titulo || "Prova sem título"}</p>
                        <p className="text-xs text-[#9895a4]">
                          {prova.duracaoMinutos} min · {prova.totalQuestoes} questões
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${STATUS_PROVA_COR[prova.statusMonitoramento]}20`,
                          color: STATUS_PROVA_COR[prova.statusMonitoramento],
                        }}
                      >
                        {STATUS_PROVA_LABEL[prova.statusMonitoramento]}
                      </span>
                      {selecionavel && (
                        <span className="text-xs text-[#E8B829] font-medium">Acompanhar →</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TabelaAlunos({
  prova,
  inscricoes,
  totalQuestoes,
  carregando,
  onVoltar,
  onReset,
  onTempo,
}: {
  prova: ProvaMonitor;
  inscricoes: InscricaoStatus[];
  totalQuestoes: number;
  carregando: boolean;
  onVoltar: () => void;
  onReset: (insc: InscricaoStatus) => void;
  onTempo: (insc: InscricaoStatus) => void;
}) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | StatusAluno>("todos");

  const normalizar = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  const termo = normalizar(busca.trim());
  const filtradas = inscricoes.filter((insc) => {
    if (filtroStatus !== "todos" && insc.status !== filtroStatus) return false;
    if (!termo) return true;
    return (
      normalizar(insc.nome).includes(termo) ||
      normalizar(insc.email).includes(termo) ||
      normalizar(insc.curso).includes(termo)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">
            {prova.titulo || "Prova"} — Fase {prova.fase}
          </h2>
          <p className="text-sm text-[#9895a4] mt-0.5">
            Status dos alunos em tempo real · {totalQuestoes} questões
          </p>
        </div>
        <button
          type="button"
          onClick={onVoltar}
          className="px-4 py-2 bg-[#2a2a3a] text-[#f0ece4] rounded-xl text-sm font-semibold hover:bg-[#3a3a4a] transition-colors"
        >
          ← Voltar
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail ou curso…"
          className="flex-1 px-4 py-2.5 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-sm text-[#f0ece4] placeholder-[#9895a4] focus:outline-none focus:border-[#E8B829] transition-colors"
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as "todos" | StatusAluno)}
          className="px-3 py-2.5 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-sm text-[#f0ece4] focus:outline-none focus:border-[#E8B829] transition-colors"
        >
          <option value="todos">Todos os status</option>
          <option value="nao_iniciado">Não Iniciada</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="finalizado">Encerrada</option>
        </select>
      </div>

      <p className="text-xs text-[#9895a4]">
        {filtradas.length} de {inscricoes.length} aluno(s)
        {termo ? ` — filtro: "${busca.trim()}"` : ""}
      </p>

      {carregando ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : inscricoes.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-10 text-center">
          <p className="text-[#9895a4]">Nenhuma inscrição confirmada encontrada para esta prova.</p>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-10 text-center">
          <p className="text-[#9895a4]">Nenhum aluno corresponde à busca/filtro.</p>
          <button
            type="button"
            onClick={() => { setBusca(""); setFiltroStatus("todos"); }}
            className="mt-3 text-sm text-[#E8B829] hover:underline font-medium"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="border border-[#2a2a3a] rounded-2xl overflow-hidden bg-[#12121a]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0a0a0f] border-b border-[#2a2a3a]">
                  <th className="text-left p-4 text-[#9895a4] font-medium text-xs uppercase tracking-wider">Aluno</th>
                  <th className="text-left p-4 text-[#9895a4] font-medium text-xs uppercase tracking-wider hidden md:table-cell">Curso</th>
                  <th className="text-center p-4 text-[#9895a4] font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center p-4 text-[#9895a4] font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Q</th>
                  <th className="text-center p-4 text-[#9895a4] font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Extra</th>
                  <th className="text-right p-4 text-[#9895a4] font-medium text-xs uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3a]/50">
                {filtradas.map((insc) => (
                  <tr key={insc.id} className="hover:bg-[#0a0a0f]/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-[#f0ece4]">{insc.nome}</p>
                      <p className="text-xs text-[#9895a4] mt-0.5">{insc.email}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell text-[#9895a4] text-xs max-w-[160px] truncate" title={insc.curso}>
                      {insc.curso}
                    </td>
                    <td className="p-4 text-center">
                      {statusAlunoBadge(insc.status, insc.tempoRestanteMinutos)}
                      {insc.status === "finalizado" && insc.fase1Nota != null && (
                        <p className="text-xs text-[#9895a4] mt-1">{insc.fase1Nota.toFixed(1)} pts</p>
                      )}
                    </td>
                    <td className="p-4 text-center hidden sm:table-cell">
                      <span className="text-xs text-[#9895a4]">
                        {insc.respondidas}/{insc.totalQuestoes || totalQuestoes}
                      </span>
                    </td>
                    <td className="p-4 text-center hidden sm:table-cell">
                      {insc.tempoExtraMinutos > 0 ? (
                        <span className="text-xs text-[#FAA307] font-medium">+{insc.tempoExtraMinutos}min</span>
                      ) : (
                        <span className="text-xs text-[#9895a4]">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(insc.status === "em_andamento" || insc.status === "finalizado") && (
                          <>
                            <button
                              type="button"
                              onClick={() => onReset(insc)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E8B829]/40 text-[#E8B829] hover:bg-[#E8B829]/10 transition-colors"
                            >
                              Resetar
                            </button>
                            <button
                              type="button"
                              onClick={() => onTempo(insc)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#3A86EF]/40 text-[#3A86EF] hover:bg-[#3A86EF]/10 transition-colors"
                            >
                              + Tempo
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function statusAlunoBadge(status: StatusAluno, tempoRestante: number | null) {
  switch (status) {
    case "nao_iniciado":
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2a2a3a] text-[#9895a4]">
          Não Iniciada
        </span>
      );
    case "em_andamento":
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E8B829]/15 text-[#E8B829]">
          Iniciada — {tempoRestante != null ? `Faltam ${formatarTempo(tempoRestante)}` : "Em andamento"}
        </span>
      );
    case "finalizado":
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2EC4B6]/15 text-[#2EC4B6]">
          Encerrada
        </span>
      );
  }
}

function Modal({
  titulo,
  cor,
  confirmarLabel,
  onConfirm,
  onClose,
  loading,
  children,
}: {
  titulo: string;
  cor: string;
  confirmarLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-md w-full border border-[#2a2a3a] bg-[#12121a] rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-bold" style={{ color: cor }}>
          {titulo}
        </h3>
        <div className="space-y-3">{children}</div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 border border-[#2a2a3a] rounded-xl text-sm font-medium hover:bg-[#1f1f2e] disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-colors"
            style={{ backgroundColor: cor }}
          >
            {confirmarLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

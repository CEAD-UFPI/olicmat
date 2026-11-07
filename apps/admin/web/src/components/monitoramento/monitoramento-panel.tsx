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
  limiteInicio: string | null;
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
  cpf: string;
  matricula: string;
  status: StatusAluno;
  pendenteEncerramento: boolean;
  fase1FimMotivo: string | null;
  advertencias: number;
  sessaoAtiva: boolean;
  outroAparelho: boolean;
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

const MOTIVO_LABEL: Record<string, string> = {
  ALUNO: "Finalizou",
  TEMPO: "Tempo esgotado",
  ADVERTENCIAS: "3 advertências",
  ENCERRAMENTO_ADMIN: "Encerrada pelo suporte",
};

function formatarTempo(minutos: number): string {
  if (minutos <= 0) return "Esgotado";
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}min`;
  return `${m}min`;
}

/** Antes das 08:30 o suporte já precisa atender login e sessão. */
function provaAcompanhavel(prova: ProvaMonitor) {
  return prova.status !== "RASCUNHO" && prova.status !== "EM_REVISAO";
}

function dentroDaJanela(prova: ProvaMonitor, agora: Date): boolean {
  if (!prova.janelaInicio || !prova.janelaFim) return false;
  const ini = new Date(prova.janelaInicio).getTime();
  // O suporte continua atuando até 2h depois do fechamento (mesma regra da API).
  const fim = new Date(prova.janelaFim).getTime() + 2 * 60 * 60 * 1000;
  const t = agora.getTime();
  return t >= ini && t <= fim;
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
  const [modalDestravar, setModalDestravar] = useState<InscricaoStatus | null>(null);
  const [justificativa, setJustificativa] = useState("");
  const [modalSenha, setModalSenha] = useState<InscricaoStatus | null>(null);
  const [senhaGerada, setSenhaGerada] = useState<string | null>(null);
  const [modalEncerrar, setModalEncerrar] = useState(false);
  const [modalSessao, setModalSessao] = useState<InscricaoStatus | null>(null);
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
    if (!provaAcompanhavel(prova)) return;
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

  const handleDestravar = async () => {
    if (!modalDestravar) return;
    if (justificativa.trim().length < 5) {
      mostrarFeedback("erro", "Registre a justificativa.");
      return;
    }
    setAcaoLoading(true);
    try {
      await api.post(`/admin/monitoramento/inscricoes/${modalDestravar.id}/destravar`, { justificativa });
      mostrarFeedback("sucesso", `${modalDestravar.nome} destravado. Peça para recarregar a página (F5).`);
      setModalDestravar(null);
      setJustificativa("");
      if (provaSelecionada) fetchInscricoes(provaSelecionada.id);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      mostrarFeedback("erro", typeof msg === "string" ? msg : "Erro ao destravar.");
    } finally {
      setAcaoLoading(false);
    }
  };

  const handleSenha = async () => {
    if (!modalSenha) return;
    if (senhaGerada) {
      setModalSenha(null);
      setSenhaGerada(null);
      return;
    }
    setAcaoLoading(true);
    try {
      const { data } = await api.post<{ senha: string }>(
        `/admin/monitoramento/inscricoes/${modalSenha.id}/senha-temporaria`,
      );
      setSenhaGerada(data.senha);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      mostrarFeedback("erro", typeof msg === "string" ? msg : "Erro ao gerar senha.");
      setModalSenha(null);
    } finally {
      setAcaoLoading(false);
    }
  };

  const handleLiberarSessao = async () => {
    if (!modalSessao) return;
    setAcaoLoading(true);
    try {
      await api.post(`/admin/monitoramento/inscricoes/${modalSessao.id}/liberar-sessao`);
      mostrarFeedback("sucesso", `Sessão de ${modalSessao.nome} liberada. A pessoa já pode entrar em outro aparelho.`);
      setModalSessao(null);
      if (provaSelecionada) fetchInscricoes(provaSelecionada.id);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      mostrarFeedback("erro", typeof msg === "string" ? msg : "Erro ao liberar sessão.");
    } finally {
      setAcaoLoading(false);
    }
  };

  const handleEncerrarPendentes = async () => {
    if (!provaSelecionada) return;
    setAcaoLoading(true);
    try {
      const { data } = await api.post<{ encerradas: number; aindaEmAndamento: number }>(
        `/admin/monitoramento/provas/${provaSelecionada.id}/encerrar-pendentes`,
      );
      mostrarFeedback(
        "sucesso",
        `${data.encerradas} prova(s) encerrada(s). ${data.aindaEmAndamento} ainda com tempo.`,
      );
      setModalEncerrar(false);
      fetchInscricoes(provaSelecionada.id);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      mostrarFeedback("erro", typeof msg === "string" ? msg : "Erro ao encerrar pendentes.");
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
          onDestravar={(insc) => { setModalDestravar(insc); setJustificativa(""); }}
          onSenha={(insc) => { setModalSenha(insc); setSenhaGerada(null); }}
          onLiberarSessao={setModalSessao}
          onEncerrarPendentes={() => setModalEncerrar(true)}
        />
      ) : (
        <ListaEdicoes
          edicoes={edicoes}
          carregando={carregandoEdicoes}
          onSelecionar={selecionarProva}
        />
      )}

      {modalDestravar && (
        <Modal
          onClose={() => setModalDestravar(null)}
          loading={acaoLoading}
          onConfirm={handleDestravar}
          cor="#2EC4B6"
          titulo="Destravar Participante"
          confirmarLabel={acaoLoading ? "Destravando..." : "Destravar"}
        >
          <p className="text-sm text-[#9895a4]">
            Devolve <strong className="text-[#f0ece4]">{modalDestravar.nome}</strong> à prova e zera as
            advertências ({modalDestravar.advertencias}). As respostas salvas são mantidas, e o fim da prova não muda.
            Depois, peça para a pessoa recarregar a página (F5).
          </p>
          <label htmlFor="justificativa" className="block text-xs text-[#9895a4] text-left">
            Justificativa (fica na auditoria)
          </label>
          <textarea
            id="justificativa"
            rows={3}
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-sm text-[#f0ece4] focus:outline-none focus:border-[#2EC4B6]"
          />
        </Modal>
      )}

      {modalSenha && (
        <Modal
          onClose={() => { setModalSenha(null); setSenhaGerada(null); }}
          loading={acaoLoading}
          onConfirm={handleSenha}
          cor="#E8B829"
          titulo="Senha Temporária"
          confirmarLabel={senhaGerada ? "Já informei" : acaoLoading ? "Gerando..." : "Gerar senha"}
        >
          {senhaGerada ? (
            <>
              <p className="text-sm text-[#9895a4]">
                Informe a <strong className="text-[#f0ece4]">{modalSenha.nome}</strong>. Ela não será mostrada de novo.
              </p>
              <p className="text-center text-2xl font-mono font-bold tracking-widest text-[#E8B829] select-all">
                {senhaGerada}
              </p>
            </>
          ) : (
            <p className="text-sm text-[#9895a4]">
              Troca a senha de <strong className="text-[#f0ece4]">{modalSenha.nome}</strong> ({modalSenha.email}) por
              uma provisória. <strong className="text-[#f0ece4]">Confirme a identidade antes</strong> (CPF e matrícula abaixo do nome).
            </p>
          )}
        </Modal>
      )}

      {modalSessao && (
        <Modal
          onClose={() => setModalSessao(null)}
          loading={acaoLoading}
          onConfirm={handleLiberarSessao}
          cor="#3A86EF"
          titulo="Liberar Sessão"
          confirmarLabel={acaoLoading ? "Liberando..." : "Liberar"}
        >
          <p className="text-sm text-[#9895a4]">
            Permite que <strong className="text-[#f0ece4]">{modalSessao.nome}</strong> entre agora em outro aparelho.
            O aparelho anterior será desconectado assim que o novo login acontecer. Respostas e tempo não mudam.
          </p>
          <p className="text-sm text-[#9895a4]">
            Confirme a identidade antes: <span className="font-mono">CPF {modalSessao.cpf}</span>.
          </p>
        </Modal>
      )}

      {modalEncerrar && (
        <Modal
          onClose={() => setModalEncerrar(false)}
          loading={acaoLoading}
          onConfirm={handleEncerrarPendentes}
          cor="#e53e3e"
          titulo="Encerrar Pendentes"
          confirmarLabel={acaoLoading ? "Encerrando..." : "Encerrar"}
        >
          <p className="text-sm text-[#9895a4]">
            Encerra quem ficou com o tempo esgotado e não finalizou (fechou o navegador, caiu a
            internet). Quem ainda tem tempo não é afetado. Use depois do fechamento da prova.
          </p>
        </Modal>
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
                const selecionavel = provaAcompanhavel(prova);
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
  onDestravar,
  onSenha,
  onLiberarSessao,
  onEncerrarPendentes,
}: {
  prova: ProvaMonitor;
  inscricoes: InscricaoStatus[];
  totalQuestoes: number;
  carregando: boolean;
  onVoltar: () => void;
  onReset: (insc: InscricaoStatus) => void;
  onDestravar: (insc: InscricaoStatus) => void;
  onSenha: (insc: InscricaoStatus) => void;
  onLiberarSessao: (insc: InscricaoStatus) => void;
  onEncerrarPendentes: () => void;
}) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | StatusAluno>("todos");

  const agora = new Date();
  const janelaAberta = dentroDaJanela(prova, agora);

  const normalizar = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  const termo = normalizar(busca.trim());
  const pendentes = inscricoes.filter((i) => i.pendenteEncerramento).length;
  const prazoEncerrado = !!prova.limiteInicio && agora > new Date(prova.limiteInicio);
  const contadores = [
    {
      label: prazoEncerrado ? "Perderam o início" : "Não iniciaram",
      valor: inscricoes.filter((i) => i.status === "nao_iniciado").length,
      cor: "#9895a4",
    },
    { label: "Em andamento", valor: inscricoes.filter((i) => i.status === "em_andamento").length, cor: "#E8B829" },
    { label: "Encerradas", valor: inscricoes.filter((i) => i.status === "finalizado").length, cor: "#2EC4B6" },
    { label: "Outro aparelho", valor: inscricoes.filter((i) => i.outroAparelho).length, cor: "#e53e3e" },
    { label: "Por advertência", valor: inscricoes.filter((i) => i.fase1FimMotivo === "ADVERTENCIAS").length, cor: "#e53e3e" },
    { label: "Sem finalizar", valor: pendentes, cor: "#FAA307" },
  ];

  const filtradas = inscricoes.filter((insc) => {
    if (filtroStatus !== "todos" && insc.status !== filtroStatus) return false;
    if (!termo) return true;
    return (
      normalizar(insc.nome).includes(termo) ||
      normalizar(insc.email).includes(termo) ||
      insc.cpf.includes(termo.replace(/\D/g, "") || "\0") ||
      normalizar(insc.matricula ?? "").includes(termo) ||
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {contadores.map((c) => (
          <div key={c.label} className="border border-[#2a2a3a] rounded-xl bg-[#12121a] px-4 py-3">
            <p className="text-2xl font-bold" style={{ color: c.cor }}>{c.valor}</p>
            <p className="text-xs text-[#9895a4]">{c.label}</p>
          </div>
        ))}
      </div>

      {pendentes > 0 && (
        <div className="flex items-center justify-between gap-3 text-sm text-[#FAA307] bg-[#FAA307]/10 border border-[#FAA307]/20 rounded-xl p-3">
          <span>{pendentes} participante(s) com tempo esgotado e sem finalizar.</span>
          <button
            type="button"
            onClick={onEncerrarPendentes}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#FAA307]/40 hover:bg-[#FAA307]/10 shrink-0"
          >
            Encerrar pendentes
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, CPF, matrícula, e-mail ou curso…"
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

      {!janelaAberta && (
        <div className="text-sm text-[#FAA307] bg-[#FAA307]/10 border border-[#FAA307]/20 rounded-xl p-3">
          Fora do período da prova: resetar e destravar estão bloqueados.
        </div>
      )}

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
                      <p className="text-xs text-[#9895a4] mt-0.5 font-mono">
                        CPF {insc.cpf} · Mat. {insc.matricula}
                      </p>
                    </td>
                    <td className="p-4 hidden md:table-cell text-[#9895a4] text-xs max-w-[160px] truncate" title={insc.curso}>
                      {insc.curso}
                    </td>
                    <td className="p-4 text-center">
                      {statusAlunoBadge(insc.status, insc.tempoRestanteMinutos)}
                      {insc.fase1FimMotivo && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: insc.fase1FimMotivo === "ADVERTENCIAS" ? "#e53e3e" : "#9895a4" }}
                        >
                          {MOTIVO_LABEL[insc.fase1FimMotivo] ?? insc.fase1FimMotivo}
                        </p>
                      )}
                      {insc.outroAparelho && (
                        <p className="text-xs font-semibold text-[#e53e3e] mt-1">Tentativa em outro aparelho</p>
                      )}
                      {insc.pendenteEncerramento && (
                        <p className="text-xs text-[#FAA307] mt-1">Sem finalizar</p>
                      )}
                      {insc.advertencias > 0 && (
                        <p className="text-xs text-[#e53e3e] mt-1">{insc.advertencias} advertência(s)</p>
                      )}
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
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onSenha(insc)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#9895a4]/40 text-[#9895a4] hover:bg-[#9895a4]/10 transition-colors"
                        >
                          Senha
                        </button>
                        {insc.sessaoAtiva && (
                          <button
                            type="button"
                            onClick={() => onLiberarSessao(insc)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#3A86EF]/40 text-[#3A86EF] hover:bg-[#3A86EF]/10 transition-colors"
                          >
                            Liberar sessão
                          </button>
                        )}
                        {insc.status === "finalizado" && (
                          <button
                            type="button"
                            onClick={() => onDestravar(insc)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#2EC4B6]/40 text-[#2EC4B6] hover:bg-[#2EC4B6]/10 transition-colors"
                          >
                            Destravar
                          </button>
                        )}
                        {(insc.status === "em_andamento" || insc.status === "finalizado") && (
                          <>
                            <button
                              type="button"
                              disabled={!janelaAberta}
                              onClick={() => onReset(insc)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E8B829]/40 text-[#E8B829] hover:bg-[#E8B829]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Resetar
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

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useProvaStore } from "@/stores/provaStore";
import { useAuthStore } from "@/stores/authStore";
import { Timer } from "@/components/prova/Timer";
import { QuestaoCard } from "@/components/prova/QuestaoCard";
import { ExamGuard } from "@/components/exam/ExamGuard";

/** Sobrevive ao F5: o encerramento por advertências precisa chegar ao servidor. */
const CHAVE_ENCERRAMENTO = "olicmat_encerrar_advertencias";

const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://olicmat.cead.ufpi.br";

export default function ProvaStandalonePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    questoes,
    questaoAtual,
    fim,
    offsetRelogio,
    advertencias,
    outroAparelho,
    motivoFim,
    carregando,
    finalizada,
    salvando,
    erro,
    limparErro,
    carregarProva,
    responder,
    proximaQuestao,
    questaoAnterior,
    irParaQuestao,
    finalizar,
    sincronizar,
    registrarAdvertencia,
  } = useProvaStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendencias, setPendencias] = useState<{ naoSalvas: number[]; emBranco: number[] } | null>(null);
  const [selecaoLocal, setSelecaoLocal] = useState<Record<string, string | null>>({});
  const [respondeuAtual, setRespondeuAtual] = useState(false);
  const selecaoRef = useRef(selecaoLocal);
  selecaoRef.current = selecaoLocal;
  const encerrandoRef = useRef(false);
  const retomarEncerramento = useRef<() => void>(() => {});

  useEffect(() => {
    carregarProva().catch(() => {});
  }, [carregarProva]);

  useEffect(() => {
    if (questaoAtual >= 0 && questoes[questaoAtual]) {
      const q = questoes[questaoAtual];
      setSelecaoLocal((prev) => ({
        ...prev,
        [q.id]: prev[q.id] ?? q.respondida ?? null,
      }));
      // Compara com a marcação da tela: um salvamento que falhou não aparece como salvo.
      const marcada = selecaoRef.current[q.id] ?? q.respondida;
      setRespondeuAtual(!!q.respondida && marcada === q.respondida);
    }
  }, [questaoAtual, questoes]);

  // Mantém prazo, relógio e reaberturas do suporte em dia com a prova aberta.
  useEffect(() => {
    if (questoes.length === 0 || finalizada) return;
    // O navegador do celular congela os temporizadores em segundo plano.
    const atualizar = () => {
      if (localStorage.getItem(CHAVE_ENCERRAMENTO)) {
        retomarEncerramento.current();
      } else {
        sincronizar();
      }
    };
    const aoVoltar = () => {
      if (document.visibilityState === "visible") atualizar();
    };
    atualizar();
    const interval = setInterval(atualizar, 30_000);
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [questoes.length, finalizada, sincronizar]);

  const handleSelecionar = (letra: string) => {
    const q = questoes[questaoAtual];
    if (!q) return;
    setSelecaoLocal((prev) => ({ ...prev, [q.id]: letra }));
    setRespondeuAtual(false);
  };

  const handleResponder = async () => {
    const q = questoes[questaoAtual];
    if (!q) return;
    const selecionada = selecaoLocal[q.id];
    if (!selecionada) return;

    try {
      await responder(q.id, selecionada);
      setRespondeuAtual(true);
    } catch {
      // Capturado pelo store
    }
  };

  /** Questões cuja alternativa marcada na tela ainda não está no servidor. */
  const naoSalvas = useCallback(() => {
    return useProvaStore.getState().questoes.flatMap((q, i) => {
      const marcada = selecaoRef.current[q.id];
      return marcada && marcada !== q.respondida ? [{ q, numero: i + 1, marcada }] : [];
    });
  }, []);

  /** Marcou uma alternativa e saiu sem clicar em salvar: não perde a resposta. */
  const salvarPendente = useCallback(async () => {
    const { questoes: atuais, questaoAtual: indice } = useProvaStore.getState();
    const atual = atuais[indice];
    const pendente = naoSalvas().find(({ q }) => q.id === atual?.id);
    if (pendente) await responder(pendente.q.id, pendente.marcada).catch(() => {});
  }, [naoSalvas, responder]);

  /** Só quando a pessoa pede ("Salvar e Finalizar"); repete se a rede falhar. */
  const salvarTudo = useCallback(async () => {
    for (let tentativa = 0; tentativa < 3 && naoSalvas().length > 0; tentativa++) {
      if (tentativa > 0) await new Promise((r) => setTimeout(r, 2_000));
      for (const { q, marcada } of naoSalvas()) {
        await responder(q.id, marcada).catch(() => {});
      }
    }
  }, [naoSalvas, responder]);

  const handleTimeUp = useCallback(async () => {
    if (encerrandoRef.current) return;
    encerrandoRef.current = true;
    try {
      // Regra da prova: ao fim do tempo, só conta o que já estava salvo.
      // O suporte pode ter concedido tempo depois da última sincronização.
      await sincronizar();
      const { fim: fimAtual, offsetRelogio: offset, finalizada: jaFinalizada } = useProvaStore.getState();
      const aindaHaTempo = fimAtual && new Date(fimAtual).getTime() > Date.now() + offset;
      if (!aindaHaTempo && !jaFinalizada) await finalizar("TEMPO");
    } finally {
      encerrandoRef.current = false;
    }
  }, [finalizar, sincronizar]);

  /** Repete até confirmar: no celular, a terceira saída suspende a página. */
  const handleLimiteAdvertencias = useCallback(async () => {
    localStorage.setItem(CHAVE_ENCERRAMENTO, "1");
    await registrarAdvertencia();
    if (!useProvaStore.getState().finalizada) await finalizar("ADVERTENCIAS");
    if (useProvaStore.getState().finalizada) localStorage.removeItem(CHAVE_ENCERRAMENTO);
  }, [finalizar, registrarAdvertencia]);

  retomarEncerramento.current = handleLimiteAdvertencias;

  const navegar = async (acao: () => void) => {
    await salvarPendente();
    acao();
  };

  const levantarPendencias = () => {
    const salvar = naoSalvas().map(({ numero }) => numero);
    const emBranco = useProvaStore
      .getState()
      .questoes.flatMap((q, i) => (!q.respondida && !selecaoRef.current[q.id] ? [i + 1] : []));
    return { naoSalvas: salvar, emBranco };
  };

  const handleFinalizar = async () => {
    setShowConfirm(false);
    const lista = levantarPendencias();
    if (lista.naoSalvas.length > 0 || lista.emBranco.length > 0) {
      setPendencias(lista);
      return;
    }
    await finalizar();
  };

  const irParaPendente = (numero: number) => {
    setPendencias(null);
    irParaQuestao(numero - 1);
  };

  /** Só encerra com tudo salvo: se a rede falhar, a pessoa continua vendo o aviso. */
  const handleSalvarEFinalizar = async () => {
    await salvarTudo();
    const lista = levantarPendencias();
    if (lista.naoSalvas.length > 0) {
      setPendencias(lista);
      return;
    }
    setPendencias(null);
    await finalizar();
  };

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[#E85D04] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#9895a4]">Carregando prova no ambiente seguro...</p>
      </div>
    );
  }

  if (finalizada) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-6 space-y-6">
        <div className="text-7xl font-serif text-[#2EC4B6]">∫</div>
        <h1 className="text-3xl font-bold text-[#f0ece4]">Prova Finalizada</h1>
        <p className="text-[#9895a4]">
          {motivoFim === "ADVERTENCIAS"
            ? "Sua prova foi encerrada por 3 advertências. Foram registradas apenas as respostas já salvas. Se precisar, fale com o suporte."
            : motivoFim === "TEMPO"
            ? "O tempo da prova terminou. Foram registradas apenas as respostas salvas."
            : "Foram registradas as respostas salvas."}
        </p>
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5 text-left space-y-2">
          <p className="text-sm font-semibold text-[#f0ece4]">E agora?</p>
          <p className="text-sm text-[#9895a4] leading-relaxed">
            A nota <strong className="text-[#f0ece4]">não é divulgada nesta tela</strong>. O gabarito e a
            pontuação de todos os participantes serão publicados no site da OLICMAT, conforme o
            cronograma oficial.
          </p>
        </div>
        <a
          href={`${MAIN_APP_URL}/competidor`}
          className="inline-block w-full py-3.5 bg-[#E85D04] text-white font-semibold rounded-xl hover:bg-[#d05303] transition-colors"
        >
          Voltar ao Sistema Principal OLICMAT
        </a>
      </div>
    );
  }

  if (questoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
        <p className="text-[#e53e3e] font-semibold">{erro || "Nenhuma questão disponível"}</p>
        <a
          href={`${MAIN_APP_URL}/competidor`}
          className="py-2.5 px-6 bg-[#2a2a3a] text-[#f0ece4] rounded-xl font-medium"
        >
          Voltar ao Painel
        </a>
      </div>
    );
  }

  const questao = questoes[questaoAtual];
  const respondidas = questoes.filter((q) => q.respondida).length;
  const selecionadaAtual = questao ? selecaoLocal[questao.id] ?? null : null;

  return (
    <ExamGuard
      advertenciasIniciais={advertencias}
      onAdvertencia={registrarAdvertencia}
      encerrando={!!fim && typeof window !== "undefined" && !!localStorage.getItem(CHAVE_ENCERRAMENTO)}
      onAutoSubmit={handleLimiteAdvertencias}
    >
      <div className="max-w-4xl mx-auto p-3 sm:p-6 min-h-screen flex flex-col justify-between">
        <div>
          {/* Top Navbar */}
          <div className="flex items-center justify-between mb-4 sm:mb-8 pb-4 border-b border-[#2a2a3a] flex-wrap gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#E85D04]">OLICMAT</span>
                <span className="hidden sm:inline text-xs bg-[#2a2a3a] text-[#9895a4] px-2.5 py-1 rounded-md font-mono">
                  PROVA STACK ISOLADA
                </span>
              </div>
              <p className="text-xs text-[#9895a4] mt-1">
                Candidato: {user?.nome} · Questão {questaoAtual + 1} de {questoes.length}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {fim && <Timer fim={fim} offset={offsetRelogio} onTimeUp={handleTimeUp} />}
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#e53e3e]/40 text-[#e53e3e] hover:bg-[#e53e3e]/10 transition-colors"
              >
                Finalizar Prova
              </button>
            </div>
          </div>

          {outroAparelho && (
            <div role="alert" className="mb-4 p-4 rounded-xl border border-[#e53e3e] bg-[#e53e3e]/15 text-sm font-semibold text-[#ffb4b4]">
              Sua conta está sendo acessada em outro aparelho. Não é permitido usar o mesmo usuário em dois
              aparelhos ao mesmo tempo. Encerre o outro acesso.
            </div>
          )}

          {/* Question Card */}
          {erro && (
            <div className="mb-4 p-4 rounded-xl border border-[#e53e3e]/30 bg-[#e53e3e]/10 flex justify-between items-center text-sm text-[#e53e3e]">
              <span>{erro}</span>
              <button onClick={limparErro}>✕</button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {questao && (
              <QuestaoCard
                questao={questao}
                selecionada={selecionadaAtual}
                onSelecionar={handleSelecionar}
              />
            )}
          </AnimatePresence>

          {/* Submit Answer Action */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleResponder}
              disabled={!selecionadaAtual || salvando || respondeuAtual}
              className={`w-full sm:w-auto py-3 px-8 rounded-xl font-bold text-base transition-colors ${
                respondeuAtual
                  ? "bg-[#2EC4B6] text-white"
                  : "bg-[#E85D04] text-white hover:bg-[#d05303] disabled:opacity-50"
              }`}
            >
              {salvando ? "Salvando..." : respondeuAtual ? "✓ Resposta Salva" : "Salvar Resposta"}
            </button>
          </div>
        </div>

        {/* Bottom Pagination & Selector */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#2a2a3a] space-y-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
            {questoes.map((q, i) => (
              <button
                key={q.id}
                onClick={() => navegar(() => irParaQuestao(i))}
                aria-label={`Questão ${i + 1}`}
                className={`h-11 rounded-lg text-xs font-bold transition-all ${
                  i === questaoAtual
                    ? "bg-[#E85D04] text-white"
                    : q.respondida
                    ? "bg-[#2EC4B6]/20 text-[#2EC4B6] border border-[#2EC4B6]/30"
                    : "bg-[#12121a] text-[#9895a4] hover:bg-[#2a2a3a]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navegar(questaoAnterior)}
              disabled={questaoAtual === 0}
              className="px-5 py-3 rounded-xl border border-[#2a2a3a] text-sm font-medium hover:bg-[#12121a] disabled:opacity-30"
            >
              ← Anterior
            </button>
            <button
              onClick={() => navegar(proximaQuestao)}
              disabled={questaoAtual === questoes.length - 1}
              className="px-5 py-3 rounded-xl border border-[#2a2a3a] text-sm font-medium hover:bg-[#12121a] disabled:opacity-30"
            >
              Próxima →
            </button>
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="max-w-md w-full border border-[#2a2a3a] bg-[#12121a] rounded-2xl p-8 text-center space-y-6">
              <h3 className="text-xl font-bold text-[#f0ece4]">Confirmar Finalização?</h3>
              <p className="text-sm text-[#9895a4]">
                Você respondeu {respondidas} de {questoes.length} questões.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 border border-[#2a2a3a] rounded-xl text-sm font-medium hover:bg-[#1f1f2e]"
                >
                  Continuar Prova
                </button>
                <button
                  onClick={handleFinalizar}
                  className="flex-1 py-3 bg-[#2EC4B6] text-white rounded-xl text-sm font-bold hover:bg-[#28b2a5]"
                >
                  Finalizar Agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Aviso de questões pendentes */}
        {pendencias && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="max-w-md w-full max-h-full overflow-y-auto border border-[#FAA307]/40 bg-[#12121a] rounded-2xl p-6 sm:p-8 space-y-5">
              <h3 className="text-xl font-bold text-[#FAA307] text-center">Antes de finalizar</h3>
              {erro && <p className="text-sm text-[#e53e3e] text-center">{erro}</p>}
              <ListaPendentes
                titulo="Marcadas e não salvas"
                descricao="Estas respostas ainda não foram registradas."
                numeros={pendencias.naoSalvas}
                cor="#e53e3e"
                onIr={irParaPendente}
              />
              <ListaPendentes
                titulo="Em branco"
                descricao="Estas questões não têm alternativa marcada."
                numeros={pendencias.emBranco}
                cor="#FAA307"
                onIr={irParaPendente}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setPendencias(null)}
                  className="flex-1 py-3 border border-[#2a2a3a] rounded-xl text-sm font-medium"
                >
                  Voltar à Prova
                </button>
                <button
                  onClick={handleSalvarEFinalizar}
                  disabled={salvando}
                  className="flex-1 py-3 bg-[#2EC4B6] text-white rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  {salvando
                    ? "Salvando..."
                    : pendencias.naoSalvas.length > 0
                    ? "Salvar e Finalizar"
                    : "Finalizar Assim Mesmo"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExamGuard>
  );
}

function ListaPendentes({
  titulo,
  descricao,
  numeros,
  cor,
  onIr,
}: {
  titulo: string;
  descricao: string;
  numeros: number[];
  cor: string;
  onIr: (numero: number) => void;
}) {
  if (numeros.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold" style={{ color: cor }}>
        {titulo} ({numeros.length})
      </p>
      <p className="text-xs text-[#9895a4]">{descricao}</p>
      <div className="flex flex-wrap gap-1.5">
        {numeros.map((numero) => (
          <button
            key={numero}
            onClick={() => onIr(numero)}
            aria-label={`Ir para a questão ${numero}`}
            className="w-10 h-10 rounded-lg text-sm font-bold border"
            style={{ color: cor, borderColor: `${cor}66` }}
          >
            {numero}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useProvaStore } from "@/stores/provaStore";
import { useAuthStore } from "@/stores/authStore";
import { Timer } from "@/components/prova/Timer";
import { QuestaoCard } from "@/components/prova/QuestaoCard";
import { ExamGuard } from "@/components/exam/ExamGuard";

export default function ProvaStandalonePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    questoes,
    questaoAtual,
    fim,
    carregando,
    finalizada,
    nota,
    salvando,
    erro,
    limparErro,
    carregarProva,
    responder,
    proximaQuestao,
    questaoAnterior,
    irParaQuestao,
    finalizar,
  } = useProvaStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [unanswered, setUnanswered] = useState<{ index: number; id: string }[] | null>(null);
  const [selecaoLocal, setSelecaoLocal] = useState<Record<string, string | null>>({});
  const [respondeuAtual, setRespondeuAtual] = useState(false);

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
      setRespondeuAtual(!!q.respondida);
    }
  }, [questaoAtual, questoes]);

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

  const handleTimeUp = useCallback(() => {
    finalizar();
  }, [finalizar]);

  const handleFinalizar = async () => {
    setShowConfirm(false);
    const semResposta = questoes
      .map((q, i) => ({ index: i + 1, id: q.id, respondida: q.respondida }))
      .filter((q) => !q.respondida);

    if (semResposta.length > 0) {
      setUnanswered(semResposta.map((q) => ({ index: q.index, id: q.id })));
      return;
    }

    await finalizar();
  };

  const handleForcarFinalizar = async () => {
    setUnanswered(null);
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
        <p className="text-[#9895a4]">Sua nota na Fase 1 foi registrada com sucesso:</p>
        <p className="text-5xl font-bold text-[#E85D04]">{nota != null ? `${nota.toFixed(1)} pts` : "---"}</p>
        <a
          href="https://olicmat.cead.ufpi.br/competidor"
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
          href="https://olicmat.cead.ufpi.br/competidor"
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
    <ExamGuard onAutoSubmit={handleTimeUp}>
      <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col justify-between">
        <div>
          {/* Top Navbar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2a2a3a] flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#E85D04]">OLICMAT</span>
                <span className="text-xs bg-[#2a2a3a] text-[#9895a4] px-2.5 py-1 rounded-md font-mono">
                  PROVA STACK ISOLADA
                </span>
              </div>
              <p className="text-xs text-[#9895a4] mt-1">
                Candidato: {user?.nome} · Questão {questaoAtual + 1} de {questoes.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {fim && <Timer fim={fim} onTimeUp={handleTimeUp} />}
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#e53e3e]/40 text-[#e53e3e] hover:bg-[#e53e3e]/10 transition-colors"
              >
                Finalizar Prova
              </button>
            </div>
          </div>

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
              className={`py-3 px-8 rounded-xl font-bold text-base transition-colors ${
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
        <div className="mt-8 pt-6 border-t border-[#2a2a3a] flex items-center justify-between gap-4">
          <button
            onClick={questaoAnterior}
            disabled={questaoAtual === 0}
            className="px-5 py-2.5 rounded-xl border border-[#2a2a3a] text-sm font-medium hover:bg-[#12121a] disabled:opacity-30"
          >
            ← Anterior
          </button>

          <div className="flex gap-1.5 overflow-x-auto py-1 max-w-[50%]">
            {questoes.map((q, i) => (
              <button
                key={q.id}
                onClick={() => irParaQuestao(i)}
                className={`w-9 h-9 rounded-lg text-xs font-bold shrink-0 transition-all ${
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

          <button
            onClick={proximaQuestao}
            disabled={questaoAtual === questoes.length - 1}
            className="px-5 py-2.5 rounded-xl border border-[#2a2a3a] text-sm font-medium hover:bg-[#12121a] disabled:opacity-30"
          >
            Próxima →
          </button>
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

        {/* Unanswered warning modal */}
        {unanswered && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="max-w-md w-full border border-[#FAA307]/40 bg-[#12121a] rounded-2xl p-8 text-center space-y-6">
              <h3 className="text-xl font-bold text-[#FAA307]">Questões Não Respondidas</h3>
              <p className="text-sm text-[#9895a4]">
                Ainda restam {unanswered.length} questões pendentes de resposta.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setUnanswered(null)}
                  className="flex-1 py-3 border border-[#2a2a3a] rounded-xl text-sm font-medium"
                >
                  Revisar Pendentes
                </button>
                <button
                  onClick={handleForcarFinalizar}
                  className="flex-1 py-3 bg-[#2EC4B6] text-white rounded-xl text-sm font-bold"
                >
                  Finalizar Assim Mesmo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExamGuard>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useProvaStore } from "@/stores/provaStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/prova/Timer";
import { QuestaoCard } from "@/components/prova/QuestaoCard";
import { ExamGuard } from "@/components/exam/ExamGuard";

export default function ProvaPage() {
  const router = useRouter();
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

  const [iniciada, setIniciada] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Tentar iniciar prova se ainda não foi
        await api.post("/inscricoes/minha/iniciar-prova");
      } catch {
        // Prova já iniciada, ignorar erro
      }
      try {
        await carregarProva();
        setIniciada(true);
      } catch {
        router.push("/competidor");
      }
    };
    init();
  }, [carregarProva, router]);

  const handleTimeUp = useCallback(() => {
    finalizar();
  }, [finalizar]);

  const handleResponder = async (questaoId: string, alternativa: string) => {
    try {
      await responder(questaoId, alternativa);
    } catch {
      // Erro já foi capturado pelo store (estado `erro`)
    }
  };

  const handleFinalizar = async () => {
    await finalizar();
    setShowConfirm(false);
  };

  if (carregando && !iniciada) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (finalizada) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-6 font-[family-name:var(--font-fraunces)]" style={{ color: "var(--integral-verde)" }}>
          ∫
        </div>
        <h1 className="text-2xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
          Prova finalizada
        </h1>
        <p className="text-[#9895a4] mb-2">Sua nota na Fase 1:</p>
        <p className="text-4xl font-bold font-[family-name:var(--font-fraunces)]" style={{ color: "var(--pi-laranja)" }}>
          {nota?.toFixed(1)} pts
        </p>
        <Button
          className="mt-8"
          render={<div onClick={() => router.push("/competidor")} />}
          onClick={() => router.push("/competidor")}
          style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        >
          Voltar ao painel
        </Button>
      </div>
    );
  }

  if (!iniciada || questoes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#9895a4]">Carregando questões...</p>
      </div>
    );
  }

  const questao = questoes[questaoAtual];
  const respondidas = questoes.filter((q) => q.respondida).length;

  return (
    <ExamGuard onAutoSubmit={handleTimeUp}>
    <div className="max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            Fase 1 — Prova Online
          </h1>
          <p className="text-sm text-[#9895a4]">
            Questão {questaoAtual + 1} de {questoes.length} · {respondidas} respondidas
          </p>
        </div>
        <div className="flex items-center gap-4">
          {fim && <Timer fim={fim} onTimeUp={handleTimeUp} />}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(true)}
            className="border-[#e53e3e]/50 text-[#e53e3e] hover:bg-[#e53e3e]/10"
          >
            Finalizar
          </Button>
        </div>
      </div>

      {/* Questão atual */}
      <div className="mb-8">
        {erro && (
          <div className="mb-4 rounded-xl border border-[#e53e3e]/30 bg-[#e53e3e]/10 p-4 flex items-center justify-between gap-4">
            <p className="text-sm text-[#e53e3e]">{erro}</p>
            <button
              onClick={limparErro}
              className="text-xs text-[#9895a4] hover:text-[#f0ece4] shrink-0"
            >
              ✕
            </button>
          </div>
        )}
        <AnimatePresence mode="wait">
          {questao && (
            <QuestaoCard
              questao={questao}
              onResponder={handleResponder}
              disabled={salvando}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          onClick={questaoAnterior}
          disabled={questaoAtual === 0}
          className="border-[#2a2a3a] text-[#f0ece4]"
        >
          Anterior
        </Button>

        {/* Bolinhas de progresso */}
        <div className="flex gap-1.5 overflow-x-auto max-w-[50%] pb-1">
          {questoes.map((q, i) => (
            <button
              key={q.id}
              onClick={() => irParaQuestao(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium shrink-0 transition-all ${
                i === questaoAtual
                  ? "bg-[var(--pi-laranja)] text-white"
                  : q.respondida
                  ? "bg-[var(--integral-verde)]/20 text-[var(--integral-verde)] border border-[var(--integral-verde)]/30"
                  : "bg-[#1a1a26] text-[#9895a4] hover:bg-[#2a2a3a]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={proximaQuestao}
          disabled={questaoAtual === questoes.length - 1}
          className="border-[#2a2a3a] text-[#f0ece4]"
        >
          Próxima
        </Button>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] max-w-sm w-full text-center">
            <h3 className="text-lg font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
              Finalizar prova?
            </h3>
            <p className="text-sm text-[#9895a4] mb-2">
              Você respondeu {respondidas} de {questoes.length} questões.
            </p>
            {respondidas < questoes.length && (
              <p className="text-xs text-[#E8B829] mb-6">
                Atenção: {questoes.length - respondidas} questões não foram respondidas.
              </p>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="flex-1 border-[#2a2a3a] text-[#f0ece4]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleFinalizar}
                className="flex-1"
                style={{ backgroundColor: "var(--integral-verde)", color: "#fff" }}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ExamGuard>
  );
}

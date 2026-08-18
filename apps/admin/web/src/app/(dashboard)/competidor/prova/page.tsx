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
  const [unanswered, setUnanswered] = useState<{ index: number; id: string }[]>([]);
  const [selecaoLocal, setSelecaoLocal] = useState<Record<string, string | null>>({});
  const [respondeuAtual, setRespondeuAtual] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await api.post("/inscricoes/minha/iniciar-prova");
      } catch {
        // Prova já iniciada
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

  // Initialize local selection when loading a question
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
      // Erro já foi capturado pelo store
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
    setUnanswered([]);
    await finalizar();
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
          onClick={() => router.push("/competidor")}
          style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        >
          Voltar ao painel
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-16 space-y-6">
      <div className="text-6xl font-[family-name:var(--font-fraunces)]" style={{ color: "var(--pi-laranja)" }}>
        π
      </div>
      <h1 className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
        Portal Isolado de Prova (Fase 1)
      </h1>
      <p className="text-[#9895a4] text-sm leading-relaxed">
        A prova da OLICMAT é executada em uma aplicação standalone isolada e de alta performance na rede interna para garantir máxima estabilidade e segurança.
      </p>
      <Button
        size="lg"
        onClick={async () => {
          try {
            const { data } = await api.post("/auth/transition-token");
            if (data?.examAppUrl) {
              window.location.href = data.examAppUrl;
            }
          } catch (err: any) {
            alert(err?.response?.data?.message || "Erro ao redirecionar para a prova");
          }
        }}
        style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        className="w-full"
      >
        Acessar Aplicação de Prova
      </Button>
    </div>
  );

  const questao = questoes[questaoAtual];
  const respondidas = questoes.filter((q) => q.respondida).length;
  const selecionadaAtual = questao ? selecaoLocal[questao.id] ?? null : null;

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
          {fim && <Timer fim={fim as string} onTimeUp={handleTimeUp} />}
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
              selecionada={selecionadaAtual}
              onSelecionar={handleSelecionar}
            />
          )}
        </AnimatePresence>

        {/* Botão Responder */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleResponder}
            disabled={!selecionadaAtual || salvando || respondeuAtual}
            className="h-12 px-8 text-base font-semibold"
            style={{
              backgroundColor: respondeuAtual ? "var(--integral-verde)" : "var(--pi-laranja)",
              color: "#fff",
            }}
          >
            {salvando
              ? "Salvando..."
              : respondeuAtual
              ? "✓ Respondida"
              : "Responder"}
          </Button>
        </div>
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
                Continuar prova
              </Button>
              <Button
                onClick={handleFinalizar}
                className="flex-1"
                style={{ backgroundColor: "var(--integral-verde)", color: "#fff" }}
              >
                Finalizar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Unanswered questions modal */}
      {unanswered.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="border border-[#E8B829]/30 rounded-2xl p-8 bg-[#12121a] max-w-md w-full">
            <h3 className="text-lg font-bold text-[#E8B829] mb-2 font-[family-name:var(--font-fraunces)] text-center">
              Questões sem resposta
            </h3>
            <p className="text-sm text-[#9895a4] mb-4 text-center">
              As questões abaixo não foram respondidas. Você pode voltar e respondê-las ou finalizar mesmo assim.
            </p>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {unanswered.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setUnanswered([]);
                    setShowConfirm(false);
                    irParaQuestao(q.index - 1);
                  }}
                  className="w-10 h-10 rounded-lg text-sm font-bold bg-[#E8B829]/10 border border-[#E8B829]/30 text-[#E8B829] hover:bg-[#E8B829]/20 transition-colors"
                >
                  {q.index}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setUnanswered([]);
                  setShowConfirm(false);
                }}
                className="flex-1 border-[#2a2a3a] text-[#f0ece4]"
              >
                Voltar à prova
              </Button>
              <Button
                onClick={handleForcarFinalizar}
                className="flex-1"
                style={{ backgroundColor: "var(--integral-verde)", color: "#fff" }}
              >
                Finalizar mesmo assim
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ExamGuard>
  );
}

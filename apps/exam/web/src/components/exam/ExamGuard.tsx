"use client";

import { useEffect, useState, useRef, ReactNode } from "react";

interface ExamGuardProps {
  children: ReactNode;
  onAutoSubmit: () => void;
  /** Avisa o servidor: o suporte precisa ver as advertências em tempo real. */
  onAdvertencia?: () => void;
  /** Vêm do servidor, para que recarregar a página não zere a contagem. */
  advertenciasIniciais?: number;
  maxWarnings?: number;
}

/**
 * Uma única ação do participante dispara vários eventos: um Alt+Tab gera blur,
 * visibilitychange e, em alguns sistemas, a saída da tela cheia. Sem esta janela
 * de agrupamento, uma só saída contaria como duas ou três advertências e poderia
 * encerrar a prova de uma vez, contrariando o regulamento ("cada saída gera uma
 * advertência").
 */
const JANELA_MESMO_EVENTO_MS = 2_500;

const suportaTelaCheia = () => {
  if (typeof document === "undefined") return true;
  const doc = document as any;
  return !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled || doc.msFullscreenEnabled);
};

export function ExamGuard({
  children,
  onAutoSubmit,
  onAdvertencia,
  advertenciasIniciais = 0,
  maxWarnings = 3,
}: ExamGuardProps) {
  const desativado = process.env.NEXT_PUBLIC_DISABLE_EXAM_GUARD === "true";

  const [warnings, setWarnings] = useState(advertenciasIniciais);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningReason, setWarningReason] = useState("");
  const [semSuporte, setSemSuporte] = useState(false);
  const submittedRef = useRef(false);
  const contagemRef = useRef(advertenciasIniciais);
  const ultimoEventoRef = useRef(0);
  const callbacksRef = useRef({ onAutoSubmit, onAdvertencia });
  callbacksRef.current = { onAutoSubmit, onAdvertencia };

  useEffect(() => {
    setSemSuporte(!suportaTelaCheia());
  }, []);

  // Só sobe: a sincronização pode trazer um valor anterior à advertência que acabou
  // de ser enviada. Destravar zera a contagem, mas isso chega pelo F5 (novo estado).
  useEffect(() => {
    if (advertenciasIniciais > contagemRef.current) {
      contagemRef.current = advertenciasIniciais;
      setWarnings(advertenciasIniciais);
    }
  }, [advertenciasIniciais]);

  const requestFullscreen = () => {
    try {
      const elem = document.documentElement as any;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } catch {
      // Ignorar
    }
  };

  useEffect(() => {
    if (desativado) return;

    const triggerWarning = (reason: string) => {
      if (submittedRef.current) return;

      setWarningReason(reason);
      setShowWarningModal(true);

      const agora = Date.now();
      if (agora - ultimoEventoRef.current < JANELA_MESMO_EVENTO_MS) return;
      ultimoEventoRef.current = agora;

      const proxima = contagemRef.current + 1;
      contagemRef.current = proxima;
      setWarnings(proxima);
      callbacksRef.current.onAdvertencia?.();

      if (proxima >= maxWarnings) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[ExamGuard] Limite de advertências atingido, mas ignorado em modo de desenvolvimento.`);
        } else {
          submittedRef.current = true;
          callbacksRef.current.onAutoSubmit();
        }
      }
    };

    const handleFullscreenChange = () => {
      const fs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(fs);
      if (!fs) {
        triggerWarning("Saída do modo tela cheia detectada.");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning("Foco da janela perdido ou mudança de aba detectada.");
      }
    };

    const handleBlur = () => {
      triggerWarning("Foco da janela perdido.");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
        triggerWarning("Tentativa de abrir ferramentas de desenvolvedor.");
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [desativado, maxWarnings]);

  if (desativado) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {!isFullscreen && !submittedRef.current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <div className="max-w-md w-full border border-[#2a2a3a] bg-[#12121a] rounded-2xl p-8 text-center space-y-6">
            <div className="text-5xl text-[#E85D04]">⚠️</div>
            <h2 className="text-2xl font-bold text-[#f0ece4]">Modo Prova Seguro</h2>
            {semSuporte ? (
              <p className="text-sm text-[#9895a4] leading-relaxed">
                Este aparelho não permite o modo Tela Cheia exigido pela prova (é o caso do iPhone).
                Entre pelo computador. Seu tempo está correndo, e suas respostas já salvas continuam lá.
              </p>
            ) : (
              <>
                <p className="text-sm text-[#9895a4] leading-relaxed">
                  Para garantir a integridade da prova da OLICMAT, esta aplicação exige execução em modo Tela Cheia sem alteração de foco.
                </p>
                <button
                  onClick={requestFullscreen}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#E85D04] text-white font-semibold text-base hover:bg-[#d05303] transition-colors"
                >
                  Ativar Tela Cheia e Iniciar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showWarningModal && warnings < maxWarnings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="max-w-md w-full border border-[#E85D04]/40 bg-[#12121a] rounded-2xl p-6 text-center space-y-4">
            <h3 className="text-xl font-bold text-[#E85D04]">Atenção: Violação de Foco</h3>
            <p className="text-sm text-[#9895a4]">{warningReason}</p>
            <div className="p-3 bg-[#E85D04]/10 border border-[#E85D04]/20 rounded-xl text-xs text-[#f0ece4]">
              Advertência {warnings} de {maxWarnings}. Ao atingir {maxWarnings} advertências, sua prova será finalizada automaticamente.
            </div>
            <button
              onClick={() => {
                setShowWarningModal(false);
                requestFullscreen();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#E85D04] text-white font-semibold text-sm hover:bg-[#d05303]"
            >
              Entendido — Retornar à Prova
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

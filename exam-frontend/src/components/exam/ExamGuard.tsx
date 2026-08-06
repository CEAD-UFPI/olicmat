"use client";

import { useEffect, useState, useRef, ReactNode } from "react";

interface ExamGuardProps {
  children: ReactNode;
  onAutoSubmit: () => void;
  maxWarnings?: number;
}

export function ExamGuard({ children, onAutoSubmit, maxWarnings = 3 }: ExamGuardProps) {
  if (process.env.NEXT_PUBLIC_DISABLE_EXAM_GUARD === "true") {
    return <>{children}</>;
  }

  const [warnings, setWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningReason, setWarningReason] = useState("");
  const submittedRef = useRef(false);

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
    const handleFullscreenChange = () => {
      const fs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(fs);
      if (!fs && !submittedRef.current) {
        triggerWarning("Saída do modo tela cheia detectada.");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !submittedRef.current) {
        triggerWarning("Foco da janela perdido ou mudança de aba detectada.");
      }
    };

    const handleBlur = () => {
      if (!submittedRef.current) {
        triggerWarning("Foco da janela perdido.");
      }
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
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const triggerWarning = (reason: string) => {
    setWarnings((prev) => {
      const next = prev + 1;
      setWarningReason(reason);
      setShowWarningModal(true);

      if (next >= maxWarnings && !submittedRef.current) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[ExamGuard] Limite de advertências atingido, mas ignorado em modo de desenvolvimento.`);
        } else {
          submittedRef.current = true;
          onAutoSubmit();
        }
      }
      return next;
    });
  };

  return (
    <div className="relative min-h-screen">
      {!isFullscreen && !submittedRef.current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <div className="max-w-md w-full border border-[#2a2a3a] bg-[#12121a] rounded-2xl p-8 text-center space-y-6">
            <div className="text-5xl text-[#E85D04]">⚠️</div>
            <h2 className="text-2xl font-bold text-[#f0ece4]">Modo Prova Seguro</h2>
            <p className="text-sm text-[#9895a4] leading-relaxed">
              Para garantir a integridade da prova da OLICMAT, esta aplicação exige execução em modo Tela Cheia sem alteração de foco.
            </p>
            <button
              onClick={requestFullscreen}
              className="w-full py-3.5 px-6 rounded-xl bg-[#E85D04] text-white font-semibold text-base hover:bg-[#d05303] transition-colors"
            >
              Ativar Tela Cheia e Iniciar
            </button>
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

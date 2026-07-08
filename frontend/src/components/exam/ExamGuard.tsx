"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const MAX_WARNINGS = 3;

interface ExamGuardProps {
  children: React.ReactNode;
  onAutoSubmit?: () => void;
}

export function ExamGuard({ children, onAutoSubmit }: ExamGuardProps) {
  const router = useRouter();
  const [warnings, setWarnings] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const warningCountRef = useRef(0);
  const blockedRef = useRef(false);

  const handleAutoSubmit = useCallback(async () => {
    if (blockedRef.current) return;
    blockedRef.current = true;
    setBlocked(true);
    try {
      await api.post("/prova/finalizar");
    } catch {
      /* already finalized */
    }
    onAutoSubmit?.();
  }, [onAutoSubmit]);

  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }

    const incWarning = () => {
      if (blockedRef.current) return;
      warningCountRef.current += 1;
      setWarnings(warningCountRef.current);
      if (warningCountRef.current >= MAX_WARNINGS) {
        handleAutoSubmit();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !blockedRef.current) {
        incWarning();
      }
    };

    const handleVisibility = () => {
      if (document.hidden && !blockedRef.current) {
        incWarning();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (blockedRef.current) return;
      if (
        (e.ctrlKey && e.key === "r") ||
        (e.metaKey && e.key === "r") ||
        e.key === "F5" ||
        (e.ctrlKey && e.shiftKey && e.key === "r") ||
        (e.ctrlKey && e.key === "w") ||
        (e.metaKey && e.key === "w") ||
        (e.altKey && e.key === "F4")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (!blockedRef.current) e.preventDefault();
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (!blockedRef.current) e.preventDefault();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);

      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [handleAutoSubmit]);

  if (blocked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-[#e53e3e] mb-2 font-[family-name:var(--font-fraunces)]">
            Prova Finalizada
          </h2>
          <p className="text-[#9895a4]">
            Você excedeu o limite de advertências por sair da tela da prova. A prova foi
            finalizada automaticamente e as questões respondidas até agora foram salvas.
          </p>
          <button
            onClick={() => router.push("/competidor/resultado")}
            className="mt-6 px-6 py-2 rounded-lg font-medium"
            style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
          >
            Ver resultado
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {warnings > 0 && warnings < MAX_WARNINGS && (
        <div
          className="fixed top-0 inset-x-0 z-[100] text-white text-center py-2 px-4 text-sm font-medium animate-fade-in"
          style={{ backgroundColor: "#e53e3e" }}
        >
          {warnings === 1 &&
            "Você saiu da tela da prova. Esta é sua 1ª advertência."}
          {warnings === 2 &&
            "Você saiu da tela da prova novamente. Esta é sua 2ª advertência. Na próxima vez, a prova será finalizada automaticamente."}
        </div>
      )}
      {children}
    </>
  );
}

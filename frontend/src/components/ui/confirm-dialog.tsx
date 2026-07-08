"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ConfirmDialogProps {
  aberto: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo?: string;
  mensagem?: string;
  confirmando?: boolean;
  variante?: "danger" | "warning";
}

export function ConfirmDialog({
  aberto,
  onClose,
  onConfirm,
  titulo = "Confirmar ação",
  mensagem = "Tem certeza que deseja continuar?",
  confirmando = false,
  variante = "danger",
}: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && aberto) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [aberto, onClose]);

  const accentColor = variante === "danger" ? "#e53e3e" : "#E8B829";

  return (
    <AnimatePresence>
      {aberto && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full max-w-sm rounded-2xl bg-[#12121a] border border-[#2a2a3a] p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <AlertTriangle size={18} style={{ color: accentColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl text-[#f0ece4] font-semibold font-[family-name:var(--font-fraunces)]">
                  {titulo}
                </h3>
                <p className="text-[#b0adc0] text-base mt-1">{mensagem}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={confirmando}
                className="text-[#9895a4] hover:text-[#f0ece4] cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={onConfirm}
                disabled={confirmando}
                className="cursor-pointer"
                style={{
                  backgroundColor: accentColor,
                  color: "#fff",
                }}
              >
                {confirmando ? "Confirmando..." : "Confirmar"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

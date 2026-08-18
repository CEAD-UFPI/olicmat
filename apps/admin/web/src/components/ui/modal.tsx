"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

interface ModalProps {
  aberto: boolean;
  onClose: () => void;
  titulo?: string;
  children: ReactNode;
  tamanho?: ModalSize;
  /** Optional content shown in the header bar next to the close button (e.g. an Edit action). */
  headerActions?: ReactNode;
}

export function Modal({
  aberto,
  onClose,
  titulo,
  children,
  tamanho = "md",
  headerActions,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && aberto) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [aberto, onClose]);

  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <AnimatePresence>
      {aberto && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] overflow-y-auto"
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
            className={`relative w-full ${sizeClasses[tamanho]} rounded-2xl bg-[#12121a] border border-[#2a2a3a] p-8 shadow-2xl`}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {titulo && (
              <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-[#2a2a3a]">
                <h2 className="text-xl font-semibold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
                  {titulo}
                </h2>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {headerActions}
                  <button
                    onClick={onClose}
                    className="text-[#9895a4] hover:text-[#f0ece4] transition-colors p-1 rounded-lg hover:bg-[#0a0a0f] cursor-pointer"
                    title="Fechar"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

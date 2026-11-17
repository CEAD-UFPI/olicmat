"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { COR_BARRA_TEMA, TEMA_COOKIE, type Tema } from "@/lib/tema";

/**
 * Alternador de tema claro/escuro.
 *
 * O tema inicial é aplicado antes da pintura pelo <script> de
 * `TEMA_SCRIPT_INICIAL` (lib/tema.ts, injetado no root layout). Aqui só lemos `html[data-theme]` e
 * gravamos a escolha num cookie compartilhado entre olicmat.cead.ufpi.br e
 * admin.olicmat.cead.ufpi.br (Domain=.olicmat.cead.ufpi.br) + localStorage.
 */

const EVENTO = "olicmat-tema";

function lerTema(): Tema {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function assinar(cb: () => void) {
  window.addEventListener(EVENTO, cb);
  return () => window.removeEventListener(EVENTO, cb);
}

export function aplicarTema(tema: Tema) {
  const html = document.documentElement;
  html.setAttribute("data-theme", tema);
  html.style.colorScheme = tema;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", COR_BARRA_TEMA[tema]));
  const umAno = 60 * 60 * 24 * 365;
  const dominio = location.hostname.endsWith("olicmat.cead.ufpi.br") ? "; domain=.olicmat.cead.ufpi.br" : "";
  const seguro = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${TEMA_COOKIE}=${tema}; path=/; max-age=${umAno}; samesite=lax${dominio}${seguro}`;
  try {
    localStorage.setItem(TEMA_COOKIE, tema);
  } catch {
    /* modo privado — o cookie basta */
  }
  window.dispatchEvent(new Event(EVENTO));
}

interface ThemeToggleProps {
  /**
   * Mostra o texto "Modo escuro"/"Modo claro" ao lado do interruptor.
   * "sm": só a partir da largura sm (em telas estreitas fica só o ícone).
   */
  comRotulo?: boolean | "sm";
  className?: string;
}

export function ThemeToggle({ comRotulo = false, className }: ThemeToggleProps) {
  // null no servidor / antes da hidratação → evita divergência de markup.
  const tema = useSyncExternalStore<Tema | null>(assinar, lerTema, () => null);
  const escuro = tema === "dark";
  const rotulo = escuro ? "Modo claro" : "Modo escuro";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={escuro}
      aria-label={rotulo}
      title={escuro ? "Mudar para o modo claro" : "Mudar para o modo escuro"}
      onClick={() => aplicarTema(escuro ? "light" : "dark")}
      className={cn(
        "group inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-secondary)] py-1 pl-1 text-sm font-medium text-[var(--text-primary)] shadow-sm transition-colors hover:border-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] cursor-pointer",
        comRotulo === "sm" ? "pr-1 sm:pr-3" : comRotulo ? "pr-3" : "pr-1",
        className,
      )}
    >
      <span className="relative flex h-7 w-[52px] items-center justify-between rounded-full bg-[var(--surface)] px-1.5">
        <Sun size={14} className="relative z-10 text-[var(--color-gold-ink)]" aria-hidden />
        <Moon size={14} className="relative z-10 text-[var(--color-blue-ink)]" aria-hidden />
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-[var(--bg-secondary)] shadow ring-1 ring-[var(--border-strong)] transition-transform duration-200 flex items-center justify-center",
            escuro ? "translate-x-[24px]" : "translate-x-0",
            tema === null && "opacity-0",
          )}
        >
          {escuro ? (
            <Moon size={14} className="text-[var(--color-blue-ink)]" />
          ) : (
            <Sun size={14} className="text-[var(--color-gold-ink)]" />
          )}
        </span>
      </span>
      {comRotulo && (
        <span className={cn("whitespace-nowrap", comRotulo === "sm" && "hidden sm:inline")}>{rotulo}</span>
      )}
    </button>
  );
}


"use client";

import Link from "next/link";
import Image from "next/image";
import { House } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SITE_URL } from "@/lib/site";

/** Botão "Página inicial" (casinha) → site público. */
export function BotaoPaginaInicial({ comRotulo = false }: { comRotulo?: boolean }) {
  return (
    <a
      href={SITE_URL}
      aria-label="Página inicial"
      title="Página inicial (site da OLICMAT)"
      className={`flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold-ink)] ${
        comRotulo ? "px-3" : "w-9"
      }`}
    >
      <House size={18} aria-hidden />
      {comRotulo && <span>Página inicial</span>}
    </a>
  );
}

interface TopBarProps {
  /** Destino do logotipo (ex.: a visão geral do painel do papel). */
  logoHref: string;
}

/** Barra superior fixa do painel: logo + página inicial + alternador de tema. */
export function TopBar({ logoHref }: TopBarProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 lg:h-20 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link href={logoHref} className="flex min-w-0 items-center gap-2" aria-label="OLICMAT — painel">
            <Image
              src="/logo-semfundo-claro.png"
              alt=""
              width={57}
              height={40}
              className="h-10 w-auto object-contain so-tema-claro"
              priority
            />
            <Image
              src="/logo-semfundo.png"
              alt=""
              width={57}
              height={40}
              className="h-10 w-auto object-contain so-tema-escuro"
              priority
            />
            <span className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-fraunces)] tracking-tight">
              <span style={{ color: "var(--logo-gold)" }}>O</span>
              <span style={{ color: "var(--logo-green)" }}>L</span>
              <span style={{ color: "var(--logo-blue)" }}>I</span>
              <span className="text-[var(--text-primary)]">CMAT</span>
            </span>
          </Link>
          <BotaoPaginaInicial />
        </div>
        <ThemeToggle comRotulo="sm" />
      </div>
    </header>
  );
}

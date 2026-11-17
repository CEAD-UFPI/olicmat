"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { href: "/#noticias", label: "Notícias" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#cronograma", label: "Cronograma" },
  { href: "/#suporte", label: "Suporte" },
  { href: "/regulamento", label: "Regulamento, Edital e Documentos" },
  { href: "/ranking", label: "Ranking" },
  { href: "/#parceiros", label: "Realização" },
];

const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)]/50 shadow-lg shadow-[var(--shadow-color)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <div className="flex items-center gap-2 min-w-0">
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <Image
            src="/logo-semfundo-claro.png"
            alt="OLICMAT"
            width={70}
            height={49}
            className="h-[49px] w-auto object-contain so-tema-claro"
            priority
          />
          <Image
            src="/logo-semfundo.png"
            alt="OLICMAT"
            width={70}
            height={49}
            className="h-[49px] w-auto object-contain so-tema-escuro"
            priority
          />
          <span className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-fraunces)] tracking-tight">
            <span style={{ color: "var(--logo-gold)" }}>O</span>
            <span style={{ color: "var(--logo-green)" }}>L</span>
            <span style={{ color: "var(--logo-blue)" }}>I</span>
            <span className="text-[var(--text-primary)]">CMAT</span>
          </span>
        </Link>
        <Link
          href="/"
          aria-label="Página inicial"
          title="Página inicial"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold-ink)]"
        >
          <House size={18} aria-hidden />
        </Link>
        </div>

        <div className="hidden xl:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-3">
          <ThemeToggle comRotulo />
          <Button
            variant="outline"
            size="sm"
            render={<a href={`${adminUrl}/login`} />}
            className="border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--surface)]"
          >
            Entrar
          </Button>
        </div>

        <div className="xl:hidden flex items-center gap-2">
        <ThemeToggle />
        <button
          className="flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <span className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="xl:hidden bg-[var(--bg-primary)]/95 backdrop-blur-xl border-t border-[var(--border-color)] px-4 py-6 flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-sm py-1"
            onClick={() => setMobileOpen(false)}
          >
            <House size={16} aria-hidden /> Página inicial
          </Link>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-sm py-1"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
            <span className="text-sm text-[var(--text-secondary)]">Aparência</span>
            <ThemeToggle comRotulo />
          </div>
          <div className="flex gap-3 pt-2 border-t border-[var(--border-color)]">
            <Button
              variant="outline"
              size="sm"
              render={<a href={`${adminUrl}/login`} />}
              className="border-[var(--border-color)] text-[var(--text-primary)] w-full"
            >
              Entrar
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

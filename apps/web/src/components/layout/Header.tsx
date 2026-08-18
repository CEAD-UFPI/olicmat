"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#cronograma", label: "Cronograma" },
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
          ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#2a2a3a]/50 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo-semfundo.png"
            alt="OLICMAT"
            width={70}
            height={49}
            className="h-[49px] w-auto object-contain"
            priority
          />
          <span className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-fraunces)] tracking-tight">
            <span style={{ color: "var(--color-gold)" }}>O</span>
            <span style={{ color: "var(--color-green)" }}>L</span>
            <span style={{ color: "var(--color-blue)" }}>I</span>
            <span className="text-[#f0ece4]">CMAT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[#9895a4] hover:text-[#f0ece4] transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            render={<a href={`${adminUrl}/login`} />}
            className="border-[#2a2a3a] text-[#f0ece4] hover:bg-[#1a1a26]"
          >
            Entrar
          </Button>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-[#f0ece4] transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#f0ece4] transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#f0ece4] transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-[#2a2a3a] px-4 py-6 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[#9895a4] hover:text-[#f0ece4] transition-colors text-sm py-1"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-[#2a2a3a]">
            <Button
              variant="outline"
              size="sm"
              render={<a href={`${adminUrl}/login`} />}
              className="border-[#2a2a3a] text-[#f0ece4] w-full"
            >
              Entrar
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

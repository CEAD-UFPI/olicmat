"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

const cronogramaDestaques = [
  { data: "30/08/2026", evento: "Início das Inscrições" },
  { data: "21/10/2026", evento: "Fase I — Primeiro Teste" },
  { data: "11/11 a 13/11/2026", evento: "Fase II — Teste II e Vídeos" },
  { data: "25/11/2026", evento: "Resultado e Medalhistas" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const particles = useMemo(() => {
    const positions = [
      { left: 28, top: 35 }, { left: 52, top: 22 }, { left: 75, top: 48 },
      { left: 31, top: 67 }, { left: 68, top: 31 }, { left: 44, top: 79 },
      { left: 82, top: 55 }, { left: 23, top: 52 }, { left: 59, top: 68 },
      { left: 71, top: 42 }, { left: 38, top: 25 }, { left: 85, top: 73 },
      { left: 26, top: 58 }, { left: 63, top: 84 }, { left: 47, top: 39 },
      { left: 79, top: 29 }, { left: 33, top: 71 }, { left: 56, top: 46 },
      { left: 72, top: 62 }, { left: 41, top: 55 },
    ];
    return positions.map((p, i) => ({
      left: p.left, top: p.top,
      color: i % 3 === 0 ? "var(--color-gold)" : i % 3 === 1 ? "var(--color-green)" : "var(--color-blue)",
      delay: (i * 0.2) % 4,
      duration: 4 + (i * 0.3) % 4,
    }));
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Geometric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] gradient-orb-sigma rounded-full" />
        <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] gradient-orb-gold rounded-full" />
        <motion.div className="absolute top-1/4 right-1/4 w-64 h-64 lg:w-96 lg:h-96 border border-[#E8B829]/10 rounded-full animate-float-geometry" style={{ y }} />
        <motion.div className="absolute top-1/3 right-1/3 w-48 h-48 lg:w-72 lg:h-72 border border-[#3AAFE0]/10 rounded-full animate-float-geometry" style={{ y: y2 }} />
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ backgroundColor: p.color, left: `${p.left}%`, top: `${p.top}%` }}
              animate={{ y: [0, -20 + Math.random() * 40, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-24 text-center" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/logo-semfundo.png"
            alt="OLICMAT"
            width={524}
            height={372}
            className="h-[372px] w-auto object-contain mx-auto mb-8"
            priority
          />
        </motion.div>

        <motion.p
          className="text-lg lg:text-xl text-[#9895a4] max-w-2xl mx-auto leading-relaxed mb-10 font-[family-name:var(--font-outfit)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Olimpíada para Licenciandos em Matemática — duas fases, um propósito: Valorizar o Conhecimento e a Prática Docente.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            size="lg"
            render={<Link href="/registro" />}
            className="h-14 px-8 text-base font-semibold"
            style={{ backgroundColor: "var(--color-gold)", color: "#fff" }}
          >
            Faça seu cadastro
          </Button>
          <Button
            variant="outline"
            size="lg"
            render={<Link href="/cronograma" />}
            className="h-14 px-8 text-base font-semibold border-[#2a2a3a] text-[#f0ece4] hover:bg-[#1a1a26] border-glow"
          >
            Ver cronograma completo
          </Button>
        </motion.div>

        {/* Cronogram highlights bar */}
        <motion.div
          className="border-t border-[#2a2a3a]/60 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs text-[#9895a4] uppercase tracking-widest mb-4 font-semibold">
            Datas oficiais — 1ª OLICMAT
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cronogramaDestaques.map((item) => (
              <div
                key={item.data}
                className="rounded-xl border border-[#2a2a3a] bg-[#12121a]/60 p-3 hover:border-[#E8B829]/30 hover:bg-[#E8B829]/5 transition-all duration-300"
              >
                <span className="text-xs font-bold text-[#E8B829] block mb-1">{item.data}</span>
                <span className="text-xs text-[#f0ece4] leading-tight block">{item.evento}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </section>
  );
}

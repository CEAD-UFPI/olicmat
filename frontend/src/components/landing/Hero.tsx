"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

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
      { left: 28, top: 35 },
      { left: 52, top: 22 },
      { left: 75, top: 48 },
      { left: 31, top: 67 },
      { left: 68, top: 31 },
      { left: 44, top: 79 },
      { left: 82, top: 55 },
      { left: 23, top: 52 },
      { left: 59, top: 68 },
      { left: 71, top: 42 },
      { left: 38, top: 25 },
      { left: 85, top: 73 },
      { left: 26, top: 58 },
      { left: 63, top: 84 },
      { left: 47, top: 39 },
      { left: 79, top: 29 },
      { left: 33, top: 71 },
      { left: 56, top: 46 },
      { left: 72, top: 62 },
      { left: 41, top: 55 },
    ];
    return positions.map((p, i) => ({
      left: p.left,
      top: p.top,
      color:
        i % 3 === 0
          ? "var(--pi-laranja)"
          : i % 3 === 1
            ? "var(--integral-verde)"
            : "var(--sigma-azul)",
      delay: (i * 0.2) % 4,
      duration: 4 + (i * 0.3) % 4,
    }));
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Geometric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] gradient-orb-pi rounded-full" />
        <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] gradient-orb-sigma rounded-full" />

        {/* Animated geometric shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 lg:w-96 lg:h-96 border border-[#f48120]/10 rounded-full animate-float-geometry"
          style={{ y }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-48 h-48 lg:w-72 lg:h-72 border border-[#4b7bec]/10 rounded-full animate-float-geometry"
          style={{ y: y2 }}
        />

        {/* Voronoi-style particles */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: p.color,
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
              animate={{
                y: [0, -20 + Math.random() * 40, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32"
        style={{ opacity }}
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm lg:text-base text-[#9895a4] mb-6 font-[family-name:var(--font-outfit)] tracking-widest uppercase">
              Olimpíada para Licenciandos em Matemática
            </p>
          </motion.div>

          <motion.h1
            className="text-6xl sm:text-7xl lg:text-8xl font-bold font-[family-name:var(--font-fraunces)] leading-none tracking-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span style={{ color: "var(--pi-laranja)" }}>O</span>
            <span style={{ color: "var(--integral-verde)" }}>L</span>
            <span style={{ color: "var(--sigma-azul)" }}>I</span>
            <span className="text-[#f0ece4]">CMAT</span>
          </motion.h1>

          <motion.p
            className="text-lg lg:text-xl text-[#9895a4] max-w-xl leading-relaxed mb-10 font-[family-name:var(--font-outfit)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            A Olimpíada de Licenciandos em Matemática do Brasil
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button
              size="lg"
              render={<Link href="/registro" />}
              className="h-14 px-8 text-base font-semibold"
              style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
            >
              Faça seu cadastro
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="#" />}
              className="h-14 px-8 text-base font-semibold border-[#2a2a3a] text-[#f0ece4] hover:bg-[#1a1a26] border-glow"
            >
              Guia do Participante
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </section>
  );
}

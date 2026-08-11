"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 dot-pattern">
      <div className="absolute inset-0 gradient-orb-integral opacity-20" />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold font-[family-name:var(--font-fraunces)]">
              <span style={{ color: "var(--pi-laranja)" }}>O</span>
              <span style={{ color: "var(--integral-verde)" }}>L</span>
              <span style={{ color: "var(--sigma-azul)" }}>I</span>
              <span style={{ color: "var(--text-primary)" }}>CMAT</span>
            </span>
          </Link>
        </div>

        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a]/90 backdrop-blur-sm text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <svg
              className="w-8 h-8 text-[#E8B829]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
            Cadastro Restrito
          </h1>
          
          <p className="text-sm text-[#9895a4] leading-relaxed mb-6">
            O auto-cadastro está desativado na plataforma OLICMAT. 
            Os novos competidores e coordenadores devem ser cadastrados diretamente pelos 
            <strong> Coordenadores de Curso</strong> ou <strong>Administradores</strong> do sistema.
          </p>

          <div className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl p-4 mb-8 text-left text-xs text-[#9895a4] space-y-2">
            <p>💡 <strong>Alunos:</strong> Entre em contato com o coordenador do seu curso de Licenciatura em Matemática para solicitar a sua inscrição.</p>
            <p>💡 <strong>Avaliadores/Coordenadores:</strong> Se você é docente ou membro da organização, contate a Comissão Organizadora.</p>
          </div>

          <Button
            size="lg"
            render={<Link href="/login" />}
            className="w-full h-12 text-base font-semibold"
            style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
          >
            Ir para o Login
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

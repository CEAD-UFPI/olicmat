"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Email inválido"),
});

type Form = z.infer<typeof schema>;

export default function RecuperarSenhaPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/esqueci-senha", { email: data.email });
      setSuccess(true);
    } catch {
      setError("Erro ao solicitar recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 dot-pattern">
      <div className="absolute inset-0 gradient-orb-sigma opacity-20" />

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

        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a]/90 backdrop-blur-sm">
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">📧</div>
              <h1 className="text-2xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
                Email enviado
              </h1>
              <p className="text-sm text-[#9895a4] mb-6">
                Se o email existir, você receberá um link para redefinir sua senha. O link expira em 2 horas.
              </p>
              <Link href="/login">
                <Button className="w-full h-12 text-base font-semibold" style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}>
                  Voltar ao login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
                Recuperar senha
              </h1>
              <p className="text-sm text-[#9895a4] mb-8">
                Informe seu email para receber o link de redefinição
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm text-[#9895a4] mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                    className="w-full h-12 px-4 rounded-xl border bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50 outline-none transition-colors focus:border-[#3AAFE0]"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold"
                  style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
                >
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </form>
            </>
          )}

          <p className="text-sm text-[#9895a4] text-center mt-6">
            Lembrou a senha?{" "}
            <Link href="/login" className="text-[#3AAFE0] hover:underline">
              Voltar ao login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

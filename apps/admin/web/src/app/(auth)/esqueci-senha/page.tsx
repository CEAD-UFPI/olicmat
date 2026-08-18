"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Email invalido"),
});

type FormData = z.infer<typeof schema>;

export default function EsqueciSenhaPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/esqueci-senha", data);
      setEnviado(true);
    } catch {
      setError("Erro ao enviar email de recuperacao. Verifique o endereco informado.");
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
          {enviado ? (
            <motion.div
              className="text-center py-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div
                className="text-4xl mb-4 font-[family-name:var(--font-fraunces)]"
                style={{ color: "var(--integral-verde)" }}
              >
                OK
              </div>
              <h1 className="text-xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
                Email enviado
              </h1>
              <p className="text-sm text-[#9895a4] mb-6">
                Se o email informado estiver cadastrado, voce recebera um link para redefinir sua senha.
              </p>
              <Link
                href="/login"
                className="text-sm text-[#3AAFE0] hover:underline"
              >
                Voltar para o login
              </Link>
            </motion.div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
                Esqueci minha senha
              </h1>
              <p className="text-sm text-[#9895a4] mb-8">
                Informe seu email para receber um link de redefinicao de senha
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-[#f0ece4]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                    className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
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
                  {loading ? "Enviando..." : "Enviar link de recuperacao"}
                </Button>
              </form>

              <p className="text-sm text-[#9895a4] text-center mt-6">
                Lembrou sua senha?{" "}
                <Link href="/login" className="text-[#3AAFE0] hover:underline">
                  Entrar
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

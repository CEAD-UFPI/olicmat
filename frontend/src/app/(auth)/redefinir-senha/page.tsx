"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    senha: z.string().min(6, "Senha deve ter no minimo 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "Senhas nao conferem",
    path: ["confirmarSenha"],
  });

type FormData = z.infer<typeof schema>;

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError("Token de redefinicao ausente. Solicite um novo link.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/redefinir-senha", {
        token,
        novaSenha: data.senha,
      });
      setSucesso(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Token invalido ou expirado. Solicite um novo link de recuperacao.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-4">
        <h1 className="text-xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
          Link invalido
        </h1>
        <p className="text-sm text-[#9895a4] mb-6">
          O link de redefinicao de senha e invalido ou expirou.
        </p>
        <Link href="/esqueci-senha" className="text-sm text-[#4b7bec] hover:underline">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  if (sucesso) {
    return (
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
          Senha redefinida
        </h1>
        <p className="text-sm text-[#9895a4]">
          Redirecionando para o login...
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
        Redefinir senha
      </h1>
      <p className="text-sm text-[#9895a4] mb-8">
        Crie uma nova senha para sua conta
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="senha" className="text-[#f0ece4]">Nova senha</Label>
          <Input
            id="senha"
            type="password"
            placeholder="Minimo 6 caracteres"
            {...register("senha")}
            className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
          />
          {errors.senha && (
            <p className="text-xs text-red-400 mt-1">{errors.senha.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmarSenha" className="text-[#f0ece4]">Confirmar senha</Label>
          <Input
            id="confirmarSenha"
            type="password"
            placeholder="Repita a senha"
            {...register("confirmarSenha")}
            className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
          />
          {errors.confirmarSenha && (
            <p className="text-xs text-red-400 mt-1">{errors.confirmarSenha.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-semibold"
          style={{ backgroundColor: "var(--integral-verde)", color: "#fff" }}
        >
          {loading ? "Salvando..." : "Redefinir senha"}
        </Button>
      </form>
    </>
  );
}

export default function RedefinirSenhaPage() {
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

        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a]/90 backdrop-blur-sm">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-[#f48120] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <RedefinirSenhaForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}

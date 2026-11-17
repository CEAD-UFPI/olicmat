"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/ui/password-field";

const roleHome: Record<Role, string> = {
  ALUNO: "/competidor",
  COORDENADOR_CURSO: "/coordenador",
  AVALIADOR: "/avaliador",
  ADMIN: "/admin",
  COMISSAO: "/comissao",
};

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const watchSenha = watch("senha");

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    try {
      const user = await login(data.email, data.senha);
      const home = roleHome[user.role as Role] || "/competidor";
      router.push(home);
    } catch (e: unknown) {
      // Só o 401 significa credencial errada. Mostrar essa mensagem para
      // qualquer falha — banco fora, rede caída — manda todo mundo procurar
      // no lugar errado: numa indisponibilidade do banco, os usuários
      // acharam que tinham perdido a conta e ficaram tentando outras senhas.
      const resposta = (e as { response?: { status?: number; data?: { message?: string } } })
        ?.response;
      const status = resposta?.status;

      if (status === 409) {
        setError(resposta?.data?.message ?? "Esta conta já está em uso em outro aparelho.");
      } else if (status === 401) {
        setError("Email ou senha inválidos.");
      } else if (status === 429) {
        setError("Muitas tentativas seguidas. Aguarde um instante.");
      } else {
        setError(
          "Não foi possível entrar agora — o sistema está indisponível. " +
            "Suas credenciais continuam válidas; tente de novo em alguns minutos.",
        );
      }
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
              <span style={{ color: "var(--logo-gold)" }}>O</span>
              <span style={{ color: "var(--logo-green)" }}>L</span>
              <span style={{ color: "var(--logo-blue)" }}>I</span>
              <span style={{ color: "var(--text-primary)" }}>CMAT</span>
            </span>
          </Link>
        </div>

        <div className="border border-[var(--border-color)] rounded-2xl p-8 bg-[var(--bg-secondary)]/90 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1 font-[family-name:var(--font-fraunces)]">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mb-8">
            Entre com sua conta para acessar a plataforma
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-[var(--text-primary)]">Email</Label>
              <Input
                id="email"
                type="email"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="seu@email.com"
                {...register("email")}
                className="mt-1.5 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="senha" className="text-[var(--text-primary)]">Senha</Label>
              <PasswordField
                id="senha"
                name="senha"
                value={watchSenha}
                onChange={(v) => setValue("senha", v)}
                placeholder="••••••••"
                error={errors.senha?.message}
                required
              />
            </div>

            <div className="text-right">
              <Link href="/recuperar-senha" className="text-xs text-[var(--color-blue-ink)] hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
              style={{ backgroundColor: "var(--pi-laranja)", color: "var(--on-accent)" }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-xs text-[var(--text-tertiary)] text-center mt-6 leading-relaxed">
            O cadastro de novos usuários é gerenciado pelos Coordenadores de Curso ou Administradores do sistema.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

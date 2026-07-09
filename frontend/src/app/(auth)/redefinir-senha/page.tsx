"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";

const schema = z.object({
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmarSenha: z.string(),
}).refine((d) => d.senha === d.confirmarSenha, {
  message: "Senhas não conferem",
  path: ["confirmarSenha"],
});

type Form = z.infer<typeof schema>;

function RedefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token inválido ou ausente.");
    }
  }, [token]);

  const onSubmit = async () => {
    if (!token) return;

    const parsed = schema.safeParse({ senha, confirmarSenha });
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.senha?.[0] || parsed.error.flatten().fieldErrors.confirmarSenha?.[0] || "Dados inválidos");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/auth/redefinir-senha", { token, novaSenha: senha });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao redefinir senha. O token pode ter expirado.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
          Senha redefinida
        </h1>
        <p className="text-sm text-[#9895a4] mb-6">
          Sua senha foi atualizada com sucesso.
        </p>
        <Link href="/login">
          <Button className="w-full h-12 text-base font-semibold" style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}>
            Fazer login
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
        Nova senha
      </h1>
      <p className="text-sm text-[#9895a4] mb-8">
        Crie uma nova senha para sua conta
      </p>

      <div className="space-y-5">
        <PasswordField
          label="Nova senha *"
          id="senha"
          name="senha"
          value={senha}
          onChange={setSenha}
          placeholder="Mínimo 6 caracteres"
          required
        />
        <PasswordField
          label="Confirmar nova senha *"
          id="confirmarSenha"
          name="confirmarSenha"
          value={confirmarSenha}
          onChange={setConfirmarSenha}
          placeholder="Repita a senha"
          required
        />

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{error}</p>
        )}

        <Button
          onClick={onSubmit}
          disabled={loading || !token}
          className="w-full h-12 text-base font-semibold"
          style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        >
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </Button>
      </div>
    </>
  );
}

export default function RedefinirSenhaPage() {
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
          <Suspense fallback={<p className="text-[#9895a4] text-center">Carregando...</p>}>
            <RedefinirSenhaContent />
          </Suspense>
        </div>

        <p className="text-sm text-[#9895a4] text-center mt-6">
          Lembrou a senha?{" "}
          <Link href="/login" className="text-[#3AAFE0] hover:underline">
            Voltar ao login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";

const ROTULO_PAPEL: Record<string, string> = {
  COMISSAO: "Comissão Organizadora",
  COORDENADOR_CURSO: "Coordenação de Curso",
  AVALIADOR: "Avaliação",
  ADMIN: "Administração",
};

const schema = z
  .object({
    cpf: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 11, "CPF deve ter 11 dígitos"),
    dataNascimento: z.string().min(1, "Informe a data de nascimento"),
    telefone: z.string().optional(),
    nomeMae: z.string().optional(),
    senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "Senhas não conferem",
    path: ["confirmarSenha"],
  });

interface Convite {
  nome: string;
  email: string;
  role: string;
}

function ConviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [convite, setConvite] = useState<Convite | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!token) {
      setErro("Link inválido: o convite não veio com um código.");
      setCarregando(false);
      return;
    }

    api
      .get(`/convites/${token}`)
      .then((r) => setConvite(r.data))
      .catch((e) =>
        setErro(
          e.response?.data?.message ??
            "Não foi possível validar este convite. Ele pode ter expirado ou já ter sido usado.",
        ),
      )
      .finally(() => setCarregando(false));
  }, [token]);

  const enviar = async () => {
    const parsed = schema.safeParse({
      cpf,
      dataNascimento,
      telefone,
      nomeMae,
      senha,
      confirmarSenha,
    });

    if (!parsed.success) {
      const campos = parsed.error.flatten().fieldErrors;
      setErro(
        campos.cpf?.[0] ??
          campos.dataNascimento?.[0] ??
          campos.senha?.[0] ??
          campos.confirmarSenha?.[0] ??
          "Verifique os dados informados.",
      );
      return;
    }

    setEnviando(true);
    setErro("");
    try {
      await api.post(`/convites/${token}/aceitar`, {
        cpf: parsed.data.cpf,
        senha: parsed.data.senha,
        dataNascimento: parsed.data.dataNascimento,
        telefone: parsed.data.telefone || undefined,
        nomeMae: parsed.data.nomeMae || undefined,
      });
      setPronto(true);
    } catch (e: any) {
      setErro(
        e.response?.data?.message ??
          "Não foi possível concluir o cadastro. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return <p className="text-[#9895a4] text-center">Validando convite...</p>;
  }

  if (pronto) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
          Cadastro concluído
        </h1>
        <p className="text-sm text-[#9895a4] mb-6">
          Sua conta foi criada. Use seu e-mail e a senha que você acabou de
          definir para entrar.
        </p>
        <Link href="/login">
          <Button
            className="w-full h-12 text-base font-semibold"
            style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
          >
            Fazer login
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (!convite) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
          Convite indisponível
        </h1>
        <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3 mb-6">
          {erro}
        </p>
        <p className="text-sm text-[#9895a4]">
          Peça um novo convite à organização da OLICMAT.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
        Concluir cadastro
      </h1>
      <p className="text-sm text-[#9895a4] mb-6">
        Olá, <span className="text-[#f0ece4]">{convite.nome}</span>. Faltam
        alguns dados para liberar seu acesso.
      </p>

      <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-4 mb-6 space-y-1">
        <p className="text-xs uppercase tracking-[0.08em] text-[#6f6c7a]">
          Convite para
        </p>
        <p className="text-sm text-[#f0ece4]">
          {ROTULO_PAPEL[convite.role] ?? convite.role}
        </p>
        <p className="text-sm text-[#9895a4]">{convite.email}</p>
      </div>

      <div className="space-y-5">
        <Campo
          label="CPF *"
          id="cpf"
          value={cpf}
          onChange={setCpf}
          placeholder="Somente números"
          inputMode="numeric"
        />
        <Campo
          label="Data de nascimento *"
          id="dataNascimento"
          value={dataNascimento}
          onChange={setDataNascimento}
          type="date"
        />
        <Campo
          label="Telefone"
          id="telefone"
          value={telefone}
          onChange={setTelefone}
          placeholder="DDD + número"
          inputMode="tel"
        />
        <Campo
          label="Nome da mãe"
          id="nomeMae"
          value={nomeMae}
          onChange={setNomeMae}
          placeholder="Opcional"
        />

        <PasswordField
          label="Senha *"
          id="senha"
          name="senha"
          value={senha}
          onChange={setSenha}
          placeholder="Mínimo 8 caracteres"
          required
        />
        <PasswordField
          label="Confirmar senha *"
          id="confirmarSenha"
          name="confirmarSenha"
          value={confirmarSenha}
          onChange={setConfirmarSenha}
          placeholder="Repita a senha"
          required
        />

        {erro && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
            {erro}
          </p>
        )}

        <Button
          onClick={enviar}
          disabled={enviando}
          className="w-full h-12 text-base font-semibold"
          style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        >
          {enviando ? "Concluindo..." : "Concluir cadastro"}
        </Button>
      </div>
    </>
  );
}

function Campo({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "tel";
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-[#9895a4]">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-lg bg-[#0f0f16] border border-[#2a2a3a] px-4 text-[#f0ece4] placeholder:text-[#57545f] focus:outline-none focus:border-[#3AAFE0]"
      />
    </div>
  );
}

export default function ConvitePage() {
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
          <Suspense
            fallback={
              <p className="text-[#9895a4] text-center">Carregando...</p>
            }
          >
            <ConviteContent />
          </Suspense>
        </div>

        <p className="text-sm text-[#9895a4] text-center mt-6">
          Já tem acesso?{" "}
          <Link href="/login" className="text-[#3AAFE0] hover:underline">
            Fazer login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

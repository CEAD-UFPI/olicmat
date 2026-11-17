"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  ALUNO: "Participante",
};

const schema = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
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

interface LinkInfo {
  role: string;
  curso: {
    id: string;
    nome: string;
    instituicao: { nome: string; sigla: string };
  } | null;
  instituicao: { id: string; nome: string; sigla: string } | null;
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
  inputMode?: "numeric" | "tel" | "email";
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-[var(--text-tertiary)]">
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
        className="w-full h-12 rounded-lg bg-[var(--surface-2)] border border-[var(--border-color)] px-4 text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--color-blue)]"
      />
    </div>
  );
}

function CadastroContent({ token }: { token: string }) {
  const [link, setLink] = useState<LinkInfo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    api
      .get(`/link-convite/${token}`)
      .then((r) => setLink(r.data))
      .catch((e) =>
        setErro(
          e.response?.data?.message ??
            "Não foi possível validar este link de convite.",
        ),
      )
      .finally(() => setCarregando(false));
  }, [token]);

  const enviar = async () => {
    const parsed = schema.safeParse({
      nome,
      email,
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
        campos.nome?.[0] ??
          campos.email?.[0] ??
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
      await api.post(`/link-convite/${token}/cadastrar`, {
        nome: parsed.data.nome,
        email: parsed.data.email,
        cpf: parsed.data.cpf,
        senha: parsed.data.senha,
        dataNascimento: parsed.data.dataNascimento,
        telefone: parsed.data.telefone || undefined,
        nomeMae: parsed.data.nomeMae || undefined,
        matricula: matricula || undefined,
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
    return <p className="text-[var(--text-tertiary)] text-center">Validando link...</p>;
  }

  if (pronto) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2 font-[family-name:var(--font-fraunces)]">
          Cadastro concluído
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mb-6">
          Sua conta foi criada. Use seu e-mail e a senha que você acabou de
          definir para entrar.
        </p>
        <Link href="/login">
          <Button
            className="w-full h-12 text-base font-semibold"
            style={{ backgroundColor: "var(--pi-laranja)", color: "var(--on-accent)" }}
          >
            Fazer login
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (!link) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2 font-[family-name:var(--font-fraunces)]">
          Link indisponível
        </h1>
        <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3 mb-6">
          {erro}
        </p>
        <p className="text-sm text-[var(--text-tertiary)]">
          Peça um link atualizado à coordenação ou à organização da OLICMAT.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1 font-[family-name:var(--font-fraunces)]">
        Concluir cadastro
      </h1>
      <p className="text-sm text-[var(--text-tertiary)] mb-6">
        Cadastro como{" "}
        <span className="text-[var(--text-primary)]">
          {ROTULO_PAPEL[link.role] ?? link.role}
        </span>
        .
      </p>

      {(link.curso || link.instituicao) && (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-4 mb-6 space-y-1">
          <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {link.curso ? "Curso" : "Instituição"}
          </p>
          {link.curso ? (
            <>
              <p className="text-sm text-[var(--text-primary)]">{link.curso.nome}</p>
              <p className="text-sm text-[var(--text-tertiary)]">
                {link.curso.instituicao.sigla} — {link.curso.instituicao.nome}
              </p>
            </>
          ) : (
            link.instituicao && (
              <p className="text-sm text-[var(--text-primary)]">
                {link.instituicao.sigla} — {link.instituicao.nome}
              </p>
            )
          )}
        </div>
      )}

      <div className="space-y-5">
        <Campo
          label="Nome completo *"
          id="nome"
          value={nome}
          onChange={setNome}
          placeholder="Seu nome completo"
        />
        <Campo
          label="E-mail *"
          id="email"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          type="email"
          inputMode="email"
        />
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
          label="Matrícula"
          id="matricula"
          value={matricula}
          onChange={setMatricula}
          placeholder="Opcional"
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
          style={{ backgroundColor: "var(--pi-laranja)", color: "var(--on-accent)" }}
        >
          {enviando ? "Concluindo..." : "Concluir cadastro"}
        </Button>
      </div>
    </>
  );
}

export default function CadastroPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

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
          <CadastroContent token={token} />
        </div>

        <p className="text-sm text-[var(--text-tertiary)] text-center mt-6">
          Já tem acesso?{" "}
          <Link href="/login" className="text-[var(--color-blue-ink)] hover:underline">
            Fazer login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

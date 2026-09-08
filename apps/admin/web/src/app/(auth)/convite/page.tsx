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
  /** Presente quando quem convidou já definiu o curso (aluno da coordenação). */
  curso: {
    id: string;
    nome: string;
    instituicao: { nome: string; sigla: string };
  } | null;
  /**
   * Presente quando a organização definiu a instituição mas não o curso —
   * caso da coordenação convidada pelo painel administrativo. A pessoa
   * escolhe apenas o curso, entre os dessa instituição.
   */
  instituicao: { id: string; nome: string; sigla: string } | null;
}

interface Curso {
  id: string;
  nome: string;
}

interface Instituicao {
  id: string;
  nome: string;
  sigla: string;
  cursos: Curso[];
}

function ConviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [convite, setConvite] = useState<Convite | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [instituicaoId, setInstituicaoId] = useState("");
  const [cursoId, setCursoId] = useState("");
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

  // Quando o convite já traz o curso, não há o que escolher: a coordenação
  // definiu, e oferecer um seletor aqui só criaria chance de erro.
  const cursoPredefinido = convite?.curso ?? null;
  // Um degrau acima: a organização fixou só a instituição, e a pessoa escolhe
  // o curso que coordena dentro dela.
  const instituicaoPredefinida = convite?.instituicao ?? null;
  const exigeCurso = convite?.role === "COORDENADOR_CURSO" && !cursoPredefinido;
  const instituicaoEfetiva = instituicaoPredefinida?.id ?? instituicaoId;
  const cursosDaInstituicao =
    instituicoes.find((i) => i.id === instituicaoEfetiva)?.cursos ?? [];

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

    // Limite alto porque a lista alimenta um seletor: paginar aqui só
    // esconderia instituições de quem precisa se encontrar nela.
    api
      .get("/instituicoes?limit=200")
      .then((r) => setInstituicoes(r.data?.data ?? []))
      .catch(() => setInstituicoes([]));
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

    if (exigeCurso && !cursoId) {
      setErro(
        instituicaoPredefinida
          ? "Selecione o curso que você coordena."
          : "Selecione a instituição e o curso que você coordena.",
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
        matricula: matricula || undefined,
        instituicaoId: instituicaoId || undefined,
        cursoId: cursoId || undefined,
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
        {cursoPredefinido ? (
          <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-4 space-y-1">
            <p className="text-xs uppercase tracking-[0.08em] text-[#6f6c7a]">
              Curso
            </p>
            <p className="text-sm text-[#f0ece4]">{cursoPredefinido.nome}</p>
            <p className="text-sm text-[#9895a4]">
              {cursoPredefinido.instituicao.sigla} —{" "}
              {cursoPredefinido.instituicao.nome}
            </p>
          </div>
        ) : instituicaoPredefinida ? (
          <>
            <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-4 space-y-1">
              <p className="text-xs uppercase tracking-[0.08em] text-[#6f6c7a]">
                Instituição
              </p>
              <p className="text-sm text-[#f0ece4]">
                {instituicaoPredefinida.sigla} — {instituicaoPredefinida.nome}
              </p>
            </div>
            <Selecao
              label={exigeCurso ? "Curso *" : "Curso"}
              id="curso"
              value={cursoId}
              onChange={setCursoId}
              vazio={
                cursosDaInstituicao.length
                  ? "Selecione o curso"
                  : "Nenhum curso cadastrado nesta instituição"
              }
              desabilitado={!cursosDaInstituicao.length}
              opcoes={cursosDaInstituicao.map((c) => ({
                valor: c.id,
                rotulo: c.nome,
              }))}
            />
            <p className="text-xs text-[#6f6c7a] -mt-2">
              A instituição foi definida pela organização da OLICMAT.
              {exigeCurso
                ? " Escolha o curso que você coordena — é por ele que seu painel mostrará os alunos."
                : ""}
            </p>
          </>
        ) : (
          <>
        <Selecao
          label={exigeCurso ? "Instituição *" : "Instituição"}
          id="instituicao"
          value={instituicaoId}
          onChange={(v) => {
            setInstituicaoId(v);
            // Trocar de instituição invalida o curso escolhido antes.
            setCursoId("");
          }}
          vazio="Selecione a instituição"
          opcoes={instituicoes.map((i) => ({
            valor: i.id,
            rotulo: i.sigla ? `${i.sigla} — ${i.nome}` : i.nome,
          }))}
        />
        <Selecao
          label={exigeCurso ? "Curso *" : "Curso"}
          id="curso"
          value={cursoId}
          onChange={setCursoId}
          vazio={
            instituicaoId
              ? "Selecione o curso"
              : "Escolha a instituição primeiro"
          }
          desabilitado={!instituicaoId}
          opcoes={cursosDaInstituicao.map((c) => ({
            valor: c.id,
            rotulo: c.nome,
          }))}
        />
        {exigeCurso && (
          <p className="text-xs text-[#6f6c7a] -mt-2">
            Como coordenação de curso, seu painel mostra os alunos do curso
            selecionado aqui.
          </p>
        )}
          </>
        )}

        <Campo
          label="Matrícula"
          id="matricula"
          value={matricula}
          onChange={setMatricula}
          placeholder={cursoPredefinido ? "Sua matrícula no curso" : "Opcional"}
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

function Selecao({
  label,
  id,
  value,
  onChange,
  opcoes,
  vazio,
  desabilitado,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  opcoes: { valor: string; rotulo: string }[];
  vazio: string;
  desabilitado?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-[#9895a4]">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        disabled={desabilitado}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-lg bg-[#0f0f16] border border-[#2a2a3a] px-4 text-[#f0ece4] focus:outline-none focus:border-[#3AAFE0] disabled:opacity-50"
      >
        <option value="">{vazio}</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </div>
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

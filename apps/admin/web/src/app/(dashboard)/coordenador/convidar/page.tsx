"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface Curso {
  id: string;
  nome: string;
  instituicao?: { nome: string; sigla: string };
}

interface Convite {
  id: string;
  nome: string;
  email: string;
  expiraEm: string;
  usadoEm: string | null;
  curso: { id: string; nome: string } | null;
}

interface Resultado {
  enviados: { email: string }[];
  falhaEnvio: { email: string; motivo: string }[];
  ignorados: { email: string; motivo: string }[];
}

interface Linha {
  nome: string;
  email: string;
  erro?: string;
}

/** Aceita "Nome; email", "Nome, email" ou "Nome <email>", um por linha. */
function interpretar(texto: string): Linha[] {
  return texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linha) => {
      const comAngulo = linha.match(/^(.*?)\s*<\s*([^>]+)\s*>$/);
      const partes = comAngulo
        ? [comAngulo[1], comAngulo[2]]
        : linha.split(/[;,\t]/);

      const nome = (partes[0] ?? "").trim();
      const email = (partes[1] ?? "").trim().toLowerCase();

      if (!nome || !email) {
        return { nome, email, erro: "informe nome e e-mail" };
      }
      if (nome.length < 3) return { nome, email, erro: "nome muito curto" };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { nome, email, erro: "e-mail inválido" };
      }
      return { nome, email };
    });
}

export default function ConvidarAlunosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoId, setCursoId] = useState("");
  const [texto, setTexto] = useState("");
  const [convites, setConvites] = useState<Convite[]>([]);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const linhas = interpretar(texto);
  const invalidas = linhas.filter((l) => l.erro);
  const validas = linhas.filter((l) => !l.erro);

  const carregarConvites = () =>
    api
      .get("/coordenacao/convites")
      .then((r) => setConvites(r.data ?? []))
      .catch(() => setConvites([]));

  useEffect(() => {
    api
      .get("/coordenacao/cursos")
      .then((r) => {
        const lista: Curso[] = r.data ?? [];
        setCursos(lista);
        if (lista.length === 1) setCursoId(lista[0].id);
      })
      .catch(() => setCursos([]));
    carregarConvites();
  }, []);

  const enviar = async () => {
    setErro("");
    setResultado(null);

    if (!cursoId) return setErro("Selecione o curso.");
    if (!validas.length) return setErro("Nenhum aluno válido na lista.");
    if (invalidas.length) {
      return setErro(
        `Corrija as ${invalidas.length} linha(s) com problema antes de enviar.`,
      );
    }

    setEnviando(true);
    try {
      const r = await api.post("/coordenacao/convites", {
        cursoId,
        alunos: validas.map((l) => ({ nome: l.nome, email: l.email })),
      });
      setResultado(r.data);
      setTexto("");
      await carregarConvites();
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Não foi possível enviar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Convidar alunos
        </h1>
        <p className="text-[#9895a4] mt-2">
          Informe nome e e-mail. Cada aluno recebe um link e preenche o próprio
          cadastro — você não precisa dos dados pessoais deles.
        </p>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a] space-y-5">
        <div className="space-y-2">
          <label htmlFor="curso" className="block text-sm text-[#9895a4]">
            Curso *
          </label>
          <select
            id="curso"
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            className="w-full h-12 rounded-lg bg-[#0f0f16] border border-[#2a2a3a] px-4 text-[#f0ece4] focus:outline-none focus:border-[#3AAFE0]"
          >
            <option value="">Selecione o curso</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.instituicao?.sigla
                  ? `${c.instituicao.sigla} — ${c.nome}`
                  : c.nome}
              </option>
            ))}
          </select>
          {!cursos.length && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
              Nenhum curso vinculado ao seu perfil. Peça à organização para
              vincular seu curso antes de convidar alunos.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lista" className="block text-sm text-[#9895a4]">
            Lista de alunos — um por linha
          </label>
          <textarea
            id="lista"
            rows={10}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={"Maria Silva; maria@aluno.ufpi.edu.br\nJoão Souza; joao@aluno.ufpi.edu.br"}
            className="w-full rounded-lg bg-[#0f0f16] border border-[#2a2a3a] p-4 text-[#f0ece4] placeholder:text-[#57545f] focus:outline-none focus:border-[#3AAFE0] font-[family-name:var(--font-jetbrains-mono)] text-sm"
          />
          <p className="text-xs text-[#6f6c7a]">
            Separe nome e e-mail por ponto e vírgula, vírgula ou tabulação.
            Também aceita o formato <code>Nome &lt;email&gt;</code>, útil para
            colar direto de uma planilha.
          </p>
        </div>

        {linhas.length > 0 && (
          <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-4 space-y-2">
            <p className="text-sm text-[#f0ece4]">
              {validas.length} aluno(s) prontos
              {invalidas.length > 0 && (
                <span className="text-red-400">
                  {" "}
                  · {invalidas.length} com problema
                </span>
              )}
            </p>
            {invalidas.slice(0, 5).map((l, i) => (
              <p key={i} className="text-xs text-red-400">
                {l.nome || "(sem nome)"} {l.email && `<${l.email}>`} —{" "}
                {l.erro}
              </p>
            ))}
          </div>
        )}

        {erro && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
            {erro}
          </p>
        )}

        <Button
          onClick={enviar}
          disabled={enviando || !cursos.length}
          className="h-12 px-6 text-base font-semibold"
          style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        >
          {enviando ? "Enviando..." : `Enviar ${validas.length || ""} convite(s)`}
        </Button>

        {resultado && (
          <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-4 space-y-2 text-sm">
            <p className="text-[#f0ece4]">
              Enviados: {resultado.enviados.length}
            </p>
            {resultado.falhaEnvio.length > 0 && (
              <div>
                <p className="text-amber-400">
                  Convite criado, mas o e-mail não saiu:{" "}
                  {resultado.falhaEnvio.length}
                </p>
                {resultado.falhaEnvio.map((f) => (
                  <p key={f.email} className="text-xs text-[#9895a4]">
                    {f.email} — {f.motivo}
                  </p>
                ))}
              </div>
            )}
            {resultado.ignorados.length > 0 && (
              <div>
                <p className="text-[#9895a4]">
                  Ignorados: {resultado.ignorados.length}
                </p>
                {resultado.ignorados.map((f) => (
                  <p key={f.email} className="text-xs text-[#6f6c7a]">
                    {f.email} — {f.motivo}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <h2 className="text-xl font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Convites enviados
        </h2>

        {!convites.length ? (
          <p className="text-sm text-[#9895a4]">
            Nenhum convite enviado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.08em] text-[#6f6c7a]">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">E-mail</th>
                  <th className="py-2">Situação</th>
                </tr>
              </thead>
              <tbody>
                {convites.map((c) => (
                  <tr key={c.id} className="border-t border-[#2a2a3a]">
                    <td className="py-2 pr-4 text-[#f0ece4]">{c.nome}</td>
                    <td className="py-2 pr-4 text-[#9895a4]">{c.email}</td>
                    <td className="py-2">
                      {c.usadoEm ? (
                        <span className="text-[#4ec98a]">cadastrado</span>
                      ) : new Date(c.expiraEm) < new Date() ? (
                        <span className="text-red-400">expirado</span>
                      ) : (
                        <span className="text-amber-400">aguardando</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

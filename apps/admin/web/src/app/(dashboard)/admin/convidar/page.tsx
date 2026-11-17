"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  interpretarLote,
  ROTULO_PAPEL,
  type InstituicaoBasica,
} from "@/lib/convites-lote";

interface Convite {
  id: string;
  nome: string;
  email: string;
  role: string;
  expiraEm: string;
  usadoEm: string | null;
  instituicao: { sigla: string; nome: string } | null;
  curso: { nome: string } | null;
}

interface Resultado {
  enviados: { email: string }[];
  falhaEnvio: { email: string; motivo: string }[];
  ignorados: { email: string; motivo: string }[];
}

export default function ConvidarEquipePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ConvidarEquipeContent />
    </Suspense>
  );
}

function ConvidarEquipeContent() {
  const searchParams = useSearchParams();
  const [instituicoes, setInstituicoes] = useState<InstituicaoBasica[]>([]);
  const [texto, setTexto] = useState("");
  const [convites, setConvites] = useState<Convite[]>([]);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<"" | "expirado">(
    searchParams.get("status") === "expirado" ? "expirado" : "",
  );

  const linhas = interpretarLote(texto, instituicoes);
  const invalidas = linhas.filter((l) => l.erro);
  const validas = linhas.filter((l) => !l.erro);

  const carregarConvites = (situacao: "" | "expirado") =>
    api
      .get("/admin/convites", {
        params: situacao ? { status: situacao } : undefined,
      })
      .then((r) => setConvites(r.data ?? []))
      .catch(() => setConvites([]));

  useEffect(() => {
    api
      .get("/instituicoes?limit=200")
      .then((r) => setInstituicoes(r.data?.data ?? []))
      .catch(() => setInstituicoes([]));
  }, []);

  useEffect(() => {
    carregarConvites(filtroSituacao);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroSituacao]);

  const enviar = async () => {
    setErro("");
    setResultado(null);

    if (!validas.length) return setErro("Nenhuma linha válida na lista.");
    if (invalidas.length) {
      return setErro(
        `Corrija as ${invalidas.length} linha(s) com problema antes de enviar.`,
      );
    }

    setEnviando(true);
    try {
      const r = await api.post("/admin/convites", {
        convites: validas.map((l) => ({
          nome: l.nome,
          email: l.email,
          role: l.role,
          instituicaoId: l.instituicaoId ?? undefined,
        })),
      });
      setResultado(r.data);
      setTexto("");
      await carregarConvites(filtroSituacao);
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Não foi possível enviar.");
    } finally {
      setEnviando(false);
    }
  };

  const termo = busca.trim().toLowerCase();
  const convitesFiltrados = useMemo(() => {
    if (!termo) return convites;
    return convites.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo),
    );
  }, [convites, termo]);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
          Convidar equipe
        </h1>
        <p className="text-[var(--text-tertiary)] mt-2">
          Comissão, coordenações de curso, avaliadores e administradores. Cada
          pessoa recebe um link e preenche o próprio cadastro — você precisa
          apenas do nome, do e-mail e do papel.
        </p>
      </div>

      <div className="border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 bg-[var(--bg-secondary)] space-y-5">
        <div className="space-y-2">
          <label htmlFor="lista" className="block text-sm text-[var(--text-tertiary)]">
            Lista — uma pessoa por linha
          </label>
          <textarea
            id="lista"
            rows={10}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={
              "Livia Fernanda; livia@ufpi.edu.br; comissao\n" +
              "Ray Silva; ray.silva@ufpi.edu.br; UFPI; coordenador_curso"
            }
            className="w-full rounded-lg bg-[var(--surface-2)] border border-[var(--border-color)] p-4 text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--color-blue)] font-[family-name:var(--font-jetbrains-mono)] text-sm"
          />
          <div className="text-xs text-[var(--text-muted)] space-y-1">
            <p>
              <code className="text-[var(--text-tertiary)]">Nome; e-mail; papel</code> — ou,
              para coordenação,{" "}
              <code className="text-[var(--text-tertiary)]">
                Nome; e-mail; instituição; papel
              </code>
              . Separe por ponto e vírgula, vírgula ou tabulação.
            </p>
            <p>
              Papéis aceitos: <code className="text-[var(--text-tertiary)]">comissao</code>,{" "}
              <code className="text-[var(--text-tertiary)]">coordenador_curso</code>,{" "}
              <code className="text-[var(--text-tertiary)]">avaliador</code>,{" "}
              <code className="text-[var(--text-tertiary)]">admin</code>. A instituição pode
              ser a sigla (UFPI) ou o nome completo.
            </p>
            <p>
              A coordenação escolhe o <strong>curso</strong> dela no momento do
              aceite, entre os cursos da instituição que você indicar aqui.
            </p>
          </div>
        </div>

        {linhas.length > 0 && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-4 space-y-3">
            <p className="text-sm text-[var(--text-primary)]">
              {validas.length} convite(s) prontos
              {invalidas.length > 0 && (
                <span className="text-red-400">
                  {" "}
                  · {invalidas.length} com problema
                </span>
              )}
            </p>

            {validas.length > 0 && (
              <div className="space-y-1">
                {validas.slice(0, 8).map((l, i) => (
                  <p key={i} className="text-xs text-[var(--text-tertiary)]">
                    {l.nome} &lt;{l.email}&gt; —{" "}
                    <span className="text-[var(--color-mint-ink)]">
                      {ROTULO_PAPEL[l.role] ?? l.role}
                    </span>
                    {l.instituicaoRotulo && (
                      <span className="text-[var(--color-blue-ink)]">
                        {" "}
                        · {l.instituicaoRotulo}
                      </span>
                    )}
                  </p>
                ))}
                {validas.length > 8 && (
                  <p className="text-xs text-[var(--text-muted)]">
                    e mais {validas.length - 8}...
                  </p>
                )}
              </div>
            )}

            {invalidas.slice(0, 5).map((l, i) => (
              <p key={i} className="text-xs text-red-400">
                {l.nome || "(sem nome)"} {l.email && `<${l.email}>`} — {l.erro}
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
          disabled={enviando}
          className="h-12 px-6 text-base font-semibold"
          style={{ backgroundColor: "var(--pi-laranja)", color: "var(--on-accent)" }}
        >
          {enviando ? "Enviando..." : `Enviar ${validas.length || ""} convite(s)`}
        </Button>

        {resultado && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-4 space-y-2 text-sm">
            <p className="text-[var(--text-primary)]">
              Enviados: {resultado.enviados.length}
            </p>
            {resultado.falhaEnvio.length > 0 && (
              <div>
                <p className="text-amber-400">
                  Convite criado, mas o e-mail não saiu:{" "}
                  {resultado.falhaEnvio.length}
                </p>
                {resultado.falhaEnvio.map((f) => (
                  <p key={f.email} className="text-xs text-[var(--text-tertiary)]">
                    {f.email} — {f.motivo}
                  </p>
                ))}
              </div>
            )}
            {resultado.ignorados.length > 0 && (
              <div>
                <p className="text-[var(--text-tertiary)]">
                  Ignorados: {resultado.ignorados.length}
                </p>
                {resultado.ignorados.map((f) => (
                  <p key={f.email} className="text-xs text-[var(--text-muted)]">
                    {f.email} — {f.motivo}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 bg-[var(--bg-secondary)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
            Convites enviados
          </h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={filtroSituacao}
              onChange={(e) =>
                setFiltroSituacao(e.target.value as "" | "expirado")
              }
              className="h-10 rounded-lg bg-[var(--surface-2)] border border-[var(--border-color)] px-3 text-sm text-[var(--text-primary)]"
            >
              <option value="">Todas as situações</option>
              <option value="expirado">Só expirados</option>
            </select>
            {convites.length > 0 && (
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="h-10 w-full sm:w-72 rounded-lg bg-[var(--surface-2)] border border-[var(--border-color)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--color-blue)]"
              />
            )}
          </div>
        </div>

        {!convites.length ? (
          <p className="text-sm text-[var(--text-tertiary)]">
            {filtroSituacao === "expirado"
              ? "Nenhum convite expirado."
              : "Nenhum convite enviado ainda."}
          </p>
        ) : !convitesFiltrados.length ? (
          <p className="text-sm text-[var(--text-tertiary)]">
            Nenhum convite encontrado para &quot;{busca}&quot;.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <p className="text-xs text-[var(--text-muted)] mb-2">
              {convitesFiltrados.length} de {convites.length} convite(s)
            </p>
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">E-mail</th>
                  <th className="py-2 pr-4">Papel</th>
                  <th className="py-2 pr-4">Vínculo</th>
                  <th className="py-2">Situação</th>
                </tr>
              </thead>
              <tbody>
                {convitesFiltrados.map((c) => (
                  <tr key={c.id} className="border-t border-[var(--border-color)]">
                    <td className="py-2 pr-4 text-[var(--text-primary)]">{c.nome}</td>
                    <td className="py-2 pr-4 text-[var(--text-tertiary)]">{c.email}</td>
                    <td className="py-2 pr-4 text-[var(--text-tertiary)]">
                      {ROTULO_PAPEL[c.role] ?? c.role}
                    </td>
                    <td className="py-2 pr-4 text-[var(--text-tertiary)]">
                      {c.curso?.nome ?? c.instituicao?.sigla ?? "—"}
                    </td>
                    <td className="py-2">
                      {c.usadoEm ? (
                        <span className="text-[var(--color-mint-ink)]">cadastrado</span>
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

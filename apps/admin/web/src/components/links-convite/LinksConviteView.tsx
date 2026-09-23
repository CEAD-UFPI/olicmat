"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Instituicao {
  id: string;
  nome: string;
  sigla: string;
  cursos: { id: string; nome: string }[];
}

interface LinkConviteItem {
  id: string;
  token: string;
  role: string;
  totalCadastros: number;
  curso: { id: string; nome: string } | null;
  instituicao: { id: string; nome: string; sigla: string } | null;
  criadoPor: { id: string; nome: string };
  createdAt: string;
}

const ROTULO_PAPEL: Record<string, string> = {
  COORDENADOR_CURSO: "Coordenador de Curso",
  AVALIADOR: "Avaliador",
  COMISSAO: "Comissão",
};

export function LinksConviteView({
  basePath,
}: {
  basePath: "admin" | "comissao";
}) {
  const [links, setLinks] = useState<LinkConviteItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [role, setRole] = useState("COORDENADOR_CURSO");
  const [instituicaoId, setInstituicaoId] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [erro, setErro] = useState("");
  const [criando, setCriando] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [regenerandoId, setRegenerandoId] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    api
      .get("/admin/links-convite")
      .then(({ data }) => setLinks(data?.data ?? []))
      .catch(() => setLinks([]))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
    api
      .get("/instituicoes?limit=200")
      .then((r) => setInstituicoes(r.data?.data ?? []))
      .catch(() => setInstituicoes([]));
  }, [carregar]);

  const cursosDaInstituicao =
    instituicoes.find((i) => i.id === instituicaoId)?.cursos ?? [];

  const criar = async () => {
    setErro("");
    if (role === "COORDENADOR_CURSO" && !cursoId) {
      setErro("Selecione o curso.");
      return;
    }
    setCriando(true);
    try {
      await api.post("/admin/links-convite", {
        role,
        cursoId: role === "COORDENADOR_CURSO" ? cursoId : undefined,
      });
      setInstituicaoId("");
      setCursoId("");
      carregar();
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Não foi possível criar o link.");
    } finally {
      setCriando(false);
    }
  };

  const regenerar = async (id: string) => {
    if (!confirm("Gerar um novo link vai invalidar o link atual. Continuar?")) {
      return;
    }
    setRegenerandoId(id);
    try {
      await api.post(`/admin/links-convite/${id}/regenerar`);
      carregar();
    } catch {
      // silencioso: a lista recarrega e mostra o estado real do servidor
    } finally {
      setRegenerandoId(null);
    }
  };

  const copiar = (item: LinkConviteItem) => {
    const url = `${window.location.origin}/cadastro/${item.token}`;
    navigator.clipboard.writeText(url);
    setCopiadoId(item.id);
    setTimeout(() => setCopiadoId(null), 2000);
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
          Links de Convite
        </h1>
        <p className="text-[#9895a4] mt-1">
          Links reutilizáveis para cadastro sem depender de e-mail —
          compartilhe por WhatsApp, Discord etc.
        </p>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] space-y-4">
        <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Novo link
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setInstituicaoId("");
              setCursoId("");
            }}
            className="h-11 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#f0ece4]"
          >
            <option value="COORDENADOR_CURSO">Coordenador de Curso</option>
            <option value="AVALIADOR">Avaliador</option>
            <option value="COMISSAO">Comissão</option>
          </select>
          {role === "COORDENADOR_CURSO" && (
            <>
              <select
                value={instituicaoId}
                onChange={(e) => {
                  setInstituicaoId(e.target.value);
                  setCursoId("");
                }}
                className="h-11 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#f0ece4]"
              >
                <option value="">Selecione a instituição</option>
                {instituicoes.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.sigla || i.nome}
                  </option>
                ))}
              </select>
              <select
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
                disabled={!instituicaoId}
                className="h-11 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#f0ece4] disabled:opacity-50"
              >
                <option value="">
                  {instituicaoId
                    ? "Selecione o curso"
                    : "Escolha a instituição primeiro"}
                </option>
                {cursosDaInstituicao.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
        {erro && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
            {erro}
          </p>
        )}
        <Button
          onClick={criar}
          disabled={criando}
          className="h-11 px-6 text-sm font-semibold"
          style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        >
          {criando ? "Criando..." : "Criar link"}
        </Button>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
        {carregando ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !links.length ? (
          <p className="text-sm text-[#9895a4] p-6">Nenhum link criado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.08em] text-[#6f6c7a] border-b border-[#2a2a3a]">
                  <th className="py-3 px-5">Papel</th>
                  <th className="py-3 px-5">Curso/Instituição</th>
                  <th className="py-3 px-5">Criado por</th>
                  <th className="py-3 px-5">Cadastros</th>
                  <th className="py-3 px-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {links.map((l) => (
                  <tr key={l.id} className="border-t border-[#2a2a3a]">
                    <td className="py-3 px-5 text-[#f0ece4]">
                      {ROTULO_PAPEL[l.role] ?? l.role}
                    </td>
                    <td className="py-3 px-5 text-[#9895a4]">
                      {l.curso ? l.curso.nome : l.instituicao ? l.instituicao.sigla : "—"}
                    </td>
                    <td className="py-3 px-5 text-[#9895a4]">{l.criadoPor.nome}</td>
                    <td className="py-3 px-5 text-[#9895a4]">{l.totalCadastros}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => copiar(l)}
                          className="text-xs font-medium text-[#3AAFE0] hover:underline cursor-pointer"
                        >
                          {copiadoId === l.id ? "Copiado!" : "Copiar link"}
                        </button>
                        <button
                          onClick={() => regenerar(l.id)}
                          disabled={regenerandoId === l.id}
                          className="text-[#9895a4] hover:text-red-400 transition-colors p-1 cursor-pointer disabled:opacity-50"
                          title="Gerar novo link (invalida o atual)"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
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

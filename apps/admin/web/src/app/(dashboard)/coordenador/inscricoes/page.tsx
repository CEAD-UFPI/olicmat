"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge, INSCRICAO_STATUS } from "@/components/ui/detail-panel";
import { Check, X } from "lucide-react";

interface EdicaoInfo {
  id: string;
  ano: number;
  titulo: string;
}

interface InscricaoInfo {
  id: string;
  status: string;
  edicao?: EdicaoInfo;
  createdAt?: string;
}

interface AlunoInscrito {
  id: string;
  nome: string;
  email: string;
  matricula?: string;
  curso?: { id: string; nome: string };
  inscricao: InscricaoInfo;
}

interface AlunoNaoInscrito {
  id: string;
  nome: string;
  email: string;
  matricula?: string;
  curso?: { id: string; nome: string };
}

interface MonitoramentoData {
  totalAlunos: number;
  totalInscritos: number;
  totalNaoInscritos: number;
  inscritos: AlunoInscrito[];
  naoInscritos: AlunoNaoInscrito[];
}

const ITENS_POR_PAGINA = 10;

export default function CoordenadorInscricoesPage() {
  const [dados, setDados] = useState<MonitoramentoData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  // Separado de `erro`: aquele substitui a página inteira, e uma falha ao
  // confirmar uma inscrição não pode apagar a lista que a coordenação está
  // usando.
  const [erroAcao, setErroAcao] = useState("");
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [processando, setProcessando] = useState<Record<string, boolean>>({});
  const [modalRejeicao, setModalRejeicao] = useState<{ id: string } | null>(null);
  const [justificativa, setJustificativa] = useState("");
  const [paginaInscritos, setPaginaInscritos] = useState(1);
  const [paginaNaoInscritos, setPaginaNaoInscritos] = useState(1);

  const carregar = async () => {
    setCarregando(true);
    try {
      const { data } = await api.get("/coordenacao/monitoramento-inscricoes");
      setDados(data);
    } catch {
      setErro("Erro ao carregar inscrições.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const atualizarStatus = async (id: string, status: string, justificativaTexto?: string) => {
    setProcessando((prev) => ({ ...prev, [id]: true }));
    setErroAcao("");
    try {
      await api.patch(`/inscricoes/${id}/status`, { status, justificativa: justificativaTexto });
      await carregar();
      setModalRejeicao(null);
      setJustificativa("");
    } catch (e: unknown) {
      // Falhar em silêncio aqui fazia o botão parar de girar sem que nada
      // mudasse na tela: a coordenação concluía que tinha confirmado a
      // inscrição, e o participante ficava de fora da prova sem ninguém saber.
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setErroAcao(
        typeof msg === "string"
          ? msg
          : "Não foi possível atualizar a inscrição. Tente novamente.",
      );
    } finally {
      setProcessando((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (erro || !dados) {
    return (
      <div className="border border-[var(--border-color)] rounded-2xl p-8 bg-[var(--bg-secondary)] text-center">
        <p className="text-[var(--text-secondary)]">{erro || "Nenhuma inscrição disponível."}</p>
      </div>
    );
  }

  const matchTexto = (nome: string, email: string, cursoNome: string) =>
    !filtro ||
    nome.toLowerCase().includes(filtro.toLowerCase()) ||
    email.toLowerCase().includes(filtro.toLowerCase()) ||
    cursoNome.toLowerCase().includes(filtro.toLowerCase());

  const inscritosFiltrados = dados.inscritos.filter((a) => {
    const okTexto = matchTexto(a.nome, a.email, a.curso?.nome ?? "");
    const okStatus = !statusFiltro || a.inscricao.status === statusFiltro;
    return okTexto && okStatus;
  });

  const naoInscritosFiltrados = dados.naoInscritos.filter((a) =>
    matchTexto(a.nome, a.email, a.curso?.nome ?? "")
  );

  const totalPaginasInscritos = Math.max(1, Math.ceil(inscritosFiltrados.length / ITENS_POR_PAGINA));
  const pagInscritos = Math.min(paginaInscritos, totalPaginasInscritos);
  const inscritosPagina = inscritosFiltrados.slice(
    (pagInscritos - 1) * ITENS_POR_PAGINA,
    pagInscritos * ITENS_POR_PAGINA
  );

  const totalPaginasNao = Math.max(1, Math.ceil(naoInscritosFiltrados.length / ITENS_POR_PAGINA));
  const pagNao = Math.min(paginaNaoInscritos, totalPaginasNao);
  const naoInscritosPagina = naoInscritosFiltrados.slice(
    (pagNao - 1) * ITENS_POR_PAGINA,
    pagNao * ITENS_POR_PAGINA
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
          Inscrições
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">
          Acompanhe quem já se inscreveu e aprove as inscrições dos seus participantes
        </p>
      </div>

      {erroAcao && (
        <div
          role="alert"
          className="flex items-start justify-between gap-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3"
        >
          <span>{erroAcao}</span>
          <button
            type="button"
            onClick={() => setErroAcao("")}
            className="text-red-400/70 hover:text-red-300 cursor-pointer shrink-0"
            aria-label="Fechar aviso"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)] p-5">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest">Participantes</p>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-1 font-[family-name:var(--font-fraunces)]">
            {dados.totalAlunos}
          </p>
        </div>
        <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)] p-5">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest">Inscritos</p>
          <p className="text-3xl font-bold text-[var(--color-green-ink)] mt-1 font-[family-name:var(--font-fraunces)]">
            {dados.totalInscritos}
          </p>
        </div>
        <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)] p-5">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest">Não inscritos</p>
          <p className="text-3xl font-bold text-[var(--color-amber-ink)] mt-1 font-[family-name:var(--font-fraunces)]">
            {dados.totalNaoInscritos}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por nome, email ou curso..."
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPaginaInscritos(1);
            setPaginaNaoInscritos(1);
          }}
          className="flex-1 min-w-[200px] bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
        />
        <select
          value={statusFiltro}
          onChange={(e) => {
            setStatusFiltro(e.target.value);
            setPaginaInscritos(1);
          }}
          className="h-10 px-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-base cursor-pointer"
        >
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="REJEITADA">Rejeitada</option>
        </select>
      </div>

      {/* Inscritos */}
      <section>
        <h2 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)] mb-3">
          Inscritos ({inscritosFiltrados.length})
        </h2>
        {inscritosFiltrados.length === 0 ? (
          <div className="border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)] text-center text-[var(--text-secondary)]">
            Nenhuma inscrição encontrada.
          </div>
        ) : (
          <>
            <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                      <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Nome</th>
                      <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Edição</th>
                      <th className="text-center py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Status</th>
                      <th className="text-center py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscritosPagina.map((aluno) => (
                      <tr key={aluno.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-primary)]/50 transition-colors">
                        <td className="py-4 px-5">
                          <p className="text-[var(--text-primary)] font-medium">{aluno.nome}</p>
                          <p className="text-[var(--text-tertiary)] text-sm">{aluno.email}</p>
                        </td>
                        <td className="py-4 px-5 text-[var(--text-tertiary)]">
                          {aluno.inscricao.edicao ? `${aluno.inscricao.edicao.ano}` : "-"}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <StatusBadge
                            label={INSCRICAO_STATUS[aluno.inscricao.status]?.label ?? aluno.inscricao.status}
                            tone={INSCRICAO_STATUS[aluno.inscricao.status]?.tone ?? "neutral"}
                          />
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {aluno.inscricao.status === "PENDENTE" && (
                              <>
                                <button
                                  disabled={processando[aluno.inscricao.id]}
                                  onClick={() => atualizarStatus(aluno.inscricao.id, "CONFIRMADA")}
                                  className="text-[var(--color-green-ink)] hover:bg-[var(--color-green)]/10 transition-colors p-1 rounded cursor-pointer disabled:opacity-50"
                                  title="Confirmar"
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  disabled={processando[aluno.inscricao.id]}
                                  onClick={() => setModalRejeicao({ id: aluno.inscricao.id })}
                                  className="text-red-400 hover:bg-red-400/10 transition-colors p-1 rounded cursor-pointer disabled:opacity-50"
                                  title="Rejeitar"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4">
              <Pagination pagina={pagInscritos} totalPaginas={totalPaginasInscritos} onPageChange={setPaginaInscritos} />
            </div>
          </>
        )}
      </section>

      {/* Não inscritos */}
      <section>
        <h2 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)] mb-3">
          Ainda não inscritos ({naoInscritosFiltrados.length})
        </h2>
        {naoInscritosFiltrados.length === 0 ? (
          <div className="border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)] text-center text-[var(--text-secondary)]">
            Todos os participantes já se inscreveram.
          </div>
        ) : (
          <>
            <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                      <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Nome</th>
                      <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Matrícula</th>
                      <th className="text-left py-4 px-5 text-[var(--text-secondary)] font-semibold text-sm uppercase tracking-wider">Curso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {naoInscritosPagina.map((aluno) => (
                      <tr key={aluno.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-primary)]/50 transition-colors">
                        <td className="py-4 px-5">
                          <p className="text-[var(--text-primary)] font-medium">{aluno.nome}</p>
                          <p className="text-[var(--text-tertiary)] text-sm">{aluno.email}</p>
                        </td>
                        <td className="py-4 px-5 text-[var(--text-tertiary)]">{aluno.matricula || "-"}</td>
                        <td className="py-4 px-5 text-[var(--text-tertiary)]">{aluno.curso?.nome || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4">
              <Pagination pagina={pagNao} totalPaginas={totalPaginasNao} onPageChange={setPaginaNaoInscritos} />
            </div>
          </>
        )}
      </section>

      {modalRejeicao && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-[family-name:var(--font-fraunces)]">
              Justificar rejeição
            </h3>
            <p className="text-sm text-[var(--text-tertiary)] mb-4">
              A justificativa será enviada por e-mail e notificação ao participante.
            </p>
            <textarea
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Explique o motivo da rejeição (mínimo 10 caracteres)"
              rows={4}
              className="w-full rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 text-sm focus:outline-none focus:border-[var(--color-gold)]"
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setModalRejeicao(null);
                  setJustificativa("");
                }}
                className="flex-1 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg py-2 text-sm cursor-pointer hover:bg-[var(--bg-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={justificativa.trim().length < 10 || processando[modalRejeicao.id]}
                onClick={() => atualizarStatus(modalRejeicao.id, "REJEITADA", justificativa.trim())}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50 hover:bg-red-600 transition-colors"
              >
                Confirmar rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

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
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [processando, setProcessando] = useState<Record<string, boolean>>({});
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

  const atualizarStatus = async (id: string, status: string) => {
    setProcessando((prev) => ({ ...prev, [id]: true }));
    try {
      await api.patch(`/inscricoes/${id}/status`, { status });
      await carregar();
    } catch {
      // silently fail
    } finally {
      setProcessando((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (erro || !dados) {
    return (
      <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
        <p className="text-[#b0adc0]">{erro || "Nenhuma inscrição disponível."}</p>
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
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Inscrições
        </h1>
        <p className="text-[#9895a4] mt-1">
          Acompanhe quem já se inscreveu e aprove as inscrições dos seus participantes
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] p-5">
          <p className="text-xs text-[#9895a4] uppercase tracking-widest">Participantes</p>
          <p className="text-3xl font-bold text-[#f0ece4] mt-1 font-[family-name:var(--font-fraunces)]">
            {dados.totalAlunos}
          </p>
        </div>
        <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] p-5">
          <p className="text-xs text-[#9895a4] uppercase tracking-widest">Inscritos</p>
          <p className="text-3xl font-bold text-[#4CAF50] mt-1 font-[family-name:var(--font-fraunces)]">
            {dados.totalInscritos}
          </p>
        </div>
        <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] p-5">
          <p className="text-xs text-[#9895a4] uppercase tracking-widest">Não inscritos</p>
          <p className="text-3xl font-bold text-[#f59e0b] mt-1 font-[family-name:var(--font-fraunces)]">
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
          className="flex-1 min-w-[200px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
        />
        <select
          value={statusFiltro}
          onChange={(e) => {
            setStatusFiltro(e.target.value);
            setPaginaInscritos(1);
          }}
          className="h-10 px-3 rounded-lg bg-[#12121a] border border-[#2a2a3a] text-[#f0ece4] text-base cursor-pointer"
        >
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="REJEITADA">Rejeitada</option>
        </select>
      </div>

      {/* Inscritos */}
      <section>
        <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)] mb-3">
          Inscritos ({inscritosFiltrados.length})
        </h2>
        {inscritosFiltrados.length === 0 ? (
          <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] text-center text-[#b0adc0]">
            Nenhuma inscrição encontrada.
          </div>
        ) : (
          <>
            <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                      <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Nome</th>
                      <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Edição</th>
                      <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Status</th>
                      <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscritosPagina.map((aluno) => (
                      <tr key={aluno.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                        <td className="py-4 px-5">
                          <p className="text-[#f0ece4] font-medium">{aluno.nome}</p>
                          <p className="text-[#9895a4] text-sm">{aluno.email}</p>
                        </td>
                        <td className="py-4 px-5 text-[#9895a4]">
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
                                  className="text-[#4CAF50] hover:bg-[#4CAF50]/10 transition-colors p-1 rounded cursor-pointer disabled:opacity-50"
                                  title="Confirmar"
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  disabled={processando[aluno.inscricao.id]}
                                  onClick={() => atualizarStatus(aluno.inscricao.id, "REJEITADA")}
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
        <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)] mb-3">
          Ainda não inscritos ({naoInscritosFiltrados.length})
        </h2>
        {naoInscritosFiltrados.length === 0 ? (
          <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] text-center text-[#b0adc0]">
            Todos os participantes já se inscreveram.
          </div>
        ) : (
          <>
            <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                      <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Nome</th>
                      <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Matrícula</th>
                      <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Curso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {naoInscritosPagina.map((aluno) => (
                      <tr key={aluno.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                        <td className="py-4 px-5">
                          <p className="text-[#f0ece4] font-medium">{aluno.nome}</p>
                          <p className="text-[#9895a4] text-sm">{aluno.email}</p>
                        </td>
                        <td className="py-4 px-5 text-[#9895a4]">{aluno.matricula || "-"}</td>
                        <td className="py-4 px-5 text-[#9895a4]">{aluno.curso?.nome || "-"}</td>
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
    </motion.div>
  );
}

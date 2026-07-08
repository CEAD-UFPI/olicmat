"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { DetailPanel, INSCRICAO_STATUS, EmptyState, StatusBadge } from "@/components/ui/detail-panel";
import { Check, X, Pencil, Trash2, Eye, FileText } from "lucide-react";

interface InscricaoItem {
  id: string;
  nome?: string;
  email?: string;
  estado?: string;
  municipio?: string;
  instituicao?: string;
  curso?: string;
  periodo?: number;
  status: string;
  comprovanteUrl?: string;
  fase1Nota?: number | null;
  fase2Tema?: string | null;
  fase2Nota?: number | null;
  notaFinal?: number | null;
  medalha?: string | null;
  edicaoAno?: number | null;
  edicaoTitulo?: string | null;
  createdAt?: string;
}

interface InscricaoForm {
  estado: string;
  municipio: string;
  periodo: string;
  comprovanteUrl: string;
}

export default function AdminInscricoesPage() {
  const [inscricoes, setInscricoes] = useState<InscricaoItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [processando, setProcessando] = useState<Record<string, boolean>>({});

  // Edit modal state
  const [editTarget, setEditTarget] = useState<InscricaoItem | null>(null);
  const [form, setForm] = useState<InscricaoForm>({ estado: "", municipio: "", periodo: "", comprovanteUrl: "" });
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroForm, setErroForm] = useState("");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<InscricaoItem | null>(null);
  const [deletando, setDeletando] = useState(false);

  // Detail modal
  const [detailTarget, setDetailTarget] = useState<InscricaoItem | null>(null);

  // Pagination
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 10;

  const carregar = async () => {
    setCarregando(true);
    try {
      const { data } = await api.get("/inscricoes");
      const flatData = (Array.isArray(data) ? data : []).map((item: Record<string, unknown>) => ({
        id: item.id as string,
        nome: (item.user as Record<string, string>)?.nome ?? (item.nome as string),
        email: (item.user as Record<string, string>)?.email ?? (item.email as string),
        estado: item.estado as string,
        municipio: item.municipio as string,
        instituicao:
          ((item.instituicao as Record<string, string>)?.sigla as string) ??
          ((item.instituicao as Record<string, string>)?.nome as string) ??
          (item.instituicao as string) ?? "",
        curso: ((item.curso as Record<string, string>)?.nome as string) ?? (item.curso as string) ?? "",
        periodo: item.periodo as number,
        status: item.status as string,
        comprovanteUrl: item.comprovanteUrl as string,
        fase1Nota: item.fase1Nota as number | null,
        fase2Tema: item.fase2Tema as string | null,
        fase2Nota: item.fase2Nota as number | null,
        notaFinal: item.notaFinal as number | null,
        medalha: item.medalha as string | null,
        edicaoAno: (item.edicao as Record<string, number>)?.ano ?? null,
        edicaoTitulo: (item.edicao as Record<string, string>)?.titulo ?? null,
        createdAt: item.createdAt as string,
      }));
      setInscricoes(flatData);
    } catch {
      setInscricoes([]);
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
      setInscricoes((prev) =>
        prev.map((insc) => (insc.id === id ? { ...insc, status } : insc))
      );
    } catch {
      // silently fail
    } finally {
      setProcessando((prev) => ({ ...prev, [id]: false }));
    }
  };

  const abrirEditar = (insc: InscricaoItem) => {
    setEditTarget(insc);
    setForm({
      estado: insc.estado || "",
      municipio: insc.municipio || "",
      periodo: insc.periodo?.toString() || "",
      comprovanteUrl: insc.comprovanteUrl || "",
    });
    setErroForm("");
  };

  const salvarEdicao = async () => {
    if (!editTarget) return;
    setSalvandoEdicao(true);
    setErroForm("");
    try {
      await api.patch(`/inscricoes/${editTarget.id}`, {
        estado: form.estado || undefined,
        municipio: form.municipio || undefined,
        periodo: form.periodo ? parseInt(form.periodo, 10) : undefined,
        comprovanteUrl: form.comprovanteUrl || null,
      });
      setEditTarget(null);
      carregar();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Erro ao editar inscrição.";
      setErroForm(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSalvandoEdicao(false);
    }
  };

  const confirmarDelete = async () => {
    if (!deleteTarget) return;
    setDeletando(true);
    try {
      await api.delete(`/inscricoes/${deleteTarget.id}`);
      setDeleteTarget(null);
      carregar();
    } catch {
      // silently fail
    } finally {
      setDeletando(false);
    }
  };

  const filtered = inscricoes.filter((i) => {
    const matchTexto =
      !filtro ||
      (i.nome && i.nome.toLowerCase().includes(filtro.toLowerCase())) ||
      (i.email && i.email.toLowerCase().includes(filtro.toLowerCase())) ||
      (i.instituicao && i.instituicao.toLowerCase().includes(filtro.toLowerCase()));
    const matchStatus = !statusFiltro || i.status === statusFiltro;
    return matchTexto && matchStatus;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtered.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const paginados = filtered.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
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
        <p className="text-[#9895a4] mt-1">Validação de inscrições dos competidores</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por nome, email ou instituição..."
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPagina(1);
          }}
          className="flex-1 min-w-[200px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
        />
        <select
          value={statusFiltro}
          onChange={(e) => {
            setStatusFiltro(e.target.value);
            setPagina(1);
          }}
          className="h-10 px-3 rounded-lg bg-[#12121a] border border-[#2a2a3a] text-[#f0ece4] text-base cursor-pointer"
        >
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="REJEITADA">Rejeitada</option>
        </select>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#b0adc0]">Nenhuma inscrição encontrada.</p>
        </div>
      ) : (
        <>
          <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Nome</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Estado</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Instituição</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Curso</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Status</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginados.map((insc) => (
                    <tr key={insc.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                      <td className="py-4 px-5 text-[#f0ece4] font-medium">{insc.nome || "-"}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{insc.estado || "-"}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{insc.instituicao || "-"}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{insc.curso || "-"}</td>
                      <td className="py-4 px-5 text-center">
<span className="inline-flex">
                          <StatusBadge
                            label={INSCRICAO_STATUS[insc.status]?.label ?? insc.status}
                            tone={INSCRICAO_STATUS[insc.status]?.tone ?? "neutral"}
                          />
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setDetailTarget(insc)}
                            className="text-[#9895a4] hover:text-[#4CAF50] transition-colors p-1 cursor-pointer"
                            title="Detalhes"
                          >
                            <Eye size={18} />
                          </button>
                          {insc.comprovanteUrl && (
                            <a
                              href={insc.comprovanteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#9895a4] hover:text-[#E8B829] transition-colors p-1 cursor-pointer"
                              title="Ver comprovante"
                            >
                               <FileText size={18} />
                            </a>
                          )}
                          <button
                            onClick={() => abrirEditar(insc)}
                            className="text-[#9895a4] hover:text-[#4CAF50] transition-colors p-1 cursor-pointer"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          {insc.status === "PENDENTE" && (
                            <>
                              <button
                                disabled={processando[insc.id]}
                                onClick={() => atualizarStatus(insc.id, "CONFIRMADA")}
                                className="text-[#4CAF50] hover:bg-[#4CAF50]/10 transition-colors p-1 cursor-pointer"
                                title="Confirmar"
                              >
                                 <Check size={18} />
                              </button>
                              <button
                                disabled={processando[insc.id]}
                                onClick={() => atualizarStatus(insc.id, "REJEITADA")}
                                className="text-red-400 hover:bg-red-400/10 transition-colors p-1 cursor-pointer"
                                title="Rejeitar"
                              >
                                 <X size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setDeleteTarget(insc)}
                            className="text-[#9895a4] hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination pagina={paginaAtual} totalPaginas={totalPaginas} onPageChange={setPagina} />
        </>
      )}

      {/* Detail Panel — unified */}
      <DetailPanel
        aberto={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        titulo="Detalhes da Inscrição"
        onEdit={
          detailTarget
            ? () => {
                const target = detailTarget;
                setDetailTarget(null);
                abrirEditar(target);
              }
            : undefined
        }
        hero={
          detailTarget
            ? {
                label: "Status da Inscrição",
                value: INSCRICAO_STATUS[detailTarget.status]?.label ?? detailTarget.status,
                tone: INSCRICAO_STATUS[detailTarget.status]?.tone ?? "neutral",
                hint:
                  detailTarget.edicaoAno != null
                    ? `Edição ${detailTarget.edicaoAno}${detailTarget.edicaoTitulo ? ` — ${detailTarget.edicaoTitulo}` : ""}`
                    : undefined,
              }
            : undefined
        }
        sections={
          detailTarget
            ? [
                {
                  title: "Participante",
                  fields: [
                    { label: "Nome", value: detailTarget.nome || "", emptyText: "Não informado" },
                    { label: "Email", value: detailTarget.email || "", emptyText: "Não informado" },
                    { label: "Estado (UF)", value: detailTarget.estado || "", emptyText: "Não informado" },
                    { label: "Município", value: detailTarget.municipio || "", emptyText: "Não informado" },
                  ],
                },
                {
                  title: "Vínculo Acadêmico",
                  fields: [
                    { label: "Instituição", value: detailTarget.instituicao || "", emptyText: "Não informada" },
                    { label: "Curso", value: detailTarget.curso || "", emptyText: "Não informado" },
                    {
                      label: "Período",
                      value: detailTarget.periodo != null ? `${detailTarget.periodo}º` : "",
                      emptyText: "Não informado",
                    },
                    {
                      label: "Comprovante de Matrícula",
                      full: true,
                      value: detailTarget.comprovanteUrl ? (
                        <a
                          href={detailTarget.comprovanteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4CAF50] hover:underline"
                        >
                          Ver comprovante →
                        </a>
                      ) : (
                        ""
                      ),
                      emptyText: "Não enviado",
                    },
                  ],
                },
                {
                  title: "Desempenho",
                  fields: [
                    {
                      label: "Nota Fase 1",
                      value: detailTarget.fase1Nota != null ? Number(detailTarget.fase1Nota).toFixed(2) : "",
                      emptyText: "Ainda não realizada",
                    },
                    {
                      label: "Tema Fase 2",
                      value: detailTarget.fase2Tema || "",
                      emptyText: "Não atribuído",
                    },
                    {
                      label: "Nota Final",
                      value: detailTarget.notaFinal != null ? Number(detailTarget.notaFinal).toFixed(2) : "",
                      emptyText: "Ainda não calculada",
                    },
                    {
                      label: "Medalha",
                      value: detailTarget.medalha
                        ? new Map<string, string>([
                            ["OURO", "🥇 Ouro"],
                            ["PRATA", "🥈 Prata"],
                            ["BRONZE", "🥉 Bronze"],
                          ]).get(detailTarget.medalha) ?? detailTarget.medalha
                        : "",
                      emptyText: "Sem medalha",
                    },
                  ],
                },
                {
                  title: "Histórico",
                  hideIfEmpty: false,
                  // Note: AuditLog não é escrito pelo backend (ver AGENTS.md "Remaining Risks").
                  // Enquanto isso, exibimos apenas a data de criação.
                  children: (
                    <>
                      {detailTarget.createdAt && (
                        <p className="text-sm text-[#9895a4]">
                          Inscrição criada em{" "}
                          <span className="text-[#f0ece4]">
                            {new Date(detailTarget.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </p>
                      )}
                      <EmptyState message="Histórico de mudanças indisponível — o registro de auditoria ainda não é escrito pelo backend." />
                    </>
                  ),
                  fields: [],
                },
              ]
            : []
        }
      />

      {/* Modal Editar */}
      <Modal
        aberto={!!editTarget}
        onClose={() => setEditTarget(null)}
        titulo="Editar Inscrição"
      >
        <div className="space-y-4">
          <div>
            <Label className="text-[#f0ece4]">Estado (UF)</Label>
            <Input
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value.slice(0, 2).toUpperCase() })}
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
              placeholder="SP"
            />
          </div>
          <div>
            <Label className="text-[#f0ece4]">Município</Label>
            <Input
              value={form.municipio}
              onChange={(e) => setForm({ ...form, municipio: e.target.value })}
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
              placeholder="Nome do município"
            />
          </div>
          <div>
            <Label className="text-[#f0ece4]">Período</Label>
            <Input
              value={form.periodo}
              onChange={(e) => setForm({ ...form, periodo: e.target.value.replace(/\D/g, "") })}
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
              placeholder="1 a 12"
            />
          </div>
          <div>
            <Label className="text-[#f0ece4]">URL do Comprovante</Label>
            <Input
              value={form.comprovanteUrl}
              onChange={(e) => setForm({ ...form, comprovanteUrl: e.target.value })}
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
              placeholder="https://..."
            />
          </div>

          {erroForm && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{erroForm}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setEditTarget(null)}
              disabled={salvandoEdicao}
              className="text-[#9895a4] hover:text-[#f0ece4] cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={salvarEdicao}
              disabled={salvandoEdicao}
              style={{ backgroundColor: "#4CAF50", color: "#fff" }}
              className="cursor-pointer"
            >
              {salvandoEdicao ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ConfirmDialog Excluir */}
      <ConfirmDialog
        aberto={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmarDelete}
        titulo="Excluir Inscrição"
        mensagem={`Tem certeza que deseja excluir a inscrição de "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmando={deletando}
      />
    </motion.div>
  );
}

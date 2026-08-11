"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import { DetailPanel } from "@/components/ui/detail-panel";

interface InstituicaoOption {
  id: string;
  nome: string;
  sigla: string;
}

interface CursoItem {
  id: string;
  nome: string;
  instituicaoId: string;
  instituicao: { id: string; nome: string; sigla: string };
  notaEnade?: number | null;
  _count: { usuarios: number; inscricoes: number };
  createdAt: string;
}

interface CursoForm {
  nome: string;
  instituicaoId: string;
  notaEnade: string;
}

const FORM_VAZIO: CursoForm = { nome: "", instituicaoId: "", notaEnade: "" };

export default function AdminCursosPage() {
  const [cursos, setCursos] = useState<CursoItem[]>([]);
  const [instituicoes, setInstituicoes] = useState<InstituicaoOption[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [filtroInst, setFiltroInst] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<CursoItem | null>(null);
  const [form, setForm] = useState<CursoForm>(FORM_VAZIO);
  const [erro, setErro] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<CursoItem | null>(null);

  // Detail modal state
  const [detailTarget, setDetailTarget] = useState<CursoItem | null>(null);

  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 20;

  const carregarTudo = async () => {
    setCarregando(true);
    try {
      const [cursosRes, instRes] = await Promise.all([
        api.get("/admin/cursos"),
        api.get("/instituicoes?limit=99999"),
      ]);
      setCursos(cursosRes.data);
      const rawInst = Array.isArray(instRes.data)
        ? instRes.data
        : Array.isArray(instRes.data?.data)
        ? instRes.data.data
        : [];
      setInstituicoes(
        rawInst.map((i: { id: string; nome: string; sigla: string; cursos: unknown[] }) => ({
          id: i.id,
          nome: i.nome,
          sigla: i.sigla,
        }))
      );
    } catch {
      console.error("Erro ao carregar dados");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregarTudo(); }, []);

  const filtrados = cursos.filter((c) => {
    const matchNome = c.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchInst = !filtroInst || c.instituicaoId === filtroInst;
    return matchNome && matchInst;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const abrirCriar = () => {
    setEditando(null);
    setForm(FORM_VAZIO);
    setErro("");
    setModalAberto(true);
  };

  const abrirEditar = (item: CursoItem) => {
    setEditando(item);
    setForm({
      nome: item.nome,
      instituicaoId: item.instituicaoId,
      notaEnade: item.notaEnade != null ? String(item.notaEnade) : "",
    });
    setErro("");
    setModalAberto(true);
  };

  const salvar = async () => {
    if (form.nome.length < 2) { setErro("Nome deve ter no mínimo 2 caracteres"); return; }
    if (!form.instituicaoId) { setErro("Selecione uma instituição"); return; }
    setErro("");
    const notaEnadeNum = form.notaEnade === "" ? null : Number(form.notaEnade);
    if (notaEnadeNum !== null && (Number.isNaN(notaEnadeNum) || notaEnadeNum < 0 || notaEnadeNum > 100)) {
      setErro("Nota ENADE deve estar entre 0 e 100");
      return;
    }
    const body = {
      nome: form.nome,
      instituicaoId: form.instituicaoId,
      notaEnade: notaEnadeNum,
    };
    try {
      if (editando) {
        await api.patch(`/admin/cursos/${editando.id}`, body);
      } else {
        await api.post("/admin/cursos", body);
      }
      setModalAberto(false);
      carregarTudo();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message;
      setErro(typeof msg === "string" ? msg : "Erro ao salvar");
    }
  };

  const deletar = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/admin/cursos/${confirmDelete.id}`);
      setConfirmDelete(null);
      carregarTudo();
    } catch {
      setErro("Erro ao excluir curso");
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            Cursos
          </h1>
          <p className="text-[#9895a4] mt-1 text-sm">Gerenciar cursos de licenciatura em Matemática</p>
        </div>
        <Button
          onClick={abrirCriar}
          className="bg-[#E8B829] text-black hover:bg-[#d4a720]"
        >
          <Plus size={16} className="mr-2" />
          Novo Curso
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9895a4]" />
          <Input
            placeholder="Buscar curso..."
            value={filtro}
            onChange={(e) => { setFiltro(e.target.value); setPagina(1); }}
            className="pl-10 border-[#2a2a3a] bg-[#12121a] text-[#f0ece4]"
          />
        </div>
        <select
          value={filtroInst}
          onChange={(e) => { setFiltroInst(e.target.value); setPagina(1); }}
          className="rounded-lg border border-[#2a2a3a] bg-[#12121a] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]"
        >
          <option value="">Todas instituições</option>
          {instituicoes.map((inst) => (
            <option key={inst.id} value={inst.id}>{inst.nome}</option>
          ))}
        </select>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="border border-[#2a2a3a] rounded-2xl overflow-hidden bg-[#12121a]">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                  <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Nome</th>
                  <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Instituição</th>
                  <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">ENADE</th>
                  <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Alunos</th>
                  <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Inscrições</th>
                  <th className="text-right py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#b0adc0] text-base">
                      Nenhum curso encontrado
                    </td>
                  </tr>
                ) : (
                  paginados.map((curso) => (
                    <tr key={curso.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#1a1a26] transition-colors">
                      <td className="py-4 px-5 text-[#f0ece4] font-medium">{curso.nome}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{curso.instituicao.sigla}</td>
                      <td className="py-4 px-5 text-[#9895a4]">
                        {curso.notaEnade != null ? Number(curso.notaEnade).toFixed(2) : "—"}
                      </td>
                      <td className="py-4 px-5 text-[#9895a4]">{curso._count?.usuarios ?? 0}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{curso._count?.inscricoes ?? 0}</td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailTarget(curso)}
                            className="p-1.5 text-[#9895a4] hover:text-[#3AAFE0] transition-colors"
                            title="Detalhes"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => abrirEditar(curso)}
                            className="p-1.5 text-[#9895a4] hover:text-[#E8B829] transition-colors"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(curso)}
                            className="p-1.5 text-[#9895a4] hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <Pagination pagina={pagina} totalPaginas={totalPaginas} onPageChange={setPagina} />
          )}
        </>
      )}

      <Modal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        titulo={editando ? "Editar Curso" : "Novo Curso"}
        tamanho="md"
      >
        <div className="space-y-5">
          {erro && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{erro}</p>
          )}

          <div className="space-y-2">
            <Label className="text-[#b0adc0] text-sm">Nome do Curso *</Label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: Licenciatura em Matemática"
              className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#b0adc0] text-sm">Instituição *</Label>
            <select
              value={form.instituicaoId}
              onChange={(e) => setForm({ ...form, instituicaoId: e.target.value })}
              className="w-full h-10 rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]"
            >
              <option value="">Selecione</option>
              {instituicoes.map((inst) => (
                <option key={inst.id} value={inst.id}>{inst.nome} ({inst.sigla})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-[#b0adc0] text-sm">Nota ENADE (0 a 100)</Label>
            <Input
              value={form.notaEnade}
              onChange={(e) => setForm({ ...form, notaEnade: e.target.value.replace(/[^\d.,]/g, "").replace(",", ".") })}
              placeholder="Ex: 75.50"
              className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
              inputMode="decimal"
            />
            <p className="text-xs text-[#9895a4]">Campo opcional. Nota contínua do Enade (Conceito Enade / 5 × 20).</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setModalAberto(false)}
              className="flex-1 border-[#2a2a3a] text-[#9895a4]"
            >
              Cancelar
            </Button>
            <Button
              onClick={salvar}
              className="flex-1 bg-[#E8B829] text-black hover:bg-[#d4a720]"
            >
              {editando ? "Salvar" : "Criar"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Panel */}
      <DetailPanel
        aberto={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        titulo="Detalhes do Curso"
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
                label: "Nota ENADE",
                value: detailTarget.notaEnade != null ? Number(detailTarget.notaEnade).toFixed(2) : "—",
                tone: detailTarget.notaEnade == null ? "neutral" : Number(detailTarget.notaEnade) >= 60 ? "green" : Number(detailTarget.notaEnade) >= 40 ? "amber" : "red",
                hint: detailTarget.instituicao?.sigla ?? "",
              }
            : undefined
        }
        sections={
          detailTarget
            ? [
                {
                  title: "Identificação",
                  fields: [
                    { label: "Nome", value: detailTarget.nome },
                    {
                      label: "Instituição",
                      value: detailTarget.instituicao ? `${detailTarget.instituicao.nome} (${detailTarget.instituicao.sigla})` : "",
                      emptyText: "Sem instituição vinculada",
                      full: true,
                    },
                    {
                      label: "Nota ENADE",
                      value: detailTarget.notaEnade != null ? Number(detailTarget.notaEnade).toFixed(2) : "",
                      emptyText: "Não informada",
                    },
                  ],
                },
                {
                  title: "Métricas",
                  fields: [
                    { label: "Alunos vinculados", value: detailTarget._count?.usuarios ?? 0 },
                    { label: "Inscrições", value: detailTarget._count?.inscricoes ?? 0 },
                    {
                      label: "Cadastrado em",
                      value: detailTarget.createdAt
                        ? new Date(detailTarget.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : "",
                    },
                  ],
                },
              ]
            : []
        }
      />

      <ConfirmDialog
        aberto={!!confirmDelete}
        titulo="Excluir curso"
        mensagem={`Tem certeza que deseja excluir "${confirmDelete?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={deletar}
        onClose={() => setConfirmDelete(null)}
      />
    </motion.div>
  );
}

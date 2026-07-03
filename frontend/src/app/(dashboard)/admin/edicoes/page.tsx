"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { Plus, Pencil, Trash2 } from "lucide-react";

interface EdicaoItem {
  id: string;
  ano: number;
  titulo: string;
  status: string;
}

interface EdicaoForm {
  ano: string;
  titulo: string;
  status: string;
}

const FORM_VAZIO: EdicaoForm = { ano: "", titulo: "", status: "PLANEJAMENTO" };

const STATUS_OPCOES = [
  { value: "PLANEJAMENTO", label: "Planejamento", cor: "#9895a4" },
  { value: "ATIVA", label: "Ativa", cor: "#4CAF50" },
  { value: "ENCERRADA", label: "Encerrada", cor: "#3AAFE0" },
];

export default function AdminEdicoesPage() {
  const [edicoes, setEdicoes] = useState<EdicaoItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<EdicaoItem | null>(null);
  const [form, setForm] = useState<EdicaoForm>(FORM_VAZIO);
  const [erro, setErro] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<EdicaoItem | null>(null);

  const carregar = async () => {
    setCarregando(true);
    try {
      const { data } = await api.get("/admin/edicoes");
      setEdicoes(data);
    } catch {
      console.error("Erro ao carregar edições");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const getStatusInfo = (status: string) =>
    STATUS_OPCOES.find((s) => s.value === status) || STATUS_OPCOES[0];

  const abrirCriar = () => {
    setEditando(null);
    setForm(FORM_VAZIO);
    setErro("");
    setModalAberto(true);
  };

  const abrirEditar = (item: EdicaoItem) => {
    setEditando(item);
    setForm({ ano: String(item.ano), titulo: item.titulo, status: item.status });
    setErro("");
    setModalAberto(true);
  };

  const salvar = async () => {
    const anoNum = parseInt(form.ano, 10);
    if (!anoNum || anoNum < 2020) { setErro("Ano deve ser no mínimo 2020"); return; }
    if (form.titulo.length < 2) { setErro("Título deve ter no mínimo 2 caracteres"); return; }
    setErro("");
    try {
      const body = editando
        ? { titulo: form.titulo, status: form.status }
        : { ano: anoNum, titulo: form.titulo };

      if (editando) {
        await api.patch(`/admin/edicoes/${editando.id}`, body);
      } else {
        await api.post("/admin/edicoes", body);
      }
      setModalAberto(false);
      carregar();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message;
      setErro(typeof msg === "string" ? msg : "Erro ao salvar");
    }
  };

  const deletar = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/admin/edicoes/${confirmDelete.id}`);
      setConfirmDelete(null);
      carregar();
    } catch {
      setErro("Erro ao excluir edição");
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
            Edições
          </h1>
          <p className="text-[#9895a4] mt-1 text-sm">Gerenciar edições da OLICMAT</p>
        </div>
        <Button
          onClick={abrirCriar}
          className="bg-[#E8B829] text-black hover:bg-[#d4a720]"
        >
          <Plus size={16} className="mr-2" />
          Nova Edição
        </Button>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="border border-[#2a2a3a] rounded-2xl overflow-hidden bg-[#12121a]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Ano</th>
                <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Título</th>
                <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Status</th>
                <th className="text-right py-3 px-4 text-[#9895a4] font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {edicoes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#9895a4]">
                    Nenhuma edição encontrada
                  </td>
                </tr>
              ) : (
                edicoes.map((ed) => {
                  const status = getStatusInfo(ed.status);
                  return (
                    <tr key={ed.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#1a1a26] transition-colors">
                      <td className="py-3 px-4 text-[#f0ece4] font-medium font-[family-name:var(--font-fraunces)]">
                        {ed.ano}
                      </td>
                      <td className="py-3 px-4 text-[#f0ece4]">{ed.titulo}</td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-medium"
                          style={{ color: status.cor }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ backgroundColor: status.cor }}
                          />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirEditar(ed)}
                            className="p-1.5 text-[#9895a4] hover:text-[#E8B829] transition-colors"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(ed)}
                            className="p-1.5 text-[#9895a4] hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal aberto={modalAberto} onClose={() => setModalAberto(false)}>
        <div className="space-y-5 w-full max-w-md p-2">
          <h2 className="text-xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            {editando ? "Editar Edição" : "Nova Edição"}
          </h2>

          {erro && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{erro}</p>
          )}

          {editando ? (
            <>
              <div className="space-y-2">
                <Label className="text-[#9895a4] text-xs">Ano</Label>
                <div className="h-10 rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] flex items-center px-3 text-[#f0ece4] text-sm">
                  {editando.ano}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#9895a4] text-xs">Título</Label>
                <Input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: OLICMAT 2026"
                  className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#9895a4] text-xs">Status</Label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-10 rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]"
                >
                  {STATUS_OPCOES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-[#9895a4] text-xs">Ano</Label>
                <Input
                  type="number"
                  value={form.ano}
                  onChange={(e) => setForm({ ...form, ano: e.target.value })}
                  placeholder="Ex: 2026"
                  min={2020}
                  className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#9895a4] text-xs">Título</Label>
                <Input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: OLICMAT 2026"
                  className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
                />
              </div>
            </>
          )}

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

      <ConfirmDialog
        aberto={!!confirmDelete}
        titulo="Excluir edição"
        mensagem={`Tem certeza que deseja excluir a edição ${confirmDelete?.ano} - "${confirmDelete?.titulo}"? Esta ação não pode ser desfeita.`}
        onConfirm={deletar}
        onClose={() => setConfirmDelete(null)}
      />
    </motion.div>
  );
}

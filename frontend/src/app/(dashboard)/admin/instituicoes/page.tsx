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
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface InstituicaoItem {
  id: string;
  nome: string;
  sigla: string;
  estado: string;
  codigoInep?: string;
  cursos: { id: string; nome: string }[];
  _count?: { cursos: number; usuarios: number };
  createdAt: string;
}

interface InstituicaoForm {
  nome: string;
  sigla: string;
  estado: string;
}

const FORM_VAZIO: InstituicaoForm = { nome: "", sigla: "", estado: "" };

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default function AdminInstituicoesPage() {
  const [instituicoes, setInstituicoes] = useState<InstituicaoItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<InstituicaoItem | null>(null);
  const [form, setForm] = useState<InstituicaoForm>(FORM_VAZIO);
  const [erro, setErro] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<InstituicaoItem | null>(null);

  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 20;

  const carregar = async () => {
    setCarregando(true);
    try {
      const { data } = await api.get("/instituicoes");
      setInstituicoes(data);
    } catch {
      console.error("Erro ao carregar instituições");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const filtrados = instituicoes.filter((i) =>
    i.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    i.sigla.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const validar = (dados: InstituicaoForm) => {
    if (dados.nome.length < 2) return "Nome deve ter no mínimo 2 caracteres";
    if (dados.sigla.length < 2 || dados.sigla.length > 10) return "Sigla deve ter entre 2 e 10 caracteres";
    if (dados.estado && dados.estado.length !== 2) return "UF deve ter 2 caracteres";
    return "";
  };

  const abrirCriar = () => {
    setEditando(null);
    setForm(FORM_VAZIO);
    setErro("");
    setModalAberto(true);
  };

  const abrirEditar = (item: InstituicaoItem) => {
    setEditando(item);
    setForm({ nome: item.nome, sigla: item.sigla, estado: item.estado });
    setErro("");
    setModalAberto(true);
  };

  const salvar = async () => {
    const erroValidacao = validar(form);
    if (erroValidacao) { setErro(erroValidacao); return; }
    setErro("");
    try {
      if (editando) {
        await api.patch(`/admin/instituicoes/${editando.id}`, form);
      } else {
        await api.post("/admin/instituicoes", form);
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
      await api.delete(`/admin/instituicoes/${confirmDelete.id}`);
      setConfirmDelete(null);
      carregar();
    } catch {
      setErro("Erro ao excluir instituição");
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
            Instituições
          </h1>
          <p className="text-[#9895a4] mt-1 text-sm">Gerenciar instituições de ensino</p>
        </div>
        <Button
          onClick={abrirCriar}
          className="bg-[#E8B829] text-black hover:bg-[#d4a720]"
        >
          <Plus size={16} className="mr-2" />
          Nova Instituição
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9895a4]" />
        <Input
          placeholder="Buscar por nome ou sigla..."
          value={filtro}
          onChange={(e) => { setFiltro(e.target.value); setPagina(1); }}
          className="pl-10 border-[#2a2a3a] bg-[#12121a] text-[#f0ece4]"
        />
      </div>

      {carregando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="border border-[#2a2a3a] rounded-2xl overflow-hidden bg-[#12121a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Nome</th>
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Sigla</th>
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">UF</th>
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Cursos</th>
                  <th className="text-right py-3 px-4 text-[#9895a4] font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#9895a4]">
                      Nenhuma instituição encontrada
                    </td>
                  </tr>
                ) : (
                  paginados.map((inst) => (
                    <tr key={inst.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#1a1a26] transition-colors">
                      <td className="py-3 px-4 text-[#f0ece4] font-medium">{inst.nome}</td>
                      <td className="py-3 px-4 text-[#9895a4]">{inst.sigla}</td>
                      <td className="py-3 px-4 text-[#9895a4]">{inst.estado || "-"}</td>
                      <td className="py-3 px-4 text-[#9895a4]">{(inst.cursos?.length ?? 0)} cursos</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirEditar(inst)}
                            className="p-1.5 text-[#9895a4] hover:text-[#E8B829] transition-colors"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(inst)}
                            className="p-1.5 text-[#9895a4] hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={15} />
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

      <Modal aberto={modalAberto} onClose={() => setModalAberto(false)}>
        <div className="space-y-5 w-full max-w-md p-2">
          <h2 className="text-xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            {editando ? "Editar Instituição" : "Nova Instituição"}
          </h2>

          {erro && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{erro}</p>
          )}

          <div className="space-y-2">
            <Label className="text-[#9895a4] text-xs">Nome da Instituição</Label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: Universidade Federal..."
              className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#9895a4] text-xs">Sigla</Label>
              <Input
                value={form.sigla}
                onChange={(e) => setForm({ ...form, sigla: e.target.value.toUpperCase() })}
                placeholder="Ex: UFABC"
                maxLength={10}
                className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#9895a4] text-xs">UF</Label>
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                className="w-full h-10 rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]"
              >
                <option value="">Selecione</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
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

      <ConfirmDialog
        aberto={!!confirmDelete}
        titulo="Excluir instituição"
        mensagem={`Tem certeza que deseja excluir "${confirmDelete?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={deletar}
        onClose={() => setConfirmDelete(null)}
      />
    </motion.div>
  );
}

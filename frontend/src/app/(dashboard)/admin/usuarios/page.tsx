"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Role } from "@/types";

interface UsuarioItem {
  id: string;
  nome: string;
  email: string;
  role: Role;
  matricula?: string;
  comprovanteUrl?: string;
  instituicao?: string;
  curso?: string;
  createdAt: string;
}

interface UsuarioForm {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  role: Role;
  matricula: string;
  dataNascimento: string;
}

const FORM_VAZIO: UsuarioForm = {
  nome: "",
  email: "",
  cpf: "",
  senha: "",
  role: "ALUNO",
  matricula: "",
  dataNascimento: "",
};

const ROLES: { value: string; label: string; cor: string }[] = [
  { value: "ALUNO", label: "Aluno", cor: "#4b7bec" },
  { value: "COORDENADOR_CURSO", label: "Coordenador", cor: "#f48120" },
  { value: "AVALIADOR", label: "Avaliador", cor: "#00d47d" },
  { value: "ADMIN", label: "Admin", cor: "#e53e3e" },
];

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [filtroRole, setFiltroRole] = useState("");

  // Modal state
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<UsuarioForm>(FORM_VAZIO);
  const [erroForm, setErroForm] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<UsuarioItem | null>(null);
  const [deletando, setDeletando] = useState(false);

  // Pagination
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 10;

  const carregarUsuarios = useCallback(() => {
    api
      .get("/admin/usuarios")
      .then(({ data }) => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setUsuarios([]))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const filtered = usuarios.filter((u) => {
    const matchTexto =
      !filtro ||
      u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase());
    const matchRole = !filtroRole || u.role === filtroRole;
    return matchTexto && matchRole;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtered.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const paginados = filtered.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const abrirNovo = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErroForm("");
    setModalAberto(true);
  };

  const abrirEditar = (u: UsuarioItem) => {
    setEditandoId(u.id);
    setForm({
      nome: u.nome,
      email: u.email,
      cpf: "",
      senha: "",
      role: u.role,
      matricula: u.matricula || "",
      dataNascimento: "",
    });
    setErroForm("");
    setModalAberto(true);
  };

  const salvar = async () => {
    setErroForm("");
    if (!form.nome || !form.email) {
      setErroForm("Nome e email são obrigatórios.");
      return;
    }
    if (!editandoId && (!form.cpf || !form.senha || !form.dataNascimento)) {
      setErroForm("CPF, senha e data de nascimento são obrigatórios para novo usuário.");
      return;
    }

    setSalvando(true);
    try {
      if (editandoId) {
        await api.patch(`/admin/usuarios/${editandoId}`, {
          nome: form.nome,
          email: form.email,
          role: form.role,
          matricula: form.matricula || undefined,
        });
      } else {
        await api.post("/admin/usuarios", form);
      }
      setModalAberto(false);
      carregarUsuarios();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Erro ao salvar usuário.";
      setErroForm(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSalvando(false);
    }
  };

  const confirmarDelete = async () => {
    if (!deleteTarget) return;
    setDeletando(true);
    try {
      await api.delete(`/admin/usuarios/${deleteTarget.id}`);
      setDeleteTarget(null);
      carregarUsuarios();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Erro ao excluir usuário.";
      setErroForm(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setDeletando(false);
    }
  };

  const roleLabel = (role: Role) => ROLES.find((r) => r.value === role)?.label || role;
  const roleCor = (role: Role) => ROLES.find((r) => r.value === role)?.cor || "#9895a4";

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            Usuários
          </h1>
          <p className="text-[#9895a4] mt-1">Gerenciamento de usuários da plataforma</p>
        </div>
        <Button
          onClick={abrirNovo}
          style={{ backgroundColor: "#00d47d", color: "#fff" }}
          className="gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Novo Usuário
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por nome ou email..."
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPagina(1);
          }}
          className="flex-1 min-w-[200px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
        />
        <select
          value={filtroRole}
          onChange={(e) => {
            setFiltroRole(e.target.value);
            setPagina(1);
          }}
          className="h-10 px-3 rounded-lg bg-[#12121a] border border-[#2a2a3a] text-[#f0ece4] text-sm cursor-pointer"
        >
          <option value="">Todas as funções</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#f48120] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#9895a4]">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <>
          <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Nome</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Instituição</th>
                    <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Curso</th>
                    <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Função</th>
                    <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginados.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-[#f0ece4] font-medium">{u.nome}</td>
                      <td className="py-3 px-4 text-[#9895a4]">{u.email}</td>
                      <td className="py-3 px-4 text-[#9895a4]">{u.instituicao || "-"}</td>
                      <td className="py-3 px-4 text-[#9895a4]">{u.curso || "-"}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${roleCor(u.role)}20`,
                            color: roleCor(u.role),
                          }}
                        >
                          {roleLabel(u.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => abrirEditar(u)}
                            className="text-[#9895a4] hover:text-[#00d47d] transition-colors p-1 cursor-pointer"
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="text-[#9895a4] hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
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

      {/* Modal Criar/Editar */}
      <Modal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        titulo={editandoId ? "Editar Usuário" : "Novo Usuário"}
        tamanho="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#f0ece4]">Nome *</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label className="text-[#f0ece4]">Email *</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                placeholder="email@exemplo.com"
                type="email"
              />
            </div>
          </div>

          {!editandoId && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-[#f0ece4]">CPF *</Label>
                <Input
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                  className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                  placeholder="00000000000"
                />
              </div>
              <div>
                <Label className="text-[#f0ece4]">Senha *</Label>
                <Input
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div>
                <Label className="text-[#f0ece4]">Data Nasc. *</Label>
                <Input
                  value={form.dataNascimento}
                  onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
                  className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                  type="date"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#f0ece4]">Função</Label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-[#f0ece4]">Matrícula</Label>
              <Input
                value={form.matricula}
                onChange={(e) => setForm({ ...form, matricula: e.target.value })}
                className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                placeholder="Opcional"
              />
            </div>
          </div>

          {erroForm && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{erroForm}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setModalAberto(false)}
              disabled={salvando}
              className="text-[#9895a4] hover:text-[#f0ece4] cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={salvar}
              disabled={salvando}
              style={{ backgroundColor: "#00d47d", color: "#fff" }}
              className="cursor-pointer"
            >
              {salvando ? "Salvando..." : editandoId ? "Atualizar" : "Criar Usuário"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ConfirmDialog Excluir */}
      <ConfirmDialog
        aberto={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmarDelete}
        titulo="Excluir Usuário"
        mensagem={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmando={deletando}
      />
    </motion.div>
  );
}

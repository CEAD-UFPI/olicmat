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
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { DetailPanel, ROLE_INFO } from "@/components/ui/detail-panel";
import type { Role, Genero, RacaCor, TipoBolsa, Titulacao } from "@/types";

interface UsuarioItem {
  id: string;
  nome: string;
  email: string;
  role: Role;
  matricula?: string;
  comprovanteUrl?: string;
  instituicao?: string;
  curso?: string;
  telefone?: string | null;
  genero?: Genero | null;
  racaCor?: RacaCor | null;
  createdAt: string;
}

interface UsuarioForm {
  nome: string;
  nomeSocial: string;
  email: string;
  cpf: string;
  senha: string;
  role: Role;
  matricula: string;
  dataNascimento: string;
  telefone: string;
  celular: string;
  genero: string;
  racaCor: string;
  possuiDeficiencia: string;
  cotista: string;
  bolsista: string;
  tipoBolsa: string;
  documentoIdentificacao: string;
  nacionalidade: string;
  cep: string;
  numero: string;
  enderecoCompleto: string;
  complemento: string;
  bairro: string;
  uf: string;
  municipio: string;
  pontoReferencia: string;
  formacao: string;
  titulacao: string;
  areaFormacao: string;
}

const FORM_VAZIO: UsuarioForm = {
  nome: "", nomeSocial: "", email: "", cpf: "", senha: "", role: "ALUNO",
  matricula: "", dataNascimento: "", telefone: "", celular: "",
  genero: "", racaCor: "", possuiDeficiencia: "", cotista: "", bolsista: "", tipoBolsa: "",
  documentoIdentificacao: "", nacionalidade: "", cep: "", numero: "",
  enderecoCompleto: "", complemento: "", bairro: "", uf: "", municipio: "",
  pontoReferencia: "", formacao: "", titulacao: "", areaFormacao: "",
};

const ROLES: { value: string; label: string; cor: string }[] = [
  { value: "ALUNO", label: "Aluno", cor: "#3AAFE0" },
  { value: "COORDENADOR_CURSO", label: "Coordenador", cor: "#E8B829" },
  { value: "AVALIADOR", label: "Avaliador", cor: "#4CAF50" },
  { value: "ADMIN", label: "Admin", cor: "#e53e3e" },
  { value: "COMISSAO", label: "Comissão", cor: "#9b59b6" },
];

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const selectClasses = "mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm cursor-pointer";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [filtroRole, setFiltroRole] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<UsuarioForm>(FORM_VAZIO);
  const [erroForm, setErroForm] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [detailTarget, setDetailTarget] = useState<UsuarioItem | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<UsuarioItem | null>(null);
  const [deletando, setDeletando] = useState(false);

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

  const abrirEditar = async (u: UsuarioItem) => {
    setEditandoId(u.id);
    setForm({
      ...FORM_VAZIO,
      nome: u.nome,
      email: u.email,
      role: u.role,
      matricula: u.matricula || "",
    });
    setErroForm("");
    setModalAberto(true);

    // Load full profile
    try {
      const { data } = await api.get(`/admin/usuarios/${u.id}`);
      if (data) {
        setForm((prev) => ({
          ...prev,
          nome: data.nome || prev.nome,
          nomeSocial: data.nomeSocial || "",
          email: data.email || prev.email,
          role: data.role || prev.role,
          matricula: data.matricula || "",
          telefone: data.telefone || "",
          celular: data.celular || "",
          genero: data.genero || "",
          racaCor: data.racaCor || "",
          possuiDeficiencia: data.possuiDeficiencia === true ? "true" : data.possuiDeficiencia === false ? "false" : "",
          cotista: data.cotista === true ? "true" : data.cotista === false ? "false" : "",
          bolsista: data.bolsista === true ? "true" : data.bolsista === false ? "false" : "",
          tipoBolsa: data.tipoBolsa || "",
          documentoIdentificacao: data.documentoIdentificacao || "",
          nacionalidade: data.nacionalidade || "",
          cep: data.cep || "",
          numero: data.numero || "",
          enderecoCompleto: data.enderecoCompleto || "",
          complemento: data.complemento || "",
          bairro: data.bairro || "",
          uf: data.uf || "",
          municipio: data.municipio || "",
          pontoReferencia: data.pontoReferencia || "",
          formacao: data.formacao || "",
          titulacao: data.titulacao || "",
          areaFormacao: data.areaFormacao || "",
        }));
      }
    } catch {
      // Silently fall back to basic form
    }
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
          nomeSocial: form.nomeSocial || null,
          email: form.email,
          role: form.role,
          matricula: form.matricula || undefined,
          telefone: form.telefone || null,
          celular: form.celular || null,
          genero: form.genero || null,
          racaCor: form.racaCor || null,
          possuiDeficiencia: form.possuiDeficiencia === "true" ? true : form.possuiDeficiencia === "false" ? false : null,
          cotista: form.cotista === "true" ? true : form.cotista === "false" ? false : null,
          bolsista: form.bolsista === "true" ? true : form.bolsista === "false" ? false : null,
          tipoBolsa: form.tipoBolsa || null,
          documentoIdentificacao: form.documentoIdentificacao || null,
          nacionalidade: form.nacionalidade || null,
          cep: form.cep || null,
          numero: form.numero || null,
          enderecoCompleto: form.enderecoCompleto || null,
          complemento: form.complemento || null,
          bairro: form.bairro || null,
          uf: form.uf || null,
          municipio: form.municipio || null,
          pontoReferencia: form.pontoReferencia || null,
          formacao: form.formacao || null,
          titulacao: form.titulacao || null,
          areaFormacao: form.areaFormacao || null,
        });
      } else {
        await api.post("/admin/usuarios", {
          nome: form.nome,
          nomeSocial: form.nomeSocial || undefined,
          email: form.email,
          cpf: form.cpf,
          senha: form.senha,
          role: form.role,
          matricula: form.matricula || undefined,
          dataNascimento: form.dataNascimento,
          telefone: form.telefone || undefined,
          celular: form.celular || undefined,
          genero: form.genero || null,
          racaCor: form.racaCor || null,
          possuiDeficiencia: form.possuiDeficiencia === "true" ? true : form.possuiDeficiencia === "false" ? false : null,
          cotista: form.cotista === "true" ? true : form.cotista === "false" ? false : null,
          bolsista: form.bolsista === "true" ? true : form.bolsista === "false" ? false : null,
          tipoBolsa: form.tipoBolsa || null,
          documentoIdentificacao: form.documentoIdentificacao || null,
          nacionalidade: form.nacionalidade || null,
          cep: form.cep || null,
          numero: form.numero || null,
          enderecoCompleto: form.enderecoCompleto || null,
          complemento: form.complemento || null,
          bairro: form.bairro || null,
          uf: form.uf || null,
          municipio: form.municipio || null,
          pontoReferencia: form.pontoReferencia || null,
          formacao: form.formacao || null,
          titulacao: form.titulacao || null,
          areaFormacao: form.areaFormacao || null,
        });
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
  const isNonAluno = form.role !== "ALUNO";

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
          style={{ backgroundColor: "#4CAF50", color: "#fff" }}
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
          className="h-10 px-3 rounded-lg bg-[#12121a] border border-[#2a2a3a] text-[#f0ece4] text-base cursor-pointer"
        >
          <option value="">Todas as funções</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#b0adc0]">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <>
          <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Nome</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Email</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Instituição</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Curso</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Função</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginados.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors"
                    >
                      <td className="py-4 px-5 text-[#f0ece4] font-medium">{u.nome}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{u.email}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{u.instituicao || "-"}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{u.curso || "-"}</td>
                      <td className="py-4 px-5 text-center">
                        <span
                          className="text-sm font-medium px-3 py-1 rounded-full"
                          style={{ backgroundColor: `${roleCor(u.role)}20`, color: roleCor(u.role) }}
                        >
                          {roleLabel(u.role)}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setDetailTarget(u)}
                            className="text-[#9895a4] hover:text-[#3AAFE0] transition-colors p-1 cursor-pointer"
                            title="Detalhes"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => abrirEditar(u)}
                            className="text-[#9895a4] hover:text-[#4CAF50] transition-colors p-1 cursor-pointer"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
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
        titulo="Detalhes do Usuário"
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
                label: "Função",
                value: ROLE_INFO[detailTarget.role]?.label ?? detailTarget.role,
                tone: ROLE_INFO[detailTarget.role]?.tone ?? "neutral",
                hint: detailTarget.email,
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
                    { label: "Email", value: detailTarget.email },
                    {
                      label: "Matrícula",
                      value: detailTarget.matricula || "",
                      emptyText: "Não informada",
                    },
                    {
                      label: "Telefone",
                      value: detailTarget.telefone || "",
                      emptyText: "Não informado",
                    },
                    {
                      label: "Gênero",
                      value: detailTarget.genero
                        ? new Map<string, string>([
                            ["MASCULINO", "Masculino"],
                            ["FEMININO", "Feminino"],
                            ["OUTRO", "Outro"],
                            ["PREFIRO_NAO_INFORMAR", "Prefiro não informar"],
                          ]).get(detailTarget.genero) ?? detailTarget.genero
                        : "",
                      emptyText: "Não informado",
                    },
                    {
                      label: "Raça/Cor",
                      value: detailTarget.racaCor
                        ? new Map<string, string>([
                            ["BRANCA", "Branca"],
                            ["PRETA", "Preta"],
                            ["PARDA", "Parda"],
                            ["AMARELA", "Amarela"],
                            ["INDIGENA", "Indígena"],
                            ["OUTRO", "Outro"],
                            ["PREFIRO_NAO_INFORMAR", "Prefiro não informar"],
                          ]).get(detailTarget.racaCor) ?? detailTarget.racaCor
                        : "",
                      emptyText: "Não informado",
                    },
                  ],
                },
                {
                  title: "Vínculo Institucional",
                  fields: [
                    {
                      label: "Instituição",
                      value: detailTarget.instituicao || "",
                      emptyText: "Nenhuma instituição vinculada",
                    },
                    {
                      label: "Curso",
                      value: detailTarget.curso || "",
                      emptyText: "Nenhum curso vinculado",
                    },
                  ],
                },
                {
                  title: "Histórico",
                  hideIfEmpty: false,
                  fields: [
                    {
                      label: "Cadastrado em",
                      value: detailTarget.createdAt
                        ? new Date(detailTarget.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "",
                    },
                  ],
                },
              ]
            : []
        }
      />

      {/* Create/Edit Modal */}
      <Modal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        titulo={editandoId ? "Editar Usuário" : "Novo Usuário"}
        tamanho="xl"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Basic info section */}
          <SectionTitle title="Identificação" />
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
                className={selectClasses}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
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

          {/* Personal Data */}
          <SectionTitle title="Dados Pessoais" />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-[#f0ece4]">Nome Social</Label>
              <Input
                value={form.nomeSocial}
                onChange={(e) => setForm({ ...form, nomeSocial: e.target.value })}
                className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                placeholder="Nome social"
              />
            </div>
            <div>
              <Label className="text-[#f0ece4]">Telefone</Label>
              <Input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                placeholder="11999999999"
              />
            </div>
            <div>
              <Label className="text-[#f0ece4]">Celular</Label>
              <Input
                value={form.celular}
                onChange={(e) => setForm({ ...form, celular: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                placeholder="11999999999"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-[#f0ece4]">Gênero</Label>
              <select value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })} className={selectClasses}>
                <option value="">Selecione</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTRO">Outro</option>
                <option value="PREFIRO_NAO_INFORMAR">Prefiro não informar</option>
              </select>
            </div>
            <div>
              <Label className="text-[#f0ece4]">Raça/Cor</Label>
              <select value={form.racaCor} onChange={(e) => setForm({ ...form, racaCor: e.target.value })} className={selectClasses}>
                <option value="">Selecione</option>
                <option value="BRANCA">Branca</option>
                <option value="PRETA">Preta</option>
                <option value="PARDA">Parda</option>
                <option value="AMARELA">Amarela</option>
                <option value="INDIGENA">Indígena</option>
                <option value="OUTRO">Outro</option>
                <option value="PREFIRO_NAO_INFORMAR">Prefiro não informar</option>
              </select>
            </div>
            <div>
              <Label className="text-[#f0ece4]">Deficiência</Label>
              <select value={form.possuiDeficiencia} onChange={(e) => setForm({ ...form, possuiDeficiencia: e.target.value })} className={selectClasses}>
                <option value="">Selecione</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-[#f0ece4]">Cotista</Label>
              <select value={form.cotista} onChange={(e) => setForm({ ...form, cotista: e.target.value })} className={selectClasses}>
                <option value="">Selecione</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            <div>
              <Label className="text-[#f0ece4]">Bolsista</Label>
              <select value={form.bolsista} onChange={(e) => setForm({ ...form, bolsista: e.target.value })} className={selectClasses}>
                <option value="">Selecione</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            {form.bolsista === "true" && (
              <div>
                <Label className="text-[#f0ece4]">Tipo Bolsa</Label>
                <select value={form.tipoBolsa} onChange={(e) => setForm({ ...form, tipoBolsa: e.target.value })} className={selectClasses}>
                  <option value="">Selecione</option>
                  <option value="PIBIC">PIBIC</option>
                  <option value="PIBITI">PIBITI</option>
                  <option value="PIBEX">PIBEX</option>
                  <option value="PRAEC">PRAEC</option>
                  <option value="PET">PET</option>
                  <option value="PROUNI">PROUNI</option>
                  <option value="FIES">FIES</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>
            )}
          </div>

          {/* Address section - shown for non-ALUNO roles */}
          {isNonAluno && (
            <>
              <SectionTitle title="Endereço" />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-[#f0ece4]">CEP</Label>
                  <Input
                    value={form.cep}
                    onChange={(e) => setForm({ ...form, cep: e.target.value.replace(/\D/g, "").slice(0, 8) })}
                    className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                    placeholder="00000000"
                  />
                </div>
                <div>
                  <Label className="text-[#f0ece4]">UF</Label>
                  <select value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value })} className={selectClasses}>
                    <option value="">Selecione</option>
                    {ESTADOS.map((uf) => (<option key={uf} value={uf}>{uf}</option>))}
                  </select>
                </div>
                <div>
                  <Label className="text-[#f0ece4]">Município</Label>
                  <Input value={form.municipio} onChange={(e) => setForm({ ...form, municipio: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="Município" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label className="text-[#f0ece4]">Endereço Completo</Label>
                  <Input value={form.enderecoCompleto} onChange={(e) => setForm({ ...form, enderecoCompleto: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="Rua, número, bairro" />
                </div>
                <div>
                  <Label className="text-[#f0ece4]">Número</Label>
                  <Input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="Nº" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-[#f0ece4]">Bairro</Label>
                  <Input value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="Bairro" />
                </div>
                <div>
                  <Label className="text-[#f0ece4]">Complemento</Label>
                  <Input value={form.complemento} onChange={(e) => setForm({ ...form, complemento: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="Complemento" />
                </div>
                <div>
                  <Label className="text-[#f0ece4]">Ponto de Ref.</Label>
                  <Input value={form.pontoReferencia} onChange={(e) => setForm({ ...form, pontoReferencia: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="Ponto de referência" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#f0ece4]">Documento Identificação</Label>
                  <Input value={form.documentoIdentificacao} onChange={(e) => setForm({ ...form, documentoIdentificacao: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="RG / CNH / RNE" />
                </div>
                <div>
                  <Label className="text-[#f0ece4]">Nacionalidade</Label>
                  <Input value={form.nacionalidade} onChange={(e) => setForm({ ...form, nacionalidade: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="Brasileira" />
                </div>
              </div>

              <SectionTitle title="Formação e Trabalho" />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-[#f0ece4]">Formação</Label>
                  <Input value={form.formacao} onChange={(e) => setForm({ ...form, formacao: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="Ex: Matemática" />
                </div>
                <div>
                  <Label className="text-[#f0ece4]">Titulação</Label>
                  <select value={form.titulacao} onChange={(e) => setForm({ ...form, titulacao: e.target.value })} className={selectClasses}>
                    <option value="">Selecione</option>
                    <option value="GRADUADO">Graduado</option>
                    <option value="ESPECIALIZACAO">Especialização</option>
                    <option value="MESTRE">Mestre</option>
                    <option value="DOUTOR">Doutor</option>
                    <option value="POS_DOUTOR">Pós-Doutor</option>
                  </select>
                </div>
                <div>
                  <Label className="text-[#f0ece4]">Área de Formação</Label>
                  <Input value={form.areaFormacao} onChange={(e) => setForm({ ...form, areaFormacao: e.target.value })} className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" placeholder="Área" />
                </div>
              </div>
            </>
          )}

          {erroForm && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{erroForm}</p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-[#2a2a3a]">
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
              style={{ backgroundColor: "#4CAF50", color: "#fff" }}
              className="cursor-pointer"
            >
              {salvando ? "Salvando..." : editandoId ? "Atualizar" : "Criar Usuário"}
            </Button>
          </div>
        </div>
      </Modal>

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

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-[#E8B829] font-medium uppercase tracking-wider">{title}</p>
      <div className="h-px bg-[#2a2a3a]" />
    </div>
  );
}

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
import { DetailPanel } from "@/components/ui/detail-panel";
import type { Role, Genero, RacaCor, TipoBolsa } from "@/types";
import { maskCPF, maskPhone, validarCPF } from "@/lib/utils";

interface AlunoItem {
  id: string;
  nome: string;
  nomeMae?: string;
  email: string;
  role: Role;
  matricula?: string;
  instituicao?: { id: string; nome: string; sigla: string } | string;
  curso?: { id: string; nome: string } | string;
  telefone?: string | null;
  genero?: Genero | null;
  racaCor?: RacaCor | null;
  createdAt: string;
}

interface AlunoForm {
  nome: string;
  nomeSocial: string;
  nomeMae: string;
  email: string;
  cpf: string;
  senha: string;
  matricula: string;
  dataNascimento: string;
  cursoId: string;
  telefone: string;
  celular: string;
  genero: string;
  racaCor: string;
  possuiDeficiencia: string;
  cotista: string;
  bolsista: string;
  tipoBolsa: string;
}

const FORM_VAZIO: AlunoForm = {
  nome: "", nomeSocial: "", nomeMae: "", email: "", cpf: "", senha: "",
  matricula: "", dataNascimento: "", cursoId: "",
  telefone: "", celular: "",
  genero: "", racaCor: "", possuiDeficiencia: "", cotista: "", bolsista: "", tipoBolsa: "",
};

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const selectClasses = "mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm cursor-pointer";

export default function CoordenadorAlunosPage() {
  const [alunos, setAlunos] = useState<AlunoItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");

  const [cursos, setCursos] = useState<{ id: string; nome: string; instituicaoId: string; instituicao: { id: string; nome: string; sigla: string } }[]>([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<AlunoForm>(FORM_VAZIO);
  const [erroForm, setErroForm] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [detailTarget, setDetailTarget] = useState<AlunoItem | null>(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);

  const abrirDetalhes = async (a: AlunoItem) => {
    setLoadingDetalhes(true);
    try {
      const { data } = await api.get(`/admin/usuarios/${a.id}`);
      if (data) {
        setDetailTarget({
          ...a,
          ...data,
        });
      }
    } catch {
      setDetailTarget(a);
    } finally {
      setLoadingDetalhes(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<AlunoItem | null>(null);
  const [deletando, setDeletando] = useState(false);

  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 10;

  const carregarAlunos = useCallback(() => {
    setCarregando(true);
    api
      .get("/coordenacao/alunos")
      .then(({ data }) => setAlunos(Array.isArray(data) ? data : []))
      .catch(() => setAlunos([]))
      .finally(() => setCarregando(false));
  }, []);

  const carregarCursos = useCallback(() => {
    api
      .get("/coordenacao/cursos")
      .then(({ data }) => setCursos(Array.isArray(data) ? data : []))
      .catch(() => setCursos([]));
  }, []);

  useEffect(() => {
    carregarAlunos();
    carregarCursos();
  }, [carregarAlunos, carregarCursos]);

  const filtered = alunos.filter((a) => {
    const matchTexto =
      !filtro ||
      a.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      a.email.toLowerCase().includes(filtro.toLowerCase()) ||
      (a.matricula && a.matricula.includes(filtro));
    
    const cursoNome = typeof a.curso === "object" ? a.curso?.nome : a.curso;
    const cursoId = typeof a.curso === "object" ? a.curso?.id : "";
    const matchCurso = !filtroCurso || cursoId === filtroCurso || (cursoNome && cursoNome.toLowerCase().includes(filtroCurso.toLowerCase()));
    
    return matchTexto && matchCurso;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtered.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const paginados = filtered.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const abrirNovo = () => {
    setEditandoId(null);
    setForm({
      ...FORM_VAZIO,
      cursoId: cursos.length > 0 ? cursos[0].id : "",
    });
    setErroForm("");
    setModalAberto(true);
  };

  const abrirEditar = async (a: AlunoItem) => {
    setEditandoId(a.id);
    setForm({
      ...FORM_VAZIO,
      nome: a.nome,
      email: a.email,
      matricula: a.matricula || "",
      cursoId: typeof a.curso === "object" ? a.curso?.id || "" : "",
    });
    setErroForm("");
    setModalAberto(true);

    try {
      const { data } = await api.get(`/admin/usuarios/${a.id}`);
      if (data) {
        setForm((prev) => ({
          ...prev,
          nome: data.nome || prev.nome,
          nomeSocial: data.nomeSocial || "",
          nomeMae: data.nomeMae || "",
          email: data.email || prev.email,
          matricula: data.matricula || "",
          cursoId: data.curso?.id || prev.cursoId,
          telefone: maskPhone(data.telefone || ""),
          celular: maskPhone(data.celular || ""),
          genero: data.genero || "",
          racaCor: data.racaCor || "",
          possuiDeficiencia: data.possuiDeficiencia === true ? "true" : data.possuiDeficiencia === false ? "false" : "",
          cotista: data.cotista === true ? "true" : data.cotista === false ? "false" : "",
          bolsista: data.bolsista === true ? "true" : data.bolsista === false ? "false" : "",
          tipoBolsa: data.tipoBolsa || "",
        }));
      }
    } catch {
      // Silently fall back to basic form
    }
  };

  const salvar = async () => {
    setErroForm("");
    if (!form.nome || !form.email || !form.nomeMae || !form.cursoId) {
      setErroForm("Nome, email, nome da mãe e curso são obrigatórios.");
      return;
    }
    if (!editandoId) {
      if (!form.cpf || !form.dataNascimento) {
        setErroForm("CPF e data de nascimento são obrigatórios for novo aluno.");
        return;
      }
      if (!validarCPF(form.cpf)) {
        setErroForm("CPF inválido.");
        return;
      }
    }

    const selectedCurso = cursos.find((c) => c.id === form.cursoId);
    if (!selectedCurso) {
      setErroForm("Curso selecionado inválido.");
      return;
    }

    const telefoneDigits = form.telefone.replace(/\D/g, "");
    if (telefoneDigits && (telefoneDigits.length < 10 || telefoneDigits.length > 11)) {
      setErroForm("Telefone deve ter 10 ou 11 dígitos.");
      return;
    }
    const celularDigits = form.celular.replace(/\D/g, "");
    if (celularDigits && (celularDigits.length < 10 || celularDigits.length > 11)) {
      setErroForm("Celular deve ter 10 ou 11 dígitos.");
      return;
    }

    setSalvando(true);
    try {
      if (editandoId) {
        await api.patch(`/admin/usuarios/${editandoId}`, {
          nome: form.nome,
          nomeSocial: form.nomeSocial || null,
          nomeMae: form.nomeMae,
          email: form.email,
          role: "ALUNO" as Role,
          matricula: form.matricula || undefined,
          instituicaoId: selectedCurso.instituicaoId,
          cursoId: form.cursoId,
          telefone: form.telefone || null,
          celular: form.celular || null,
          genero: form.genero || null,
          racaCor: form.racaCor || null,
          possuiDeficiencia: form.possuiDeficiencia === "true" ? true : form.possuiDeficiencia === "false" ? false : null,
          cotista: form.cotista === "true" ? true : form.cotista === "false" ? false : null,
          bolsista: form.bolsista === "true" ? true : form.bolsista === "false" ? false : null,
          tipoBolsa: form.tipoBolsa || null,
        });
      } else {
        await api.post("/admin/usuarios", {
          nome: form.nome,
          nomeSocial: form.nomeSocial || undefined,
          nomeMae: form.nomeMae,
          email: form.email,
          cpf: form.cpf,
          senha: form.senha || undefined,
          role: "ALUNO" as Role,
          matricula: form.matricula || undefined,
          dataNascimento: form.dataNascimento,
          instituicaoId: selectedCurso.instituicaoId,
          cursoId: form.cursoId,
          telefone: form.telefone || undefined,
          celular: form.celular || undefined,
          genero: form.genero || null,
          racaCor: form.racaCor || null,
          possuiDeficiencia: form.possuiDeficiencia === "true" ? true : form.possuiDeficiencia === "false" ? false : null,
          cotista: form.cotista === "true" ? true : form.cotista === "false" ? false : null,
          bolsista: form.bolsista === "true" ? true : form.bolsista === "false" ? false : null,
          tipoBolsa: form.tipoBolsa || null,
        });
      }
      setModalAberto(false);
      carregarAlunos();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown; status?: number }; message?: string };
      const rawData = axiosErr?.response?.data;
      let msg = "Erro ao salvar aluno.";
      if (rawData && typeof rawData === "object") {
        const d = rawData as { message?: string | Record<string, string[]>; error?: string };
        if (d.message) {
          if (typeof d.message === "string") {
            msg = d.message;
          } else {
            msg = Object.entries(d.message)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
              .join("; ");
          }
        } else if (d.error) {
          msg = d.error;
        }
      } else if (typeof rawData === "string") {
        msg = rawData;
      } else if (axiosErr?.message) {
        msg = axiosErr.message;
      }
      setErroForm(msg);
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
      carregarAlunos();
    } catch (err: unknown) {
      const rawData = (err as { response?: { data?: unknown } })?.response?.data;
      let msg = "Erro ao excluir aluno.";
      if (rawData && typeof rawData === "object") {
        const d = rawData as { message?: string | Record<string, string[]>; error?: string };
        if (d.message) {
          msg = typeof d.message === "string" ? d.message : Object.entries(d.message).map(([f, e]) => `${f}: ${Array.isArray(e) ? e.join(", ") : e}`).join("; ");
        } else if (d.error) {
          msg = d.error;
        }
      }
      setErroForm(msg);
    } finally {
      setDeletando(false);
    }
  };

  const getCursoNome = (a: AlunoItem) => {
    if (typeof a.curso === "object") return a.curso?.nome || "-";
    return a.curso || "-";
  };

  const getInstituicaoNome = (a: AlunoItem) => {
    if (typeof a.instituicao === "object") return a.instituicao?.sigla || a.instituicao?.nome || "-";
    return a.instituicao || "-";
  };

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
            Alunos
          </h1>
          <p className="text-[#9895a4] mt-1">Gerenciamento de alunos sob sua coordenação</p>
        </div>
        <Button
          onClick={abrirNovo}
          style={{ backgroundColor: "#4CAF50", color: "#fff" }}
          className="gap-2 cursor-pointer"
          disabled={cursos.length === 0}
        >
          <Plus size={16} />
          Novo Aluno
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por nome, email ou matricula..."
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPagina(1);
          }}
          className="flex-1 min-w-[200px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
        />
        {cursos.length > 1 && (
          <select
            value={filtroCurso}
            onChange={(e) => {
              setFiltroCurso(e.target.value);
              setPagina(1);
            }}
            className="h-10 px-3 rounded-lg bg-[#12121a] border border-[#2a2a3a] text-[#f0ece4] text-base cursor-pointer"
          >
            <option value="">Todos os cursos</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        )}
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#b0adc0]">Nenhum aluno encontrado.</p>
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
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Matrícula</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Curso</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Instituição</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginados.map((aluno) => (
                    <tr key={aluno.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                      <td className="py-4 px-5 text-[#f0ece4] font-medium">{aluno.nome}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{aluno.email}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{aluno.matricula || "-"}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{getCursoNome(aluno)}</td>
                      <td className="py-4 px-5 text-[#9895a4]">{getInstituicaoNome(aluno)}</td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => abrirDetalhes(aluno)}
                            className="text-[#9895a4] hover:text-[#3AAFE0] transition-colors p-1 cursor-pointer disabled:opacity-50"
                            title="Detalhes"
                            disabled={loadingDetalhes}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => abrirEditar(aluno)}
                            className="text-[#9895a4] hover:text-[#4CAF50] transition-colors p-1 cursor-pointer"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(aluno)}
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
        titulo="Detalhes do Aluno"
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
                value: "Aluno",
                tone: "blue",
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
                    { label: "Nome da Mãe", value: detailTarget.nomeMae || "", emptyText: "Não informado" },
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
                      value: getInstituicaoNome(detailTarget),
                    },
                    {
                      label: "Curso",
                      value: getCursoNome(detailTarget),
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
        titulo={editandoId ? "Editar Aluno" : "Novo Aluno"}
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
          <div className="mt-4">
            <Label className="text-[#f0ece4]">Nome da Mãe *</Label>
            <Input
              value={form.nomeMae}
              onChange={(e) => setForm({ ...form, nomeMae: e.target.value })}
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
              placeholder="Nome completo da mãe"
            />
          </div>

          {!editandoId && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#f0ece4]">CPF *</Label>
                <Input
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: maskCPF(e.target.value) })}
                  className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                  placeholder="000.000.000-00"
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
              <Label className="text-[#f0ece4]">Curso *</Label>
              <select
                value={form.cursoId}
                onChange={(e) => setForm({ ...form, cursoId: e.target.value })}
                className={selectClasses}
              >
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
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
                onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
                className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Label className="text-[#f0ece4]">Celular</Label>
              <Input
                value={form.celular}
                onChange={(e) => setForm({ ...form, celular: maskPhone(e.target.value) })}
                className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                placeholder="(00) 00000-0000"
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
              {salvando ? "Salvando..." : editandoId ? "Atualizar" : "Criar Aluno"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        aberto={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmarDelete}
        titulo="Excluir Aluno"
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

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { buscarCep } from "@/lib/cep";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import { DetailPanel, INSTITUICAO_STATUS, InlineList } from "@/components/ui/detail-panel";
import type { Instituicao, Localizacao, AreaAssentamento, EsferaAdministrativa, StatusInstituicao, TipoInstituicao } from "@/types";

interface InstituicaoForm {
  nome: string;
  sigla: string;
  codigoInep: string;
  uf: string;
  cep: string;
  municipio: string;
  complemento: string;
  pontoReferencia: string;
  localizacao: string;
  areaAssentamento: string;
  esferaAdministrativa: string;
  telefone: string;
  email: string;
  status: string;
  tipo: string;
}

const FORM_VAZIO: InstituicaoForm = {
  nome: "", sigla: "", codigoInep: "", uf: "",
  cep: "", municipio: "", complemento: "", pontoReferencia: "",
  localizacao: "", areaAssentamento: "", esferaAdministrativa: "",
  telefone: "", email: "", status: "ATIVA", tipo: "",
};

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const selectClasses = "w-full h-10 rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]";

export default function AdminInstituicoesPage() {
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Instituicao | null>(null);
  const [form, setForm] = useState<InstituicaoForm>(FORM_VAZIO);
  const [erro, setErro] = useState("");

  const [detailTarget, setDetailTarget] = useState<Instituicao | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<Instituicao | null>(null);

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
    i.sigla.toLowerCase().includes(filtro.toLowerCase()) ||
    i.codigoInep?.toLowerCase().includes(filtro.toLowerCase()) ||
    i.municipio?.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    const data = await buscarCep(cep);
    if (data) {
      setForm((f) => ({
        ...f,
        uf: f.uf || data.uf,
        municipio: f.municipio || data.localidade,
        complemento: f.complemento || data.complemento,
      }));
    }
  };

  const validar = (dados: InstituicaoForm) => {
    if (dados.nome.length < 2) return "Nome deve ter no mínimo 2 caracteres";
    if (dados.sigla.length < 2 || dados.sigla.length > 10) return "Sigla deve ter entre 2 e 10 caracteres";
    if (dados.codigoInep.length < 8) return "Código INEP deve ter no mínimo 8 caracteres";
    if (!dados.uf) return "UF é obrigatória";
    if (dados.localizacao && !["URBANA", "RURAL"].includes(dados.localizacao)) return "Localização inválida";
    if (dados.esferaAdministrativa && !["FEDERAL", "ESTADUAL", "MUNICIPAL", "INSTITUTO_FEDERAL", "PRIVADA"].includes(dados.esferaAdministrativa)) return "Esfera administrativa inválida";
    return "";
  };

  const abrirCriar = () => {
    setEditando(null);
    setForm(FORM_VAZIO);
    setErro("");
    setModalAberto(true);
  };

  const abrirEditar = (item: Instituicao) => {
    setEditando(item);
    setForm({
      nome: item.nome,
      sigla: item.sigla,
      codigoInep: item.codigoInep || "",
      uf: item.uf || "",
      cep: item.cep || "",
      municipio: item.municipio || "",
      complemento: item.complemento || "",
      pontoReferencia: item.pontoReferencia || "",
      localizacao: item.localizacao || "",
      areaAssentamento: item.areaAssentamento || "",
      esferaAdministrativa: item.esferaAdministrativa || "",
      telefone: item.telefone || "",
      email: item.email || "",
      status: item.status || "ATIVA",
      tipo: item.tipo || "",
    });
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

  const statusLabel = (s?: string | null) => {
    if (s === "ATIVA") return "Ativa";
    if (s === "INATIVA") return "Inativa";
    return "-";
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
          placeholder="Buscar por nome, sigla, INEP ou município..."
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
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Nome</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Sigla</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">INEP</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">UF</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Município</th>
                    <th className="text-left py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Esfera</th>
                    <th className="text-center py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Status</th>
                    <th className="text-right py-4 px-5 text-[#b0adc0] font-semibold text-sm uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#b0adc0]">
                        Nenhuma instituição encontrada
                      </td>
                    </tr>
                  ) : (
                    paginados.map((inst) => (
                      <tr key={inst.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#1a1a26] transition-colors">
                        <td className="py-4 px-5 text-[#f0ece4] font-medium">{inst.nome}</td>
                        <td className="py-4 px-5 text-[#9895a4]">{inst.sigla}</td>
                        <td className="py-4 px-5 text-[#9895a4] font-mono text-sm">{inst.codigoInep || "-"}</td>
                        <td className="py-4 px-5 text-[#9895a4]">{inst.uf || "-"}</td>
                        <td className="py-4 px-5 text-[#9895a4]">{inst.municipio || "-"}</td>
                        <td className="py-4 px-5 text-[#9895a4]">{inst.esferaAdministrativa ? traduzirEsfera(inst.esferaAdministrativa) : "-"}</td>
                        <td className="py-4 px-5 text-center">
                          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                            inst.status === "ATIVA" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                          }`}>
                            {statusLabel(inst.status)}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setDetailTarget(inst)}
                              className="p-1.5 text-[#9895a4] hover:text-[#3AAFE0] transition-colors"
                              title="Detalhes"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => abrirEditar(inst)}
                              className="p-1.5 text-[#9895a4] hover:text-[#E8B829] transition-colors"
                              title="Editar"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(inst)}
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
          </div>

          {totalPaginas > 1 && (
            <Pagination pagina={pagina} totalPaginas={totalPaginas} onPageChange={setPagina} />
          )}
        </>
      )}

      {/* Detail Panel — unified */}
      <DetailPanel
        aberto={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        titulo="Detalhes da Instituição"
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
                label: "Status",
                value:
                  INSTITUICAO_STATUS[detailTarget.status ?? "ATIVA"]?.label ??
                  statusLabel(detailTarget.status),
                tone: INSTITUICAO_STATUS[detailTarget.status ?? "ATIVA"]?.tone ?? "neutral",
                hint: `${detailTarget.cursos?.length ?? 0} curso(s) vinculado(s)`,
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
                    { label: "Sigla", value: detailTarget.sigla },
                    { label: "Código INEP", value: detailTarget.codigoInep },
                    {
                      label: "Tipo",
                      value: detailTarget.tipo ? traduzirTipo(detailTarget.tipo) : "",
                      emptyText: "Não informado",
                    },
                  ],
                },
                {
                  title: "Localização",
                  fields: [
                    { label: "UF", value: detailTarget.uf },
                    {
                      label: "Município",
                      value: detailTarget.municipio || "",
                      emptyText: "Não informado",
                    },
                    {
                      label: "CEP",
                      value: detailTarget.cep || "",
                      emptyText: "Não informado",
                    },
                    {
                      label: "Complemento",
                      value: detailTarget.complemento || "",
                      emptyText: "Não informado",
                    },
                    {
                      label: "Ponto de Referência",
                      value: detailTarget.pontoReferencia || "",
                      emptyText: "Não informado",
                    },
                    {
                      label: "Localização",
                      value: detailTarget.localizacao
                        ? traduzirLocalizacao(detailTarget.localizacao)
                        : "",
                      emptyText: "Não informada",
                    },
                    {
                      label: "Área de Assentamento",
                      value: detailTarget.areaAssentamento
                        ? traduzirAreaAssentamento(detailTarget.areaAssentamento)
                        : "",
                      emptyText: "Não informada",
                      full: true,
                    },
                  ],
                },
                {
                  title: "Administrativo",
                  fields: [
                    {
                      label: "Esfera Administrativa",
                      value: detailTarget.esferaAdministrativa
                        ? traduzirEsfera(detailTarget.esferaAdministrativa)
                        : "",
                      emptyText: "Não informada",
                    },
                    {
                      label: "Telefone",
                      value: detailTarget.telefone || "",
                      emptyText: "Não informado",
                    },
                    {
                      label: "Email",
                      value: detailTarget.email || "",
                      emptyText: "Não informado",
                      full: true,
                    },
                  ],
                },
                {
                  title: "Cursos Vinculados",
                  children: (
                    <InlineList
                      items={(detailTarget.cursos ?? []).map((c) => ({ id: c.id, label: c.nome }))}
                      empty="Nenhum curso vinculado a esta instituição."
                    />
                  ),
                  fields: [],
                },
              ]
            : []
        }
      />

      {/* Create/Edit Modal */}
      <Modal aberto={modalAberto} onClose={() => setModalAberto(false)} titulo={editando ? "Editar Instituição" : "Nova Instituição"} tamanho="lg">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {erro && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{erro}</p>
          )}

          <SectionTitle title="Identificação" />
          <div className="space-y-2">
            <Label className="text-[#b0adc0] text-sm">Nome da Instituição *</Label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: Universidade Federal..."
              className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Sigla *</Label>
              <Input
                value={form.sigla}
                onChange={(e) => setForm({ ...form, sigla: e.target.value.toUpperCase() })}
                placeholder="Ex: UFABC"
                maxLength={10}
                className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Código INEP *</Label>
              <Input
                value={form.codigoInep}
                onChange={(e) => setForm({ ...form, codigoInep: e.target.value.replace(/\D/g, "") })}
                placeholder="00000000"
                className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
              />
            </div>
          </div>

          <SectionTitle title="Localização" />
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">CEP</Label>
              <Input
                value={form.cep}
                onChange={(e) => setForm({ ...form, cep: e.target.value.replace(/\D/g, "").slice(0, 8) })}
                onBlur={handleCepBlur}
                placeholder="00000000"
                className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">UF *</Label>
              <select
                value={form.uf}
                onChange={(e) => setForm({ ...form, uf: e.target.value })}
                className={selectClasses}
              >
                <option value="">Selecione</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Município</Label>
              <Input
                value={form.municipio}
                onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                placeholder="Município"
                className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Complemento</Label>
              <Input
                value={form.complemento}
                onChange={(e) => setForm({ ...form, complemento: e.target.value })}
                placeholder="Complemento"
                className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Ponto de Referência</Label>
              <Input
                value={form.pontoReferencia}
                onChange={(e) => setForm({ ...form, pontoReferencia: e.target.value })}
                placeholder="Ponto de referência"
                className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Localização</Label>
              <select
                value={form.localizacao}
                onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
                className={selectClasses}
              >
                <option value="">Selecione</option>
                <option value="URBANA">Urbana</option>
                <option value="RURAL">Rural</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Área de Assentamento</Label>
              <select
                value={form.areaAssentamento}
                onChange={(e) => setForm({ ...form, areaAssentamento: e.target.value })}
                className={selectClasses}
              >
                <option value="">Selecione</option>
                <option value="NAO_DIFERENCIADA">Não Diferenciada</option>
                <option value="AREA_ASSENTAMENTO">Área de Assentamento</option>
                <option value="TERRA_INDIGENA">Terra Indígena</option>
                <option value="AREA_REMANESCENTE_QUILOMBO">Área Remanescente de Quilombo</option>
                <option value="UNIDADE_USO_SUSTENTAVEL">Unidade de Uso Sustentável</option>
              </select>
            </div>
          </div>

          <SectionTitle title="Detalhes" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Esfera Administrativa</Label>
              <select
                value={form.esferaAdministrativa}
                onChange={(e) => setForm({ ...form, esferaAdministrativa: e.target.value })}
                className={selectClasses}
              >
                <option value="">Selecione</option>
                <option value="FEDERAL">Federal</option>
                <option value="ESTADUAL">Estadual</option>
                <option value="MUNICIPAL">Municipal</option>
                <option value="INSTITUTO_FEDERAL">Instituto Federal</option>
                <option value="PRIVADA">Privada</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Telefone</Label>
              <Input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(00) 0000-0000"
                className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[#b0adc0] text-sm">Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@instituicao.edu.br"
              type="email"
              className="border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4]"
            />
          </div>

          <SectionTitle title="Status" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={selectClasses}
              >
                <option value="ATIVA">Ativa</option>
                <option value="INATIVA">Inativa</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#b0adc0] text-sm">Tipo</Label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className={selectClasses}
              >
                <option value="">Selecione</option>
                <option value="PERMANENTE">Permanente</option>
                <option value="TEMPORARIA">Temporária</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#2a2a3a]">
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

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-[#E8B829] font-medium uppercase tracking-wider">{title}</p>
      <div className="h-px bg-[#2a2a3a]" />
    </div>
  );
}

function traduzirEsfera(esfera: string): string {
  const map: Record<string, string> = {
    FEDERAL: "Federal", ESTADUAL: "Estadual", MUNICIPAL: "Municipal",
    INSTITUTO_FEDERAL: "Instituto Federal", PRIVADA: "Privada",
  };
  return map[esfera] || esfera;
}

function traduzirLocalizacao(loc: string): string {
  return loc === "URBANA" ? "Urbana" : "Rural";
}

function traduzirAreaAssentamento(area: string): string {
  const map: Record<string, string> = {
    NAO_DIFERENCIADA: "Não Diferenciada",
    AREA_ASSENTAMENTO: "Área de Assentamento",
    TERRA_INDIGENA: "Terra Indígena",
    AREA_REMANESCENTE_QUILOMBO: "Área Remanescente de Quilombo",
    UNIDADE_USO_SUSTENTAVEL: "Unidade de Uso Sustentável",
  };
  return map[area] || area;
}

function traduzirTipo(tipo: string): string {
  return tipo === "PERMANENTE" ? "Permanente" : "Temporária";
}

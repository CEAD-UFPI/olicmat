"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";

interface QuestaoNested {
  id: string;
  enunciado: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaE: string;
  correta: string;
  eixo: string;
  dificuldade: string;
}

interface ProvaQuestaoItem {
  id: string;
  questao: QuestaoNested;
  ordem: number;
}

interface ProvaData {
  id: string;
  titulo?: string;
  edicaoId?: string;
  edicao?: { id: string; ano: number; titulo: string };
  duracaoMinutos?: number;
  status?: string;
  questoes?: ProvaQuestaoItem[];
}

interface QuestaoForm {
  enunciado: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaE: string;
  correta: string;
  eixo: string;
  dificuldade: string;
}

const FORM_VAZIO: QuestaoForm = {
  enunciado: "",
  alternativaA: "",
  alternativaB: "",
  alternativaC: "",
  alternativaD: "",
  alternativaE: "",
  correta: "A",
  eixo: "ALGEBRA",
  dificuldade: "MEDIO",
};

const EIXOS = ["ALGEBRA", "GEOMETRIA", "ANALISE", "ESTATISTICA", "DIDATICA"];
const DIFICULDADES = ["FACIL", "MEDIO", "DIFICIL"];
const CORRETAS = ["A", "B", "C", "D", "E"];

export default function ProvaDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prova, setProva] = useState<ProvaData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [titulo, setTitulo] = useState("");
  const [duracao, setDuracao] = useState(0);
  const [salvando, setSalvando] = useState(false);

  // Questão modal
  const [modalQuestao, setModalQuestao] = useState(false);
  const [editandoQuestaoId, setEditandoQuestaoId] = useState<string | null>(null);
  const [formQuestao, setFormQuestao] = useState<QuestaoForm>(FORM_VAZIO);
  const [erroQuestao, setErroQuestao] = useState("");
  const [salvandoQuestao, setSalvandoQuestao] = useState(false);

  // Delete questão
  const [deleteQuestaoTarget, setDeleteQuestaoTarget] = useState<ProvaQuestaoItem | null>(null);
  const [deletandoQuestao, setDeletandoQuestao] = useState(false);

  const carregarProva = () => {
    if (id === "nova") {
      setProva({
        id: "nova",
        titulo: "",
        duracaoMinutos: 180,
        status: "RASCUNHO",
        questoes: [],
      });
      setTitulo("");
      setDuracao(180);
      setCarregando(false);
      return;
    }

    api
      .get(`/admin/provas/${id}`)
      .then(({ data }) => {
        setProva(data);
        setTitulo(data.titulo || "");
        setDuracao(data.duracaoMinutos || 0);
      })
      .catch(() => setErro("Prova não encontrada."))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregarProva();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const salvar = async () => {
    setSalvando(true);
    setErro("");
    try {
      const payload = { titulo, duracaoMinutos: duracao };
      if (id === "nova") {
        const { data } = await api.post("/admin/provas", payload);
        router.push(`/avaliador/provas/${data.id}`);
      } else {
        await api.patch(`/admin/provas/${id}`, payload);
        setProva((prev) =>
          prev ? { ...prev, titulo, duracaoMinutos: duracao } : prev
        );
      }
    } catch {
      setErro("Erro ao salvar prova.");
    } finally {
      setSalvando(false);
    }
  };

  const abrirNovaQuestao = () => {
    setEditandoQuestaoId(null);
    setFormQuestao(FORM_VAZIO);
    setErroQuestao("");
    setModalQuestao(true);
  };

  const abrirEditarQuestao = (pq: ProvaQuestaoItem) => {
    setEditandoQuestaoId(pq.questao.id);
    setFormQuestao({
      enunciado: pq.questao.enunciado,
      alternativaA: pq.questao.alternativaA,
      alternativaB: pq.questao.alternativaB,
      alternativaC: pq.questao.alternativaC,
      alternativaD: pq.questao.alternativaD,
      alternativaE: pq.questao.alternativaE,
      correta: pq.questao.correta,
      eixo: pq.questao.eixo,
      dificuldade: pq.questao.dificuldade,
    });
    setErroQuestao("");
    setModalQuestao(true);
  };

  const salvarQuestao = async () => {
    setErroQuestao("");
    if (!formQuestao.enunciado.trim()) {
      setErroQuestao("Enunciado é obrigatório.");
      return;
    }

    setSalvandoQuestao(true);
    try {
      if (editandoQuestaoId) {
        await api.patch(`/admin/questoes/${editandoQuestaoId}`, formQuestao);
      } else {
        await api.post(`/admin/provas/${id}/questoes`, formQuestao);
      }
      setModalQuestao(false);
      if (id !== "nova") carregarProva();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Erro ao salvar questão.";
      setErroQuestao(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSalvandoQuestao(false);
    }
  };

  const confirmarDeleteQuestao = async () => {
    if (!deleteQuestaoTarget) return;
    setDeletandoQuestao(true);
    try {
      await api.delete(`/admin/questoes/${deleteQuestaoTarget.questao.id}`);
      setDeleteQuestaoTarget(null);
      carregarProva();
    } catch {
      // silently fail
    } finally {
      setDeletandoQuestao(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (erro && !prova) {
    return (
      <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
        <p className="text-[#9895a4]">{erro}</p>
      </div>
    );
  }

  if (!prova) return null;

  const isDraft = prova.status === "RASCUNHO" || id === "nova";

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/avaliador/provas")}
          className="text-[#9895a4] hover:text-[#f0ece4] cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            {id === "nova" ? "Nova Prova" : prova.titulo || "Prova"}
          </h1>
          <p className="text-[#9895a4] text-sm mt-1">
            {isDraft ? "Edite os dados e as questões da prova" : "Visualização da prova"}
          </p>
        </div>
      </div>

      <Card className="border-[#2a2a3a] bg-[#12121a]">
        <CardHeader>
          <CardTitle className="text-[#f0ece4]">Informações da Prova</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="titulo" className="text-[#f0ece4]">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={!isDraft}
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
            />
          </div>
          <div>
            <Label htmlFor="duracao" className="text-[#f0ece4]">Duração (minutos)</Label>
            <Input
              id="duracao"
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(Number(e.target.value))}
              disabled={!isDraft}
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] max-w-[200px]"
            />
          </div>

          {isDraft && (
            <div>
              {erro && <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3 mb-3">{erro}</p>}
              <Button
                onClick={salvar}
                disabled={salvando}
                style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                className="cursor-pointer"
              >
                {salvando ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#2a2a3a] bg-[#12121a]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#f0ece4]">Questões</CardTitle>
          {isDraft && id !== "nova" && (
            <Button
              size="sm"
              variant="outline"
              onClick={abrirNovaQuestao}
              className="border-[#2a2a3a] text-[#f0ece4] gap-2 cursor-pointer"
            >
              <Plus size={14} />
              Adicionar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!prova.questoes || prova.questoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#9895a4] text-sm">Nenhuma questão cadastrada.</p>
              {isDraft && id !== "nova" && (
                <p className="text-xs text-[#9895a4] mt-1">
                  Clique em Adicionar para incluir questões.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {prova.questoes.map((pq, i) => (
                <div
                  key={pq.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a]"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs text-[#9895a4] w-6 text-center font-mono flex-shrink-0">
                      {pq.ordem ?? i + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm text-[#f0ece4] truncate block max-w-md">
                        {pq.questao.enunciado}
                      </span>
                      <span className="text-xs text-[#9895a4]">
                        {pq.questao.eixo} · {pq.questao.dificuldade} · Gabarito: {pq.questao.correta}
                      </span>
                    </div>
                  </div>
                  {isDraft && (
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button
                        onClick={() => abrirEditarQuestao(pq)}
                        className="text-[#9895a4] hover:text-[#4CAF50] transition-colors p-1 cursor-pointer"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteQuestaoTarget(pq)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Questão */}
      <Modal
        aberto={modalQuestao}
        onClose={() => setModalQuestao(false)}
        titulo={editandoQuestaoId ? "Editar Questão" : "Nova Questão"}
        tamanho="xl"
      >
        <div className="space-y-4">
          <div>
            <Label className="text-[#f0ece4]">Enunciado *</Label>
            <textarea
              value={formQuestao.enunciado}
              onChange={(e) => setFormQuestao({ ...formQuestao, enunciado: e.target.value })}
              rows={3}
              className="mt-1.5 w-full rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm px-3 py-2 outline-none focus:border-[#4CAF50] transition-colors resize-vertical"
              placeholder="Enunciado da questão..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["A", "B", "C", "D", "E"].map((letra) => (
              <div key={letra}>
                <Label className="text-[#f0ece4]">Alternativa {letra}</Label>
                <Input
                  value={formQuestao[`alternativa${letra}` as keyof QuestaoForm] as string}
                  onChange={(e) => setFormQuestao({ ...formQuestao, [`alternativa${letra}`]: e.target.value })}
                  className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]"
                  placeholder={`Alternativa ${letra}`}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-[#f0ece4]">Gabarito</Label>
              <select
                value={formQuestao.correta}
                onChange={(e) => setFormQuestao({ ...formQuestao, correta: e.target.value })}
                className="mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm cursor-pointer"
              >
                {CORRETAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-[#f0ece4]">Eixo</Label>
              <select
                value={formQuestao.eixo}
                onChange={(e) => setFormQuestao({ ...formQuestao, eixo: e.target.value })}
                className="mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm cursor-pointer"
              >
                {EIXOS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-[#f0ece4]">Dificuldade</Label>
              <select
                value={formQuestao.dificuldade}
                onChange={(e) => setFormQuestao({ ...formQuestao, dificuldade: e.target.value })}
                className="mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm cursor-pointer"
              >
                {DIFICULDADES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {erroQuestao && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{erroQuestao}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setModalQuestao(false)}
              disabled={salvandoQuestao}
              className="text-[#9895a4] hover:text-[#f0ece4] cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={salvarQuestao}
              disabled={salvandoQuestao}
              style={{ backgroundColor: "#4CAF50", color: "#fff" }}
              className="cursor-pointer"
            >
              {salvandoQuestao ? "Salvando..." : editandoQuestaoId ? "Atualizar" : "Adicionar Questão"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ConfirmDialog Excluir Questão */}
      <ConfirmDialog
        aberto={!!deleteQuestaoTarget}
        onClose={() => setDeleteQuestaoTarget(null)}
        onConfirm={confirmarDeleteQuestao}
        titulo="Remover Questão"
        mensagem="Tem certeza que deseja remover esta questão da prova? A questão também será excluída do banco."
        confirmando={deletandoQuestao}
      />
    </motion.div>
  );
}

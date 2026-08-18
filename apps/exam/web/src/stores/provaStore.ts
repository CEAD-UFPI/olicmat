import { create } from "zustand";
import api from "@/lib/api";

export interface Questao {
  id: string;
  enunciado: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaE: string;
  eixo: string;
  dificuldade: string;
  respondida?: string | null;
}

interface ProvaState {
  inscricaoId: string | null;
  questoes: Questao[];
  questaoAtual: number;
  inicio: string | null;
  fim: string | null;
  carregando: boolean;
  finalizada: boolean;
  nota: number | null;
  salvando: boolean;
  erro: string | null;
  limparErro: () => void;
  carregarProva: () => Promise<void>;
  responder: (questaoId: string, alternativa: string) => Promise<void>;
  proximaQuestao: () => void;
  questaoAnterior: () => void;
  irParaQuestao: (index: number) => void;
  finalizar: () => Promise<void>;
}

export const useProvaStore = create<ProvaState>((set, get) => ({
  inscricaoId: null,
  questoes: [],
  questaoAtual: 0,
  inicio: null,
  fim: null,
  carregando: false,
  finalizada: false,
  nota: null,
  salvando: false,
  erro: null,

  limparErro: () => set({ erro: null }),

  carregarProva: async () => {
    set({ carregando: true, erro: null });
    try {
      // Ensure exam is initiated
      await api.post("/prova/iniciar").catch(() => {});

      const { data } = await api.get("/prova/questoes");
      set({
        inscricaoId: data.inscricaoId,
        questoes: data.questoes,
        inicio: data.inicio,
        fim: data.fim,
        carregando: false,
      });
    } catch (err: any) {
      if (err?.response?.data?.message === "Tempo de prova esgotado ou já finalizada") {
        const resumo = await api.get("/prova/resumo").then((res) => res.data).catch(() => null);
        set({
          finalizada: true,
          nota: resumo?.fase1Nota ?? null,
          carregando: false,
        });
        return;
      }
      set({
        erro: err?.response?.data?.message || "Erro ao carregar prova",
        carregando: false,
      });
      throw err;
    }
  },

  responder: async (questaoId: string, alternativa: string) => {
    set({ salvando: true, erro: null });
    try {
      await api.post("/prova/responder", { questaoId, alternativa });
      set((state) => ({
        salvando: false,
        questoes: state.questoes.map((q) =>
          q.id === questaoId ? { ...q, respondida: alternativa } : q
        ),
      }));
    } catch (err: any) {
      set({
        salvando: false,
        erro: err?.response?.data?.message || "Erro ao salvar resposta",
      });
      throw err;
    }
  },

  proximaQuestao: () => {
    const { questaoAtual, questoes } = get();
    if (questaoAtual < questoes.length - 1) {
      set({ questaoAtual: questaoAtual + 1 });
    }
  },

  questaoAnterior: () => {
    const { questaoAtual } = get();
    if (questaoAtual > 0) {
      set({ questaoAtual: questaoAtual - 1 });
    }
  },

  irParaQuestao: (index: number) => {
    const { questoes } = get();
    if (index >= 0 && index < questoes.length) {
      set({ questaoAtual: index });
    }
  },

  finalizar: async () => {
    set({ salvando: true, erro: null });
    try {
      const { data } = await api.post("/prova/finalizar");
      set({
        finalizada: true,
        nota: data.fase1Nota,
        salvando: false,
      });
    } catch (err: any) {
      set({
        salvando: false,
        erro: err?.response?.data?.message || "Erro ao finalizar prova",
      });
    }
  },
}));

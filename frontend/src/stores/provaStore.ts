import { create } from "zustand";
import api from "@/lib/api";
import type { Questao } from "@/types";

interface QuestaoProva extends Questao {
  respondida?: string | null;
}

interface ProvaState {
  questoes: QuestaoProva[];
  questaoAtual: number;
  inscricaoId: string | null;
  inicio: string | null;
  fim: string | null;
  carregando: boolean;
  finalizada: boolean;
  nota: number | null;
  salvando: boolean;
  erro: string | null;
  carregarProva: () => Promise<void>;
  responder: (questaoId: string, alternativa: string) => Promise<void>;
  proximaQuestao: () => void;
  questaoAnterior: () => void;
  irParaQuestao: (index: number) => void;
  finalizar: () => Promise<void>;
  limparErro: () => void;
}

export const useProvaStore = create<ProvaState>((set, get) => ({
  questoes: [],
  questaoAtual: 0,
  inscricaoId: null,
  inicio: null,
  fim: null,
  carregando: false,
  finalizada: false,
  nota: null,
  salvando: false,
  erro: null,

  limparErro: () => set({ erro: null }),

  carregarProva: async () => {
    set({ carregando: true });
    const { data } = await api.get("/prova/questoes");
    set({
      questoes: data.questoes,
      inscricaoId: data.inscricaoId,
      inicio: data.inicio,
      fim: data.fim,
      carregando: false,
    });
  },

  responder: async (questaoId, alternativa) => {
    set({ salvando: true, erro: null });
    try {
      await api.post("/prova/responder", { questaoId, alternativa });
      set((state) => ({
        questoes: state.questoes.map((q) =>
          q.id === questaoId ? { ...q, respondida: alternativa } : q
        ),
        salvando: false,
      }));
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao salvar resposta. Tente novamente.";
      set({ erro: msg, salvando: false });
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

  irParaQuestao: (index) => set({ questaoAtual: index }),

  finalizar: async () => {
    const { data } = await api.post("/prova/finalizar");
    set({ finalizada: true, nota: data.fase1Nota });
  },
}));

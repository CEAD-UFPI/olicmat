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
  /** servidor - navegador, em ms: o cronômetro não confia no relógio local. */
  offsetRelogio: number;
  advertencias: number;
  outroAparelho: boolean;
  carregando: boolean;
  finalizada: boolean;
  salvando: boolean;
  erro: string | null;
  limparErro: () => void;
  carregarProva: () => Promise<void>;
  responder: (questaoId: string, alternativa: string) => Promise<void>;
  proximaQuestao: () => void;
  questaoAnterior: () => void;
  irParaQuestao: (index: number) => void;
  sincronizar: () => Promise<void>;
  registrarAdvertencia: () => Promise<boolean>;
  finalizar: (motivo?: "ALUNO" | "TEMPO" | "ADVERTENCIAS") => Promise<void>;
}

export const useProvaStore = create<ProvaState>((set, get) => ({
  inscricaoId: null,
  questoes: [],
  questaoAtual: 0,
  inicio: null,
  fim: null,
  offsetRelogio: 0,
  advertencias: 0,
  outroAparelho: false,
  carregando: false,
  finalizada: false,
  salvando: false,
  erro: null,

  limparErro: () => set({ erro: null }),

  carregarProva: async () => {
    set({ carregando: true, erro: null });
    // O motivo real da recusa (prazo, janela) vem daqui; a busca das questões
    // diria apenas que a prova não foi iniciada.
    let erroIniciar: string | null = null;
    try {
      await api.post("/prova/iniciar").catch((err) => {
        erroIniciar = err?.response?.data?.message ?? null;
      });

      const { data } = await api.get("/prova/questoes");
      set({
        inscricaoId: data.inscricaoId,
        questoes: data.questoes,
        inicio: data.inicio,
        fim: data.fim,
        offsetRelogio: new Date(data.agora).getTime() - Date.now(),
        advertencias: data.advertencias ?? 0,
        carregando: false,
      });
    } catch (err: any) {
      if (err?.response?.data?.message === "Tempo de prova esgotado ou já finalizada") {
        // Quem fechou o navegador e só voltou depois do tempo ainda não tem nota.
        await api.post("/prova/finalizar", { motivo: "TEMPO" }).catch(() => {});
        set({ finalizada: true, carregando: false });
        return;
      }
      const mensagem = err?.response?.data?.message;
      set({
        erro: (mensagem === "Prova não foi iniciada" && erroIniciar) || mensagem || "Erro ao carregar prova",
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

  sincronizar: async () => {
    try {
      const { data } = await api.get("/prova/estado");
      set({
        fim: data.fim,
        offsetRelogio: new Date(data.agora).getTime() - Date.now(),
        advertencias: data.advertencias ?? 0,
        outroAparelho: !!data.outroAparelho,
        finalizada: data.finalizada,
      });
    } catch {
      // Rede instável: a próxima rodada tenta de novo.
    }
  },

  registrarAdvertencia: async () => {
    try {
      const { data } = await api.post("/prova/advertencia");
      if (data.finalizada) set({ finalizada: true });
      return true;
    } catch {
      return false;
    }
  },

  finalizar: async (motivo = "ALUNO") => {
    set({ salvando: true, erro: null });
    try {
      // Às 11:00 todos finalizam juntos: no teste de carga a fila levou até 11s.
      await api.post("/prova/finalizar", { motivo }, { timeout: 60_000 });
      set({ finalizada: true, salvando: false });
    } catch (err: any) {
      set({
        salvando: false,
        erro: err?.response?.data?.message || "Erro ao finalizar prova",
      });
    }
  },
}));

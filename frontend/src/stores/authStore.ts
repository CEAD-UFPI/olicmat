import { create } from "zustand";
import api from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

interface RegisterData {
  nome: string;
  nomeSocial?: string;
  email: string;
  cpf: string;
  senha: string;
  instituicao: string;
  instituicaoId?: string;
  curso: string;
  matricula: string;
  dataNascimento: string;
  telefone: string;
  genero: string;
  racaCor: string;
  possuiDeficiencia?: boolean;
  cotista?: boolean;
  bolsista?: boolean;
  tipoBolsa?: string;
}

function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  // Set cookie accessible by server middleware (no HttpOnly so JS can read it too)
  // 7-day expiry, path=/, sameSite=lax for cross-origin safety during dev
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function clearTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
}

function storeToken(token: string) {
  localStorage.setItem("token", token);
  setTokenCookie(token);
}

function removeToken() {
  localStorage.removeItem("token");
  clearTokenCookie();
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, senha) => {
    const { data } = await api.post("/auth/login", { email, senha });
    storeToken(data.accessToken);
    set({ user: data.user, token: data.accessToken, isAuthenticated: true });
    return data.user;
  },

  register: async (registerData) => {
    const { data } = await api.post("/auth/registro", registerData);
    storeToken(data.accessToken);
    set({ user: data.user, token: data.accessToken, isAuthenticated: true });
  },

  logout: () => {
    removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    // Ensure cookie is synced (e.g., after page refresh the cookie may be gone)
    setTokenCookie(token);
    try {
      const { data } = await api.get("/users/me");
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      removeToken();
      set({ isLoading: false });
    }
  },
}));

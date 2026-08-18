import { create } from "zustand";

interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("olicmat_exam_user") || "null") : null,
  token: typeof window !== "undefined" ? localStorage.getItem("olicmat_exam_token") : null,
  setSession: (user, token) => {
    localStorage.setItem("olicmat_exam_user", JSON.stringify(user));
    localStorage.setItem("olicmat_exam_token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("olicmat_exam_user");
    localStorage.removeItem("olicmat_exam_token");
    set({ user: null, token: null });
  },
}));

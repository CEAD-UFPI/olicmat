import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // O 401 da própria tentativa de login não é sessão expirada: é senha
    // errada. Redirecionar aqui recarrega a página e apaga a mensagem de erro
    // antes de a pessoa conseguir lê-la — ela só vê a tela piscar.
    const ehTentativaDeLogin = (error.config?.url ?? "").includes("/auth/login");

    if (error.response?.status === 401 && !ehTentativaDeLogin) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Clear the token cookie too, so the server middleware (which gates on
        // the cookie) does not keep an authenticated-looking state after a 401.
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

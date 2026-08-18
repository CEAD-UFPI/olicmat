import axios from "axios";

const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://olicmat.cead.ufpi.br";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("olicmat_exam_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("olicmat_exam_token");
      localStorage.removeItem("olicmat_exam_user");
      window.location.href = `${MAIN_APP_URL}/competidor`;
    }
    return Promise.reject(error);
  }
);

export default api;

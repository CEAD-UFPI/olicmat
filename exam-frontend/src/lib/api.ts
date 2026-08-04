import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_EXAM_API_URL || "http://localhost:3334/api";

export const api = axios.create({
  baseURL: API_URL,
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
      window.location.href = "https://olicmat.cead.ufpi.br/competidor";
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

// Public API client for the landing/ranking module.
// No auth interceptor — every endpoint exposed here is public.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
  headers: { "Content-Type": "application/json" },
});

export default api;

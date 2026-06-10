"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface StatusEnvio {
  fase2Tema: string | null;
  fase2VideoUrl: string | null;
  fase2PortfolioUrl: string | null;
  fase2Nota: number | null;
}

export default function EnvioPage() {
  const [status, setStatus] = useState<StatusEnvio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [sorteando, setSorteando] = useState(false);
  const [uploading, setUploading] = useState<"video" | "portfolio" | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/envio/status")
      .then(({ data }) => setStatus(data))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  const sortearTema = async () => {
    setSorteando(true);
    try {
      const { data } = await api.post("/inscricoes/minha/sortear-tema");
      setStatus((prev) => prev ? { ...prev, fase2Tema: data.fase2Tema } : null);
      setMsg("Tema sorteado com sucesso!");
    } catch (err: unknown) {
      const msgErr = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg(typeof msgErr === "string" ? msgErr : "Erro ao sortear tema");
    } finally {
      setSorteando(false);
    }
  };

  const uploadFile = async (tipo: "video" | "portfolio", file: File) => {
    setUploading(tipo);
    setMsg("");
    const formData = new FormData();
    formData.append(tipo, file);

    try {
      const { data } = await api.post(`/envio/${tipo}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus((prev) =>
        prev
          ? { ...prev, [tipo === "video" ? "fase2VideoUrl" : "fase2PortfolioUrl"]: data[tipo === "video" ? "fase2VideoUrl" : "fase2PortfolioUrl"] }
          : null
      );
      setMsg(`${tipo === "video" ? "Vídeo" : "Portfólio"} enviado!`);
    } catch (err: unknown) {
      const msgErr = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg(typeof msgErr === "string" ? msgErr : "Erro no upload");
    } finally {
      setUploading(null);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#f48120] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Fase 2 — Videoaula e Portfólio
        </h1>
        <p className="text-[#9895a4] text-sm mt-1">
          Produza uma videoaula de 20 minutos e envie seu portfólio digital
        </p>
      </div>

      {/* Tema Gerador */}
      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            Tema Gerador
          </h2>
          {!status?.fase2Tema && (
            <Button
              size="sm"
              onClick={sortearTema}
              disabled={sorteando}
              style={{ backgroundColor: "var(--sigma-azul)", color: "#fff" }}
            >
              {sorteando ? "Sorteando..." : "Sortear tema"}
            </Button>
          )}
        </div>

        {status?.fase2Tema ? (
          <div
            className="p-4 rounded-xl border text-center"
            style={{
              backgroundColor: "var(--integral-verde)/10",
              borderColor: "var(--integral-verde)/30",
            } as React.CSSProperties}
          >
            <span className="text-xs text-[#2d9b6c] uppercase tracking-widest mb-1 block">Seu tema</span>
            <p className="text-xl font-bold font-[family-name:var(--font-fraunces)]" style={{ color: "var(--integral-verde)" }}>
              {status.fase2Tema}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[#9895a4]">Clique em &quot;Sortear tema&quot; para descobrir o tema da sua videoaula.</p>
        )}
      </div>

      {/* Upload Video */}
      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <h2 className="text-lg font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Videoaula (20 min)
        </h2>
        {status?.fase2VideoUrl ? (
          <p className="text-sm" style={{ color: "var(--integral-verde)" }}>
            Videoaula enviada
          </p>
        ) : (
          <div>
            <input
              type="file"
              accept="video/*"
              id="video-upload"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadFile("video", e.target.files[0])}
            />
            <label
              htmlFor="video-upload"
              className="flex items-center justify-center h-32 border-2 border-dashed border-[#2a2a3a] rounded-xl cursor-pointer hover:border-[#3a3a4a] transition-colors"
            >
              <span className="text-sm text-[#9895a4]">
                {uploading === "video" ? "Enviando..." : "Clique para selecionar o vídeo (MP4)"}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Upload Portfolio */}
      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <h2 className="text-lg font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Portfólio Digital (PDF)
        </h2>
        {status?.fase2PortfolioUrl ? (
          <p className="text-sm" style={{ color: "var(--integral-verde)" }}>
            Portfólio enviado
          </p>
        ) : (
          <div>
            <input
              type="file"
              accept=".pdf"
              id="portfolio-upload"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadFile("portfolio", e.target.files[0])}
            />
            <label
              htmlFor="portfolio-upload"
              className="flex items-center justify-center h-32 border-2 border-dashed border-[#2a2a3a] rounded-xl cursor-pointer hover:border-[#3a3a4a] transition-colors"
            >
              <span className="text-sm text-[#9895a4]">
                {uploading === "portfolio" ? "Enviando..." : "Clique para enviar o portfólio (PDF)"}
              </span>
            </label>
          </div>
        )}
      </div>

      {status?.fase2Nota != null && (
        <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] text-center">
          <p className="text-sm text-[#9895a4] mb-1">Nota da Fase 2</p>
          <p className="text-3xl font-bold font-[family-name:var(--font-fraunces)]" style={{ color: "var(--pi-laranja)" }}>
            {status.fase2Nota} pts
          </p>
        </div>
      )}

      {msg && (
        <motion.p
          className="text-sm p-3 rounded-lg text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: "var(--integral-verde)/10", color: "var(--integral-verde)" }}
        >
          {msg}
        </motion.p>
      )}
    </motion.div>
  );
}

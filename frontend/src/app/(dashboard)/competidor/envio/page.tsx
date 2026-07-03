"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon } from "lucide-react";

interface StatusEnvio {
  fase2Tema: string | null;
  enviosFase2: Array<{
    id: string;
    tipo: string;
    arquivoUrl: string;
    videoLink: string | null;
    status: string;
    enviadoEm: string;
  }>;
  avaliacoes: Array<{
    id: string;
    nota: number;
    parecer: string | null;
    avaliadoEm: string;
  }>;
}

export default function EnvioPage() {
  const [status, setStatus] = useState<StatusEnvio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [sorteando, setSorteando] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [enviandoLink, setEnviandoLink] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [msg, setMsg] = useState("");

  const carregarStatus = () => {
    api.get("/envio/status")
      .then(({ data }) => setStatus(data))
      .catch(() => {})
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregarStatus();
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

  const enviarLink = async () => {
    if (!videoLink.trim()) {
      setMsg("Informe o link do vídeo");
      return;
    }
    setEnviandoLink(true);
    setMsg("");
    try {
      await api.post("/envio/video-link", { videoLink: videoLink.trim() });
      setMsg("Link do vídeo enviado com sucesso!");
      carregarStatus();
    } catch (err: unknown) {
      const msgErr = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg(typeof msgErr === "string" ? msgErr : "Erro ao enviar link");
    } finally {
      setEnviandoLink(false);
    }
  };

  const uploadPortfolio = async (file: File) => {
    setUploadingPortfolio(true);
    setMsg("");
    const formData = new FormData();
    formData.append("portfolio", file);

    try {
      await api.post("/envio/portfolio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("Portfólio enviado!");
      carregarStatus();
    } catch (err: unknown) {
      const msgErr = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg(typeof msgErr === "string" ? msgErr : "Erro no upload");
    } finally {
      setUploadingPortfolio(false);
    }
  };

  const videoEnviado = status?.enviosFase2?.find((e) => e.tipo === "video");
  const portfolioEnviado = status?.enviosFase2?.find((e) => e.tipo === "portfolio");

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
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
          Fase 2 — Desafio Didático-Tecnológico
        </h1>
        <p className="text-[#9895a4] text-sm mt-1">
          Produza uma videoaula de até 20 minutos e envie o link e o portfólio digital
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
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderColor: "rgba(76, 175, 80, 0.3)",
            }}
          >
            <span className="text-xs text-[#4CAF50] uppercase tracking-widest mb-1 block">Seu tema</span>
            <p className="text-xl font-bold font-[family-name:var(--font-fraunces)]" style={{ color: "var(--integral-verde)" }}>
              {status.fase2Tema}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[#9895a4]">Clique em &quot;Sortear tema&quot; para descobrir o tema da sua videoaula.</p>
        )}
      </div>

      {/* Video Link */}
      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <h2 className="text-lg font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Link da Videoaula
        </h2>
        {videoEnviado && videoEnviado.status !== "PENDENTE" ? (
          <div>
            <p className="text-sm" style={{ color: "var(--integral-verde)" }}>
              Videoaula enviada
            </p>
            {videoEnviado.videoLink && (
              <a
                href={videoEnviado.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#3AAFE0] hover:underline mt-2 inline-flex items-center gap-1"
              >
                <LinkIcon size={14} />
                {videoEnviado.videoLink}
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#9895a4]">
              Após produzir sua videoaula, publique-a em uma plataforma (YouTube, Vimeo, Google Drive, etc.) e cole o link abaixo.
            </p>
            <div>
              <Label htmlFor="videoLink" className="text-[#f0ece4]">Link do vídeo</Label>
              <Input
                id="videoLink"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
              />
            </div>
            <Button
              onClick={enviarLink}
              disabled={enviandoLink || !videoLink.trim()}
              style={{ backgroundColor: "var(--integral-verde)", color: "#fff" }}
            >
              {enviandoLink ? "Enviando..." : "Enviar link"}
            </Button>
          </div>
        )}
      </div>

      {/* Upload Portfolio */}
      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <h2 className="text-lg font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Portfólio Digital (PDF)
        </h2>
        {portfolioEnviado && portfolioEnviado.status !== "PENDENTE" ? (
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
              onChange={(e) => e.target.files?.[0] && uploadPortfolio(e.target.files[0])}
            />
            <label
              htmlFor="portfolio-upload"
              className="flex items-center justify-center h-32 border-2 border-dashed border-[#2a2a3a] rounded-xl cursor-pointer hover:border-[#3a3a4a] transition-colors"
            >
              <span className="text-sm text-[#9895a4]">
                {uploadingPortfolio ? "Enviando..." : "Clique para enviar o portfólio (PDF)"}
              </span>
            </label>
          </div>
        )}
      </div>

      {status?.avaliacoes && status.avaliacoes.length > 0 && (
        <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] text-center">
          <p className="text-sm text-[#9895a4] mb-1">Nota da Fase 2</p>
          <p className="text-3xl font-bold font-[family-name:var(--font-fraunces)]" style={{ color: "var(--pi-dourado)" }}>
            {status.avaliacoes[0].nota} pts
          </p>
        </div>
      )}

      {msg && (
        <motion.p
          className="text-sm p-3 rounded-lg text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: "rgba(76, 175, 80, 0.1)", color: "var(--integral-verde)" }}
        >
          {msg}
        </motion.p>
      )}
    </motion.div>
  );
}

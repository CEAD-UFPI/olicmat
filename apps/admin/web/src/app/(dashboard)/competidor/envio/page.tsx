"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Clock, ExternalLink, AlertTriangle } from "lucide-react";

interface StatusFase2 {
  classificado: boolean;
  agora: string;
  situacao?: "NAO_INICIADA" | "ABERTA" | "ENCERRADA";
  tema?: string | null;
  inicioEm?: string | null;
  prazoEm?: string | null;
  ultimoEnvio?: { videoLink: string; portfolioLink: string; enviadoEm: string } | null;
  totalEnvios?: number;
}

const dataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

function restante(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${ss}`;
}

function mensagemErro(err: unknown, padrao: string) {
  const m = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  if (Array.isArray(m)) return m.join(" ");
  if (typeof m === "string") return m;
  if (m && typeof m === "object") return Object.values(m).flat().join(" ");
  return padrao;
}

const cartao = "border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]";
const titulo = "text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]";

export default function EnvioFase2Page() {
  const [status, setStatus] = useState<StatusFase2 | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [desvio, setDesvio] = useState(0); // relógio do servidor − relógio local
  const [agora, setAgora] = useState(() => Date.now());
  const [videoLink, setVideoLink] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregar = useCallback(() => {
    api.get<StatusFase2>("/envio/status")
      .then(({ data }) => {
        setStatus(data);
        setDesvio(new Date(data.agora).getTime() - Date.now());
        if (data.ultimoEnvio) {
          setVideoLink((v) => v || data.ultimoEnvio!.videoLink);
          setPortfolioLink((p) => p || data.ultimoEnvio!.portfolioLink);
        }
      })
      .catch(() => setErro("Não foi possível carregar a Fase 2. Recarregue a página."))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const agoraServidor = agora + desvio;
  const prazoMs = status?.prazoEm ? new Date(status.prazoEm).getTime() : null;
  const aberta = status?.situacao === "ABERTA" && prazoMs != null && agoraServidor <= prazoMs;

  // Quando o prazo acaba com a página aberta, recarrega para mostrar o encerramento.
  useEffect(() => {
    if (status?.situacao === "ABERTA" && prazoMs != null && agoraServidor > prazoMs + 1500) carregar();
  }, [status?.situacao, prazoMs, agoraServidor, carregar]);

  const enviar = async () => {
    setErro("");
    setSucesso("");
    setEnviando(true);
    try {
      await api.post("/envio/links", { videoLink: videoLink.trim(), portfolioLink: portfolioLink.trim() });
      setSucesso("Links enviados com sucesso! Você pode corrigi-los até o prazo final; vale o último envio.");
      carregar();
    } catch (err) {
      setErro(mensagemErro(err, "Não foi possível enviar os links. Tente novamente."));
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!status?.classificado) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className={titulo}>Envio — Fase 2</h1>
        <div className={cartao}>
          <p className="text-[#b0adc0] leading-relaxed">
            O envio da Fase 2 está disponível apenas para os participantes da relação oficial de
            classificados, divulgada no site da OLICMAT.
          </p>
          {erro && <p className="text-sm text-red-400 mt-3">{erro}</p>}
        </div>
      </div>
    );
  }

  const enviado = status.ultimoEnvio;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className={titulo}>Envio — Fase 2</h1>
        <p className="text-[#9895a4] text-sm mt-1">Desafio Didático-Tecnológico: videoaula autoral e portfólio digital</p>
      </div>

      {status.situacao === "NAO_INICIADA" && (
        <div className={cartao}>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-[#E8B829]" size={20} />
            <p className="text-lg font-semibold text-[#f0ece4]">Aguardando o início da Fase 2</p>
          </div>
          <p className="text-[#b0adc0] leading-relaxed">
            Você está classificado(a) para a Fase 2. A Comissão Organizadora divulgará o tema e
            iniciará a fase; você receberá um e-mail com a data e a hora do início. A partir do
            início, você terá <strong className="text-[#f0ece4]">24 horas</strong> para enviar os links.
          </p>
        </div>
      )}

      {status.situacao !== "NAO_INICIADA" && (
        <div className={cartao}>
          <span className="text-xs text-[#E8B829] uppercase tracking-widest">Tema da videoaula</span>
          <p className="text-xl font-bold text-[#f0ece4] mt-1 font-[family-name:var(--font-fraunces)]">{status.tema}</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-5 text-sm">
            <div>
              <p className="text-[#9895a4]">Início</p>
              <p className="text-[#f0ece4] font-medium">{status.inicioEm && dataHora(status.inicioEm)}</p>
            </div>
            <div>
              <p className="text-[#9895a4]">Prazo final (horário de Brasília)</p>
              <p className="text-[#f0ece4] font-medium">{status.prazoEm && dataHora(status.prazoEm)}</p>
            </div>
          </div>
          {aberta && prazoMs != null ? (
            <div className="mt-5 rounded-xl border border-[#E8B829]/40 bg-[#E8B829]/10 p-4 text-center">
              <p className="text-xs text-[#E8B829] uppercase tracking-widest">Tempo restante</p>
              <p className="text-3xl font-bold text-[#f0ece4] tabular-nums mt-1">{restante(prazoMs - agoraServidor)}</p>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center">
              <p className="font-semibold text-red-300">Prazo de envio encerrado</p>
            </div>
          )}
        </div>
      )}

      {enviado && (
        <div className="border border-emerald-500/40 rounded-2xl p-6 bg-emerald-500/10 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400" size={20} />
            <p className="font-semibold text-emerald-300">
              Envio registrado em {dataHora(enviado.enviadoEm)}
            </p>
          </div>
          <a href={enviado.videoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#3AAFE0] hover:underline break-all">
            <ExternalLink size={14} className="shrink-0" /> Videoaula: {enviado.videoLink}
          </a>
          <a href={enviado.portfolioLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#3AAFE0] hover:underline break-all">
            <ExternalLink size={14} className="shrink-0" /> Portfólio: {enviado.portfolioLink}
          </a>
          {aberta && <p className="text-xs text-[#9895a4]">Você ainda pode corrigir os links abaixo até o prazo final. Vale o último envio.</p>}
        </div>
      )}

      {aberta && (
        <div className={`${cartao} space-y-5`}>
          <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            {enviado ? "Corrigir os links" : "Enviar os links"}
          </h2>
          <div>
            <Label htmlFor="videoLink" className="text-[#f0ece4]">Link da videoaula</Label>
            <Input
              id="videoLink" type="url" inputMode="url" placeholder="https://..."
              value={videoLink} onChange={(e) => setVideoLink(e.target.value)}
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
            />
          </div>
          <div>
            <Label htmlFor="portfolioLink" className="text-[#f0ece4]">Link do portfólio (PDF)</Label>
            <Input
              id="portfolioLink" type="url" inputMode="url" placeholder="https://..."
              value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)}
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
            />
            <p className="text-xs text-[#9895a4] mt-1.5">
              Confira se o link está com acesso liberado para qualquer pessoa com o link (por exemplo, no Google Drive).
            </p>
          </div>
          <Button
            onClick={enviar}
            disabled={enviando || !videoLink.trim() || !portfolioLink.trim()}
            className="w-full"
            style={{ backgroundColor: "var(--integral-verde)", color: "#fff" }}
          >
            {enviando ? "Enviando..." : enviado ? "Atualizar envio" : "Enviar links"}
          </Button>
        </div>
      )}

      {sucesso && <p className="text-sm p-3 rounded-lg text-center bg-emerald-500/10 text-emerald-300">{sucesso}</p>}
      {erro && (
        <p className="text-sm p-3 rounded-lg text-center bg-red-500/10 text-red-300 flex items-center justify-center gap-2">
          <AlertTriangle size={16} /> {erro}
        </p>
      )}

      <div className={`${cartao} space-y-4 text-sm text-[#b0adc0] leading-relaxed`}>
        <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">Materiais obrigatórios</h2>
        <div>
          <p className="font-semibold text-[#f0ece4]">Videoaula autoral</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Publicada em uma plataforma de vídeo, com acesso pelo link (no YouTube, use a opção &quot;Não listado&quot;).</li>
            <li>Título no padrão: <em>Nome do Participante - Tema da Videoaula</em>.</li>
            <li>Deve apresentar o conteúdo, a situação-problema e as estratégias pedagógicas.</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-[#f0ece4]">Portfólio digital — arquivo único em PDF</p>
          <p className="mt-1">
            Deve conter plano de aula, objetivos, público-alvo, metodologia, recursos digitais,
            atividade ou situação-problema, avaliação, referências e reflexão crítica sobre a prática.
          </p>
        </div>
        <p className="text-xs text-[#9895a4]">
          O conteúdo dos links é de responsabilidade do participante. Após o prazo final, o envio é
          encerrado automaticamente e não há prorrogação.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle, CheckCircle2, Clock, Download, ExternalLink, FileText, Film, UploadCloud, X,
} from "lucide-react";
import { enviarArquivo, formatarBytes, UploadCancelado, type Progresso, type TipoArquivo } from "@/lib/uploadFase2";

interface Arquivo { nome: string; bytes: number | null; url: string | null }
interface StatusFase2 {
  classificado: boolean;
  agora: string;
  situacao?: "NAO_INICIADA" | "ABERTA" | "ENCERRADA";
  modo?: "upload" | "links";
  limitesMb?: Record<TipoArquivo, number>;
  formatos?: Record<TipoArquivo, string[]>;
  tema?: string | null;
  inicioEm?: string | null;
  prazoEm?: string | null;
  ultimoEnvio?: {
    enviadoEm: string;
    videoLink: string | null;
    portfolioLink: string | null;
    video: Arquivo | null;
    portfolio: Arquivo | null;
  } | null;
  totalEnvios?: number;
}

const SITE = "https://olicmat.cead.ufpi.br";
const DOCUMENTOS = [
  { href: `${SITE}/arquivos/manual-participante-fase2-2026.pdf`, rotulo: "Manual do Participante — 2ª Fase (PDF)" },
  { href: `${SITE}/arquivos/OLICMAT_2026_Template_Portfolio.docx`, rotulo: "Template do Portfólio (Word)" },
];

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
  if (err instanceof Error && err.message && !("response" in err)) return err.message;
  return padrao;
}

function duracao(s: number) {
  if (!Number.isFinite(s) || s <= 0) return "";
  if (s < 60) return `${Math.ceil(s)} s`;
  if (s < 3600) return `${Math.ceil(s / 60)} min`;
  return `${Math.floor(s / 3600)} h ${Math.ceil((s % 3600) / 60)} min`;
}

const cartao = "border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 bg-[var(--bg-secondary)]";
const titulo = "text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]";

/** Cartão de upload de um arquivo (videoaula ou portfólio). */
function CartaoArquivo({
  tipo, atual, aberta, limiteMb, formatos, ocupado, aoMudarOcupado, aoConcluir,
}: {
  tipo: TipoArquivo;
  atual: Arquivo | null;
  aberta: boolean;
  limiteMb: number;
  formatos: string[];
  ocupado: boolean;
  aoMudarOcupado: (v: boolean) => void;
  aoConcluir: (msg: string) => void;
}) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [erro, setErro] = useState("");
  const controle = useRef<AbortController | null>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const video = tipo === "video";
  const Icone = video ? Film : FileText;
  const enviando = progresso !== null;
  const limite = limiteMb >= 1024 ? `${(limiteMb / 1024).toLocaleString("pt-BR")} GB` : `${limiteMb} MB`;

  const escolher = (f: File | null) => {
    setErro("");
    if (!f) return setArquivo(null);
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!formatos.includes(ext)) {
      setArquivo(null);
      return setErro(video ? `Formato não aceito. Use ${formatos.map((x) => x.toUpperCase()).join(", ")}.` : "O portfólio deve ser um arquivo PDF.");
    }
    if (f.size > limiteMb * 1024 * 1024) {
      setArquivo(null);
      return setErro(`O arquivo tem ${formatarBytes(f.size)}; o limite é ${limite}.`);
    }
    setArquivo(f);
  };

  const enviar = async () => {
    if (!arquivo) return;
    setErro("");
    controle.current = new AbortController();
    aoMudarOcupado(true);
    setProgresso({ enviados: 0, total: arquivo.size, velocidade: 0 });
    try {
      await enviarArquivo(tipo, arquivo, setProgresso, controle.current.signal);
      setArquivo(null);
      if (entrada.current) entrada.current.value = "";
      aoConcluir(video ? "Videoaula enviada com sucesso!" : "Portfólio enviado com sucesso!");
    } catch (e) {
      setErro(e instanceof UploadCancelado ? "Envio cancelado." : mensagemErro(e, "Não foi possível enviar o arquivo. Tente novamente."));
    } finally {
      setProgresso(null);
      aoMudarOcupado(false);
      controle.current = null;
    }
  };

  const pct = progresso ? Math.floor((progresso.enviados / progresso.total) * 100) : 0;
  const eta = progresso && progresso.velocidade > 0 ? (progresso.total - progresso.enviados) / progresso.velocidade : NaN;

  return (
    <div className={`${cartao} space-y-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[var(--color-gold)]/15 p-2.5"><Icone className="text-[var(--color-gold-ink)]" size={22} /></div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
              {video ? "Videoaula (20 minutos)" : "Portfólio digital (PDF único)"}
            </h2>
            <p className="text-xs text-[var(--text-tertiary)]">
              {video ? `${formatos.map((x) => x.toUpperCase()).join(", ")} · até ${limite}` : `PDF · até ${limite}`}
            </p>
            {video && (
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                Grave em 720p. Se o arquivo passar do limite, comprima antes de enviar (por exemplo, no HandBrake, predefinição “Fast 720p30”).
              </p>
            )}
          </div>
        </div>
        {atual ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 rounded-full px-2.5 py-1 shrink-0">
            <CheckCircle2 size={14} /> Enviado
          </span>
        ) : (
          <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 rounded-full px-2.5 py-1 shrink-0">Pendente</span>
        )}
      </div>

      {atual && (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-sm flex flex-wrap items-center justify-between gap-2">
          <span className="text-[var(--text-primary)] break-all">
            {atual.nome} <span className="text-[var(--text-tertiary)]">· {formatarBytes(atual.bytes)}</span>
          </span>
          {atual.url && (
            <a href={atual.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[var(--color-blue-ink)] hover:underline">
              <ExternalLink size={14} /> Conferir
            </a>
          )}
        </div>
      )}

      {aberta && (
        <>
          <div>
            <Label htmlFor={`arquivo-${tipo}`} className="text-[var(--text-primary)]">
              {atual ? "Substituir por outro arquivo" : "Escolha o arquivo"}
            </Label>
            <input
              ref={entrada}
              id={`arquivo-${tipo}`}
              type="file"
              accept={video ? formatos.map((f) => `.${f}`).join(",") + ",video/*" : ".pdf,application/pdf"}
              disabled={enviando}
              onChange={(e) => escolher(e.target.files?.[0] ?? null)}
              className="mt-1.5 block w-full text-sm text-[var(--text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-gold)] file:px-4 file:py-2 file:font-semibold file:text-[var(--on-accent)] hover:file:brightness-110 file:cursor-pointer"
            />
            {arquivo && !enviando && (
              <p className="text-xs text-[var(--text-tertiary)] mt-1.5">{arquivo.name} · {formatarBytes(arquivo.size)}</p>
            )}
          </div>

          {enviando && progresso && (
            <div className="space-y-2" aria-live="polite">
              <div className="h-3 w-full rounded-full bg-[var(--border-color)] overflow-hidden">
                <div className="h-full bg-[var(--color-green)] transition-[width] duration-300" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex flex-wrap justify-between gap-2 text-xs text-[var(--text-secondary)] tabular-nums">
                <span>{pct}% · {formatarBytes(progresso.enviados)} de {formatarBytes(progresso.total)}</span>
                <span>
                  {progresso.velocidade > 0 && `${formatarBytes(progresso.velocidade)}/s`}
                  {duracao(eta) && ` · faltam ~${duracao(eta)}`}
                </span>
              </div>
              <p className="text-xs text-amber-300">Não feche nem recarregue esta página até o envio terminar.</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={enviar}
              disabled={!arquivo || enviando || ocupado}
              className="flex-1"
              style={{ backgroundColor: "var(--integral-verde)", color: "#fff" }}
            >
              <UploadCloud size={16} className="mr-2" />
              {enviando ? "Enviando..." : atual ? "Enviar e substituir" : "Enviar arquivo"}
            </Button>
            {enviando && (
              <Button variant="outline" onClick={() => controle.current?.abort()} className="border-[var(--border-color)] text-[var(--text-primary)]">
                <X size={16} className="mr-1" /> Cancelar
              </Button>
            )}
          </div>
          {ocupado && !enviando && arquivo && (
            <p className="text-xs text-[var(--text-tertiary)]">Aguarde o término do outro envio.</p>
          )}
        </>
      )}

      {erro && (
        <p className="text-sm p-3 rounded-lg bg-red-500/10 text-red-300 flex items-start gap-2">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" /> {erro}
        </p>
      )}
    </div>
  );
}

export default function EnvioFase2Page() {
  const [status, setStatus] = useState<StatusFase2 | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [desvio, setDesvio] = useState(0); // relógio do servidor − relógio local
  const [agora, setAgora] = useState(() => Date.now());
  const [videoLink, setVideoLink] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [uploadAtivo, setUploadAtivo] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregar = useCallback(() => {
    api.get<StatusFase2>("/envio/status")
      .then(({ data }) => {
        setStatus(data);
        setDesvio(new Date(data.agora).getTime() - Date.now());
        if (data.ultimoEnvio) {
          setVideoLink((v) => v || data.ultimoEnvio!.videoLink || "");
          setPortfolioLink((p) => p || data.ultimoEnvio!.portfolioLink || "");
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

  // Avisa antes de sair da página no meio de um upload.
  useEffect(() => {
    if (!uploadAtivo) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [uploadAtivo]);

  const agoraServidor = agora + desvio;
  const prazoMs = status?.prazoEm ? new Date(status.prazoEm).getTime() : null;
  const aberta = status?.situacao === "ABERTA" && prazoMs != null && agoraServidor <= prazoMs;

  // Quando o prazo acaba com a página aberta, recarrega para mostrar o encerramento.
  useEffect(() => {
    if (status?.situacao === "ABERTA" && prazoMs != null && agoraServidor > prazoMs + 1500 && !uploadAtivo) carregar();
  }, [status?.situacao, prazoMs, agoraServidor, carregar, uploadAtivo]);

  const enviarLinks = async () => {
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
        <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!status?.classificado) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className={titulo}>Envio — Fase 2</h1>
        <div className={cartao}>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            O envio da Fase 2 está disponível apenas para os participantes da relação oficial de
            classificados, divulgada no site da OLICMAT.
          </p>
          {erro && <p className="text-sm text-red-400 mt-3">{erro}</p>}
        </div>
      </div>
    );
  }

  const enviado = status.ultimoEnvio;
  const modoUpload = status.modo === "upload";
  const completo = modoUpload
    ? !!(enviado?.video && enviado?.portfolio)
    : !!(enviado?.videoLink && enviado?.portfolioLink);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className={titulo}>Envio — Fase 2</h1>
        <p className="text-[var(--text-tertiary)] text-sm mt-1">Desafio Didático-Tecnológico: videoaula autoral e portfólio digital</p>
      </div>

      {status.situacao === "NAO_INICIADA" && (
        <div className={cartao}>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-[var(--color-gold-ink)]" size={20} />
            <p className="text-lg font-semibold text-[var(--text-primary)]">Aguardando o início da Fase 2</p>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Você está classificado(a) para a Fase 2. A Comissão Organizadora sorteará uma competência
            específica da BNCC e iniciará a fase; você receberá um e-mail com a competência, a data e a
            hora do início. A partir do início, você terá <strong className="text-[var(--text-primary)]">24 horas</strong> para
            enviar a videoaula e o portfólio.
          </p>
        </div>
      )}

      {status.situacao !== "NAO_INICIADA" && (
        <div className={cartao}>
          <span className="text-xs text-[var(--color-gold-ink)] uppercase tracking-widest">Competência sorteada</span>
          <p className="text-xl font-bold text-[var(--text-primary)] mt-1 font-[family-name:var(--font-fraunces)]">{status.tema}</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-5 text-sm">
            <div>
              <p className="text-[var(--text-tertiary)]">Início</p>
              <p className="text-[var(--text-primary)] font-medium">{status.inicioEm && dataHora(status.inicioEm)}</p>
            </div>
            <div>
              <p className="text-[var(--text-tertiary)]">Prazo final (horário de Brasília)</p>
              <p className="text-[var(--text-primary)] font-medium">{status.prazoEm && dataHora(status.prazoEm)}</p>
            </div>
          </div>
          {aberta && prazoMs != null ? (
            <div className="mt-5 rounded-xl border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 p-4 text-center">
              <p className="text-xs text-[var(--color-gold-ink)] uppercase tracking-widest">Tempo restante</p>
              <p className="text-3xl font-bold text-[var(--text-primary)] tabular-nums mt-1">{restante(prazoMs - agoraServidor)}</p>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center">
              <p className="font-semibold text-red-300">Prazo de envio encerrado</p>
            </div>
          )}
        </div>
      )}

      {status.situacao !== "NAO_INICIADA" && (
        completo ? (
          <div className="border border-emerald-500/40 rounded-2xl p-4 bg-emerald-500/10 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
            <p className="text-sm font-semibold text-emerald-300">
              Envio completo — última atualização em {enviado && dataHora(enviado.enviadoEm)}.
              {aberta && " Você ainda pode substituir os arquivos até o prazo final; vale o último envio."}
            </p>
          </div>
        ) : aberta ? (
          <div className="border border-amber-500/40 rounded-2xl p-4 bg-amber-500/10 flex items-center gap-2">
            <AlertTriangle className="text-amber-400 shrink-0" size={20} />
            <p className="text-sm font-semibold text-amber-300">
              Envio incompleto: são obrigatórios a videoaula e o portfólio. Comece com antecedência — vídeos grandes podem levar tempo para subir.
            </p>
          </div>
        ) : null
      )}

      {modoUpload && status.situacao !== "NAO_INICIADA" && (
        <>
          <CartaoArquivo
            tipo="video" atual={enviado?.video ?? null} aberta={aberta}
            limiteMb={status.limitesMb?.video ?? 400} formatos={status.formatos?.video ?? ["mp4"]}
            ocupado={uploadAtivo} aoMudarOcupado={setUploadAtivo}
            aoConcluir={(m) => { setSucesso(m); carregar(); }}
          />
          <CartaoArquivo
            tipo="portfolio" atual={enviado?.portfolio ?? null} aberta={aberta}
            limiteMb={status.limitesMb?.portfolio ?? 10} formatos={status.formatos?.portfolio ?? ["pdf"]}
            ocupado={uploadAtivo} aoMudarOcupado={setUploadAtivo}
            aoConcluir={(m) => { setSucesso(m); carregar(); }}
          />
        </>
      )}

      {!modoUpload && enviado && (
        <div className="border border-emerald-500/40 rounded-2xl p-6 bg-emerald-500/10 space-y-3">
          {enviado.videoLink && (
            <a href={enviado.videoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--color-blue-ink)] hover:underline break-all">
              <ExternalLink size={14} className="shrink-0" /> Videoaula: {enviado.videoLink}
            </a>
          )}
          {enviado.portfolioLink && (
            <a href={enviado.portfolioLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--color-blue-ink)] hover:underline break-all">
              <ExternalLink size={14} className="shrink-0" /> Portfólio: {enviado.portfolioLink}
            </a>
          )}
        </div>
      )}

      {!modoUpload && aberta && (
        <div className={`${cartao} space-y-5`}>
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
            {enviado ? "Corrigir os links" : "Enviar os links"}
          </h2>
          <div>
            <Label htmlFor="videoLink" className="text-[var(--text-primary)]">Link da videoaula</Label>
            <Input
              id="videoLink" type="url" inputMode="url" placeholder="https://..."
              value={videoLink} onChange={(e) => setVideoLink(e.target.value)}
              className="mt-1.5 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
            />
          </div>
          <div>
            <Label htmlFor="portfolioLink" className="text-[var(--text-primary)]">Link do portfólio (PDF)</Label>
            <Input
              id="portfolioLink" type="url" inputMode="url" placeholder="https://..."
              value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)}
              className="mt-1.5 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
              Confira se o link está com acesso liberado para qualquer pessoa com o link (por exemplo, no Google Drive).
            </p>
          </div>
          <Button
            onClick={enviarLinks}
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

      <div className={`${cartao} space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed`}>
        <h2 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">Materiais obrigatórios</h2>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">Videoaula autoral de 20 minutos</p>
          <p className="mt-1">
            Desenvolva uma situação de ensino relacionada à competência sorteada e à(s) habilidade(s)
            escolhida(s), para o público da Educação Básica definido no portfólio. Apresente uma aula, não
            apenas o planejamento: introduza o tema, explore uma atividade ou problema, explique os
            conceitos e estratégias e sistematize a aprendizagem.
          </p>
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">Portfólio digital — arquivo único em PDF</p>
          <p className="mt-1">
            Identificação; competência sorteada e habilidade(s); público-alvo e objetivos; plano de aula;
            situação-problema ou atividade; desenvolvimento e justificativas matemáticas; metodologia e
            recursos; avaliação da aprendizagem; reflexão crítica e referências. Use o modelo oficial e
            salve em PDF antes de enviar. O uso de inteligência artificial, se houver, deve ser declarado.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          {DOCUMENTOS.map((d) => (
            <a
              key={d.href} href={d.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-3 py-2 text-[var(--color-blue-ink)] hover:bg-[var(--surface)]"
            >
              <Download size={14} className="shrink-0" /> {d.rotulo}
            </a>
          ))}
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">
          A produção deve ser autoral. Após o prazo final, o envio é encerrado automaticamente e não há prorrogação.
        </p>
      </div>
    </div>
  );
}

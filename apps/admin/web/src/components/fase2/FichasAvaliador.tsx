"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ArrowLeft, BookOpen, CheckCircle2, Download, ExternalLink, FileText } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { formatarBytes } from "@/lib/uploadFase2";

interface Criterio { chave: string; nome: string; descricao: string; max: number }
interface NivelEscala { conceito: number; pontos: number; rotulo: string }
interface Arquivo { nome: string; bytes: number | null; url: string | null; processamento?: string }
interface Ficha {
  id: string;
  status: "PENDENTE" | "CONCLUIDA";
  atribuidoEm: string;
  concluidoEm: string | null;
  participante: { numero: number; nome: string; instituicao: string; curso: string };
  tema: string | null;
  videoLink: string | null;
  portfolioLink: string | null;
  video: Arquivo | null;
  portfolio: Arquivo | null;
  enviadoEm: string | null;
  avaliacao: { nota: number; parecer: string | null; concluida: boolean; notas: Record<string, number | null> } | null;
}

const dataHora = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

function mensagemErro(err: unknown, padrao: string) {
  const m = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  if (Array.isArray(m)) return m.join(" ");
  if (typeof m === "string") return m;
  if (m && typeof m === "object") return Object.values(m).flat().join(" ");
  return padrao;
}

const cartao = "border border-[var(--border-color)] rounded-2xl p-5 bg-[var(--bg-secondary)]";

export default function FichasAvaliador() {
  const [criterios, setCriterios] = useState<Criterio[]>([]);
  const [escala, setEscala] = useState<NivelEscala[]>([]);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [aberta, setAberta] = useState<Ficha | null>(null);
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [parecer, setParecer] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const carregar = useCallback(() => {
    api.get<{ criterios: Criterio[]; escala: NivelEscala[]; atribuicoes: Ficha[] }>("/avaliador/fase2/atribuicoes")
      .then(({ data }) => { setCriterios(data.criterios); setEscala(data.escala); setFichas(data.atribuicoes); })
      .catch((e) => setErro(mensagemErro(e, "Erro ao carregar suas avaliações.")))
      .finally(() => setCarregando(false));
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  const abrir = (f: Ficha) => {
    setAberta(f);
    setErro("");
    setAviso("");
    setParecer(f.avaliacao?.parecer ?? "");
    setNotas(Object.fromEntries(criterios.map((c) => [c.chave, f.avaliacao?.notas[c.chave]?.toString() ?? ""])));
  };

  // O avaliador atribui um conceito inteiro de 0 a 5; cada critério vale até
  // 20 pontos (conceito × 4), calculado pelo sistema.
  const pesoDe = (c: Criterio) => c.max / (escala.length ? escala.length - 1 : 5);
  const corpo = () => ({
    notas: Object.fromEntries(criterios.map((c) => [c.chave, notas[c.chave] === "" || notas[c.chave] == null ? null : Number(notas[c.chave])])),
    parecer,
  });
  const total = criterios.reduce((s, c) => (notas[c.chave] ? s + Number(notas[c.chave]) * pesoDe(c) : s), 0);
  const completo = criterios.every((c) => notas[c.chave] !== "" && notas[c.chave] != null);

  const salvar = async (concluir: boolean) => {
    if (!aberta) return;
    setSalvando(true);
    setErro("");
    setAviso("");
    try {
      const { data } = concluir
        ? await api.post<Ficha>(`/avaliador/fase2/atribuicoes/${aberta.id}/concluir`, corpo())
        : await api.put<Ficha>(`/avaliador/fase2/atribuicoes/${aberta.id}`, corpo());
      setAberta(data);
      setAviso(concluir ? "Avaliação concluída." : "Rascunho salvo.");
      setConfirmar(false);
      carregar();
    } catch (e) {
      setErro(mensagemErro(e, "Não foi possível salvar."));
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (aberta) {
    const travada = aberta.status === "CONCLUIDA";
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <button className="text-sm text-[var(--color-gold-ink)] hover:underline flex items-center gap-1" onClick={() => { setAberta(null); setAviso(""); setErro(""); }}>
          <ArrowLeft size={14} /> Voltar à lista
        </button>
        <div className={cartao}>
          <p className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Participante nº {aberta.participante.numero}</p>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-1">{aberta.participante.nome}</h1>
          <p className="text-sm text-[var(--text-tertiary)]">{aberta.participante.instituicao} · {aberta.participante.curso}</p>
          <p className="text-sm text-[var(--text-primary)] mt-3"><span className="text-[var(--color-gold-ink)]">Competência sorteada:</span> {aberta.tema}</p>
          {aberta.video && aberta.video.processamento && aberta.video.processamento !== "PRONTO" && (
            <p className="mt-4 text-xs p-2 rounded bg-amber-500/10 text-amber-300">
              {aberta.video.processamento === "FALHA"
                ? "Não foi possível preparar este vídeo; se ele não abrir abaixo, use “Baixar vídeo” ou avise a Comissão."
                : "Este vídeo ainda está sendo preparado (versão leve). Por enquanto, a reprodução usa o arquivo original e pode demorar a carregar."}
            </p>
          )}
          {aberta.video?.url && (
            <div className="mt-4">
              <video controls preload="metadata" src={aberta.video.url} className="w-full rounded-xl bg-black max-h-[480px]">
                Seu navegador não reproduz este formato. Use o botão “Baixar vídeo”.
              </video>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            {aberta.video?.url && (
              <a href={aberta.video.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-blue)]/50 px-3 py-1.5 text-sm text-[var(--color-blue-ink)] hover:bg-[var(--color-blue)]/10">
                <Download size={14} /> Baixar vídeo <span className="text-xs text-[var(--text-tertiary)]">({formatarBytes(aberta.video.bytes)})</span>
              </a>
            )}
            {aberta.portfolio?.url && (
              <a href={aberta.portfolio.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-blue)]/50 px-3 py-1.5 text-sm text-[var(--color-blue-ink)] hover:bg-[var(--color-blue)]/10">
                <FileText size={14} /> Abrir portfólio (PDF)
              </a>
            )}
            {aberta.videoLink && (
              <a href={aberta.videoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-blue)]/50 px-3 py-1.5 text-sm text-[var(--color-blue-ink)] hover:bg-[var(--color-blue)]/10">
                <ExternalLink size={14} /> Abrir videoaula (link)
              </a>
            )}
            {aberta.portfolioLink && (
              <a href={aberta.portfolioLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-blue)]/50 px-3 py-1.5 text-sm text-[var(--color-blue-ink)] hover:bg-[var(--color-blue)]/10">
                <ExternalLink size={14} /> Abrir portfólio (link)
              </a>
            )}
            {!aberta.video && !aberta.videoLink && <span className="text-sm text-amber-300">Videoaula não enviada.</span>}
            {!aberta.portfolio && !aberta.portfolioLink && <span className="text-sm text-amber-300">Portfólio não enviado.</span>}
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-2">Os links dos arquivos valem por algumas horas; se expirarem, recarregue a página.</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-3">Envio: {dataHora(aberta.enviadoEm)} · Recebido para avaliação: {dataHora(aberta.atribuidoEm)}</p>
        </div>

        <div className={`${cartao} space-y-4`}>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Critérios de avaliação</h2>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">
              Avalie a videoaula e o portfólio em conjunto. Para cada critério, atribua um conceito de 0 a 5;
              o sistema converte proporcionalmente para até 20 pontos (conceito × 4).
            </p>
          </div>
          <details className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-sm">
            <summary className="cursor-pointer text-[var(--color-gold-ink)] font-semibold">Escala orientadora</summary>
            <ul className="mt-2 space-y-1 text-[var(--text-secondary)]">
              {escala.map((e) => (
                <li key={e.conceito}><strong className="text-[var(--text-primary)]">{e.conceito}</strong> ({e.pontos} pts) — {e.rotulo}</li>
              ))}
            </ul>
          </details>
          {criterios.map((c, i) => {
            const valor = notas[c.chave];
            const nivel = escala.find((e) => String(e.conceito) === valor);
            return (
              <div key={c.chave} className="border-t border-[var(--border-color)] pt-4 first:border-0">
                <p className="font-semibold text-[var(--text-primary)]">Critério {i + 1} — {c.nome}</p>
                <p className="text-sm text-[var(--text-tertiary)]">{c.descricao}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2" role="radiogroup" aria-label={`Conceito do critério ${i + 1}`}>
                  {escala.map((e) => {
                    const ativo = valor === String(e.conceito);
                    return (
                      <button
                        key={e.conceito} type="button" role="radio" aria-checked={ativo} disabled={travada}
                        title={`${e.conceito} — ${e.rotulo}`}
                        onClick={() => setNotas((n) => ({ ...n, [c.chave]: String(e.conceito) }))}
                        className={`w-11 h-11 rounded-lg border text-base font-bold tabular-nums transition-colors disabled:cursor-not-allowed ${
                          ativo
                            ? "bg-[var(--color-gold)] border-[var(--color-gold)] text-[var(--on-accent)]"
                            : "bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--color-gold)]/60"
                        }`}
                      >
                        {e.conceito}
                      </button>
                    );
                  })}
                  <span className="ml-2 text-sm tabular-nums text-[var(--text-primary)]">
                    {valor ? <><strong>{Number(valor) * pesoDe(c)}</strong> / {c.max} pts</> : <span className="text-[var(--text-tertiary)]">sem conceito</span>}
                  </span>
                </div>
                {nivel && <p className="text-xs text-[var(--text-tertiary)] mt-1.5">{nivel.rotulo}</p>}
              </div>
            );
          })}
          <div className="flex items-center justify-between border-t border-[var(--color-gold)]/40 pt-3">
            <p className="font-bold text-[var(--text-primary)]">Total</p>
            <p className="text-2xl font-bold text-[var(--color-gold-ink)] tabular-nums">{total} <span className="text-sm text-[var(--text-tertiary)]">/ 100</span></p>
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)] mb-1">Parecer</p>
            <textarea value={parecer} onChange={(e) => setParecer(e.target.value)} disabled={travada} rows={5} maxLength={5000}
              className="w-full rounded-md bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 text-sm" placeholder="Comentários sobre a videoaula e o portfólio" />
          </div>
          {aviso && <p className="text-sm p-2 rounded bg-emerald-500/10 text-emerald-300">{aviso}</p>}
          {erro && <p className="text-sm p-2 rounded bg-red-500/10 text-red-300">{erro}</p>}
          {travada ? (
            <p className="text-sm text-emerald-300 flex items-center gap-2"><CheckCircle2 size={16} /> Avaliação concluída em {dataHora(aberta.concluidoEm)}.</p>
          ) : (
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" disabled={salvando} onClick={() => salvar(false)}>Salvar rascunho</Button>
              <Button disabled={salvando || !completo} onClick={() => setConfirmar(true)} style={{ backgroundColor: "var(--color-green)", color: "#fff" }}>Concluir avaliação</Button>
            </div>
          )}
        </div>

        <ConfirmDialog aberto={confirmar} onClose={() => setConfirmar(false)} onConfirm={() => salvar(true)} confirmando={salvando} variante="warning"
          titulo="Concluir a avaliação?"
          mensagem={`Total: ${total} pontos. Depois de concluída, a avaliação não pode mais ser alterada.`} />
      </div>
    );
  }

  const pendentes = fichas.filter((f) => f.status === "PENDENTE");
  const concluidas = fichas.filter((f) => f.status === "CONCLUIDA");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">Avaliação — Fase 2</h1>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">{pendentes.length} pendentes · {concluidas.length} concluídas</p>
        </div>
        <a href={`${SITE_URL}/tutorial-avaliador`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-sm text-[var(--color-blue-ink)] hover:bg-[var(--bg-secondary)]">
          <BookOpen size={14} /> Tutorial do avaliador
        </a>
      </div>
      {erro && <p className="text-sm p-3 rounded-lg bg-red-500/10 text-red-300">{erro}</p>}
      {!fichas.length && <div className={cartao}><p className="text-[var(--text-tertiary)]">Nenhum participante foi atribuído a você ainda.</p></div>}
      {[{ t: "Pendentes", l: pendentes }, { t: "Concluídas", l: concluidas }].map(({ t, l }) =>
        l.length ? (
          <div key={t} className={cartao}>
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">{t}</h2>
            <ul className="divide-y divide-[var(--border-color)]">
              {l.map((f) => (
                <li key={f.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[var(--text-primary)]">{f.participante.nome} <span className="text-xs text-[var(--text-tertiary)]">nº {f.participante.numero} · {f.participante.instituicao}</span></p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Recebido em {dataHora(f.atribuidoEm)}
                      {f.status === "CONCLUIDA" ? ` · concluído em ${dataHora(f.concluidoEm)} · ${f.avaliacao?.nota} pts` : f.avaliacao ? " · rascunho salvo" : ""}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => abrir(f)}>{f.status === "CONCLUIDA" ? "Ver" : "Avaliar"}</Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null,
      )}
    </div>
  );
}

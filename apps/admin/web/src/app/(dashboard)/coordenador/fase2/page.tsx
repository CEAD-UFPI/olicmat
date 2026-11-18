"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle2, Clock, Download, FileText, Film, MinusCircle, RefreshCw } from "lucide-react";

type SituacaoVideo = "PENDENTE" | "PREPARANDO" | "PRONTO" | "FALHA";
interface Participante {
  numero: number;
  nome: string;
  email: string;
  instituicao: string;
  curso: string;
  video: SituacaoVideo;
  portfolio: boolean;
  completo: boolean;
  ultimoEnvioEm: string | null;
}
interface Painel {
  instituicoes: Array<{ nome: string; sigla: string }>;
  situacao: "NAO_INICIADA" | "ABERTA" | "ENCERRADA";
  tema: string | null;
  inicioEm: string | null;
  prazoEm: string | null;
  agora: string;
  totais: { classificados: number; completos: number; soVideo: number; soPortfolio: number; semEnvio: number; videoComFalha: number } | null;
  participantes: Participante[];
}

const cartao = "border border-[var(--border-color)] rounded-2xl p-5 bg-[var(--bg-secondary)]";
const dataHora = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

const VIDEO: Record<SituacaoVideo, { rotulo: string; classe: string }> = {
  PENDENTE: { rotulo: "Não enviado", classe: "text-amber-300 bg-amber-500/10" },
  PREPARANDO: { rotulo: "Enviado (em preparo)", classe: "text-[var(--color-blue-ink)] bg-[var(--color-blue-ink)]/10" },
  PRONTO: { rotulo: "Enviado", classe: "text-emerald-300 bg-emerald-500/10" },
  FALHA: { rotulo: "Ilegível: reenviar", classe: "text-red-300 bg-red-500/10" },
};

const FILTROS = {
  todos: { rotulo: "Todos", ok: () => true },
  pendentes: { rotulo: "Com pendência", ok: (p: Participante) => !p.completo },
  completos: { rotulo: "Envio completo", ok: (p: Participante) => p.completo },
} as const;

function Metrica({ rotulo, valor, cor }: { rotulo: string; valor: number; cor?: string }) {
  return (
    <div className={cartao}>
      <p className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">{rotulo}</p>
      <p className={`text-3xl font-bold tabular-nums mt-1 ${cor ?? "text-[var(--text-primary)]"}`}>{valor}</p>
    </div>
  );
}

export default function CoordenadorFase2Page() {
  const [painel, setPainel] = useState<Painel | null>(null);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<keyof typeof FILTROS>("todos");

  const carregar = useCallback(() => {
    api.get<Painel>("/coordenacao/fase2")
      .then(({ data }) => { setPainel(data); setErro(""); })
      .catch(() => setErro("Não foi possível carregar o acompanhamento da Fase 2."));
  }, []);
  useEffect(() => {
    carregar();
    const t = setInterval(carregar, 60_000);
    return () => clearInterval(t);
  }, [carregar]);

  const lista = useMemo(() => {
    if (!painel) return [];
    const b = busca.trim().toLowerCase();
    return painel.participantes.filter((p) => FILTROS[filtro].ok(p) && (!b || p.nome.toLowerCase().includes(b) || p.curso.toLowerCase().includes(b) || String(p.numero).includes(b)));
  }, [painel, busca, filtro]);

  const exportar = () => {
    if (!painel) return;
    const linhas = [["Nº", "Nome", "E-mail", "Instituição", "Curso", "Videoaula", "Portfólio", "Envio completo", "Último envio"]];
    for (const p of painel.participantes) {
      linhas.push([String(p.numero), p.nome, p.email, p.instituicao, p.curso, VIDEO[p.video].rotulo, p.portfolio ? "Enviado" : "Não enviado", p.completo ? "Sim" : "Não", dataHora(p.ultimoEnvioEm)]);
    }
    const csv = "﻿" + linhas.map((l) => l.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "fase2-envios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!painel) {
    return (
      <div className="flex items-center justify-center h-64">
        {erro ? <p className="text-red-300">{erro}</p> : <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />}
      </div>
    );
  }

  const restanteH = painel.prazoEm ? Math.max(0, (new Date(painel.prazoEm).getTime() - new Date(painel.agora).getTime()) / 3600_000) : 0;
  const t = painel.totais;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">Fase 2 — Envios</h1>
          <p className="text-[var(--text-tertiary)] mt-1">
            Classificados de {painel.instituicoes.map((i) => i.sigla).join(", ") || "sua instituição"}: videoaula e portfólio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={carregar}><RefreshCw size={14} className="mr-1" /> Atualizar</Button>
          <Button variant="outline" size="sm" onClick={exportar} disabled={!painel.participantes.length}><Download size={14} className="mr-1" /> Exportar CSV</Button>
        </div>
      </div>

      {!painel.instituicoes.length && (
        <p className={`${cartao} text-sm text-[var(--text-secondary)]`}>Seu cadastro de coordenador não está vinculado a um curso ou instituição. Fale com a Comissão Organizadora.</p>
      )}

      <div className={`${cartao} grid gap-4 sm:grid-cols-3 text-sm`}>
        {painel.situacao === "NAO_INICIADA" ? (
          <p className="sm:col-span-3 flex items-center gap-2 text-[var(--text-secondary)]"><Clock size={16} className="text-[var(--color-gold-ink)]" /> A Fase 2 ainda não foi iniciada.</p>
        ) : (
          <>
            <div className="sm:col-span-3">
              <p className="text-xs uppercase tracking-widest text-[var(--color-gold-ink)]">Competência sorteada</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{painel.tema}</p>
            </div>
            <div><p className="text-[var(--text-tertiary)]">Início</p><p className="text-[var(--text-primary)]">{dataHora(painel.inicioEm)}</p></div>
            <div><p className="text-[var(--text-tertiary)]">Prazo final</p><p className="text-[var(--text-primary)]">{dataHora(painel.prazoEm)}</p></div>
            <div>
              <p className="text-[var(--text-tertiary)]">Situação</p>
              <p className={painel.situacao === "ABERTA" ? "text-emerald-300 font-semibold" : "text-red-300 font-semibold"}>
                {painel.situacao === "ABERTA" ? `Envio aberto (${restanteH.toFixed(1)} h restantes)` : "Envio encerrado"}
              </p>
            </div>
          </>
        )}
      </div>

      {t && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Metrica rotulo="Classificados" valor={t.classificados} />
          <Metrica rotulo="Envio completo" valor={t.completos} cor="text-emerald-300" />
          <Metrica rotulo="Só a videoaula" valor={t.soVideo} cor="text-amber-300" />
          <Metrica rotulo="Só o portfólio" valor={t.soPortfolio} cor="text-amber-300" />
          <Metrica rotulo="Nenhum arquivo" valor={t.semEnvio} cor="text-red-300" />
        </div>
      )}
      {t && t.videoComFalha > 0 && (
        <p className="text-sm p-3 rounded-lg bg-red-500/10 text-red-300 flex items-center gap-2">
          <AlertTriangle size={16} /> {t.videoComFalha} vídeo(s) não puderam ser lidos (arquivo corrompido). O participante precisa enviar novamente.
        </p>
      )}

      <div className={cartao}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex gap-2">
            {(Object.keys(FILTROS) as Array<keyof typeof FILTROS>).map((f) => (
              <button key={f} onClick={() => setFiltro(f)}
                className={`text-sm rounded-full px-3 py-1 border ${filtro === f ? "border-[var(--color-gold)] bg-[var(--color-gold)]/15 text-[var(--text-primary)]" : "border-[var(--border-color)] text-[var(--text-secondary)]"}`}>
                {FILTROS[f].rotulo}
              </button>
            ))}
          </div>
          <Input placeholder="Buscar nome, nº ou curso" value={busca} onChange={(e) => setBusca(e.target.value)}
            className="h-8 w-60 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--text-tertiary)]">
              <tr><th className="py-2 pr-3">Nº</th><th className="pr-3">Participante</th><th className="pr-3">Curso</th><th className="pr-3"><span className="inline-flex items-center gap-1"><Film size={14} /> Videoaula</span></th><th className="pr-3"><span className="inline-flex items-center gap-1"><FileText size={14} /> Portfólio</span></th><th>Último envio</th></tr>
            </thead>
            <tbody className="text-[var(--text-primary)] align-top">
              {lista.map((p) => (
                <tr key={p.numero} className="border-t border-[var(--border-color)]">
                  <td className="py-2 pr-3 tabular-nums">{p.numero}</td>
                  <td className="pr-3">
                    <span className="flex items-center gap-1.5">
                      {p.completo ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> : <MinusCircle size={14} className="text-amber-400 shrink-0" />}
                      {p.nome}
                    </span>
                    <span className="block text-xs text-[var(--text-tertiary)]">{p.email}</span>
                  </td>
                  <td className="pr-3 text-xs">{p.curso}{painel.instituicoes.length > 1 && <span className="text-[var(--text-tertiary)]"> · {p.instituicao}</span>}</td>
                  <td className="pr-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${VIDEO[p.video].classe}`}>{VIDEO[p.video].rotulo}</span></td>
                  <td className="pr-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.portfolio ? "text-emerald-300 bg-emerald-500/10" : "text-amber-300 bg-amber-500/10"}`}>
                      {p.portfolio ? "Enviado" : "Não enviado"}
                    </span>
                  </td>
                  <td className="text-xs tabular-nums">{dataHora(p.ultimoEnvioEm)}</td>
                </tr>
              ))}
              {!lista.length && (
                <tr><td colSpan={6} className="py-6 text-center text-[var(--text-tertiary)]">Nenhum participante {painel.participantes.length ? "neste filtro" : "classificado da sua instituição"}.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] mt-3">
          A página se atualiza a cada minuto. Os arquivos ficam disponíveis apenas para a banca avaliadora.
        </p>
      </div>
    </div>
  );
}

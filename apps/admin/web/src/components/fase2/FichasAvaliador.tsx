"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";

interface Criterio { chave: string; nome: string; descricao: string; max: number }
interface Ficha {
  id: string;
  status: "PENDENTE" | "CONCLUIDA";
  atribuidoEm: string;
  concluidoEm: string | null;
  participante: { numero: number; nome: string; instituicao: string; curso: string };
  tema: string | null;
  videoLink: string | null;
  portfolioLink: string | null;
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

const cartao = "border border-[#2a2a3a] rounded-2xl p-5 bg-[#12121a]";

export default function FichasAvaliador() {
  const [criterios, setCriterios] = useState<Criterio[]>([]);
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
    api.get<{ criterios: Criterio[]; atribuicoes: Ficha[] }>("/avaliador/fase2/atribuicoes")
      .then(({ data }) => { setCriterios(data.criterios); setFichas(data.atribuicoes); })
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

  const corpo = () => ({
    notas: Object.fromEntries(criterios.map((c) => [c.chave, notas[c.chave] === "" ? null : Number(notas[c.chave].replace(",", "."))])),
    parecer,
  });

  const total = criterios.reduce((s, c) => {
    const v = Number((notas[c.chave] ?? "").replace(",", "."));
    return s + (Number.isFinite(v) ? v : 0);
  }, 0);
  const foraDoLimite = criterios.filter((c) => {
    const t = notas[c.chave];
    if (!t) return false;
    const v = Number(t.replace(",", "."));
    return !Number.isFinite(v) || v < 0 || v > c.max;
  });
  const completo = criterios.every((c) => notas[c.chave]) && foraDoLimite.length === 0;

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
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (aberta) {
    const travada = aberta.status === "CONCLUIDA";
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <button className="text-sm text-[#E8B829] hover:underline flex items-center gap-1" onClick={() => { setAberta(null); setAviso(""); setErro(""); }}>
          <ArrowLeft size={14} /> Voltar à lista
        </button>
        <div className={cartao}>
          <p className="text-xs uppercase tracking-widest text-[#9895a4]">Participante nº {aberta.participante.numero}</p>
          <h1 className="text-xl font-bold text-[#f0ece4] mt-1">{aberta.participante.nome}</h1>
          <p className="text-sm text-[#9895a4]">{aberta.participante.instituicao} · {aberta.participante.curso}</p>
          <p className="text-sm text-[#f0ece4] mt-3"><span className="text-[#E8B829]">Tema:</span> {aberta.tema}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            {aberta.videoLink && (
              <a href={aberta.videoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[#3AAFE0]/50 px-3 py-1.5 text-sm text-[#3AAFE0] hover:bg-[#3AAFE0]/10">
                <ExternalLink size={14} /> Abrir videoaula
              </a>
            )}
            {aberta.portfolioLink && (
              <a href={aberta.portfolioLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[#3AAFE0]/50 px-3 py-1.5 text-sm text-[#3AAFE0] hover:bg-[#3AAFE0]/10">
                <ExternalLink size={14} /> Abrir portfólio
              </a>
            )}
          </div>
          <p className="text-xs text-[#9895a4] mt-3">Envio: {dataHora(aberta.enviadoEm)} · Recebido para avaliação: {dataHora(aberta.atribuidoEm)}</p>
        </div>

        <div className={`${cartao} space-y-4`}>
          <h2 className="text-base font-bold text-[#f0ece4]">Critérios de avaliação</h2>
          {criterios.map((c) => {
            const invalido = foraDoLimite.some((x) => x.chave === c.chave);
            return (
              <div key={c.chave} className="flex items-start justify-between gap-4 border-t border-[#2a2a3a] pt-3 first:border-0 first:pt-0">
                <div>
                  <p className="font-semibold text-[#f0ece4]">{c.nome}</p>
                  <p className="text-sm text-[#9895a4]">{c.descricao}</p>
                  {invalido && <p className="text-xs text-red-300 mt-1">A nota deve estar entre 0 e {c.max}.</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number" inputMode="decimal" min={0} max={c.max} step={0.5} disabled={travada}
                    value={notas[c.chave] ?? ""}
                    onChange={(e) => setNotas((n) => ({ ...n, [c.chave]: e.target.value }))}
                    className={`w-20 h-9 rounded-md bg-[#0a0a0f] border ${invalido ? "border-red-400" : "border-[#2a2a3a]"} text-[#f0ece4] text-right px-2`}
                  />
                  <span className="text-sm text-[#9895a4] w-10">/ {c.max}</span>
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between border-t border-[#E8B829]/40 pt-3">
            <p className="font-bold text-[#f0ece4]">Total</p>
            <p className="text-2xl font-bold text-[#E8B829] tabular-nums">{Math.round(total * 10) / 10} <span className="text-sm text-[#9895a4]">/ 100</span></p>
          </div>
          <div>
            <p className="font-semibold text-[#f0ece4] mb-1">Parecer</p>
            <textarea value={parecer} onChange={(e) => setParecer(e.target.value)} disabled={travada} rows={5} maxLength={5000}
              className="w-full rounded-md bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] p-3 text-sm" placeholder="Comentários sobre a videoaula e o portfólio" />
          </div>
          {aviso && <p className="text-sm p-2 rounded bg-emerald-500/10 text-emerald-300">{aviso}</p>}
          {erro && <p className="text-sm p-2 rounded bg-red-500/10 text-red-300">{erro}</p>}
          {travada ? (
            <p className="text-sm text-emerald-300 flex items-center gap-2"><CheckCircle2 size={16} /> Avaliação concluída em {dataHora(aberta.concluidoEm)}.</p>
          ) : (
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" disabled={salvando || foraDoLimite.length > 0} onClick={() => salvar(false)}>Salvar rascunho</Button>
              <Button disabled={salvando || !completo} onClick={() => setConfirmar(true)} style={{ backgroundColor: "#4CAF50", color: "#fff" }}>Concluir avaliação</Button>
            </div>
          )}
        </div>

        <ConfirmDialog aberto={confirmar} onClose={() => setConfirmar(false)} onConfirm={() => salvar(true)} confirmando={salvando} variante="warning"
          titulo="Concluir a avaliação?"
          mensagem={`Total: ${Math.round(total * 10) / 10} pontos. Depois de concluída, a avaliação não pode mais ser alterada.`} />
      </div>
    );
  }

  const pendentes = fichas.filter((f) => f.status === "PENDENTE");
  const concluidas = fichas.filter((f) => f.status === "CONCLUIDA");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">Avaliação — Fase 2</h1>
        <p className="text-[#9895a4] text-sm mt-1">{pendentes.length} pendentes · {concluidas.length} concluídas</p>
      </div>
      {erro && <p className="text-sm p-3 rounded-lg bg-red-500/10 text-red-300">{erro}</p>}
      {!fichas.length && <div className={cartao}><p className="text-[#9895a4]">Nenhum participante foi atribuído a você ainda.</p></div>}
      {[{ t: "Pendentes", l: pendentes }, { t: "Concluídas", l: concluidas }].map(({ t, l }) =>
        l.length ? (
          <div key={t} className={cartao}>
            <h2 className="text-base font-bold text-[#f0ece4] mb-3">{t}</h2>
            <ul className="divide-y divide-[#2a2a3a]">
              {l.map((f) => (
                <li key={f.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[#f0ece4]">{f.participante.nome} <span className="text-xs text-[#9895a4]">nº {f.participante.numero} · {f.participante.instituicao}</span></p>
                    <p className="text-xs text-[#9895a4]">
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

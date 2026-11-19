"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { MathText } from "@/components/ui/math-text";
import { CheckCircle2, Clock, MinusCircle, XCircle } from "lucide-react";

interface Item {
  numero: number;
  enunciado: string;
  alternativas: Array<{ letra: string; texto: string }>;
  marcada: string | null;
  correta: string;
  acertou: boolean;
}
type Revisao =
  | { disponivel: false }
  | { disponivel: true; participou: false }
  | { disponivel: true; participou: true; prova: string; nota: number | null; itens: Item[]; acertos: number; total: number };

const cartao = "border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)]";
const titulo = "text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]";

function Situacao({ item }: { item: Item }) {
  if (item.acertou) return <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 rounded-full px-2.5 py-1"><CheckCircle2 size={14} /> Acertou</span>;
  if (!item.marcada) return <span className="flex items-center gap-1 text-xs font-semibold text-amber-300 bg-amber-500/10 rounded-full px-2.5 py-1"><MinusCircle size={14} /> Em branco</span>;
  return <span className="flex items-center gap-1 text-xs font-semibold text-red-300 bg-red-500/10 rounded-full px-2.5 py-1"><XCircle size={14} /> Errou</span>;
}

export default function RevisaoFase1Page() {
  const [r, setR] = useState<Revisao | null>(null);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<"todas" | "acertos" | "erros">("todas");

  useEffect(() => {
    api.get<Revisao>("/revisao-fase1/minha").then(({ data }) => setR(data)).catch(() => setErro("Não foi possível carregar a revisão. Recarregue a página."));
  }, []);

  const itens = useMemo(() => {
    if (!r || !r.disponivel || !r.participou) return [];
    return r.itens.filter((i) => filtro === "todas" || (filtro === "acertos" ? i.acertou : !i.acertou));
  }, [r, filtro]);

  if (!r) {
    return (
      <div className="flex items-center justify-center h-64">
        {erro ? <p className="text-red-300">{erro}</p> : <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className={titulo}>Revisão da Fase 1</h1>
        <p className="text-[var(--text-tertiary)] mt-1">Suas respostas comparadas ao gabarito oficial</p>
      </div>

      {!r.disponivel ? (
        <div className={`${cartao} flex items-center gap-3`}>
          <Clock className="text-[var(--color-gold-ink)] shrink-0" size={20} />
          <p className="text-[var(--text-secondary)]">A revisão da Fase 1 ainda não foi liberada pela Comissão Organizadora.</p>
        </div>
      ) : !r.participou ? (
        <div className={cartao}><p className="text-[var(--text-secondary)]">Não encontramos uma prova da Fase 1 realizada por você.</p></div>
      ) : (
        <>
          <div className={`${cartao} grid gap-4 sm:grid-cols-3 text-center`}>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Acertos</p>
              <p className="text-3xl font-bold text-emerald-300 tabular-nums mt-1">{r.acertos}<span className="text-lg text-[var(--text-tertiary)]"> / {r.total}</span></p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Erros e em branco</p>
              <p className="text-3xl font-bold text-red-300 tabular-nums mt-1">{r.total - r.acertos}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Nota da Fase 1</p>
              <p className="text-3xl font-bold text-[var(--text-primary)] tabular-nums mt-1">{r.nota != null ? r.nota.toLocaleString("pt-BR") : "—"}</p>
            </div>
            <div className="sm:col-span-3 flex flex-wrap justify-center gap-1.5 pt-1">
              {r.itens.map((i) => (
                <a key={i.numero} href={`#q${i.numero}`} title={`Questão ${i.numero}`}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center tabular-nums ${i.acertou ? "bg-emerald-500/15 text-emerald-300" : i.marcada ? "bg-red-500/15 text-red-300" : "bg-amber-500/15 text-amber-300"}`}>
                  {i.numero}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["todas", "acertos", "erros"] as const).map((f) => (
              <button key={f} onClick={() => setFiltro(f)}
                className={`text-sm whitespace-nowrap rounded-full px-3 py-1 border ${filtro === f ? "border-[var(--color-gold)] bg-[var(--color-gold)]/15 text-[var(--text-primary)]" : "border-[var(--border-color)] text-[var(--text-secondary)]"}`}>
                {f === "todas" ? `Todas (${r.total})` : f === "acertos" ? `Acertos (${r.acertos})` : `Erros e em branco (${r.total - r.acertos})`}
              </button>
            ))}
          </div>

          {itens.map((item) => (
            <div key={item.numero} id={`q${item.numero}`} className={`${cartao} space-y-4 scroll-mt-28`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">Questão {item.numero}</h2>
                <Situacao item={item} />
              </div>
              <div className="text-[var(--text-primary)] leading-relaxed"><MathText text={item.enunciado} /></div>
              <div className="space-y-2">
                {item.alternativas.map((a) => {
                  const correta = a.letra === item.correta;
                  const marcada = a.letra === item.marcada;
                  const estilo = correta
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : marcada
                      ? "border-red-500/60 bg-red-500/10"
                      : "border-[var(--border-color)] bg-[var(--bg-primary)]";
                  return (
                    <div key={a.letra} className={`rounded-xl border p-3 flex gap-3 ${estilo}`}>
                      <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${correta ? "bg-emerald-500 text-white" : marcada ? "bg-red-500 text-white" : "bg-[var(--border-color)] text-[var(--text-secondary)]"}`}>{a.letra}</span>
                      <div className="flex-1 text-sm text-[var(--text-primary)] min-w-0"><MathText text={a.texto} /></div>
                      <div className="shrink-0 text-xs font-semibold self-center text-right">
                        {correta && <span className="block text-emerald-300">Gabarito</span>}
                        {marcada && <span className={`block ${correta ? "text-emerald-300" : "text-red-300"}`}>Sua resposta</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {!item.marcada && <p className="text-xs text-amber-300">Você não marcou nenhuma alternativa nesta questão.</p>}
            </div>
          ))}

          <p className="text-xs text-[var(--text-tertiary)] text-center">
            As alternativas aparecem na mesma ordem em que você as viu durante a prova.
          </p>
        </>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Eye, EyeOff, ListChecks } from "lucide-react";

interface Situacao {
  edicao: string;
  publicadaEm: string | null;
  prova: string | null;
  questoes: number;
  semGabarito: number | null;
}

function mensagemErro(err: unknown, padrao: string) {
  const m = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  if (typeof m === "string") return m;
  if (Array.isArray(m)) return m.join(" ");
  return padrao;
}

/** Admin: libera (ou oculta) a revisão da Fase 1 para os participantes. */
export function PublicarRevisaoFase1() {
  const [s, setS] = useState<Situacao | null>(null);
  const [confirmar, setConfirmar] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = useCallback(() => {
    api.get<Situacao>("/revisao-fase1/situacao").then(({ data }) => setS(data)).catch(() => setS(null));
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  if (!s) return null;
  const publicada = !!s.publicadaEm;
  const pronta = s.questoes > 0 && s.semGabarito === 0;

  const alternar = async () => {
    setOcupado(true);
    setErro("");
    try {
      const { data } = await api.post<Situacao>("/revisao-fase1/publicar", { publicar: !publicada });
      setS(data);
      setConfirmar(false);
    } catch (e) {
      setErro(mensagemErro(e, "Não foi possível concluir a ação."));
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className="border border-[var(--border-color)] rounded-2xl p-5 bg-[var(--bg-secondary)] flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-[var(--color-gold)]/15 p-2.5"><ListChecks className="text-[var(--color-gold-ink)]" size={22} /></div>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">Revisão da Fase 1 pelos participantes</p>
          <p className="text-sm text-[var(--text-secondary)]">
            {publicada
              ? `Publicada em ${new Date(s.publicadaEm!).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}: cada participante vê as próprias respostas comparadas ao gabarito oficial.`
              : "Oculta. Ao publicar, cada participante passa a ver as questões, a alternativa que marcou, a correta e o total de acertos."}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            {s.prova ? `${s.prova} · ${s.questoes} questões` : "Nenhuma prova da Fase 1"}
            {s.semGabarito ? ` · ${s.semGabarito} sem gabarito` : ""}
          </p>
          {erro && <p className="text-sm text-red-400 mt-1">{erro}</p>}
        </div>
      </div>
      <Button
        disabled={ocupado || (!publicada && !pronta)}
        onClick={() => setConfirmar(true)}
        variant={publicada ? "outline" : "default"}
        style={publicada ? undefined : { backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}
        className="gap-2"
      >
        {publicada ? <><EyeOff size={16} /> Ocultar revisão</> : <><Eye size={16} /> Publicar revisão</>}
      </Button>
      <ConfirmDialog
        aberto={confirmar}
        onClose={() => setConfirmar(false)}
        onConfirm={alternar}
        confirmando={ocupado}
        variante="warning"
        titulo={publicada ? "Ocultar a revisão da Fase 1?" : "Publicar a revisão da Fase 1?"}
        mensagem={
          publicada
            ? "Os participantes deixam de ver a revisão até que ela seja publicada de novo. A ação fica registrada na auditoria."
            : "Todos os participantes que fizeram a prova passam a ver, no painel, as questões da Fase 1, as próprias respostas, o gabarito oficial e o total de acertos. A ação fica registrada na auditoria e pode ser desfeita."
        }
      />
    </div>
  );
}

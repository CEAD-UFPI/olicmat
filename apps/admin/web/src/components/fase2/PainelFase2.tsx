"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { tinta } from "@/lib/tema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AlertTriangle, Download, Mail, RefreshCw, Users } from "lucide-react";

interface Atribuicao {
  id: string;
  ordem: number;
  status: "PENDENTE" | "CONCLUIDA";
  avaliadorId: string;
  avaliador: string;
  atribuidoEm: string;
  concluidoEm: string | null;
  horasComAvaliador: number;
  nota: number | null;
}
interface Participante {
  inscricaoId: string;
  numero: number;
  nome: string;
  email: string;
  instituicao: string;
  ultimoEnvio: {
    enviadoEm: string;
    videoLink: string | null;
    portfolioLink: string | null;
    video: { nome: string; bytes: number | null; url: string | null; processamento?: string } | null;
    portfolio: { nome: string; bytes: number | null; url: string | null } | null;
  } | null;
  envioCompleto: boolean;
  totalEnvios: number;
  reenvioLiberado?: { video: boolean; portfolio: boolean };
  emailInicio: { status: string; erro: string | null } | null;
  fase2Nota: number | null;
  situacaoAvaliacao: string;
  atribuicoes: Atribuicao[];
}
interface Painel {
  agora: string;
  edicao: { id: string; titulo: string };
  tema: string | null;
  inicioEm: string | null;
  prazoEm: string | null;
  iniciadaPor: string | null;
  situacao: "NAO_INICIADA" | "ABERTA" | "ENCERRADA";
  distribuida: boolean;
  alertaHoras: number;
  videos?: { PENDENTE: number; PROCESSANDO: number; PRONTO: number; FALHA: number };
  totais: { classificados: number; enviaram: number; enviosCompletos: number; avaliados: number; terceiroAvaliador: number };
  emails: { enviados: number; falhas: number; pendentes: number };
  porInstituicao: Array<{ sigla: string; classificados: number; enviaram: number }>;
  avaliadores: Array<{ avaliadorId: string; nome: string; total: number; concluidas: number; pendentes: number; atrasadas: number; mediaHoras: number | null }>;
  participantes: Participante[];
}
interface Avaliador {
  id: string; nome: string; email: string;
  perfilPrincipal?: string; instituicao: string | null; externo: boolean; carga: number; capacidade: number;
}
interface ResumoDistribuicao {
  simulacao: boolean; participantes: number; avaliadores: number; atribuicoes: number;
  primeiroExterno: number; primeiroNaoExterno: number; vagasLivresPara3o: number; externos: number;
  cargas: Array<{ id: string; nome: string; instituicao: string | null; externo: boolean; carga: number }>;
  porInstituicao: Array<{ sigla: string; participantes: number }>;
}

const dataHora = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

function mensagemErro(err: unknown, padrao: string) {
  const m = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  if (Array.isArray(m)) return m.join(" ");
  if (typeof m === "string") return m;
  if (m && typeof m === "object") return Object.values(m).flat().join(" ");
  return padrao;
}

const SITUACAO: Record<string, { rotulo: string; cor: string }> = {
  SEM_ENVIO: { rotulo: "Sem envio", cor: "#9895a4" },
  AGUARDANDO_DISTRIBUICAO: { rotulo: "Aguardando distribuição", cor: "#3AAFE0" },
  EM_AVALIACAO: { rotulo: "Em avaliação", cor: "#E8B829" },
  TERCEIRO_AVALIADOR: { rotulo: "3º avaliador", cor: "#f08c3a" },
  CONCLUIDA: { rotulo: "Avaliado", cor: "#4CAF50" },
};

const cartao = "border border-[var(--border-color)] rounded-2xl p-5 bg-[var(--bg-secondary)]";

function Metrica({ rotulo, valor, detalhe }: { rotulo: string; valor: string | number; detalhe?: string }) {
  return (
    <div className={cartao}>
      <p className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">{rotulo}</p>
      <p className="text-3xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{valor}</p>
      {detalhe && <p className="text-xs text-[var(--text-tertiary)] mt-1">{detalhe}</p>}
    </div>
  );
}

export default function PainelFase2() {
  const [painel, setPainel] = useState<Painel | null>(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [tema, setTema] = useState("");
  const [confirmarInicio, setConfirmarInicio] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [avaliadores, setAvaliadores] = useState<Avaliador[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [confirmarDistribuicao, setConfirmarDistribuicao] = useState(false);
  const [simulacao, setSimulacao] = useState<ResumoDistribuicao | null>(null);
  const [filtro, setFiltro] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState("");
  const [remanejando, setRemanejando] = useState<{ atribuicao: Atribuicao; participante: string; instituicao: string; ja: string[] } | null>(null);
  const [novoAvaliador, setNovoAvaliador] = useState("");
  const [liberando, setLiberando] = useState<Participante | null>(null);
  const [tipoReenvio, setTipoReenvio] = useState<"video" | "portfolio">("video");
  const [motivo, setMotivo] = useState("");

  const abrirLiberacao = (p: Participante) => {
    setLiberando(p);
    setTipoReenvio(p.ultimoEnvio?.video ? "video" : "portfolio");
    setMotivo("");
  };
  const revogar = (p: Participante, tipo: "video" | "portfolio") =>
    acao(async () => {
      await api.post(`/admin/fase2/participantes/${p.inscricaoId}/reenvio`, { tipo, liberar: false });
      return `Liberação revogada: ${p.nome} (${tipo === "video" ? "vídeo" : "portfólio"}).`;
    });

  const carregar = useCallback(() => {
    api.get<Painel>("/admin/fase2/painel")
      .then(({ data }) => { setPainel(data); setErro(""); })
      .catch((e) => setErro(mensagemErro(e, "Erro ao carregar o painel da Fase 2.")));
  }, []);

  useEffect(() => {
    carregar();
    api.get<Avaliador[]>("/admin/fase2/avaliadores").then(({ data }) => setAvaliadores(data)).catch(() => {});
    const t = setInterval(carregar, 30_000);
    return () => clearInterval(t);
  }, [carregar]);

  const acao = async (fn: () => Promise<string>) => {
    setOcupado(true);
    setErro("");
    setAviso("");
    try {
      setAviso(await fn());
      carregar();
    } catch (e) {
      setErro(mensagemErro(e, "Não foi possível concluir a ação."));
    } finally {
      setOcupado(false);
    }
  };

  const iniciar = () =>
    acao(async () => {
      const { data } = await api.post("/admin/fase2/iniciar", { tema: tema.trim() });
      setConfirmarInicio(false);
      return `Fase 2 iniciada. Prazo final: ${dataHora(data.prazoEm)}. Os e-mails estão sendo enviados aos ${data.classificados} classificados.`;
    });

  const simular = () =>
    acao(async () => {
      const { data } = await api.post<ResumoDistribuicao>("/admin/fase2/distribuir", { avaliadorIds: selecionados, simular: true });
      setSimulacao(data);
      return `Simulação pronta: confira o resultado abaixo antes de confirmar.`;
    });

  const distribuir = () =>
    acao(async () => {
      const { data } = await api.post<ResumoDistribuicao>("/admin/fase2/distribuir", { avaliadorIds: selecionados });
      setConfirmarDistribuicao(false);
      setSimulacao(null);
      api.get<Avaliador[]>("/admin/fase2/avaliadores").then(({ data: av }) => setAvaliadores(av)).catch(() => {});
      return `Distribuição concluída: ${data.participantes} participantes, ${data.atribuicoes} avaliações entre ${data.avaliadores} avaliadores; ${data.primeiroExterno} com 1º avaliador externo.`;
    });

  const exportar = async () => {
    const { data } = await api.get("/admin/fase2/exportar", { responseType: "blob" });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "olicmat-fase2.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lista = useMemo(() => {
    if (!painel) return [];
    const f = filtro.trim().toLowerCase();
    return painel.participantes.filter(
      (p) =>
        (!filtroSituacao || p.situacaoAvaliacao === filtroSituacao) &&
        (!f || p.nome.toLowerCase().includes(f) || String(p.numero).includes(f) || p.instituicao.toLowerCase().includes(f)),
    );
  }, [painel, filtro, filtroSituacao]);

  if (!painel) {
    return (
      <div className="flex items-center justify-center h-64">
        {erro ? <p className="text-red-300">{erro}</p> : <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />}
      </div>
    );
  }

  const { totais } = painel;
  const restanteH = painel.prazoEm ? Math.max(0, (new Date(painel.prazoEm).getTime() - new Date(painel.agora).getTime()) / 3600_000) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">Fase 2 — Envio e Avaliação</h1>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">{painel.edicao.titulo}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={carregar}><RefreshCw size={14} className="mr-1" /> Atualizar</Button>
          <Button variant="outline" size="sm" onClick={exportar}><Download size={14} className="mr-1" /> Exportar CSV</Button>
        </div>
      </div>

      {aviso && <p className="text-sm p-3 rounded-lg bg-emerald-500/10 text-emerald-300">{aviso}</p>}
      {erro && <p className="text-sm p-3 rounded-lg bg-red-500/10 text-red-300">{erro}</p>}

      {/* Início */}
      {painel.situacao === "NAO_INICIADA" ? (
        <div className={`${cartao} space-y-4`}>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Iniciar a Fase 2</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Informe a competência específica da BNCC sorteada pela Comissão. Ao iniciar, o prazo de <strong>24 horas</strong> começa a contar
            para todos os {totais.classificados} classificados, o início é registrado na auditoria e cada
            classificado recebe um e-mail com a competência, a data e a hora do início e o prazo final.
            <strong> O início não pode ser desfeito.</strong>
          </p>
          {totais.classificados === 0 && (
            <p className="text-sm text-amber-300 flex items-center gap-2"><AlertTriangle size={16} /> A relação de classificados ainda não foi carregada no sistema.</p>
          )}
          <div>
            <Label htmlFor="tema" className="text-[var(--text-primary)]">Competência sorteada</Label>
            <Input id="tema" value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ex.: Competência específica 3 — Modelar, resolver problemas e avaliar resultados"
              className="mt-1.5 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" />
          </div>
          <Button disabled={ocupado || tema.trim().length < 3 || totais.classificados === 0} onClick={() => setConfirmarInicio(true)}
            style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}>
            Iniciar Fase 2
          </Button>
        </div>
      ) : (
        <div className={`${cartao} grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm`}>
          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-xs uppercase tracking-widest text-[var(--color-gold-ink)]">Competência sorteada</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">{painel.tema}</p>
          </div>
          <div><p className="text-[var(--text-tertiary)]">Início</p><p className="text-[var(--text-primary)]">{dataHora(painel.inicioEm)}</p></div>
          <div><p className="text-[var(--text-tertiary)]">Prazo final</p><p className="text-[var(--text-primary)]">{dataHora(painel.prazoEm)}</p></div>
          <div><p className="text-[var(--text-tertiary)]">Iniciada por</p><p className="text-[var(--text-primary)]">{painel.iniciadaPor ?? "—"}</p></div>
          <div>
            <p className="text-[var(--text-tertiary)]">Situação</p>
            <p className={painel.situacao === "ABERTA" ? "text-emerald-300 font-semibold" : "text-red-300 font-semibold"}>
              {painel.situacao === "ABERTA" ? `Envio aberto (${restanteH.toFixed(1)} h restantes)` : "Envio encerrado"}
            </p>
          </div>
        </div>
      )}

      {/* Números */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metrica rotulo="Classificados" valor={totais.classificados} />
        <Metrica rotulo="Enviaram" valor={totais.enviaram} detalhe={`${totais.enviosCompletos} completos · ${totais.classificados - totais.enviaram} sem envio${painel.videos ? ` · vídeos: ${painel.videos.PRONTO} prontos, ${painel.videos.PENDENTE + painel.videos.PROCESSANDO} em preparo${painel.videos.FALHA ? `, ${painel.videos.FALHA} com falha` : ""}` : ""}`} />
        <Metrica rotulo="Avaliados" valor={totais.avaliados} detalhe={`${totais.terceiroAvaliador} com 3º avaliador`} />
        <div className={cartao}>
          <p className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-1"><Mail size={12} /> E-mails de início</p>
          <p className="text-sm text-[var(--text-primary)] mt-2">{painel.emails.enviados} enviados · {painel.emails.pendentes} na fila</p>
          <p className={`text-sm ${painel.emails.falhas ? "text-red-300" : "text-[var(--text-tertiary)]"}`}>{painel.emails.falhas} com falha</p>
          {painel.emails.falhas > 0 && (
            <Button size="sm" variant="outline" className="mt-2" disabled={ocupado}
              onClick={() => acao(async () => { await api.post("/admin/fase2/emails/reenviar"); return "Reenvio das falhas iniciado."; })}>
              Reenviar falhas
            </Button>
          )}
        </div>
      </div>

      {/* Por instituição */}
      <div className={cartao}>
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">Envios por instituição</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {painel.porInstituicao.map((i) => (
            <div key={i.sigla} className="rounded-xl bg-[var(--bg-primary)] p-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{i.sigla}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{i.enviaram} de {i.classificados} enviaram</p>
              <div className="h-1.5 bg-[var(--border-color)] rounded mt-2">
                <div className="h-1.5 bg-[var(--color-gold)] rounded" style={{ width: `${i.classificados ? (100 * i.enviaram) / i.classificados : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribuição */}
      {painel.situacao === "ENCERRADA" && !painel.distribuida && (() => {
        const escolhidos = avaliadores.filter((a) => selecionados.includes(a.id));
        const vagas = escolhidos.reduce((s, a) => s + Math.max(0, a.capacidade - a.carga), 0);
        const necessarias = totais.enviaram * 2;
        const externosSel = escolhidos.filter((a) => a.externo).length;
        const semInst = escolhidos.filter((a) => !a.instituicao);
        const alternar = (ids: string[], marcar: boolean) => {
          setSimulacao(null);
          setSelecionados((s) => (marcar ? [...new Set([...s, ...ids])] : s.filter((x) => !ids.includes(x))));
        };
        return (
        <div className={`${cartao} space-y-4`}>
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2"><Users size={16} /> Distribuir aos avaliadores</h2>
          <div className="text-sm text-[var(--text-secondary)] space-y-1">
            <p>Regras aplicadas automaticamente:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>cada avaliador recebe <strong>no máximo 10</strong> participantes (incluindo eventuais 3ªs avaliações);</li>
              <li>o <strong>1º avaliador é EXTERNO</strong>; se os externos lotarem, é de instituição diferente da do participante;</li>
              <li>o <strong>2º e o 3º</strong> avaliadores são de <strong>instituição diferente</strong> da do participante;</li>
              <li>se as notas diferirem mais de 20 pontos, o 3º avaliador é chamado automaticamente, pelas mesmas regras.</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button className="rounded-full border border-[var(--border-color)] px-3 py-1 hover:border-[var(--color-gold)]" onClick={() => alternar(avaliadores.filter((a) => a.instituicao).map((a) => a.id), true)}>Marcar todos (com instituição)</button>
            <button className="rounded-full border border-[var(--border-color)] px-3 py-1 hover:border-[var(--color-gold)]" onClick={() => alternar(avaliadores.filter((a) => a.externo).map((a) => a.id), true)}>Marcar externos</button>
            <button className="rounded-full border border-[var(--border-color)] px-3 py-1 hover:border-[var(--color-gold)]" onClick={() => alternar(avaliadores.map((a) => a.id), false)}>Desmarcar todos</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {avaliadores.map((a) => (
              <label key={a.id} className="flex items-center gap-2 text-sm text-[var(--text-primary)] rounded-lg bg-[var(--bg-primary)] p-2 cursor-pointer">
                <input type="checkbox" checked={selecionados.includes(a.id)} onChange={(e) => alternar([a.id], e.target.checked)} />
                <span className="flex-1 min-w-0">
                  <span className="block truncate">{a.nome}</span>
                  <span className="block text-xs text-[var(--text-tertiary)] truncate">{a.email}</span>
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.externo ? "bg-[var(--color-gold)]/20 text-[var(--color-gold-ink)]" : a.instituicao ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)]" : "bg-red-500/10 text-red-300"}`}>
                  {a.instituicao ?? "sem instituição"}
                </span>
                {a.perfilPrincipal && a.perfilPrincipal !== "AVALIADOR" && <span className="text-[10px] text-[var(--text-tertiary)]">(também {a.perfilPrincipal === "COMISSAO" ? "Comissão" : a.perfilPrincipal})</span>}
              </label>
            ))}
            {!avaliadores.length && <p className="text-sm text-[var(--text-tertiary)]">Nenhum usuário com perfil de avaliador.</p>}
          </div>
          <div className={`rounded-lg p-3 text-sm ${vagas >= necessarias ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"}`}>
            {totais.enviaram} participantes × 2 = <strong>{necessarias}</strong> avaliações · {escolhidos.length} avaliadores selecionados ({externosSel} externos) × até 10 = <strong>{vagas}</strong> vagas
            {vagas >= necessarias ? ` · sobram ${vagas - necessarias} vagas para 3ªs avaliações` : ` · faltam ${necessarias - vagas} vagas: selecione mais avaliadores`}
            {semInst.length > 0 && <span className="block text-red-300 mt-1">{semInst.length} selecionado(s) sem instituição cadastrada: defina a instituição (ou EXTERNO) em Usuários antes de distribuir.</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={ocupado || selecionados.length < 3} onClick={simular}>Simular distribuição</Button>
            <Button disabled={ocupado || !simulacao || selecionados.length < 3} onClick={() => setConfirmarDistribuicao(true)}
              style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}>
              Confirmar distribuição
            </Button>
          </div>
          {simulacao && (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-4 space-y-3 text-sm">
              <p className="font-semibold text-[var(--text-primary)]">Resultado da simulação (nada foi gravado)</p>
              <ul className="space-y-1 text-[var(--text-secondary)]">
                <li>{simulacao.participantes} participantes · {simulacao.atribuicoes} avaliações · {simulacao.avaliadores} avaliadores</li>
                <li><strong className="text-[var(--text-primary)]">{simulacao.primeiroExterno}</strong> participantes com 1º avaliador externo{simulacao.primeiroNaoExterno > 0 && <> · <span className="text-amber-300">{simulacao.primeiroNaoExterno} com 1º de outra instituição (externos lotados)</span></>}</li>
                <li>{simulacao.vagasLivresPara3o} vagas livres para eventuais 3ªs avaliações</li>
                <li>Participantes por instituição: {simulacao.porInstituicao.map((x) => `${x.sigla} ${x.participantes}`).join(" · ")}</li>
              </ul>
              <div className="grid gap-1 sm:grid-cols-2">
                {simulacao.cargas.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-2 rounded bg-[var(--bg-secondary)] px-2 py-1">
                    <span className="truncate">{c.nome} <span className="text-xs text-[var(--text-tertiary)]">{c.instituicao}</span></span>
                    <span className="tabular-nums font-semibold">{c.carga}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">Ao confirmar, uma nova distribuição é calculada com as mesmas regras (os nomes podem mudar, os totais se mantêm). A distribuição é feita uma única vez.</p>
            </div>
          )}
        </div>
        );
      })()}

      {/* Avaliadores */}
      {painel.avaliadores.length > 0 && (
        <div className={cartao}>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">Avaliadores</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--text-tertiary)]">
                <tr><th className="py-2 pr-3">Avaliador</th><th className="pr-3">Recebidos</th><th className="pr-3">Concluídos</th><th className="pr-3">Pendentes</th><th className="pr-3">Pendentes &gt; {painel.alertaHoras} h</th><th>Tempo médio</th></tr>
              </thead>
              <tbody className="text-[var(--text-primary)]">
                {painel.avaliadores.map((a) => (
                  <tr key={a.avaliadorId} className="border-t border-[var(--border-color)]">
                    <td className="py-2 pr-3">{a.nome}</td>
                    <td className="pr-3">{a.total}</td>
                    <td className="pr-3">{a.concluidas}</td>
                    <td className="pr-3">{a.pendentes}</td>
                    <td className={`pr-3 ${a.atrasadas ? "text-red-300 font-semibold" : ""}`}>{a.atrasadas}</td>
                    <td>{a.mediaHoras != null ? `${a.mediaHoras} h` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Participantes */}
      <div className={cartao}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Participantes ({lista.length})</h2>
          <div className="flex gap-2">
            <Input placeholder="Buscar nome, nº ou instituição" value={filtro} onChange={(e) => setFiltro(e.target.value)}
              className="h-8 w-60 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" />
            <select value={filtroSituacao} onChange={(e) => setFiltroSituacao(e.target.value)}
              className="h-8 rounded-md bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm px-2">
              <option value="">Todas as situações</option>
              {Object.entries(SITUACAO).map(([k, v]) => <option key={k} value={k}>{v.rotulo}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--text-tertiary)]">
              <tr><th className="py-2 pr-3">Nº</th><th className="pr-3">Participante</th><th className="pr-3">Inst.</th><th className="pr-3">Envio</th><th className="pr-3">Avaliações</th><th className="pr-3">Nota</th><th>Situação</th></tr>
            </thead>
            <tbody className="text-[var(--text-primary)] align-top">
              {lista.map((p) => {
                const s = SITUACAO[p.situacaoAvaliacao] ?? { rotulo: p.situacaoAvaliacao, cor: "#9895a4" };
                return (
                  <tr key={p.inscricaoId} className="border-t border-[var(--border-color)]">
                    <td className="py-2 pr-3 tabular-nums">{p.numero}</td>
                    <td className="pr-3">
                      {p.nome}
                      {p.emailInicio?.status === "FALHA" && <span className="block text-xs text-red-300">E-mail de início falhou</span>}
                    </td>
                    <td className="pr-3">{p.instituicao}</td>
                    <td className="pr-3">
                      {p.ultimoEnvio ? (
                        <>
                          <span className="block">{dataHora(p.ultimoEnvio.enviadoEm)}{p.totalEnvios > 1 && <span className="text-xs text-[var(--text-tertiary)]"> ({p.totalEnvios} envios)</span>}</span>
                          {(p.ultimoEnvio.video?.url ?? p.ultimoEnvio.videoLink) ? (
                            <a className="text-xs text-[var(--color-blue-ink)] hover:underline mr-2" href={p.ultimoEnvio.video?.url ?? p.ultimoEnvio.videoLink ?? undefined} target="_blank" rel="noopener noreferrer">vídeo</a>
                          ) : <span className="text-xs text-amber-300 mr-2">sem vídeo</span>}
                          {p.ultimoEnvio.video?.processamento && p.ultimoEnvio.video.processamento !== "PRONTO" && (
                            <span className={`text-xs mr-2 ${p.ultimoEnvio.video.processamento === "FALHA" ? "text-red-300" : "text-[var(--text-tertiary)]"}`}>
                              ({p.ultimoEnvio.video.processamento === "FALHA" ? "vídeo ilegível" : "preparando"})
                            </span>
                          )}
                          {(p.ultimoEnvio.portfolio?.url ?? p.ultimoEnvio.portfolioLink) ? (
                            <a className="text-xs text-[var(--color-blue-ink)] hover:underline" href={p.ultimoEnvio.portfolio?.url ?? p.ultimoEnvio.portfolioLink ?? undefined} target="_blank" rel="noopener noreferrer">portfólio</a>
                          ) : <span className="text-xs text-amber-300">sem portfólio</span>}
                          {(["video", "portfolio"] as const).filter((t) => p.reenvioLiberado?.[t]).map((t) => (
                            <span key={t} className="block text-xs text-[var(--color-blue-ink)]">
                              Reenvio liberado: {t === "video" ? "vídeo" : "portfólio"}{" "}
                              <button className="underline" disabled={ocupado} onClick={() => revogar(p, t)}>revogar</button>
                            </span>
                          ))}
                          {painel.situacao === "ABERTA" && (p.ultimoEnvio.video || p.ultimoEnvio.portfolio) && (
                            <button className="block text-xs text-[var(--color-gold-ink)] hover:underline mt-0.5" onClick={() => abrirLiberacao(p)}>
                              liberar reenvio
                            </button>
                          )}
                        </>
                      ) : <span className="text-[var(--text-tertiary)]">—</span>}
                    </td>
                    <td className="pr-3 text-xs space-y-1">
                      {p.atribuicoes.map((a) => (
                        <div key={a.id} className="flex items-center gap-2">
                          <span>{a.ordem}º {a.avaliador}:</span>
                          {a.status === "CONCLUIDA" ? (
                            <span className="text-emerald-300">{a.nota} pts em {a.horasComAvaliador} h</span>
                          ) : (
                            <>
                              <span className={a.horasComAvaliador > painel.alertaHoras ? "text-red-300 font-semibold" : "text-[var(--color-gold-ink)]"}>
                                pendente há {a.horasComAvaliador} h
                              </span>
                              <button className="text-[var(--color-blue-ink)] hover:underline" onClick={() => { setRemanejando({ atribuicao: a, participante: p.nome, instituicao: p.instituicao, ja: p.atribuicoes.map((x) => x.avaliadorId) }); setNovoAvaliador(""); }}>
                                remanejar
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                      {!p.atribuicoes.length && <span className="text-[var(--text-tertiary)]">—</span>}
                    </td>
                    <td className="pr-3 font-semibold">{p.fase2Nota ?? "—"}</td>
                    <td><span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: tinta(s.cor), backgroundColor: `${s.cor}22` }}>{s.rotulo}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        aberto={confirmarInicio}
        onClose={() => setConfirmarInicio(false)}
        onConfirm={iniciar}
        confirmando={ocupado}
        variante="warning"
        titulo="Iniciar a Fase 2?"
        mensagem={`Competência: "${tema.trim()}". O prazo de 24 horas começa agora para os ${totais.classificados} classificados, e todos recebem o e-mail de início. Esta ação não pode ser desfeita.`}
      />
      <ConfirmDialog
        aberto={confirmarDistribuicao}
        onClose={() => setConfirmarDistribuicao(false)}
        onConfirm={distribuir}
        confirmando={ocupado}
        variante="warning"
        titulo="Distribuir aos avaliadores?"
        mensagem={`${totais.enviaram} participantes serão distribuídos entre ${selecionados.length} avaliadores, 2 por participante, pelas regras (1º externo, instituição diferente, máximo 10). A distribuição é feita uma única vez e não pode ser desfeita.`}
      />

      {liberando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setLiberando(null)}>
          <div className={`${cartao} w-full max-w-md space-y-3`} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Liberar novo envio</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {liberando.nome} poderá enviar <strong>mais uma vez</strong> o arquivo escolhido, até o prazo final. O arquivo
              atual continua valendo até o novo envio terminar. A liberação fica registrada na auditoria e o participante é
              avisado por e-mail.
            </p>
            <div className="flex gap-2">
              {(["video", "portfolio"] as const).filter((t) => (t === "video" ? liberando.ultimoEnvio?.video : liberando.ultimoEnvio?.portfolio)).map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-[var(--text-primary)] rounded-lg bg-[var(--bg-primary)] px-3 py-2 cursor-pointer">
                  <input type="radio" name="tipoReenvio" checked={tipoReenvio === t} onChange={() => setTipoReenvio(t)} />
                  {t === "video" ? "Videoaula" : "Portfólio"}
                </label>
              ))}
            </div>
            <div>
              <Label htmlFor="motivoReenvio" className="text-[var(--text-primary)]">Motivo (obrigatório)</Label>
              <Input id="motivoReenvio" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: enviou o arquivo errado por engano (pedido pelo WhatsApp)"
                className="mt-1.5 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setLiberando(null)}>Cancelar</Button>
              <Button size="sm" disabled={motivo.trim().length < 5 || ocupado} style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}
                onClick={() => acao(async () => {
                  await api.post(`/admin/fase2/participantes/${liberando.inscricaoId}/reenvio`, { tipo: tipoReenvio, liberar: true, motivo: motivo.trim() });
                  const nome = liberando.nome;
                  setLiberando(null);
                  return `Novo envio liberado para ${nome} (${tipoReenvio === "video" ? "videoaula" : "portfólio"}).`;
                })}>
                Liberar
              </Button>
            </div>
          </div>
        </div>
      )}

      {remanejando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setRemanejando(null)}>
          <div className={`${cartao} w-full max-w-md space-y-3`} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Remanejar avaliação</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {remanejando.participante} ({remanejando.instituicao}): {remanejando.atribuicao.ordem}º avaliador atual é {remanejando.atribuicao.avaliador}.
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">Só aparecem avaliadores de outra instituição, com vaga (menos de 10) e que ainda não avaliam este participante.</p>
            <select value={novoAvaliador} onChange={(e) => setNovoAvaliador(e.target.value)}
              className="w-full h-9 rounded-md bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm px-2">
              <option value="">Escolha o novo avaliador</option>
              {avaliadores
                .filter((a) => !remanejando.ja.includes(a.id) && a.instituicao && a.instituicao !== remanejando.instituicao && a.carga < a.capacidade)
                .map((a) => <option key={a.id} value={a.id}>{a.nome} · {a.instituicao} · {a.carga}/{a.capacidade}</option>)}
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setRemanejando(null)}>Cancelar</Button>
              <Button size="sm" disabled={!novoAvaliador || ocupado} style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}
                onClick={() => acao(async () => {
                  await api.post(`/admin/fase2/atribuicoes/${remanejando.atribuicao.id}/remanejar`, { avaliadorId: novoAvaliador });
                  setRemanejando(null);
                  api.get<Avaliador[]>("/admin/fase2/avaliadores").then(({ data }) => setAvaliadores(data)).catch(() => {});
                  return "Avaliação remanejada.";
                })}>
                Remanejar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

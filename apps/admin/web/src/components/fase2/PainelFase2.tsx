"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
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
  ultimoEnvio: { videoLink: string; portfolioLink: string; enviadoEm: string } | null;
  totalEnvios: number;
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
  totais: { classificados: number; enviaram: number; avaliados: number; terceiroAvaliador: number };
  emails: { enviados: number; falhas: number; pendentes: number };
  porInstituicao: Array<{ sigla: string; classificados: number; enviaram: number }>;
  avaliadores: Array<{ avaliadorId: string; nome: string; total: number; concluidas: number; pendentes: number; atrasadas: number; mediaHoras: number | null }>;
  participantes: Participante[];
}
interface Avaliador { id: string; nome: string; email: string }

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

const cartao = "border border-[#2a2a3a] rounded-2xl p-5 bg-[#12121a]";

function Metrica({ rotulo, valor, detalhe }: { rotulo: string; valor: string | number; detalhe?: string }) {
  return (
    <div className={cartao}>
      <p className="text-xs uppercase tracking-widest text-[#9895a4]">{rotulo}</p>
      <p className="text-3xl font-bold text-[#f0ece4] mt-1 tabular-nums">{valor}</p>
      {detalhe && <p className="text-xs text-[#9895a4] mt-1">{detalhe}</p>}
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
  const [filtro, setFiltro] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState("");
  const [remanejando, setRemanejando] = useState<{ atribuicao: Atribuicao; participante: string } | null>(null);
  const [novoAvaliador, setNovoAvaliador] = useState("");

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

  const distribuir = () =>
    acao(async () => {
      const { data } = await api.post("/admin/fase2/distribuir", { avaliadorIds: selecionados });
      setConfirmarDistribuicao(false);
      return `Distribuição concluída: ${data.participantes} participantes, ${data.atribuicoes} avaliações entre ${data.avaliadores} avaliadores.`;
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
        {erro ? <p className="text-red-300">{erro}</p> : <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />}
      </div>
    );
  }

  const { totais } = painel;
  const restanteH = painel.prazoEm ? Math.max(0, (new Date(painel.prazoEm).getTime() - new Date(painel.agora).getTime()) / 3600_000) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">Fase 2 — Envio e Avaliação</h1>
          <p className="text-[#9895a4] text-sm mt-1">{painel.edicao.titulo}</p>
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
          <h2 className="text-lg font-bold text-[#f0ece4]">Iniciar a Fase 2</h2>
          <p className="text-sm text-[#b0adc0]">
            Informe o tema sorteado pela Comissão. Ao iniciar, o prazo de <strong>24 horas</strong> começa a contar
            para todos os {totais.classificados} classificados, o início é registrado na auditoria e cada
            classificado recebe um e-mail com o tema, a data e a hora do início e o prazo final.
            <strong> O início não pode ser desfeito.</strong>
          </p>
          {totais.classificados === 0 && (
            <p className="text-sm text-amber-300 flex items-center gap-2"><AlertTriangle size={16} /> A relação de classificados ainda não foi carregada no sistema.</p>
          )}
          <div>
            <Label htmlFor="tema" className="text-[#f0ece4]">Tema da videoaula</Label>
            <Input id="tema" value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Tema sorteado"
              className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" />
          </div>
          <Button disabled={ocupado || tema.trim().length < 3 || totais.classificados === 0} onClick={() => setConfirmarInicio(true)}
            style={{ backgroundColor: "#E8B829", color: "#0a0a0f" }}>
            Iniciar Fase 2
          </Button>
        </div>
      ) : (
        <div className={`${cartao} grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm`}>
          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-xs uppercase tracking-widest text-[#E8B829]">Tema</p>
            <p className="text-lg font-semibold text-[#f0ece4]">{painel.tema}</p>
          </div>
          <div><p className="text-[#9895a4]">Início</p><p className="text-[#f0ece4]">{dataHora(painel.inicioEm)}</p></div>
          <div><p className="text-[#9895a4]">Prazo final</p><p className="text-[#f0ece4]">{dataHora(painel.prazoEm)}</p></div>
          <div><p className="text-[#9895a4]">Iniciada por</p><p className="text-[#f0ece4]">{painel.iniciadaPor ?? "—"}</p></div>
          <div>
            <p className="text-[#9895a4]">Situação</p>
            <p className={painel.situacao === "ABERTA" ? "text-emerald-300 font-semibold" : "text-red-300 font-semibold"}>
              {painel.situacao === "ABERTA" ? `Envio aberto (${restanteH.toFixed(1)} h restantes)` : "Envio encerrado"}
            </p>
          </div>
        </div>
      )}

      {/* Números */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metrica rotulo="Classificados" valor={totais.classificados} />
        <Metrica rotulo="Enviaram" valor={totais.enviaram} detalhe={`${totais.classificados - totais.enviaram} sem envio`} />
        <Metrica rotulo="Avaliados" valor={totais.avaliados} detalhe={`${totais.terceiroAvaliador} com 3º avaliador`} />
        <div className={cartao}>
          <p className="text-xs uppercase tracking-widest text-[#9895a4] flex items-center gap-1"><Mail size={12} /> E-mails de início</p>
          <p className="text-sm text-[#f0ece4] mt-2">{painel.emails.enviados} enviados · {painel.emails.pendentes} na fila</p>
          <p className={`text-sm ${painel.emails.falhas ? "text-red-300" : "text-[#9895a4]"}`}>{painel.emails.falhas} com falha</p>
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
        <h2 className="text-base font-bold text-[#f0ece4] mb-3">Envios por instituição</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {painel.porInstituicao.map((i) => (
            <div key={i.sigla} className="rounded-xl bg-[#0a0a0f] p-3">
              <p className="text-sm font-semibold text-[#f0ece4]">{i.sigla}</p>
              <p className="text-xs text-[#9895a4]">{i.enviaram} de {i.classificados} enviaram</p>
              <div className="h-1.5 bg-[#2a2a3a] rounded mt-2">
                <div className="h-1.5 bg-[#E8B829] rounded" style={{ width: `${i.classificados ? (100 * i.enviaram) / i.classificados : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribuição */}
      {painel.situacao === "ENCERRADA" && !painel.distribuida && (
        <div className={`${cartao} space-y-3`}>
          <h2 className="text-base font-bold text-[#f0ece4] flex items-center gap-2"><Users size={16} /> Distribuir aos avaliadores</h2>
          <p className="text-sm text-[#b0adc0]">
            Cada participante que enviou recebe 2 avaliadores diferentes, em partes iguais. Se as notas diferirem
            mais de 20 pontos, o sistema chama automaticamente um 3º avaliador. Selecione pelo menos 3 avaliadores.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {avaliadores.map((a) => (
              <label key={a.id} className="flex items-center gap-2 text-sm text-[#f0ece4] rounded-lg bg-[#0a0a0f] p-2 cursor-pointer">
                <input type="checkbox" checked={selecionados.includes(a.id)}
                  onChange={(e) => setSelecionados((s) => (e.target.checked ? [...s, a.id] : s.filter((x) => x !== a.id)))} />
                {a.nome} <span className="text-[#9895a4] text-xs">{a.email}</span>
              </label>
            ))}
            {!avaliadores.length && <p className="text-sm text-[#9895a4]">Nenhum usuário com perfil de avaliador.</p>}
          </div>
          <Button disabled={ocupado || selecionados.length < 3} onClick={() => setConfirmarDistribuicao(true)}
            style={{ backgroundColor: "#E8B829", color: "#0a0a0f" }}>
            Distribuir {totais.enviaram} participantes entre {selecionados.length} avaliadores
          </Button>
        </div>
      )}

      {/* Avaliadores */}
      {painel.avaliadores.length > 0 && (
        <div className={cartao}>
          <h2 className="text-base font-bold text-[#f0ece4] mb-3">Avaliadores</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[#9895a4]">
                <tr><th className="py-2 pr-3">Avaliador</th><th className="pr-3">Recebidos</th><th className="pr-3">Concluídos</th><th className="pr-3">Pendentes</th><th className="pr-3">Pendentes &gt; {painel.alertaHoras} h</th><th>Tempo médio</th></tr>
              </thead>
              <tbody className="text-[#f0ece4]">
                {painel.avaliadores.map((a) => (
                  <tr key={a.avaliadorId} className="border-t border-[#2a2a3a]">
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
          <h2 className="text-base font-bold text-[#f0ece4]">Participantes ({lista.length})</h2>
          <div className="flex gap-2">
            <Input placeholder="Buscar nome, nº ou instituição" value={filtro} onChange={(e) => setFiltro(e.target.value)}
              className="h-8 w-60 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4]" />
            <select value={filtroSituacao} onChange={(e) => setFiltroSituacao(e.target.value)}
              className="h-8 rounded-md bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm px-2">
              <option value="">Todas as situações</option>
              {Object.entries(SITUACAO).map(([k, v]) => <option key={k} value={k}>{v.rotulo}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[#9895a4]">
              <tr><th className="py-2 pr-3">Nº</th><th className="pr-3">Participante</th><th className="pr-3">Inst.</th><th className="pr-3">Envio</th><th className="pr-3">Avaliações</th><th className="pr-3">Nota</th><th>Situação</th></tr>
            </thead>
            <tbody className="text-[#f0ece4] align-top">
              {lista.map((p) => {
                const s = SITUACAO[p.situacaoAvaliacao] ?? { rotulo: p.situacaoAvaliacao, cor: "#9895a4" };
                return (
                  <tr key={p.inscricaoId} className="border-t border-[#2a2a3a]">
                    <td className="py-2 pr-3 tabular-nums">{p.numero}</td>
                    <td className="pr-3">
                      {p.nome}
                      {p.emailInicio?.status === "FALHA" && <span className="block text-xs text-red-300">E-mail de início falhou</span>}
                    </td>
                    <td className="pr-3">{p.instituicao}</td>
                    <td className="pr-3">
                      {p.ultimoEnvio ? (
                        <>
                          <span className="block">{dataHora(p.ultimoEnvio.enviadoEm)}{p.totalEnvios > 1 && <span className="text-xs text-[#9895a4]"> ({p.totalEnvios} envios)</span>}</span>
                          <a className="text-xs text-[#3AAFE0] hover:underline mr-2" href={p.ultimoEnvio.videoLink} target="_blank" rel="noopener noreferrer">vídeo</a>
                          <a className="text-xs text-[#3AAFE0] hover:underline" href={p.ultimoEnvio.portfolioLink} target="_blank" rel="noopener noreferrer">portfólio</a>
                        </>
                      ) : <span className="text-[#9895a4]">—</span>}
                    </td>
                    <td className="pr-3 text-xs space-y-1">
                      {p.atribuicoes.map((a) => (
                        <div key={a.id} className="flex items-center gap-2">
                          <span>{a.ordem}º {a.avaliador}:</span>
                          {a.status === "CONCLUIDA" ? (
                            <span className="text-emerald-300">{a.nota} pts em {a.horasComAvaliador} h</span>
                          ) : (
                            <>
                              <span className={a.horasComAvaliador > painel.alertaHoras ? "text-red-300 font-semibold" : "text-[#E8B829]"}>
                                pendente há {a.horasComAvaliador} h
                              </span>
                              <button className="text-[#3AAFE0] hover:underline" onClick={() => { setRemanejando({ atribuicao: a, participante: p.nome }); setNovoAvaliador(""); }}>
                                remanejar
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                      {!p.atribuicoes.length && <span className="text-[#9895a4]">—</span>}
                    </td>
                    <td className="pr-3 font-semibold">{p.fase2Nota ?? "—"}</td>
                    <td><span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: s.cor, backgroundColor: `${s.cor}22` }}>{s.rotulo}</span></td>
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
        mensagem={`Tema: "${tema.trim()}". O prazo de 24 horas começa agora para os ${totais.classificados} classificados, e todos recebem o e-mail de início. Esta ação não pode ser desfeita.`}
      />
      <ConfirmDialog
        aberto={confirmarDistribuicao}
        onClose={() => setConfirmarDistribuicao(false)}
        onConfirm={distribuir}
        confirmando={ocupado}
        variante="warning"
        titulo="Distribuir aos avaliadores?"
        mensagem={`${totais.enviaram} participantes serão distribuídos entre ${selecionados.length} avaliadores, 2 avaliadores por participante. A distribuição é feita uma única vez.`}
      />

      {remanejando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setRemanejando(null)}>
          <div className={`${cartao} w-full max-w-md space-y-3`} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[#f0ece4]">Remanejar avaliação</h3>
            <p className="text-sm text-[#b0adc0]">
              {remanejando.participante}: {remanejando.atribuicao.ordem}º avaliador atual é {remanejando.atribuicao.avaliador}.
            </p>
            <select value={novoAvaliador} onChange={(e) => setNovoAvaliador(e.target.value)}
              className="w-full h-9 rounded-md bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm px-2">
              <option value="">Escolha o novo avaliador</option>
              {avaliadores.filter((a) => a.id !== remanejando.atribuicao.avaliadorId).map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setRemanejando(null)}>Cancelar</Button>
              <Button size="sm" disabled={!novoAvaliador || ocupado} style={{ backgroundColor: "#E8B829", color: "#0a0a0f" }}
                onClick={() => acao(async () => {
                  await api.post(`/admin/fase2/atribuicoes/${remanejando.atribuicao.id}/remanejar`, { avaliadorId: novoAvaliador });
                  setRemanejando(null);
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

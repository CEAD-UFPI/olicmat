import { tinta } from "@/lib/tema";

interface LinhaRanking {
  id: string;
  nome: string;
  alunos: number;
  inscritos: number;
}

interface Props {
  instituicoes: { id: string; nome: string; sigla: string }[];
  ranking: LinhaRanking[];
  nivel: "instituicao" | "coordenador";
  coordenadores: { id: string; nome: string }[] | null;
  instituicaoId: string;
  coordenadorId: string;
  onSelecionarInstituicao: (id: string) => void;
  onSelecionarCoordenador: (id: string) => void;
}

function statusRanking(pct: number): { label: string; cor: string } {
  if (pct < 0.5) return { label: "Atrasado", cor: "#e57373" };
  if (pct < 0.8) return { label: "Atenção", cor: "#f59e0b" };
  return { label: "Em dia", cor: "#4ec98a" };
}

export function RankingInstituicoes({
  instituicoes,
  ranking,
  nivel,
  coordenadores,
  instituicaoId,
  coordenadorId,
  onSelecionarInstituicao,
  onSelecionarCoordenador,
}: Props) {
  return (
    <div className="border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)] space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
          {nivel === "instituicao" ? "Por Instituição" : "Por Coordenador"}
        </h2>
        <div className="flex gap-2">
          <select
            value={instituicaoId}
            onChange={(e) => onSelecionarInstituicao(e.target.value)}
            className="h-9 px-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)]"
          >
            <option value="">Todas instituições</option>
            {instituicoes.map((i) => (
              <option key={i.id} value={i.id}>
                {i.sigla || i.nome}
              </option>
            ))}
          </select>
          {instituicaoId && (
            <select
              value={coordenadorId}
              onChange={(e) => onSelecionarCoordenador(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)]"
            >
              <option value="">Todos coordenadores</option>
              {(coordenadores ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {ranking.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)]">
          {instituicaoId && (coordenadores ?? []).length === 0
            ? "Nenhum coordenador cadastrado nesta instituição."
            : "Nenhum aluno cadastrado neste recorte."}
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <th className="py-2 pr-4">
                {nivel === "instituicao" ? "Instituição" : "Coordenador"}
              </th>
              <th className="py-2 pr-4">Alunos</th>
              <th className="py-2 pr-4">Inscritos</th>
              <th className="py-2 pr-4">%</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r) => {
              const pct = r.alunos > 0 ? r.inscritos / r.alunos : 0;
              const status = statusRanking(pct);
              return (
                <tr key={r.id} className="border-t border-[var(--border-color)]">
                  <td className="py-2 pr-4 text-[var(--text-primary)]">{r.nome}</td>
                  <td className="py-2 pr-4 text-[var(--text-tertiary)]">{r.alunos}</td>
                  <td className="py-2 pr-4 text-[var(--text-tertiary)]">{r.inscritos}</td>
                  <td className="py-2 pr-4 text-[var(--text-tertiary)]">
                    {Math.round(pct * 100)}%
                  </td>
                  <td className="py-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: tinta(status.cor) }}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

interface FunilDados {
  convidados: number;
  cadastrados: number;
  inscritos: number;
  confirmados: number;
}

export function FunilBarras({ funil }: { funil: FunilDados }) {
  const estagios: { label: string; valor: number; pct: number | null }[] = [
    { label: "Convidados", valor: funil.convidados, pct: null },
    {
      label: "Cadastrados",
      valor: funil.cadastrados,
      pct: funil.convidados > 0 ? funil.cadastrados / funil.convidados : null,
    },
    {
      label: "Inscritos",
      valor: funil.inscritos,
      pct: funil.cadastrados > 0 ? funil.inscritos / funil.cadastrados : null,
    },
    {
      label: "Confirmados",
      valor: funil.confirmados,
      pct: funil.inscritos > 0 ? funil.confirmados / funil.inscritos : null,
    },
  ];
  const max = Math.max(funil.convidados, 1);

  return (
    <div className="border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-secondary)] space-y-3">
      <h2 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
        Funil de Conversão
      </h2>
      {estagios.map((e) => (
        <div key={e.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-sm text-[var(--text-primary)]">
            {e.label}
          </span>
          <div className="flex-1 h-6 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] overflow-hidden">
            <div
              className="h-full bg-[var(--color-gold)] flex items-center pl-2 text-xs font-semibold text-[var(--on-accent)] whitespace-nowrap"
              style={{
                width: `${Math.max((e.valor / max) * 100, e.valor > 0 ? 4 : 0)}%`,
              }}
            >
              {e.valor}
              {e.pct != null ? ` · ${Math.round(e.pct * 100)}%` : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

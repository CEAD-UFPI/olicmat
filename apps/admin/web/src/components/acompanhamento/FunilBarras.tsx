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
    <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] space-y-3">
      <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
        Funil de Conversão
      </h2>
      {estagios.map((e) => (
        <div key={e.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-sm text-[#f0ece4]">
            {e.label}
          </span>
          <div className="flex-1 h-6 rounded bg-[#0a0a0f] border border-[#2a2a3a] overflow-hidden">
            <div
              className="h-full bg-[#E8B829] flex items-center pl-2 text-xs font-semibold text-[#0a0a0f] whitespace-nowrap"
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

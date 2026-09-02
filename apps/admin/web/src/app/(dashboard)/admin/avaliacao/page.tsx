"use client";

import AvaliacaoFase2 from "@/components/avaliacao/AvaliacaoFase2";

export default function AdminAvaliacaoPage() {
  return (
    <AvaliacaoFase2
      titulo="Avaliação - Fase 2"
      subtitulo="Avalie as videoaulas e portfólios dos competidores"
      canAssign
      showHistorico
      showTemaHistorico
      accent="#4CAF50"
      separador=" - "
      vazioPendentes="Nenhuma submissão pendente de avaliação."
      erroPendentes="Erro ao carregar submissões."
    />
  );
}

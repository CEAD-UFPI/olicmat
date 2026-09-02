"use client";

import AvaliacaoFase2 from "@/components/avaliacao/AvaliacaoFase2";

export default function ComissaoAvaliacaoPage() {
  return (
    <AvaliacaoFase2
      titulo="Avaliação — Fase 2"
      subtitulo="Acompanhamento das avaliações"
      showHistorico
      accent="#E8B829"
      separador=" — "
      vazioPendentes="Nenhuma submissão pendente."
    />
  );
}

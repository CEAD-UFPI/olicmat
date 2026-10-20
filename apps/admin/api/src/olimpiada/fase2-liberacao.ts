import { BadRequestException } from "@nestjs/common";

/**
 * A Fase 2 só abre na data da convocação (cronograma oficial: "Resultado da
 * Fase 1 e convocação para a Fase 2" — 11/11/2026). Antes disso, nenhuma ação
 * da Fase 2 é aceita: assim o participante não descobre, por tentativa e erro
 * (sortear tema, enviar vídeo), se atingiu a nota mínima antes da divulgação.
 *
 * A data pode ser ajustada sem novo deploy de código pela variável de ambiente
 * FASE2_LIBERADA_EM (ISO 8601, ex.: "2026-11-11T00:00:00-03:00").
 */
export const FASE2_LIBERADA_EM_PADRAO = "2026-11-11T00:00:00-03:00";

export function fase2LiberadaEm(): Date {
  const configurada = new Date(process.env.FASE2_LIBERADA_EM ?? FASE2_LIBERADA_EM_PADRAO);
  return Number.isNaN(configurada.getTime())
    ? new Date(FASE2_LIBERADA_EM_PADRAO)
    : configurada;
}

export function fase2Liberada(agora: Date = new Date()): boolean {
  return agora.getTime() >= fase2LiberadaEm().getTime();
}

export function exigirFase2Liberada(agora: Date = new Date()): void {
  if (fase2Liberada(agora)) return;
  const data = fase2LiberadaEm().toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
  throw new BadRequestException(
    `A Fase 2 ainda não foi liberada. A convocação será divulgada em ${data}.`,
  );
}

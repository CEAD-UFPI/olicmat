/**
 * A nota da Fase 1 NÃO é divulgada ao participante ao final da prova: o gabarito
 * e a pontuação de todos serão publicados no site da OLICMAT. Nenhuma resposta
 * de API voltada ao participante deve carregar a nota, o número de acertos ou o
 * percentual — passe o registro por esta função antes de devolvê-lo.
 */
export function semNotaFase1<T extends { fase1Nota?: unknown }>(
  inscricao: T | null,
): Omit<T, "fase1Nota"> | null {
  if (!inscricao) return null;
  const { fase1Nota: _omitida, ...resto } = inscricao;
  return resto;
}

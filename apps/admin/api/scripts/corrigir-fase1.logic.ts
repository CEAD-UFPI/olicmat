// Lógica pura e determinística da correção da Fase 1. Separada do acesso ao
// banco para ser testável sem conexão — e, principalmente, para importar a MESMA
// função de embaralhamento que o exam-app usa em tempo real. Nenhuma cópia da
// permutação: a semente `${inscricaoId}:${questaoId}` mais a função importada
// reconstroem exatamente a ordem exibida a cada participante.

import { permutacaoAlternativas } from "../../../exam/api/src/prova/shuffle.js";

const LETRAS = "ABCDE";

/**
 * Converte a letra exibida (A–E já embaralhada, como o participante clicou) de
 * volta para a letra canônica da questão. Retorna null se a letra for inválida.
 */
export function letraCanonica(
  inscricaoId: string,
  questaoId: string,
  alternativaMarcada: string,
): string | null {
  const idx = LETRAS.indexOf(alternativaMarcada);
  if (idx === -1) return null;
  const perm = permutacaoAlternativas(`${inscricaoId}:${questaoId}`);
  return perm[idx] ?? null;
}

/** A alternativa marcada corresponde à correta canônica? */
export function estaCorreta(
  inscricaoId: string,
  questaoId: string,
  alternativaMarcada: string,
  corretaCanonica: string | null,
): boolean {
  if (corretaCanonica === null) return false;
  return letraCanonica(inscricaoId, questaoId, alternativaMarcada) === corretaCanonica;
}

/** Nota da Fase 1 (0–100) com duas casas, idêntica a finalizarProva. */
export function calcularNota(corretas: number, totalQuestoes: number): number {
  if (totalQuestoes <= 0) return 0;
  const nota = (corretas / totalQuestoes) * 100;
  return Math.round(nota * 100) / 100;
}

/**
 * Tema claro/escuro — utilitários compartilhados.
 *
 * As cores de destaque (dourado, azul, verde...) são claras demais para TEXTO
 * sobre o fundo claro. `tinta()` recebe a cor de destaque (hex ou var) usada
 * em constantes como `cor: "#E8B829"` e devolve a variante "ink" (legível nos
 * dois temas). Cores desconhecidas são devolvidas como vieram.
 * Use só onde a cor pinta TEXTO/ÍCONE; fundos `${cor}20` continuam com o hex.
 */
const TINTA: Record<string, string> = {
  "#e8b829": "var(--color-gold-ink)",
  "#d4a720": "var(--color-gold-ink)",
  "var(--color-gold)": "var(--color-gold-ink)",
  "var(--pi-laranja)": "var(--color-gold-ink)",
  "var(--pi-dourado)": "var(--color-gold-ink)",
  "#4caf50": "var(--color-green-ink)",
  "var(--color-green)": "var(--color-green-ink)",
  "var(--integral-verde)": "var(--color-green-ink)",
  "#3aafe0": "var(--color-blue-ink)",
  "var(--color-blue)": "var(--color-blue-ink)",
  "var(--sigma-azul)": "var(--color-blue-ink)",
  "#f59e0b": "var(--color-amber-ink)",
  "#faa307": "var(--color-orange-ink)",
  "#f08c3a": "var(--color-orange-ink)",
  "#d97706": "var(--color-orange-ink)",
  "#e53e3e": "var(--color-red-ink)",
  "#e57373": "var(--color-red-ink)",
  "#2ec4b6": "var(--color-teal-ink)",
  "#4ec98a": "var(--color-mint-ink)",
  "#3a86ef": "var(--color-azure-ink)",
  "#9b59b6": "var(--color-purple-ink)",
  "#94a3b8": "var(--color-silver-ink)",
  "#9895a4": "var(--text-tertiary)",
};

export function tinta(cor: string | undefined | null): string | undefined {
  if (!cor) return cor ?? undefined;
  return TINTA[cor.toLowerCase()] ?? cor;
}

export const TEMA_COOKIE = "olicmat-tema";
export type Tema = "light" | "dark";

/** Cor da barra do navegador (<meta name="theme-color">) em cada tema. */
export const COR_BARRA_TEMA: Record<Tema, string> = { light: "#f7f5f0", dark: "#0a0a0f" };

/**
 * Script bloqueante para o <head> do root layout: aplica o tema salvo
 * (cookie compartilhado entre os subdomínios → localStorage) antes da primeira
 * pintura, sem "flash". Padrão: claro — NÃO segue prefers-color-scheme.
 */
export const TEMA_SCRIPT_INICIAL = `(function(){try{var t=null,m=document.cookie.match(/(?:^|;\\s*)${TEMA_COOKIE}=(light|dark)/);if(m)t=m[1];if(!t){try{t=localStorage.getItem("${TEMA_COOKIE}")}catch(e){}}if(t!=="dark")t="light";var h=document.documentElement;h.setAttribute("data-theme",t);h.style.colorScheme=t;var c=t==="dark"?"${COR_BARRA_TEMA.dark}":"${COR_BARRA_TEMA.light}";var q=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<q.length;i++)q[i].setAttribute("content",c);}catch(e){}})();`;

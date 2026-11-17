#!/usr/bin/env node
/**
 * tema-tokens.mjs — troca cores hexadecimais fixas por variáveis CSS de tema
 * (modo claro/escuro) em arquivos .tsx/.ts/.jsx/.js.
 *
 * Uso:
 *   node scripts/tema-tokens.mjs <arquivo|pasta> [...mais caminhos]
 *   node scripts/tema-tokens.mjs --dry apps/admin/web/src        # só mostra o que mudaria
 *
 * O que é reescrito:
 *   1. Valores arbitrários do Tailwind: `bg-[#0a0a0f]`, `hover:text-[#E8B829]/70`,
 *      `border-[#2a2a3a]/50`... → `bg-[var(--bg-primary)]`, etc.
 *   2. Strings em estilos inline cuja chave é uma propriedade CSS de cor
 *      (`color`, `backgroundColor`, `borderColor`, `fill`, `stroke`, ...):
 *      `style={{ color: "#9895a4" }}` → `style={{ color: "var(--text-tertiary)" }}`.
 *      Constantes como `cor: "#E8B829"` NÃO são tocadas (podem ser usadas em
 *      concatenações do tipo `${cor}20`), nem valores dentro de template strings.
 *
 * Cores de destaque (dourado, azul, verde, etc.) usadas como TEXTO viram a
 * variante "ink" (mais escura no modo claro, idêntica à original no escuro);
 * usadas como fundo/borda viram a variável de preenchimento.
 *
 * O script é idempotente: rodar de novo num arquivo já convertido não muda nada.
 * Ignora node_modules, .next e arquivos .css (as definições ficam no globals.css).
 */
import { readFileSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

/** hex (minúsculo, 6 dígitos) → { fill, ink } — ink usado para texto. */
const MAPA = {
  // Neutros
  "0a0a0f": { fill: "--bg-primary", ink: "--on-accent" },
  "12121a": { fill: "--bg-secondary" },
  "1a1a26": { fill: "--surface" },
  "0f0f16": { fill: "--surface-2" },
  "171722": { fill: "--surface-3" },
  "1f1f2e": { fill: "--surface-4" },
  f0ece4: { fill: "--text-primary" },
  d6d2c8: { fill: "--text-emphasis" },
  b0adc0: { fill: "--text-secondary" },
  "9895a4": { fill: "--text-tertiary" },
  "6f6c7a": { fill: "--text-muted" },
  "57545f": { fill: "--text-faint" },
  "5a5a6a": { fill: "--text-faint" },
  "2a2a3a": { fill: "--border-color" },
  "3a3a4a": { fill: "--border-strong" },
  // Destaques da marca
  e8b829: { fill: "--color-gold", ink: "--color-gold-ink" },
  d4a720: { fill: "--color-gold-hover", ink: "--color-gold-ink" },
  "3aafe0": { fill: "--color-blue", ink: "--color-blue-ink" },
  "4caf50": { fill: "--color-green", ink: "--color-green-ink" },
  // Destaques de status
  f59e0b: { fill: "--color-amber", ink: "--color-amber-ink" },
  faa307: { fill: "--color-orange", ink: "--color-orange-ink" },
  e53e3e: { fill: "--color-red", ink: "--color-red-ink" },
  e57373: { fill: "--color-red-soft", ink: "--color-red-ink" },
  "2ec4b6": { fill: "--color-teal", ink: "--color-teal-ink" },
  "4ec98a": { fill: "--color-mint", ink: "--color-mint-ink" },
  "3a86ef": { fill: "--color-azure", ink: "--color-azure-ink" },
};

/** utilitários Tailwind que pintam texto (usam a variante ink). */
const UTIL_TEXTO = new Set(["text", "placeholder", "decoration", "caret", "fill", "stroke"]);
/** propriedades CSS (camelCase) de estilo inline que recebem cor. */
const PROPS_TEXTO = new Set(["color", "fill", "stroke", "caretColor", "textDecorationColor"]);
const PROPS_COR = new Set([
  ...PROPS_TEXTO,
  "background",
  "backgroundColor",
  "borderColor",
  "borderTopColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRightColor",
  "outlineColor",
  "accentColor",
]);

function normaliza(hex) {
  let h = hex.toLowerCase();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return h;
}

function variavel(hex, comoTexto) {
  const m = MAPA[normaliza(hex)];
  if (!m) return null;
  return comoTexto && m.ink ? m.ink : m.fill;
}

/** variáveis de destaque (preenchimento) → variante ink, quando usadas como texto. */
const VAR_INK = {
  "--color-gold": "--color-gold-ink",
  "--pi-dourado": "--color-gold-ink",
  "--pi-laranja": "--color-gold-ink",
  "--color-green": "--color-green-ink",
  "--integral-verde": "--color-green-ink",
  "--color-blue": "--color-blue-ink",
  "--sigma-azul": "--color-blue-ink",
};

function converte(src) {
  let n = 0;
  // 0) Tailwind texto com var de destaque: text-[var(--color-gold)] → text-[var(--color-gold-ink)]
  src = src.replace(/([A-Za-z0-9_:!-]*?)([a-z]+)-\[var\((--[a-z-]+)\)\]/g, (all, pre, util, v) => {
    if (!UTIL_TEXTO.has(util) || !VAR_INK[v]) return all;
    n++;
    return `${pre}${util}-[var(${VAR_INK[v]})]`;
  });

  // 1) Tailwind arbitrário: <variantes:>util-[#hex]
  src = src.replace(/([A-Za-z0-9_:!-]*?)([a-z]+)-\[#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\]/g, (all, pre, util, hex) => {
    const v = variavel(hex, UTIL_TEXTO.has(util));
    if (!v) return all;
    n++;
    return `${pre}${util}-[var(${v})]`;
  });

  // 2) estilos inline: chave CSS conhecida seguida (na mesma expressão) de "#hex"
  const linhas = src.split("\n");
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    if (!/["'`](#[0-9a-fA-F]{3,6}|var\(--[a-z-]+\))["'`]/.test(linha)) continue;
    linhas[i] = linha.replace(/(["'`])(?:#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})|var\((--[a-z-]+)\))\1/g, (all, q, hex, nomeVar, idx) => {
      const prefixo = linha.slice(0, idx);
      const chaves = [...prefixo.matchAll(/([A-Za-z]+)\s*:(?!:)/g)];
      if (!chaves.length) return all;
      const ult = chaves[chaves.length - 1];
      const chave = ult[1];
      if (!PROPS_COR.has(chave)) return all;
      const resto = prefixo.slice(ult.index + ult[0].length);
      // não mexe se houver vírgula/chave/template no meio (outra propriedade ou concatenação)
      if (/[,{};]|\$\{/.test(resto)) return all;
      let v;
      if (nomeVar) {
        // var de destaque usada como cor de texto → ink
        if (!PROPS_TEXTO.has(chave) || !VAR_INK[nomeVar]) return all;
        v = VAR_INK[nomeVar];
      } else {
        v = variavel(hex, PROPS_TEXTO.has(chave));
      }
      if (!v) return all;
      n++;
      return `${q}var(${v})${q}`;
    });
  }
  return { out: linhas.join("\n"), n };
}

const EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".mjs"]);
function* arquivos(p) {
  const st = statSync(p);
  if (st.isFile()) {
    if (EXT.has(extname(p))) yield p;
    return;
  }
  for (const nome of readdirSync(p)) {
    if (nome === "node_modules" || nome === ".next" || nome.startsWith(".")) continue;
    yield* arquivos(join(p, nome));
  }
}

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const caminhos = args.filter((a) => a !== "--dry");
if (!caminhos.length) {
  console.error("uso: node scripts/tema-tokens.mjs [--dry] <arquivo|pasta> [...]");
  process.exit(1);
}
let total = 0;
let alterados = 0;
for (const c of caminhos) {
  for (const f of arquivos(c)) {
    if (f.endsWith("tema-tokens.mjs")) continue;
    const src = readFileSync(f, "utf8");
    const { out, n } = converte(src);
    if (out !== src) {
      alterados++;
      total += n;
      console.log(`${dry ? "[dry] " : ""}${f}: ${n} troca(s)`);
      if (!dry) writeFileSync(f, out);
    }
  }
}
console.log(`${alterados} arquivo(s), ${total} troca(s)${dry ? " (dry-run)" : ""}`);

"use client";

import React, { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Encolhe a fórmula para caber na tela. A rolagem lateral sozinha esconde parte
 * dela no celular: uma coluna inteira de tabela sumia sem nenhum sinal.
 * Abaixo do mínimo legível (50%), a rolagem continua como último recurso.
 */
function FormulaLarga({ html }: { html: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ajustar = () => {
      el.style.fontSize = "";
      let escala = 1;
      // Repete porque a largura não cai na mesma proporção: sobravam alguns pixels.
      for (let i = 0; i < 6 && escala > 0.5 && el.scrollWidth > el.clientWidth; i++) {
        escala = Math.max(0.5, escala * (el.clientWidth / el.scrollWidth) * 0.98);
        el.style.fontSize = `${escala * 100}%`;
      }
    };
    ajustar();
    // As fontes da fórmula chegam depois, e mudam a largura medida.
    document.fonts?.ready.then(ajustar);
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, [html]);

  return (
    <span ref={ref} className="block my-3 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function MathText({ text, className = "" }: MathTextProps) {
  if (!text) return null;

  // Figuras embutidas e negrito vêm antes da matemática. A figura fica no próprio
  // texto, e não em /public: uma URL pública exporia a prova antes da hora.
  const parts = text.split(
    /(!\[[^\]]*\]\(data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/=]+\)|\*\*[^*\n]+\*\*|\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g,
  );

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const figura = part.match(/^!\[([^\]]*)\]\((data:image\/[^)]+)\)$/);
        if (figura) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={figura[2]}
              alt={figura[1]}
              className="block mx-auto my-3 w-auto max-w-full h-auto max-h-[70vh] rounded-lg bg-white p-2"
            />
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const formula = part.slice(2, -2);
          try {
            const html = katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <FormulaLarga key={index} html={html} />
            );
          } catch (e) {
            console.error("KaTeX error:", e);
            return <span key={index}>{part}</span>;
          }
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const formula = part.slice(1, -1);
          try {
            const html = katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline-block"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            console.error("KaTeX error:", e);
            return <span key={index}>{part}</span>;
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

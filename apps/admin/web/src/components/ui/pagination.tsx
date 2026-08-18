"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
  pagina: number;
  totalPaginas: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagina, totalPaginas, onPageChange }: PaginationProps) {
  if (totalPaginas <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPaginas; i++) {
    if (i === 1 || i === totalPaginas || (i >= pagina - 1 && i <= pagina + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="default"
        disabled={pagina <= 1}
        onClick={() => onPageChange(pagina - 1)}
        className="text-[#b0adc0] hover:text-[#f0ece4] disabled:opacity-30 cursor-pointer"
      >
        <ChevronLeft size={18} />
      </Button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-[#b0adc0] text-base">
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant="ghost"
            size="default"
            onClick={() => onPageChange(p as number)}
            className="text-base cursor-pointer min-w-[36px]"
            style={{
              color: p === pagina ? "#4CAF50" : "#b0adc0",
              backgroundColor: p === pagina ? "#4CAF5015" : "transparent",
              fontWeight: p === pagina ? 600 : 400,
            }}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="default"
        disabled={pagina >= totalPaginas}
        onClick={() => onPageChange(pagina + 1)}
        className="text-[#b0adc0] hover:text-[#f0ece4] disabled:opacity-30 cursor-pointer"
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}

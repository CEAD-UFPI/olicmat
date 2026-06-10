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
        size="sm"
        disabled={pagina <= 1}
        onClick={() => onPageChange(pagina - 1)}
        className="text-[#9895a4] hover:text-[#f0ece4] disabled:opacity-30 cursor-pointer"
      >
        <ChevronLeft size={16} />
      </Button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-[#9895a4] text-sm">
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(p as number)}
            className="text-sm cursor-pointer min-w-[32px]"
            style={{
              color: p === pagina ? "#00d47d" : "#9895a4",
              backgroundColor: p === pagina ? "#00d47d15" : "transparent",
              fontWeight: p === pagina ? 600 : 400,
            }}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={pagina >= totalPaginas}
        onClick={() => onPageChange(pagina + 1)}
        className="text-[#9895a4] hover:text-[#f0ece4] disabled:opacity-30 cursor-pointer"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}

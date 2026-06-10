"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Edicao {
  id: string;
  ano: number;
  titulo: string;
  status: string;
}

interface EdicaoSelectorProps {
  value: string;
  onChange: (edicaoId: string) => void;
  incluirTodas?: boolean;
}

export function EdicaoSelector({
  value,
  onChange,
  incluirTodas = true,
}: EdicaoSelectorProps) {
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get("/admin/edicoes")
      .then(({ data }) => setEdicoes(Array.isArray(data) ? data : []))
      .catch(() => setEdicoes([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={carregando}
      className="h-8 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] text-sm px-2.5 py-0 outline-none focus:border-[#00d47d] transition-colors disabled:opacity-50 cursor-pointer"
    >
      {incluirTodas && <option value="">Todas as edições</option>}
      {edicoes.map((ed) => (
        <option key={ed.id} value={ed.id}>
          {ed.titulo || ed.ano} ({ed.status})
        </option>
      ))}
    </select>
  );
}

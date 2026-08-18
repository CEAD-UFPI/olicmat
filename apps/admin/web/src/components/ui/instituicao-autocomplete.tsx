"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface InstituicaoAutocompleteProps {
  value: string;
  onChange: (value: string, instituicao?: { id: string; nome: string; sigla: string }) => void;
  placeholder?: string;
  error?: string;
  label?: string;
}

interface Instituicao {
  id: string;
  nome: string;
  sigla: string;
}

export function InstituicaoAutocomplete({
  value,
  onChange,
  placeholder = "Buscar instituição...",
  error,
  label,
}: InstituicaoAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Instituicao[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Instituicao | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== query) {
      setQuery(value);
      if (value) {
        setSelected({ id: "", nome: value, sigla: value });
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = async (term: string) => {
    if (!term || term.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/instituicoes?search=${encodeURIComponent(term)}&limit=10`);
      setResults(data.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(null);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (inst: Instituicao) => {
    setQuery(`${inst.nome} (${inst.sigla})`);
    setSelected(inst);
    setShowDropdown(false);
    onChange(inst.sigla, inst);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-sm text-[#9895a4] mb-1.5">{label}</label>
      )}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        className={`w-full h-12 px-4 rounded-xl border bg-[#12121a] text-[#f0ece4] placeholder:text-[#5a5a6a] outline-none transition-colors ${
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-[#2a2a3a] focus:border-[#3AAFE0]"
        }`}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border border-[#3AAFE0] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 border border-[#2a2a3a] rounded-xl bg-[#1a1a26] shadow-xl max-h-60 overflow-auto"
          >
            {results.map((inst) => (
              <button
                key={inst.id}
                type="button"
                onClick={() => handleSelect(inst)}
                className="w-full text-left px-4 py-3 hover:bg-[#2a2a3a] transition-colors border-b border-[#2a2a3a] last:border-b-0"
              >
                <span className="text-sm text-[#f0ece4] font-medium">{inst.nome}</span>
                <span className="text-xs text-[#9895a4] ml-2">({inst.sigla})</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

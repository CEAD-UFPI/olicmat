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
        <label className="block text-sm text-[var(--text-tertiary)] mb-1.5">{label}</label>
      )}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        className={`w-full h-12 px-4 rounded-xl border bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none transition-colors ${
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-[var(--border-color)] focus:border-[var(--color-blue)]"
        }`}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border border-[var(--color-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 border border-[var(--border-color)] rounded-xl bg-[var(--surface)] shadow-xl max-h-60 overflow-auto"
          >
            {results.map((inst) => (
              <button
                key={inst.id}
                type="button"
                onClick={() => handleSelect(inst)}
                className="w-full text-left px-4 py-3 hover:bg-[var(--border-color)] transition-colors border-b border-[var(--border-color)] last:border-b-0"
              >
                <span className="text-sm text-[var(--text-primary)] font-medium">{inst.nome}</span>
                <span className="text-xs text-[var(--text-tertiary)] ml-2">({inst.sigla})</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

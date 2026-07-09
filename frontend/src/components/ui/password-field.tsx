"use client";

import { useState } from "react";

interface PasswordToggleProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  id: string;
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export function PasswordField({
  value,
  onChange,
  name,
  id,
  placeholder = "••••••••",
  className = "",
  error,
  label,
  required = false,
}: PasswordToggleProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm text-[#9895a4] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full h-12 px-4 pr-12 rounded-xl border bg-[#0a0a0f] text-[#f0ece4] placeholder:text-[#9895a4]/50 outline-none transition-colors ${
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-[#2a2a3a] focus:border-[#3AAFE0]"
          } ${className}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9895a4] hover:text-[#f0ece4] transition-colors"
          aria-label={show ? "Esconder senha" : "Mostrar senha"}
        >
          {show ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

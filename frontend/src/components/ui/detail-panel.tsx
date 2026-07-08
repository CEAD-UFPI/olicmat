"use client";

import { motion } from "framer-motion";
import { Button } from "./button";
import { Modal } from "./modal";
import { Pencil } from "lucide-react";
import type { ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────────────────
 * Unified DetailPanel — reusable entity viewer
 *
 * Built on top of the shared <Modal> primitive. Organises content into
 * labeled sections (Identification, Location, Relationships, History, …),
 * each rendering a responsive 2-column grid of labeled fields on desktop
 * that collapses to 1 column on mobile.
 *
 * Visual language mirrors the analytics dashboards: small muted label on
 * top, prominent value below — never cramped side-by-side as the old
 * detail modals were.
 * ────────────────────────────────────────────────────────────────────────── */

export interface DetailFieldT {
  label: string;
  value: ReactNode;
  /** When true, the field occupies the full row (both columns). */
  full?: boolean;
  /** When provided, this overrides the default empty placeholder ("-"). */
  emptyText?: string;
}

export interface DetailSectionT {
  title: string;
  fields: DetailFieldT[];
  /** When provided, replaces the entire fields grid with custom JSX (e.g. a list of related entities). */
  children?: ReactNode;
  /** When true, the section is hidden if every field is empty. */
  hideIfEmpty?: boolean;
}

export interface HeroMetricT {
  label: string;
  value: ReactNode;
  hint?: string;
  /** Semantic tone. Defaults to "neutral". */
  tone?: "green" | "amber" | "red" | "blue" | "gold" | "neutral";
}

interface DetailPanelProps {
  aberto: boolean;
  onClose: () => void;
  titulo: string;
  /** Optional highlighted KPI shown at the top of the panel. */
  hero?: HeroMetricT;
  /** Content sections, each rendering a labeled group of fields. */
  sections: DetailSectionT[];
  /** Optional footer (e.g. links to related resources). */
  footer?: ReactNode;
  /** Optional "Edit" action rendered in the header. Omit to hide. */
  onEdit?: () => void;
  editLabel?: string;
}

const toneHex: Record<NonNullable<HeroMetricT["tone"]>, string> = {
  green: "#4CAF50",
  amber: "#f59e0b",
  red: "#e53e3e",
  blue: "#3AAFE0",
  gold: "#E8B829",
  neutral: "#9895a4",
};

function isEmpty(value: ReactNode): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "" || value.trim() === "-";
  if (typeof value === "number") return false;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function Field({ field }: { field: DetailFieldT }) {
  const empty = isEmpty(field.value);
  const display = empty ? (field.emptyText ?? "—") : field.value;
  return (
    <div className={field.full ? "sm:col-span-2" : ""}>
      <p className="detail-label">{field.label}</p>
      <p
        className={`mt-0.5 text-[#f0ece4] ${empty ? "text-[#9895a4]" : ""}`}
        style={{ wordBreak: "break-word" }}
      >
        {display}
      </p>
    </div>
  );
}

function HeroMetric({ hero }: { hero: HeroMetricT }) {
  const hex = toneHex[hero.tone ?? "neutral"];
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-[#2a2a3a] p-4 mb-4"
      style={{
        backgroundColor: `${hex}10`,
        borderColor: `${hex}40`,
      }}
    >
      <p className="text-xs font-medium uppercase tracking-widest text-[#9895a4]">
        {hero.label}
      </p>
      <p
        className="mt-1 metric-value"
        style={{ color: hex }}
      >
        {hero.value}
      </p>
      {hero.hint && (
        <p className="mt-1 text-sm text-[#b0adc0]">{hero.hint}</p>
      )}
    </motion.div>
  );
}

function Section({ section, index }: { section: DetailSectionT; index: number }) {
  const allEmpty = section.hideIfEmpty && section.fields.every((f) => isEmpty(f.value));
  if (allEmpty && !section.children) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: 0.05 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      <div className="space-y-1">
        <p className="section-title">{section.title}</p>
        <div className="h-px bg-[#2a2a3a]" />
      </div>
      {section.children ? (
        section.children
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          {section.fields.map((field, i) => (
            <Field key={i} field={field} />
          ))}
        </div>
      )}
    </motion.section>
  );
}

export function DetailPanel({
  aberto,
  onClose,
  titulo,
  hero,
  sections,
  footer,
  onEdit,
  editLabel = "Editar",
}: DetailPanelProps) {
  const headerAction = onEdit ? (
    <Button
      variant="outline"
      size="sm"
      onClick={onEdit}
      className="border-[#2a2a3a] text-[#f0ece4] hover:bg-[#0a0a0f] gap-1.5 cursor-pointer"
    >
      <Pencil size={14} />
      {editLabel}
    </Button>
  ) : null;

  return (
    <Modal
      aberto={aberto}
      onClose={onClose}
      titulo={titulo}
      tamanho="3xl"
      headerActions={headerAction}
    >
      <div className="space-y-5">
        {hero && <HeroMetric hero={hero} />}
        {sections.map((section, index) => (
          <Section key={index} section={section} index={index} />
        ))}
        {footer && (
          <div className="pt-3 border-t border-[#2a2a3a]">{footer}</div>
        )}
      </div>
    </Modal>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Convenience helpers — semantic status badges matching dashboard palette
 * ────────────────────────────────────────────────────────────────────────── */

export interface StatusBadgeT {
  label: string;
  tone: NonNullable<HeroMetricT["tone"]>;
  /** Optional dot prefix (default true). */
  dot?: boolean;
}

export function StatusBadge({ label, tone, dot = true }: StatusBadgeT) {
  const hex = toneHex[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-0.5 rounded-full"
      style={{
        backgroundColor: `${hex}1A`,
        color: hex,
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ backgroundColor: hex }}
        />
      )}
      {label}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * EmptyState — friendly placeholder for missing related collections
 * ────────────────────────────────────────────────────────────────────────── */

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#2a2a3a] p-4 text-center">
      <p className="text-sm text-[#9895a4] italic">{message}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * InlineList — for listing related entities (courses, users, etc.)
 * ────────────────────────────────────────────────────────────────────────── */

export function InlineList({ items, empty }: { items: { id: string; label: string }[]; empty: string }) {
  if (!items || items.length === 0) {
    return <EmptyState message={empty} />;
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-2 text-[#f0ece4]"
        >
          <span className="w-1 h-1 rounded-full bg-[#E8B829] flex-shrink-0" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/* Status helpers for the registration entity. */
export const INSCRICAO_STATUS: Record<string, { label: string; tone: NonNullable<HeroMetricT["tone"]> }> = {
  CONFIRMADA: { label: "Confirmada", tone: "green" },
  PENDENTE: { label: "Pendente", tone: "amber" },
  REJEITADA: { label: "Rejeitada", tone: "red" },
};

/* Status helpers for the edition entity. */
export const EDICAO_STATUS: Record<string, { label: string; tone: NonNullable<HeroMetricT["tone"]> }> = {
  PLANEJAMENTO: { label: "Planejamento", tone: "neutral" },
  ATIVA: { label: "Ativa", tone: "green" },
  ENCERRADA: { label: "Encerrada", tone: "blue" },
};

/* Status helpers for the user role entity. */
export const ROLE_INFO: Record<string, { label: string; tone: NonNullable<HeroMetricT["tone"]> }> = {
  ALUNO: { label: "Aluno", tone: "blue" },
  COORDENADOR_CURSO: { label: "Coordenador", tone: "gold" },
  AVALIADOR: { label: "Avaliador", tone: "green" },
  ADMIN: { label: "Admin", tone: "red" },
  COMISSAO: { label: "Comissão", tone: "neutral" },
};

/* Status helpers for the institution entity. */
export const INSTITUICAO_STATUS: Record<string, { label: string; tone: NonNullable<HeroMetricT["tone"]> }> = {
  ATIVA: { label: "Ativa", tone: "green" },
  INATIVA: { label: "Inativa", tone: "red" },
};
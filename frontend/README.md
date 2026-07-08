# OLICMAT Frontend — Next.js 16

The Next.js 16 App Router frontend for the OLICMAT platform. Provides
role-aware dashboards (ADMIN, AVALIADOR, ALUNO, COORDENADOR_CURSO,
COMISSAO), exam execution with anti-cheating enforcement (ExamGuard),
and the unified `<DetailPanel>` entity viewer.

> See `../README.md` for the full-stack overview and `../docs/` for the
> PRD / BRD / SRS / API surface / frontend route map.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui v4 (base-ui) |
| State | Zustand v5 (authStore, provaStore) |
| Forms | react-hook-form + zod + @hookform/resolvers |
| Animations | framer-motion (modal open/close, list transitions) |
| API | Axios (`@/lib/api`) with Bearer token interceptor |
| Theme | Forced dark mode (next-themes) — `bg-[#0a0a0f]`, `text-[#f0ece4]`, accent `#E8B829` |

## Source Layout

```
src/
├── app/
│   ├── (auth)/            # Login, registro, password recovery
│   ├── (dashboard)/       # Role-protected routes
│   │   ├── admin/         # ADMIN dashboards (usuarios, instituicoes, cursos, edicoes, inscricoes, provas, avaliacao, exportar, auditoria)
│   │   ├── avaliador/     # AVALIADOR dashboards
│   │   ├── competidor/    # ALUNO dashboards
│   │   ├── coordenador/   # COORDENADOR_CURSO dashboards
│   │   └── comissao/     # COMISSAO dashboards (read-only oversight)
│   ├── (public)/          # Regulamento, sobre
│   └── ranking/           # Public ranking
├── components/
│   ├── exam/              # ExamGuard (anti-cheating wrapper)
│   ├── layout/            # Header, Sidebar (3-module nav), Footer
│   ├── landing/           # Hero, Sobre, Cronograma
│   ├── prova/             # QuestaoCard, Timer
│   └── ui/                # shadcn primitives + Modal + DetailPanel
├── stores/                # Zustand (authStore, provaStore)
├── lib/                   # axios client, cep, utils
├── types/                 # TypeScript interfaces (synced to Prisma schema)
└── middleware.ts           # Cookie-based auth check
```

## Conventions

- Page layout: `"use client"` + `motion.div` from framer-motion for entrance animations
- Admin pages: Tables with search/filter/pagination using client-side state
- Colors: Prefer CSS variables (`var(--pi-dourado)`, `var(--integral-verde)`,
  `var(--sigma-azul)`) when possible; the readability-tuned utility classes
  (`detail-label`, `detail-value`, `section-title`, `metric-value`,
  `metric-label`, `data-badge`) are defined in `globals.css`
- **Entity detail views** use the unified `<DetailPanel>` component
  at `components/ui/detail-panel.tsx`. New entity view screens should
  NOT re-implement `Row` / `SectionTitle` / `FieldGroup` / `DetailField`
  — feed `<DetailPanel>` a `sections` prop instead. See `docs/CHANGELOG.md`
  for the full UX contract and the list of shared widgets (`StatusBadge`,
  `InlineList`, `EmptyState`).
- API calls for Module 3 (Correction) go to `/api/correcao/*` instead of
  the old `/api/admin/avaliacao/*`.

## Data Types

`src/types/index.ts` mirrors the Prisma schema at
`backend/prisma/schema.prisma`. Keep these in sync when adding/modifying
fields. As of 2026-07-07, `Curso` carries an optional `notaEnade`
field (Decimal 5,2 — 0 to 100, or null).

## Development

```bash
npm install
cp .env.example .env  # configure NEXT_PUBLIC_API_URL
npm run dev           # http://localhost:3000
```

## Lint / Typecheck

```bash
npm run lint
npx tsc --noEmit
```
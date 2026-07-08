# Changelog — OLICMAT

All notable changes to the OLICMAT platform are documented in this file.
Format loosely based on [Keep a Changelog](https://keepachangelog.com/).
Dates use `YYYY-MM-DD` (America/Sao_Paulo timezone).

## [Unreleased]

### 2026-07-07 — Unified DetailPanel component + ENADE Score field

This release standardises all entity detail/modal views into a single
reusable `<DetailPanel>` component, expands the readability work done
in the previous release, and introduces an ENADE Score attribute to the
`Curso` entity (DB + backend + frontend).

#### Added
- **New `<DetailPanel>` component** — `frontend/src/components/ui/detail-panel.tsx`
  - Reusable, schema-driven entity viewer built on top of the shared `<Modal>`.
  - Wider responsive layout (default `max-w-3xl` ≈ 768px, full-screen on mobile).
  - Content organised into labeled sections (Identification, Location,
    Relationships, History, Metrics…), with a 2-column grid on desktop and
    1-column on mobile, and generous 16–24px spacing between blocks.
  - Typographic hierarchy: small muted label on top, prominent value below.
  - **Hero metric** slot — highlighted KPI card with semantic color
    (`green` / `amber` / `red` / `blue` / `gold` / `neutral`) matching
    the analytics dashboards.
  - Widgets exported from the same file:
    - `<StatusBadge>` — semantic-colored pill badge with optional dot.
    - `<InlineList>` — list of related entities.
    - `<EmptyState>` — friendly placeholder for missing related data.
  - Status maps for the most common enumerations:
    `INSCRICAO_STATUS`, `EDICAO_STATUS`, `ROLE_INFO`, `INSTITUICAO_STATUS`.
- **New `2xl` and `3xl` sizes** on the shared `<Modal>` primitive — used as
  the default size for `<DetailPanel>`.
- **New `headerActions` slot** on `<Modal>` — used by `<DetailPanel>`
  to surface the secondary "Edit" action next to the close button.
- **New "ENADE Score" (`notaEnade`) field on the `Curso` entity**
  - New Prisma migration `20260707000000_add_curso_nota_enade` — adds
    `notaEnade DECIMAL(5,2)` to the `Curso` table (nullable).
  - New `notaEnade` column on the Prisma schema (Decimal @db.Decimal(5,2)).
  - Backend `POST /api/admin/cursos` and `PATCH /api/admin/cursos/:id`
    accept `notaEnade` (number, 0–100).
  - Frontend `CursoForm` includes the field; create/edit modal shows it;
    list table shows it; DetailPanel hero-metric is colour-coded according
    to the score (≥60 green / ≥40 amber / else red).
  - Frontend `types/index.ts` `Curso` interface updated.
- **New Operations (UX polish)**
  - Smooth fade + scale open/close animation on every detail panel.
  - Staggered fade-in-up animation for sections, cards, timeline items,
    meter fills and risk-table rows.
  - Friendly empty states everywhere a related collection can be empty
    ("Nenhum curso vinculado", "Histórico de mudanças indisponível", …).
  - Consistent semantic colors across the Registration views
    (`PENDENTE` amber, `CONFIRMADA` green, `REJEITADA` red) — both the
    `<StatusBadge>` and the `<DetailPanel>` hero metric use the same palette.
- **New Course detail view** — a "view" action was missing entirely on the
  admin courses page. An Eye icon now opens the unified `<DetailPanel>`
  for each course.
- **New Edition detail view** — same situation: a "view" action was missing
  on the admin editions page. An Eye icon now opens `<DetailPanel>` showing
  identification, status hero, olympic calendar (start/end), phase weights
  and creation timestamp.

#### Changed
- **Users detail view (`/admin/usuarios`)** — replaced the cramped 2-column
  inline modal with `<DetailPanel>`. The role is now surfaced as a hero
  metric badge; identification (Nome, Email, Matrícula, Telefone, Gênero,
  Raça/Cor) and institutional vínculo (Instituição, Curso) are now in
  separate labeled sections. Inline `Row` helper removed.
- **Institutions detail view (`/admin/instituicoes`)** — replaced the
  file-local `FieldGroup` + `DetailField` helpers with `<DetailPanel>`
  sections (Identification, Localização, Administrativo, Cursos Vinculados).
  Empty-state for "no courses linked" now uses `<InlineList>` /
  `<EmptyState>`.
- **Registrations detail view (`/admin/inscricoes` and the
  duplicate read-only view on `/comissao/inscricoes`)** — replaced the
  flat 2-column grid with `<DetailPanel>` sections (Participante,
  Vínculo Acadêmico, Desempenho, Histórico). The view now exposes all
  fields present on the `Inscricao` model that were previously hidden from
  the screen (`fase1Nota`, `fase2Tema`, `notaFinal`, `medalha`),
  plus edition context (`edicao.ano`/`edicao.titulo`).
  Both admin and comissão versions now share the exact same component
  — only the comissão version omits the "Edit" header action.
- **Role/status badges** on the registrations table are now produced by
  the shared `<StatusBadge>` component, removing ad-hoc inline styles.
- **Create/Edit modal for Courses (`/admin/cursos`)** — now uses the
  `<Modal>` `titulo` prop instead of an inline `<h2>`, adopts `max-w-md`,
  and surfaces the ENADE input. Form state and save payload updated to
  carry `notaEnade`.

#### Removed
- Duplicate file-local helpers `Row` (usuarios), `FieldGroup` and
  `DetailField` (instituicoes) — their responsibilities are now folded
  into the shared `<DetailPanel>` component.
- Duplicate `statusColors`/`statusLabels` constant objects on the
  admin/inscricoes and comissao/inscricoes pages — now sourced from the
  shared `INSCRICAO_STATUS` map.

#### Documentation
- New `docs/CHANGELOG.md` (this file).
- `CLAUDE.md` (root) updated: Curso entity now mentions `notaEnade`;
  `Last updated` bumped to 2026-07-07; cross-references the new
  `<DetailPanel>` component under "Active Business Scope".
- `AGENTS.md` updated: "Recent Fixes" section expanded with the
  DetailPanel/ENADE work; "Remaining Frontend Risks" trimmed to remove
  the now-resolved ad-hoc detail modal pattern; ENADE Score added to the
  data-model expansion row.
- `docs/SRS_OLICMAT.md` — §RF-08 expanded with a dedicated row about
  unified entity detail panels; §6 "Modelo de Dados" extended with the
  `notaEnade` field on the Curso entity.
- `docs/api-surface.md` — §3 (Instituicoes) documents the
  `notaEnade` field on the Course create/update payloads; §15 added
  ("Entity Detail Panels") describing the unified UX contract.
- `docs/database-migration-blueprint.md` — new migration
  `20260707000000_add_curso_nota_enade` documented; §2.4 expanded with
  the new column.
- `docs/refactor-summary.md` — new "DetailPanel Unification + ENADE
  Score (2026-07-07)" subsection; the "Known Limitations" list was
  trimmed (evaluation pages duplication is the next shared-component
  candidate after this release).
- `docs/frontend-route-map.md` — Entity detail metadata noted on every
  admin page row (Usuario, Instituicao, Curso, Edicao, Inscricao).
- `docs/PRD_OLICMAT.md` — F5 feature list extended with F5.8 "Painéis de
  detalhe unificados" and F5.9 "Cadastro do Índice ENADE por curso".
- `docs/role-permissions-matrix.md` — §2.3 updated to note the new
  optional `notaEnade` field on `POST/PATCH /api/admin/cursos`.
- `README.md` — "Administração" section updated to mention detail view
  standardisation and the ENADE Score field.

#### Compatibility
- Database migration is additive (nullable column) — no data loss.
- Existing endpoints remain backward compatible: `notaEnade` is optional
  on `POST` and `PATCH /api/admin/cursos`.
- New `2xl`/`3xl` sizes and `headerActions` slot on `<Modal>` are
  optional — existing call sites are unaffected.
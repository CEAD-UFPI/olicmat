<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# OLICMAT Frontend

## Stack
- Next.js 16 App Router + React 19 + Tailwind CSS v4 + shadcn/ui v4 (base-ui)
- Zustand v5 (state), Zod (validation), react-hook-form (forms), axios (API)
- Theme: Forced dark mode using CSS variables + `next-themes`

## Conventions
- Role-based pages: admin/, avaliador/, competidor/, coordenador/ under (dashboard)/
- Auth: JWT stored in localStorage + cookie; Zustand authStore manages state
- API client: `@/lib/api` (Axios instance with bearer token interceptor)
- Forms: react-hook-form + @hookform/resolvers/zod
- shadcn v4: Uses `@base-ui/react` primitives with `render` prop pattern for link-as-button
- Imports: `@/` alias for `./src/`

## Key Files
- `src/types/index.ts` — Shared TypeScript interfaces (must match Prisma schema)
- `src/stores/authStore.ts` — Auth state, login/register/logout/loadUser
- `src/stores/provaStore.ts` — Exam state machine (carregar, responder, finalizar)
- `src/middleware.ts` — Cookie-based auth check (token existence only; role check is client-side)
- `src/lib/api.ts` — Axios instance, 401 auto-redirect
- `src/components/exam/ExamGuard.tsx` — Exam anti-cheating wrapper (fullscreen, visibility, warnings, auto-submit)
- `src/components/layout/Sidebar.tsx` — 3-module navigation sections (Config/Prova/Correção)

## 3-Module Frontend Routes
- **Module 1 (Config):** `/admin/*`, `/avaliador/*`, `/competidor/{inscricao,envio,resultado}`, `/coordenador/*`, `/comissao/*` (minus avaliação pages)
- **Module 2 (Exam):** `/competidor/prova` (wrapped in ExamGuard)
- **Module 3 (Correction):** `/admin/avaliacao`, `/avaliador/fase2`, `/comissao/avaliacao`
- API calls for Module 3 go to `/api/correcao/*` instead of old `/api/admin/avaliacao/*`

## Common Patterns
- Page layout: `"use client"` + `motion.div` from framer-motion for entrance animations
- Admin pages: Tables with search/filter/pagination using client-side state
- Colors: Use CSS variables (`var(--pi-laranja)`, `var(--integral-verde)`, `var(--sigma-azul)`) instead of hex values when possible
- Protected routes: Dashboard (`(dashboard)/layout.tsx`) handles redirect + role check
- Exports: CSV download via blob from API response

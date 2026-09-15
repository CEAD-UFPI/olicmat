# Painel de Acompanhamento (Convites, Cadastros, Inscrições) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar à comissão/administração um painel (`/admin/acompanhamento`, `/comissao/acompanhamento`) com funil de conversão (convidados → cadastrados → inscritos → confirmados), ranking por instituição/coordenador e 3 cards de ação (convites expirados, cadastrados sem inscrição, inscrições pendentes) — sem biblioteca de gráfico nova.

**Architecture:** Um método novo `DashboardService.getAcompanhamento()` agrega contagens Prisma já existentes (`Convite`, `User`, `Inscricao`) e é exposto em `GET /admin/acompanhamento`. `ConvitesService.listar()` ganha um filtro `status=expirado` opcional. No front, um componente compartilhado `AcompanhamentoView` (barras CSS, sem lib de gráfico) é montado nas duas rotas finas `admin/acompanhamento` e `comissao/acompanhamento`.

**Tech Stack:** NestJS 11 + Prisma 7.8 (backend), Next.js 16 + Tailwind v4 (frontend), Jest (testes backend).

**Spec:** `docs/superpowers/specs/2026-09-15-acompanhamento-convites-cadastros-inscricoes-design.md`

---

## Nota de implementação (achado durante o planejamento)

A spec original supunha que o card "Convites expirados" poderia linkar para uma tela acessível tanto por ADMIN quanto por COMISSAO. Na prática, **`/admin/convidar` só existe para ADMIN** — COMISSAO não tem página de convites nenhuma (nem no `Sidebar`, nem em `app/(dashboard)/comissao/`). O plano abaixo ajusta isso: `AcompanhamentoView` recebe uma prop `basePath` (`"admin"` ou `"comissao"`); o card de "Convites expirados" só vira link clicável quando `basePath === "admin"` — para COMISSAO aparece como número, sem link. Os outros dois cards (Usuários, Inscrições) existem nas duas áreas e linkam normalmente. Isso também elimina a necessidade cogitada na spec de abrir `GET /admin/convites` para COMISSAO — não é mais preciso.

---

## Task 1: Backend — `DashboardService.getAcompanhamento` (funil + ações)

**Files:**
- Modify: `apps/admin/api/src/admin/dashboard/dashboard.service.ts`
- Test: `apps/admin/api/src/admin/dashboard/dashboard.service.spec.ts`

- [ ] **Step 1: Escrever os testes que falham**

Adicione ao final de `apps/admin/api/src/admin/dashboard/dashboard.service.spec.ts` (mesmo arquivo, novo `describe` depois do existente):

```ts
describe("DashboardService — getAcompanhamento", () => {
  let service: DashboardService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      convite: { count: jest.fn() },
      inscricao: { count: jest.fn() },
      edicao: { findFirst: jest.fn() },
      user: { count: jest.fn(), findMany: jest.fn() },
      instituicao: { findMany: jest.fn() },
    };
    service = new DashboardService(prisma as any);
  });

  it("monta o funil e as ações a partir das contagens", async () => {
    prisma.convite.count
      .mockResolvedValueOnce(10) // total (convidados)
      .mockResolvedValueOnce(7) // usados (cadastrados)
      .mockResolvedValueOnce(2); // expirados sem uso
    prisma.edicao.findFirst.mockResolvedValue({ id: "ed1" });
    prisma.inscricao.count
      .mockResolvedValueOnce(5) // inscritos na edição ativa
      .mockResolvedValueOnce(3) // confirmados
      .mockResolvedValueOnce(1); // pendentes
    prisma.user.count.mockResolvedValueOnce(4); // cadastradosSemInscricao
    prisma.instituicao.findMany.mockResolvedValue([]);

    const resultado = await service.getAcompanhamento();

    expect(resultado.funil).toEqual({
      convidados: 10,
      cadastrados: 7,
      inscritos: 5,
      confirmados: 3,
    });
    expect(resultado.acoes).toEqual({
      convitesExpirados: 2,
      cadastradosSemInscricao: 4,
      inscricoesPendentes: 1,
    });
    expect(prisma.convite.count).toHaveBeenNthCalledWith(3, {
      where: { usadoEm: null, expiraEm: { lt: expect.any(Date) } },
    });
  });

  it("sem edição ativa, inscritos e confirmados ficam zerados", async () => {
    prisma.convite.count.mockResolvedValue(0);
    prisma.edicao.findFirst.mockResolvedValue(null);
    prisma.inscricao.count.mockResolvedValue(0);
    prisma.user.count.mockResolvedValue(0);
    prisma.instituicao.findMany.mockResolvedValue([]);

    const resultado = await service.getAcompanhamento();

    expect(resultado.funil.inscritos).toBe(0);
    expect(resultado.funil.confirmados).toBe(0);
    expect(prisma.inscricao.count).toHaveBeenCalledTimes(1); // só a chamada de "pendentes"
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd apps/admin/api && npx jest dashboard.service.spec.ts`
Expected: FAIL — `service.getAcompanhamento is not a function`

- [ ] **Step 3: Implementar o método**

Em `apps/admin/api/src/admin/dashboard/dashboard.service.ts`, adicione logo após o método `getResumo()` (depois do `return { totalUsuarios, totalInscricoes, pendentes, cadastradosSemInscricao };` e do `}` que fecha `getResumo`):

```ts
  async getAcompanhamento(filtro?: {
    instituicaoId?: string;
    coordenadorId?: string;
  }) {
    const [convidados, cadastrados, edicaoAtiva] = await Promise.all([
      this.prisma.convite.count(),
      this.prisma.convite.count({ where: { usadoEm: { not: null } } }),
      this.prisma.edicao.findFirst({
        where: { status: "ATIVA" },
        select: { id: true },
      }),
    ]);

    const [inscritos, confirmados] = edicaoAtiva
      ? await Promise.all([
          this.prisma.inscricao.count({
            where: { edicaoId: edicaoAtiva.id },
          }),
          this.prisma.inscricao.count({
            where: { edicaoId: edicaoAtiva.id, status: "CONFIRMADA" },
          }),
        ])
      : [0, 0];

    const [convitesExpirados, cadastradosSemInscricao, inscricoesPendentes] =
      await Promise.all([
        this.prisma.convite.count({
          where: { usadoEm: null, expiraEm: { lt: new Date() } },
        }),
        this.prisma.user.count({
          where: { role: "ALUNO", inscricoes: { none: {} } },
        }),
        this.prisma.inscricao.count({ where: { status: "PENDENTE" } }),
      ]);

    const instituicoes = await this.prisma.instituicao.findMany({
      select: { id: true, nome: true, sigla: true },
      orderBy: { sigla: "asc" },
    });

    const { nivel, ranking, coordenadores } = await this.getRankingAcompanhamento(
      filtro,
      instituicoes,
    );

    return {
      funil: { convidados, cadastrados, inscritos, confirmados },
      instituicoes,
      ranking,
      nivel,
      coordenadores,
      acoes: {
        convitesExpirados,
        cadastradosSemInscricao,
        inscricoesPendentes,
      },
    };
  }

  private async getRankingAcompanhamento(
    filtro: { instituicaoId?: string; coordenadorId?: string } | undefined,
    instituicoes: { id: string; nome: string; sigla: string }[],
  ) {
    if (!filtro?.instituicaoId) {
      const ranking = await Promise.all(
        instituicoes.map(async (inst) => {
          const [alunos, inscritosCount] = await Promise.all([
            this.prisma.user.count({
              where: { role: "ALUNO", instituicaoId: inst.id },
            }),
            this.prisma.user.count({
              where: {
                role: "ALUNO",
                instituicaoId: inst.id,
                inscricoes: { some: {} },
              },
            }),
          ]);
          return {
            id: inst.id,
            nome: inst.sigla || inst.nome,
            alunos,
            inscritos: inscritosCount,
          };
        }),
      );
      return {
        nivel: "instituicao" as const,
        ranking: ordenarPorAtraso(ranking),
        coordenadores: null,
      };
    }

    const coordenadores = await this.prisma.user.findMany({
      where: { role: "COORDENADOR_CURSO", instituicaoId: filtro.instituicaoId },
      select: { id: true, nome: true },
      orderBy: { nome: "asc" },
    });

    const candidatos = filtro.coordenadorId
      ? coordenadores.filter((c: { id: string }) => c.id === filtro.coordenadorId)
      : coordenadores;

    const ranking = await Promise.all(
      candidatos.map(async (coord: { id: string; nome: string }) => {
        const [alunos, inscritosCount] = await Promise.all([
          this.prisma.user.count({
            where: { role: "ALUNO", coordenadorId: coord.id },
          }),
          this.prisma.user.count({
            where: {
              role: "ALUNO",
              coordenadorId: coord.id,
              inscricoes: { some: {} },
            },
          }),
        ]);
        return {
          id: coord.id,
          nome: coord.nome,
          alunos,
          inscritos: inscritosCount,
        };
      }),
    );

    return {
      nivel: "coordenador" as const,
      ranking: ordenarPorAtraso(ranking),
      coordenadores,
    };
  }
```

E adicione esta função utilitária no topo do arquivo, junto de `escapeCsv` (fora da classe):

```ts
function ordenarPorAtraso(
  linhas: { id: string; nome: string; alunos: number; inscritos: number }[],
) {
  return linhas
    .filter((l) => l.alunos > 0)
    .sort((a, b) => a.inscritos / a.alunos - b.inscritos / b.alunos);
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `cd apps/admin/api && npx jest dashboard.service.spec.ts`
Expected: `PASS (5) FAIL (0)` (3 testes de edições já existentes + 2 novos)

- [ ] **Step 5: Commit**

```bash
git add apps/admin/api/src/admin/dashboard/dashboard.service.ts apps/admin/api/src/admin/dashboard/dashboard.service.spec.ts
git commit -m "feat(dashboard): funil e ações do painel de acompanhamento"
```

---

## Task 2: Backend — ranking por instituição/coordenador

**Files:**
- Modify: `apps/admin/api/src/admin/dashboard/dashboard.service.spec.ts` (mesmo `describe` do Task 1)
- Modify: `apps/admin/api/src/admin/dashboard/dashboard.service.ts` (já implementado no Task 1 — este task só adiciona os testes que exercitam `getRankingAcompanhamento`)

- [ ] **Step 1: Escrever os testes que faltam**

Adicione estes três testes dentro do `describe("DashboardService — getAcompanhamento", ...)` criado no Task 1:

```ts
  it("ranking por instituição: ordena do pior para o melhor % e ignora instituição sem alunos", async () => {
    prisma.convite.count.mockResolvedValue(0);
    prisma.edicao.findFirst.mockResolvedValue(null);
    prisma.inscricao.count.mockResolvedValue(0);
    prisma.instituicao.findMany.mockResolvedValue([
      { id: "i1", nome: "Universidade Federal do Piauí", sigla: "UFPI" },
      { id: "i2", nome: "Universidade Estadual do Piauí", sigla: "UESPI" },
      { id: "i3", nome: "Vazia", sigla: "VAZ" },
    ]);
    prisma.user.count.mockImplementation(({ where }: any) => {
      if (where.instituicaoId === "i1" && where.inscricoes) return Promise.resolve(9);
      if (where.instituicaoId === "i1") return Promise.resolve(10);
      if (where.instituicaoId === "i2" && where.inscricoes) return Promise.resolve(2);
      if (where.instituicaoId === "i2") return Promise.resolve(10);
      if (where.instituicaoId === "i3") return Promise.resolve(0);
      return Promise.resolve(0);
    });

    const resultado = await service.getAcompanhamento();

    expect(resultado.nivel).toBe("instituicao");
    expect(resultado.coordenadores).toBeNull();
    expect(resultado.ranking).toEqual([
      { id: "i2", nome: "UESPI", alunos: 10, inscritos: 2 },
      { id: "i1", nome: "UFPI", alunos: 10, inscritos: 9 },
    ]);
  });

  it("filtro por instituicaoId muda o ranking para nível coordenador", async () => {
    prisma.convite.count.mockResolvedValue(0);
    prisma.edicao.findFirst.mockResolvedValue(null);
    prisma.inscricao.count.mockResolvedValue(0);
    prisma.instituicao.findMany.mockResolvedValue([]);
    prisma.user.findMany.mockResolvedValue([
      { id: "c1", nome: "Coordenador A" },
      { id: "c2", nome: "Coordenador B" },
    ]);
    prisma.user.count.mockImplementation(({ where }: any) => {
      if (where.coordenadorId === "c1" && where.inscricoes) return Promise.resolve(1);
      if (where.coordenadorId === "c1") return Promise.resolve(5);
      if (where.coordenadorId === "c2" && where.inscricoes) return Promise.resolve(4);
      if (where.coordenadorId === "c2") return Promise.resolve(5);
      return Promise.resolve(0);
    });

    const resultado = await service.getAcompanhamento({ instituicaoId: "i1" });

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { role: "COORDENADOR_CURSO", instituicaoId: "i1" },
      select: { id: true, nome: true },
      orderBy: { nome: "asc" },
    });
    expect(resultado.nivel).toBe("coordenador");
    expect(resultado.coordenadores).toEqual([
      { id: "c1", nome: "Coordenador A" },
      { id: "c2", nome: "Coordenador B" },
    ]);
    expect(resultado.ranking).toEqual([
      { id: "c1", nome: "Coordenador A", alunos: 5, inscritos: 1 },
      { id: "c2", nome: "Coordenador B", alunos: 5, inscritos: 4 },
    ]);
  });

  it("filtro por coordenadorId restringe o ranking a uma única linha", async () => {
    prisma.convite.count.mockResolvedValue(0);
    prisma.edicao.findFirst.mockResolvedValue(null);
    prisma.inscricao.count.mockResolvedValue(0);
    prisma.instituicao.findMany.mockResolvedValue([]);
    prisma.user.findMany.mockResolvedValue([
      { id: "c1", nome: "Coordenador A" },
      { id: "c2", nome: "Coordenador B" },
    ]);
    prisma.user.count.mockResolvedValue(3);

    const resultado = await service.getAcompanhamento({
      instituicaoId: "i1",
      coordenadorId: "c2",
    });

    expect(resultado.ranking).toHaveLength(1);
    expect(resultado.ranking[0].id).toBe("c2");
  });
```

- [ ] **Step 2: Rodar e confirmar que passa**

A implementação já existe (Task 1 já a escreveu). Run: `cd apps/admin/api && npx jest dashboard.service.spec.ts`
Expected: `PASS (8) FAIL (0)`

Se algum teste falhar, revise `getRankingAcompanhamento` no `dashboard.service.ts` — a causa mais provável é ordem de chamadas de `prisma.user.count` diferente da esperada pelo `mockImplementation` baseado em `where`.

- [ ] **Step 3: Commit**

```bash
git add apps/admin/api/src/admin/dashboard/dashboard.service.spec.ts
git commit -m "test(dashboard): cobre ranking por instituição e por coordenador"
```

---

## Task 3: Backend — expor `GET /admin/acompanhamento`

**Files:**
- Modify: `apps/admin/api/src/admin/dashboard/dashboard.controller.ts`

- [ ] **Step 1: Adicionar a rota**

Em `apps/admin/api/src/admin/dashboard/dashboard.controller.ts`, adicione este método na classe `DashboardController`, logo após `getResumo()`:

```ts
  @Roles(Role.ADMIN, Role.COMISSAO)
  @Get("acompanhamento")
  async getAcompanhamento(
    @Query("instituicaoId") instituicaoId?: string,
    @Query("coordenadorId") coordenadorId?: string,
  ) {
    return this.dashboardService.getAcompanhamento({
      instituicaoId,
      coordenadorId,
    });
  }
```

`Query`, `Get` e `Role` já estão importados no topo do arquivo — nenhum import novo é necessário.

- [ ] **Step 2: Verificar que compila**

Run: `cd apps/admin/api && npx tsc --noEmit -p tsconfig.json 2>&1 | grep dashboard.controller`
Expected: nenhuma saída (sem erros no arquivo)

- [ ] **Step 3: Commit**

```bash
git add apps/admin/api/src/admin/dashboard/dashboard.controller.ts
git commit -m "feat(dashboard): expõe GET /admin/acompanhamento para ADMIN e COMISSAO"
```

---

## Task 4: Backend — `ConvitesService.listar` com filtro `status=expirado`

**Files:**
- Modify: `apps/admin/api/src/convites/convites.service.ts`
- Test: `apps/admin/api/src/convites/convites.service.spec.ts`

- [ ] **Step 1: Escrever os testes que falham**

Adicione ao final de `apps/admin/api/src/convites/convites.service.spec.ts`, dentro do `describe("ConvitesService", ...)` já existente (mesmo nível de `describe("convidarAlunos", ...)`):

```ts
  describe("listar", () => {
    it("sem filtro, busca todos os convites (sem cláusula where)", async () => {
      prisma.convite.findMany.mockResolvedValue([]);

      await service.listar();

      const chamada = prisma.convite.findMany.mock.calls[0][0];
      expect(chamada.where).toBeUndefined();
    });

    it("com status=expirado, filtra por usadoEm nulo e expiraEm no passado", async () => {
      prisma.convite.findMany.mockResolvedValue([]);

      await service.listar({ status: "expirado" });

      const chamada = prisma.convite.findMany.mock.calls[0][0];
      expect(chamada.where.usadoEm).toBeNull();
      expect(chamada.where.expiraEm.lt).toBeInstanceOf(Date);
    });
  });
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd apps/admin/api && npx jest convites.service.spec.ts`
Expected: FAIL no teste "com status=expirado" — `chamada.where` é `undefined`, não tem `.usadoEm`

- [ ] **Step 3: Implementar o filtro**

Em `apps/admin/api/src/convites/convites.service.ts`, troque o método `listar()`:

```ts
  async listar(filtro?: { status?: "expirado" }) {
    const where =
      filtro?.status === "expirado"
        ? { usadoEm: null, expiraEm: { lt: new Date() } }
        : undefined;

    return this.prisma.convite.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        expiraEm: true,
        usadoEm: true,
        criadoPor: true,
        createdAt: true,
        instituicao: { select: { id: true, nome: true, sigla: true } },
        curso: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `cd apps/admin/api && npx jest convites.service.spec.ts`
Expected: `PASS (6) FAIL (0)` (4 testes já existentes + 2 novos)

- [ ] **Step 5: Commit**

```bash
git add apps/admin/api/src/convites/convites.service.ts apps/admin/api/src/convites/convites.service.spec.ts
git commit -m "feat(convites): filtro status=expirado em ConvitesService.listar"
```

---

## Task 5: Backend — aceitar `?status=` em `GET /admin/convites`

**Files:**
- Modify: `apps/admin/api/src/convites/convites.controller.ts`

- [ ] **Step 1: Adicionar o parâmetro**

Em `apps/admin/api/src/convites/convites.controller.ts`:

1. No import do `@nestjs/common` no topo do arquivo, adicione `Query`:

```ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
```

2. Troque o método `listar()`:

```ts
  @Get()
  async listar(@Query("status") status?: string) {
    return this.convitesService.listar(
      status === "expirado" ? { status: "expirado" } : undefined,
    );
  }
```

- [ ] **Step 2: Verificar que compila**

Run: `cd apps/admin/api && npx tsc --noEmit -p tsconfig.json 2>&1 | grep convites.controller`
Expected: nenhuma saída

- [ ] **Step 3: Commit**

```bash
git add apps/admin/api/src/convites/convites.controller.ts
git commit -m "feat(convites): GET /admin/convites aceita ?status=expirado"
```

---

## Task 6: Frontend — componente `FunilBarras`

**Files:**
- Create: `apps/admin/web/src/components/acompanhamento/FunilBarras.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
interface FunilDados {
  convidados: number;
  cadastrados: number;
  inscritos: number;
  confirmados: number;
}

export function FunilBarras({ funil }: { funil: FunilDados }) {
  const estagios: { label: string; valor: number; pct: number | null }[] = [
    { label: "Convidados", valor: funil.convidados, pct: null },
    {
      label: "Cadastrados",
      valor: funil.cadastrados,
      pct: funil.convidados > 0 ? funil.cadastrados / funil.convidados : null,
    },
    {
      label: "Inscritos",
      valor: funil.inscritos,
      pct: funil.cadastrados > 0 ? funil.inscritos / funil.cadastrados : null,
    },
    {
      label: "Confirmados",
      valor: funil.confirmados,
      pct: funil.inscritos > 0 ? funil.confirmados / funil.inscritos : null,
    },
  ];
  const max = Math.max(funil.convidados, 1);

  return (
    <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] space-y-3">
      <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
        Funil de Conversão
      </h2>
      {estagios.map((e) => (
        <div key={e.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-sm text-[#f0ece4]">
            {e.label}
          </span>
          <div className="flex-1 h-6 rounded bg-[#0a0a0f] border border-[#2a2a3a] overflow-hidden">
            <div
              className="h-full bg-[#E8B829] flex items-center pl-2 text-xs font-semibold text-[#0a0a0f] whitespace-nowrap"
              style={{
                width: `${Math.max((e.valor / max) * 100, e.valor > 0 ? 4 : 0)}%`,
              }}
            >
              {e.valor}
              {e.pct != null ? ` · ${Math.round(e.pct * 100)}%` : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/web/src/components/acompanhamento/FunilBarras.tsx
git commit -m "feat(acompanhamento): componente FunilBarras"
```

---

## Task 7: Frontend — componente `CardsAcao`

**Files:**
- Create: `apps/admin/web/src/components/acompanhamento/CardsAcao.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ban, UserX, Clock } from "lucide-react";

interface AcoesDados {
  convitesExpirados: number;
  cadastradosSemInscricao: number;
  inscricoesPendentes: number;
}

export function CardsAcao({
  acoes,
  basePath,
}: {
  acoes: AcoesDados;
  basePath: "admin" | "comissao";
}) {
  const cards = [
    {
      label: "Convites expirados",
      valor: acoes.convitesExpirados,
      icon: Ban,
      cor: "#e57373",
      href: basePath === "admin" ? "/admin/convidar?status=expirado" : null,
    },
    {
      label: "Cadastrados sem inscrição",
      valor: acoes.cadastradosSemInscricao,
      icon: UserX,
      cor: "#E8B829",
      href: `/${basePath}/usuarios`,
    },
    {
      label: "Inscrições pendentes",
      valor: acoes.inscricoesPendentes,
      icon: Clock,
      cor: "#f59e0b",
      href: `/${basePath}/inscricoes`,
    },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {cards.map((c) => {
        const conteudo = (
          <Card
            className={`border-[#2a2a3a] bg-[#12121a] transition-colors ${
              c.href ? "hover:border-[#3a3a4a] cursor-pointer" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-[#b0adc0] text-sm uppercase tracking-widest flex items-center gap-2">
                <c.icon size={18} style={{ color: c.cor }} />
                {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-3xl font-bold font-[family-name:var(--font-fraunces)]"
                style={{ color: c.cor }}
              >
                {c.valor}
              </p>
            </CardContent>
          </Card>
        );
        return c.href ? (
          <Link key={c.label} href={c.href}>
            {conteudo}
          </Link>
        ) : (
          <div key={c.label}>{conteudo}</div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/web/src/components/acompanhamento/CardsAcao.tsx
git commit -m "feat(acompanhamento): componente CardsAcao"
```

---

## Task 8: Frontend — componente `RankingInstituicoes`

**Files:**
- Create: `apps/admin/web/src/components/acompanhamento/RankingInstituicoes.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
interface LinhaRanking {
  id: string;
  nome: string;
  alunos: number;
  inscritos: number;
}

interface Props {
  instituicoes: { id: string; nome: string; sigla: string }[];
  ranking: LinhaRanking[];
  nivel: "instituicao" | "coordenador";
  coordenadores: { id: string; nome: string }[] | null;
  instituicaoId: string;
  coordenadorId: string;
  onSelecionarInstituicao: (id: string) => void;
  onSelecionarCoordenador: (id: string) => void;
}

function statusRanking(pct: number): { label: string; cor: string } {
  if (pct < 0.5) return { label: "Atrasado", cor: "#e57373" };
  if (pct < 0.8) return { label: "Atenção", cor: "#f59e0b" };
  return { label: "Em dia", cor: "#4ec98a" };
}

export function RankingInstituicoes({
  instituicoes,
  ranking,
  nivel,
  coordenadores,
  instituicaoId,
  coordenadorId,
  onSelecionarInstituicao,
  onSelecionarCoordenador,
}: Props) {
  return (
    <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          {nivel === "instituicao" ? "Por Instituição" : "Por Coordenador"}
        </h2>
        <div className="flex gap-2">
          <select
            value={instituicaoId}
            onChange={(e) => onSelecionarInstituicao(e.target.value)}
            className="h-9 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#f0ece4]"
          >
            <option value="">Todas instituições</option>
            {instituicoes.map((i) => (
              <option key={i.id} value={i.id}>
                {i.sigla || i.nome}
              </option>
            ))}
          </select>
          {instituicaoId && (
            <select
              value={coordenadorId}
              onChange={(e) => onSelecionarCoordenador(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#f0ece4]"
            >
              <option value="">Todos coordenadores</option>
              {(coordenadores ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {ranking.length === 0 ? (
        <p className="text-sm text-[#9895a4]">
          {instituicaoId && (coordenadores ?? []).length === 0
            ? "Nenhum coordenador cadastrado nesta instituição."
            : "Nenhum aluno cadastrado neste recorte."}
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.08em] text-[#6f6c7a]">
              <th className="py-2 pr-4">
                {nivel === "instituicao" ? "Instituição" : "Coordenador"}
              </th>
              <th className="py-2 pr-4">Alunos</th>
              <th className="py-2 pr-4">Inscritos</th>
              <th className="py-2 pr-4">%</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r) => {
              const pct = r.alunos > 0 ? r.inscritos / r.alunos : 0;
              const status = statusRanking(pct);
              return (
                <tr key={r.id} className="border-t border-[#2a2a3a]">
                  <td className="py-2 pr-4 text-[#f0ece4]">{r.nome}</td>
                  <td className="py-2 pr-4 text-[#9895a4]">{r.alunos}</td>
                  <td className="py-2 pr-4 text-[#9895a4]">{r.inscritos}</td>
                  <td className="py-2 pr-4 text-[#9895a4]">
                    {Math.round(pct * 100)}%
                  </td>
                  <td className="py-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: status.cor }}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/web/src/components/acompanhamento/RankingInstituicoes.tsx
git commit -m "feat(acompanhamento): componente RankingInstituicoes"
```

---

## Task 9: Frontend — `AcompanhamentoView` e as duas páginas

**Files:**
- Create: `apps/admin/web/src/components/acompanhamento/AcompanhamentoView.tsx`
- Create: `apps/admin/web/src/app/(dashboard)/admin/acompanhamento/page.tsx`
- Create: `apps/admin/web/src/app/(dashboard)/comissao/acompanhamento/page.tsx`

- [ ] **Step 1: Criar `AcompanhamentoView`**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { FunilBarras } from "./FunilBarras";
import { RankingInstituicoes } from "./RankingInstituicoes";
import { CardsAcao } from "./CardsAcao";

interface AcompanhamentoDados {
  funil: {
    convidados: number;
    cadastrados: number;
    inscritos: number;
    confirmados: number;
  };
  instituicoes: { id: string; nome: string; sigla: string }[];
  ranking: { id: string; nome: string; alunos: number; inscritos: number }[];
  nivel: "instituicao" | "coordenador";
  coordenadores: { id: string; nome: string }[] | null;
  acoes: {
    convitesExpirados: number;
    cadastradosSemInscricao: number;
    inscricoesPendentes: number;
  };
}

export function AcompanhamentoView({
  basePath,
}: {
  basePath: "admin" | "comissao";
}) {
  const [dados, setDados] = useState<AcompanhamentoDados | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [instituicaoId, setInstituicaoId] = useState("");
  const [coordenadorId, setCoordenadorId] = useState("");

  const carregar = useCallback(() => {
    setCarregando(true);
    const params: Record<string, string> = {};
    if (instituicaoId) params.instituicaoId = instituicaoId;
    if (coordenadorId) params.coordenadorId = coordenadorId;
    api
      .get("/admin/acompanhamento", { params })
      .then(({ data }) => setDados(data))
      .catch(() => setDados(null))
      .finally(() => setCarregando(false));
  }, [instituicaoId, coordenadorId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const selecionarInstituicao = (id: string) => {
    setInstituicaoId(id);
    setCoordenadorId("");
  };

  if (carregando && !dados) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
        <p className="text-[#b0adc0]">
          Não foi possível carregar os dados de acompanhamento.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Acompanhamento
        </h1>
        <p className="text-[#9895a4] mt-1">
          Convites, cadastros e inscrições da OLICMAT
        </p>
      </div>

      <CardsAcao acoes={dados.acoes} basePath={basePath} />
      <FunilBarras funil={dados.funil} />
      <RankingInstituicoes
        instituicoes={dados.instituicoes}
        ranking={dados.ranking}
        nivel={dados.nivel}
        coordenadores={dados.coordenadores}
        instituicaoId={instituicaoId}
        coordenadorId={coordenadorId}
        onSelecionarInstituicao={selecionarInstituicao}
        onSelecionarCoordenador={setCoordenadorId}
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Criar as duas páginas finas**

`apps/admin/web/src/app/(dashboard)/admin/acompanhamento/page.tsx`:

```tsx
"use client";

import { AcompanhamentoView } from "@/components/acompanhamento/AcompanhamentoView";

export default function AdminAcompanhamentoPage() {
  return <AcompanhamentoView basePath="admin" />;
}
```

`apps/admin/web/src/app/(dashboard)/comissao/acompanhamento/page.tsx`:

```tsx
"use client";

import { AcompanhamentoView } from "@/components/acompanhamento/AcompanhamentoView";

export default function ComissaoAcompanhamentoPage() {
  return <AcompanhamentoView basePath="comissao" />;
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/admin/web/src/components/acompanhamento/AcompanhamentoView.tsx \
        "apps/admin/web/src/app/(dashboard)/admin/acompanhamento/page.tsx" \
        "apps/admin/web/src/app/(dashboard)/comissao/acompanhamento/page.tsx"
git commit -m "feat(acompanhamento): AcompanhamentoView e rotas admin/comissao"
```

---

## Task 10: Frontend — links de navegação (Sidebar + home)

**Files:**
- Modify: `apps/admin/web/src/components/layout/Sidebar.tsx`
- Modify: `apps/admin/web/src/app/(dashboard)/admin/page.tsx`
- Modify: `apps/admin/web/src/app/(dashboard)/comissao/page.tsx`

- [ ] **Step 1: Adicionar ao Sidebar (ADMIN)**

Em `apps/admin/web/src/components/layout/Sidebar.tsx`, no array `configLinks`, insira uma linha depois de `/admin/convidar`:

```ts
const configLinks: NavLink[] = [
  { href: "/admin", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/instituicoes", label: "Instituições", icon: <Building2 size={18} /> },
  { href: "/admin/cursos", label: "Cursos", icon: <GraduationCap size={18} /> },
  { href: "/admin/edicoes", label: "Edições", icon: <Calendar size={18} /> },
  { href: "/admin/usuarios", label: "Usuários", icon: <Users size={18} /> },
  { href: "/admin/convidar", label: "Convidar Equipe", icon: <UserPlus size={18} /> },
  { href: "/admin/acompanhamento", label: "Acompanhamento", icon: <BarChart3 size={18} /> },
  { href: "/admin/inscricoes", label: "Inscrições", icon: <ClipboardList size={18} /> },
  { href: "/admin/provas", label: "Provas", icon: <BookOpen size={18} /> },
  { href: "/admin/monitoramento", label: "Monitoramento", icon: <Activity size={18} /> },
  { href: "/admin/exportar", label: "Exportar", icon: <Download size={18} /> },
  { href: "/admin/auditoria", label: "Auditoria", icon: <ShieldCheck size={18} /> },
];
```

- [ ] **Step 2: Adicionar ao Sidebar (COMISSAO)**

No mesmo arquivo, dentro de `roleConfigLinks()`, no `case "COMISSAO":`, insira uma linha depois de `/comissao/usuarios`:

```ts
      case "COMISSAO":
        return [
          { href: "/comissao", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
          { href: "/comissao/instituicoes", label: "Instituições", icon: <Building2 size={18} /> },
          { href: "/comissao/cursos", label: "Cursos", icon: <GraduationCap size={18} /> },
          { href: "/comissao/edicoes", label: "Edições", icon: <Calendar size={18} /> },
          { href: "/comissao/usuarios", label: "Usuários", icon: <Users size={18} /> },
          { href: "/comissao/acompanhamento", label: "Acompanhamento", icon: <BarChart3 size={18} /> },
          { href: "/comissao/inscricoes", label: "Inscrições", icon: <ClipboardList size={18} /> },
          { href: "/comissao/provas", label: "Provas", icon: <BookOpen size={18} /> },
          { href: "/comissao/monitoramento", label: "Monitoramento", icon: <Activity size={18} /> },
          { href: "/comissao/exportar", label: "Exportar", icon: <Download size={18} /> },
          { href: "/comissao/auditoria", label: "Auditoria", icon: <ShieldCheck size={18} /> },
        ];
```

`BarChart3` já está importado no topo do arquivo (é usado em `/coordenador/metricas`) — nenhum import novo necessário.

- [ ] **Step 3: Card de destaque na home do admin**

Em `apps/admin/web/src/app/(dashboard)/admin/page.tsx`:

1. No import de ícones, adicione `BarChart3`:

```tsx
import { Users, ClipboardList, Clock, BookOpen, Building2, GraduationCap, Calendar, Trophy, UserX, BarChart3 } from "lucide-react";
```

2. No array `links`, adicione como primeiro item:

```ts
  const links = [
    { href: "/admin/acompanhamento", label: "Acompanhamento", descricao: "Funil de convites, cadastros e inscrições", icon: BarChart3, cor: "#4CAF50" },
    { href: "/admin/instituicoes", label: "Instituicoes", descricao: "Gerenciar instituicoes", icon: Building2, cor: "#E8B829" },
    { href: "/admin/cursos", label: "Cursos", descricao: "Gerenciar cursos", icon: GraduationCap, cor: "#4CAF50" },
    { href: "/admin/edicoes", label: "Edicoes", descricao: "Gerenciar edicoes", icon: Calendar, cor: "#3AAFE0" },
    { href: "/admin/usuarios", label: "Usuarios", descricao: "Gerenciar usuarios e permissoes", icon: Users, cor: "#3AAFE0" },
    { href: "/admin/inscricoes", label: "Inscricoes", descricao: "Validar e gerenciar inscricoes", icon: ClipboardList, cor: "#E8B829" },
    { href: "/admin/provas", label: "Provas", descricao: "Criar e gerenciar provas", icon: BookOpen, cor: "#4CAF50" },
    { href: "/admin/avaliacao", label: "Avaliacao", descricao: "Avaliar Fase 2", icon: ClipboardList, cor: "#E8B829" },
    { href: "/admin/exportar", label: "Exportar", descricao: "Exportar dados dos resultados", icon: BookOpen, cor: "#3AAFE0" },
    { href: "/admin/ranking", label: "Ranking", descricao: "Calcular medalhas e publicar resultado", icon: Trophy, cor: "#f59e0b" },
    { href: "/admin/auditoria", label: "Auditoria", descricao: "Log de acoes do sistema", icon: Clock, cor: "#9895a4" },
  ];
```

- [ ] **Step 4: Card de destaque na home da comissão**

Em `apps/admin/web/src/app/(dashboard)/comissao/page.tsx`:

1. No import de ícones, adicione `BarChart3`:

```tsx
import { ClipboardList, BookOpen, Clock, Download, Eye, BarChart3 } from "lucide-react";
```

2. No array `links`, adicione como primeiro item:

```ts
  const links = [
    { href: "/comissao/acompanhamento", label: "Acompanhamento", descricao: "Funil de convites, cadastros e inscrições", icon: BarChart3, cor: "#4CAF50" },
    { href: "/comissao/inscricoes", label: "Inscrições", descricao: "Visualizar inscrições dos competidores", icon: ClipboardList, cor: "#E8B829" },
    { href: "/comissao/provas", label: "Provas", descricao: "Consultar provas cadastradas", icon: BookOpen, cor: "#3AAFE0" },
    { href: "/comissao/avaliacao", label: "Avaliação", descricao: "Acompanhar avaliações da Fase 2", icon: Eye, cor: "#4CAF50" },
    { href: "/comissao/exportar", label: "Exportar", descricao: "Exportar dados e resultados", icon: Download, cor: "#3AAFE0" },
    { href: "/comissao/auditoria", label: "Auditoria", descricao: "Visualizar log de ações do sistema", icon: Clock, cor: "#9895a4" },
  ];
```

- [ ] **Step 5: Commit**

```bash
git add apps/admin/web/src/components/layout/Sidebar.tsx \
        "apps/admin/web/src/app/(dashboard)/admin/page.tsx" \
        "apps/admin/web/src/app/(dashboard)/comissao/page.tsx"
git commit -m "feat(acompanhamento): links de navegação no Sidebar e nas homes"
```

---

## Task 11: Frontend — filtro de situação em `/admin/convidar`

**Files:**
- Modify: `apps/admin/web/src/app/(dashboard)/admin/convidar/page.tsx`

- [ ] **Step 1: Reestruturar com `Suspense` e ler `?status=` da URL**

Este arquivo usa `useSearchParams`, que no App Router exige um `<Suspense>` ao redor do componente que o chama (mesmo padrão já usado em `apps/admin/web/src/app/(auth)/convite/page.tsx`). Troque o arquivo inteiro por:

```tsx
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  interpretarLote,
  ROTULO_PAPEL,
  type InstituicaoBasica,
} from "@/lib/convites-lote";

interface Convite {
  id: string;
  nome: string;
  email: string;
  role: string;
  expiraEm: string;
  usadoEm: string | null;
  instituicao: { sigla: string; nome: string } | null;
  curso: { nome: string } | null;
}

interface Resultado {
  enviados: { email: string }[];
  falhaEnvio: { email: string; motivo: string }[];
  ignorados: { email: string; motivo: string }[];
}

export default function ConvidarEquipePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ConvidarEquipeContent />
    </Suspense>
  );
}

function ConvidarEquipeContent() {
  const searchParams = useSearchParams();
  const [instituicoes, setInstituicoes] = useState<InstituicaoBasica[]>([]);
  const [texto, setTexto] = useState("");
  const [convites, setConvites] = useState<Convite[]>([]);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<"" | "expirado">(
    searchParams.get("status") === "expirado" ? "expirado" : "",
  );

  const linhas = interpretarLote(texto, instituicoes);
  const invalidas = linhas.filter((l) => l.erro);
  const validas = linhas.filter((l) => !l.erro);

  const carregarConvites = (situacao: "" | "expirado") =>
    api
      .get("/admin/convites", {
        params: situacao ? { status: situacao } : undefined,
      })
      .then((r) => setConvites(r.data ?? []))
      .catch(() => setConvites([]));

  useEffect(() => {
    api
      .get("/instituicoes?limit=200")
      .then((r) => setInstituicoes(r.data?.data ?? []))
      .catch(() => setInstituicoes([]));
  }, []);

  useEffect(() => {
    carregarConvites(filtroSituacao);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroSituacao]);

  const enviar = async () => {
    setErro("");
    setResultado(null);

    if (!validas.length) return setErro("Nenhuma linha válida na lista.");
    if (invalidas.length) {
      return setErro(
        `Corrija as ${invalidas.length} linha(s) com problema antes de enviar.`,
      );
    }

    setEnviando(true);
    try {
      const r = await api.post("/admin/convites", {
        convites: validas.map((l) => ({
          nome: l.nome,
          email: l.email,
          role: l.role,
          instituicaoId: l.instituicaoId ?? undefined,
        })),
      });
      setResultado(r.data);
      setTexto("");
      await carregarConvites(filtroSituacao);
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Não foi possível enviar.");
    } finally {
      setEnviando(false);
    }
  };

  const termo = busca.trim().toLowerCase();
  const convitesFiltrados = useMemo(() => {
    if (!termo) return convites;
    return convites.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo),
    );
  }, [convites, termo]);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Convidar equipe
        </h1>
        <p className="text-[#9895a4] mt-2">
          Comissão, coordenações de curso, avaliadores e administradores. Cada
          pessoa recebe um link e preenche o próprio cadastro — você precisa
          apenas do nome, do e-mail e do papel.
        </p>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a] space-y-5">
        <div className="space-y-2">
          <label htmlFor="lista" className="block text-sm text-[#9895a4]">
            Lista — uma pessoa por linha
          </label>
          <textarea
            id="lista"
            rows={10}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={
              "Livia Fernanda; livia@ufpi.edu.br; comissao\n" +
              "Ray Silva; ray.silva@ufpi.edu.br; UFPI; coordenador_curso"
            }
            className="w-full rounded-lg bg-[#0f0f16] border border-[#2a2a3a] p-4 text-[#f0ece4] placeholder:text-[#57545f] focus:outline-none focus:border-[#3AAFE0] font-[family-name:var(--font-jetbrains-mono)] text-sm"
          />
          <div className="text-xs text-[#6f6c7a] space-y-1">
            <p>
              <code className="text-[#9895a4]">Nome; e-mail; papel</code> — ou,
              para coordenação,{" "}
              <code className="text-[#9895a4]">
                Nome; e-mail; instituição; papel
              </code>
              . Separe por ponto e vírgula, vírgula ou tabulação.
            </p>
            <p>
              Papéis aceitos: <code className="text-[#9895a4]">comissao</code>,{" "}
              <code className="text-[#9895a4]">coordenador_curso</code>,{" "}
              <code className="text-[#9895a4]">avaliador</code>,{" "}
              <code className="text-[#9895a4]">admin</code>. A instituição pode
              ser a sigla (UFPI) ou o nome completo.
            </p>
            <p>
              A coordenação escolhe o <strong>curso</strong> dela no momento do
              aceite, entre os cursos da instituição que você indicar aqui.
            </p>
          </div>
        </div>

        {linhas.length > 0 && (
          <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-4 space-y-3">
            <p className="text-sm text-[#f0ece4]">
              {validas.length} convite(s) prontos
              {invalidas.length > 0 && (
                <span className="text-red-400">
                  {" "}
                  · {invalidas.length} com problema
                </span>
              )}
            </p>

            {validas.length > 0 && (
              <div className="space-y-1">
                {validas.slice(0, 8).map((l, i) => (
                  <p key={i} className="text-xs text-[#9895a4]">
                    {l.nome} &lt;{l.email}&gt; —{" "}
                    <span className="text-[#4ec98a]">
                      {ROTULO_PAPEL[l.role] ?? l.role}
                    </span>
                    {l.instituicaoRotulo && (
                      <span className="text-[#3AAFE0]">
                        {" "}
                        · {l.instituicaoRotulo}
                      </span>
                    )}
                  </p>
                ))}
                {validas.length > 8 && (
                  <p className="text-xs text-[#6f6c7a]">
                    e mais {validas.length - 8}...
                  </p>
                )}
              </div>
            )}

            {invalidas.slice(0, 5).map((l, i) => (
              <p key={i} className="text-xs text-red-400">
                {l.nome || "(sem nome)"} {l.email && `<${l.email}>`} — {l.erro}
              </p>
            ))}
          </div>
        )}

        {erro && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
            {erro}
          </p>
        )}

        <Button
          onClick={enviar}
          disabled={enviando}
          className="h-12 px-6 text-base font-semibold"
          style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        >
          {enviando ? "Enviando..." : `Enviar ${validas.length || ""} convite(s)`}
        </Button>

        {resultado && (
          <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-4 space-y-2 text-sm">
            <p className="text-[#f0ece4]">
              Enviados: {resultado.enviados.length}
            </p>
            {resultado.falhaEnvio.length > 0 && (
              <div>
                <p className="text-amber-400">
                  Convite criado, mas o e-mail não saiu:{" "}
                  {resultado.falhaEnvio.length}
                </p>
                {resultado.falhaEnvio.map((f) => (
                  <p key={f.email} className="text-xs text-[#9895a4]">
                    {f.email} — {f.motivo}
                  </p>
                ))}
              </div>
            )}
            {resultado.ignorados.length > 0 && (
              <div>
                <p className="text-[#9895a4]">
                  Ignorados: {resultado.ignorados.length}
                </p>
                {resultado.ignorados.map((f) => (
                  <p key={f.email} className="text-xs text-[#6f6c7a]">
                    {f.email} — {f.motivo}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            Convites enviados
          </h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={filtroSituacao}
              onChange={(e) =>
                setFiltroSituacao(e.target.value as "" | "expirado")
              }
              className="h-10 rounded-lg bg-[#0f0f16] border border-[#2a2a3a] px-3 text-sm text-[#f0ece4]"
            >
              <option value="">Todas as situações</option>
              <option value="expirado">Só expirados</option>
            </select>
            {convites.length > 0 && (
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="h-10 w-full sm:w-72 rounded-lg bg-[#0f0f16] border border-[#2a2a3a] px-3 text-sm text-[#f0ece4] placeholder:text-[#57545f] focus:outline-none focus:border-[#3AAFE0]"
              />
            )}
          </div>
        </div>

        {!convites.length ? (
          <p className="text-sm text-[#9895a4]">
            {filtroSituacao === "expirado"
              ? "Nenhum convite expirado."
              : "Nenhum convite enviado ainda."}
          </p>
        ) : !convitesFiltrados.length ? (
          <p className="text-sm text-[#9895a4]">
            Nenhum convite encontrado para &quot;{busca}&quot;.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <p className="text-xs text-[#6f6c7a] mb-2">
              {convitesFiltrados.length} de {convites.length} convite(s)
            </p>
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.08em] text-[#6f6c7a]">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">E-mail</th>
                  <th className="py-2 pr-4">Papel</th>
                  <th className="py-2 pr-4">Vínculo</th>
                  <th className="py-2">Situação</th>
                </tr>
              </thead>
              <tbody>
                {convitesFiltrados.map((c) => (
                  <tr key={c.id} className="border-t border-[#2a2a3a]">
                    <td className="py-2 pr-4 text-[#f0ece4]">{c.nome}</td>
                    <td className="py-2 pr-4 text-[#9895a4]">{c.email}</td>
                    <td className="py-2 pr-4 text-[#9895a4]">
                      {ROTULO_PAPEL[c.role] ?? c.role}
                    </td>
                    <td className="py-2 pr-4 text-[#9895a4]">
                      {c.curso?.nome ?? c.instituicao?.sigla ?? "—"}
                    </td>
                    <td className="py-2">
                      {c.usadoEm ? (
                        <span className="text-[#4ec98a]">cadastrado</span>
                      ) : new Date(c.expiraEm) < new Date() ? (
                        <span className="text-red-400">expirado</span>
                      ) : (
                        <span className="text-amber-400">aguardando</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "apps/admin/web/src/app/(dashboard)/admin/convidar/page.tsx"
git commit -m "feat(convidar): filtro de situação (inclui deep-link ?status=expirado)"
```

---

## Task 12: Verificação manual (dev server + navegador)

Não há infraestrutura de testes de componente no frontend deste projeto (`apps/admin/web`) — a verificação desta feature é manual, como já é convenção neste repositório para mudanças de UI.

- [ ] **Step 1: Subir o backend**

Run: `cd apps/admin/api && npm run start:dev`
Expected: log `Nest application successfully started`, escutando a porta configurada (ver `.env`/`PORT`).

- [ ] **Step 2: Subir o frontend**

Run: `cd apps/admin/web && npm run dev`
Expected: log `Ready` com a URL local (normalmente `http://localhost:3000` ou a porta configurada em `.env.local`).

- [ ] **Step 3: Checklist no navegador**

Logado como ADMIN:
1. Abrir `/admin` — confirmar que o card "Acompanhamento" aparece como primeiro item de "Ações Rápidas" e que o Sidebar tem o item "Acompanhamento".
2. Clicar nele, abrir `/admin/acompanhamento` — confirmar que o funil (barras horizontais decrescentes), os 3 cards de ação e a tabela de ranking por instituição carregam sem erro no console.
3. No seletor de instituição, escolher uma instituição — confirmar que a tabela troca para "Por Coordenador" e lista os coordenadores dela.
4. Clicar no card "Convites expirados" — confirmar que abre `/admin/convidar?status=expirado` já filtrado (só convites expirados na tabela).
5. Clicar nos cards "Cadastrados sem inscrição" e "Inscrições pendentes" — confirmar que abrem `/admin/usuarios` e `/admin/inscricoes` normalmente.

Logado como COMISSAO:
6. Repetir os passos 1–3 em `/comissao` e `/comissao/acompanhamento`.
7. Confirmar que o card "Convites expirados" aparece com o número, mas **sem** virar link clicável (COMISSAO não tem página de convites).

- [ ] **Step 4: Rodar a suíte de backend inteira, para garantir que nada quebrou**

Run: `cd apps/admin/api && npx jest`
Expected: todos os testes passam, incluindo os novos de `dashboard.service.spec.ts` e `convites.service.spec.ts`.

Nenhum commit neste task — é só verificação. Se algo falhar, volte ao task correspondente, corrija e commite a correção lá.

# Link de Convite Reutilizável Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a Coordenadores de Curso (e, para outros papéis, a Admin/Comissão) um link de convite reutilizável, sem expiração e sem limite de usos, que substitui o e-mail de convite como forma primária de cadastro.

**Architecture:** Novo model Prisma `LinkConvite` (separado de `Convite`, que é de uso único e amarrado a um e-mail). Um novo módulo NestJS `LinksConviteModule` expõe três controllers: `/coordenacao/link-convite` (coordenador gera/regenera o próprio link de Aluno), `/admin/links-convite` (Admin/Comissão criam e gerenciam links para Coordenador de Curso/Avaliador/Comissão) e `/link-convite/:token` (público, sem guard — tela de cadastro). No frontend, uma página pública nova (`/cadastro/[token]`) e blocos novos nas telas de Coordenador e Admin/Comissão.

**Tech Stack:** NestJS 11 + Prisma 7.8 (backend), Next.js 16 + Tailwind v4 (frontend), Jest (testes backend).

**Spec:** `docs/superpowers/specs/2026-09-22-link-convite-reutilizavel-design.md`

---

## Task 1: Backend — Schema Prisma (`LinkConvite`) e migração

**Files:**
- Modify: `apps/admin/api/prisma/schema.prisma`

- [ ] **Step 1: Adicionar `origemLinkId` e a relação em `User`**

No model `User`, logo depois do bloco `coordenadorId`/`coordenador` (linhas 193-194 atuais):

```prisma
  coordenadorId         String?
  coordenador           User?               @relation("AlunosDoCoordenador", fields: [coordenadorId], references: [id], onDelete: SetNull)
```

Adicione imediatamente depois (antes de `matricula`):

```prisma
  origemLinkId          String?
  origemLink            LinkConvite?        @relation("CadastradosPorLink", fields: [origemLinkId], references: [id], onDelete: SetNull)
```

- [ ] **Step 2: Adicionar a relação inversa `linksConviteCriados` em `User`**

No mesmo model, no bloco de relações, logo depois de:

```prisma
  convitesCriados       Convite[]           @relation("ConvitesCriados")
```

adicione:

```prisma
  linksConviteCriados   LinkConvite[]       @relation("LinksConviteCriados")
```

(Isso fica antes do `@@index([coordenadorId])` que fecha o model.)

- [ ] **Step 3: Adicionar a relação inversa em `Instituicao`**

No model `Instituicao`, logo depois de:

```prisma
  convites            Convite[]
```

adicione:

```prisma
  linksConvite         LinkConvite[]
```

- [ ] **Step 4: Adicionar a relação inversa em `Curso`**

No model `Curso`, logo depois de:

```prisma
  convites       Convite[]
```

adicione:

```prisma
  linksConvite   LinkConvite[]
```

- [ ] **Step 5: Criar o model `LinkConvite`**

No final do arquivo `schema.prisma`, depois do fechamento do model `Convite` (última linha do arquivo), adicione:

```prisma
/// Link de convite reutilizável: sem expiração, sem limite de usos. Quem
/// tiver o link se cadastra sozinho — o token é a única credencial. Ao
/// contrário de Convite (uso único, amarrado a um e-mail conhecido de
/// antemão), aqui nome e e-mail só existem quando a pessoa se cadastra.
model LinkConvite {
  id            String    @id @default(uuid())
  token         String    @unique
  role          Role
  instituicaoId String?
  cursoId       String?
  criadoPorId   String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  criadoPor     User         @relation("LinksConviteCriados", fields: [criadoPorId], references: [id], onDelete: Cascade)
  instituicao   Instituicao? @relation(fields: [instituicaoId], references: [id], onDelete: SetNull)
  curso         Curso?       @relation(fields: [cursoId], references: [id], onDelete: SetNull)
  cadastrados   User[]       @relation("CadastradosPorLink")

  @@index([criadoPorId])
  @@index([token])
}
```

- [ ] **Step 6: Gerar e aplicar a migração**

Run: `cd apps/admin/api && npx prisma migrate dev --name add_link_convite_reutilizavel`
Expected: migração criada em `prisma/migrations/`, aplicada sem erro, Prisma Client regenerado.

- [ ] **Step 7: Verificar que o backend ainda compila**

Run: `cd apps/admin/api && npx tsc --noEmit 2>&1 | grep -v "auth.service.spec\|inscricao.service.spec\|ranking.service.spec"`
Expected: nenhuma saída (os três arquivos filtrados têm erros de TS pré-existentes e não relacionados a este trabalho — não devem aparecer erros novos).

- [ ] **Step 8: Commit**

```bash
git add apps/admin/api/prisma/schema.prisma apps/admin/api/prisma/migrations
git commit -m "feat(schema): model LinkConvite para convites reutilizáveis"
```

---

## Task 2: Backend — DTOs (Zod)

**Files:**
- Create: `apps/admin/api/src/links-convite/dto/links-convite.dto.ts`

- [ ] **Step 1: Criar o arquivo de DTOs**

```ts
import { z } from "zod";
import { aceitarConviteSchema } from "../../convites/dto/convites.dto.js";

/**
 * Papel do link gerado por Admin/Comissão. ALUNO fica de fora — só o
 * coordenador gera link de Aluno, e ADMIN não é convidável por link (mesma
 * regra de segurança que já vale para o fluxo de Convite).
 */
export const criarLinkConviteSchema = z
  .object({
    role: z.enum(["COORDENADOR_CURSO", "AVALIADOR", "COMISSAO"]),
    cursoId: z.string().uuid("Curso inválido").optional(),
  })
  .refine((d) => d.role !== "COORDENADOR_CURSO" || !!d.cursoId, {
    message: "Selecione o curso para um link de Coordenador de Curso",
    path: ["cursoId"],
  })
  .refine((d) => d.role === "COORDENADOR_CURSO" || !d.cursoId, {
    message: "Curso só se aplica a um link de Coordenador de Curso",
    path: ["cursoId"],
  });

/**
 * Cadastro público pelo link reutilizável. Reaproveita aceitarConviteSchema
 * (cpf/senha/dataNascimento/nomeMae/matricula/telefone), removendo
 * instituicaoId/cursoId — aqui eles vêm sempre do LinkConvite, nunca do
 * corpo da requisição — e acrescentando nome/email, que no fluxo de Convite
 * já vinham fixados no convite e aqui a pessoa precisa informar.
 */
export const cadastrarPorLinkSchema = aceitarConviteSchema
  .omit({ instituicaoId: true, cursoId: true })
  .extend({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z
      .string()
      .email("Email inválido")
      .transform((v) => v.toLowerCase().trim()),
  });

export type CriarLinkConviteDto = z.infer<typeof criarLinkConviteSchema>;
export type CadastrarPorLinkDto = z.infer<typeof cadastrarPorLinkSchema>;
```

- [ ] **Step 2: Verificar que compila**

Run: `cd apps/admin/api && npx tsc --noEmit 2>&1 | grep links-convite`
Expected: nenhuma saída.

- [ ] **Step 3: Commit**

```bash
git add apps/admin/api/src/links-convite/dto/links-convite.dto.ts
git commit -m "feat(links-convite): DTOs de criação e cadastro por link"
```

---

## Task 3: Backend — `LinksConviteService` (Coordenador)

**Files:**
- Create: `apps/admin/api/src/links-convite/links-convite.service.ts`
- Test: `apps/admin/api/src/links-convite/links-convite.service.spec.ts`

- [ ] **Step 1: Escrever os testes que falham**

```ts
import { jest } from "@jest/globals";
import { ForbiddenException } from "@nestjs/common";
import { LinksConviteService } from "./links-convite.service.js";

describe("LinksConviteService — coordenador", () => {
  let service: LinksConviteService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      coordenadorCurso: { findUnique: jest.fn() },
      linkConvite: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
      user: { count: jest.fn() },
    };
    service = new LinksConviteService(prisma as any);
  });

  describe("obterLinkCoordenador", () => {
    it("retorna token null quando o coordenador nunca gerou um link", async () => {
      prisma.linkConvite.findFirst.mockResolvedValue(null);

      const resultado = await service.obterLinkCoordenador("coord1");

      expect(resultado).toEqual({ token: null, totalCadastros: 0 });
    });

    it("retorna token e contador quando já existe", async () => {
      prisma.linkConvite.findFirst.mockResolvedValue({ id: "l1", token: "abc123" });
      prisma.user.count.mockResolvedValue(5);

      const resultado = await service.obterLinkCoordenador("coord1");

      expect(resultado).toEqual({ token: "abc123", totalCadastros: 5 });
      expect(prisma.user.count).toHaveBeenCalledWith({ where: { origemLinkId: "l1" } });
    });
  });

  describe("gerarOuRegenerarLinkCoordenador", () => {
    it("lança ForbiddenException quando o coordenador não tem curso vinculado", async () => {
      prisma.coordenadorCurso.findUnique.mockResolvedValue(null);

      await expect(
        service.gerarOuRegenerarLinkCoordenador("coord1"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("cria um novo link quando o coordenador nunca gerou um", async () => {
      prisma.coordenadorCurso.findUnique.mockResolvedValue({
        curso: { id: "curso1", instituicaoId: "inst1" },
      });
      prisma.linkConvite.findFirst.mockResolvedValue(null);
      prisma.linkConvite.create.mockResolvedValue({ id: "l1", token: "novo-token" });

      const resultado = await service.gerarOuRegenerarLinkCoordenador("coord1");

      expect(prisma.linkConvite.create).toHaveBeenCalledWith({
        data: {
          token: expect.any(String),
          role: "ALUNO",
          cursoId: "curso1",
          instituicaoId: "inst1",
          criadoPorId: "coord1",
        },
      });
      expect(prisma.linkConvite.update).not.toHaveBeenCalled();
      expect(resultado.token).toBe("novo-token");
    });

    it("regenera o token do link existente em vez de criar outro", async () => {
      prisma.coordenadorCurso.findUnique.mockResolvedValue({
        curso: { id: "curso1", instituicaoId: "inst1" },
      });
      prisma.linkConvite.findFirst.mockResolvedValue({ id: "l1", token: "velho" });
      prisma.linkConvite.update.mockResolvedValue({ id: "l1", token: "novo" });

      const resultado = await service.gerarOuRegenerarLinkCoordenador("coord1");

      expect(prisma.linkConvite.create).not.toHaveBeenCalled();
      expect(prisma.linkConvite.update).toHaveBeenCalledWith({
        where: { id: "l1" },
        data: { token: expect.any(String) },
      });
      expect(resultado.token).toBe("novo");
    });
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd apps/admin/api && npx jest links-convite.service.spec.ts`
Expected: FAIL — `Cannot find module './links-convite.service.js'`

- [ ] **Step 3: Implementar o serviço (parte coordenador)**

```ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { Role } from "../../generated/prisma/client.js";
import type { PaginationParams } from "../common/pagination.js";
import { getSkipTake, paginate } from "../common/pagination.js";
import type {
  CriarLinkConviteDto,
  CadastrarPorLinkDto,
} from "./dto/links-convite.dto.js";

@Injectable()
export class LinksConviteService {
  constructor(private prisma: PrismaService) {}

  // ── Coordenador ──────────────────────────────────────────────

  async obterLinkCoordenador(coordenadorId: string) {
    const link = await this.prisma.linkConvite.findFirst({
      where: { criadoPorId: coordenadorId, role: Role.ALUNO },
    });
    if (!link) {
      return { token: null, totalCadastros: 0 };
    }
    const totalCadastros = await this.prisma.user.count({
      where: { origemLinkId: link.id },
    });
    return { token: link.token, totalCadastros };
  }

  async gerarOuRegenerarLinkCoordenador(coordenadorId: string) {
    const vinculo = await this.prisma.coordenadorCurso.findUnique({
      where: { userId: coordenadorId },
      include: { curso: { select: { id: true, instituicaoId: true } } },
    });
    if (!vinculo) {
      throw new ForbiddenException("Coordenador não possui curso vinculado");
    }

    const token = randomBytes(32).toString("hex");
    const existente = await this.prisma.linkConvite.findFirst({
      where: { criadoPorId: coordenadorId, role: Role.ALUNO },
    });

    if (existente) {
      return this.prisma.linkConvite.update({
        where: { id: existente.id },
        data: { token },
      });
    }

    return this.prisma.linkConvite.create({
      data: {
        token,
        role: Role.ALUNO,
        cursoId: vinculo.curso.id,
        instituicaoId: vinculo.curso.instituicaoId,
        criadoPorId: coordenadorId,
      },
    });
  }
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `cd apps/admin/api && npx jest links-convite.service.spec.ts`
Expected: `PASS (4) FAIL (0)`

- [ ] **Step 5: Commit**

```bash
git add apps/admin/api/src/links-convite/links-convite.service.ts apps/admin/api/src/links-convite/links-convite.service.spec.ts
git commit -m "feat(links-convite): geração e regeneração do link do coordenador"
```

---

## Task 4: Backend — `LinksConviteService` (Admin/Comissão)

**Files:**
- Modify: `apps/admin/api/src/links-convite/links-convite.service.ts`
- Modify: `apps/admin/api/src/links-convite/links-convite.service.spec.ts`

- [ ] **Step 1: Escrever os testes que faltam**

Adicione ao final de `links-convite.service.spec.ts` (fora do `describe` existente, mas no mesmo arquivo — ajuste o `prisma` mock do `beforeEach` do describe existente para incluir os campos novos usados aqui, OU crie um novo `describe` com seu próprio `beforeEach`, como abaixo):

```ts
describe("LinksConviteService — admin", () => {
  let service: LinksConviteService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      linkConvite: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      curso: { findUnique: jest.fn() },
      user: { count: jest.fn() },
    };
    service = new LinksConviteService(prisma as any);
  });

  describe("criarLinkAdmin", () => {
    it("cria um link para COORDENADOR_CURSO derivando instituicaoId do curso", async () => {
      prisma.curso.findUnique.mockResolvedValue({ instituicaoId: "inst1" });
      prisma.linkConvite.create.mockResolvedValue({ id: "l1", token: "tok" });

      await service.criarLinkAdmin(
        { role: "COORDENADOR_CURSO", cursoId: "curso1" },
        { id: "admin1" },
      );

      expect(prisma.linkConvite.create).toHaveBeenCalledWith({
        data: {
          token: expect.any(String),
          role: "COORDENADOR_CURSO",
          cursoId: "curso1",
          instituicaoId: "inst1",
          criadoPorId: "admin1",
        },
      });
    });

    it("cria um link para AVALIADOR sem curso nem instituição", async () => {
      prisma.linkConvite.create.mockResolvedValue({ id: "l1", token: "tok" });

      await service.criarLinkAdmin({ role: "AVALIADOR" }, { id: "admin1" });

      expect(prisma.curso.findUnique).not.toHaveBeenCalled();
      expect(prisma.linkConvite.create).toHaveBeenCalledWith({
        data: {
          token: expect.any(String),
          role: "AVALIADOR",
          cursoId: null,
          instituicaoId: null,
          criadoPorId: "admin1",
        },
      });
    });

    it("lança BadRequestException quando o curso não existe", async () => {
      prisma.curso.findUnique.mockResolvedValue(null);

      await expect(
        service.criarLinkAdmin(
          { role: "COORDENADOR_CURSO", cursoId: "curso-inexistente" },
          { id: "admin1" },
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("regenerarLinkAdmin", () => {
    it("lança NotFoundException quando o link não existe", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue(null);

      await expect(service.regenerarLinkAdmin("l1")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("regenera o token do link", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({ id: "l1", token: "velho" });
      prisma.linkConvite.update.mockResolvedValue({ id: "l1", token: "novo" });

      const resultado = await service.regenerarLinkAdmin("l1");

      expect(prisma.linkConvite.update).toHaveBeenCalledWith({
        where: { id: "l1" },
        data: { token: expect.any(String) },
      });
      expect(resultado.token).toBe("novo");
    });
  });

  describe("listarLinksAdmin", () => {
    it("pagina os links e acrescenta o contador de cadastros por link", async () => {
      prisma.linkConvite.findMany.mockResolvedValue([
        { id: "l1", role: "AVALIADOR" },
        { id: "l2", role: "COMISSAO" },
      ]);
      prisma.linkConvite.count.mockResolvedValue(2);
      prisma.user.count.mockResolvedValueOnce(3).mockResolvedValueOnce(0);

      const resultado = await service.listarLinksAdmin({});

      expect(resultado.data).toEqual([
        { id: "l1", role: "AVALIADOR", totalCadastros: 3 },
        { id: "l2", role: "COMISSAO", totalCadastros: 0 },
      ]);
      expect(resultado.total).toBe(2);
    });
  });
});
```

No topo do arquivo de teste, os imports precisam incluir `BadRequestException` e `NotFoundException` além de `ForbiddenException` já usado no describe do Task 3:

```ts
import { jest } from "@jest/globals";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { LinksConviteService } from "./links-convite.service.js";
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd apps/admin/api && npx jest links-convite.service.spec.ts`
Expected: FAIL — `service.criarLinkAdmin is not a function` (e os outros dois métodos novos)

- [ ] **Step 3: Implementar os métodos de admin**

Em `links-convite.service.ts`, adicione estes três métodos na classe, logo após `gerarOuRegenerarLinkCoordenador`:

```ts
  // ── Admin/Comissão ───────────────────────────────────────────

  async listarLinksAdmin(params: PaginationParams) {
    const { skip, take } = getSkipTake(params);
    const [links, total] = await Promise.all([
      this.prisma.linkConvite.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          curso: { select: { id: true, nome: true } },
          instituicao: { select: { id: true, nome: true, sigla: true } },
          criadoPor: { select: { id: true, nome: true } },
        },
      }),
      this.prisma.linkConvite.count(),
    ]);

    const comContadores = await Promise.all(
      links.map(async (link: { id: string }) => ({
        ...link,
        totalCadastros: await this.prisma.user.count({
          where: { origemLinkId: link.id },
        }),
      })),
    );

    return paginate(comContadores, total, params);
  }

  async criarLinkAdmin(dados: CriarLinkConviteDto, actor: { id: string }) {
    let instituicaoId: string | null = null;

    if (dados.cursoId) {
      const curso = await this.prisma.curso.findUnique({
        where: { id: dados.cursoId },
        select: { instituicaoId: true },
      });
      if (!curso) {
        throw new BadRequestException("Curso não encontrado");
      }
      instituicaoId = curso.instituicaoId;
    }

    const token = randomBytes(32).toString("hex");
    return this.prisma.linkConvite.create({
      data: {
        token,
        role: dados.role as Role,
        cursoId: dados.cursoId ?? null,
        instituicaoId,
        criadoPorId: actor.id,
      },
    });
  }

  async regenerarLinkAdmin(id: string) {
    const link = await this.prisma.linkConvite.findUnique({ where: { id } });
    if (!link) {
      throw new NotFoundException("Link não encontrado");
    }

    const token = randomBytes(32).toString("hex");
    return this.prisma.linkConvite.update({
      where: { id },
      data: { token },
    });
  }
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `cd apps/admin/api && npx jest links-convite.service.spec.ts`
Expected: `PASS (10) FAIL (0)` (4 do Task 3 + 6 novos)

- [ ] **Step 5: Commit**

```bash
git add apps/admin/api/src/links-convite/links-convite.service.ts apps/admin/api/src/links-convite/links-convite.service.spec.ts
git commit -m "feat(links-convite): criação, listagem e regeneração pelo Admin/Comissão"
```

---

## Task 5: Backend — `LinksConviteService` (Público — buscar e cadastrar)

**Files:**
- Modify: `apps/admin/api/src/links-convite/links-convite.service.ts`
- Modify: `apps/admin/api/src/links-convite/links-convite.service.spec.ts`

- [ ] **Step 1: Escrever os testes que faltam**

Adicione ao final de `links-convite.service.spec.ts`:

```ts
describe("LinksConviteService — público", () => {
  let service: LinksConviteService;
  let prisma: any;

  const dadosBase = {
    nome: "Fulano de Tal",
    email: "fulano@example.com",
    cpf: "11144477735",
    senha: "senha1234",
    dataNascimento: "2000-01-01",
    telefone: undefined,
    nomeMae: undefined,
    matricula: undefined,
  };

  beforeEach(() => {
    prisma = {
      linkConvite: { findUnique: jest.fn() },
      user: { findUnique: jest.fn(), create: jest.fn() },
      coordenadorCurso: { create: jest.fn() },
      $transaction: jest.fn(async (fn: any) => fn(prisma)),
    };
    service = new LinksConviteService(prisma as any);
  });

  describe("buscarPorToken", () => {
    it("lança NotFoundException quando o token não existe", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue(null);

      await expect(service.buscarPorToken("tok")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("retorna papel, curso e instituição do link", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        role: "ALUNO",
        curso: {
          id: "c1",
          nome: "Matemática",
          instituicao: { id: "i1", nome: "UFPI", sigla: "UFPI" },
        },
        instituicao: null,
      });

      const resultado = await service.buscarPorToken("tok");

      expect(resultado).toEqual({
        role: "ALUNO",
        curso: {
          id: "c1",
          nome: "Matemática",
          instituicao: { id: "i1", nome: "UFPI", sigla: "UFPI" },
        },
        instituicao: null,
      });
    });
  });

  describe("cadastrar", () => {
    it("lança NotFoundException quando o token não existe", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue(null);

      await expect(service.cadastrar("tok", dadosBase as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("lança BadRequestException quando o e-mail já está em uso", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        id: "l1",
        role: "ALUNO",
        cursoId: "c1",
        instituicaoId: "i1",
        criadoPorId: "coord1",
      });
      prisma.user.findUnique.mockResolvedValueOnce({ id: "u-existente" });

      await expect(service.cadastrar("tok", dadosBase as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("lança BadRequestException quando o CPF já está em uso", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        id: "l1",
        role: "ALUNO",
        cursoId: "c1",
        instituicaoId: "i1",
        criadoPorId: "coord1",
      });
      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: "u-existente" });

      await expect(service.cadastrar("tok", dadosBase as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("cria o usuário herdando papel/curso/instituição do link e o vínculo de coordenador quando ALUNO", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        id: "l1",
        role: "ALUNO",
        cursoId: "c1",
        instituicaoId: "i1",
        criadoPorId: "coord1",
      });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "novo",
        nome: dadosBase.nome,
        email: dadosBase.email,
        role: "ALUNO",
      });

      const resultado = await service.cadastrar("tok", dadosBase as any);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: "ALUNO",
            instituicaoId: "i1",
            cursoId: "c1",
            coordenadorId: "coord1",
            origemLinkId: "l1",
          }),
        }),
      );
      expect(prisma.coordenadorCurso.create).not.toHaveBeenCalled();
      expect(resultado.id).toBe("novo");
    });

    it("cria o vínculo CoordenadorCurso quando o link é de papel COORDENADOR_CURSO", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        id: "l1",
        role: "COORDENADOR_CURSO",
        cursoId: "c1",
        instituicaoId: "i1",
        criadoPorId: "admin1",
      });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "novoCoord",
        nome: dadosBase.nome,
        email: dadosBase.email,
        role: "COORDENADOR_CURSO",
      });

      const resultado = await service.cadastrar("tok", dadosBase as any);

      expect(prisma.coordenadorCurso.create).toHaveBeenCalledWith({
        data: { userId: "novoCoord", cursoId: "c1" },
      });
      expect(resultado.id).toBe("novoCoord");
    });
  });
});
```

Mock de `bcrypt` no topo do arquivo de teste (junto dos outros imports, fora de qualquer `describe`):

```ts
jest.mock("bcrypt", () => ({
  __esModule: true,
  default: { hash: jest.fn(async () => "hashed") },
}));
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd apps/admin/api && npx jest links-convite.service.spec.ts`
Expected: FAIL — `service.buscarPorToken is not a function` (e `service.cadastrar`)

- [ ] **Step 3: Implementar os métodos públicos**

Em `links-convite.service.ts`, adicione estes dois métodos no final da classe, e ajuste os imports do topo do arquivo:

Import no topo (substituir a linha de import do `@nestjs/common` existente):

```ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
```

Métodos:

```ts
  // ── Público ──────────────────────────────────────────────────

  async buscarPorToken(token: string) {
    const link = await this.prisma.linkConvite.findUnique({
      where: { token },
      include: {
        curso: {
          select: {
            id: true,
            nome: true,
            instituicao: { select: { id: true, nome: true, sigla: true } },
          },
        },
        instituicao: { select: { id: true, nome: true, sigla: true } },
      },
    });

    if (!link) {
      throw new NotFoundException("Link não encontrado");
    }

    return {
      role: link.role,
      curso: link.curso
        ? {
            id: link.curso.id,
            nome: link.curso.nome,
            instituicao: link.curso.instituicao,
          }
        : null,
      instituicao: link.instituicao ?? null,
    };
  }

  async cadastrar(token: string, dados: CadastrarPorLinkDto) {
    const link = await this.prisma.linkConvite.findUnique({ where: { token } });
    if (!link) {
      throw new NotFoundException("Link não encontrado");
    }

    const emailEmUso = await this.prisma.user.findUnique({
      where: { email: dados.email },
      select: { id: true },
    });
    if (emailEmUso) {
      throw new BadRequestException("Já existe um cadastro com este e-mail");
    }

    const cpfEmUso = await this.prisma.user.findUnique({
      where: { cpf: dados.cpf },
      select: { id: true },
    });
    if (cpfEmUso) {
      throw new BadRequestException("Já existe um cadastro com este CPF");
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    return this.prisma.$transaction(async (tx: any) => {
      const criado = await tx.user.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          cpf: dados.cpf,
          senhaHash,
          role: link.role,
          matricula: dados.matricula ?? "",
          dataNascimento: new Date(dados.dataNascimento),
          nomeMae: dados.nomeMae ?? null,
          telefone: dados.telefone ?? null,
          instituicaoId: link.instituicaoId,
          cursoId: link.cursoId,
          coordenadorId: link.role === Role.ALUNO ? link.criadoPorId : null,
          origemLinkId: link.id,
          emailConfirmado: true,
        },
        select: { id: true, nome: true, email: true, role: true },
      });

      if (link.role === Role.COORDENADOR_CURSO && link.cursoId) {
        await tx.coordenadorCurso.create({
          data: { userId: criado.id, cursoId: link.cursoId },
        });
      }

      return criado;
    });
  }
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `cd apps/admin/api && npx jest links-convite.service.spec.ts`
Expected: `PASS (17) FAIL (0)` (10 dos Tasks 3-4 + 7 novos)

- [ ] **Step 5: Commit**

```bash
git add apps/admin/api/src/links-convite/links-convite.service.ts apps/admin/api/src/links-convite/links-convite.service.spec.ts
git commit -m "feat(links-convite): busca e cadastro público pelo link"
```

---

## Task 6: Backend — Controllers, módulo e registro no `app.module`

**Files:**
- Create: `apps/admin/api/src/links-convite/links-convite.controller.ts`
- Create: `apps/admin/api/src/links-convite/links-convite.module.ts`
- Modify: `apps/admin/api/src/app.module.ts`

- [ ] **Step 1: Criar os controllers**

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
import type { Request } from "express";
import { LinksConviteService } from "./links-convite.service.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { Role } from "../../generated/prisma/client.js";
import {
  criarLinkConviteSchema,
  cadastrarPorLinkSchema,
} from "./dto/links-convite.dto.js";

interface ReqUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("coordenacao/link-convite")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COORDENADOR_CURSO)
export class CoordenacaoLinkConviteController {
  constructor(private readonly linksConviteService: LinksConviteService) {}

  @Get()
  async obter(@Req() req: Request) {
    const actor = req.user as ReqUser;
    return this.linksConviteService.obterLinkCoordenador(actor.id);
  }

  @Post()
  async gerar(@Req() req: Request) {
    const actor = req.user as ReqUser;
    return this.linksConviteService.gerarOuRegenerarLinkCoordenador(actor.id);
  }
}

@Controller("admin/links-convite")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COMISSAO)
export class AdminLinksConviteController {
  constructor(private readonly linksConviteService: LinksConviteService) {}

  @Get()
  async listar(@Query("page") page?: number, @Query("limit") limit?: number) {
    return this.linksConviteService.listarLinksAdmin({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post()
  async criar(@Body() body: unknown, @Req() req: Request) {
    const parsed = criarLinkConviteSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    const actor = req.user as ReqUser;
    return this.linksConviteService.criarLinkAdmin(parsed.data, actor);
  }

  @Post(":id/regenerar")
  async regenerar(@Param("id") id: string) {
    return this.linksConviteService.regenerarLinkAdmin(id);
  }
}

/**
 * Rota pública: quem se cadastra por aqui ainda não tem conta, então não há
 * como autenticar. O token no link é a credencial.
 */
@Controller("link-convite")
export class LinkConvitePublicoController {
  constructor(private readonly linksConviteService: LinksConviteService) {}

  @Get(":token")
  async buscar(@Param("token") token: string) {
    return this.linksConviteService.buscarPorToken(token);
  }

  @Post(":token/cadastrar")
  async cadastrar(@Param("token") token: string, @Body() body: unknown) {
    const parsed = cadastrarPorLinkSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.linksConviteService.cadastrar(token, parsed.data);
  }
}
```

- [ ] **Step 2: Criar o módulo**

```ts
import { Module } from "@nestjs/common";
import { LinksConviteService } from "./links-convite.service.js";
import {
  CoordenacaoLinkConviteController,
  AdminLinksConviteController,
  LinkConvitePublicoController,
} from "./links-convite.controller.js";

@Module({
  controllers: [
    CoordenacaoLinkConviteController,
    AdminLinksConviteController,
    LinkConvitePublicoController,
  ],
  providers: [LinksConviteService],
  exports: [LinksConviteService],
})
export class LinksConviteModule {}
```

- [ ] **Step 3: Registrar no `app.module.ts`**

Adicione o import, junto dos outros imports de módulo (logo após `ConvitesModule`):

```ts
import { LinksConviteModule } from "./links-convite/links-convite.module.js";
```

E adicione `LinksConviteModule` ao array `imports`, logo depois de `ConvitesModule,`:

```ts
    CorrecaoModule,
    ConvitesModule,
    LinksConviteModule,
  ],
```

- [ ] **Step 4: Verificar que compila e que o Nest sobe**

Run: `cd apps/admin/api && npx tsc --noEmit 2>&1 | grep -v "auth.service.spec\|inscricao.service.spec\|ranking.service.spec"`
Expected: nenhuma saída.

Run: `cd apps/admin/api && timeout 15 npx tsx src/main.ts 2>&1 | grep -i "link-convite\|error" || true`
Expected: linhas `Mapped {/api/coordenacao/link-convite, GET}`, `Mapped {/api/coordenacao/link-convite, POST}`, `Mapped {/api/admin/links-convite, ...}`, `Mapped {/api/link-convite/:token, ...}` — sem nenhuma linha de erro.

- [ ] **Step 5: Commit**

```bash
git add apps/admin/api/src/links-convite/links-convite.controller.ts apps/admin/api/src/links-convite/links-convite.module.ts apps/admin/api/src/app.module.ts
git commit -m "feat(links-convite): expõe rotas de coordenador, admin e público"
```

---

## Task 7: Backend — Rodar a suíte inteira

**Files:** nenhum (só verificação)

- [ ] **Step 1: Rodar toda a suíte de testes do backend**

Run: `cd apps/admin/api && npx jest`
Expected: todos os testes passam, incluindo os 17 novos de `links-convite.service.spec.ts`. Nenhum teste pré-existente quebrou.

Nenhum commit neste task — é só verificação. Se algo falhar, volte ao task correspondente, corrija e commite a correção lá.

---

## Task 8: Frontend — Rota pública no middleware

**Files:**
- Modify: `apps/admin/web/src/middleware.ts`

- [ ] **Step 1: Adicionar `/cadastro` aos caminhos públicos**

No array `publicPaths`, logo depois de `'/convite',`:

```ts
const publicPaths = [
  '/login',
  '/registro',
  '/confirmar-email',
  '/esqueci-senha',
  '/recuperar-senha',
  '/redefinir-senha',
  // Quem chega por convite ainda não tem conta: exigir sessão aqui mandaria
  // a pessoa para um login que ela não tem como fazer.
  '/convite',
  // Mesma razão do /convite acima — só que aqui o link não é pessoal nem
  // expira, então mais gente vai chegar por ele ao longo do tempo.
  '/cadastro',
]
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/web/src/middleware.ts
git commit -m "feat(cadastro): libera /cadastro do middleware de autenticação"
```

---

## Task 9: Frontend — Página pública de cadastro (`/cadastro/[token]`)

**Files:**
- Create: `apps/admin/web/src/app/(auth)/cadastro/[token]/page.tsx`

- [ ] **Step 1: Criar a página**

```tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";

const ROTULO_PAPEL: Record<string, string> = {
  COMISSAO: "Comissão Organizadora",
  COORDENADOR_CURSO: "Coordenação de Curso",
  AVALIADOR: "Avaliação",
  ALUNO: "Participante",
};

const schema = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    cpf: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 11, "CPF deve ter 11 dígitos"),
    dataNascimento: z.string().min(1, "Informe a data de nascimento"),
    telefone: z.string().optional(),
    nomeMae: z.string().optional(),
    senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "Senhas não conferem",
    path: ["confirmarSenha"],
  });

interface LinkInfo {
  role: string;
  curso: {
    id: string;
    nome: string;
    instituicao: { nome: string; sigla: string };
  } | null;
  instituicao: { id: string; nome: string; sigla: string } | null;
}

function Campo({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "email";
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-[#9895a4]">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-lg bg-[#0f0f16] border border-[#2a2a3a] px-4 text-[#f0ece4] placeholder:text-[#57545f] focus:outline-none focus:border-[#3AAFE0]"
      />
    </div>
  );
}

function CadastroContent({ token }: { token: string }) {
  const [link, setLink] = useState<LinkInfo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    api
      .get(`/link-convite/${token}`)
      .then((r) => setLink(r.data))
      .catch((e) =>
        setErro(
          e.response?.data?.message ??
            "Não foi possível validar este link de convite.",
        ),
      )
      .finally(() => setCarregando(false));
  }, [token]);

  const enviar = async () => {
    const parsed = schema.safeParse({
      nome,
      email,
      cpf,
      dataNascimento,
      telefone,
      nomeMae,
      senha,
      confirmarSenha,
    });

    if (!parsed.success) {
      const campos = parsed.error.flatten().fieldErrors;
      setErro(
        campos.nome?.[0] ??
          campos.email?.[0] ??
          campos.cpf?.[0] ??
          campos.dataNascimento?.[0] ??
          campos.senha?.[0] ??
          campos.confirmarSenha?.[0] ??
          "Verifique os dados informados.",
      );
      return;
    }

    setEnviando(true);
    setErro("");
    try {
      await api.post(`/link-convite/${token}/cadastrar`, {
        nome: parsed.data.nome,
        email: parsed.data.email,
        cpf: parsed.data.cpf,
        senha: parsed.data.senha,
        dataNascimento: parsed.data.dataNascimento,
        telefone: parsed.data.telefone || undefined,
        nomeMae: parsed.data.nomeMae || undefined,
        matricula: matricula || undefined,
      });
      setPronto(true);
    } catch (e: any) {
      setErro(
        e.response?.data?.message ??
          "Não foi possível concluir o cadastro. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return <p className="text-[#9895a4] text-center">Validando link...</p>;
  }

  if (pronto) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
          Cadastro concluído
        </h1>
        <p className="text-sm text-[#9895a4] mb-6">
          Sua conta foi criada. Use seu e-mail e a senha que você acabou de
          definir para entrar.
        </p>
        <Link href="/login">
          <Button
            className="w-full h-12 text-base font-semibold"
            style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
          >
            Fazer login
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (!link) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
          Link indisponível
        </h1>
        <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3 mb-6">
          {erro}
        </p>
        <p className="text-sm text-[#9895a4]">
          Peça um link atualizado à coordenação ou à organização da OLICMAT.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
        Concluir cadastro
      </h1>
      <p className="text-sm text-[#9895a4] mb-6">
        Cadastro como{" "}
        <span className="text-[#f0ece4]">
          {ROTULO_PAPEL[link.role] ?? link.role}
        </span>
        .
      </p>

      {(link.curso || link.instituicao) && (
        <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-4 mb-6 space-y-1">
          <p className="text-xs uppercase tracking-[0.08em] text-[#6f6c7a]">
            {link.curso ? "Curso" : "Instituição"}
          </p>
          {link.curso ? (
            <>
              <p className="text-sm text-[#f0ece4]">{link.curso.nome}</p>
              <p className="text-sm text-[#9895a4]">
                {link.curso.instituicao.sigla} — {link.curso.instituicao.nome}
              </p>
            </>
          ) : (
            link.instituicao && (
              <p className="text-sm text-[#f0ece4]">
                {link.instituicao.sigla} — {link.instituicao.nome}
              </p>
            )
          )}
        </div>
      )}

      <div className="space-y-5">
        <Campo
          label="Nome completo *"
          id="nome"
          value={nome}
          onChange={setNome}
          placeholder="Seu nome completo"
        />
        <Campo
          label="E-mail *"
          id="email"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          type="email"
          inputMode="email"
        />
        <Campo
          label="CPF *"
          id="cpf"
          value={cpf}
          onChange={setCpf}
          placeholder="Somente números"
          inputMode="numeric"
        />
        <Campo
          label="Data de nascimento *"
          id="dataNascimento"
          value={dataNascimento}
          onChange={setDataNascimento}
          type="date"
        />
        <Campo
          label="Matrícula"
          id="matricula"
          value={matricula}
          onChange={setMatricula}
          placeholder="Opcional"
        />
        <Campo
          label="Telefone"
          id="telefone"
          value={telefone}
          onChange={setTelefone}
          placeholder="DDD + número"
          inputMode="tel"
        />
        <Campo
          label="Nome da mãe"
          id="nomeMae"
          value={nomeMae}
          onChange={setNomeMae}
          placeholder="Opcional"
        />

        <PasswordField
          label="Senha *"
          id="senha"
          name="senha"
          value={senha}
          onChange={setSenha}
          placeholder="Mínimo 8 caracteres"
          required
        />
        <PasswordField
          label="Confirmar senha *"
          id="confirmarSenha"
          name="confirmarSenha"
          value={confirmarSenha}
          onChange={setConfirmarSenha}
          placeholder="Repita a senha"
          required
        />

        {erro && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
            {erro}
          </p>
        )}

        <Button
          onClick={enviar}
          disabled={enviando}
          className="w-full h-12 text-base font-semibold"
          style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        >
          {enviando ? "Concluindo..." : "Concluir cadastro"}
        </Button>
      </div>
    </>
  );
}

export default function CadastroPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 dot-pattern">
      <div className="absolute inset-0 gradient-orb-sigma opacity-20" />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold font-[family-name:var(--font-fraunces)]">
              <span style={{ color: "var(--pi-laranja)" }}>O</span>
              <span style={{ color: "var(--integral-verde)" }}>L</span>
              <span style={{ color: "var(--sigma-azul)" }}>I</span>
              <span style={{ color: "var(--text-primary)" }}>CMAT</span>
            </span>
          </Link>
        </div>

        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a]/90 backdrop-blur-sm">
          <CadastroContent token={token} />
        </div>

        <p className="text-sm text-[#9895a4] text-center mt-6">
          Já tem acesso?{" "}
          <Link href="/login" className="text-[#3AAFE0] hover:underline">
            Fazer login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar que compila**

Run: `cd apps/admin/web && npx tsc --noEmit`
Expected: `TypeScript: No errors found`

- [ ] **Step 3: Commit**

```bash
git add "apps/admin/web/src/app/(auth)/cadastro/[token]/page.tsx"
git commit -m "feat(cadastro): página pública de cadastro por link reutilizável"
```

---

## Task 10: Frontend — Bloco "Gerar Convite" na tela do coordenador

**Files:**
- Modify: `apps/admin/web/src/app/(dashboard)/coordenador/convidar/page.tsx`

- [ ] **Step 1: Adicionar estado e efeito de carregamento do link**

No topo do arquivo, logo depois de `const [busca, setBusca] = useState("");` (linha 69 atual), adicione:

```ts
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [linkTotalCadastros, setLinkTotalCadastros] = useState(0);
  const [linkCarregando, setLinkCarregando] = useState(true);
  const [linkGerando, setLinkGerando] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);
```

Logo depois do `useEffect` existente (que busca `/coordenacao/cursos` e chama `carregarConvites()`, linhas 81-91 atuais), adicione um novo `useEffect`:

```ts
  useEffect(() => {
    api
      .get("/coordenacao/link-convite")
      .then((r) => {
        setLinkToken(r.data?.token ?? null);
        setLinkTotalCadastros(r.data?.totalCadastros ?? 0);
      })
      .catch(() => setLinkToken(null))
      .finally(() => setLinkCarregando(false));
  }, []);
```

- [ ] **Step 2: Adicionar o handler de gerar/regenerar**

Logo depois da função `enviar` existente (antes de `const termo = ...`), adicione:

```ts
  const gerarLink = async () => {
    setLinkGerando(true);
    try {
      const r = await api.post("/coordenacao/link-convite");
      setLinkToken(r.data.token);
    } catch {
      // silencioso: o bloco continua mostrando o botão de gerar
    } finally {
      setLinkGerando(false);
    }
  };

  const copiarLink = () => {
    if (!linkToken) return;
    const url = `${window.location.origin}/cadastro/${linkToken}`;
    navigator.clipboard.writeText(url);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2000);
  };
```

- [ ] **Step 3: Adicionar o bloco visual**

Logo depois do `</div>` que fecha o cabeçalho (linha 146 atual: `</div>`, antes do card do textarea que começa com `<div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a] space-y-5">`), insira:

```tsx
      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a] space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
            Link de convite
          </h2>
          <p className="text-sm text-[#9895a4] mt-1">
            Um link que não expira e pode ser usado por quantos alunos
            precisar — compartilhe por WhatsApp, Discord ou onde for mais
            fácil chegar até eles.
          </p>
        </div>

        {linkCarregando ? (
          <p className="text-sm text-[#9895a4]">Carregando...</p>
        ) : linkToken ? (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/cadastro/${linkToken}`}
                className="flex-1 h-11 rounded-lg bg-[#0f0f16] border border-[#2a2a3a] px-3 text-sm text-[#9895a4]"
              />
              <Button
                onClick={copiarLink}
                className="h-11 px-4 text-sm font-semibold shrink-0"
                style={{ backgroundColor: "var(--sigma-azul)", color: "#fff" }}
              >
                {linkCopiado ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-[#6f6c7a]">
                {linkTotalCadastros} aluno(s) cadastrado(s) por este link
              </p>
              <button
                onClick={gerarLink}
                disabled={linkGerando}
                className="text-xs text-[#9895a4] hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                {linkGerando ? "Gerando..." : "Gerar novo link (invalida o atual)"}
              </button>
            </div>
          </div>
        ) : (
          <Button
            onClick={gerarLink}
            disabled={linkGerando}
            className="h-11 px-6 text-sm font-semibold"
            style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
          >
            {linkGerando ? "Gerando..." : "Gerar Convite"}
          </Button>
        )}
      </div>

```

- [ ] **Step 4: Verificar que compila**

Run: `cd apps/admin/web && npx tsc --noEmit`
Expected: `TypeScript: No errors found`

- [ ] **Step 5: Commit**

```bash
git add "apps/admin/web/src/app/(dashboard)/coordenador/convidar/page.tsx"
git commit -m "feat(convidar): bloco de link de convite reutilizável do coordenador"
```

---

## Task 11: Frontend — Componente `LinksConviteView` (Admin/Comissão)

**Files:**
- Create: `apps/admin/web/src/components/links-convite/LinksConviteView.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Instituicao {
  id: string;
  nome: string;
  sigla: string;
  cursos: { id: string; nome: string }[];
}

interface LinkConviteItem {
  id: string;
  token: string;
  role: string;
  totalCadastros: number;
  curso: { id: string; nome: string } | null;
  instituicao: { id: string; nome: string; sigla: string } | null;
  criadoPor: { id: string; nome: string };
  createdAt: string;
}

const ROTULO_PAPEL: Record<string, string> = {
  COORDENADOR_CURSO: "Coordenador de Curso",
  AVALIADOR: "Avaliador",
  COMISSAO: "Comissão",
};

export function LinksConviteView({
  basePath,
}: {
  basePath: "admin" | "comissao";
}) {
  const [links, setLinks] = useState<LinkConviteItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [role, setRole] = useState("COORDENADOR_CURSO");
  const [instituicaoId, setInstituicaoId] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [erro, setErro] = useState("");
  const [criando, setCriando] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [regenerandoId, setRegenerandoId] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    api
      .get("/admin/links-convite")
      .then(({ data }) => setLinks(data?.data ?? []))
      .catch(() => setLinks([]))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
    api
      .get("/instituicoes?limit=200")
      .then((r) => setInstituicoes(r.data?.data ?? []))
      .catch(() => setInstituicoes([]));
  }, [carregar]);

  const cursosDaInstituicao =
    instituicoes.find((i) => i.id === instituicaoId)?.cursos ?? [];

  const criar = async () => {
    setErro("");
    if (role === "COORDENADOR_CURSO" && !cursoId) {
      setErro("Selecione o curso.");
      return;
    }
    setCriando(true);
    try {
      await api.post("/admin/links-convite", {
        role,
        cursoId: role === "COORDENADOR_CURSO" ? cursoId : undefined,
      });
      setInstituicaoId("");
      setCursoId("");
      carregar();
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Não foi possível criar o link.");
    } finally {
      setCriando(false);
    }
  };

  const regenerar = async (id: string) => {
    if (!confirm("Gerar um novo link vai invalidar o link atual. Continuar?")) {
      return;
    }
    setRegenerandoId(id);
    try {
      await api.post(`/admin/links-convite/${id}/regenerar`);
      carregar();
    } catch {
      // silencioso: a lista recarrega e mostra o estado real do servidor
    } finally {
      setRegenerandoId(null);
    }
  };

  const copiar = (item: LinkConviteItem) => {
    const url = `${window.location.origin}/cadastro/${item.token}`;
    navigator.clipboard.writeText(url);
    setCopiadoId(item.id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Links de Convite
        </h1>
        <p className="text-[#9895a4] mt-1">
          Links reutilizáveis para cadastro sem depender de e-mail —
          compartilhe por WhatsApp, Discord etc.
        </p>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] space-y-4">
        <h2 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Novo link
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setInstituicaoId("");
              setCursoId("");
            }}
            className="h-11 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#f0ece4]"
          >
            <option value="COORDENADOR_CURSO">Coordenador de Curso</option>
            <option value="AVALIADOR">Avaliador</option>
            <option value="COMISSAO">Comissão</option>
          </select>
          {role === "COORDENADOR_CURSO" && (
            <>
              <select
                value={instituicaoId}
                onChange={(e) => {
                  setInstituicaoId(e.target.value);
                  setCursoId("");
                }}
                className="h-11 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#f0ece4]"
              >
                <option value="">Selecione a instituição</option>
                {instituicoes.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.sigla || i.nome}
                  </option>
                ))}
              </select>
              <select
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
                disabled={!instituicaoId}
                className="h-11 px-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#f0ece4] disabled:opacity-50"
              >
                <option value="">
                  {instituicaoId
                    ? "Selecione o curso"
                    : "Escolha a instituição primeiro"}
                </option>
                {cursosDaInstituicao.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
        {erro && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
            {erro}
          </p>
        )}
        <Button
          onClick={criar}
          disabled={criando}
          className="h-11 px-6 text-sm font-semibold"
          style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        >
          {criando ? "Criando..." : "Criar link"}
        </Button>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
        {carregando ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !links.length ? (
          <p className="text-sm text-[#9895a4] p-6">Nenhum link criado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.08em] text-[#6f6c7a] border-b border-[#2a2a3a]">
                  <th className="py-3 px-5">Papel</th>
                  <th className="py-3 px-5">Curso/Instituição</th>
                  <th className="py-3 px-5">Criado por</th>
                  <th className="py-3 px-5">Cadastros</th>
                  <th className="py-3 px-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {links.map((l) => (
                  <tr key={l.id} className="border-t border-[#2a2a3a]">
                    <td className="py-3 px-5 text-[#f0ece4]">
                      {ROTULO_PAPEL[l.role] ?? l.role}
                    </td>
                    <td className="py-3 px-5 text-[#9895a4]">
                      {l.curso ? l.curso.nome : l.instituicao ? l.instituicao.sigla : "—"}
                    </td>
                    <td className="py-3 px-5 text-[#9895a4]">{l.criadoPor.nome}</td>
                    <td className="py-3 px-5 text-[#9895a4]">{l.totalCadastros}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => copiar(l)}
                          className="text-xs font-medium text-[#3AAFE0] hover:underline cursor-pointer"
                        >
                          {copiadoId === l.id ? "Copiado!" : "Copiar link"}
                        </button>
                        <button
                          onClick={() => regenerar(l.id)}
                          disabled={regenerandoId === l.id}
                          className="text-[#9895a4] hover:text-red-400 transition-colors p-1 cursor-pointer disabled:opacity-50"
                          title="Gerar novo link (invalida o atual)"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
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

- [ ] **Step 2: Verificar que compila**

Run: `cd apps/admin/web && npx tsc --noEmit`
Expected: `TypeScript: No errors found`

- [ ] **Step 3: Commit**

```bash
git add apps/admin/web/src/components/links-convite/LinksConviteView.tsx
git commit -m "feat(links-convite): componente LinksConviteView para Admin/Comissão"
```

---

## Task 12: Frontend — Páginas finas e navegação (Sidebar)

**Files:**
- Create: `apps/admin/web/src/app/(dashboard)/admin/links-convite/page.tsx`
- Create: `apps/admin/web/src/app/(dashboard)/comissao/links-convite/page.tsx`
- Modify: `apps/admin/web/src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Criar as duas páginas finas**

`apps/admin/web/src/app/(dashboard)/admin/links-convite/page.tsx`:

```tsx
"use client";

import { LinksConviteView } from "@/components/links-convite/LinksConviteView";

export default function AdminLinksConvitePage() {
  return <LinksConviteView basePath="admin" />;
}
```

`apps/admin/web/src/app/(dashboard)/comissao/links-convite/page.tsx`:

```tsx
"use client";

import { LinksConviteView } from "@/components/links-convite/LinksConviteView";

export default function ComissaoLinksConvitePage() {
  return <LinksConviteView basePath="comissao" />;
}
```

- [ ] **Step 2: Adicionar o ícone `Link2` ao import do Sidebar**

Em `apps/admin/web/src/components/layout/Sidebar.tsx`, no import de `lucide-react` (linhas 9-13 atuais), adicione `Link2`:

```ts
import {
  LayoutDashboard, ClipboardList, FileText, Upload, Trophy, Users,
  BarChart3, BookOpen, CheckSquare, Download, ShieldCheck,
  Eye, Building2, GraduationCap, Calendar, Settings, Sliders, Activity,
  UserPlus, Bell, HelpCircle, Link2,
} from "lucide-react";
```

(Chama-se `Link2` e não `Link` porque `Link` já é o nome usado para o componente de navegação do `next/link` neste mesmo tipo de arquivo — evita colisão.)

- [ ] **Step 3: Adicionar o link ao `configLinks` (ADMIN)**

No array `configLinks`, logo depois de `/admin/acompanhamento`:

```ts
  { href: "/admin/acompanhamento", label: "Acompanhamento", icon: <BarChart3 size={18} /> },
  { href: "/admin/links-convite", label: "Links de Convite", icon: <Link2 size={18} /> },
  { href: "/admin/inscricoes", label: "Inscrições", icon: <ClipboardList size={18} /> },
```

- [ ] **Step 4: Adicionar o link ao caso `COMISSAO`**

No `case "COMISSAO":`, logo depois de `/comissao/acompanhamento`:

```ts
          { href: "/comissao/acompanhamento", label: "Acompanhamento", icon: <BarChart3 size={18} /> },
          { href: "/comissao/links-convite", label: "Links de Convite", icon: <Link2 size={18} /> },
          { href: "/comissao/inscricoes", label: "Inscrições", icon: <ClipboardList size={18} /> },
```

- [ ] **Step 5: Verificar que compila**

Run: `cd apps/admin/web && npx tsc --noEmit`
Expected: `TypeScript: No errors found`

- [ ] **Step 6: Commit**

```bash
git add "apps/admin/web/src/app/(dashboard)/admin/links-convite/page.tsx" \
        "apps/admin/web/src/app/(dashboard)/comissao/links-convite/page.tsx" \
        apps/admin/web/src/components/layout/Sidebar.tsx
git commit -m "feat(links-convite): páginas Admin/Comissão e navegação no Sidebar"
```

---

## Task 13: Verificação manual (dev server + navegador)

Não há infraestrutura de testes de componente no frontend deste projeto — a verificação desta feature é manual.

- [ ] **Step 1: Rodar a suíte de backend inteira de novo, pra garantir que nada quebrou**

Run: `cd apps/admin/api && npx jest`
Expected: todos os testes passam.

- [ ] **Step 2: Rodar `next build` no frontend**

Run: `cd apps/admin/web && npx next build`
Expected: build conclui sem erro, incluindo as rotas novas (`/cadastro/[token]`, `/admin/links-convite`, `/comissao/links-convite`).

- [ ] **Step 3: Subir backend e frontend**

Run: `cd apps/admin/api && npm run start:dev`
Run: `cd apps/admin/web && npm run dev`

- [ ] **Step 4: Checklist no navegador — Coordenador**

Logado como COORDENADOR_CURSO:
1. Abrir `/coordenador/convidar` — confirmar que o bloco "Link de convite" aparece acima da lista em massa, com o botão "Gerar Convite".
2. Clicar em "Gerar Convite" — confirmar que aparece a URL, o botão "Copiar" e "0 aluno(s) cadastrado(s) por este link".
3. Copiar a URL, abrir em uma aba anônima — confirmar que carrega `/cadastro/<token>` sem exigir login, mostrando o curso do coordenador.
4. Preencher o formulário (nome, e-mail, CPF válido, data de nascimento, senha) e enviar — confirmar tela de "Cadastro concluído".
5. Fazer login com o e-mail/senha usados — confirmar acesso normal como ALUNO.
6. Voltar como coordenador em `/coordenador/convidar` — confirmar que "1 aluno(s) cadastrado(s) por este link" aparece, e que o aluno novo aparece em `/coordenador/alunos`.
7. Clicar em "Gerar novo link" — confirmar que a URL muda e que a URL antiga, se reaberta, mostra "Link indisponível".

- [ ] **Step 5: Checklist no navegador — Admin/Comissão**

Logado como ADMIN:
8. Abrir `/admin/links-convite` (link "Links de Convite" no Sidebar) — confirmar que a tela carrega vazia (ou com os links já criados).
9. Criar um link para "Avaliador" (sem instituição/curso) — confirmar que aparece na tabela.
10. Criar um link para "Coordenador de Curso" sem selecionar curso — confirmar mensagem de erro "Selecione o curso.".
11. Selecionar instituição e curso, criar — confirmar que aparece na tabela com o curso certo.
12. Copiar o link de um item, abrir em aba anônima — confirmar que `/cadastro/<token>` mostra "Coordenação de Curso" e o curso certo.
13. Regenerar um link — confirmar o diálogo de confirmação e que o token muda.
14. Repetir os passos 8-9 logado como COMISSAO em `/comissao/links-convite`.

Nenhum commit neste task — é só verificação. Se algo falhar, volte ao task correspondente, corrija e commite a correção lá.

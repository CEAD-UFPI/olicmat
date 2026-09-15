# Design — Painel de Acompanhamento (Convites, Cadastros, Inscrições)

**Data:** 2026-09-15
**Status:** Aprovado

## Contexto

Hoje a home do admin (`/admin`) mostra 4 cards soltos (Usuários, Inscrições, Pendentes, Sem inscrição — `DashboardService.getResumo()`), sem funil de conversão, sem comparação entre instituições/coordenadores e sem sinalização de convites mortos (expirados sem uso). A comissão/administração não tem como responder rapidamente a "quem está atrasado" ou "quem precisa de cobrança" sem abrir várias telas e cruzar dados manualmente.

O pedido: cards, gráficos e relatórios de acompanhamento de convites → cadastros → inscrições, **efetivos, sem enfeite**, para a comissão e administração.

## Decisão de escopo

- **Só comissão/admin nesta rodada.** Nada muda no que aluno ou coordenador enxergam. Estímulo ao participante (contagem regressiva no painel do aluno, progresso pessoal) fica para um próximo ciclo de design.
- Acesso: `ADMIN` e `COMISSAO` (os dois papéis que já enxergam tudo, sem recorte por curso/instituição).

## Onde vive

Página nova dedicada: `/admin/acompanhamento` e `/comissao/acompanhamento`.

Para não duplicar ~1000 linhas como os outros pares admin/comissão fazem hoje (`usuarios`, `inscricoes` são cópias completas), esta página nasce como uma exceção ao padrão: um componente compartilhado `AcompanhamentoView` em `apps/admin/web/src/components/acompanhamento/` importado pelos dois arquivos de rota finos (`admin/acompanhamento/page.tsx` e `comissao/acompanhamento/page.tsx`). Ambos os papéis usam exatamente a mesma view — não há recorte de dados entre ADMIN e COMISSAO.

A home atual de `/admin` e `/comissao` (4 cards existentes) ganha só um link de destaque para a nova página; nada nela é removido.

## Seção 1 — Funil de conversão

Barras horizontais decrescentes, uma por estágio, largura proporcional ao volume, com número absoluto e `%` de conversão em relação ao estágio anterior:

```
Convidados     ████████████████████████████████████████  312
Cadastrados    ███████████████████████████████░░░░░░░░░  248 · 79%
Inscritos      █████████████████████████░░░░░░░░░░░░░░░  190 · 61%
Confirmados    ██████████████████████░░░░░░░░░░░░░░░░░░  165 · 53%
```

Definição de cada estágio:

| Estágio | Fonte |
|---|---|
| Convidados | `count(Convite)` (todos, de qualquer edição) |
| Cadastrados | `count(Convite where usadoEm != null)` |
| Inscritos | `count(Inscricao)` (qualquer status, edição ativa) |
| Confirmados | `count(Inscricao where status = CONFIRMADA)` (edição ativa) |

Sem filtro de edição no card de Convidados/Cadastrados (convite não tem `edicaoId`); Inscritos/Confirmados usam a edição ativa (mesma noção já usada em `InscricaoService.inscreverEmLote`).

## Seção 2 — Ranking por Instituição/Coordenador

Tabela, ordenada do pior para o melhor `%` de inscritos:

| Instituição | Alunos | Inscritos | % | Status |
|---|---|---|---|---|
| UESPI | 40 | 14 | 35% | Atrasado |
| IFPI | 65 | 38 | 58% | Atenção |
| UFDPar | 30 | 22 | 73% | Atenção |
| UFPI | 113 | 98 | 87% | Em dia |

- `Status`: `< 50%` Atrasado (vermelho), `50–79%` Atenção (âmbar), `≥ 80%` Em dia (verde) — limiares fixos no código, sem configuração (YAGNI; ajusta-se depois se a comissão pedir).
- Um seletor no topo filtra por **instituição** e, dentro dela, por **coordenador** (lista de coordenadores daquela instituição). Selecionar uma instituição expande a tabela para mostrar cada coordenador dela como uma linha própria, com as mesmas colunas.
- "Alunos" conta `User` com `role=ALUNO` da instituição/coordenador; "Inscritos" conta os que têm ao menos uma `Inscricao`.

## Seção 3 — Cards de ação

3 cards de contagem, cada um linkando para a tela já existente com o filtro correspondente pré-aplicado (a própria página de acompanhamento não lista nomes — mantém-se enxuta):

| Card | Definição | Destino |
|---|---|---|
| Convites expirados | `Convite` com `usadoEm = null` e `expiraEm < now()` | `/admin/convidar?status=expirado` |
| Cadastrados sem inscrição | `User role=ALUNO` com `inscricoes: { none: {} }` (já existe em `getResumo`) | `/admin/usuarios` |
| Inscrições pendentes | `Inscricao status=PENDENTE` (já existe em `getResumo`) | `/admin/inscricoes` (filtro de status já suportado pela tela) |

"Convite expirado" foi escolhido como definição de **convite parado** em vez de um limiar de dias: como o convite expira em 7 dias (`VALIDADE_MS` em `convites.service.ts`), não há uma janela útil para medir "dias sem resposta" — expirado sem uso é um sinal inequívoco e acionável (o link está morto, só reenviar resolve).

`ConvitesService.listar()` (usado por `/admin/convidar`, papéis ADMIN/COMISSAO) já retorna **todos** os convites sem filtro de papel — inclusive os de alunos criados por coordenadores — então uma única tela e um único destino bastam; não há uma segunda fonte a unir.

## Backend

Novo método em `DashboardService` (`apps/admin/api/src/admin/dashboard/dashboard.service.ts`):

```ts
async getAcompanhamento(filtro?: { instituicaoId?: string; coordenadorId?: string }) {
  // funil: counts de Convite/Inscricao, como já feito em getResumo/getMetrics
  // ranking: groupBy instituicaoId (ou coordenadorId, se instituicaoId for passado)
  //   sobre User role=ALUNO, com _count de inscricoes
  // acoes: convitesExpirados (novo), cadastradosSemInscricao e pendentes (reaproveita getResumo)
}
```

Exposto em `GET /admin/dashboard/acompanhamento?instituicaoId=&coordenadorId=` no controller existente (`AdminDashboardController` — mesmo padrão de `/admin/dashboard/metricas` e `/admin/dashboard/resumo`), roles `ADMIN` e `COMISSAO`.

Sem tabela/coluna nova — tudo é agregação sobre `Convite`, `User` e `Inscricao` já existentes.

### Filtro "Convites expirados" na tela de convite

`GET /admin/convites` (`ConvitesService.listar()`) ganha parâmetro opcional `status?: "expirado"`, aplicando `usadoEm: null, expiraEm: { lt: new Date() }` no `where`. A tela `admin/convidar/page.tsx` ganha um filtro de situação (além da busca por nome/e-mail já existente): ao chegar em `?status=expirado`, a tela ativa esse filtro automaticamente e chama a API com o parâmetro. `listarPorCursos()` (usada por `/coordenador/convidar`) não precisa do parâmetro — nenhum card desta spec aponta para lá.

## Frontend — estrutura de arquivos

```
apps/admin/web/src/
  components/acompanhamento/
    AcompanhamentoView.tsx     # composição das 3 seções
    FunilBarras.tsx            # seção 1
    RankingInstituicoes.tsx    # seção 2 (com seletor)
    CardsAcao.tsx              # seção 3
  app/(dashboard)/admin/acompanhamento/page.tsx       # "use client"; renderiza <AcompanhamentoView />
  app/(dashboard)/comissao/acompanhamento/page.tsx    # idem
```

Padrão de dados: `useEffect` + `api.get` (sem lib de gráfico nova — barras e mini-barras são `<div>` com `width`/`height` proporcional, como os mockups validados).

## Erros e casos de borda

- Nenhuma edição ativa: funil mostra Inscritos/Confirmados como `0` em vez de quebrar (mesma checagem de "edição ativa" já usada em `inscreverEmLote`).
- Instituição sem nenhum aluno: linha não aparece na tabela (evita `0/0 = NaN%`).
- Filtro por coordenador sem coordenadores cadastrados na instituição: seletor mostra "Nenhum coordenador" em vez de lista vazia silenciosa.

## Testes

- **Unit (backend):** `DashboardService.getAcompanhamento` — funil com contagens corretas; ranking ordenado por `%` crescente; filtro por `instituicaoId`/`coordenadorId` restringe corretamente; `convitesExpirados` só conta `usadoEm=null AND expiraEm<now`.
- **Unit (backend):** `ConvitesService.listar` com `status=expirado` retorna só os expirados sem uso.

## Fora de escopo

- Estímulo ao participante (painel do aluno/coordenador) — próximo ciclo, conforme decisão de escopo acima.
- Gráfico de tendência temporal (cadastros/inscrições por dia) — não foi pedido; se vier a ser necessário, entra como seção adicional depois.
- Limiares de status (Atrasado/Atenção/Em dia) configuráveis pela UI — fixos no código por ora.
- Exportação CSV específica desta página — os exports já existentes (`/admin/exportar`) cobrem `Inscricao`/`User` cru; esta página é só visualização.

## Documentação a atualizar após implementação

- `docs/CHANGELOG.md`
- `docs/api-surface.md` (novo endpoint `GET /admin/dashboard/acompanhamento`, parâmetro `status` em `GET /admin/convites`)
- `docs/frontend-route-map.md` (novas rotas `/admin/acompanhamento`, `/comissao/acompanhamento`)
- `docs/role-permissions-matrix.md` (acesso ADMIN/COMISSAO à nova página)
- `docs/GUIAS.md` (se a comissão ganhar um guia próprio de uso do painel)

# Link de Convite Reutilizável — Design

**Data:** 2026-09-22

## Contexto e motivação

Alunos convidados pelo fluxo atual (`Convite`, um e-mail por pessoa, token de uso único) estão reportando que o e-mail de convite não chega — provavelmente bloqueios/spam de caixas institucionais. Isso já motivou duas correções pontuais (validade do token de senha, reenvio em massa de convites expirados), mas o problema de fundo é depender de e-mail chegar no momento certo.

Esta feature tira o e-mail do caminho crítico: coordenadores (e Admin/Comissão) geram um **link reutilizável, sem expiração**, que pode ser compartilhado por qualquer canal (WhatsApp, Discord, grupo de turma etc.). Quem tiver o link se cadastra sozinho, sem precisar receber nada por e-mail.

## Escopo

- Coordenador de Curso: um link reutilizável para convidar Alunos do próprio curso.
- Admin/Comissão: podem criar vários links simultâneos, cada um com um papel (Coordenador de Curso, Avaliador, Comissão) e, quando fizer sentido, instituição/curso fixos.
- Fora de escopo: papel ALUNO gerado por Admin/Comissão continua não existindo como convite direto (mesma regra já aplicada ao `Convite` — alunos só entram pela coordenação).
- Fora de escopo: limite de usos ou expiração por tempo. O único jeito de desativar um link é o dono regenerá-lo.

## Modelo de dados

Novo model `LinkConvite`, separado de `Convite` (que é de uso único e amarrado a um e-mail conhecido de antemão):

```prisma
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
}
```

Diferença deliberada em relação a `Convite`: lá, `criadoPorId` é opcional (`String?`, com relação `onDelete: SetNull`) porque um convite pode ter sido criado por script (texto livre em `criadoPor`, sem usuário associado). Aqui `criadoPorId` é obrigatório — todo `LinkConvite` tem um dono real — e `onDelete: Cascade`: se o usuário dono for excluído, o link dele deixa de existir (evita um link órfão sem ninguém pra gerenciá-lo). `instituicaoId`/`cursoId` seguem o mesmo `SetNull` que `Convite` já usa.

Em `User`, novo campo opcional:

```prisma
origemLinkId String?
origemLink   LinkConvite? @relation("CadastradosPorLink", fields: [origemLinkId], references: [id], onDelete: SetNull)
```

Regras:
- **Coordenador:** exatamente um `LinkConvite` por coordenador, com `role: ALUNO` e `instituicaoId`/`cursoId` herdados do próprio vínculo `CoordenadorCurso` — criado sob demanda na primeira geração, não em lote/migração.
- **Admin/Comissão:** cada `LinkConvite` é criado explicitamente com papel + instituição/curso escolhidos no formulário (instituição/curso só fazem sentido para `COORDENADOR_CURSO`; para `AVALIADOR`/`COMISSAO` ficam `null`).
- **Regenerar** (botão "Gerar novo link"): troca o `token` da mesma linha via update. Não mantém histórico de tokens antigos — o antigo simplesmente para de bater com qualquer `LinkConvite` e o endpoint público retorna 404.
- Alunos/usuários cadastrados via link herdam `coordenadorId` (quando `role === ALUNO`, do `criadoPorId` do link — mesma regra que `Convite.aceitar` já aplica) e `instituicaoId`/`cursoId` do link. Isso já os coloca em "Meus Alunos" do coordenador sem nenhuma tela nova.
- `origemLinkId` é só para o contador "X cadastros por este link" — não substitui `coordenadorId` como critério de vínculo em nenhuma tela existente.

## Backend

### Coordenador (`/coordenacao`)

- `GET /coordenacao/link-convite` — retorna o `LinkConvite` do coordenador logado (`{ token, url, totalCadastros }`) ou `{ token: null }` se nunca gerou.
- `POST /coordenacao/link-convite` — idempotente-ish: se não existe, cria; se existe, regenera o token. (Um único botão "Gerar Convite" / "Gerar novo link" no front cobre os dois casos.)

### Admin/Comissão (`/admin/links-convite`)

Guard: `@Roles(Role.ADMIN, Role.COMISSAO)`. Regra de escopo igual à de `criarEmLote`: Comissão só cria links para `COORDENADOR_CURSO`, `AVALIADOR`, `COMISSAO` (não `ADMIN`).

- `GET /admin/links-convite` — lista os links já criados (todos, não só os do usuário logado — visão administrativa), com contador de cadastros por link. Paginado com o helper `getSkipTake`/`paginate` já usado em `AdminUsuariosService.findAll` — volume baixo esperado (um link por papel/curso, não por pessoa), mas mantém o padrão do resto do admin.
- `POST /admin/links-convite` — body `{ role, instituicaoId?, cursoId? }`, validado com Zod: `role: COORDENADOR_CURSO` exige `cursoId` (e o `instituicaoId` é derivado do curso, não aceito solto no corpo — mesma lógica de `sincronizarVinculoCoordenador`); `role` em `AVALIADOR`/`COMISSAO` rejeita `instituicaoId`/`cursoId` no corpo (`BadRequestException` se vierem).
- `POST /admin/links-convite/:id/regenerar` — troca o token.

### Público

- `GET /link-convite/:token` — retorna `{ role, curso, instituicao }` para a tela de cadastro montar o formulário certo (mesmo formato que `ConvitesService.buscarPorToken` já retorna, sem os campos `nome`/`email`, que aqui ainda não existem). 404 se o token não bate com nenhum `LinkConvite` ativo.
- `POST /link-convite/:token/cadastrar` — cria o usuário. Corpo = `aceitarConviteSchema` atual **mais** `nome` e `email` (que no fluxo de `Convite` já vinham fixados no convite, e aqui precisam ser informados por quem está se cadastrando). Mesmas validações de duplicidade de e-mail/CPF que `ConvitesService.aceitar` já faz. `role`, `cursoId`, `instituicaoId` vêm do `LinkConvite`, nunca do corpo — mesma razão de segurança do fluxo de convite atual (não deixar o requisitante se auto-promover).

Nenhum e-mail é enviado neste fluxo (o "convite" já foi entregue pelo canal que o coordenador escolheu).

## Frontend

### Coordenador → "Convidar Alunos"

Novo bloco no topo da página (acima do textarea de convite em lote, que continua existindo):
- Sem link gerado: botão **"Gerar Convite"**.
- Com link gerado: mostra a URL completa num campo somente-leitura + botão copiar, texto "X aluno(s) cadastrado(s) por este link", e botão **"Gerar novo link"** (com confirmação, já que invalida o link atual).

### Admin/Comissão

Nova página **`/admin/links-convite`** (e `/comissao/links-convite`, reaproveitando o mesmo componente via `basePath`, no mesmo padrão do painel de Acompanhamento): tabela com papel, instituição/curso (quando houver), quem criou, contador de cadastros, botão copiar e botão regenerar por linha; formulário/modal para criar um novo link.

### Página pública de cadastro por link

Nova rota **`/cadastro/:token`** (distinta de `/convite`, que é o fluxo de token único e pessoal). Reaproveita os componentes de formulário do fluxo de aceite de convite (CPF, senha, data de nascimento, telefone), acrescentando os campos **Nome** e **E-mail** no topo. Título e curso/instituição exibidos vêm de `GET /link-convite/:token`.

## Casos de erro e testes

- Token inexistente/nunca gerado → 404 tanto no `GET` quanto no `POST` públicos.
- E-mail já cadastrado → mesma mensagem já usada em `ConvitesService.aceitar` ("Já existe um cadastro com este e-mail").
- CPF já cadastrado → idem.
- Coordenador sem `CoordenadorCurso` vinculado tentando gerar link → mesmo erro que `convidarAlunos` já lança hoje ("Você não coordena este curso...", adaptado).
- Comissão tentando criar link com `role: ADMIN` → `ForbiddenException`, mesma regra de `enforceScope`.
- Testes unitários (Jest, seguindo o padrão TDD já usado no resto do backend): serviço de geração/regeneração de link, serviço de cadastro público (usuário criado com os vínculos certos, duplicidade de e-mail/CPF rejeitada, papel/curso sempre vindo do link e nunca do corpo).
- Verificação manual do fluxo completo (gerar link → copiar → abrir em aba anônima → cadastrar → conferir que aparece em Meus Alunos) — mesma convenção de testagem manual de UI já usada no restante do frontend.

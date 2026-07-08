# SRS — OLICMAT

**Versão:** 2.0  
**Data:** 08/06/2026  
**Autor:** Equipe OLICMAT  
**Status:** Revisado para implementação da V2.0

## 1. Introdução

### 1.1 Propósito
Este documento especifica os requisitos de software da plataforma OLICMAT, uma aplicação full-stack voltada à gestão da Olimpíada para Licenciandos em Matemática. O sistema contempla autenticação, inscrição, aplicação de prova, gestão da Fase 2, avaliação, ranking, administração e acompanhamento por coordenação de curso.

### 1.2 Escopo Técnico
Aplicação web com frontend responsivo e suporte a PWA, backend modular e banco de dados relacional. O sistema deve suportar os perfis ALUNO, COORDENADOR_CURSO, AVALIADOR e ADMIN, com controle de acesso por permissões.

### 1.3 Definições e Acrônimos
| Termo | Definição |
|---|---|
| OLICMAT | Olimpíada para Licenciandos em Matemática |
| PWA | Progressive Web App, com experiência adaptada para uso em dispositivos móveis |
| Fase 1 | Prova objetiva online |
| Fase 2 | Etapa complementar com envio de materiais definidos pela organização |
| JWT | JSON Web Token |
| RBAC | Role-Based Access Control |

## 2. Requisitos Funcionais

### RF-01 — Autenticação e Perfil
| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-01.1 | Registro de usuário em etapas | Coleta dados pessoais e acadêmicos com validação |
| RF-01.2 | Login com e-mail e senha | Retorna token de acesso válido |
| RF-01.3 | Recuperação de senha | Permite redefinição com fluxo seguro |
| RF-01.4 | Proteção de rotas por autenticação | Rotas privadas exigem sessão válida |
| RF-01.5 | Controle de acesso por role | Cada perfil acessa somente recursos autorizados |
| RF-01.6 | Edição de perfil | Usuário atualiza dados permitidos |
| RF-01.7 | Confirmação de e-mail | Conta pode exigir confirmação antes de recursos críticos |

### RF-02 — Inscrição OLICMAT
| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-02.1 | Formulário de inscrição | Coleta UF, município, instituição, curso, período e edição |
| RF-02.2 | Upload de comprovante | Aceita arquivo conforme regras configuradas |
| RF-02.3 | Status de inscrição | Estados PENDENTE, CONFIRMADA e REJEITADA |
| RF-02.4 | Validação administrativa | Apenas ADMIN pode confirmar ou rejeitar |
| RF-02.5 | Inscrição única por edição | Usuário não pode ter múltiplas inscrições ativas na mesma edição |
| RF-02.6 | Visualização de pendências | Usuário acompanha status e exigências de regularização |

### RF-03 — Cadastro de Provas
| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-03.1 | Criar prova | Deve permitir nome, edição, fase, duração, status e janela de aplicação |
| RF-03.2 | Cadastrar questões | Cada questão contém enunciado, cinco alternativas, resposta correta, eixo e dificuldade |
| RF-03.3 | Definir gabarito | Gabarito oficial deve ficar vinculado à prova |
| RF-03.4 | Salvar rascunho | Prova pode permanecer não publicada |
| RF-03.5 | Publicar prova | Apenas prova válida pode ser publicada |
| RF-03.6 | Versionar alterações | Mudanças antes da publicação devem ser rastreadas |
| RF-03.7 | Duplicar prova | Sistema permite reaproveitar estrutura de prova anterior |
| RF-03.8 | Bloquear edição após início | Prova não pode ser alterada após começar a aplicação |
| RF-03.9 | Auditoria | Sistema registra criação, edição, revisão e publicação |

### RF-04 — Execução da Prova Fase 1
| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-04.1 | Início da prova | Somente inscrição confirmada pode iniciar |
| RF-04.2 | Exibição das questões | Usuário navega entre questões e respostas |
| RF-04.3 | Cronômetro regressivo | Tempo restante deve ser exibido continuamente |
| RF-04.4 | Salvamento incremental | Cada resposta é persistida individualmente |
| RF-04.5 | Finalização manual | Usuário confirma envio final |
| RF-04.6 | Finalização automática | Ao zerar o tempo, a prova é encerrada automaticamente |
| RF-04.7 | Correção automática | Nota da Fase 1 é calculada ao término |

### RF-05 — Gestão da Fase 2
| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-05.1 | Vinculação ou sorteio de tema | Tema da Fase 2 fica associado à inscrição |
| RF-05.2 | Upload de materiais | Usuário envia arquivos conforme regras da edição |
| RF-05.3 | Controle de prazo | Sistema respeita janela de envio configurada |
| RF-05.4 | Visualização de status | Usuário acompanha se envio está pendente, enviado ou avaliado |

### RF-06 — Avaliação, Ranking e Medalhas
| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-06.1 | Avaliação da Fase 2 | AVALIADOR e/ou ADMIN atribuem nota conforme regra da edição |
| RF-06.2 | Cálculo da nota final | Sistema consolida Fase 1 e Fase 2 conforme pesos configurados |
| RF-06.3 | Critérios de desempate | Regras configuráveis devem ser aplicadas ao ranking |
| RF-06.4 | Ranking por estado | Participantes são ordenados por nota final |
| RF-06.5 | Ranking por instituição e curso | Visões complementares devem estar disponíveis para perfis autorizados |
| RF-06.6 | Medalhas | Sistema distribui medalhas conforme regra da edição |
| RF-06.7 | Publicação de resultados | Resultado só fica visível após liberação administrativa |

### RF-07 — Painel do Coordenador
| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-07.1 | Visualização de alunos vinculados | Coordenador vê alunos do(s) curso(s) sob sua responsabilidade |
| RF-07.2 | Acompanhamento de inscrições | Coordenador monitora situação cadastral e documental |
| RF-07.3 | Filtros por curso e status | Painel permite segmentação operacional |
| RF-07.4 | Visualização de desempenho agregado | Exibe métricas autorizadas por curso |

### RF-08 — Administração e Relatórios
| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-08.1 | Gestão de usuários | ADMIN lista usuários, edita perfis e altera roles |
| RF-08.2 | Gestão de inscrições | ADMIN confirma, rejeita e filtra inscrições |
| RF-08.3 | Gestão de provas e questões | ADMIN supervisiona cadastro, revisão e publicação |
| RF-08.4 | Dashboards operacionais | Exibe métricas por edição, estado, instituição e curso |
| RF-08.5 | Exportação CSV | Dados podem ser exportados para uso externo |
| RF-08.6 | Auditoria de ações críticas | Sistema registra ações administrativas relevantes |
| RF-08.7 | Painéis de detalhe unificados | Toda entidade administrativa (User, Instituicao, Curso, Edicao, Inscricao) possui uma tela de visualização construída a partir de um único componente `<DetailPanel>`, com seções rotuladas, hierarquia tipográfica (label pequeno + valor destacado), métrica herói com cor semântica, e estados vazios amigáveis |
| RF-08.8 | Índice ENADE por curso | O cadastro e a visualização de `Curso` expõem o campo `notaEnade` (Decimal 5,2, 0–100, opcional); o painel de detalhe colore a métrica herói conforme faixas (≥60 verde / ≥40 âmbar / else vermelho) |

## 3. Requisitos Não Funcionais

### 3.1 Performance
| ID | Requisito |
|---|---|
| RNF-01 | Endpoints de leitura com tempo de resposta compatível com uso simultâneo em eventos |
| RNF-02 | Salvamento de respostas da prova com baixa latência |
| RNF-03 | Interface da prova com carregamento otimizado |
| RNF-04 | Uploads com barra de progresso e tratamento de falha |
| RNF-05 | Suporte a concorrência durante aplicação da prova |

### 3.2 Segurança
| ID | Requisito |
|---|---|
| RNF-06 | Senhas armazenadas com hash seguro |
| RNF-07 | Tokens com expiração configurável e segredo seguro |
| RNF-08 | Dados sensíveis protegidos e mascarados em logs |
| RNF-09 | Validação rigorosa de uploads |
| RNF-10 | Controle de origem e rate limiting em autenticação |
| RNF-11 | Auditoria de ações críticas |

### 3.3 Usabilidade
| ID | Requisito |
|---|---|
| RNF-12 | Interface responsiva mobile-first |
| RNF-13 | Suporte a instalação via PWA |
| RNF-14 | Mensagens de erro em português claro |
| RNF-15 | Navegação acessível com foco visível e labels adequados |
| RNF-16 | Feedback visual para loading, sucesso, erro e autosave |
| RNF-21 | Telas de detalhe de entidades usam um componente unificado (`<DetailPanel>`) com seções rotuladas, métrica herói com cor semântica (verde/âmbar/vermelho/azul/dourado/neutro), estados vazios amigáveis e transições suaves (fade + scale) |

### 3.4 Manutenibilidade
| ID | Requisito |
|---|---|
| RNF-17 | Código TypeScript no frontend e backend |
| RNF-18 | Backend modular por domínio |
| RNF-19 | Migrações versionadas do banco |
| RNF-20 | Regras de negócio centralizadas e testáveis |

## 4. Arquitetura do Sistema

### 4.1 Visão Geral
- **Frontend:** aplicação web responsiva com suporte a PWA.
- **Backend:** API modular com autenticação, inscrição, provas, avaliação, ranking e administração.
- **Banco de Dados:** PostgreSQL.
- **Armazenamento de Arquivos:** serviço compatível com uploads de comprovantes e materiais da Fase 2.
- **Containerização:** Docker e orquestração local com Docker Compose.

### 4.2 Módulos Lógicos
- Auth
- Users
- Instituições e Cursos
- Inscrições
- Provas
- Questões
- Respostas
- Fase 2
- Avaliação
- Ranking
- Coordenação
- Administração
- Uploads
- Auditoria

## 5. Especificações de API

### 5.1 Convenções
- Base URL: `/api`
- Autenticação: Bearer Token
- Formato: JSON, exceto uploads multipart/form-data
- Respostas de erro padronizadas com código, mensagem e detalhes

### 5.2 Endpoints sugeridos

#### Autenticação
- `POST /auth/registro`
- `POST /auth/login`
- `POST /auth/esqueci-senha`
- `POST /auth/redefinir-senha`
- `GET /auth/me`

#### Perfil e usuários
- `GET /users/me`
- `PATCH /users/me`
- `GET /admin/users`
- `PATCH /admin/users/:id/role`

#### Inscrição
- `POST /olimpiada/inscricao`
- `GET /olimpiada/inscricao/status`
- `PATCH /admin/inscricoes/:id/validar`
- `PATCH /admin/inscricoes/:id/rejeitar`

#### Provas
- `POST /admin/provas`
- `GET /admin/provas`
- `GET /admin/provas/:id`
- `PATCH /admin/provas/:id`
- `POST /admin/provas/:id/publicar`
- `POST /admin/provas/:id/duplicar`

#### Questões
- `POST /admin/provas/:id/questoes`
- `PATCH /admin/questoes/:id`
- `DELETE /admin/questoes/:id`

#### Execução da prova
- `POST /olimpiada/prova/iniciar`
- `POST /olimpiada/prova/responder`
- `POST /olimpiada/prova/finalizar`
- `GET /olimpiada/prova/status`

#### Fase 2
- `GET /olimpiada/fase2/tema`
- `POST /olimpiada/fase2/upload`
- `GET /olimpiada/fase2/status`

#### Avaliação e ranking
- `POST /avaliacao/fase2/:id/nota`
- `GET /ranking/estado`
- `GET /ranking/instituicao`
- `GET /ranking/curso`
- `POST /admin/resultados/publicar`

#### Coordenação
- `GET /coordenacao/alunos`
- `GET /coordenacao/inscricoes`
- `GET /coordenacao/metricas`

#### Relatórios e auditoria
- `GET /admin/dashboard`
- `GET /admin/export/csv`
- `GET /admin/auditoria`

## 6. Modelo de Dados

### 6.1 Entidades principais

| Entidade | Descrição |
|---|---|
| User | Usuário do sistema com role e dados pessoais |
| Instituicao | Universidade ou instituição participante |
| Curso | Curso vinculado a uma instituição |
| CoordenadorCurso | Vínculo entre usuário coordenador e curso |
| Edicao | Configuração de uma edição da olimpíada |
| Inscricao | Registro de participação do aluno em uma edição |
| Prova | Estrutura da prova de uma fase |
| Questao | Questão cadastrada no banco |
| ProvaQuestao | Associação entre prova e questões |
| Resposta | Resposta dada pelo competidor |
| EnvioFase2 | Registro dos arquivos e materiais enviados |
| AvaliacaoFase2 | Nota e parecer da etapa complementar |
| RankingSnapshot | Publicação ou consolidação de ranking |
| AuditLog | Registro de ações críticas do sistema |

### 6.2 Campos essenciais por entidade

#### User
- id
- nome
- email
- cpf
- senhaHash
- role
- instituicaoId
- cursoId
- matricula
- dataNascimento
- createdAt
- updatedAt

#### Curso
- id
- nome
- instituicaoId
- notaEnade *(Decimal 5,2 — adicionado em 2026-07-07, opcional)*
- createdAt
- updatedAt

#### Inscricao
- id
- userId
- edicaoId
- status
- estado
- municipio
- instituicaoId
- cursoId
- periodo
- comprovanteUrl
- fase1Inicio
- fase1Fim
- fase1Nota
- fase2Tema
- notaFinal
- medalha
- createdAt
- updatedAt

#### Prova
- id
- edicaoId
- fase
- titulo
- duracaoMinutos
- status
- publicadaEm
- janelaInicio
- janelaFim
- versao
- createdBy
- updatedAt

#### Questao
- id
- enunciado
- alternativaA
- alternativaB
- alternativaC
- alternativaD
- alternativaE
- correta
- eixo
- dificuldade
- createdAt
- updatedAt

#### Resposta
- id
- inscricaoId
- provaId
- questaoId
- alternativaMarcada
- correta
- createdAt
- updatedAt

#### EnvioFase2
- id
- inscricaoId
- tipo
- arquivoUrl
- status
- enviadoEm

#### AvaliacaoFase2
- id
- inscricaoId
- avaliadorId
- nota
- parecer
- avaliadoEm

#### AuditLog
- id
- actorId
- acao
- entidade
- entidadeId
- payload
- createdAt

## 7. Infraestrutura e Deploy

- Banco PostgreSQL.
- Backend e frontend containerizados.
- Configuração por variáveis de ambiente.
- Deploy compatível com ambientes Linux e orquestração simplificada.
- Estratégia de backup do banco e monitoramento básico durante a prova.

## 8. Requisitos de Teste

| ID | Tipo | Descrição |
|---|---|---|
| TST-01 | Unitário | Autenticação e controle de acesso |
| TST-02 | Unitário | Regras de inscrição e validação |
| TST-03 | Unitário | Cadastro e publicação de provas |
| TST-04 | Unitário | Correção automática da Fase 1 |
| TST-05 | Integração | Fluxo completo de inscrição |
| TST-06 | Integração | Execução da prova: iniciar, responder, finalizar |
| TST-07 | Integração | Upload e avaliação da Fase 2 |
| TST-08 | Integração | Painel do coordenador |
| TST-09 | E2E | Jornada completa do competidor |
| TST-10 | Carga | Simulação de usuários simultâneos em dia de prova |
| TST-11 | Segurança | Testes básicos de autenticação, autorização e upload |

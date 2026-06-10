# PRD — OLICMAT

**Versão:** 2.0  
**Data:** 08/06/2026  
**Autor:** Equipe OLICMAT  
**Status:** Revisado para implementação da V2.0

## 1. Visão do Produto

A OLICMAT é uma plataforma web unificada para a Olimpíada de Licenciandos em Matemática de todo o Brasil, com acesso via navegador e dispositivos móveis por meio de PWA. A experiência deve ser acessível, gamificada e orientada ao autoatendimento, permitindo que o aluno navegue pela plataforma, realize seu cadastro, participe da(s) competição(ões), acompanhe seu desempenho e conclua todas as etapas da olimpíada de forma simples, segura e responsiva.

## 2. Personas

### P1 — Lucas, o Competidor
- **Perfil:** 22 anos, cursa 5º período de Licenciatura em Matemática na UFPI.
- **Objetivo:** Participar da olimpíada, testar conhecimentos e conquistar medalha para fortalecer o currículo.
- **Dor:** Nunca participou de competição acadêmica e não sabe exatamente como funcionam as fases.
- **Jornada:** Cadastro → Inscrição → Confirmação → Prova → Envio da Fase 2 → Resultado.

### P2 — Prof. Wesley, o Coordenador do Curso
- **Perfil:** 45 anos, professor doutor vinculado a uma universidade participante.
- **Objetivo:** Gerenciar na plataforma os alunos do seu curso. Uma universidade pode possuir mais de um curso participante.
- **Dor:** Dificuldade para acompanhar quem já se cadastrou, quem concluiu inscrição e quem ainda está pendente.
- **Jornada:** Recebe convite → Acessa painel → Visualiza cursos vinculados → Gerencia cadastros dos alunos → Acompanha situação das inscrições.

### P3 — Dra. Helena, a Avaliadora
- **Perfil:** 45 anos, professora doutora na UESPI.
- **Objetivo:** Contribuir com a elaboração de provas para as olimpíadas e apoiar a avaliação de etapas complementares.
- **Dor:** Processos manuais de elaboração, revisão e organização de provas e gabaritos.
- **Jornada:** Recebe convite → Acessa painel → Insere provas, questões e gabaritos → Revisa conteúdo → Publica ou submete para validação.

### P4 — Prof. Roberto, o Administrador
- **Perfil:** 38 anos, coordenador estadual da OLICMAT.
- **Objetivo:** Gerenciar inscrições, validar documentos, acompanhar métricas, gerenciar provas e consolidar dados por estado.
- **Dor:** Precisa de visão centralizada da operação e de ferramentas de auditoria e acompanhamento.
- **Jornada:** Acessa painel admin → Valida inscrições → Gerencia provas → Monitora estatísticas → Exporta dados.

### P5 — Ana, a Assistente Operacional
- **Perfil:** 29 anos, integrante da organização da olimpíada.
- **Objetivo:** Apoiar a conferência de cadastros, documentos e pendências operacionais.
- **Dor:** Hoje depende de planilhas e mensagens dispersas para controlar inconsistências.
- **Jornada:** Acessa painel interno → Filtra pendências → Atualiza status → Encaminha inconsistências ao administrador.

## 3. Funcionalidades (Features)

### F1 — Autenticação e Perfil

| ID | Funcionalidade | Prioridade |
|---|---|---|
| F1.1 | Cadastro com dados pessoais e acadêmicos em etapas | P0 |
| F1.2 | Login com e-mail e senha | P0 |
| F1.3 | Recuperação de senha | P1 |
| F1.4 | Edição de perfil | P1 |
| F1.5 | Controle de acesso por roles: ALUNO, COORDENADOR_CURSO, AVALIADOR, ADMIN | P0 |
| F1.6 | Confirmação de e-mail | P1 |
| F1.7 | Indicador de completude de perfil | P2 |
| F1.8 | Aceite de termos e política de privacidade | P0 |

### F2 — Cadastro de Provas

| ID | Funcionalidade | Prioridade |
|---|---|---|
| F2.1 | Criar prova por edição, fase e tipo | P0 |
| F2.2 | Cadastrar questões com enunciado, cinco alternativas, resposta correta, eixo e dificuldade | P0 |
| F2.3 | Cadastrar gabarito oficial da prova | P0 |
| F2.4 | Salvar prova em rascunho | P0 |
| F2.5 | Publicar prova para aplicação | P0 |
| F2.6 | Duplicar prova de edições anteriores | P1 |
| F2.7 | Versionar alterações antes da publicação | P1 |
| F2.8 | Submeter prova para revisão/aprovação por ADMIN | P1 |
| F2.9 | Associar duração, janela de acesso e regras da aplicação | P0 |
| F2.10 | Bloquear edição após início da aplicação e registrar auditoria | P0 |

### F3 — Inscrição e Participação na OLICMAT

| ID | Funcionalidade | Prioridade |
|---|---|---|
| F3.1 | Inscrição na olimpíada com UF, município, instituição, curso e período | P0 |
| F3.2 | Upload de comprovante de matrícula | P0 |
| F3.3 | Validação de inscrição por ADMIN com status PENDENTE, CONFIRMADA ou REJEITADA | P0 |
| F3.4 | Painel de status da inscrição com checklist de pendências | P1 |
| F3.5 | Restrição de participação por edição e regras de elegibilidade | P0 |
| F3.6 | Aplicação da Fase 1 com cronômetro e autosave | P0 |
| F3.7 | Sorteio ou vinculação de tema da Fase 2 | P0 |
| F3.8 | Upload dos materiais da Fase 2 | P0 |
| F3.9 | Linha do tempo da jornada do competidor | P1 |

### F4 — Avaliação, Resultados e Ranking

| ID | Funcionalidade | Prioridade |
|---|---|---|
| F4.1 | Correção automática da Fase 1 | P0 |
| F4.2 | Avaliação manual da Fase 2 | P0 |
| F4.3 | Cálculo de nota final com pesos configuráveis por edição | P0 |
| F4.4 | Critérios de desempate configuráveis | P1 |
| F4.5 | Ranking por estado | P0 |
| F4.6 | Ranking por instituição e curso | P1 |
| F4.7 | Distribuição automática de medalhas | P0 |
| F4.8 | Publicação controlada de resultados | P0 |

### F5 — Painel Administrativo e Coordenação

| ID | Funcionalidade | Prioridade |
|---|---|---|
| F5.1 | Gestão de usuários e perfis | P0 |
| F5.2 | Gestão de inscrições com filtros e validação | P0 |
| F5.3 | Gestão de provas e questões | P0 |
| F5.4 | Painel do coordenador com visão por curso | P0 |
| F5.5 | Dashboards por estado, universidade e curso | P1 |
| F5.6 | Exportação de dados em CSV | P1 |
| F5.7 | Auditoria de ações críticas | P1 |

## 4. Fluxos Principais

### 4.1 Cadastro e autenticação
Cadastro → Confirmação de conta → Login → Completar perfil → Acesso ao dashboard.

### 4.2 Inscrição na olimpíada
Login → Preencher inscrição → Enviar comprovante → Submeter → Aguardar validação → Visualizar status.

### 4.3 Cadastro de provas
Login como avaliador/admin → Criar prova → Inserir questões e gabarito → Salvar rascunho → Revisar → Publicar.

### 4.4 Realização da competição
Inscrição confirmada → Iniciar prova → Responder questões com autosave → Finalizar → Receber nota da Fase 1 → Acessar Fase 2 → Enviar materiais.

### 4.5 Avaliação e publicação dos resultados
Avaliador/admin acessa envios → Atribui notas → Sistema calcula nota final → Gera ranking → Publica medalhas e resultados.

### 4.6 Gestão pelo coordenador
Coordenador acessa painel → Filtra alunos por curso → Acompanha situação cadastral e de inscrição → Identifica pendências.

## 5. Requisitos de UX/UI

- Tema visual consistente com a identidade da OLICMAT.
- Interface responsiva mobile-first.
- Suporte explícito a acesso web e mobile via PWA.
- Fluxos simples e orientados por etapas.
- Feedback em tempo real para ações críticas, como autosave, uploads e finalização da prova.
- Cronômetro e alertas visuais durante a prova.
- Gamificação por medalhas, status e progresso da jornada.
- Acessibilidade com contraste adequado, labels descritivos, navegação por teclado e mensagens claras.
- Confirmação explícita antes de ações destrutivas ou irreversíveis.

## 6. Roadmap

### V2.0 — Entrega alvo
- Autenticação completa e gestão de perfis.
- Inscrição OLICMAT com upload e validação de comprovantes.
- Painel do coordenador de curso.
- Cadastro de provas, questões e gabaritos.
- Aplicação da Fase 1 com cronômetro e autosave.
- Gestão da Fase 2 com envio de materiais.
- Avaliação, cálculo de nota final, ranking e medalhas.
- Painel administrativo com dashboards e exportação CSV.
- Suporte web responsivo e instalação via PWA.

# PRD — Product Requirements Document

## OLICMAT — Olimpíada para Licenciandos em Matemática

| Campo | Valor |
|---|---|
| **Versão** | 1.0 |
| **Data** | 12/05/2026 |
| **Autor** | Equipe OLICMAT |
| **Status** | Em desenvolvimento |

---

## 1. Visão do Produto

Plataforma web unificada que integra competição olímpica, formação pedagógica e congresso acadêmico para licenciandos em Matemática de todo o Brasil. A experiência deve ser acessível, gamificada e orientada ao auto-serviço, permitindo que o aluno navegue entre os três pilares com uma única conta.

---

## 2. Personas

### P1 — Lucas, o Competidor
- **Perfil**: 22 anos, cursa 5º período de Licenciatura em Matemática na UEMA
- **Objetivo**: Participar da olimpíada, testar conhecimentos, ganhar medalha para o currículo
- **Dor**: Nunca participou de competição acadêmica, não sabe o que esperar
- **Jornada**: Cadastro → Inscrição → Prova → Envio Fase 2 → Resultado

### P2 — Amanda, a Estudante Dedicada
- **Perfil**: 28 anos, cursa 7º período na UNESP, já dá aulas no estágio
- **Objetivo**: Complementar formação pedagógica, conseguir certificado de 120h
- **Dor**: Falta de tempo, precisa de flexibilidade para estudar no próprio ritmo
- **Jornada**: Navega catálogo FORPEMAT → Escolhe módulos → Estuda → Conclui → Recebe certificado

### P3 — Carlos, o Pesquisador
- **Perfil**: 25 anos, cursa 8º período na UFPA, tem artigo do TCC pronto
- **Objetivo**: Publicar artigo e apresentar no congresso
- **Dor**: Congressos tradicionais são caros e presenciais
- **Jornada**: Prepara artigo → Submete PDF → Aguarda avaliação → Recebe aprovação

### P4 — Dra. Helena, a Avaliadora
- **Perfil**: 45 anos, professora doutora na UFMG
- **Objetivo**: Contribuir com a comunidade acadêmica avaliando trabalhos
- **Dor**: Processos manuais de avaliação consomem tempo
- **Jornada**: Recebe convite → Acessa painel → Avalia submissões → Emite parecer

### P5 — Prof. Roberto, o Administrador
- **Perfil**: 38 anos, coordenador estadual da OLICMAT
- **Objetivo**: Gerenciar inscrições, validar documentos, acompanhar métricas
- **Dor**: Precisa de visão consolidada dos participantes por estado
- **Jornada**: Acessa admin → Valida inscrições → Acompanha estatísticas → Exporta dados

---

## 3. Funcionalidades (Features)

### F1 — Autenticação e Perfil
| ID | Funcionalidade | Prioridade |
|---|---|---|
| F1.1 | Cadastro com dados pessoais + acadêmicos (2 etapas) | P0 |
| F1.2 | Login com email e senha | P0 |
| F1.3 | Recuperação de senha | P1 |
| F1.4 | Edição de perfil | P1 |
| F1.5 | Controle de acesso por roles (ALUNO, AVALIADOR, ADMIN) | P0 |

### F2 — OLICMAT (Competição)
| ID | Funcionalidade | Prioridade |
|---|---|---|
| F2.1 | Inscrição na olimpíada (UF, município, instituição, curso, período) | P0 |
| F2.2 | Upload de comprovante de matrícula | P0 |
| F2.3 | Validação de inscrição por ADMIN (PENDENTE → CONFIRMADA) | P0 |
| F2.4 | Prova objetiva: 30 questões, 180 min, cronômetro regressivo | P0 |
| F2.5 | Correção automática ao finalizar ou esgotar tempo | P0 |
| F2.6 | Sorteio de tema para videoaula (10 temas possíveis) | P0 |
| F2.7 | Upload de videoaula (MP4) via Cloudinary | P0 |
| F2.8 | Upload de portfólio digital (PDF) via Cloudinary | P0 |
| F2.9 | Cálculo de nota final (Fase 1 × 0,4 + Fase 2 × 0,6) | P0 |
| F2.10 | Ranking estadual com distribuição de medalhas (5%/10%/15%) | P0 |

### F3 — FORPEMAT (Formação)
| ID | Funcionalidade | Prioridade |
|---|---|---|
| F3.1 | Catálogo público de 14 módulos (título, carga horária, descrição) | P0 |
| F3.2 | Conteúdo completo de cada módulo com questionário | P0 |
| F3.3 | Rastreamento de progresso por usuário (concluído/não concluído) | P0 |
| F3.4 | Barra de progresso geral (% de módulos concluídos) | P0 |
| F3.5 | Emissão automática de certificado (120h) com código único de validação | P0 |

### F4 — CONGEMAT (Congresso)
| ID | Funcionalidade | Prioridade |
|---|---|---|
| F4.1 | Submissão de artigo completo ou pôster (PDF) | P0 |
| F4.2 | Listagem de submissões do usuário com status | P0 |
| F4.3 | Avaliação por AVALIADOR com status (APROVADO/REJEITADO) | P0 |

### F5 — Ranking Público
| ID | Funcionalidade | Prioridade |
|---|---|---|
| F5.1 | Página de ranking público por estado | P0 |
| F5.2 | Exibição de medalhas (Ouro/Prata/Bronze) | P0 |

---

## 4. Fluxos Principais (User Journeys)

### 4.1 Jornada do Competidor (Fase 1 + Fase 2)

```
[Registro] → [Login] → [Dashboard Competidor] → [Inscrição OLICMAT]
                                                      ↓
                                            [Aguardar Validação]
                                                      ↓
                                            [Dashboard: "Inscrição Confirmada"]
                                                      ↓
                                            [Iniciar Prova Fase 1]
                                                      ↓
                                    ┌── [Responder 30 questões (180 min)]
                                    │         ↓
                                    │   [Finalizar ou Tempo Esgotado]
                                    │         ↓
                                    │   [Nota Fase 1 Calculada]
                                    └─────────┘
                                                      ↓
                                            [Sorteio Tema Fase 2]
                                                      ↓
                                    ┌── [Produzir Videoaula + Portfólio]
                                    │         ↓
                                    │   [Upload dos Arquivos]
                                    │         ↓
                                    │   [Nota Fase 2 Atribuída]
                                    └─────────┘
                                                      ↓
                                            [Nota Final + Ranking + Medalha]
```

### 4.2 Jornada do Aluno FORPEMAT

```
[Login] → [Catálogo de Cursos] → [Selecionar Módulo]
                                        ↓
                              [Estudar Conteúdo]
                                        ↓
                              [Responder Questionário]
                                        ↓
                              [Módulo Concluído ✓]
                                        ↓
                              [Progresso Atualizado]
                                        ↓
                     ┌── [Concluiu todos os 14 módulos?]──┐
                     │ Não                                 │ Sim
                     ↓                                     ↓
              [Continuar Estudos]                 [Emitir Certificado 120h]
```

### 4.3 Jornada do Congressista

```
[Login] → [Área CONGEMAT] → [Nova Submissão]
                                   ↓
                         [Preencher: tipo, título, resumo, PDF]
                                   ↓
                         [Submeter]
                                   ↓
                         [Status: EM_AVALIAÇÃO]
                                   ↓
                    ┌── [Avaliador aprova?]──┐
                    │ Sim                     │ Não
                    ↓                         ↓
             [APROVADO]               [REJEITADO]
```

---

## 5. Requisitos de UX/UI

- **Tema escuro obrigatório** (identidade visual OLICMAT)
- **Design responsivo** (mobile-first para prova e catálogo de cursos)
- **Família tipográfica**: Fraunces (títulos), Outfit (corpo), JetBrains Mono (código/matemática)
- **Feedback em tempo real**: timer da prova, barra de progresso dos módulos, status de submissão
- **Gamificação**: medalhas visuais, progresso em %, ranking com destaques
- **Acessibilidade**: contraste adequado em tema escuro, labels descritivos, navegação por teclado
- **Mensagens de erro amigáveis** em formulários com validação Zod
- **Confirmação explícita** antes de ações destrutivas (finalizar prova, cancelar inscrição)

---

## 6. Roadmap (Entregas)

### v1.0 — MVP (Maio 2026)
- [x] Autenticação completa (registro, login, roles)
- [x] Inscrição OLICMAT com validação administrativa
- [x] Prova objetiva com 30 questões e timer
- [x] Upload Fase 2 (videoaula + portfólio)
- [x] Cálculo de nota final e ranking com medalhas
- [x] Catálogo FORPEMAT com 14 módulos e progresso
- [x] Emissão de certificado automática
- [x] Submissão CONGEMAT com avaliação

### v1.1 — Melhorias Pós-Lançamento
- [ ] Recuperação de senha por email
- [ ] Painel admin com dashboards e exportação CSV
- [ ] Notificações por email (status de inscrição, resultado, certificado)
- [ ] Validação de certificado por código público
- [ ] Upload de comprovante de matrícula para inscrição

### v2.0 — Edição 2027
- [ ] Múltiplas edições no mesmo sistema (2026, 2027, ...)
- [ ] Banco de questões rotativo com aleatorização
- [ ] Detecção básica de plágio nas submissões
- [ ] Página de evento ao vivo para o congresso
- [ ] Sistema de anais do congresso

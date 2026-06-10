# BRD — Business Requirements Document

## OLICMAT — Olimpíada para Licenciandos em Matemática

| Campo | Valor |
|---|---|
| **Versão** | 1.0 |
| **Data** | 12/05/2026 |
| **Autor** | Equipe OLICMAT |
| **Status** | Em desenvolvimento |

---

## 1. Sumário Executivo

A OLICMAT é uma iniciativa acadêmica voltada para estudantes de Licenciatura em Matemática de instituições públicas brasileiras de ensino superior. O projeto integra três pilares em uma única plataforma digital:

1. **OLICMAT** — competição olímpica em duas fases (prova objetiva + produção de videoaula e portfólio digital)
2. **FORPEMAT** — programa de formação pedagógica com 14 módulos totalizando 120 horas, com emissão de certificado
3. **CONGEMAT** — congresso acadêmico para submissão de artigos e pôsteres com avaliação por pares

A edição de 2026 tem cronograma previsto de junho (abertura das inscrições) a novembro (divulgação final dos resultados e premiação).

---

## 2. Objetivos de Negócio

| ID | Objetivo | Métrica de Sucesso |
|---|---|---|
| OB-01 | Ampliar o engajamento de licenciandos em Matemática em atividades extracurriculares | Mínimo de 1.000 inscritos na primeira edição |
| OB-02 | Oferecer formação continuada gratuita e certificada para futuros professores | 70% dos inscritos concluírem ao menos 1 módulo FORPEMAT |
| OB-03 | Fomentar a produção acadêmica na área de Ensino de Matemática | Mínimo de 100 submissões no CONGEMAT |
| OB-04 | Criar uma plataforma escalável para edições anuais subsequentes | Arquitetura permitir replicação com dados de novas edições |
| OB-05 | Promover visibilidade institucional para os parceiros e apoiadores | Registro de acessos ao site e citações em redes sociais |

---

## 3. Escopo

### 3.1 Dentro do Escopo

- Plataforma web responsiva (desktop e mobile)
- Cadastro e autenticação de usuários com três perfis (ALUNO, AVALIADOR, ADMIN)
- Inscrição na olimpíada vinculada a estado e instituição
- Aplicação de prova online com 30 questões objetivas e cronômetro de 180 minutos
- Correção automática da prova objetiva (Fase 1)
- Sorteio de tema para produção de videoaula (Fase 2)
- Upload de videoaula e portfólio digital (Cloudinary)
- Cálculo de nota final (Fase 1 × 0,4 + Fase 2 × 0,6)
- Ranking estadual com distribuição automática de medalhas (Ouro 5%, Prata 10%, Bronze 15%)
- Catálogo de 14 módulos FORPEMAT com progresso por usuário
- Emissão automática de certificado ao concluir todos os módulos
- Submissão de artigos e pôsteres no CONGEMAT em formato PDF
- Fluxo de avaliação de submissões (aprovado/rejeitado)

### 3.2 Fora do Escopo (v1)

- Aplicativo mobile nativo
- Transmissão ao vivo de eventos
- Integração com sistemas acadêmicos (SIGAA, Moodle)
- Marketplace ou loja virtual
- Fórum ou rede social interna
- Pagamento de taxas de inscrição online

---

## 4. Partes Interessadas (Stakeholders)

| Parte | Interesse | Nível de Influência |
|---|---|---|
| **Coordenação OLICMAT** | Realização do evento, captação de apoiadores | Alto |
| **Alunos (Licenciandos)** | Participação, certificação, premiação | Alto (usuário final) |
| **Avaliadores** | Correção da Fase 2 e submissões do congresso | Médio |
| **Instituições Parceiras** | Visibilidade, engajamento dos alunos | Médio |
| **Administradores do Sistema** | Operação, suporte, validação de inscrições | Alto |
| **Equipe de Desenvolvimento** | Construção e manutenção da plataforma | Alto |

---

## 5. Análise de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Baixa adesão de inscritos | Média | Alto | Divulgação antecipada via instituições parceiras e redes sociais |
| Sobrecarga do servidor no dia da prova | Média | Alto | Testes de carga, escalonamento horizontal no Docker, CDN para assets |
| Problemas de conexão dos alunos durante a prova | Alta | Médio | Salvar respostas incrementalmente, permitir retomada da prova |
| Fraudes ou plágio nas submissões | Média | Médio | Avaliação por pares, detecção de plágio futura |
| Atraso no cronograma de desenvolvimento | Baixa | Alto | Metodologia ágil, entregas incrementais |

---

## 6. Premissas e Restrições

### Premissas
- Os alunos possuem acesso à internet e dispositivo compatível (desktop, tablet ou smartphone)
- As instituições parceiras divulgarão o evento em seus canais oficiais
- Haverá avaliadores disponíveis para correção da Fase 2 e do congresso
- O sistema operará em português brasileiro como único idioma

### Restrições
- Orçamento limitado — infraestrutura baseada em soluções de baixo custo (VPS, Cloudinary free tier)
- Prazo: plataforma funcional até maio de 2026 para início das inscrições em junho
- Conformidade com a LGPD para tratamento de dados pessoais (CPF, dados acadêmicos)
- Acesso gratuito para todos os participantes

---

## 7. Cronograma Macro (Edição 2026)

| Mês | Marco |
|---|---|
| **Maio** | Plataforma no ar — versão beta |
| **Junho** | Abertura das inscrições OLICMAT + FORPEMAT + CONGEMAT |
| **Julho** | Realização da Fase 1 (prova online) |
| **Agosto** | Divulgação dos resultados da Fase 1 + início da Fase 2 |
| **Setembro** | Prazo final para envio da Fase 2 |
| **Outubro** | Avaliação da Fase 2 + submissões CONGEMAT |
| **Novembro** | Divulgação final, ranking, medalhas, certificados |

# BRD — OLICMAT

**Versão:** 2.1  
**Data:** 04/08/2026  
**Autor:** Equipe OLICMAT  
**Status:** Revisado para Arquitetura de Aplicação de Prova Standalone & Remoção do Redis

## 1. Sumário Executivo

A OLICMAT é uma plataforma digital voltada à gestão e execução da Olimpíada para Licenciandos em Matemática, destinada a estudantes de instituições públicas brasileiras de ensino superior. Nesta fase do projeto (V2.1), a aplicação da Prova (Fase 1) foi desacoplada em uma aplicação standalone de alta disponibilidade executada em rede interna (`10.42.0.0/16`), acessível via reverse proxy sob subdomínio isolado, eliminando dependências do Redis e isolando o tráfego do dia da prova em relação ao sistema principal.

## 2. Objetivos de Negócio

| ID | Objetivo | Métrica de Sucesso |
|---|---|---|
| OB-01 | Centralizar em uma única plataforma o processo operacional da OLICMAT, do cadastro ao resultado final | 100% das etapas da olimpíada executadas no sistema |
| OB-02 | Aumentar a participação de licenciandos em Matemática por meio de um processo digital simples e acessível | Crescimento anual de inscritos |
| OB-03 | Reduzir o trabalho manual da equipe organizadora na gestão de inscrições, provas e resultados | Redução de controles paralelos em planilhas e e-mails |
| OB-04 | Permitir acompanhamento por coordenadores de curso e administradores | Painéis com visão por curso, instituição e estado |
| OB-05 | Garantir base tecnológica escalável para novas edições da olimpíada | Suporte à reutilização do sistema em futuras edições |

## 3. Escopo

### 3.1 Dentro do Escopo
- Plataforma web responsiva com suporte a PWA.
- Cadastro e autenticação de usuários.
- Gestão de perfis: ALUNO, COORDENADOR_CURSO, AVALIADOR e ADMIN.
- Inscrição na OLICMAT.
- Upload e validação de comprovante de matrícula.
- Cadastro de provas, questões e gabaritos.
- Aplicação da prova online.
- Gestão da Fase 2.
- Avaliação, cálculo de nota final, ranking e medalhas.
- Painéis administrativos, coordenação e relatórios.

### 3.2 Fora do Escopo
- FORPEMAT.
- CONGEMAT.
- Aplicativo mobile nativo.
- Integrações com SIGAA, Moodle ou sistemas acadêmicos externos.
- Transmissões ao vivo.
- Fóruns ou rede social interna.
- Pagamentos online.

## 4. Partes Interessadas

| Parte | Interesse | Nível de Influência |
|---|---|---|
| Coordenação OLICMAT | Realização do evento e supervisão geral | Alto |
| Alunos Licenciandos | Participação na competição e premiação | Alto |
| Coordenadores de Curso | Acompanhamento de alunos por curso | Alto |
| Avaliadores | Elaboração de provas e avaliação de etapas | Médio |
| Administradores do Sistema | Operação, validação e monitoramento | Alto |
| Instituições Parceiras | Engajamento e visibilidade institucional | Médio |
| Equipe de Desenvolvimento | Construção, manutenção e evolução da plataforma | Alto |

## 5. Análise de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Baixa adesão de inscritos | Média | Alto | Divulgação antecipada por instituições parceiras e canais oficiais |
| Sobrecarga do servidor no dia da prova | Média | Alto | Separação física e lógica da Aplicação de Prova em máquina dedicada de rede interna (10.42.0.0/16) com reverse proxy e remoção completa do Redis |
| Problemas de conexão dos alunos durante a prova | Alta | Médio | Salvamento incremental de respostas, retomada controlada via tokens de transição e mensagens claras |
| Erros operacionais na publicação de provas ou resultados | Média | Alto | Revisão por workflow, auditoria e publicação controlada |
| Atraso no cronograma de desenvolvimento | Média | Alto | Planejamento incremental, validação contínua e entregas priorizadas |

## 6. Premissas e Restrições

### 6.1 Premissas
- Os alunos possuem acesso à internet e dispositivo compatível com navegador moderno.
- As instituições parceiras apoiarão a divulgação da olimpíada.
- Haverá avaliadores e administradores disponíveis para operar o sistema.
- O sistema operará em português brasileiro como idioma principal.
- O acesso mobile ocorrerá por PWA e interface responsiva.

### 6.2 Restrições
- Orçamento limitado, priorizando soluções de baixo custo operacional.
- Prazo de entrega concentrado em uma versão V2.0 funcional.
- Conformidade com a LGPD para dados pessoais e acadêmicos.
- Acesso gratuito para todos os participantes.

## 7. Cronograma Macro

| Período | Marco |
|---|---|
| Fase 1 | Preparação da plataforma, perfis, cadastro e gestão operacional |
| Fase 2 | Abertura das inscrições e validação documental |
| Fase 3 | Cadastro e publicação das provas |
| Fase 4 | Realização da Fase 1 |
| Fase 5 | Execução da Fase 2 com envio de materiais |
| Fase 6 | Avaliação, ranking e premiação |

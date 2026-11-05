# Suporte à Prova da Fase 1 — 08/11/2026, 08:30 às 11:00

Manual da equipe de suporte. Painel: **Admin ou Comissão → Monitoramento → prova → Acompanhar**.
Atualiza a cada 5 s. A busca aceita nome, CPF, matrícula, e-mail e curso.

## Atendimento

Confirme a identidade (CPF e matrícula, mostrados abaixo do nome) antes de qualquer ação.

| O participante diz | Causa provável | O que fazer |
|---|---|---|
| "Não consigo entrar" / "Credenciais inválidas" | Senha esquecida | **Senha** → dite a senha provisória. Ela aparece uma só vez. Não use o e-mail de recuperação: pode não chegar a tempo |
| "Inscrição não confirmada" | Inscrição pendente | Resolver em Inscrições. Sem isso, a prova não abre |
| "Token inválido ou expirado" | Demorou mais de 2 min para abrir o link, ou diferença de relógio entre servidores | Voltar ao painel do aluno e clicar de novo em "Acessar a aplicação de prova". Se atingir vários, ver "Incidentes" |
| Tela cheia não ativa / aparece mensagem de iPhone | Aparelho sem suporte | Entrar pelo computador. O tempo está correndo: se for procedente, use **+ Tempo** |
| Prova encerrada por 3 advertências, com justificativa | Saiu da tela (notificação, queda) | Avaliar. Se aceitar: **Destravar** + justificativa + F5 |
| Caiu a internet, a luz ou o computador | Tempo continuou correndo | Só voltar a entrar: as respostas salvas estão lá. Se procedente: **+ Tempo** |
| Clicou em "Finalizar" por engano | | **Destravar** com justificativa + F5. As respostas são mantidas |
| Tela travada ou "Serviço indisponível" | Rede ou serviço | Pedir F5. Se atingir vários, ver "Incidentes" |

## Ações do painel

| Ação | Efeito | Precisa de F5? |
|---|---|---|
| **+ Tempo** | Soma minutos, inclusive além das 11:00 | Não, com a prova aberta o prazo se atualiza sozinho |
| **Destravar** | Reabre, zera advertências, mantém início e respostas; soma os minutos informados | Sim |
| **Resetar** | Reinicia o cronômetro e zera tudo, menos as respostas | Sim. Excepcional: quem entra às 10:00 ainda termina às 11:00 |
| **Senha** | Gera senha provisória e invalida a anterior | Novo login |
| **Encerrar pendentes** | Calcula a nota de quem esgotou o tempo sem finalizar | Usar após o fim, quando não houver ninguém com tempo extra |

Toda ação fica em **Auditoria**. O suporte pode atuar até 13:00 (2 h após o fechamento).
Quem nunca iniciou não entra depois das 11:00.

**Regra de tempo:** a prova termina às 11:00 para todos, e o atraso consome tempo do participante.
O tempo extra soma depois das 11:00.

## Incidentes

- **Muitos sem conseguir entrar às 08:30:** a fila de login pode levar alguns segundos. Peça para aguardar, sem recarregar repetidamente.
- **Serviço de provas fora do ar:** reinicie o `exam-api` na Máquina 2. No teste, um reinício gerou 8 s de erro sem perder respostas confirmadas. Depois, compense com **+ Tempo** se necessário.
- **Banco fora do ar:** ninguém salva. Registre o horário de início e fim: a comissão decide a compensação depois.

## Antes da prova

### 1. Implantação (nesta ordem)

1. Backup do banco.
2. Máquina 1: `admin-api` e `admin-web`. A migration é aplicada ao subir, só adiciona colunas e não afeta a versão em execução.
3. Máquina 2: `exam-api` e `exam-web`. **Nunca antes do passo 2**: o novo `exam-api` usa as colunas novas.

### 2. Conferência no banco (Máquina 3)

```sql
-- Deve haver UMA prova de fase 1 por edição: a aplicação usa a primeira que encontrar.
-- Esperado: PUBLICADA ou EM_ANDAMENTO, 150 min, 20 questões,
-- janela 2026-11-08 11:30 a 14:00 (UTC; equivale a 08:30 e 11:00 em Teresina).
SELECT p.id, p.titulo, p."edicaoId", p.status, p."duracaoMinutos",
       p."janelaInicio", p."janelaFim", count(q.id) AS questoes
FROM "Prova" p LEFT JOIN "ProvaQuestao" q ON q."provaId" = p.id
WHERE p.fase = 1 GROUP BY p.id;

-- Não pode haver respostas nem início de prova antes do dia 08.
SELECT count(*) FILTER (WHERE "fase1Inicio" IS NOT NULL) AS iniciaram,
       count(*) FILTER (WHERE status = 'CONFIRMADA') AS confirmadas
FROM "Inscricao";
```

### 3. Infraestrutura

- [ ] `timedatectl` com NTP ativo nas 3 máquinas (o token de passagem vale 2 min).
- [ ] Prova de ponta a ponta em produção com uma conta real da organização.
- [ ] Equipe com acesso ao painel e aos canais de WhatsApp e Instagram.
- [ ] Monitoramento aberto desde 08:00.

# Suporte à Prova da Fase 1 — 08/11/2026, 08:30 às 11:30

Duração de 180 minutos (3 horas). Termina às 11:30 para todos. Início até 09:00, sem exceção, inclusive por alegação de falha de internet, aparelho ou acesso. A prova pode ser feita no computador ou no celular.

Manual da equipe de suporte. Painel: **Admin ou Comissão → Monitoramento → prova → Acompanhar**.
Atualiza a cada 5 s. A busca aceita nome, CPF, matrícula, e-mail e curso.

## Atendimento

Confirme a identidade (CPF e matrícula, mostrados abaixo do nome) antes de qualquer ação.

| O participante diz | Causa provável | O que fazer |
|---|---|---|
| "Não consigo entrar" / "Credenciais inválidas" | Senha esquecida | **Senha** → dite a senha provisória. Ela aparece uma só vez. Não use o e-mail de recuperação: pode não chegar a tempo |
| "Inscrição não confirmada" | Inscrição pendente | Resolver em Inscrições. Sem isso, a prova não abre |
| "Token de transição inválido ou expirado" | Demorou mais de 2 min para abrir o link, ou diferença de relógio entre servidores | Voltar ao painel do aluno e clicar de novo em "Acessar a aplicação de prova". Se atingir vários, ver "Incidentes" |
| "Este link de entrada já foi usado" | O link de entrada só funciona uma vez | Voltar ao painel do aluno e clicar de novo em "Acessar a aplicação de prova" |
| "Esta conta já está em uso em outro aparelho" | Outra sessão ativa, ou aparelho perdido | O segundo acesso é recusado. O painel mostra "outro aparelho" no aluno, e a tela da prova aberta avisa até a tentativa parar. Oriente a fechar o outro acesso: é proibido usar o mesmo usuário em dois aparelhos ao mesmo tempo. Não fale em punição. Se a pessoa perdeu o aparelho ou a conexão: **Liberar sessão**, ou aguardar cerca de 2 min. Confirme a identidade antes. Se ela diz que não abriu a outra sessão, avise a comissão: outra pessoa pode estar usando a conta |
| "O prazo para iniciar a prova terminou às 09:00" | Não iniciou até 09:00 | Regra do regulamento, sem exceção, inclusive por alegação de falha de internet, aparelho ou acesso: não há como iniciar. Quem iniciou antes pode voltar normalmente enquanto a prova estiver aberta |
| "Sessão encerrada" / voltou para o login no meio da prova | A conta entrou em outro aparelho | Entrar de novo no aparelho atual. As respostas salvas estão lá |
| Advertência ao receber ligação ou tela apagada no celular | Sair do aplicativo conta como saída | Orientar a usar o modo Não Perturbe e desativar o bloqueio automático de tela. Se chegar a 3 e for procedente: **Destravar** |
| Prova encerrada por 3 advertências, com justificativa | Saiu da tela (notificação, queda) | Avaliar. Se aceitar: **Destravar** + justificativa + F5 |
| Caiu a internet, a luz ou o computador | Tempo continuou correndo | Só voltar a entrar, mesmo depois das 09:00, se iniciou antes: as respostas salvas estão lá |
| "Marquei e não salvei" / "O sistema não salvou no fim" | Só contam respostas salvas | O sistema não salva sozinho às 11:30 nem no encerramento por 3 advertências. Questões em branco e alternativas marcadas sem salvar não são contabilizadas. Ao trocar de questão, a alternativa marcada é salva |
| Clicou em "Finalizar" por engano | | **Destravar** com justificativa + F5. As respostas são mantidas |
| Botão da prova desativado antes das 08:30 | Regra: libera às 08:30 de 08/11, no horário do servidor | Aguardar. Libera sozinho, sem recarregar. O relógio do aparelho não muda isso |
| Tela travada ou "Serviço indisponível" | Rede ou serviço | Pedir F5. Se atingir vários, ver "Incidentes" |

## Ações do painel

| Ação | Efeito | Precisa de F5? |
|---|---|---|
| **Destravar** | Reabre, zera advertências, mantém início e respostas; soma os minutos informados | Sim |
| **Resetar** | Reinicia o cronômetro e zera tudo, menos as respostas | Sim. Excepcional: quem é resetado às 10:00 ainda termina às 11:30 |
| **Senha** | Gera senha provisória, invalida a anterior e libera a sessão | Novo login |
| **Liberar sessão** | Permite entrar em outro aparelho na hora. Aparece com a sessão ativa | Novo login. O aparelho anterior cai quando o novo entrar |
| **Encerrar pendentes** | Encerra quem esgotou o tempo sem finalizar. A nota só existe depois da correção pelo gabarito oficial | Usar após o fim, quando não houver ninguém com tempo extra |

Toda ação fica em **Auditoria**. O suporte pode atuar até 13:30 (2 h após o fechamento).
Quem não iniciou até 09:00 não entra mais, e nenhuma ação do painel muda isso.

**Regra de tempo:** a prova termina às 11:30 para todos, seja qual for o horário de início. Quem inicia às 09:00 tem até 11:30, então tem 2h30. Início até 09:00, sem exceção, inclusive por alegação de falha. A duração cadastrada deve ser 180 minutos.

**Avisos na tela:** quando faltam 10 minutos, 5 minutos e 1 minuto para o encerramento. Nos últimos 10 minutos o relógio fica em destaque.

**Encerramento:** às 11:30 a prova é encerrada automaticamente. Contam somente as respostas salvas. O sistema não salva sozinho ao fim do tempo nem no encerramento por 3 advertências.

## Incidentes

- **Muitos sem conseguir entrar às 08:30:** a fila de login pode levar de 10 a 20 segundos no pico. Peça para aguardar, sem recarregar repetidamente, e divulgue antes que todos entrem no sistema a partir de 08:15.
- **Serviço de provas fora do ar:** reinicie o `exam-api` na Máquina 2. No teste, um reinício gerou 8 s de erro sem perder respostas confirmadas.
- **Banco fora do ar:** ninguém salva. Registre o horário de início e fim: a comissão decide a compensação depois.

## Antes da prova

### 1. Implantação (nesta ordem)

1. Backup do banco.
2. Máquina 1: `admin-api` e `admin-web`. A migration é aplicada ao subir, só adiciona colunas e não afeta a versão em execução.
3. Máquina 2: `exam-api` e `exam-web`. **Nunca antes do passo 2**: o novo `exam-api` usa as colunas novas.

### 2. Conferência no banco (Máquina 3)

```sql
-- Deve haver UMA prova de fase 1 publicada, na mesma edição dos inscritos.
-- Esperado: PUBLICADA, 20 questões, duracaoMinutos 180, e em UTC (3 horas a mais que Teresina):
-- início 2026-11-08 11:30, limite 12:00, fim 14:30.
SELECT p.id, p.titulo, p."edicaoId", p.status, p."duracaoMinutos",
       p."janelaInicio", p."limiteInicio", p."janelaFim", count(q.id) AS questoes
FROM "Prova" p LEFT JOIN "ProvaQuestao" q ON q."provaId" = p.id
WHERE p.fase = 1 GROUP BY p.id;

-- Não pode haver respostas nem início de prova antes do dia 08.
SELECT count(*) FILTER (WHERE "fase1Inicio" IS NOT NULL) AS iniciaram,
       count(*) FILTER (WHERE status = 'CONFIRMADA') AS confirmadas
FROM "Inscricao";
```

Com o Postgres em Docker, rode com `docker exec -i olicmat-db psql -U olicmat -d olicmat`.

### 3. Infraestrutura

- [ ] `timedatectl` com NTP ativo nas 3 máquinas (o token de passagem vale 2 min).
- [ ] Prova de ponta a ponta em produção com uma conta real da organização, no computador, num Android e num iPhone.
- [ ] Equipe com acesso ao painel e aos canais de WhatsApp e Instagram.
- [ ] Monitoramento aberto desde 08:00.

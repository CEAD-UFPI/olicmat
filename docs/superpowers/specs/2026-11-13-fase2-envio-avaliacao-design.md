# Fase 2 — Envio por links e avaliação por critérios

**Data:** 13/11/2026 · **Aprovado por:** Comissão Organizadora (via admin)

## Decisões

| Tema | Decisão |
|---|---|
| Acesso | Somente os 182 da relação retificada (12/11/2026), marcados em `Inscricao.fase2Classificado` por script. Sai a regra "nota ≥ 60". |
| Tema | Sorteado **fora** do sistema; único para todos; informado no início. Sai o sorteio no sistema. |
| Início | Botão "Iniciar Fase 2" (ADMIN e COMISSÃO), uma única vez, com confirmação. Auditado (`INICIAR_FASE2`). E-mail a todos os classificados com tema, início e prazo. |
| Prazo | Início + **24 h**, igual para todos, validado pelo relógio do servidor, **sem prorrogação**. |
| Envio | Dois links obrigatórios (`http(s)://`): videoaula (qualquer plataforma; conteúdo é responsabilidade do participante) e portfólio em PDF. Pode corrigir até o prazo; vale o último; histórico guardado em `EnvioFase2`. |
| Avaliadores | 2 por participante, distribuição automática em partes iguais (ordem embaralhada), ≥ 3 avaliadores selecionados. Uma única distribuição, após o prazo. |
| Divergência | Diferença > **20 pontos** → 3º avaliador automático (menor carga, distinto dos dois). Nota = média das duas notas mais próximas (empate: o par de maior média). Sem divergência: média das duas. |
| Ficha | 5 critérios: Domínio do conteúdo (25), Estratégias de ensino (25), Uso de TDICs (20), Reflexão crítica (15), Coerência pedagógica (15). Total automático, parecer, rascunho, conclusão trava a ficha. |
| Controle | Por atribuição: atribuído em, concluído em, horas com o avaliador; alerta > 48 h; remanejamento de pendentes (auditado). |
| Acompanhamento | Painel ADMIN/COMISSÃO: envios (geral e por instituição), tempo restante, e-mails (com reenvio de falhas), situação por participante, carga e tempo por avaliador, exportação CSV. |
| Fora do escopo | Nota final, medalhas, ranking. |

## Implementação

- Regras puras: `apps/admin/api/src/fase2/fase2.regras.ts` (+ spec).
- API: `GET /envio/status`, `POST /envio/links` (ALUNO); `/admin/fase2/*` (ADMIN, COMISSAO); `/avaliador/fase2/*` (AVALIADOR).
- Removidos: sorteio de tema, `FASE2_LIBERADA_EM`, rota `/correcao` (qualquer avaliador dava nota a qualquer envio) e o módulo `admin/avaliacao` não registrado.
- Migração `20261113180000_fase2_envio_avaliacao` (somente acréscimos).
- Telas: `competidor/envio`, `admin/avaliacao` e `comissao/avaliacao` (painel), `avaliador/fase2` (fichas).
- Carga dos classificados: `scripts/importar-classificados-fase2.ts` + `scripts/classificados-fase2-2026.json` (relação pública).

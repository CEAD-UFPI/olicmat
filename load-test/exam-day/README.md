# Teste de carga do dia da prova

`simulate.mjs` percorre o caminho completo do navegador com N participantes;
`verify.sql` confere no banco que nenhuma resposta se perdeu e que as notas batem.

## Réplica local (isolada)

```zsh
docker compose -f docker-compose.yml up -d --build
HASH=$(cd ../../apps/admin/api && node -e "require('bcrypt').hash('Carga@2026!',10).then(console.log)")
docker compose -f docker-compose.yml exec -T postgres psql -U olicmat -d olicmat -v N=567 -v hash="'$HASH'" -f - < seed.sql
LABEL=pico RAMP_S=5 THINK_MS=3000 ./rodada.sh
docker compose -f docker-compose.yml down -v
```

`RAMP_S`: segundos em que todos chegam. `FINAL_RAMP_S`: segundos em que todos finalizam.
`THINK_MS`: leitura por questão. O ritmo real é de cerca de 7 min por questão; 3 s é estresse.
`router.conf` difere de `nginx/router.conf` só no host de provas e em `/api` no host admin.

## Produção

Dados sintéticos numa edição própria (ano 2099): a prova é encontrada pela edição da
inscrição, então os participantes reais não são alcançados. Os usuários de teste aparecem
em listagens e contagens do admin até a limpeza.

1. Backup; janela combinada com o CEAD, pois todo o tráfego sairá de um único IP.
2. Na Máquina 3, com uma senha gerada na hora (`N=600` deixa contas de folga para repartir entre geradores):
   ```zsh
   docker exec -i olicmat-db psql -U olicmat -d olicmat -v N=600 -v hash="'<bcrypt>'" -f - < seed.sql
   ```
3. No gerador (`pip install locust==2.32.4`). `GERADORES` é o total de processos; `--users` é N+2, pois 2 são o painel de suporte:
   ```zsh
   SENHA='...' GERADORES=3 FINALIZAR_EM_S=135 \
   SITE_URL=https://olicmat.cead.ufpi.br ADMIN_URL=https://admin.olicmat.cead.ufpi.br \
   PROVA_URL=https://prova.olicmat.cead.ufpi.br \
   locust -f locustfile.py --processes 3 --users 569 --spawn-rate 10
   ```
   Painel em http://localhost:8089. Suba por etapas: 52, 202 e 569 usuários. O teste para sozinho se os erros passarem de `ABORT_PCT` (2%).
4. Na Máquina 3: `verify.sql` entre as rodadas (`iniciaram` igual aos participantes e demais contadores de falha em 0), `reset.sql` para repetir e `cleanup.sql` ao final.

Sem navegador, o Locust não exercita tela cheia, advertências nem cronômetro: mantenha algumas pessoas fazendo a prova sintética durante a carga.

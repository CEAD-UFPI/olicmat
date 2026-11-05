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
2. Na Máquina 3: `psql -v N=567 -v hash="'<bcrypt>'" -f seed.sql`, com senha gerada na hora.
3. No gerador:
   ```zsh
   SENHA='...' SITE_URL=https://olicmat.cead.ufpi.br ADMIN_URL=https://admin.olicmat.cead.ufpi.br \
   PROVA_URL=https://prova.olicmat.cead.ufpi.br RAMP_S=30 node simulate.mjs
   ```
4. Na Máquina 3: `psql -f verify.sql` e depois `psql -f cleanup.sql`.

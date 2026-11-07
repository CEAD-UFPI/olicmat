#!/usr/bin/env zsh
# Uso: LABEL=x RAMP_S=60 THINK_MS=3000 ./rodada.sh  -> reseta, roda, verifica, amostra CPU/RAM.
cd "${0:A:h}"
pg() { docker compose -f docker-compose.yml exec -T postgres psql -U olicmat -d olicmat "$@"; }
pg -q -f - < reset.sql
stats=results/${LABEL}.stats.csv; : > $stats
( while true; do docker stats --no-stream --format '{{.Name}},{{.CPUPerc}},{{.MemUsage}}' $(docker compose -f docker-compose.yml ps -q) >> $stats; done ) &
sp=$!
node simulate.mjs
kill $sp 2>/dev/null
echo "=== integridade"; pg -x -f - < verify.sql
echo "=== pico de CPU / RAM"
awk -F, '{gsub("%","",$2); split($3,m," "); if($2+0>c[$1]+0)c[$1]=$2; r[$1]=m[1]} END{for(k in c)printf "%-28s cpu_max=%6s%% mem=%s\n",k,c[k],r[k]}' $stats | sort
echo "=== erros nos serviços"
docker compose -f docker-compose.yml logs --since 10m exam-api admin-api exam-web 2>&1 | grep -ciE 'error|timeout|exception'
docker compose -f docker-compose.yml logs --since 10m exam-api admin-api exam-web 2>&1 | grep -iE 'error|timeout' | sed 's/\x1b\[[0-9;]*m//g' | cut -c1-170 | sort | uniq -c | sort -rn | head -8

#!/usr/bin/env zsh
# Sobe a réplica local com a prova real para conferência visual.
# Uso: ./prova-local.sh <importar.sql> | repetir | parar
cd "${0:A:h}"
dc() { docker compose -f docker-compose.yml "$@"; }
pg() { dc exec -T postgres psql -U olicmat -d olicmat "$@"; }
abrir() {
  pg -q -f - < reset.sql
  pg -q -c "UPDATE \"User\" SET \"sessaoConflitoEm\"=NULL,\"sessaoEntradaId\"=NULL WHERE id LIKE 'lt-%'" \
        -c "UPDATE \"Prova\" SET \"janelaInicio\"=now()+interval '2 minutes',\"limiteInicio\"=now()+interval '32 minutes',\"janelaFim\"=now()+interval '3 hours 2 minutes' WHERE id='lt-prova'"
  print "\nO botão libera em 2 minutos.\n"
  print "Participante: http://admin.localhost:18080  |  carga1@carga.olicmat.test  |  Carga@2026!"
  print "             (use carga2, carga3... para outras sessões)"
  print "Suporte:      admin@carga.olicmat.test  |  Carga@2026!"
}
case "$1" in
  parar) dc down -v; exit ;;
  repetir) abrir; exit ;;
  "") print "Uso: ./prova-local.sh <importar.sql> | repetir | parar"; exit 1 ;;
esac
[[ -r "$1" ]] || { print "Arquivo não encontrado: $1"; exit 1 }
dc up -d --build || exit 1
for h in olicmat.cead.ufpi.br prova.olicmat.cead.ufpi.br; do
  for i in {1..60}; do
    [[ $(curl -s -o /dev/null -m 3 -w '%{http_code}' -H "Host: $h" http://127.0.0.1:18080/api/health) == 200 ]] && break
    sleep 3
  done
done
HASH=$(cd ../../apps/admin/api && node -e "require('bcrypt').hash('Carga@2026!',10).then(console.log)")
pg -q -v N=50 -v hash="'$HASH'" -f - < seed.sql
pg -q -c "DELETE FROM \"ProvaQuestao\" WHERE \"provaId\"='lt-prova'" -c "DELETE FROM \"Questao\" WHERE id LIKE 'lt-q-%'"
pg -q -v ON_ERROR_STOP=1 -v prova=lt-prova -f - < "$1"
abrir

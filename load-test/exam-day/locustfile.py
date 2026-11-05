"""
Mesmo percurso de simulate.mjs, com painel ao vivo, botão de parar e vários geradores.

Cada Participante faz a prova uma vez e encerra. Quem confirma que nada se perdeu
é verify.sql: o Locust só enxerga as respostas HTTP.

Produção (use --users N+2: 2 são o Suporte com o painel aberto):
  SENHA='...' SITE_URL=https://olicmat.cead.ufpi.br \
  ADMIN_URL=https://admin.olicmat.cead.ufpi.br PROVA_URL=https://prova.olicmat.cead.ufpi.br \
  locust -f locustfile.py --users 569 --spawn-rate 10

Variáveis: SENHA, FIRST, GERADORES, THINK_MS, RELOAD_PCT, FINALIZAR_EM_S, FINAL_RAMP_S,
           ABORT_PCT, PROVA_ID; BASE para a réplica local (usa cabeçalho Host).
"""
import itertools
import os
import random
import time

import gevent
from locust import FastHttpUser, constant, events, task
from locust.exception import StopUser
from locust.runners import LocalRunner, MasterRunner, WorkerRunner

SENHA = os.environ.get("SENHA", "Carga@2026!")
FIRST = int(os.environ.get("FIRST", "1"))
THINK_MS = int(os.environ.get("THINK_MS", "3000"))
RELOAD_PCT = float(os.environ.get("RELOAD_PCT", "20"))
FINALIZAR_EM_S = float(os.environ.get("FINALIZAR_EM_S", "150"))
FINAL_RAMP_S = float(os.environ.get("FINAL_RAMP_S", "10"))
ABORT_PCT = float(os.environ.get("ABORT_PCT", "2"))
PROVA_ID = os.environ.get("PROVA_ID", "lt-prova")
GERADORES = int(os.environ.get("GERADORES", "1"))  # processos no total, somando as máquinas
QUESTOES = 20

BASE = os.environ.get("BASE", "http://127.0.0.1:18080")


def destino(variavel, host_real):
    """Devolve (url base, cabeçalhos). Na réplica o nginx escolhe o site pelo Host."""
    url = os.environ.get(variavel)
    return (url, {}) if url else (BASE, {"Host": host_real})


SITE = destino("SITE_URL", "olicmat.cead.ufpi.br")
ADMIN = destino("ADMIN_URL", "admin.olicmat.cead.ufpi.br")
PROVA = destino("PROVA_URL", "prova.olicmat.cead.ufpi.br")

sequencia = itertools.count()
inicio_teste = [0.0]


@events.test_start.add_listener
def marcar_inicio(environment, **_):
    inicio_teste[0] = time.time()


@events.init.add_listener
def vigiar_erros(environment, **_):
    """Para sozinho se a taxa de erro passar do limite: isto roda em produção."""
    if isinstance(environment.runner, WorkerRunner):
        return

    def vigia():
        while True:
            gevent.sleep(5)
            total = environment.stats.total
            if total.num_requests >= 200 and total.fail_ratio * 100 > ABORT_PCT:
                print(f"[carga] ABORTADO: {total.fail_ratio:.1%} de erro em {total.num_requests} requisições")
                environment.process_exit_code = 2
                environment.runner.quit()
                return

    gevent.spawn(vigia)


class Base(FastHttpUser):
    abstract = True
    host = BASE
    network_timeout = 30.0
    connection_timeout = 30.0

    def chamar(self, destino_, metodo, caminho, nome, token=None, corpo=None, tentativas=3):
        """Repete como uma pessoa repetiria, mas toda falha entra nas estatísticas."""
        base, cabecalhos = destino_
        cabecalhos = dict(cabecalhos)
        if token:
            cabecalhos["Authorization"] = f"Bearer {token}"
        for tentativa in range(tentativas):
            with self.client.request(
                metodo, base + caminho, name=nome, headers=cabecalhos, json=corpo, catch_response=True
            ) as r:
                if 200 <= (r.status_code or 0) < 300:
                    r.success()
                    return r
                r.failure(f"HTTP {r.status_code}: {(r.text or '')[:120]}")
            if tentativa < tentativas - 1:
                gevent.sleep(random.uniform(1.5, 4.5) * (tentativa + 1))
        return None


class Participante(Base):
    wait_time = constant(0)

    def indice(self):
        """Numeração sem repetição entre geradores: cada um usa uma faixa própria.

        O Locust reparte os usuários quase por igual, não exatamente. Por isso o
        seed cria contas de folga (N=600 para 567 participantes).
        """
        runner = self.environment.runner
        if isinstance(runner, WorkerRunner):
            return FIRST + runner.worker_index + next(sequencia) * GERADORES
        return FIRST + next(sequencia)

    def carregar(self, token):
        self.chamar(PROVA, "POST", "/api/prova/iniciar", "09 POST prova/iniciar", token)
        return self.chamar(PROVA, "GET", "/api/prova/questoes", "10 GET prova/questoes", token)

    @task
    def fazer_prova(self):
        email = f"carga{self.indice()}@carga.olicmat.test"

        self.chamar(ADMIN, "GET", "/login", "01 GET /login (html)", tentativas=1)
        login = self.chamar(SITE, "POST", "/api/auth/login", "02 POST auth/login",
                            corpo={"email": email, "senha": SENHA})
        if not login:
            raise StopUser()
        painel = login.json()["accessToken"]

        self.chamar(SITE, "GET", "/api/users/me", "03 GET users/me", painel, tentativas=1)
        self.chamar(SITE, "GET", "/api/inscricoes/minha", "04 GET inscricoes/minha", painel, tentativas=1)

        passagem = self.chamar(SITE, "POST", "/api/auth/transition-token", "05 POST transition-token", painel)
        if not passagem:
            raise StopUser()
        tt = passagem.json()["transitionToken"]

        self.chamar(PROVA, "GET", f"/auth/claim?token={tt}", "06 GET /auth/claim (html)", tentativas=1)
        claim = self.chamar(PROVA, "POST", "/api/auth/claim", "07 POST auth/claim", corpo={"token": tt})
        if not claim:
            raise StopUser()
        token = claim.json()["accessToken"]

        self.chamar(PROVA, "GET", "/prova", "08 GET /prova (html)", tentativas=1)
        prova = self.carregar(token)
        if not prova:
            raise StopUser()

        questoes = prova.json()["questoes"]
        recarga = random.randrange(QUESTOES) if random.random() * 100 < RELOAD_PCT else -1

        for i, questao in enumerate(questoes):
            gevent.sleep(random.uniform(0.5, 1.5) * THINK_MS / 1000)
            self.chamar(PROVA, "POST", "/api/prova/responder", "11 POST prova/responder", token,
                        {"questaoId": questao["id"], "alternativa": random.choice("ABCDE")})
            if i == recarga:
                self.carregar(token)
            if i % 5 == 0:
                self.chamar(PROVA, "GET", "/api/prova/estado", "11b GET prova/estado", token, tentativas=1)

        self.chamar(PROVA, "GET", "/api/prova/resumo", "12 GET prova/resumo", token, tentativas=1)

        # Todos os cronômetros zeram juntos, então a finalização é por horário.
        espera = inicio_teste[0] + FINALIZAR_EM_S - time.time()
        gevent.sleep(max(0, espera) + random.uniform(0, FINAL_RAMP_S))
        self.chamar(PROVA, "POST", "/api/prova/finalizar", "13 POST prova/finalizar", token,
                    {"motivo": "TEMPO"})
        raise StopUser()


class Suporte(Base):
    """Equipe com o painel de monitoramento aberto (poll de 5s)."""

    fixed_count = 2
    wait_time = constant(5)

    def on_start(self):
        r = self.chamar(SITE, "POST", "/api/auth/login", "A0 admin login",
                        corpo={"email": "admin@carga.olicmat.test", "senha": SENHA})
        self.token = r.json()["accessToken"] if r else None

    @task
    def acompanhar(self):
        if not self.token:
            raise StopUser()
        self.chamar(SITE, "GET", "/api/admin/monitoramento", "A1 GET monitoramento", self.token, tentativas=1)
        self.chamar(SITE, "GET", f"/api/admin/monitoramento/provas/{PROVA_ID}/inscricoes",
                    "A2 GET monitoramento/inscricoes", self.token, tentativas=1)

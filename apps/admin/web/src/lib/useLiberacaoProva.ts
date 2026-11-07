"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Liberacao {
  /** Em milissegundos. Nulo enquanto a prova não estiver publicada. */
  liberadaEm: number | null;
  /** servidor - navegador: o relógio do aparelho não decide nada aqui. */
  offset: number;
}

const horaBrasilia = (ms: number) =>
  new Date(ms).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

const contagem = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  const dias = Math.floor(total / 86400);
  const h = String(Math.floor((total % 86400) / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${dias > 0 ? `${dias}d ` : ""}${h}:${m}:${s}`;
};

/**
 * Libera o botão da prova na hora marcada, sem recarregar a página, usando o
 * horário do servidor. É só a interface: quem decide é o servidor, que recusa o
 * token de entrada antes da hora.
 */
export function useLiberacaoProva() {
  const [liberacao, setLiberacao] = useState<Liberacao | null>(null);
  const [falhou, setFalhou] = useState(false);
  const [, setTique] = useState(0);

  useEffect(() => {
    const consultar = () =>
      api
        .get("/auth/liberacao-prova")
        .then(({ data }) => {
          setFalhou(false);
          setLiberacao({
            liberadaEm: data.liberadaEm ? new Date(data.liberadaEm).getTime() : null,
            offset: new Date(data.agora).getTime() - Date.now(),
          });
        })
        .catch(() => setFalhou(true));

    consultar();
    const atualizar = setInterval(consultar, 60_000);
    const tique = setInterval(() => setTique((t) => t + 1), 1000);
    return () => {
      clearInterval(atualizar);
      clearInterval(tique);
    };
  }, []);

  const agora = Date.now() + (liberacao?.offset ?? 0);
  const liberadaEm = liberacao?.liberadaEm ?? null;
  // Sem resposta, o botão fica ativo e o servidor dá a mensagem certa ao clicar.
  const liberada = (falhou && !liberacao) || (liberadaEm !== null && agora >= liberadaEm);

  let aviso = "Aguardando a publicação da prova";
  if (!liberacao && !falhou) aviso = "Verificando o horário...";
  if (liberadaEm !== null && !liberada) {
    aviso = `Liberada em ${horaBrasilia(liberadaEm)}. Faltam ${contagem(liberadaEm - agora)}`;
  }

  return { liberada, aviso };
}

"use client";

/**
 * Porta de entrada para a Fase 1.
 *
 * A prova NÃO roda aqui: ela é uma aplicação separada (apps/exam), em outra
 * máquina, para que um problema no painel administrativo não interrompa quem
 * está fazendo a prova. Esta tela apenas troca a sessão do painel por um token
 * de passagem de curta duração e encaminha a pessoa.
 *
 * Esta página já conteve uma cópia inteira da interface de prova — cronômetro,
 * navegação entre questões, guarda de tela cheia — que era inalcançável, pois
 * ficava depois de um `return` incondicional. Qualquer correção feita ali nunca
 * chegava ao participante. A cópia foi removida; a interface real vive em
 * apps/exam/web.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ProvaPage() {
  const [erro, setErro] = useState("");
  const [indo, setIndo] = useState(false);

  const irParaProva = async () => {
    setIndo(true);
    setErro("");
    try {
      const { data } = await api.post("/auth/transition-token");
      if (data?.examAppUrl) {
        window.location.href = data.examAppUrl;
        return;
      }
      setErro("A aplicação de prova não respondeu com um endereço válido.");
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setErro(
        typeof msg === "string"
          ? msg
          : "Não foi possível abrir a prova agora. Tente novamente em instantes.",
      );
    } finally {
      setIndo(false);
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto text-center py-16 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="text-6xl font-[family-name:var(--font-fraunces)]"
        style={{ color: "var(--pi-laranja)" }}
      >
        π
      </div>

      <h1 className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
        Prova — Fase 1
      </h1>

      <p className="text-[#9895a4] text-sm leading-relaxed">
        A prova é executada em uma aplicação isolada, separada deste painel,
        para garantir estabilidade durante as 3 horas de realização. Ao
        continuar, você será levado até ela já autenticado — não precisa
        entrar de novo.
      </p>

      <div className="text-left text-sm text-[#9895a4] bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4 space-y-2">
        <p className="text-[#f0ece4] font-medium">Antes de continuar</p>
        <p>A prova exige tela cheia e o cronômetro começa ao iniciar.</p>
        <p>
          Feche outras abas e silencie notificações: sair da tela cheia ou
          trocar de janela gera advertência.
        </p>
        <p>Reserve as 3 horas sem interrupção.</p>
      </div>

      {erro && (
        <p role="alert" className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
          {erro}
        </p>
      )}

      <Button
        size="lg"
        onClick={irParaProva}
        disabled={indo}
        style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
        className="w-full"
      >
        {indo ? "Abrindo a prova..." : "Acessar a aplicação de prova"}
      </Button>
    </motion.div>
  );
}

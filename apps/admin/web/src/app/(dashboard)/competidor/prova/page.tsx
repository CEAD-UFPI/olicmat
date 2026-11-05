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
        para garantir estabilidade durante a realização. Ao continuar, você
        será levado até ela já autenticado — não precisa entrar de novo.
      </p>

      <div className="text-left text-sm text-[#9895a4] bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4 space-y-2">
        <p className="text-[#f0ece4] font-medium">Antes de continuar</p>
        <div className="rounded-lg border border-[#E8B829]/40 bg-[#E8B829]/[0.08] p-3 text-[#f0ece4] space-y-1">
          <p className="font-semibold">Início até 09:00, sem exceção</p>
          <p>
            Depois das 09:00 ninguém inicia a prova, qualquer que seja o motivo,
            inclusive problemas de internet, aparelho ou acesso. Entre no
            sistema a partir de 08:15, para não deixar para a última hora. Quem
            iniciou antes das 09:00 e caiu pode voltar depois das 09:00,
            enquanto a prova estiver aberta. O tempo não para.
          </p>
          <p>
            A prova tem 3 horas, das 08:30 às 11:30 (horário de Brasília), e
            termina às 11:30 para todos. Quem inicia às 09:00 tem até 11:30,
            então tem 2h30.
          </p>
          <p>
            Contam somente as respostas salvas. Questões em branco e
            alternativas marcadas sem salvar não são contabilizadas, e o sistema
            não salva sozinho ao fim do tempo nem no encerramento por 3
            advertências.
          </p>
        </div>
        <p>
          Você pode usar o celular ou o computador, com internet estável e
          bateria carregada ou carregador. No computador, a tela cheia é
          obrigatória; no celular, não há exigência de tela cheia. No celular,
          desative o bloqueio automático de tela.
        </p>
        <p>
          Feche outras abas e silencie notificações. Em qualquer aparelho,
          trocar de aba ou de aplicativo gera advertência; no computador,
          também sair da tela cheia ou tirar o foco da janela. Três
          advertências encerram a prova.
        </p>
        <p>
          No celular, uma ligação recebida conta como saída: ative o modo Não
          Perturbe ou, quando possível, o modo avião com Wi-Fi.
        </p>
        <p>
          É proibido usar o mesmo usuário em dois aparelhos ou navegadores ao
          mesmo tempo. O link de entrada só funciona uma vez: para entrar de
          novo, volte aqui e clique outra vez em “Acessar a aplicação de prova”.
        </p>
        <p>Reserve a manhã até 11:30, sem interrupção.</p>
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

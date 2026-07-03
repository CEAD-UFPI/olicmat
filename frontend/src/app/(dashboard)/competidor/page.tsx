"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { Inscricao } from "@/types";

export default function CompetidorPage() {
  const { user } = useAuthStore();
  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get("/inscricoes/minha")
      .then(({ data }) => setInscricao(data))
      .catch(() => setInscricao(null))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Olá, {user?.nome?.split(" ")[0]}
        </h1>
        <p className="text-[#9895a4] mt-1">Bem-vindo ao seu painel OLICMAT</p>
      </div>

      {!inscricao ? (
        <motion.div
          className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="text-5xl mb-4 font-[family-name:var(--font-fraunces)]" style={{ color: "var(--pi-laranja)" }}>
            π
          </div>
          <h2 className="text-xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
            Você ainda não está inscrito
          </h2>
          <p className="text-sm text-[#9895a4] mb-6 max-w-md mx-auto">
            Inscreva-se na OLICMAT para iniciar sua jornada na competição: resolva a prova online da Fase 1 e produza sua videoaula com portfólio digital na Fase 2.
          </p>
          <Button
            size="lg"
            render={<Link href="/competidor/inscricao" />}
            style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
          >
            Fazer inscrição
          </Button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard
            titulo="Status"
            valor={inscricao.status === "CONFIRMADA" ? "Confirmada" : inscricao.status === "PENDENTE" ? "Pendente" : "Rejeitada"}
            cor={inscricao.status === "CONFIRMADA" ? "var(--integral-verde)" : inscricao.status === "PENDENTE" ? "var(--pi-laranja)" : "#e53e3e"}
            simbolo="∑"
            descricao={inscricao.status === "CONFIRMADA" ? "Sua inscrição foi aprovada" : "Aguardando validação do comprovante"}
          />
          <StatusCard
            titulo="Fase 1"
            valor={inscricao.fase1Nota != null ? `${inscricao.fase1Nota} pts` : "Não iniciada"}
            cor={inscricao.fase1Nota != null ? "var(--integral-verde)" : "var(--sigma-azul)"}
            simbolo="π"
            descricao={inscricao.fase1Nota != null ? "Prova concluída" : "Prova online de múltipla escolha"}
          />
          <StatusCard
            titulo="Fase 2"
            valor={inscricao.notaFinal != null ? `${inscricao.notaFinal} pts` : "Não iniciada"}
            cor={inscricao.notaFinal != null ? "var(--integral-verde)" : "var(--sigma-azul)"}
            simbolo="∫"
            descricao={inscricao.fase2Tema ? `Tema: ${inscricao.fase2Tema}` : "Videoaula e portfólio digital"}
          />
        </div>
      )}

      {inscricao?.status === "CONFIRMADA" && !inscricao.fase1Nota && (
        <motion.div
          className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
                Prova disponível
              </h3>
              <p className="text-sm text-[#9895a4]">30 questões · 3 horas de duração</p>
            </div>
            <Button
              size="lg"
              render={<Link href="/competidor/prova" />}
              style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
            >
              Iniciar prova
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatusCard({
  titulo,
  valor,
  cor,
  simbolo,
  descricao,
}: {
  titulo: string;
  valor: string;
  cor: string;
  simbolo: string;
  descricao: string;
}) {
  return (
    <div className="border border-[#2a2a3a] rounded-2xl p-6 bg-[#12121a] hover:border-[#3a3a4a] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[#9895a4] uppercase tracking-widest">{titulo}</span>
        <span className="text-xl font-[family-name:var(--font-fraunces)]" style={{ color: cor }}>
          {simbolo}
        </span>
      </div>
      <p className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">{valor}</p>
      <p className="text-sm text-[#9895a4] mt-1">{descricao}</p>
    </div>
  );
}

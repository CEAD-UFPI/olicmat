"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { FunilBarras } from "./FunilBarras";
import { RankingInstituicoes } from "./RankingInstituicoes";
import { CardsAcao } from "./CardsAcao";

interface AcompanhamentoDados {
  funil: {
    convidados: number;
    cadastrados: number;
    inscritos: number;
    confirmados: number;
  };
  instituicoes: { id: string; nome: string; sigla: string }[];
  ranking: { id: string; nome: string; alunos: number; inscritos: number }[];
  nivel: "instituicao" | "coordenador";
  coordenadores: { id: string; nome: string }[] | null;
  acoes: {
    convitesExpirados: number;
    cadastradosSemInscricao: number;
    inscricoesPendentes: number;
  };
}

export function AcompanhamentoView({
  basePath,
}: {
  basePath: "admin" | "comissao";
}) {
  const [dados, setDados] = useState<AcompanhamentoDados | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [instituicaoId, setInstituicaoId] = useState("");
  const [coordenadorId, setCoordenadorId] = useState("");

  const carregar = useCallback(() => {
    setCarregando(true);
    const params: Record<string, string> = {};
    if (instituicaoId) params.instituicaoId = instituicaoId;
    if (coordenadorId) params.coordenadorId = coordenadorId;
    api
      .get("/admin/acompanhamento", { params })
      .then(({ data }) => setDados(data))
      .catch(() => setDados(null))
      .finally(() => setCarregando(false));
  }, [instituicaoId, coordenadorId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const selecionarInstituicao = (id: string) => {
    setInstituicaoId(id);
    setCoordenadorId("");
  };

  if (carregando && !dados) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
        <p className="text-[#b0adc0]">
          Não foi possível carregar os dados de acompanhamento.
        </p>
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
          Acompanhamento
        </h1>
        <p className="text-[#9895a4] mt-1">
          Convites, cadastros e inscrições da OLICMAT
        </p>
      </div>

      <CardsAcao acoes={dados.acoes} basePath={basePath} />
      <FunilBarras funil={dados.funil} />
      <RankingInstituicoes
        instituicoes={dados.instituicoes}
        ranking={dados.ranking}
        nivel={dados.nivel}
        coordenadores={dados.coordenadores}
        instituicaoId={instituicaoId}
        coordenadorId={coordenadorId}
        onSelecionarInstituicao={selecionarInstituicao}
        onSelecionarCoordenador={setCoordenadorId}
      />
    </motion.div>
  );
}

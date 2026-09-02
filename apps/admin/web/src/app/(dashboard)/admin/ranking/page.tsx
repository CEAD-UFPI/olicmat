"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, RefreshCw, Upload, Medal } from "lucide-react";

interface ItemRankingPublico {
  inscricaoId: string;
  nome: string;
  estado: string;
  fase1Nota: number;
  fase2Nota: number;
  notaFinal: number;
  medalha: "OURO" | "PRATA" | "BRONZE";
}

type GrupoMedalhas = {
  OURO?: ItemRankingPublico[];
  PRATA?: ItemRankingPublico[];
  BRONZE?: ItemRankingPublico[];
};

type PreviewRanking = Record<string, GrupoMedalhas>;

const MEDALHA_LABEL: Record<string, string> = {
  OURO: "Ouro",
  PRATA: "Prata",
  BRONZE: "Bronze",
};

export default function AdminRankingPage() {
  const [preview, setPreview] = useState<PreviewRanking>({});
  const [carregando, setCarregando] = useState(true);
  const [executando, setExecutando] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregarPreview = useCallback(async () => {
    try {
      const { data } = await api.get("/ranking/preview");
      setPreview(data ?? {});
    } catch {
      setPreview({});
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPreview();
  }, [carregarPreview]);

  const atualizarMedalhas = async () => {
    setExecutando("medalhas");
    setMensagem(null);
    setErro(null);
    try {
      const { data } = await api.post("/ranking/atualizar-medalhas");
      setMensagem(`Medalhas atualizadas para ${data.total ?? 0} inscrições.`);
      await carregarPreview();
    } catch {
      setErro("Falha ao atualizar medalhas.");
    } finally {
      setExecutando(null);
    }
  };

  const publicar = async () => {
    setExecutando("publicar");
    setMensagem(null);
    setErro(null);
    try {
      await api.post("/ranking/publicar");
      setMensagem("Ranking publicado com sucesso.");
      await carregarPreview();
    } catch {
      setErro("Falha ao publicar o ranking.");
    } finally {
      setExecutando(null);
    }
  };

  const resumo = Object.entries(preview).map(([uf, grupo]) => {
    const total = ["OURO", "PRATA", "BRONZE"].reduce(
      (acc, m) => acc + (grupo[m as keyof GrupoMedalhas]?.length ?? 0),
      0,
    );
    return { uf, total };
  });

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Ranking
        </h1>
        <p className="text-[#9895a4] mt-1">
          Calcule as medalhas e publique o resultado para o site.
        </p>
      </div>

      {(mensagem || erro) && (
        <div
          className={`rounded-xl p-4 text-sm border ${
            erro
              ? "bg-[#2a1016] border-[#5c1a24] text-[#f0a0b0]"
              : "bg-[#101d16] border-[#1d4a2c] text-[#9fd9b0]"
          }`}
        >
          {erro ?? mensagem}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#f0ece4] flex items-center gap-2">
              <Medal size={18} className="text-[#E8B829]" />
              Atualizar medalhas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#b0adc0]">
              Calcula a nota final e grava a medalha (Ouro/Prata/Bronze) de cada
              inscrição confirmada na edição atual. Faça isso antes de publicar.
            </p>
            <Button
              onClick={atualizarMedalhas}
              disabled={executando !== null}
              className="w-full"
            >
              <RefreshCw
                size={16}
                className={executando === "medalhas" ? "animate-spin" : ""}
              />
              {executando === "medalhas" ? "Atualizando..." : "Atualizar medalhas"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#2a2a3a] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-[#f0ece4] flex items-center gap-2">
              <Upload size={18} className="text-[#4CAF50]" />
              Publicar ranking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#b0adc0]">
              Gera um snapshot do ranking e o torna visível no site público.
              O site passa a exibir este resultado até a próxima publicação.
            </p>
            <Button
              onClick={publicar}
              disabled={executando !== null}
              className="w-full"
              variant="secondary"
            >
              <Upload size={16} />
              {executando === "publicar" ? "Publicando..." : "Publicar ranking"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#2a2a3a] bg-[#12121a]">
        <CardHeader>
          <CardTitle className="text-[#f0ece4] flex items-center gap-2">
            <Trophy size={18} className="text-[#f59e0b]" />
            Prévia (medalhistas por estado)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : resumo.length === 0 ? (
            <p className="text-sm text-[#b0adc0]">
              Nenhuma inscrição confirmada com nota de Fase 1 na edição atual.
            </p>
          ) : (
            <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {resumo.map(({ uf, total }) => (
                <div
                  key={uf}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a]"
                >
                  <span className="text-sm font-medium text-[#f0ece4]">{uf}</span>
                  <span className="text-sm text-[#b0adc0]">{total} medalhistas</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

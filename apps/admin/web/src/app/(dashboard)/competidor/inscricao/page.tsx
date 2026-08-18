"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const inscricaoSchema = z.object({
  estado: z.string().length(2, "UF deve ter 2 caracteres (ex: SP)"),
  municipio: z.string().optional(),
  instituicao: z.string().min(2, "Instituição é obrigatória"),
  curso: z.string().min(2, "Curso é obrigatório"),
  periodo: z.string().optional(),
});

type InscricaoForm = z.infer<typeof inscricaoSchema>;

const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export default function InscricaoPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [edicoesAbertas, setEdicoesAbertas] = useState<
    { id: string; ano: number; semestre: number; titulo: string }[]
  >([]);
  const [edicaoId, setEdicaoId] = useState("");
  const [carregandoEdicoes, setCarregandoEdicoes] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InscricaoForm>({ resolver: zodResolver(inscricaoSchema) });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/inscricoes/edicoes-abertas");
        const lista = Array.isArray(data) ? data : [];
        setEdicoesAbertas(lista);
        if (lista.length > 1) setEdicaoId(lista[0].id);
      } catch {
        setEdicoesAbertas([]);
      } finally {
        setCarregandoEdicoes(false);
      }
    })();
  }, []);

  const onSubmit = async (data: InscricaoForm) => {
    setLoading(true);
    setError("");
    try {
      let comprovanteUrl: string | undefined;

      if (comprovante) {
        setUploading(true);
        const formData = new FormData();
        formData.append("comprovante", comprovante);
        const { data: uploadData } = await api.post("/inscricoes/comprovante", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        comprovanteUrl = uploadData.url;
        setUploading(false);
      }

      await api.post("/inscricoes", {
        ...data,
        periodo: data.periodo ? parseInt(data.periodo) : undefined,
        edicaoId: edicaoId || undefined,
        comprovanteUrl,
      });
      setSucesso(true);
      setTimeout(() => router.push("/competidor"), 2000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Erro ao realizar inscrição.");
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-6 font-[family-name:var(--font-fraunces)]" style={{ color: "var(--integral-verde)" }}>
          ∫
        </div>
        <h1 className="text-2xl font-bold text-[#f0ece4] mb-2 font-[family-name:var(--font-fraunces)]">
          Inscrição realizada
        </h1>
        <p className="text-[#9895a4]">Redirecionando para o painel...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Inscrição OLICMAT
        </h1>
        <p className="text-[#9895a4] text-sm mt-1">
          Preencha seus dados acadêmicos para participar da olimpíada
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a] space-y-5">
        {carregandoEdicoes ? (
          <p className="text-sm text-[#9895a4]">Carregando edições...</p>
        ) : edicoesAbertas.length === 0 ? (
          <div className="text-sm text-[#FAA307] bg-[#FAA307]/10 border border-[#FAA307]/20 rounded-lg p-3">
            Nenhuma edição aberta para inscrição no momento.
          </div>
        ) : edicoesAbertas.length > 1 ? (
          <div>
            <Label htmlFor="edicao" className="text-[#f0ece4]">Edição</Label>
            <select
              id="edicao"
              value={edicaoId}
              onChange={(e) => setEdicaoId(e.target.value)}
              className="mt-1.5 w-full h-10 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]"
            >
              {edicoesAbertas.map((ed) => (
                <option key={ed.id} value={ed.id}>
                  {ed.ano}.{ed.semestre} — {ed.titulo}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <Label htmlFor="estado" className="text-[#f0ece4]">Estado (UF)</Label>
          <select
            id="estado"
            {...register("estado")}
            className="mt-1.5 w-full h-10 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]"
          >
            <option value="">Selecione...</option>
            {ESTADOS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
          {errors.estado && <p className="text-xs text-red-400 mt-1">{errors.estado.message}</p>}
        </div>

        <div>
          <Label htmlFor="municipio" className="text-[#f0ece4]">Município</Label>
          <Input id="municipio" placeholder="Ex: São Paulo" {...register("municipio")}
            className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50" />
        </div>

        <div>
          <Label htmlFor="instituicao" className="text-[#f0ece4]">Instituição de Ensino</Label>
          <Input id="instituicao" placeholder="Ex: UFRJ, UFMG, IFSP" {...register("instituicao")}
            className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50" />
          {errors.instituicao && <p className="text-xs text-red-400 mt-1">{errors.instituicao.message}</p>}
        </div>

        <div>
          <Label htmlFor="curso" className="text-[#f0ece4]">Curso</Label>
          <Input id="curso" placeholder="Licenciatura em Matemática" {...register("curso")}
            className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50" />
          {errors.curso && <p className="text-xs text-red-400 mt-1">{errors.curso.message}</p>}
        </div>

        <div>
          <Label htmlFor="periodo" className="text-[#f0ece4]">Período/Semestre</Label>
          <Input id="periodo" type="number" min="1" max="12" placeholder="Ex: 5" {...register("periodo")}
            className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50" />
        </div>

        <div>
          <Label htmlFor="comprovante" className="text-[#f0ece4]">Comprovante de Matrícula</Label>
          <div
            onClick={() => fileRef.current?.click()}
            className="mt-1.5 flex items-center gap-3 p-4 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] cursor-pointer hover:border-[#E8B829]/50 transition-colors"
          >
            <Upload className="w-5 h-5 text-[#9895a4]" />
            <span className="text-sm text-[#9895a4]">
              {comprovante ? comprovante.name : "Clique para enviar comprovante (PNG, JPG, PDF)"}
            </span>
          </div>
          <input
            ref={fileRef}
            id="comprovante"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
            onChange={(e) => setComprovante(e.target.files?.[0] || null)}
          />
        </div>

        {error && <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1 border-[#2a2a3a] text-[#f0ece4]"
            render={<div onClick={() => router.push("/competidor")} />}
            onClick={() => router.push("/competidor")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || uploading || carregandoEdicoes || edicoesAbertas.length === 0} className="flex-1"
            style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}>
            {uploading ? "Enviando comprovante..." : loading ? "Enviando..." : "Confirmar inscrição"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

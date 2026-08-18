"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PerfilData {
  id: string;
  nome: string;
  nomeSocial: string | null;
  nomeMae: string | null;
  email: string;
  cpf: string | null;
  role: string;
  telefone: string | null;
  celular: string | null;
  genero: string | null;
  racaCor: string | null;
  documentoIdentificacao: string | null;
  nacionalidade: string | null;
  cep: string | null;
  numero: string | null;
  enderecoCompleto: string | null;
  complemento: string | null;
  bairro: string | null;
  uf: string | null;
  municipio: string | null;
  pontoReferencia: string | null;
  instituicao?: { nome: string; sigla: string } | null;
  curso?: { nome: string } | null;
}

const perfilSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  nomeMae: z.string().optional(),
  nomeSocial: z.string().optional(),
  telefone: z.string().optional(),
  celular: z.string().optional(),
  genero: z.string().optional(),
  racaCor: z.string().optional(),
  nacionalidade: z.string().optional(),
  documentoIdentificacao: z.string().optional(),
  cep: z.string().optional(),
  enderecoCompleto: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
  pontoReferencia: z.string().optional(),
});

type PerfilForm = z.infer<typeof perfilSchema>;

const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const GENEROS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMININO", label: "Feminino" },
  { value: "OUTRO", label: "Outro" },
  { value: "PREFIRO_NAO_INFORMAR", label: "Prefiro não informar" },
];

const RACAS = [
  { value: "BRANCA", label: "Branca" },
  { value: "PRETA", label: "Preta" },
  { value: "PARDA", label: "Parda" },
  { value: "AMARELA", label: "Amarela" },
  { value: "INDIGENA", label: "Indígena" },
  { value: "OUTRO", label: "Outro" },
  { value: "PREFIRO_NAO_INFORMAR", label: "Prefiro não informar" },
];

const roleHome: Record<string, string> = {
  ALUNO: "/competidor",
  COORDENADOR_CURSO: "/coordenador",
  AVALIADOR: "/avaliador",
  ADMIN: "/admin",
  COMISSAO: "/comissao",
};

const orEmpty = (v: string | null | undefined) => v ?? "";

export default function PerfilPage() {
  const router = useRouter();
  const { loadUser } = useAuthStore();
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PerfilForm>({ resolver: zodResolver(perfilSchema) });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<PerfilData>("/users/me");
        setPerfil(data);
        reset({
          nome: data.nome,
          nomeMae: orEmpty(data.nomeMae),
          nomeSocial: orEmpty(data.nomeSocial),
          telefone: orEmpty(data.telefone),
          celular: orEmpty(data.celular),
          genero: orEmpty(data.genero),
          racaCor: orEmpty(data.racaCor),
          nacionalidade: orEmpty(data.nacionalidade),
          documentoIdentificacao: orEmpty(data.documentoIdentificacao),
          cep: orEmpty(data.cep),
          enderecoCompleto: orEmpty(data.enderecoCompleto),
          numero: orEmpty(data.numero),
          complemento: orEmpty(data.complemento),
          bairro: orEmpty(data.bairro),
          municipio: orEmpty(data.municipio),
          uf: orEmpty(data.uf),
          pontoReferencia: orEmpty(data.pontoReferencia),
        });
      } catch {
        setErro("Erro ao carregar seus dados.");
      } finally {
        setCarregando(false);
      }
    })();
  }, [reset]);

  const toNull = (v?: string) => (v && v.trim() !== "" ? v.trim() : null);

  const onSubmit = async (data: PerfilForm) => {
    setSalvando(true);
    setSucesso("");
    setErro("");

    const payload: Record<string, unknown> = {
      nome: data.nome.trim(),
      nomeSocial: toNull(data.nomeSocial),
      nacionalidade: toNull(data.nacionalidade),
      genero: data.genero ? data.genero : null,
      racaCor: data.racaCor ? data.racaCor : null,
      documentoIdentificacao: toNull(data.documentoIdentificacao),
      cep: toNull(data.cep),
      enderecoCompleto: toNull(data.enderecoCompleto),
      numero: toNull(data.numero),
      complemento: toNull(data.complemento),
      bairro: toNull(data.bairro),
      municipio: toNull(data.municipio),
      uf: toNull(data.uf),
      pontoReferencia: toNull(data.pontoReferencia),
    };

    // Campos não-anuláveis no backend: só enviamos quando preenchidos.
    if (data.nomeMae?.trim()) payload.nomeMae = data.nomeMae.trim();
    if (data.telefone?.trim()) payload.telefone = data.telefone.trim();
    if (data.celular?.trim()) payload.celular = data.celular.trim();

    try {
      await api.patch("/users/me", payload);
      await loadUser();
      setSucesso("Perfil atualizado com sucesso.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErro(typeof msg === "string" ? msg : "Erro ao salvar o perfil.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (erro && !perfil) {
    return (
      <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
        <p className="text-[#b0adc0]">{erro}</p>
      </div>
    );
  }

  const isAluno = perfil?.role === "ALUNO";
  const sectionClass = "border border-[#2a2a3a] rounded-2xl bg-[#12121a] p-6 space-y-4";
  const fieldClass = "mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50";
  const selectClass =
    "mt-1.5 w-full h-10 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]";
  const sectionTitle = "flex items-center gap-2 text-sm font-semibold text-[#E8B829] uppercase tracking-widest";

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Meu Perfil
        </h1>
        <p className="text-[#9895a4] mt-1">Atualize seus dados pessoais e de contato</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados Pessoais */}
        <section className={sectionClass}>
          <h2 className={sectionTitle}>
            <UserRound size={16} /> Dados Pessoais
          </h2>
          <div>
            <Label htmlFor="nome" className="text-[#f0ece4]">Nome completo</Label>
            <Input id="nome" {...register("nome")} className={fieldClass} />
            {errors.nome && <p className="text-xs text-red-400 mt-1">{errors.nome.message}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomeMae" className="text-[#f0ece4]">Nome da mãe</Label>
              <Input id="nomeMae" {...register("nomeMae")} className={fieldClass} />
            </div>
            <div>
              <Label htmlFor="nacionalidade" className="text-[#f0ece4]">Nacionalidade</Label>
              <Input id="nacionalidade" {...register("nacionalidade")} className={fieldClass} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone" className="text-[#f0ece4]">Telefone</Label>
              <Input id="telefone" {...register("telefone")} className={fieldClass} placeholder="(00) 0000-0000" />
            </div>
            <div>
              <Label htmlFor="celular" className="text-[#f0ece4]">Celular</Label>
              <Input id="celular" {...register("celular")} className={fieldClass} placeholder="(00) 00000-0000" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genero" className="text-[#f0ece4]">Gênero</Label>
              <select id="genero" {...register("genero")} className={selectClass}>
                <option value="">Selecione...</option>
                {GENEROS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="racaCor" className="text-[#f0ece4]">Raça/Cor</Label>
              <select id="racaCor" {...register("racaCor")} className={selectClass}>
                <option value="">Selecione...</option>
                {RACAS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Nome Social */}
        <section className={sectionClass}>
          <h2 className={sectionTitle}>Nome Social</h2>
          <div>
            <Label htmlFor="nomeSocial" className="text-[#f0ece4]">Nome social (opcional)</Label>
            <Input id="nomeSocial" {...register("nomeSocial")} className={fieldClass} />
          </div>
        </section>

        {/* Documentos */}
        <section className={sectionClass}>
          <h2 className={sectionTitle}>Documentos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documentoIdentificacao" className="text-[#f0ece4]">Documento de identificação (RG)</Label>
              <Input id="documentoIdentificacao" {...register("documentoIdentificacao")} className={fieldClass} />
            </div>
            <div>
              <Label htmlFor="cpf" className="text-[#f0ece4]">CPF</Label>
              <Input id="cpf" value={perfil?.cpf ?? ""} disabled className={fieldClass} />
              <p className="text-xs text-[#9895a4] mt-1">CPF não pode ser alterado</p>
            </div>
          </div>
        </section>

        {/* Endereço */}
        <section className={sectionClass}>
          <h2 className={sectionTitle}>Dados de Endereço</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cep" className="text-[#f0ece4]">CEP</Label>
              <Input id="cep" {...register("cep")} className={fieldClass} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="enderecoCompleto" className="text-[#f0ece4]">Endereço</Label>
              <Input id="enderecoCompleto" {...register("enderecoCompleto")} className={fieldClass} placeholder="Rua, avenida, etc." />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numero" className="text-[#f0ece4]">Número</Label>
              <Input id="numero" {...register("numero")} className={fieldClass} />
            </div>
            <div>
              <Label htmlFor="complemento" className="text-[#f0ece4]">Complemento</Label>
              <Input id="complemento" {...register("complemento")} className={fieldClass} />
            </div>
            <div>
              <Label htmlFor="bairro" className="text-[#f0ece4]">Bairro</Label>
              <Input id="bairro" {...register("bairro")} className={fieldClass} />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="municipio" className="text-[#f0ece4]">Município</Label>
              <Input id="municipio" {...register("municipio")} className={fieldClass} />
            </div>
            <div>
              <Label htmlFor="uf" className="text-[#f0ece4]">UF</Label>
              <select id="uf" {...register("uf")} className={selectClass}>
                <option value="">Selecione...</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="pontoReferencia" className="text-[#f0ece4]">Ponto de referência</Label>
            <Input id="pontoReferencia" {...register("pontoReferencia")} className={fieldClass} />
          </div>
        </section>

        {/* Vínculo (read-only) */}
        <section className={sectionClass}>
          <h2 className={sectionTitle}>Vínculo</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#9895a4] uppercase tracking-widest">Instituição</p>
              <p className="text-[#f0ece4] mt-1">
                {perfil?.instituicao ? `${perfil.instituicao.nome} (${perfil.instituicao.sigla})` : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9895a4] uppercase tracking-widest">Curso</p>
              <p className="text-[#f0ece4] mt-1">{perfil?.curso?.nome ?? "-"}</p>
            </div>
          </div>
          {isAluno && (
            <p className="text-xs text-[#9895a4]">
              Instituição e Curso foram herdados do seu Coordenador e não podem ser alterados.
            </p>
          )}
        </section>

        {sucesso && (
          <p className="text-sm text-[#4CAF50] bg-[#4CAF50]/10 rounded-lg p-3">{sucesso}</p>
        )}
        {erro && <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{erro}</p>}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-[#2a2a3a] text-[#f0ece4]"
            onClick={() => router.push(roleHome[perfil?.role ?? ""] ?? "/competidor")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={salvando}
            className="flex-1"
            style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

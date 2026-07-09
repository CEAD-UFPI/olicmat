"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstituicaoAutocomplete } from "@/components/ui/instituicao-autocomplete";

const generoOptions = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMININO", label: "Feminino" },
  { value: "OUTRO", label: "Outro" },
  { value: "PREFIRO_NAO_INFORMAR", label: "Prefiro não informar" },
];

const racaCorOptions = [
  { value: "BRANCA", label: "Branca" },
  { value: "PRETA", label: "Preta" },
  { value: "PARDA", label: "Parda" },
  { value: "AMARELA", label: "Amarela" },
  { value: "INDIGENA", label: "Indígena" },
  { value: "OUTRO", label: "Outro" },
  { value: "PREFIRO_NAO_INFORMAR", label: "Prefiro não informar" },
];

const tipoBolsaOptions = [
  { value: "PIBIC", label: "PIBIC" },
  { value: "PIBITI", label: "PIBITI" },
  { value: "PIBEX", label: "PIBEX" },
  { value: "PRAEC", label: "PRAEC" },
  { value: "PET", label: "PET" },
  { value: "PROUNI", label: "PROUNI" },
  { value: "FIES", label: "FIES" },
  { value: "OUTRO", label: "Outro" },
];

const step1Schema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  nomeSocial: z.string().optional(),
  email: z.string().email("Email inválido"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos (apenas números)"),
  dataNascimento: z.string().refine((v) => !isNaN(Date.parse(v)), "Data inválida"),
  telefone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
  genero: z.string().min(1, "Selecione uma opção"),
  racaCor: z.string().min(1, "Selecione uma opção"),
  possuiDeficiencia: z.string().optional(),
  cotista: z.string().optional(),
  bolsista: z.string().optional(),
  tipoBolsa: z.string().optional(),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmarSenha: z.string(),
}).refine((d) => d.senha === d.confirmarSenha, {
  message: "Senhas não conferem",
  path: ["confirmarSenha"],
});

const step2Schema = z.object({
  instituicao: z.string().min(2, "Instituição é obrigatória"),
  curso: z.string().min(2, "Curso é obrigatório"),
  matricula: z.string().min(3, "Matrícula é obrigatória"),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;

const FIELD_STYLE = "bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50";
const SELECT_STYLE = "w-full h-10 rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]";

export default function RegistroPage() {
  const router = useRouter();
  const registerFn = useAuthStore((s) => s.register);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);
  const [selectedInstituicao, setSelectedInstituicao] = useState<{ id: string; nome: string; sigla: string } | null>(null);

  const form1 = useForm<Step1Form>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Form>({ resolver: zodResolver(step2Schema) });

  const bolsista = form1.watch("bolsista");

  const onStep1 = (data: Step1Form) => {
    setStep1Data(data);
    setStep(2);
  };

  const onStep2 = async (data: Step2Form) => {
    if (!step1Data) return;
    setLoading(true);
    setError("");
    try {
      await registerFn({
        nome: step1Data.nome,
        nomeSocial: step1Data.nomeSocial || undefined,
        email: step1Data.email,
        cpf: step1Data.cpf,
        senha: step1Data.senha,
        dataNascimento: step1Data.dataNascimento,
        telefone: step1Data.telefone,
        genero: step1Data.genero,
        racaCor: step1Data.racaCor,
        possuiDeficiencia: step1Data.possuiDeficiencia === "true",
        cotista: step1Data.cotista === "true",
        bolsista: step1Data.bolsista === "true",
        tipoBolsa: step1Data.bolsista === "true" ? step1Data.tipoBolsa : undefined,
        instituicao: selectedInstituicao?.sigla || data.instituicao,
        instituicaoId: selectedInstituicao?.id,
        curso: data.curso,
        matricula: data.matricula,
      });
      router.push("/competidor");
    } catch {
      setError("Erro ao criar conta. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  const progress = step === 1 ? 50 : 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 dot-pattern">
      <div className="absolute inset-0 gradient-orb-integral opacity-20" />

      <motion.div
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold font-[family-name:var(--font-fraunces)]">
              <span style={{ color: "var(--pi-laranja)" }}>O</span>
              <span style={{ color: "var(--integral-verde)" }}>L</span>
              <span style={{ color: "var(--sigma-azul)" }}>I</span>
              <span style={{ color: "var(--text-primary)" }}>CMAT</span>
            </span>
          </Link>
        </div>

        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a]/90 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-[#f0ece4] mb-1 font-[family-name:var(--font-fraunces)]">
            Criar conta
          </h1>
          <p className="text-sm text-[#9895a4] mb-6">
            Etapa {step} de 2 — {step === 1 ? "Dados pessoais" : "Dados acadêmicos"}
          </p>

          <div className="h-1 bg-[#2a2a3a] rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, var(--pi-laranja), var(--integral-verde))" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                onSubmit={form1.handleSubmit(onStep1)}
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-1">
                  <p className="text-xs text-[#E8B829] font-medium uppercase tracking-wider">Identificação</p>
                  <div className="h-px bg-[#2a2a3a]" />
                </div>

                <Field label="Nome completo *" id="nome" register={form1.register} error={form1.formState.errors.nome} className={FIELD_STYLE} />
                <Field label="Nome social" id="nomeSocial" register={form1.register} error={form1.formState.errors.nomeSocial} className={FIELD_STYLE} />
                <Field label="Email *" id="email" type="email" register={form1.register} error={form1.formState.errors.email} className={FIELD_STYLE} />
                <Field label="CPF (apenas números) *" id="cpf" register={form1.register} error={form1.formState.errors.cpf} placeholder="00011122233" className={FIELD_STYLE} maxLength={11} />
                <Field label="Data de nascimento *" id="dataNascimento" type="date" register={form1.register} error={form1.formState.errors.dataNascimento} className={FIELD_STYLE} />
                <Field label="Telefone *" id="telefone" register={form1.register} error={form1.formState.errors.telefone} placeholder="11999999999" className={FIELD_STYLE} />

                <div className="space-y-1">
                  <p className="text-xs text-[#E8B829] font-medium uppercase tracking-wider">Informações complementares</p>
                  <div className="h-px bg-[#2a2a3a]" />
                </div>

                <SelectField
                  label="Gênero *"
                  id="genero"
                  register={form1.register}
                  error={form1.formState.errors.genero}
                  options={generoOptions}
                />

                <SelectField
                  label="Raça/Cor *"
                  id="racaCor"
                  register={form1.register}
                  error={form1.formState.errors.racaCor}
                  options={racaCorOptions}
                />

                <SelectField
                  label="Possui deficiência?"
                  id="possuiDeficiencia"
                  register={form1.register}
                  error={form1.formState.errors.possuiDeficiencia}
                  options={[
                    { value: "", label: "Selecione" },
                    { value: "true", label: "Sim" },
                    { value: "false", label: "Não" },
                  ]}
                />

                <SelectField
                  label="Cotista?"
                  id="cotista"
                  register={form1.register}
                  error={form1.formState.errors.cotista}
                  options={[
                    { value: "", label: "Selecione" },
                    { value: "true", label: "Sim" },
                    { value: "false", label: "Não" },
                  ]}
                />

                <SelectField
                  label="Bolsista?"
                  id="bolsista"
                  register={form1.register}
                  error={form1.formState.errors.bolsista}
                  options={[
                    { value: "", label: "Selecione" },
                    { value: "true", label: "Sim" },
                    { value: "false", label: "Não" },
                  ]}
                />

                {bolsista === "true" && (
                  <SelectField
                    label="Tipo de bolsa"
                    id="tipoBolsa"
                    register={form1.register}
                    error={form1.formState.errors.tipoBolsa}
                    options={[{ value: "", label: "Selecione" }, ...tipoBolsaOptions]}
                  />
                )}

                <div className="space-y-1">
                  <p className="text-xs text-[#E8B829] font-medium uppercase tracking-wider">Segurança</p>
                  <div className="h-px bg-[#2a2a3a]" />
                </div>

                <Field label="Senha *" id="senha" type="password" register={form1.register} error={form1.formState.errors.senha} className={FIELD_STYLE} />
                <Field label="Confirmar senha *" id="confirmarSenha" type="password" register={form1.register} error={form1.formState.errors.confirmarSenha} className={FIELD_STYLE} />

                <Button type="submit" className="w-full h-12 text-base font-semibold" style={{ backgroundColor: "var(--pi-laranja)", color: "#fff" }}>
                  Continuar
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                onSubmit={form2.handleSubmit(onStep2)}
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <InstituicaoAutocomplete
                  label="Instituição de Ensino *"
                  value={selectedInstituicao ? `${selectedInstituicao.nome} (${selectedInstituicao.sigla})` : form2.watch("instituicao") || ""}
                  onChange={(_, inst) => {
                    if (inst) {
                      setSelectedInstituicao(inst);
                      form2.setValue("instituicao", inst.sigla);
                    } else {
                      setSelectedInstituicao(null);
                    }
                  }}
                  placeholder="Buscar instituição (ex: UFPI, UFRJ, IFSP)"
                  error={form2.formState.errors.instituicao?.message}
                />
                <Field label="Curso *" id="curso" register={form2.register} error={form2.formState.errors.curso} placeholder="Licenciatura em Matemática" className={FIELD_STYLE} />
                <Field label="Número de Matrícula *" id="matricula" register={form2.register} error={form2.formState.errors.matricula} className={FIELD_STYLE} />

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-[#2a2a3a] text-[#f0ece4]">
                    Voltar
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 h-12 text-base font-semibold" style={{ backgroundColor: "var(--integral-verde)", color: "#fff" }}>
                    {loading ? "Criando..." : "Criar conta"}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-sm text-[#9895a4] text-center mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-[#3AAFE0] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
  register,
  error,
  className,
  maxLength,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: { message?: string };
  className?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-[#f0ece4]">{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        {...register(id)}
        className={`mt-1.5 ${className ?? ""}`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error.message}</p>}
    </div>
  );
}

function SelectField({
  label,
  id,
  register,
  error,
  options,
}: {
  label: string;
  id: string;
  register: UseFormRegister<any>;
  error?: { message?: string };
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-[#f0ece4]">{label}</Label>
      <select
        id={id}
        {...register(id)}
        className="mt-1.5 w-full h-10 rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] text-[#f0ece4] px-3 text-sm focus:outline-none focus:border-[#E8B829]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error.message}</p>}
    </div>
  );
}

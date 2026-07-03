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

const step1Schema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos (apenas números)"),
  dataNascimento: z.string().refine((v) => !isNaN(Date.parse(v)), "Data inválida"),
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

export default function RegistroPage() {
  const router = useRouter();
  const registerFn = useAuthStore((s) => s.register);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);

  const form1 = useForm<Step1Form>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Form>({ resolver: zodResolver(step2Schema) });

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
        email: step1Data.email,
        cpf: step1Data.cpf,
        senha: step1Data.senha,
        dataNascimento: step1Data.dataNascimento,
        instituicao: data.instituicao,
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
        className="relative w-full max-w-md"
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

          {/* Progress bar */}
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
                <Field label="Nome completo" id="nome" register={form1.register} error={form1.formState.errors.nome} />
                <Field label="Email" id="email" type="email" register={form1.register} error={form1.formState.errors.email} />
                <Field label="CPF (apenas números)" id="cpf" register={form1.register} error={form1.formState.errors.cpf} placeholder="00011122233" />
                <Field label="Data de nascimento" id="dataNascimento" type="date" register={form1.register} error={form1.formState.errors.dataNascimento} />
                <Field label="Senha" id="senha" type="password" register={form1.register} error={form1.formState.errors.senha} />
                <Field label="Confirmar senha" id="confirmarSenha" type="password" register={form1.register} error={form1.formState.errors.confirmarSenha} />

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
                <Field label="Instituição de Ensino" id="instituicao" register={form2.register} error={form2.formState.errors.instituicao} placeholder="Ex: UFRJ, UFMG, IFSP" />
                <Field label="Curso" id="curso" register={form2.register} error={form2.formState.errors.curso} placeholder="Licenciatura em Matemática" />
                <Field label="Número de Matrícula" id="matricula" register={form2.register} error={form2.formState.errors.matricula} />

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
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: { message?: string };
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-[#f0ece4]">{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id)}
        className="mt-1.5 bg-[#0a0a0f] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
      />
      {error && <p className="text-xs text-red-400 mt-1">{error.message}</p>}
    </div>
  );
}

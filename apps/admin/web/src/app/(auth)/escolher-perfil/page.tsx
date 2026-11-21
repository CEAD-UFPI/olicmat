"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/types";
import { CheckSquare, ClipboardList, GraduationCap, LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";

const HOME: Record<Role, string> = {
  ALUNO: "/competidor",
  COORDENADOR_CURSO: "/coordenador",
  AVALIADOR: "/avaliador",
  ADMIN: "/admin",
  COMISSAO: "/comissao",
};

const PERFIL: Record<Role, { nome: string; descricao: string; Icone: typeof UserRound }> = {
  COMISSAO: { nome: "Comissão Organizadora", descricao: "Acompanhar inscrições, provas e a Fase 2.", Icone: ShieldCheck },
  AVALIADOR: { nome: "Avaliador(a)", descricao: "Avaliar as videoaulas e os portfólios da Fase 2.", Icone: CheckSquare },
  ADMIN: { nome: "Administrador(a)", descricao: "Configurações e gestão da plataforma.", Icone: LayoutDashboard },
  COORDENADOR_CURSO: { nome: "Coordenação de curso", descricao: "Acompanhar os alunos do seu curso.", Icone: ClipboardList },
  ALUNO: { nome: "Participante", descricao: "Inscrição, provas e envio.", Icone: GraduationCap },
};

/** Conta com mais de um perfil: escolha com qual entrar (pode trocar depois pelo menu). */
export default function EscolherPerfilPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, loadUser, trocarPerfil } = useAuthStore();
  const [enviando, setEnviando] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!user) loadUser();
  }, [user, loadUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) router.replace("/login");
  }, [isLoading, isAuthenticated, user, router]);

  const papeis = (user?.papeis?.length ? user.papeis : user ? [user.role] : []) as Role[];

  const escolher = async (perfil: Role) => {
    setEnviando(perfil);
    setErro("");
    try {
      const u = await trocarPerfil(perfil);
      router.push(HOME[u.role as Role] ?? "/");
    } catch {
      setErro("Não foi possível entrar com este perfil. Tente novamente.");
      setEnviando(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)] text-center">
          Com qual perfil você quer entrar?
        </h1>
        <p className="text-[var(--text-tertiary)] text-center mt-2">
          {user ? <>Olá, {user.nome.split(" ")[0]}. </> : null}Sua conta tem mais de um perfil. Você pode trocar depois pelo menu.
        </p>
        <div className="mt-8 space-y-3">
          {papeis.map((p) => {
            const info = PERFIL[p];
            return (
              <button
                key={p}
                type="button"
                disabled={!!enviando}
                onClick={() => escolher(p)}
                className="w-full flex items-center gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 text-left transition-colors hover:border-[var(--color-gold)] disabled:opacity-60"
              >
                <span className="rounded-xl bg-[var(--color-gold)]/15 p-3"><info.Icone className="text-[var(--color-gold-ink)]" size={24} /></span>
                <span className="flex-1">
                  <span className="block text-lg font-semibold text-[var(--text-primary)]">{info.nome}</span>
                  <span className="block text-sm text-[var(--text-secondary)]">{info.descricao}</span>
                </span>
                {enviando === p && <span className="w-5 h-5 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />}
              </button>
            );
          })}
          {!papeis.length && <div className="flex justify-center"><div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" /></div>}
        </div>
        {erro && <p className="text-sm text-red-400 text-center mt-4">{erro}</p>}
      </div>
    </div>
  );
}

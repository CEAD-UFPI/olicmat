"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Sidebar } from "@/components/layout/Sidebar";
import api from "@/lib/api";
import type { Role } from "@/types";

const roleHome: Record<Role, string> = {
  ALUNO: "/competidor",
  COORDENADOR_CURSO: "/coordenador",
  AVALIADOR: "/avaliador",
  ADMIN: "/admin",
  COMISSAO: "/comissao",
};

const rolePrefixes: Record<Role, string> = {
  ALUNO: "/competidor",
  COORDENADOR_CURSO: "/coordenador",
  AVALIADOR: "/avaliador",
  ADMIN: "/admin",
  COMISSAO: "/comissao",
};

const ROTA_INSCRICAO_OBRIGATORIA = "/competidor/inscricao";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, loadUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [verificandoInscricao, setVerificandoInscricao] = useState(true);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role) {
      const allowedPrefix = rolePrefixes[user.role];
      if (user.role === "ADMIN") return;

      // Perfil é uma rota comum a todos os papéis.
      if (pathname.startsWith("/perfil")) return;

      if (!pathname.startsWith(allowedPrefix)) {
        router.push(roleHome[user.role]);
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  // Quem foi convidado precisa concluir a inscrição na edição vigente antes
  // de acessar qualquer outra parte do painel — o convite já avisa disso, e
  // deixar a pessoa navegar livremente sem inscrição gera "esqueci de me
  // inscrever" perto do fim do prazo.
  useEffect(() => {
    if (isLoading || !isAuthenticated || user?.role !== "ALUNO") {
      setVerificandoInscricao(false);
      return;
    }
    if (pathname.startsWith(ROTA_INSCRICAO_OBRIGATORIA) || pathname.startsWith("/perfil")) {
      setVerificandoInscricao(false);
      return;
    }

    let cancelado = false;
    api
      .get("/inscricoes/minha")
      .then(() => {
        if (!cancelado) setVerificandoInscricao(false);
      })
      .catch(() => {
        if (!cancelado) {
          router.push(ROTA_INSCRICAO_OBRIGATORIA);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading || verificandoInscricao) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#E8B829] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar role={user.role} userName={user.nome} />
      <main className="flex-1 md:ml-64 pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 pb-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}

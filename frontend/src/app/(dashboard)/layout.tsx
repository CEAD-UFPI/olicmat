"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Role } from "@/types";

const roleHome: Record<Role, string> = {
  ALUNO: "/competidor",
  COORDENADOR_CURSO: "/coordenador",
  AVALIADOR: "/avaliador",
  ADMIN: "/admin",
};

const rolePrefixes: Record<Role, string> = {
  ALUNO: "/competidor",
  COORDENADOR_CURSO: "/coordenador",
  AVALIADOR: "/avaliador",
  ADMIN: "/admin",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, loadUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Redirect to role home if on the wrong dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role) {
      const allowedPrefix = rolePrefixes[user.role];
      // Admin can access everything
      if (user.role === "ADMIN") return;

      if (!pathname.startsWith(allowedPrefix)) {
        router.push(roleHome[user.role]);
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#f48120] border-t-transparent rounded-full animate-spin" />
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

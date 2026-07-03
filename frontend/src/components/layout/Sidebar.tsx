"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/types";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Upload,
  Trophy,
  Users,
  BarChart3,
  BookOpen,
  CheckSquare,
  Settings,
  Download,
  ShieldCheck,
  Eye,
  Building2,
  GraduationCap,
  Calendar,
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const roleLinks: Record<Role, NavLink[]> = {
  ALUNO: [
    { href: "/competidor", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
    { href: "/competidor/inscricao", label: "Inscrição", icon: <ClipboardList size={18} /> },
    { href: "/competidor/prova", label: "Prova - Fase 1", icon: <FileText size={18} /> },
    { href: "/competidor/envio", label: "Envio - Fase 2", icon: <Upload size={18} /> },
    { href: "/competidor/resultado", label: "Resultado", icon: <Trophy size={18} /> },
  ],
  COORDENADOR_CURSO: [
    { href: "/coordenador", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
    { href: "/coordenador/alunos", label: "Alunos", icon: <Users size={18} /> },
    { href: "/coordenador/metricas", label: "Métricas", icon: <BarChart3 size={18} /> },
  ],
  AVALIADOR: [
    { href: "/avaliador", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
    { href: "/avaliador/provas", label: "Provas", icon: <BookOpen size={18} /> },
    { href: "/avaliador/fase2", label: "Avaliação Fase 2", icon: <CheckSquare size={18} /> },
  ],
  ADMIN: [
    { href: "/admin", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/instituicoes", label: "Instituições", icon: <Building2 size={18} /> },
    { href: "/admin/cursos", label: "Cursos", icon: <GraduationCap size={18} /> },
    { href: "/admin/edicoes", label: "Edições", icon: <Calendar size={18} /> },
    { href: "/admin/usuarios", label: "Usuários", icon: <Users size={18} /> },
    { href: "/admin/inscricoes", label: "Inscrições", icon: <ClipboardList size={18} /> },
    { href: "/admin/provas", label: "Provas", icon: <BookOpen size={18} /> },
    { href: "/admin/avaliacao", label: "Avaliação", icon: <CheckSquare size={18} /> },
    { href: "/admin/exportar", label: "Exportar", icon: <Download size={18} /> },
    { href: "/admin/auditoria", label: "Auditoria", icon: <ShieldCheck size={18} /> },
  ],
  COMISSAO: [
    { href: "/comissao", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
    { href: "/comissao/inscricoes", label: "Inscrições", icon: <ClipboardList size={18} /> },
    { href: "/comissao/provas", label: "Provas", icon: <BookOpen size={18} /> },
    { href: "/comissao/avaliacao", label: "Avaliação", icon: <CheckSquare size={18} /> },
    { href: "/comissao/exportar", label: "Exportar", icon: <Download size={18} /> },
    { href: "/comissao/auditoria", label: "Auditoria", icon: <ShieldCheck size={18} /> },
  ],
};

const roleLabels: Record<Role, string> = {
  ALUNO: "Competidor",
  COORDENADOR_CURSO: "Coordenador",
  AVALIADOR: "Avaliador",
  ADMIN: "Administrador",
  COMISSAO: "Comissão",
};

interface SidebarProps {
  role: Role;
  userName?: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const links = roleLinks[role] || roleLinks.ALUNO;
  const displayName = userName || user?.nome || "Usuário";

  const isActive = (href: string) => {
    if (href === `/${role.toLowerCase()}` || href === `/comissao`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-16 lg:top-20 bottom-0 w-64 border-r border-[#2a2a3a] bg-[#0a0a0f] hidden md:flex flex-col z-40">
      <div className="p-6 border-b border-[#2a2a3a]">
        <p className="text-xs text-[#9895a4] uppercase tracking-widest mb-1">
          {roleLabels[role] || "Competidor"}
        </p>
        <p className="text-sm font-medium text-[#f0ece4] truncate">{displayName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? "bg-[#E8B829]/10 text-[#E8B829] font-medium"
                  : "text-[#9895a4] hover:text-[#f0ece4] hover:bg-[#12121a]"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2a2a3a]">
        <Link
          href="/"
          className="text-xs text-[#9895a4] hover:text-[#f0ece4] transition-colors block mb-2"
        >
          Voltar ao site
        </Link>
        <button
          onClick={logout}
          className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
        >
          Sair da conta
        </button>
      </div>
    </aside>
  );
}

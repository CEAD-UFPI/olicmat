"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import type { Role } from "@/types";
import {
  LayoutDashboard, ClipboardList, FileText, Upload, Trophy, Users,
  BarChart3, BookOpen, CheckSquare, Download, ShieldCheck,
  Eye, Building2, GraduationCap, Calendar, Settings, Sliders, Activity,
  UserPlus, Bell,
} from "lucide-react";

interface NavLink { href: string; label: string; icon: React.ReactNode; }

/* ── Module 1: Config / Registrations / Results ── */
const configLinks: NavLink[] = [
  { href: "/admin", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/instituicoes", label: "Instituições", icon: <Building2 size={18} /> },
  { href: "/admin/cursos", label: "Cursos", icon: <GraduationCap size={18} /> },
  { href: "/admin/edicoes", label: "Edições", icon: <Calendar size={18} /> },
  { href: "/admin/usuarios", label: "Usuários", icon: <Users size={18} /> },
  { href: "/admin/convidar", label: "Convidar Equipe", icon: <UserPlus size={18} /> },
  { href: "/admin/inscricoes", label: "Inscrições", icon: <ClipboardList size={18} /> },
  { href: "/admin/provas", label: "Provas", icon: <BookOpen size={18} /> },
  { href: "/admin/monitoramento", label: "Monitoramento", icon: <Activity size={18} /> },
  { href: "/admin/exportar", label: "Exportar", icon: <Download size={18} /> },
  { href: "/admin/auditoria", label: "Auditoria", icon: <ShieldCheck size={18} /> },
];

/* ── Module 2: Exam execution ── */
const examLinks: NavLink[] = [
  { href: "/competidor/prova", label: "Prova - Fase 1", icon: <FileText size={18} /> },
];

/* ── Module 3: Correction / Evaluation ── */
const correctionLinks: NavLink[] = [
  { href: "/admin/avaliacao", label: "Avaliação Fase 2", icon: <CheckSquare size={18} /> },
];

interface SidebarProps { role: Role; userName?: string; }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005";

interface NotificacaoItem {
  id: string;
  titulo: string;
  mensagem: string;
  link: string | null;
  lida: boolean;
  createdAt: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const displayName = userName || user?.nome || "Usuário";

  const [notificacoes, setNotificacoes] = useState<NotificacaoItem[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [painelAberto, setPainelAberto] = useState(false);

  useEffect(() => {
    let ativo = true;
    const carregar = () => {
      api
        .get<{ notificacoes: NotificacaoItem[]; naoLidas: number }>("/notificacoes")
        .then(({ data }) => {
          if (!ativo) return;
          setNotificacoes(data.notificacoes);
          setNaoLidas(data.naoLidas);
        })
        .catch(() => undefined);
    };
    carregar();
    const intervalo = setInterval(carregar, 60_000);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, []);

  const marcarComoLida = async (id: string) => {
    await api.patch(`/notificacoes/${id}/lida`).catch(() => undefined);
    setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
    setNaoLidas((prev) => Math.max(0, prev - 1));
  };

  const isActive = (href: string) => pathname.startsWith(href);

  const renderSection = (title: string, links: NavLink[], icon: React.ReactNode) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-4 py-1.5">
        <span className="text-[#E8B829]/60">{icon}</span>
        <span className="text-xs font-semibold text-[#E8B829]/60 uppercase tracking-widest">
          {title}
        </span>
      </div>
      <div className="space-y-0.5">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
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
      </div>
    </div>
  );

  const roleConfigLinks = (): NavLink[] => {
    switch (role) {
      case "ADMIN":
        return configLinks;
      case "AVALIADOR":
        return [
          { href: "/avaliador", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
          { href: "/avaliador/provas", label: "Provas", icon: <BookOpen size={18} /> },
        ];
      case "COORDENADOR_CURSO":
        return [
          { href: "/coordenador", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
          { href: "/coordenador/alunos", label: "Alunos", icon: <Users size={18} /> },
          { href: "/coordenador/convidar", label: "Convidar Alunos", icon: <UserPlus size={18} /> },
          { href: "/coordenador/inscricoes", label: "Inscrições", icon: <ClipboardList size={18} /> },
          { href: "/coordenador/metricas", label: "Métricas", icon: <BarChart3 size={18} /> },
        ];
      case "COMISSAO":
        return [
          { href: "/comissao", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
          { href: "/comissao/instituicoes", label: "Instituições", icon: <Building2 size={18} /> },
          { href: "/comissao/cursos", label: "Cursos", icon: <GraduationCap size={18} /> },
          { href: "/comissao/edicoes", label: "Edições", icon: <Calendar size={18} /> },
          { href: "/comissao/usuarios", label: "Usuários", icon: <Users size={18} /> },
          { href: "/comissao/inscricoes", label: "Inscrições", icon: <ClipboardList size={18} /> },
          { href: "/comissao/provas", label: "Provas", icon: <BookOpen size={18} /> },
          { href: "/comissao/monitoramento", label: "Monitoramento", icon: <Activity size={18} /> },
          { href: "/comissao/exportar", label: "Exportar", icon: <Download size={18} /> },
          { href: "/comissao/auditoria", label: "Auditoria", icon: <ShieldCheck size={18} /> },
        ];
      case "ALUNO":
        return [
          { href: "/competidor", label: "Visão Geral", icon: <LayoutDashboard size={18} /> },
          { href: "/competidor/inscricao", label: "Inscrição", icon: <ClipboardList size={18} /> },
          { href: "/competidor/envio", label: "Envio - Fase 2", icon: <Upload size={18} /> },
          { href: "/competidor/resultado", label: "Resultado", icon: <Trophy size={18} /> },
        ];
      default:
        return [];
    }
  };

  const roleCorrectionLinks = (): NavLink[] => {
    switch (role) {
      case "ADMIN":
        return correctionLinks;
      case "AVALIADOR":
        return [
          { href: "/avaliador/fase2", label: "Avaliação Fase 2", icon: <CheckSquare size={18} /> },
        ];
      case "COMISSAO":
        return [
          { href: "/comissao/avaliacao", label: "Avaliação", icon: <Eye size={18} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <aside className="fixed left-0 top-16 lg:top-20 bottom-0 w-64 border-r border-[#2a2a3a] bg-[#0a0a0f] hidden md:flex flex-col z-40">
      <div className="p-6 border-b border-[#2a2a3a]">
        <p className="text-xs text-[#9895a4] uppercase tracking-widest mb-1">
          {role === "ALUNO" && "Competidor"}
          {role === "COORDENADOR_CURSO" && "Coordenador"}
          {role === "AVALIADOR" && "Avaliador"}
          {role === "ADMIN" && "Administrador"}
          {role === "COMISSAO" && "Comissão"}
        </p>
        <Link href="/perfil" className="group block">
          <p className="text-sm font-medium text-[#f0ece4] truncate group-hover:text-[#E8B829] transition-colors">
            {displayName}
          </p>
          <p className="text-xs text-[#9895a4] group-hover:text-[#E8B829]/70 transition-colors mt-0.5">
            Editar perfil
          </p>
        </Link>
        <div className="relative mt-3">
          <button
            type="button"
            onClick={() => setPainelAberto((v) => !v)}
            className="flex items-center gap-2 text-xs text-[#9895a4] hover:text-[#f0ece4] transition-colors cursor-pointer"
          >
            <Bell size={14} />
            Notificações
            {naoLidas > 0 && (
              <span className="bg-[#E8B829] text-[#0a0a0f] rounded-full text-[10px] font-bold px-1.5 py-0.5">
                {naoLidas}
              </span>
            )}
          </button>
          {painelAberto && (
            <div className="absolute left-0 top-full mt-2 w-72 max-h-80 overflow-y-auto bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl shadow-xl z-50 p-2">
              {notificacoes.length === 0 ? (
                <p className="text-xs text-[#9895a4] p-3">Nenhuma notificação.</p>
              ) : (
                notificacoes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.lida && marcarComoLida(n.id)}
                    className={`p-3 rounded-lg text-xs cursor-pointer mb-1 ${
                      n.lida ? "text-[#9895a4]" : "text-[#f0ece4] bg-[#12121a]"
                    }`}
                  >
                    <p className="font-medium">{n.titulo}</p>
                    <p className="mt-0.5">{n.mensagem}</p>
                    <p className="text-[10px] text-[#9895a4]/70 mt-1">
                      {new Date(n.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Module 1: Config / Registration / Results */}
        {roleConfigLinks().length > 0 && renderSection("Config", roleConfigLinks(), <Settings size={14} />)}

        {/* Module 2: Exam */}
        {role === "ALUNO" && renderSection("Prova", examLinks, <FileText size={14} />)}

        {/* Module 3: Correction */}
        {roleCorrectionLinks().length > 0 && renderSection("Correção", roleCorrectionLinks(), <Sliders size={14} />)}
      </nav>

      <div className="p-4 border-t border-[#2a2a3a]">
        <a href={SITE_URL} className="text-xs text-[#9895a4] hover:text-[#f0ece4] transition-colors block mb-2">
          Voltar ao site
        </a>
        <button onClick={logout} className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer">
          Sair da conta
        </button>
      </div>
    </aside>
  );
}

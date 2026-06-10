"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";

interface Aluno {
  id: string;
  nome: string;
  email: string;
  matricula?: string;
  curso?: string;
  status: string;
}

export default function CoordenadorAlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  useEffect(() => {
    api
      .get("/coordenacao/alunos")
      .then(({ data }) => setAlunos(data))
      .catch(() => setAlunos([]))
      .finally(() => setCarregando(false));
  }, []);

  const filtered = alunos.filter((a) => {
    const matchTexto =
      !filtro ||
      a.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      a.email.toLowerCase().includes(filtro.toLowerCase()) ||
      (a.matricula && a.matricula.includes(filtro));
    const matchStatus = !statusFiltro || a.status === statusFiltro;
    return matchTexto && matchStatus;
  });

  const statusColors: Record<string, string> = {
    CONFIRMADA: "#00d47d",
    PENDENTE: "#f59e0b",
    REJEITADA: "#e53e3e",
  };

  const statusLabels: Record<string, string> = {
    CONFIRMADA: "Confirmada",
    PENDENTE: "Pendente",
    REJEITADA: "Rejeitada",
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Alunos
        </h1>
        <p className="text-[#9895a4] mt-1">Lista de alunos do seu curso</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por nome, email ou matricula..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 min-w-[200px] bg-[#12121a] border-[#2a2a3a] text-[#f0ece4] placeholder:text-[#9895a4]/50"
        />
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="h-10 px-3 rounded-lg bg-[#12121a] border border-[#2a2a3a] text-[#f0ece4] text-sm"
        >
          <option value="">Todos os status</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="PENDENTE">Pendente</option>
          <option value="REJEITADA">Rejeitada</option>
        </select>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#f48120] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#2a2a3a] rounded-2xl p-8 bg-[#12121a] text-center">
          <p className="text-[#9895a4]">Nenhum aluno encontrado.</p>
        </div>
      ) : (
        <div className="border border-[#2a2a3a] rounded-2xl bg-[#12121a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3a] bg-[#0a0a0f]">
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Nome</th>
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Matricula</th>
                  <th className="text-left py-3 px-4 text-[#9895a4] font-medium">Curso</th>
                  <th className="text-center py-3 px-4 text-[#9895a4] font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((aluno) => (
                  <tr key={aluno.id} className="border-b border-[#2a2a3a]/50 hover:bg-[#0a0a0f]/50 transition-colors">
                    <td className="py-3 px-4 text-[#f0ece4] font-medium">{aluno.nome}</td>
                    <td className="py-3 px-4 text-[#9895a4]">{aluno.email}</td>
                    <td className="py-3 px-4 text-[#9895a4]">{aluno.matricula || "-"}</td>
                    <td className="py-3 px-4 text-[#9895a4]">{aluno.curso || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${statusColors[aluno.status] || "#9895a4"}20`,
                          color: statusColors[aluno.status] || "#9895a4",
                        }}
                      >
                        {statusLabels[aluno.status] || aluno.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

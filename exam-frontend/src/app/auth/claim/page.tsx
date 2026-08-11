"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";

const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://olicmat.cead.ufpi.br";

function ClaimTokenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSession } = useAuthStore();
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setErro("Token de transição não fornecido");
      return;
    }

    api
      .post("/auth/claim", { token })
      .then(({ data }) => {
        setSession(data.user, data.accessToken);
        if (data.user.role === "ADMIN" || data.user.role === "COORDENADOR_CURSO") {
          router.push("/admin/monitoring");
        } else {
          router.push("/prova");
        }
      })
      .catch((err) => {
        setErro(err?.response?.data?.message || "Token de transição inválido ou expirado");
      });
  }, [searchParams, router, setSession]);

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="border border-[#e53e3e]/30 bg-[#12121a] rounded-2xl p-8 max-w-md w-full space-y-6">
          <div className="text-5xl text-[#e53e3e]">⚠️</div>
          <h1 className="text-xl font-bold text-[#f0ece4]">Falha de Autenticação</h1>
          <p className="text-sm text-[#9895a4]">{erro}</p>
          <a
            href={`${MAIN_APP_URL}/competidor`}
            className="block w-full py-3 bg-[#E85D04] text-white rounded-xl font-semibold hover:bg-[#d05303]"
          >
            Retornar ao Sistema Principal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
      <div className="w-10 h-10 border-4 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#9895a4] font-medium">Validando token de acesso ao portal de prova...</p>
    </div>
  );
}

export default function ClaimTokenPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#9895a4] font-medium">Carregando portal de prova...</p>
      </div>
    }>
      <ClaimTokenContent />
    </Suspense>
  );
}

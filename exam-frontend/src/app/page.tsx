"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://olicmat.cead.ufpi.br";

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN" || user.role === "COORDENADOR_CURSO") {
        router.push("/admin/monitoring");
      } else {
        router.push("/prova");
      }
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="border border-[#2a2a3a] bg-[#12121a] rounded-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-6xl text-[#E85D04]">π</div>
        <h1 className="text-2xl font-bold text-[#f0ece4]">OLICMAT Exam Portal</h1>
        <p className="text-sm text-[#9895a4] leading-relaxed">
          Esta é a aplicação isolada da prova. Por favor, inicie sua prova através do sistema principal.
        </p>
        <a
          href={`${MAIN_APP_URL}/competidor`}
          className="block w-full py-3 bg-[#E85D04] text-white rounded-xl font-semibold hover:bg-[#d05303] transition-colors"
        >
          Ir para o Sistema Principal
        </a>
      </div>
    </div>
  );
}

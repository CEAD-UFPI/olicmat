import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OLICMAT — Portal de Prova (Fase 1)",
  description: "Ambiente isolado de execução de provas da OLICMAT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0a0a0f] text-[#f0ece4] min-h-screen">
        {children}
      </body>
    </html>
  );
}

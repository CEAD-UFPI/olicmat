import type { Metadata } from "next";
import { Fraunces, Outfit, JetBrains_Mono } from "next/font/google";
import { TEMA_SCRIPT_INICIAL, COR_BARRA_TEMA } from "@/lib/tema";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OLICMAT - Olimpíada para Licenciandos em Matemática",
  description:
    "OLICMAT - A Olimpíada de Licenciandos em Matemática do Brasil. Competição em duas fases com provas, videoaulas e premiação com medalhas.",
  openGraph: {
    title: "OLICMAT - Olimpíada para Licenciandos em Matemática",
    description:
      "A Olimpíada de Licenciandos em Matemática do Brasil. Duas fases de competição com provas e videoaulas.",
    type: "website",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "OLICMAT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content={COR_BARRA_TEMA.light} />
        {/* Aplica o tema salvo (claro por padrão) antes da primeira pintura. */}
        <script dangerouslySetInnerHTML={{ __html: TEMA_SCRIPT_INICIAL }} />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] dot-pattern noise-overlay" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

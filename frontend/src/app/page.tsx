import { Hero } from "@/components/landing/Hero";
import { Sobre } from "@/components/landing/Sobre";
import { Cronograma } from "@/components/landing/Cronograma";
import { Parceiros } from "@/components/landing/Parceiros";

export const metadata = {
  title: "OLICMAT - Olimpíada para Licenciandos em Matemática",
  description:
    "A Olimpíada de Licenciandos em Matemática do Brasil. Duas fases de competição avaliando conhecimento matemático e didático dos licenciandos.",
  openGraph: {
    title: "OLICMAT - Olimpíada para Licenciandos em Matemática",
    description:
      "A Olimpíada de Licenciandos em Matemática do Brasil. Duas fases de competição com provas e videoaulas.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Sobre />
      <Cronograma />
      <Parceiros />
    </main>
  );
}

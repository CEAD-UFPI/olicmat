import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ban, UserX, Clock } from "lucide-react";

interface AcoesDados {
  convitesExpirados: number;
  cadastradosSemInscricao: number;
  inscricoesPendentes: number;
}

export function CardsAcao({
  acoes,
  basePath,
}: {
  acoes: AcoesDados;
  basePath: "admin" | "comissao";
}) {
  const cards = [
    {
      label: "Convites expirados",
      valor: acoes.convitesExpirados,
      icon: Ban,
      cor: "#e57373",
      href: basePath === "admin" ? "/admin/convidar?status=expirado" : null,
    },
    {
      label: "Cadastrados sem inscrição",
      valor: acoes.cadastradosSemInscricao,
      icon: UserX,
      cor: "#E8B829",
      href: `/${basePath}/usuarios`,
    },
    {
      label: "Inscrições pendentes",
      valor: acoes.inscricoesPendentes,
      icon: Clock,
      cor: "#f59e0b",
      href: `/${basePath}/inscricoes`,
    },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {cards.map((c) => {
        const conteudo = (
          <Card
            className={`border-[#2a2a3a] bg-[#12121a] transition-colors ${
              c.href ? "hover:border-[#3a3a4a] cursor-pointer" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-[#b0adc0] text-sm uppercase tracking-widest flex items-center gap-2">
                <c.icon size={18} style={{ color: c.cor }} />
                {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-3xl font-bold font-[family-name:var(--font-fraunces)]"
                style={{ color: c.cor }}
              >
                {c.valor}
              </p>
            </CardContent>
          </Card>
        );
        return c.href ? (
          <Link key={c.label} href={c.href}>
            {conteudo}
          </Link>
        ) : (
          <div key={c.label}>{conteudo}</div>
        );
      })}
    </div>
  );
}

import Link from "next/link";

const footerSections = [
  {
    title: "OLICMAT",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Regulamento", href: "/regulamento" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#2a2a3a] bg-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold font-[family-name:var(--font-fraunces)] mb-4">
              <span style={{ color: "var(--pi-laranja)" }}>O</span>
              <span style={{ color: "var(--integral-verde)" }}>L</span>
              <span style={{ color: "var(--sigma-azul)" }}>I</span>
              <span style={{ color: "var(--text-primary)" }}>CMAT</span>
            </h3>
            <p className="text-sm text-[#9895a4] max-w-xs leading-relaxed">
              Fortalecendo a formação docente em matemática no Brasil
            </p>
          </div>

          {footerSections.map((s) => (
            <div key={s.title}>
              <h4 className="text-sm font-semibold text-[#f0ece4] mb-3">{s.title}</h4>
              <ul className="space-y-2">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[#9895a4] hover:text-[#f0ece4] transition-colors duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a2a3a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9895a4]">
            &copy; {new Date().getFullYear()} OLICMAT. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-[#9895a4] hover:text-[#f0ece4] transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-xs text-[#9895a4] hover:text-[#f0ece4] transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

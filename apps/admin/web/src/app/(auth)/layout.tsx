import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BotaoPaginaInicial } from "@/components/layout/TopBar";

/** Telas de acesso (login, cadastro...): atalhos para o site e o tema no topo. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <BotaoPaginaInicial comRotulo />
        <ThemeToggle comRotulo />
      </div>
      {children}
    </>
  );
}

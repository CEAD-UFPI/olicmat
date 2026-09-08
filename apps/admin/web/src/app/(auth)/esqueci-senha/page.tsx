import { redirect } from "next/navigation";

/**
 * Existiam duas telas de recuperação de senha — esta e /recuperar-senha —
 * fazendo a mesma chamada com textos diferentes: só a outra informava que o
 * link expira em 2 horas, e é para ela que o link "Esqueci minha senha" do
 * login aponta. Mantida aqui apenas a rota, redirecionando, porque o endereço
 * pode ter sido guardado ou compartilhado.
 */
export default function EsqueciSenhaPage() {
  redirect("/recuperar-senha");
}

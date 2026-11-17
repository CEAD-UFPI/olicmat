/**
 * Endereço do site público (landing). Em produção o build do admin-web não
 * recebe NEXT_PUBLIC_SITE_URL, então o padrão é o domínio oficial.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://olicmat.cead.ufpi.br";

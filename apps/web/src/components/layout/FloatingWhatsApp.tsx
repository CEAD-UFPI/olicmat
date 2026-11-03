import { WhatsAppIcon } from "@/components/icons";
import { WHATSAPP_URL } from "@/lib/suporte";

export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Suporte no WhatsApp"
      title="Suporte no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3.5 text-white shadow-xl shadow-black/40 transition-transform duration-300 hover:scale-105 focus-visible:scale-105"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden sm:inline text-sm font-semibold">Suporte</span>
    </a>
  );
}

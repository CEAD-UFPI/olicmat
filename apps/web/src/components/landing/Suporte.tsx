"use client";

import { motion } from "framer-motion";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_NUMERO_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/suporte";

export function Suporte() {
  return (
    <section id="suporte" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 gradient-orb-integral opacity-30" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-fraunces)] text-[#f0ece4] mb-4">
            Suporte ao Participante
          </h2>
          <p className="text-[#9895a4] max-w-2xl mx-auto text-lg">
            Estamos à disposição para tirar suas dúvidas em todas as etapas da olimpíada
          </p>
        </motion.div>

        {/* Aviso do dia da prova */}
        <motion.div
          className="mb-10 rounded-2xl border border-[#E8B829]/40 bg-[#E8B829]/10 px-6 py-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-base lg:text-lg text-[#f0ece4] leading-relaxed">
            <span className="font-bold text-[#E8B829]">
              No dia da prova, nossa equipe fica online
            </span>{" "}
            para sanar dúvidas e ajudar todos os participantes.
          </p>
        </motion.div>

        {/* Canais de atendimento */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl border border-[#2a2a3a] bg-[#12121a]/80 p-8 lg:p-10 backdrop-blur-sm hover:bg-[#1a1a26] hover:border-[#3a3a4a] transition-colors duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{
                  background:
                    "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                }}
              >
                <InstagramIcon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
                  Instagram
                </h3>
                <p className="text-sm text-[#9895a4]">{INSTAGRAM_HANDLE}</p>
              </div>
            </div>
            <p className="text-sm text-[#b0adc0] leading-relaxed mb-6">
              Envie uma mensagem direta (DM) e nossa equipe responde.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8B829] group-hover:underline">
              Chamar no Instagram →
            </span>
          </motion.a>

          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl border border-[#2a2a3a] bg-[#12121a]/80 p-8 lg:p-10 backdrop-blur-sm hover:bg-[#1a1a26] hover:border-[#3a3a4a] transition-colors duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white">
                <WhatsAppIcon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
                  WhatsApp
                </h3>
                <p className="text-sm text-[#9895a4]">{WHATSAPP_NUMERO_DISPLAY}</p>
              </div>
            </div>
            <p className="text-sm text-[#b0adc0] leading-relaxed mb-6">
              Atendimento rápido e direto por mensagem.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#25D366] group-hover:underline">
              Chamar no WhatsApp →
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

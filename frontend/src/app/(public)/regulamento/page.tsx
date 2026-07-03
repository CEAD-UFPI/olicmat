"use client";

import { motion } from "framer-motion";

export default function RegulamentoPage() {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Regulamento — 1ª OLICMAT (Ensino Superior)
        </h1>
        <p className="text-[#9895a4] mt-2">
          Regras oficiais da Olimpíada para Licenciandos em Matemática
        </p>
      </div>

      <div className="space-y-8">
        <Section
          title="1. Da Participação"
          content={[
            "A 1ª OLICMAT — Ensino Superior é destinada a estudantes regularmente matriculados em cursos de Licenciatura em Matemática em instituições de ensino superior brasileiras.",
            "A participação é individual e gratuita.",
            "O competidor deve realizar sua inscrição no período estabelecido, informando corretamente seus dados pessoais e acadêmicos.",
            "A inscrição será validada mediante conferência do comprovante de matrícula.",
            "Cada competidor poderá participar de apenas uma edição por ano.",
          ]}
        />

        <Section
          title="2. Das Fases"
          content={[
            "Fase I — Primeiro Teste (Avaliação do conhecimento matemático pedagógico): consiste em uma prova de múltipla escolha com questões de conteúdo matemático e raciocínio lógico, realizada em plataforma digital. O competidor dispõe de até 3 horas para conclusão. A Fase I será aplicada presencialmente nas instituições participantes, conforme o cronograma oficial.",
            "Fase II — Desafio Didático-Tecnológico: os competidores aprovados na Fase I receberão um tema gerador e deverão produzir uma videoaula de até 20 minutos, acompanhada de um portfólio digital em PDF detalhando o planejamento didático. O envio do link da videoaula e do portfólio ocorre no mesmo dia do desafio.",
            "O tema gerador é sorteado individualmente no painel do competidor após a aprovação na Fase I.",
            "Os prazos de cada fase serão divulgados no Cronograma Oficial.",
          ]}
        />

        <Section
          title="3. Da Avaliação"
          content={[
            "Fase I: cada questão possui valor uniforme. A nota da Fase I corresponde ao total de acertos. É exigido aproveitamento mínimo de 60% para aprovação à Fase II.",
            "Fase II: a videoaula será avaliada por banca especializada com base nos critérios de: clareza conceitual, estratégia didática, domínio do conteúdo, uso de recursos visuais e adequação ao tempo.",
            "A nota final é composta pela média ponderada: 40% da Fase I e 60% da Fase II.",
            "Casos de plágio, cópia ou conduta imprópria resultarão em desclassificação imediata.",
          ]}
        />

        <Section
          title="4. Da Premiação"
          content={[
            "Serão premiados com medalhas de Ouro, Prata e Bronze os competidores com melhor desempenho final, conforme classificação por estado.",
            "A distribuição de medalhas seguirá a proporção: até 5% Ouro, até 10% Prata e até 15% Bronze do total de competidores de cada estado.",
            "Todos os participantes que concluírem a Fase II receberão certificado digital de participação.",
            "Os medalhistas receberão certificado especial e menção honrosa.",
            "A cerimônia de premiação e encerramento será realizada em 03/11/2026, em data e local divulgados no site oficial.",
            "No segundo semestre de 2027, será realizada a missão de imersão profissional e a participação na formação oferecida pela SBM no Rio de Janeiro, seguidas de workshops de disseminação.",
          ]}
        />

        <Section
          title="5. Disposições Gerais"
          content={[
            "A Comissão Organizadora é responsável pela elaboração das provas, definição dos temas e coordenação geral do evento.",
            "Dúvidas e recursos deverão ser encaminhados via formulário de contato disponível na plataforma.",
            "Casos omissos serão resolvidos pela Comissão Organizadora, cuja decisão é soberana.",
            "Ao se inscrever, o participante concorda integralmente com este regulamento.",
          ]}
        />
      </div>
    </motion.div>
  );
}

function Section({ title, content }: { title: string; content: string[] }) {
  return (
    <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
      <h2 className="text-xl font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
        {title}
      </h2>
      <ul className="space-y-3">
        {content.map((item, i) => (
          <li key={i} className="text-sm text-[#9895a4] leading-relaxed flex gap-3">
            <span className="text-[#E8B829] mt-1 shrink-0">&#x25CF;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

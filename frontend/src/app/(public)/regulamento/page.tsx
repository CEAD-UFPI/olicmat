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
          Regulamento OLICMAT
        </h1>
        <p className="text-[#9895a4] mt-2">
          Regras oficiais da Olimpiada para Licenciandos em Matematica
        </p>
      </div>

      <div className="space-y-8">
        <Section
          title="1. Da Participacao"
          content={[
            "A OLICMAT e destinada a estudantes regularmente matriculados em cursos de Licenciatura em Matematica em instituicoes de ensino superior brasileiras.",
            "A participacao e individual e gratuita.",
            "O competidor deve realizar sua inscricao no periodo estabelecido, informando corretamente seus dados pessoais e academicos.",
            "A inscricao sera validada mediante conferencia do comprovante de matricula.",
            "Cada competidor podera participar de apenas uma edicao por ano.",
          ]}
        />

        <Section
          title="2. Das Fases"
          content={[
            "Fase 1 — Prova Online: consiste em uma prova de multipla escolha com questoes de conteudo matematico e raciocinio logico, realizada em plataforma digital. O competidor dispoe de ate 3 horas para conclusao.",
            "Fase 2 — Videoaula e Portfolio: os competidores aprovados na Fase 1 receberao um tema gerador e deverao produzir uma videoaula de ate 20 minutos, acompanhada de um portfolio digital em PDF detalhando o planejamento didatico.",
            "O tema gerador e sorteado individualmente no painel do competidor apos a aprovacao na Fase 1.",
            "Os prazos de cada fase serao divulgados no Cronograma Oficial.",
          ]}
        />

        <Section
          title="3. Da Avaliacao"
          content={[
            "Fase 1: cada questao possui valor uniforme. A nota da Fase 1 corresponde ao total de acertos.",
            "Fase 2: a videoaula sera avaliada por banca especializada com base nos criterios de: clareza conceitual, estrategia didatica, dominio do conteudo, uso de recursos visuais e adequacao ao tempo.",
            "A nota final e composta pela media ponderada: 40% da Fase 1 e 60% da Fase 2.",
            "Casos de plágio, copia ou conduta impropria resultarao em desclassificacao imediata.",
          ]}
        />

        <Section
          title="4. Da Premiacao"
          content={[
            "Serao premiados com medalhas de Ouro, Prata e Bronze os competidores com melhor desempenho final, conforme classificacao por estado.",
            "A distribuicao de medalhas seguira a proporcao: ate 5% Ouro, ate 10% Prata e ate 15% Bronze do total de competidores de cada estado.",
            "Todos os participantes que concluirem a Fase 2 receberao certificado digital de participacao.",
            "Os medalhistas receberao certificado especial e mencao honrosa.",
            "A cerimonia de premiacao sera realizada em data e local divulgados no site oficial.",
          ]}
        />

        <Section
          title="5. Disposicoes Gerais"
          content={[
            "A Comissao Organizadora e responsavel pela elaboracao das provas, definicao dos temas e coordenacao geral do evento.",
            "Duvidas e recursos deverao ser encaminhados via formulario de contato disponivel na plataforma.",
            "Casos omissos serao resolvidos pela Comissao Organizadora, cuja decisao e soberana.",
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
            <span className="text-[#00d47d] mt-1 shrink-0">&#x25CF;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

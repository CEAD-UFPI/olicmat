"use client";

import { motion } from "framer-motion";

export default function SobrePage() {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-3xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          Sobre a OLICMAT
        </h1>
        <p className="text-[#9895a4] mt-2">
          Olimpiada para Licenciandos em Matematica
        </p>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <h2 className="text-xl font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Nossa Missao
        </h2>
        <p className="text-sm text-[#9895a4] leading-relaxed">
          A OLICMAT nasce do reconhecimento de que a formacao docente em Matematica
          e um dos pilares fundamentais para a educacao brasileira. Nossa missao e
          valorizar, desafiar e celebrar os futuros professores de Matematica do
          Brasil, oferecendo uma plataforma onde o conhecimento matematico e a
          habilidade didatica caminham juntos.
        </p>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <h2 className="text-xl font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          O que e a OLICMAT?
        </h2>
        <p className="text-sm text-[#9895a4] leading-relaxed mb-4">
          A Olimpiada de Licenciandos em Matematica (OLICMAT) e uma competicao
          nacional voltada exclusivamente para estudantes de cursos de Licenciatura
          em Matematica. Diferente das olimpiadas tradicionais, a OLICMAT avalia
          nao apenas o dominio do conteudo matematico, mas tambem a capacidade
          didatica do futuro professor.
        </p>
        <p className="text-sm text-[#9895a4] leading-relaxed">
          A competicao e estruturada em duas fases: a primeira consiste em uma
          prova online de multipla escolha com questoes de matematica e logica;
          a segunda desafia o competidor a produzir uma videoaula e um portfolio
          digital a partir de um tema gerador sorteado individualmente.
        </p>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <h2 className="text-xl font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Nossa Historia
        </h2>
        <p className="text-sm text-[#9895a4] leading-relaxed mb-4">
          A OLICMAT foi idealizada por professores universitarios de Matematica
          que identificaram a necessidade de um espaco que aliasse a excelencia
          matematica a formacao pedagogica. A primeira edicao foi lancada com o
          objetivo de criar uma comunidade nacional de licenciandos engajados
          com a qualidade do ensino de Matematica no Brasil.
        </p>
        <p className="text-sm text-[#9895a4] leading-relaxed">
          Desde entao, a olimpiada cresceu em participacao e relevancia,
          tornando-se uma referencia na formacao de professores de Matematica.
          A cada edicao, centenas de licenciandos de todas as regioes do pais
          participam, demonstrando que o ensino de qualidade e um valor
          compartilhado por toda a comunidade academica.
        </p>
      </div>

      <div className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
        <h2 className="text-xl font-bold text-[#f0ece4] mb-4 font-[family-name:var(--font-fraunces)]">
          Diferenciais
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a]">
            <h3 className="text-sm font-semibold text-[#f0ece4] mb-2">
              Dupla Competencia
            </h3>
            <p className="text-xs text-[#9895a4] leading-relaxed">
              Avaliamos o conhecimento matematico e a habilidade didatica em uma
              unica competicao.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a]">
            <h3 className="text-sm font-semibold text-[#f0ece4] mb-2">
              Abrangencia Nacional
            </h3>
            <p className="text-xs text-[#9895a4] leading-relaxed">
              Participantes de todos os estados brasileiros competindo e
              compartilhando conhecimento.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a]">
            <h3 className="text-sm font-semibold text-[#f0ece4] mb-2">
              Premiacao por Estado
            </h3>
            <p className="text-xs text-[#9895a4] leading-relaxed">
              Medalhas de Ouro, Prata e Bronze distribuidas conforme o
              desempenho em cada unidade federativa.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a]">
            <h3 className="text-sm font-semibold text-[#f0ece4] mb-2">
              Plataforma Digital
            </h3>
            <p className="text-xs text-[#9895a4] leading-relaxed">
              Todo o processo, da inscricao a premiacao, realizado em plataforma
              online acessivel e segura.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

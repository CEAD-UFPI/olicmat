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
        <p className="text-xs tracking-[0.18em] uppercase text-[#E8B829] font-medium">
          Regulamento Oficial
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#f0ece4] mt-3 font-[family-name:var(--font-fraunces)]">
          1ª Olimpíada de Licenciandos em Matemática
        </h1>
        <p className="text-[#9895a4] mt-3 leading-relaxed">
          OLICMAT 2026 — Universidade Federal do Piauí, por meio do Centro de
          Educação Aberta e a Distância (CEAD), em parceria com IFPI, UESPI e
          UFDPar.
        </p>
      </div>

      <Section n="1" title="Apresentação e Objetivos">
        <P>
          A 1ª Olimpíada de Licenciandos em Matemática (OLICMAT) é uma
          iniciativa promovida pela Universidade Federal do Piauí (UFPI), por
          meio do Centro de Educação Aberta e a Distância (CEAD), em parceria
          com o Instituto Federal do Piauí (IFPI), a Universidade Estadual do
          Piauí (UESPI) e a Universidade Federal do Delta do Parnaíba (UFDPar).
        </P>
        <P>
          A OLICMAT integra um conjunto amplo de ações formativas, que inclui
          ainda a Formação Pedagógica em Conteúdos e Conceitos Básicos da
          Matemática (FORPEMAT) e o Congresso Nacional de Ensino de Matemática
          com Práticas Exitosas (CONGEMAT).
        </P>
        <P>
          Em sua edição piloto, a OLICMAT possui abrangência estadual no Piauí e
          visa valorizar a formação de professores de Matemática, estimulando o
          domínio do conteúdo acadêmico e a inovação pedagógica na Educação
          Básica.
        </P>
      </Section>

      <Section n="2" title="Público-Alvo e Requisitos de Participação">
        <P>
          A participação na OLICMAT é <Strong>individual e totalmente
          gratuita</Strong>. Podem se inscrever os estudantes que preencherem
          cumulativamente os seguintes requisitos:
        </P>
        <Bullets
          items={[
            "Estar regularmente matriculado em curso de Licenciatura em Matemática em uma das instituições participantes (UFPI, UESPI, IFPI ou UFDPar);",
            "Ter os dados indicados ou validados pela coordenação do seu curso;",
            "Possuir CPF, e-mail ativo e acesso a computador ou dispositivo com conexão à internet;",
            "Aceitar integralmente este Regulamento, os Termos de Uso do site e o tratamento de dados pessoais conforme a LGPD;",
            "Manter conduta alinhada à integridade acadêmica, sem fraude ou plágio.",
          ]}
        />
      </Section>

      <Section n="3" title="Inscrições">
        <SubTitle>3.1. Procedimento</SubTitle>
        <Bullets
          items={[
            "Cadastro institucional: a coordenação do curso de Licenciatura realiza a indicação inicial dos estudantes, cadastrando a lista oficial na plataforma.",
            "Validação do estudante: o estudante acessa a plataforma, completa seus dados cadastrais e confirma a inscrição dentro do prazo do cronograma.",
            "Efetivação: a inscrição só será considerada válida após a emissão do comprovante de confirmação emitido pelo sistema.",
          ]}
        />
        <SubTitle>3.2. Prazos</SubTitle>
        <Bullets
          items={[
            "Período de inscrições: 01/09/2026 a 25/09/2026.",
            "Divulgação das inscrições validadas: 05/10/2026.",
          ]}
        />
      </Section>

      <Section n="4" title="Estrutura e Fases">
        <P>A OLICMAT é composta por duas fases virtuais.</P>

        <div className="grid gap-4 sm:grid-cols-2 my-6">
          <PhaseCard
            phase="Fase 1"
            name="Avaliação de Conhecimentos"
            detail="20 questões objetivas"
            points="100 pontos"
            kind="Eliminatória e classificatória"
          />
          <PhaseCard
            phase="Fase 2"
            name="Desafio Didático-Tecnológico"
            detail="Videoaula + portfólio"
            points="100 pontos"
            kind="Classificatória final"
          />
        </div>

        <SubTitle>Fase 1 — Avaliação de Conhecimentos</SubTitle>
        <Bullets
          items={[
            "Formato: prova on-line composta por 20 (vinte) questões objetivas, valendo 100 pontos no total.",
            "Data: 24/10/2026.",
            "Conteúdo avaliado: conhecimentos matemáticos e saberes didático-pedagógicos para a Educação Básica, baseados na BNCC e na Matriz do Inep (Portaria nº 330/2025).",
            "Classificação para a Fase 2: serão classificados até 50% dos participantes de cada instituição que realizarem a prova, em ordem decrescente de nota.",
          ]}
        />

        <SubTitle>Eixos temáticos avaliados</SubTitle>
        <ol className="space-y-3 mt-2">
          {EIXOS.map((eixo, i) => (
            <li key={eixo.titulo} className="flex gap-4">
              <span className="text-[#E8B829] font-[family-name:var(--font-jetbrains-mono)] text-sm shrink-0 mt-0.5 tabular-nums">
                {romanize(i + 1)}
              </span>
              <span className="text-sm text-[#9895a4] leading-relaxed">
                <span className="text-[#f0ece4] font-medium">
                  {eixo.titulo}:
                </span>{" "}
                {eixo.descricao}
              </span>
            </li>
          ))}
        </ol>

        <SubTitle>Fase 2 — Desafio Didático-Tecnológico</SubTitle>
        <Bullets
          items={[
            "Período de realização: 18/11/2026 a 20/11/2026.",
            "Formato: elaboração de uma proposta prática de ensino a partir de um tema sorteado pela Comissão.",
            "Duração: após o sorteio do tema, o estudante terá até 6 (seis) horas para enviar os materiais na plataforma.",
          ]}
        />

        <SubTitle>Materiais obrigatórios</SubTitle>
        <div className="space-y-4 mt-2">
          <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-5">
            <p className="text-[#f0ece4] font-medium text-sm">
              Videoaula autoral
            </p>
            <ul className="mt-3 space-y-2">
              {[
                'Gravada e postada no YouTube como "Não listado".',
                "Título no padrão: Nome do Participante - Tema da Videoaula.",
                "Deve apresentar o conteúdo, a situação-problema e as estratégias pedagógicas.",
              ].map((t) => (
                <li
                  key={t}
                  className="text-sm text-[#9895a4] leading-relaxed flex gap-3"
                >
                  <span className="text-[#E8B829] mt-1 shrink-0 text-[8px]">
                    &#x25CF;
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-5">
            <p className="text-[#f0ece4] font-medium text-sm">
              Portfólio digital — arquivo único em PDF
            </p>
            <p className="mt-3 text-sm text-[#9895a4] leading-relaxed">
              Deve conter plano de aula, objetivos, público-alvo, metodologia,
              recursos digitais, atividade ou situação-problema, avaliação,
              referências e reflexão crítica sobre a prática.
            </p>
          </div>
        </div>

        <SubTitle>Critérios de avaliação da Fase 2</SubTitle>
        <DataTable
          headers={["Critério", "Descrição", "Pontos"]}
          rows={[
            [
              "Domínio do conteúdo",
              "Rigor matemático, correção conceitual e linguagem adequada.",
              "25",
            ],
            [
              "Estratégias de ensino",
              "Clareza, adaptação ao público-alvo e mediação pedagógica.",
              "25",
            ],
            [
              "Uso de TDICs",
              "Integração criativa, funcional e ética de tecnologias digitais.",
              "20",
            ],
            [
              "Reflexão crítica",
              "Análise fundamentada sobre as escolhas didáticas e limitações.",
              "15",
            ],
            [
              "Coerência pedagógica",
              "Alinhamento entre plano, vídeo, portfólio e avaliação.",
              "15",
            ],
          ]}
          total={["Total", "", "100"]}
        />
      </Section>

      <Section n="5" title="Nota Final e Critérios de Desempate">
        <div className="rounded-xl border border-[#E8B829]/30 bg-[#E8B829]/[0.06] p-6 my-2 text-center">
          <p className="text-xs uppercase tracking-[0.14em] text-[#9895a4]">
            Nota Final
          </p>
          <p className="mt-3 text-[#f0ece4] font-[family-name:var(--font-jetbrains-mono)] text-base sm:text-lg">
            NF = (0,40 × Fase 1) + (0,60 × Fase 2)
          </p>
        </div>
        <P>
          Em caso de igualdade na Nota Final, os critérios de desempate serão,
          nesta ordem:
        </P>
        <ol className="space-y-3 mt-2">
          {[
            "Maior pontuação na Fase 2;",
            "Maior pontuação no eixo de Educação Matemática/Pedagógico da Fase 1;",
            'Maior pontuação no critério "Domínio do Conteúdo" na Fase 2;',
            "Maior idade.",
          ].map((t, i) => (
            <li key={t} className="flex gap-4">
              <span className="text-[#E8B829] font-[family-name:var(--font-jetbrains-mono)] text-sm shrink-0 tabular-nums">
                {i + 1}.
              </span>
              <span className="text-sm text-[#9895a4] leading-relaxed">{t}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section n="6" title="Premiação e Bolsas de Iniciação Científica">
        <SubTitle>6.1. Premiações em dinheiro</SubTitle>
        <P>
          Serão premiados os 15 primeiros colocados no Ranking Geral Estadual,
          totalizando <Strong>R$ 30.000,00</Strong>.
        </P>
        <div className="grid gap-3 sm:grid-cols-3 my-4">
          <MedalCard
            medal="Ouro"
            color="#E8B829"
            slots={5}
            value="R$ 3.000,00"
            total="R$ 15.000,00"
          />
          <MedalCard
            medal="Prata"
            color="#b9c0cc"
            slots={5}
            value="R$ 2.000,00"
            total="R$ 10.000,00"
          />
          <MedalCard
            medal="Bronze"
            color="#c98a5b"
            slots={5}
            value="R$ 1.000,00"
            total="R$ 5.000,00"
          />
        </div>
        <Bullets
          items={[
            "Menção honrosa: concedida a todos os participantes que concluírem com êxito a Fase 2.",
            'Troféus especiais: serão concedidos troféus como "Mulheres na Matemática" e "Universidade Destaque".',
          ]}
        />

        <SubTitle>6.2. Bolsas de Iniciação Científica (FAPEPI)</SubTitle>
        <P>
          Serão oferecidas 30 bolsas de Iniciação Científica financiadas pela
          FAPEPI, no valor de R$ 700,00 mensais por 12 meses, totalizando R$
          8.400,00 por bolsista.
        </P>
        <Bullets
          items={[
            "15 bolsas para os estudantes medalhistas (ouro, prata e bronze);",
            "16 bolsas distribuídas igualmente entre as 4 instituições participantes, sendo 4 para cada.",
          ]}
        />
        <P>
          <Strong>Requisitos do bolsista:</Strong> manter matrícula ativa na
          Licenciatura, possuir currículo Lattes atualizado, não acumular outra
          bolsa e cumprir o plano de trabalho de pesquisa.
        </P>
      </Section>

      <Section n="7" title="Certificação">
        <P>
          Os participantes receberão certificados digitais emitidos pela
          UFPI/CEAD:
        </P>
        <Bullets
          items={[
            "Conclusão da Fase 1: certificado de participação de 40 horas.",
            "Conclusão da Fase 2: certificado de Curso de Extensão de 80 horas.",
          ]}
        />
      </Section>

      <Section n="8" title="Calendário Oficial">
        <DataTable
          headers={["Atividade", "Data / Período"]}
          rows={CRONOGRAMA.map((c) => [c.atividade, c.data])}
          emphasizeRows={CRONOGRAMA.map((c) => c.destaque)}
        />
      </Section>

      <Section n="9" title="Conduta e Integridade Acadêmica">
        <P>É expressamente proibido ao participante:</P>
        <Bullets
          items={[
            "Receber auxílio de terceiros ou compartilhar respostas e questões durante a Fase 1;",
            "Cometer plágio ou utilizar dados e imagens sem a devida referência e autorização.",
          ]}
        />
        <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-5 mt-4">
          <p className="text-[#f0ece4] font-medium text-sm">
            Uso de Inteligência Artificial generativa
          </p>
          <p className="mt-3 text-sm text-[#9895a4] leading-relaxed">
            Ferramentas de IA não podem substituir integralmente a autoria do
            participante. Caso sejam utilizadas como apoio, devem ser
            explicitamente declaradas no Portfólio Digital, informando a
            ferramenta e a finalidade do uso.
          </p>
        </div>
        <div className="rounded-xl border border-[#c0392b]/35 bg-[#c0392b]/[0.07] p-5 mt-4">
          <p className="text-sm text-[#f0ece4] leading-relaxed">
            A inobservância dessas regras resultará no desligamento do certame e
            no cancelamento de eventuais prêmios e bolsas.
          </p>
        </div>
      </Section>

      <Section n="10" title="Dúvidas e Recursos">
        <Bullets
          items={[
            "Recursos devem ser submetidos diretamente pela área do candidato no site, no prazo de 2 (dois) dias úteis após a publicação dos resultados.",
            "Realização: UFPI / CEAD — Coordenação do Curso de Gestão de Dados e Licenciatura em Matemática.",
          ]}
        />
      </Section>

      <p className="text-xs text-[#6f6c7a] leading-relaxed pt-2">
        Ao se inscrever, o participante concorda integralmente com este
        regulamento. Casos omissos serão resolvidos pela Comissão Organizadora.
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ dados */

const EIXOS = [
  {
    titulo: "Números e Operações",
    descricao:
      "Conjuntos, divisibilidade, proporcionalidade, razão, porcentagem e resolução de problemas.",
  },
  {
    titulo: "Álgebra e Funções",
    descricao:
      "Equações, sequências, funções (afim, quadrática, exponencial, logarítmica, trigonométrica) e modelagem.",
  },
  {
    titulo: "Geometria",
    descricao:
      "Plana, espacial e analítica; transformações; métrica e argumentação.",
  },
  {
    titulo: "Cálculo Diferencial e Integral",
    descricao: "Limites, derivadas e integrais de funções reais.",
  },
  {
    titulo: "Fundamentos Matemáticos",
    descricao:
      "Raciocínio lógico, demonstrações, cálculo, álgebra linear e matemática discreta.",
  },
  {
    titulo: "Educação Matemática",
    descricao:
      "Resolução de problemas, investigação, jogos, história da Matemática e avaliação.",
  },
  {
    titulo: "Prática Docente e Inclusão",
    descricao:
      "Teorias de aprendizagem, educação inclusiva, acessibilidade e linguagem matemática.",
  },
  {
    titulo: "Tecnologias Digitais",
    descricao:
      "Uso pedagógico, ético e crítico de softwares, aplicativos e TDICs.",
  },
];

const CRONOGRAMA = [
  { atividade: "Lançamento oficial", data: "19/08/2026", destaque: false },
  {
    atividade: "Período de inscrições",
    data: "01/09/2026 a 25/09/2026",
    destaque: true,
  },
  {
    atividade: "Divulgação das inscrições validadas",
    data: "05/10/2026",
    destaque: false,
  },
  {
    atividade: "Aplicação da Fase 1 (on-line)",
    data: "24/10/2026",
    destaque: true,
  },
  {
    atividade: "Resultado da Fase 1 e convocação para a Fase 2",
    data: "30/10/2026",
    destaque: false,
  },
  {
    atividade: "Divulgação das orientações da Fase 2",
    data: "05/11/2026 a 10/11/2026",
    destaque: false,
  },
  {
    atividade: "Envio dos vídeos e portfólios (Fase 2)",
    data: "18/11/2026 a 20/11/2026",
    destaque: true,
  },
  {
    atividade: "Avaliação pela banca examinadora",
    data: "21/11/2026 a 29/11/2026",
    destaque: false,
  },
  {
    atividade: "Resultado preliminar e medalhistas",
    data: "30/11/2026",
    destaque: true,
  },
  {
    atividade: "Cerimônia de premiação e encerramento",
    data: "04/12/2026",
    destaque: true,
  },
  {
    atividade: "Implementação das bolsas FAPEPI",
    data: "Dez/2026 a Jan/2027",
    destaque: false,
  },
  { atividade: "Realização do FORPEMAT", data: "Janeiro/2027", destaque: false },
  { atividade: "Realização do CONGEMAT", data: "Fevereiro/2027", destaque: false },
];

const ALGARISMOS_ROMANOS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

function romanize(n: number) {
  return ALGARISMOS_ROMANOS[n - 1] ?? String(n);
}

/* ------------------------------------------------------------ componentes */

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[#2a2a3a] rounded-2xl p-6 lg:p-8 bg-[#12121a]">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-[#E8B829] font-[family-name:var(--font-jetbrains-mono)] text-sm tabular-nums">
          {n}
        </span>
        <h2 className="text-xl font-bold text-[#f0ece4] font-[family-name:var(--font-fraunces)]">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-[#f0ece4] uppercase tracking-[0.08em] pt-3">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-[#9895a4] leading-relaxed">{children}</p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="text-[#f0ece4] font-medium">{children}</strong>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="text-sm text-[#9895a4] leading-relaxed flex gap-3"
        >
          <span className="text-[#E8B829] mt-1.5 shrink-0 text-[8px]">
            &#x25CF;
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function PhaseCard({
  phase,
  name,
  detail,
  points,
  kind,
}: {
  phase: string;
  name: string;
  detail: string;
  points: string;
  kind: string;
}) {
  return (
    <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-[#E8B829] font-medium">
        {phase}
      </p>
      <p className="text-[#f0ece4] font-medium mt-2">{name}</p>
      <p className="text-sm text-[#9895a4] mt-1">{detail}</p>
      <p className="text-sm text-[#f0ece4] font-[family-name:var(--font-jetbrains-mono)] mt-3 tabular-nums">
        {points}
      </p>
      <p className="text-xs text-[#6f6c7a] mt-2">{kind}</p>
    </div>
  );
}

function MedalCard({
  medal,
  color,
  slots,
  value,
  total,
}: {
  medal: string;
  color: string;
  slots: number;
  value: string;
  total: string;
}) {
  return (
    <div className="rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-5">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <p className="text-[#f0ece4] font-medium text-sm">{medal}</p>
      </div>
      <p className="text-sm text-[#9895a4] mt-3">
        {slots} vagas · {value}
      </p>
      <p className="text-sm text-[#f0ece4] font-[family-name:var(--font-jetbrains-mono)] mt-1 tabular-nums">
        {total}
      </p>
    </div>
  );
}

function DataTable({
  headers,
  rows,
  total,
  emphasizeRows,
}: {
  headers: string[];
  rows: string[][];
  total?: string[];
  emphasizeRows?: boolean[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#2a2a3a]">
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr className="bg-[#0f0f16]">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`text-left px-4 py-3 text-xs uppercase tracking-[0.08em] text-[#6f6c7a] font-semibold ${
                  i === headers.length - 1 && headers.length > 2
                    ? "text-right"
                    : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row[0]} className="border-t border-[#2a2a3a]">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 leading-relaxed align-top ${
                    ci === 0
                      ? emphasizeRows?.[ri]
                        ? "text-[#f0ece4] font-medium"
                        : "text-[#f0ece4]"
                      : "text-[#9895a4]"
                  } ${
                    ci === row.length - 1 && row.length > 2
                      ? "text-right tabular-nums whitespace-nowrap"
                      : ""
                  } ${
                    ci === 1 && row.length === 2
                      ? "tabular-nums whitespace-nowrap"
                      : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {total && (
            <tr className="border-t border-[#2a2a3a] bg-[#0f0f16]">
              {total.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 font-medium text-[#f0ece4] ${
                    ci === total.length - 1
                      ? "text-right tabular-nums"
                      : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

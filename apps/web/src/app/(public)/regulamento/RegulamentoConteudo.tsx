"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CRONOGRAMA, dataDe } from "@/lib/cronograma";

/** Texto do regulamento (conteúdo animado, client). A página fica em page.tsx. */
export function RegulamentoConteudo() {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div id="regulamento" className="scroll-mt-28">
        <p className="text-xs tracking-[0.18em] uppercase text-[var(--color-gold-ink)] font-medium">
          Regulamento Oficial
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mt-3 font-[family-name:var(--font-fraunces)]">
          1ª Olimpíada de Licenciandos em Matemática
        </h2>
        <p className="text-[var(--text-tertiary)] mt-3 leading-relaxed">
          OLICMAT 2026 — Universidade Federal do Piauí, por meio do Centro de
          Educação Aberta e a Distância (CEAD), em parceria com IFPI, UESPI e
          UFDPar.
        </p>
      </div>

      <Link
        href="/regulamento/edital"
        className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 p-5 transition-colors hover:bg-[var(--color-gold)]/10"
      >
        <span className="flex flex-col">
          <span className="font-semibold text-[var(--text-primary)]">Edital nº 01/2026 e documentos oficiais</span>
          <span className="text-sm text-[var(--text-tertiary)]">
            Edital, relação das inscrições confirmadas e retificação, em ordem de publicação
          </span>
        </span>
        <span className="text-[var(--color-gold-ink)] text-xl shrink-0" aria-hidden>
          →
        </span>
      </Link>

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
            `Período de inscrições: ${dataDe("inscricoes")}.`,
            `Divulgação das inscrições validadas: ${dataDe("inscricoes-validadas")}.`,
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
        <div className="rounded-xl border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/[0.08] p-5">
          <p className="text-[var(--text-primary)] font-semibold text-sm">
            Início até 09:00, sem exceção
          </p>
          <p className="mt-2 text-sm text-[var(--text-primary)] leading-relaxed">
            Depois das 09:00 ninguém inicia a prova, qualquer que seja o motivo,
            inclusive problemas de internet, aparelho ou acesso. Recomenda-se
            entrar no sistema a partir de 08:15, para não deixar para a última
            hora. Quem iniciou antes das 09:00 e caiu pode voltar depois das
            09:00, enquanto a prova estiver aberta. O tempo não para.
          </p>
        </div>
        <Bullets
          items={[
            "Formato: prova on-line composta por 20 (vinte) questões objetivas, valendo 100 pontos no total.",
            `Data: ${dataDe("fase1")}.`,
            "Horário e duração: das 08:30 às 11:30 (horário de Brasília), com duração de 180 minutos (3 horas).",
            "Término: a prova termina às 11:30 para todos, seja qual for o horário em que o participante iniciou. Quem inicia às 09:00 tem até 11:30, então tem 2h30.",
            "Liberação: o botão de acesso à prova só fica habilitado às 08:30 de 08/11/2026, no horário do sistema.",
            'Início máximo: 09:00, sem exceção. Depois desse horário, o sistema exibe a mensagem "O prazo para iniciar a prova terminou às 09:00".',
            'Respostas salvas: às 11:30 a prova é encerrada automaticamente, e contam somente as respostas salvas. Questões em branco e alternativas marcadas sem salvar não são contabilizadas. O sistema não salva sozinho ao fim do tempo nem no encerramento por 3 advertências. Ao trocar de questão, a alternativa marcada é salva automaticamente; mesmo assim, recomenda-se clicar em "Salvar Resposta".',
            "Avisos de tempo: a tela avisa quando faltam 10 minutos, 5 minutos e 1 minuto para o encerramento. Nos últimos 10 minutos, o relógio fica em destaque.",
            "Dispositivos: a prova pode ser feita pelo celular ou pelo computador. Recomenda-se internet estável e bateria carregada ou carregador. No computador, a tela cheia é obrigatória; no celular, não há exigência de tela cheia, e recomenda-se desativar o bloqueio automático de tela.",
            "Saída da prova: em qualquer aparelho, trocar de aba ou de aplicativo gera advertência; no computador, também sair da tela cheia ou tirar o foco da janela. Três advertências encerram a prova. No celular, uma ligação recebida conta como saída, por isso recomenda-se o modo Não Perturbe ou, quando possível, o modo avião com Wi-Fi, com as notificações silenciadas.",
            "Ordem das questões e alternativas: as questões aparecem na mesma ordem para todos. Apenas as alternativas são embaralhadas para cada participante.",
            'Aparelho único: é proibido usar o mesmo usuário em dois aparelhos ou navegadores ao mesmo tempo. O segundo acesso é recusado e o participante é avisado, inclusive na tela da prova aberta, até a tentativa parar. Quem perdeu o aparelho ou a conexão pode entrar por outro depois de cerca de 2 minutos, ou pedir a liberação ao suporte; as respostas salvas são mantidas. O link de entrada na prova só funciona uma vez; para entrar de novo, volte ao painel e clique outra vez em "Acessar a aplicação de prova".',
            "Conteúdo avaliado: conhecimentos matemáticos e saberes didático-pedagógicos para a Educação Básica, baseados na BNCC e na Matriz do Inep (Portaria nº 330/2025).",
            "Classificação para a Fase 2: serão classificados até 50% dos participantes de cada instituição que realizarem a prova, em ordem decrescente de nota.",
          ]}
        />

        <SubTitle>Eixos temáticos avaliados</SubTitle>
        <ol className="space-y-3 mt-2">
          {EIXOS.map((eixo, i) => (
            <li key={eixo.titulo} className="flex gap-4">
              <span className="text-[var(--color-gold-ink)] font-[family-name:var(--font-jetbrains-mono)] text-sm shrink-0 mt-0.5 tabular-nums">
                {romanize(i + 1)}
              </span>
              <span className="text-sm text-[var(--text-tertiary)] leading-relaxed">
                <span className="text-[var(--text-primary)] font-medium">
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
            `Período de realização: ${dataDe("envio-fase2")}.`,
            "Formato: a Comissão Organizadora sorteia uma única competência específica de Matemática e suas Tecnologias da BNCC; o sorteio é gravado e divulgado. Cada participante escolhe uma ou mais habilidades da competência sorteada e produz uma videoaula autoral e um portfólio digital.",
            "Prazo: até as 23h59 (horário de Brasília) de 20/11/2026, último dia da Fase 2, para enviar os arquivos na plataforma da OLICMAT, com login e senha do participante, conforme a retificação do edital. Encerrado o prazo, o envio é bloqueado automaticamente.",
            "Orientações completas no Manual do Participante — 2ª Fase (seção Documentos, no início desta página).",
          ]}
        />

        <SubTitle>Materiais obrigatórios</SubTitle>
        <div className="space-y-4 mt-2">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-5">
            <p className="text-[var(--text-primary)] font-medium text-sm">
              Videoaula autoral de 20 minutos
            </p>
            <ul className="mt-3 space-y-2">
              {[
                "Desenvolve uma situação de ensino relacionada à competência sorteada e à(s) habilidade(s) escolhida(s), para o público da Educação Básica definido no portfólio.",
                "Apresenta uma aula, não apenas o planejamento: introduz o tema, explora uma atividade ou problema, explica os conceitos e estratégias e sistematiza a aprendizagem.",
                "Enviada como arquivo de vídeo (por exemplo, MP4) diretamente na plataforma da OLICMAT.",
              ].map((t) => (
                <li
                  key={t}
                  className="text-sm text-[var(--text-tertiary)] leading-relaxed flex gap-3"
                >
                  <span className="text-[var(--color-gold-ink)] mt-1 shrink-0 text-[8px]">
                    &#x25CF;
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-5">
            <p className="text-[var(--text-primary)] font-medium text-sm">
              Portfólio digital — arquivo único em PDF
            </p>
            <p className="mt-3 text-sm text-[var(--text-tertiary)] leading-relaxed">
              Deve conter identificação do candidato; competência sorteada e
              habilidade(s) selecionada(s); público-alvo e objetivos de ensino;
              plano de aula; situação-problema ou atividade; desenvolvimento e
              justificativas matemáticas; metodologia e recursos; proposta de
              avaliação da aprendizagem; reflexão crítica e referências. Deve ser
              coerente com a videoaula; use o Template do Portfólio.
            </p>
          </div>
        </div>

        <SubTitle>Critérios de avaliação da Fase 2</SubTitle>
        <DataTable
          headers={["Critério", "Descrição", "Pontos"]}
          rows={[
            [
              "1. Adequação à competência sorteada e às habilidades escolhidas",
              "Coerência entre a competência, as habilidades selecionadas, os objetivos de ensino e o público-alvo.",
              "20",
            ],
            [
              "2. Domínio do conteúdo e rigor matemático",
              "Correção de conceitos e procedimentos, precisão da linguagem e qualidade das representações, justificativas e conclusões.",
              "20",
            ],
            [
              "3. Planejamento e organização da situação didática",
              "Progressão da aula, articulação entre objetivos e atividades, coerência entre portfólio e vídeo e gestão do tempo.",
              "20",
            ],
            [
              "4. Clareza didática e mediação da aprendizagem",
              "Explicações compreensíveis, perguntas pertinentes e atenção às possíveis dificuldades dos estudantes.",
              "20",
            ],
            [
              "5. Recursos didáticos, tecnologias e avaliação da aprendizagem",
              "Uso intencional de materiais e recursos, quando pertinentes, e estratégias para verificar a aprendizagem.",
              "20",
            ],
          ]}
          total={["Total", "", "100"]}
        />
        <P>
          A banca avalia conjuntamente a videoaula e o portfólio. Para cada critério, o
          avaliador atribui um conceito de 0 a 5, convertido proporcionalmente em pontos
          (conceito × 4): 0 — ausência de evidência; 1 — desempenho incipiente; 2 —
          parcial, com lacunas importantes; 3 — adequado, com limitações; 4 —
          consistente; 5 — consistente, com evidências claras e bem fundamentadas.
        </P>
      </Section>

      <Section n="5" title="Nota Final e Critérios de Desempate">
        <div className="rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/[0.06] p-6 my-2 text-center">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            Nota Final
          </p>
          <p className="mt-3 text-[var(--text-primary)] font-[family-name:var(--font-jetbrains-mono)] text-base sm:text-lg">
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
            'Maior pontuação no critério "Domínio do conteúdo e rigor matemático" (Critério 2) na Fase 2;',
            "Maior idade.",
          ].map((t, i) => (
            <li key={t} className="flex gap-4">
              <span className="text-[var(--color-gold-ink)] font-[family-name:var(--font-jetbrains-mono)] text-sm shrink-0 tabular-nums">
                {i + 1}.
              </span>
              <span className="text-sm text-[var(--text-tertiary)] leading-relaxed">{t}</span>
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
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-5 mt-4">
          <p className="text-[var(--text-primary)] font-medium text-sm">
            Uso de Inteligência Artificial generativa
          </p>
          <p className="mt-3 text-sm text-[var(--text-tertiary)] leading-relaxed">
            Ferramentas de IA não podem substituir integralmente a autoria do
            participante. Caso sejam utilizadas como apoio, devem ser
            explicitamente declaradas no Portfólio Digital, informando a
            ferramenta e a finalidade do uso.
          </p>
        </div>
        <div className="rounded-xl border border-[#c0392b]/35 bg-[#c0392b]/[0.07] p-5 mt-4">
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
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

      <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2">
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
    <section className="border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 bg-[var(--bg-secondary)]">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-[var(--color-gold-ink)] font-[family-name:var(--font-jetbrains-mono)] text-sm tabular-nums">
          {n}
        </span>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-[0.08em] pt-3">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">{children}</p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="text-[var(--text-primary)] font-medium">{children}</strong>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="text-sm text-[var(--text-tertiary)] leading-relaxed flex gap-3"
        >
          <span className="text-[var(--color-gold-ink)] mt-1.5 shrink-0 text-[8px]">
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
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-gold-ink)] font-medium">
        {phase}
      </p>
      <p className="text-[var(--text-primary)] font-medium mt-2">{name}</p>
      <p className="text-sm text-[var(--text-tertiary)] mt-1">{detail}</p>
      <p className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-jetbrains-mono)] mt-3 tabular-nums">
        {points}
      </p>
      <p className="text-xs text-[var(--text-muted)] mt-2">{kind}</p>
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
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-5">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <p className="text-[var(--text-primary)] font-medium text-sm">{medal}</p>
      </div>
      <p className="text-sm text-[var(--text-tertiary)] mt-3">
        {slots} vagas · {value}
      </p>
      <p className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-jetbrains-mono)] mt-1 tabular-nums">
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
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr className="bg-[var(--surface-2)]">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`text-left px-4 py-3 text-xs uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold ${
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
            <tr key={row[0]} className="border-t border-[var(--border-color)]">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 leading-relaxed align-top ${
                    ci === 0
                      ? emphasizeRows?.[ri]
                        ? "text-[var(--text-primary)] font-medium"
                        : "text-[var(--text-primary)]"
                      : "text-[var(--text-tertiary)]"
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
            <tr className="border-t border-[var(--border-color)] bg-[var(--surface-2)]">
              {total.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 font-medium text-[var(--text-primary)] ${
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

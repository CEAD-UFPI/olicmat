import type { Metadata } from "next";
import { Aviso, Faq, Figura, Link, Lista, P, Passos, Secao, Strong } from "@/components/tutorial/Blocos";

export const metadata: Metadata = {
  title: "Tutorial do Avaliador - OLICMAT",
  description:
    "Passo a passo para a banca avaliar a 2ª Fase da OLICMAT 2026: acessar a plataforma, assistir à videoaula, ler o portfólio, atribuir os conceitos de 0 a 5 e concluir a avaliação.",
};

const ADMIN = process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.olicmat.cead.ufpi.br";
const AVALIAR = `${ADMIN}/avaliador/fase2`;
const MANUAL = "/arquivos/manual-participante-fase2-2026.pdf";

const SECOES = [
  { id: "antes", titulo: "Antes de começar" },
  { id: "entrar", titulo: "Entrar na plataforma" },
  { id: "lista", titulo: "Suas avaliações" },
  { id: "arquivos", titulo: "Videoaula e portfólio" },
  { id: "conceitos", titulo: "Atribuir os conceitos" },
  { id: "concluir", titulo: "Parecer e conclusão" },
  { id: "depois", titulo: "O que acontece depois" },
  { id: "duvidas", titulo: "Dúvidas frequentes" },
];

const CRITERIOS: Array<[string, string]> = [
  ["Adequação à competência sorteada e às habilidades escolhidas", "Coerência entre a competência, as habilidades selecionadas, os objetivos de ensino e o público-alvo."],
  ["Domínio do conteúdo e rigor matemático", "Correção de conceitos e procedimentos, precisão da linguagem e qualidade das representações, justificativas e conclusões."],
  ["Planejamento e organização da situação didática", "Progressão da aula, articulação entre objetivos e atividades, coerência entre portfólio e vídeo e gestão do tempo."],
  ["Clareza didática e mediação da aprendizagem", "Explicações compreensíveis, perguntas pertinentes e atenção às possíveis dificuldades dos estudantes."],
  ["Recursos didáticos, tecnologias e avaliação da aprendizagem", "Uso intencional de materiais e recursos, quando pertinentes, e estratégias para verificar a aprendizagem."],
];

const ESCALA: Array<[number, number, string]> = [
  [0, 0, "Ausência de evidência"],
  [1, 4, "Desempenho incipiente"],
  [2, 8, "Desempenho parcial, com lacunas importantes"],
  [3, 12, "Desempenho adequado, com limitações"],
  [4, 16, "Desempenho consistente"],
  [5, 20, "Desempenho consistente, com evidências claras e bem fundamentadas"],
];

export default function TutorialAvaliadorPage() {
  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs tracking-[0.18em] uppercase text-[var(--color-gold-ink)] font-medium">
          OLICMAT 2026 · 2ª Fase · Banca avaliadora
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mt-3 font-[family-name:var(--font-fraunces)] text-balance">
          Como avaliar a videoaula e o portfólio
        </h1>
        <p className="text-[var(--text-secondary)] mt-3 leading-relaxed text-lg">
          Cada participante enviou uma <Strong>videoaula de 20 minutos</Strong> e um <Strong>portfólio em PDF</Strong> sobre a
          competência sorteada. Você assiste, lê e dá um <Strong>conceito de 0 a 5</Strong> em cada um dos{" "}
          <Strong>5 critérios</Strong>. O sistema converte para pontos e soma tudo, até 100.
        </p>
        <ol className="mt-6 flex flex-wrap gap-2" aria-label="Etapas">
          {["Entrar", "Abrir a ficha", "Assistir e ler", "Conceitos 0 a 5", "Concluir"].map((t, i) => (
            <li
              key={t}
              className="text-xs uppercase tracking-[0.08em] rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-[var(--text-secondary)] font-[family-name:var(--font-jetbrains-mono)]"
            >
              <b className="text-[var(--color-gold-ink)] font-medium">{i + 1}</b> {t}
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={AVALIAR}
            className="inline-flex items-center justify-center rounded-lg px-5 h-12 font-semibold"
            style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}
          >
            Ir para as minhas avaliações
          </a>
          <a
            href={MANUAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg px-5 h-12 font-semibold border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface)]"
          >
            Manual da 2ª Fase (PDF)
          </a>
        </div>
        <nav aria-label="Nesta página" className="mt-6 flex flex-wrap gap-2 text-sm">
          {SECOES.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-[var(--border-color)] px-3 py-1.5 text-[var(--text-secondary)] hover:border-[var(--color-gold)] hover:text-[var(--text-primary)]"
            >
              {i + 1}. {s.titulo}
            </a>
          ))}
        </nav>
      </header>

      <Secao n={1} id="antes" titulo="Antes de começar">
        <Lista
          itens={[
            <>A avaliação acontece de <Strong>21/11 a 29/11/2026</Strong>. Procure concluir cada participante em até <Strong>48 horas</Strong> depois de recebê-lo: o resultado sai em 30/11.</>,
            <>Cada participante é avaliado por <Strong>dois avaliadores</Strong>, que não veem a nota um do outro. Avalie de forma independente.</>,
            <>Leia o <Link href={MANUAL}>Manual da 2ª Fase</Link>: ele descreve o que foi pedido aos participantes e os critérios que você vai usar.</>,
            <>Use um <Strong>computador com boa internet</Strong>. Os vídeos são leves, mas a avaliação fica mais confortável em tela grande.</>,
          ]}
        />
        <Aviso>
          <Strong>Sigilo e imparcialidade.</Strong> Não compartilhe os vídeos, os portfólios nem os links. Se você
          conhece pessoalmente algum participante que recebeu (orientando, familiar, colega próximo), não avalie:
          avise a Comissão Organizadora, que repassa a avaliação para outro membro da banca.
        </Aviso>
      </Secao>

      <Secao n={2} id="entrar" titulo="Entrar na plataforma">
        <Passos
          itens={[
            <>Acesse <Link href={ADMIN}>{ADMIN.replace("https://", "")}</Link>.</>,
            <>Digite o <Strong>e-mail</Strong> e a <Strong>senha</Strong> da sua conta de avaliador (criada pelo convite da Comissão) e clique em <Strong>Entrar</Strong>.</>,
            <>Esqueceu a senha? Clique em <Strong>Esqueci minha senha</Strong> na mesma tela e siga o e-mail.</>,
          ]}
        />
        <Figura src="/tutorial-avaliador/01-login.webp" alt="Tela de login da plataforma" legenda="Entre com o e-mail e a senha da sua conta de avaliador." />
      </Secao>

      <Secao n={3} id="lista" titulo="Encontre as suas avaliações">
        <P>
          No painel, clique em <Strong>Avaliar Fase 2</Strong> (ou, no menu, em <Strong>Avaliação Fase 2</Strong>). Os
          números do topo mostram quantas avaliações estão pendentes e quantas você já concluiu.
        </P>
        <Figura src="/tutorial-avaliador/02-painel.webp" alt="Painel do avaliador com o atalho Avaliar Fase 2 destacado" legenda="Painel do avaliador: entre em “Avaliar Fase 2”." />
        <P>
          A lista mostra só os participantes atribuídos a <Strong>você</Strong>, separados em <Strong>Pendentes</Strong> e{" "}
          <Strong>Concluídas</Strong>. Clique em <Strong>Avaliar</Strong> para abrir a ficha de um participante.
        </P>
        <Figura src="/tutorial-avaliador/03-lista.webp" alt="Lista de avaliações pendentes e concluídas" legenda="Suas avaliações. Os nomes são fictícios." />
        <P>No celular, o menu fica no botão ☰, no canto superior esquerdo.</P>
      </Secao>

      <Secao n={4} id="arquivos" titulo="Assista à videoaula e leia o portfólio">
        <P>
          No topo da ficha estão o nome do participante, a instituição e a <Strong>competência sorteada</Strong>. Logo abaixo
          estão os arquivos:
        </P>
        <Lista
          itens={[
            <><Strong>Videoaula:</Strong> toca na própria página. Use a tela cheia (⛶) e o controle de velocidade, se precisar. <Strong>Baixar vídeo</Strong> salva uma cópia para assistir sem depender da internet.</>,
            <><Strong>Portfólio:</Strong> <Strong>Abrir portfólio (PDF)</Strong> abre o arquivo numa nova aba.</>,
          ]}
        />
        <Figura src="/tutorial-avaliador/04-ficha.webp" alt="Ficha do participante com o vídeo e os botões Baixar vídeo e Abrir portfólio destacados" legenda="Ficha do participante: vídeo, download e portfólio. O vídeo da imagem é de teste." />
        <Aviso>
          Por segurança, os links dos arquivos valem algumas horas. Se o vídeo ou o PDF não abrirem depois de muito
          tempo com a página aberta, <Strong>recarregue a página</Strong> (F5).
        </Aviso>
      </Secao>

      <Secao n={5} id="conceitos" titulo="Atribua um conceito de 0 a 5 em cada critério">
        <P>
          Avalie a <Strong>videoaula e o portfólio em conjunto</Strong>. Em cada critério, clique no conceito de{" "}
          <Strong>0 a 5</Strong>. O sistema multiplica por 4 e mostra os pontos (até 20 por critério). Clique em{" "}
          <Strong>Escala orientadora</Strong> para ver o significado de cada conceito sem sair da ficha.
        </P>
        <Figura src="/tutorial-avaliador/05-criterios.webp" alt="Critérios com a escala orientadora aberta e conceitos marcados" legenda="Escala orientadora aberta e conceito 4 marcado no Critério 1." />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-4">
            <p className="font-semibold text-[var(--text-primary)] mb-2">Os 5 critérios (20 pontos cada)</p>
            <ol className="space-y-2.5">
              {CRITERIOS.map(([nome, desc], i) => (
                <li key={nome} className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  <Strong>{i + 1}. {nome}.</Strong> {desc}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-4">
            <p className="font-semibold text-[var(--text-primary)] mb-2">Escala orientadora</p>
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--text-tertiary)]">
                <tr><th className="py-1 pr-3">Conceito</th><th className="pr-3">Pontos</th><th>Significado</th></tr>
              </thead>
              <tbody className="text-[var(--text-secondary)]">
                {ESCALA.map(([c, pts, rotulo]) => (
                  <tr key={c} className="border-t border-[var(--border-color)] align-top">
                    <td className="py-1.5 pr-3 font-bold text-[var(--text-primary)] tabular-nums">{c}</td>
                    <td className="pr-3 tabular-nums">{pts}</td>
                    <td>{rotulo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Secao>

      <Secao n={6} id="concluir" titulo="Escreva o parecer e conclua">
        <Passos
          itens={[
            <>Confira o <Strong>Total</Strong> (de 0 a 100), que aparece ao final dos critérios.</>,
            <>Escreva o <Strong>parecer</Strong>: pontos fortes, fragilidades e o que justificou os conceitos. Ele ajuda a Comissão em caso de recurso.</>,
            <>Ainda não terminou? Clique em <Strong>Salvar rascunho</Strong>. Você pode fechar e continuar depois; a lista mostra “rascunho salvo”.</>,
            <>Com os 5 conceitos marcados, clique em <Strong>Concluir avaliação</Strong> e confirme.</>,
          ]}
        />
        <Figura src="/tutorial-avaliador/06-total-parecer.webp" alt="Total de pontos, parecer e os botões Salvar rascunho e Concluir avaliação destacados" legenda="Total, parecer e os botões para salvar ou concluir." />
        <Figura src="/tutorial-avaliador/07-confirmar.webp" alt="Janela de confirmação da conclusão" legenda="Confirmação: confira o total antes de confirmar." />
        <Aviso>
          <Strong>Depois de concluída, a avaliação não pode mais ser alterada.</Strong> Revise os conceitos e o parecer
          antes de confirmar. Se precisar corrigir algo já concluído, fale com a Comissão Organizadora.
        </Aviso>
        <Figura src="/tutorial-avaliador/08-concluida.webp" alt="Ficha com a mensagem Avaliação concluída" legenda="Avaliação concluída: a ficha fica bloqueada para edição." />
      </Secao>

      <Secao n={7} id="depois" titulo="O que acontece depois">
        <Lista
          itens={[
            <>O participante concluído passa para <Strong>Concluídas</Strong>, com a data e o total. Você pode abrir a ficha em <Strong>Ver</Strong>, só para leitura.</>,
            <>Quando os dois avaliadores concluem, a nota da 2ª Fase é a <Strong>média das duas notas</Strong>.</>,
            <>Se as notas diferirem em <Strong>mais de 20 pontos</Strong>, o sistema chama <Strong>automaticamente um 3º avaliador</Strong>, e a nota final é a média das duas notas mais próximas. Por isso, um novo participante pode aparecer na sua lista durante o período de avaliação.</>,
            <>A Comissão acompanha o andamento pelo painel e pode repassar uma avaliação pendente para outro avaliador, se for preciso.</>,
          ]}
        />
        <Figura src="/tutorial-avaliador/09-lista-concluida.webp" alt="Lista com o participante movido para Concluídas" legenda="Participante avaliado, agora em “Concluídas”." />
      </Secao>

      <Secao n={8} id="duvidas" titulo="Dúvidas frequentes">
        <Faq
          itens={[
            ["O vídeo não abre ou trava", "Recarregue a página (F5): os links valem algumas horas. Se continuar, use “Baixar vídeo” e assista no seu computador. Persistindo, avise a Comissão."],
            ["Aparece “este vídeo ainda está sendo preparado”", "A plataforma converte cada vídeo para uma versão mais leve. Enquanto isso, o arquivo original é usado e pode demorar a carregar. Normalmente leva poucos minutos."],
            ["Falta a videoaula ou o portfólio", "A ficha mostra “Videoaula não enviada” ou “Portfólio não enviado”. Antes de concluir, fale com a Comissão Organizadora."],
            ["Marquei um conceito errado", "Antes de concluir, basta clicar no conceito certo. Depois de concluída, a avaliação fica bloqueada: fale com a Comissão."],
            ["Conheço o participante", "Não avalie. Avise a Comissão, que repassa a avaliação para outro membro da banca."],
            ["Posso avaliar pelo celular?", "Pode: o menu fica no botão ☰. Mas, para assistir com atenção e ler o PDF, prefira um computador."],
            ["Preciso terminar tudo de uma vez?", "Não. Use “Salvar rascunho” e continue depois. Só procure concluir cada participante em até 48 horas depois de recebê-lo."],
          ]}
        />
        <Aviso>
          Dúvidas sobre os critérios ou sobre a plataforma? Fale com a Comissão Organizadora da OLICMAT pelos canais da
          banca ou pelo <Link href="/#suporte">suporte da OLICMAT</Link>.
        </Aviso>
      </Secao>

      <div className="text-center pt-2">
        <a
          href={AVALIAR}
          className="inline-flex items-center justify-center rounded-lg px-8 h-14 text-base font-semibold"
          style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}
        >
          Ir para as minhas avaliações
        </a>
      </div>
    </div>
  );
}

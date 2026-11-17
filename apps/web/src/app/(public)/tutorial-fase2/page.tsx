import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tutorial da Fase 2 - OLICMAT",
  description:
    "Passo a passo para enviar a videoaula e o portfólio da 2ª Fase da OLICMAT 2026: preparação, compressão do vídeo, envio na plataforma e conferência.",
};

const ADMIN = process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.olicmat.cead.ufpi.br";
const ENVIO = `${ADMIN}/competidor/envio`;
const MANUAL = "/arquivos/manual-participante-fase2-2026.pdf";
const TEMPLATE = "/arquivos/OLICMAT_2026_Template_Portfolio.docx";

const SECOES = [
  { id: "antes", titulo: "Antes do início" },
  { id: "gravacao", titulo: "Gravação do vídeo" },
  { id: "entrar", titulo: "Entrar na plataforma" },
  { id: "inicio", titulo: "O início da Fase 2" },
  { id: "enviar-video", titulo: "Enviar a videoaula" },
  { id: "enviar-portfolio", titulo: "Enviar o portfólio" },
  { id: "conferencia", titulo: "Conferência final" },
  { id: "problemas", titulo: "Se algo der errado" },
];

export default function TutorialFase2Page() {
  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs tracking-[0.18em] uppercase text-[var(--color-gold-ink)] font-medium">
          OLICMAT 2026 · 2ª Fase
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mt-3 font-[family-name:var(--font-fraunces)] text-balance">
          Como enviar a videoaula e o portfólio
        </h1>
        <p className="text-[var(--text-secondary)] mt-3 leading-relaxed text-lg">
          Depois da divulgação do sorteio da competência, você tem <Strong>24 horas</Strong> para
          enviar dois arquivos na plataforma da OLICMAT: a <Strong>videoaula de 20 minutos</Strong> (até
          4 GB, do jeito que foi gravada) e o <Strong>portfólio em PDF</Strong> (até 10 MB).
        </p>
        <ol className="mt-6 flex flex-wrap gap-2" aria-label="Etapas">
          {["Sorteio da competência", "24 h para enviar", "Videoaula", "Portfólio", "Envio completo"].map((t, i) => (
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
            href={ENVIO}
            className="inline-flex items-center justify-center rounded-lg px-5 h-12 font-semibold"
            style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}
          >
            Enviar arquivos
          </a>
          <a
            href={MANUAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg px-5 h-12 font-semibold border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface)]"
          >
            Manual da 2ª Fase (PDF)
          </a>
          <a
            href={TEMPLATE}
            download
            className="inline-flex items-center justify-center rounded-lg px-5 h-12 font-semibold border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface)]"
          >
            Template do Portfólio (Word)
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

      <Secao n={1} id="antes" titulo="Antes do início">
        <P>
          Prepare tudo com antecedência. O que pode ser feito antes do sorteio não deve ficar para as
          24 horas.
        </P>
        <Lista
          itens={[
            <>Leia o <Link href={MANUAL}>Manual do Participante — 2ª Fase</Link>: ele traz as cinco competências específicas da BNCC, as habilidades de cada uma e os critérios de avaliação.</>,
            <>Baixe o <Link href={TEMPLATE}>Template do Portfólio</Link> e conheça as seções que você vai preencher.</>,
            <>Teste a gravação: microfone, iluminação, quadro ou tela compartilhada e a duração de cerca de 20 minutos.</>,
            <>Confira se você consegue entrar na plataforma com seu e-mail e senha. Se esqueceu a senha, recupere agora, não no dia.</>,
          ]}
        />
        <Aviso>
          Só os participantes da relação oficial de classificados veem o envio da Fase 2. A
          competência é a mesma para todos e só aparece na plataforma depois do início.
        </Aviso>
      </Secao>

      <Secao n={2} id="gravacao" titulo="Grave e guarde o vídeo">
        <P>
          Você <Strong>não precisa editar nem comprimir</Strong> o vídeo: envie o arquivo do jeito que
          ele foi gravado. Depois do envio, a plataforma prepara automaticamente uma versão leve para a
          banca assistir.
        </P>
        <Lista
          itens={[
            <>Grave em <Strong>1080p ou 720p</Strong> (no celular, em <em>Câmera → Configurações → Gravar vídeo</em>). Evite 4K: o arquivo fica grande demais.</>,
            <>O arquivo pode ter <Strong>até 4 GB</Strong>. Uma aula de 20 minutos em 1080p costuma ter entre 1 e 3 GB.</>,
            <>Formatos aceitos: MP4, MOV, WEBM, MKV, M4V e AVI. É o formato que o celular, a câmera ou o programa de gravação de tela já gera.</>,
            <>Assista ao arquivo antes de enviar e confira se a imagem e o som estão bons do início ao fim.</>,
          ]}
        />
        <Aviso>
          <Strong>Reserve tempo para o envio.</Strong> Um vídeo de 1 a 3 GB pode levar de 15 minutos a
          mais de uma hora para subir, conforme a sua internet. Prefira uma conexão Wi-Fi estável e não
          deixe para as últimas horas do prazo.
        </Aviso>
      </Secao>

      <Secao n={3} id="entrar" titulo="Entre na plataforma">
        <P>
          Acesse a plataforma pelo botão <Strong>Entrar</Strong> do site ou pelo endereço{" "}
          <Link href={ADMIN}>{ADMIN.replace(/^https?:\/\//, "")}</Link> e use o mesmo e-mail e senha da
          inscrição.
        </P>
        <Figura src="/tutorial-fase2/01-login.webp" alt="Tela de login da plataforma OLICMAT" legenda="Tela de entrada da plataforma." />
        <P>
          No menu à esquerda, clique em <Strong>Envio - Fase 2</Strong>. Antes do início, a página
          mostra que você está classificado(a) e aguarda o início da fase.
        </P>
        <Figura
          src="/tutorial-fase2/02-menu-aguardando.webp"
          alt="Menu com a opção Envio - Fase 2 destacada e aviso de aguardando o início"
          legenda="Menu “Envio - Fase 2” (em destaque) e a tela antes do início."
        />
      </Secao>

      <Secao n={4} id="inicio" titulo="O início da Fase 2">
        <P>
          Quando a Comissão Organizadora divulgar o sorteio, você recebe um <Strong>e-mail</Strong> com
          a competência sorteada, a data e a hora do início e o prazo final. Na plataforma, a página
          passa a mostrar a competência, o prazo final em horário de Brasília e um cronômetro com o
          tempo restante.
        </P>
        <Figura
          src="/tutorial-fase2/03-competencia-prazo.webp"
          alt="Competência sorteada, início, prazo final e cronômetro"
          legenda="Competência sorteada, prazo final e tempo restante (dados de exemplo)."
        />
        <P>
          Escolha uma ou mais habilidades da competência sorteada, planeje e grave a aula e preencha o
          portfólio. O prazo de 24 horas é o mesmo para todos e <Strong>não há prorrogação</Strong>.
        </P>
      </Secao>

      <Secao n={5} id="enviar-video" titulo="Envie a videoaula">
        <Passos
          itens={[
            <>No cartão <Strong>Videoaula (20 minutos)</Strong>, clique em <Strong>Escolher arquivo</Strong> e selecione o vídeo.</>,
            <>Confira o nome e o tamanho que aparecem e clique em <Strong>Enviar arquivo</Strong>.</>,
          ]}
        />
        <Figura
          src="/tutorial-fase2/04-video-escolhido.webp"
          alt="Vídeo escolhido e botão Enviar arquivo destacado"
          legenda="Arquivo escolhido: clique em “Enviar arquivo”."
        />
        <P>
          A barra mostra o andamento, a velocidade e o tempo estimado.{" "}
          <Strong>Não feche nem recarregue a página</Strong> até terminar. Se a internet oscilar, o
          envio tenta de novo automaticamente.
        </P>
        <Figura
          src="/tutorial-fase2/05-progresso.webp"
          alt="Barra de progresso do envio do vídeo"
          legenda="Envio em andamento."
        />
        <P>
          Ao terminar, o cartão mostra <Strong>Enviado</Strong>, com o nome e o tamanho do arquivo. Em
          seguida, a plataforma prepara o vídeo para a banca (alguns minutos) e o aviso muda para{" "}
          <Strong>Vídeo recebido e preparado para a banca</Strong>. Use <Strong>Conferir</Strong> para abrir
          o vídeo.
        </P>
        <Figura
          src="/tutorial-fase2/06-video-enviado.webp"
          alt="Videoaula enviada, com o link Conferir destacado"
          legenda="Videoaula enviada e preparada para a banca. “Conferir” abre o vídeo."
        />
      </Secao>

      <Secao n={6} id="enviar-portfolio" titulo="Envie o portfólio e confira">
        <Passos
          itens={[
            <>Preencha o Template do Portfólio e salve em PDF: no Word, <Strong>Arquivo → Salvar como → PDF</Strong>; no Google Docs, <Strong>Arquivo → Fazer download → PDF</Strong>.</>,
            <>No cartão <Strong>Portfólio digital (PDF único)</Strong>, escolha o PDF (até 10 MB) e clique em <Strong>Enviar arquivo</Strong>.</>,
            <>Quando os dois arquivos forem enviados, aparece a faixa verde <Strong>Envio completo</Strong>.</>,
          ]}
        />
        <Figura
          src="/tutorial-fase2/07-envio-completo.webp"
          alt="Faixa verde de envio completo"
          legenda="Envio completo: videoaula e portfólio recebidos."
        />
        <P>
          Até o prazo final, você pode substituir qualquer um dos arquivos: escolha o novo e clique em{" "}
          <Strong>Enviar e substituir</Strong>. <Strong>Vale o último envio.</Strong>
        </P>
        <div className="grid sm:grid-cols-[1fr_220px] gap-6 items-start">
          <P>
            Também é possível enviar pelo celular, com a mesma página. Para vídeos, prefira uma rede
            Wi-Fi estável e mantenha a tela ligada até o fim do envio.
          </P>
          <Figura src="/tutorial-fase2/08-celular.webp" alt="Página de envio no celular" legenda="No celular." largura={390} altura={844} />
        </div>
      </Secao>

      <Secao n={7} id="conferencia" titulo="Conferência antes da entrega">
        <P>Do Manual do Participante, item 6:</P>
        <Lista
          itens={[
            <>A videoaula e o portfólio estão relacionados à competência sorteada e às habilidades escolhidas.</>,
            <>A videoaula apresenta uma aula autoral de 20 minutos.</>,
            <>O portfólio está em um único PDF e identifica os objetivos de ensino, o público-alvo e as etapas da aula.</>,
            <>As fontes dos materiais e o eventual uso de inteligência artificial foram declarados no portfólio.</>,
            <>Os dois arquivos foram enviados na plataforma, com seu login e senha, dentro das 24 horas, e a página mostra <Strong>Envio completo</Strong>.</>,
          ]}
          marcador="✓"
        />
      </Secao>

      <Secao n={8} id="problemas" titulo="Se algo der errado">
        <Faq
          itens={[
            ["“Arquivo maior que o limite”", "O vídeo passou de 4 GB, o que acontece ao gravar em 4K ou muito além de 20 minutos. Grave novamente em 1080p ou 720p. Para o portfólio, no Word salve como PDF com a opção “Tamanho mínimo”; imagens muito grandes aumentam o arquivo."],
            ["Apareceu “Não conseguimos ler este vídeo”", "O arquivo pode estar corrompido ou incompleto. Confira se ele abre normalmente no seu computador ou celular e envie novamente."],
            ["O envio parou ou a internet caiu", "O sistema tenta de novo sozinho. Se aparecer uma mensagem de erro, clique em “Enviar arquivo” outra vez: o envio recomeça do início, e o arquivo anterior (se houver) continua valendo até o novo terminar."],
            ["Fechei a página durante o envio", "O envio é cancelado. Abra a página de novo e envie outra vez."],
            ["O prazo acabou durante o envio", "O envio só é aceito se terminar até o prazo final. Por isso, envie com antecedência e não deixe para os últimos minutos."],
            ["Não recebi o e-mail de início", "A competência sorteada aparece na própria plataforma, em “Envio - Fase 2”. Verifique também a caixa de spam."],
            ["A página diz que o envio é só para classificados", "Confira se entrou com o e-mail da sua inscrição. Se estiver na relação de classificados e o problema continuar, fale com o suporte."],
            ["Quero trocar um arquivo", "Até o prazo final, escolha o novo arquivo e clique em “Enviar e substituir”. Vale o último envio."],
          ]}
        />
        <Aviso>
          Precisa de ajuda? Fale com o <Link href="/#suporte">suporte da OLICMAT</Link> pelo
          Instagram ou WhatsApp e informe seu nome, sua instituição e um print da tela.
        </Aviso>
      </Secao>

      <div className="text-center pt-2">
        <a
          href={ENVIO}
          className="inline-flex items-center justify-center rounded-lg px-8 h-14 text-base font-semibold"
          style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}
        >
          Ir para o envio dos arquivos
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ componentes */

function Secao({ n, id, titulo, children }: { n: number; id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 bg-[var(--bg-secondary)]">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-[var(--color-gold-ink)] font-[family-name:var(--font-jetbrains-mono)] text-sm tabular-nums">
          {String(n).padStart(2, "0")}
        </span>
        <h2 className="text-xl lg:text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-fraunces)]">{titulo}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">{children}</p>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="text-[var(--text-primary)] font-semibold">{children}</strong>;
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  const externo = href.startsWith("http");
  return (
    <a
      href={href}
      {...(externo || href.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-[var(--color-blue-ink)] underline underline-offset-2 hover:no-underline"
    >
      {children}
    </a>
  );
}

function Lista({ itens, marcador = "●" }: { itens: React.ReactNode[]; marcador?: string }) {
  return (
    <ul className="space-y-3">
      {itens.map((item, i) => (
        <li key={i} className="text-[15px] text-[var(--text-secondary)] leading-relaxed flex gap-3">
          <span className={`text-[var(--color-gold-ink)] shrink-0 ${marcador === "●" ? "text-[8px] mt-2" : "font-bold"}`}>{marcador}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Passos({ itens }: { itens: React.ReactNode[] }) {
  return (
    <ol className="space-y-3">
      {itens.map((item, i) => (
        <li key={i} className="text-[15px] text-[var(--text-secondary)] leading-relaxed flex gap-3">
          <span
            className="shrink-0 w-7 h-7 rounded-full grid place-items-center text-sm font-bold"
            style={{ backgroundColor: "var(--color-gold)", color: "var(--on-accent)" }}
          >
            {i + 1}
          </span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/[0.08] p-4 text-[15px] text-[var(--text-secondary)] leading-relaxed">
      {children}
    </div>
  );
}

function Figura({
  src, alt, legenda, largura = 1280, altura = 820,
}: { src: string; alt: string; legenda: string; largura?: number; altura?: number }) {
  return (
    <figure className="space-y-2">
      <Image
        src={src}
        alt={alt}
        width={largura}
        height={altura}
        sizes="(max-width: 896px) 100vw, 832px"
        className="w-full h-auto rounded-xl border border-[var(--border-color)] shadow-sm"
      />
      <figcaption className="text-xs text-[var(--text-tertiary)] text-center">{legenda}</figcaption>
    </figure>
  );
}

function Faq({ itens }: { itens: Array<[string, string]> }) {
  return (
    <div className="divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
      {itens.map(([q, r]) => (
        <details key={q} className="group p-4">
          <summary className="cursor-pointer list-none flex justify-between gap-3 font-semibold text-[var(--text-primary)]">
            {q}
            <span className="text-[var(--color-gold-ink)] transition-transform group-open:rotate-45 shrink-0">+</span>
          </summary>
          <p className="mt-2 text-[15px] text-[var(--text-secondary)] leading-relaxed">{r}</p>
        </details>
      ))}
    </div>
  );
}

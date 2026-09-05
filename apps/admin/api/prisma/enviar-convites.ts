/**
 * Envia convites de cadastro em lote a partir de um arquivo.
 *
 * Existe para a organização convidar comissão, coordenadores e avaliadores
 * conhecendo apenas nome, e-mail e papel — os demais dados obrigatórios são
 * preenchidos pela própria pessoa ao aceitar.
 *
 * Sobe o contexto do NestJS em vez de falar direto com o banco, para
 * reaproveitar o serviço de convites e o envio de e-mail já configurados.
 *
 * Uso (dentro do container do admin-api):
 *
 *   docker exec -i olicmat-admin-api npx tsx prisma/enviar-convites.ts /tmp/lista.csv
 *
 * Formato CSV (cabeçalho opcional), separador ";" ou ",":
 *
 *   nome;email;papel
 *   Maria Silva;maria@ufpi.edu.br;COMISSAO
 *   João Souza;joao@ufpi.edu.br;COORDENADOR_CURSO
 *
 * Também aceita um arquivo .json com [{ "nome": ..., "email": ..., "role": ... }]
 *
 * Papéis válidos: COMISSAO, COORDENADOR_CURSO, AVALIADOR, ADMIN
 */
import { readFileSync } from "fs";
import { NestFactory } from "@nestjs/core";

// O código compilado só existe depois do build, então importar "../dist/..."
// de forma estática quebraria a própria compilação. O caminho vai numa
// variável para o TypeScript não tentar resolvê-lo em tempo de build; em
// execução, dentro do container, o dist está no lugar.
const DIST = "../dist/src";

const PAPEIS_VALIDOS = [
  "COMISSAO",
  "COORDENADOR_CURSO",
  "AVALIADOR",
  "ADMIN",
];

interface Entrada {
  nome: string;
  email: string;
  role: string;
}

/** Divide uma linha de CSV respeitando aspas, para nomes com vírgula. */
function dividirLinha(linha: string, sep: string): string[] {
  const campos: string[] = [];
  let atual = "";
  let entreAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (c === '"') {
      if (entreAspas && linha[i + 1] === '"') {
        atual += '"';
        i++;
      } else {
        entreAspas = !entreAspas;
      }
    } else if (c === sep && !entreAspas) {
      campos.push(atual);
      atual = "";
    } else {
      atual += c;
    }
  }
  campos.push(atual);
  return campos.map((c) => c.trim());
}

function lerArquivo(caminho: string): Entrada[] {
  const bruto = readFileSync(caminho, "utf8").trim();
  if (!bruto) throw new Error("Arquivo vazio.");

  if (caminho.endsWith(".json")) {
    const dados = JSON.parse(bruto);
    if (!Array.isArray(dados)) throw new Error("O JSON deve ser uma lista.");
    return dados;
  }

  const linhas = bruto.split(/\r?\n/).filter((l) => l.trim());
  // O separador é decidido pela primeira linha: planilhas em português
  // costumam exportar com ponto e vírgula.
  const sep = linhas[0].includes(";") ? ";" : ",";

  const entradas: Entrada[] = [];
  for (const [i, linha] of linhas.entries()) {
    const campos = dividirLinha(linha, sep);

    // Pula o cabeçalho, se houver.
    if (i === 0 && /^nome$/i.test(campos[0] ?? "")) continue;

    if (campos.length < 3) {
      throw new Error(
        `Linha ${i + 1}: esperado "nome${sep}email${sep}papel", recebido: ${linha}`,
      );
    }
    entradas.push({
      nome: campos[0],
      email: campos[1],
      role: campos[2].toUpperCase(),
    });
  }
  return entradas;
}

function validar(entradas: Entrada[]) {
  const problemas: string[] = [];
  const vistos = new Set<string>();

  entradas.forEach((e, i) => {
    const linha = i + 1;
    if (!e.nome || e.nome.length < 3) {
      problemas.push(`Linha ${linha}: nome muito curto ("${e.nome}")`);
    }
    if (!e.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) {
      problemas.push(`Linha ${linha}: e-mail inválido ("${e.email}")`);
    }
    if (!PAPEIS_VALIDOS.includes(e.role)) {
      problemas.push(
        `Linha ${linha}: papel "${e.role}" inválido. Use um de: ${PAPEIS_VALIDOS.join(", ")}`,
      );
    }
    const chave = e.email?.toLowerCase();
    if (chave && vistos.has(chave)) {
      problemas.push(`Linha ${linha}: e-mail repetido no arquivo ("${chave}")`);
    }
    vistos.add(chave);
  });

  return problemas;
}

async function main() {
  const caminho = process.argv[2] ?? process.env.CONVITES_ARQUIVO;
  if (!caminho) {
    throw new Error(
      "Informe o arquivo: npx tsx prisma/enviar-convites.ts /tmp/lista.csv",
    );
  }

  const entradas = lerArquivo(caminho);
  console.log(`Lidas ${entradas.length} entradas de ${caminho}.`);

  // Validar tudo antes de enviar qualquer e-mail: metade de um lote enviado
  // é pior de corrigir do que um lote recusado inteiro.
  const problemas = validar(entradas);
  if (problemas.length) {
    console.error("\nArquivo com problemas — nenhum convite foi enviado:\n");
    problemas.forEach((p) => console.error(`  ${p}`));
    process.exit(1);
  }

  const somenteConferir = process.env.DRY_RUN === "true";
  if (somenteConferir) {
    console.log("\nDRY_RUN: arquivo válido, nada foi enviado.\n");
    entradas.forEach((e) => console.log(`  ${e.role.padEnd(18)} ${e.email}`));
    return;
  }

  const { AppModule } = await import(`${DIST}/app.module.js`);
  const { ConvitesService } = await import(
    `${DIST}/convites/convites.service.js`
  );

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn"],
  });

  try {
    const service = app.get(ConvitesService);
    const autor = process.env.CONVITES_AUTOR ?? "script:enviar-convites";
    const resultado = await service.criarEmLote(entradas, autor);

    console.log(`\nEnviados: ${resultado.enviados.length}`);
    resultado.enviados.forEach((e: { email: string; role: string }) =>
      console.log(`  ok       ${e.role.padEnd(18)} ${e.email}`),
    );

    if (resultado.falhaEnvio.length) {
      console.log(
        `\nConvite criado, mas o e-mail NÃO saiu: ${resultado.falhaEnvio.length}`,
      );
      console.log("  (o link é válido — rode de novo para reenviar)");
      resultado.falhaEnvio.forEach((e: { email: string; motivo: string }) =>
        console.log(`  falhou   ${e.email} — ${e.motivo}`),
      );
    }

    if (resultado.ignorados.length) {
      console.log(`\nIgnorados: ${resultado.ignorados.length}`);
      resultado.ignorados.forEach((e: { email: string; motivo: string }) =>
        console.log(`  ignorado ${e.email} — ${e.motivo}`),
      );
    }
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(`\nFalhou: ${e instanceof Error ? e.message : e}\n`);
  process.exit(1);
});

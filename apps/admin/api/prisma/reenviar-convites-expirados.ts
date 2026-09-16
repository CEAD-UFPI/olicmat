/**
 * Reenvia convites (tabela Convite) que expiraram sem uso — normalmente
 * alunos convidados em lote (tela "Convidar alunos") que só abriram o
 * e-mail depois do prazo de 7 dias, ou nunca chegaram a clicar.
 *
 * Gera um novo token e uma nova validade de 7 dias para cada convite
 * expirado e não usado, preservando curso/instituição/criador originais
 * (mesmo efeito do reenvio manual: colar a mesma lista de novo em
 * "Convidar alunos" — ConvitesService.criarEmLote faz upsert por e-mail —
 * mas em lote, direto pelos registros já existentes, sem precisar
 * reconstruir a lista original de nome/e-mail).
 *
 * Sobe o contexto do NestJS para reaproveitar o EmailService já
 * configurado (mesmo texto/rótulo de papel que o convite original usou).
 *
 * Uso (dentro do container do admin-api):
 *
 *   docker exec olicmat-admin-api npx tsx prisma/reenviar-convites-expirados.ts
 *
 * Por padrão só lista quem seria afetado. Para reenviar de verdade:
 *
 *   docker exec olicmat-admin-api env DRY_RUN=false npx tsx prisma/reenviar-convites-expirados.ts
 *
 * Filtra opcionalmente por curso:
 *
 *   docker exec olicmat-admin-api env DRY_RUN=false CURSO_ID=<id> npx tsx prisma/reenviar-convites-expirados.ts
 */
import { randomBytes } from "crypto";
import { NestFactory } from "@nestjs/core";

// Mesma razão do enviar-convites.ts: o dist só existe depois do build, então
// o caminho fica numa variável para o TypeScript não tentar resolvê-lo agora.
const DIST = "../dist/src";

const ROTULO_PAPEL: Record<string, string> = {
  COMISSAO: "membro da comissão organizadora",
  COORDENADOR_CURSO: "coordenador de curso",
  AVALIADOR: "avaliador",
  ADMIN: "administrador",
  ALUNO: "participante",
};

const VALIDADE_MS = 7 * 24 * 60 * 60 * 1000;

async function main() {
  const somenteConferir = process.env.DRY_RUN !== "false";
  const cursoId = process.env.CURSO_ID;

  const { AppModule } = await import(`${DIST}/app.module.js`);
  const { PrismaService } = await import(`${DIST}/prisma.service.js`);
  const { EmailService } = await import(`${DIST}/email/email.service.js`);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn"],
  });

  try {
    const prisma = app.get(PrismaService);
    const emailService = app.get(EmailService);

    const expirados = await prisma.convite.findMany({
      where: {
        usadoEm: null,
        expiraEm: { lt: new Date() },
        ...(cursoId ? { cursoId } : {}),
      },
      select: { id: true, nome: true, email: true, role: true, expiraEm: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    console.log(`Encontrados ${expirados.length} convite(s) expirado(s) e não usados.`);
    const agora = Date.now();
    expirados.forEach((c: { role: string; email: string; nome: string; expiraEm: Date }) => {
      const diasVencido = Math.floor((agora - c.expiraEm.getTime()) / (24 * 60 * 60 * 1000));
      console.log(`  ${c.role.padEnd(18)} ${c.email.padEnd(40)} ${c.nome.padEnd(35)} venceu há ${diasVencido}d`);
    });

    if (somenteConferir) {
      console.log("\nDRY_RUN (padrão): nada foi reenviado. Rode com DRY_RUN=false para reenviar de verdade.\n");
      return;
    }

    console.log("\nReenviando...\n");
    let ok = 0;
    let falhou = 0;

    for (const c of expirados) {
      try {
        const token = randomBytes(32).toString("hex");
        const expiraEm = new Date(Date.now() + VALIDADE_MS);

        await prisma.convite.update({
          where: { id: c.id },
          data: { token, expiraEm, usadoEm: null },
        });

        await emailService.enviarConvite(
          c.email,
          c.nome,
          token,
          ROTULO_PAPEL[c.role] ?? c.role,
        );

        console.log(`  ok       ${c.email}`);
        ok++;
      } catch (e) {
        console.log(`  falhou   ${c.email} — ${e instanceof Error ? e.message : e}`);
        falhou++;
      }
    }

    console.log(`\nReenviados: ${ok}${falhou ? ` — falharam: ${falhou}` : ""}`);
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(`\nFalhou: ${e instanceof Error ? e.message : e}\n`);
  process.exit(1);
});

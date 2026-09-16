/**
 * Reenvia o link de criação de senha para usuários cadastrados manualmente
 * (via POST /admin/usuarios) cujo token de definição de senha expirou antes
 * de eles conseguirem usá-lo.
 *
 * Contexto: até 2026-09-16 esse token durava só 24h (diferente das 7 dias
 * do fluxo de Convite), então alunos cadastrados em lote por um coordenador
 * — ou que só abriram o e-mail depois — recebiam "link expirado" ao clicar.
 * A validade já foi corrigida para 7 dias em usuarios.service.ts; este
 * script é a correção pontual para quem já tinha recebido um link de 24h.
 *
 * Sobe o contexto do NestJS para reaproveitar AdminUsuariosService (mesma
 * lógica de invalidar o token antigo + gerar um novo + reenviar e-mail que
 * o botão "Reenviar link" usa nas telas de Usuários/Meus Alunos).
 *
 * Uso (dentro do container do admin-api):
 *
 *   docker exec -i olicmat-admin-api npx tsx prisma/reenviar-links-expirados.ts
 *
 * Por padrão só lista quem seria afetado (DRY_RUN implícito). Para reenviar
 * de verdade:
 *
 *   docker exec -i olicmat-admin-api env DRY_RUN=false npx tsx prisma/reenviar-links-expirados.ts
 *
 * Filtra opcionalmente por coordenador (User.coordenadorId):
 *
 *   docker exec -i olicmat-admin-api env DRY_RUN=false COORDENADOR_ID=<id> npx tsx prisma/reenviar-links-expirados.ts
 */
import { NestFactory } from "@nestjs/core";

// Mesma razão do enviar-convites.ts: o dist só existe depois do build, então
// o caminho fica numa variável para o TypeScript não tentar resolvê-lo agora.
const DIST = "../dist/src";

async function main() {
  const somenteConferir = process.env.DRY_RUN !== "false";
  const coordenadorId = process.env.COORDENADOR_ID;

  const { AppModule } = await import(`${DIST}/app.module.js`);
  const { PrismaService } = await import(`${DIST}/prisma.service.js`);
  const { AdminUsuariosService } = await import(
    `${DIST}/admin/usuarios/usuarios.service.js`
  );

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn"],
  });

  try {
    const prisma = app.get(PrismaService);
    const usuariosService = app.get(AdminUsuariosService);

    // "Nunca completou o cadastro": tem um token PASSWORD_RESET expirado e
    // não usado, e nunca teve nenhum PASSWORD_RESET marcado como usado (ou
    // seja, nunca passou por /redefinir-senha com sucesso).
    const afetados = await prisma.user.findMany({
      where: {
        ...(coordenadorId ? { coordenadorId } : {}),
        tokens: {
          some: { tipo: "PASSWORD_RESET", usadoEm: null, expiraEm: { lt: new Date() } },
          none: { tipo: "PASSWORD_RESET", usadoEm: { not: null } },
        },
      },
      select: { id: true, nome: true, email: true, role: true },
      orderBy: { createdAt: "asc" },
    });

    console.log(`Encontrados ${afetados.length} usuário(s) com link expirado sem cadastro concluído.`);
    afetados.forEach((u: { role: string; email: string; nome: string }) =>
      console.log(`  ${u.role.padEnd(18)} ${u.email.padEnd(35)} ${u.nome}`),
    );

    if (somenteConferir) {
      console.log("\nDRY_RUN (padrão): nada foi reenviado. Rode com DRY_RUN=false para reenviar de verdade.\n");
      return;
    }

    console.log("\nReenviando...\n");
    const autor = process.env.REENVIO_AUTOR ?? "script:reenviar-links-expirados";
    let ok = 0;
    let falhou = 0;

    for (const u of afetados) {
      try {
        await usuariosService.reenviarLinkDefinicaoSenha(u.id, { id: autor, role: "ADMIN" });
        console.log(`  ok       ${u.email}`);
        ok++;
      } catch (e) {
        console.log(`  falhou   ${u.email} — ${e instanceof Error ? e.message : e}`);
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

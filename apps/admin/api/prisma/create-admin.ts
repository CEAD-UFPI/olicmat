/**
 * Cria (ou atualiza a senha de) um usuário ADMIN.
 *
 * Existe porque o seed não cria contas em produção — as contas de
 * demonstração ficam atrás de SEED_DEMO_DATA, e suas senhas estão no código,
 * num repositório público. Sem este script, um ambiente novo sobe sem nenhum
 * usuário e ninguém consegue entrar.
 *
 * Também serve para recuperar acesso: se o e-mail já existir, a senha é
 * redefinida e o papel promovido a ADMIN.
 *
 * Uso (dentro do container do admin-api):
 *
 *   docker exec -it \
 *     -e ADMIN_NOME="Nome Completo" \
 *     -e ADMIN_EMAIL="pessoa@ufpi.edu.br" \
 *     -e ADMIN_CPF="12345678901" \
 *     -e ADMIN_SENHA="uma senha forte" \
 *     olicmat-admin-api npx tsx prisma/create-admin.ts
 *
 * ADMIN_MATRICULA e ADMIN_NASCIMENTO são opcionais.
 */
import { PrismaClient, Role } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const SENHA_MINIMA = 10;

function obrigatorio(nome: string): string {
  const valor = process.env[nome];
  if (!valor || !valor.trim()) {
    throw new Error(`Variável ${nome} é obrigatória.`);
  }
  return valor.trim();
}

async function main() {
  const nome = obrigatorio("ADMIN_NOME");
  const email = obrigatorio("ADMIN_EMAIL").toLowerCase();
  const cpf = obrigatorio("ADMIN_CPF").replace(/\D/g, "");
  const senha = obrigatorio("ADMIN_SENHA");
  const matricula = process.env.ADMIN_MATRICULA?.trim() || "ADMIN";
  const nascimento = process.env.ADMIN_NASCIMENTO?.trim() || "1990-01-01";

  if (cpf.length !== 11) {
    throw new Error(`ADMIN_CPF deve ter 11 dígitos; recebeu ${cpf.length}.`);
  }
  if (senha.length < SENHA_MINIMA) {
    throw new Error(
      `ADMIN_SENHA precisa de pelo menos ${SENHA_MINIMA} caracteres.`,
    );
  }

  const dataNascimento = new Date(nascimento);
  if (Number.isNaN(dataNascimento.getTime())) {
    throw new Error(`ADMIN_NASCIMENTO inválido: use o formato AAAA-MM-DD.`);
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const existente = await prisma.user.findUnique({ where: { email } });

  const user = await prisma.user.upsert({
    where: { email },
    // Redefinir a senha de quem já existe é o modo de recuperar acesso.
    update: { senhaHash, role: Role.ADMIN, emailConfirmado: true },
    create: {
      nome,
      email,
      cpf,
      senhaHash,
      role: Role.ADMIN,
      matricula,
      dataNascimento,
      emailConfirmado: true,
    },
  });

  console.log(existente ? "Senha redefinida." : "Administrador criado.");
  console.log(`  nome  : ${user.nome}`);
  console.log(`  email : ${user.email}`);
  console.log(`  papel : ${user.role}`);
}

main()
  .catch((e) => {
    console.error(`\nFalhou: ${e instanceof Error ? e.message : e}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

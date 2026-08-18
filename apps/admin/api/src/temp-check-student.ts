import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Checking DB status for original student...");

  const user = await prisma.user.findUnique({
    where: { email: "aluno@olicmat.com.br" },
    include: {
      inscricoes: {
        include: {
          edicao: true,
        }
      }
    }
  });

  console.log("User:", user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

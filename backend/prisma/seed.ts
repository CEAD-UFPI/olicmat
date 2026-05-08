import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const MODULOS = [
  { titulo: "Fundamentos das TDICs na Educação Matemática", descricao: "Introdução às Tecnologias Digitais de Informação e Comunicação aplicadas ao ensino de matemática.", ordem: 1, cargaHoraria: 8 },
  { titulo: "Ambientes Virtuais de Aprendizagem", descricao: "Plataformas e ferramentas para criar experiências de aprendizagem online significativas.", ordem: 2, cargaHoraria: 8 },
  { titulo: "Metodologias Ativas no Ensino de Matemática", descricao: "Sala de aula invertida, aprendizagem baseada em projetos e problemas no contexto matemático.", ordem: 3, cargaHoraria: 10 },
  { titulo: "Geometria Dinâmica com GeoGebra", descricao: "Exploração de conceitos geométricos utilizando o software GeoGebra em sala de aula.", ordem: 4, cargaHoraria: 10 },
  { titulo: "Pensamento Computacional e Matemática", descricao: "Integração de lógica de programação e resolução de problemas matemáticos.", ordem: 5, cargaHoraria: 8 },
  { titulo: "Jogos Digitais e Gamificação", descricao: "Design e aplicação de elementos de jogos no ensino de conceitos matemáticos.", ordem: 6, cargaHoraria: 8 },
  { titulo: "Produção de Videoaulas Educacionais", descricao: "Técnicas de roteirização, gravação e edição de videoaulas para o ensino de matemática.", ordem: 7, cargaHoraria: 10 },
  { titulo: "Avaliação Mediada por Tecnologia", descricao: "Ferramentas e estratégias para avaliação formativa e somativa em ambientes digitais.", ordem: 8, cargaHoraria: 8 },
  { titulo: "Educação Matemática Inclusiva", descricao: "TDICs como recurso para a inclusão de estudantes com necessidades específicas nas aulas de matemática.", ordem: 9, cargaHoraria: 10 },
  { titulo: "Realidade Aumentada e Modelagem 3D", descricao: "Exploração de tecnologias imersivas para visualização de conceitos matemáticos abstratos.", ordem: 10, cargaHoraria: 8 },
  { titulo: "Curadoria de Recursos Digitais", descricao: "Critérios para seleção e organização de materiais didáticos digitais de qualidade.", ordem: 11, cargaHoraria: 8 },
  { titulo: "Storytelling e Narrativas Digitais", descricao: "Construção de narrativas para contextualizar o ensino de matemática utilizando mídias digitais.", ordem: 12, cargaHoraria: 8 },
  { titulo: "Comunidades de Prática e Redes Colaborativas", descricao: "Criação e participação em comunidades online de educadores matemáticos.", ordem: 13, cargaHoraria: 8 },
  { titulo: "Projeto Integrador: Sequência Didática Digital", descricao: "Elaboração de uma sequência didática completa integrando as TDICs exploradas no curso.", ordem: 14, cargaHoraria: 8 },
];

async function main() {
  console.log("Iniciando seed dos módulos FORPEMAT...");

  for (const modulo of MODULOS) {
    await prisma.modulo.upsert({
      where: { ordem: modulo.ordem },
      create: { ...modulo, conteudos: [] },
      update: modulo,
    });
    console.log(`  ✓ Módulo ${modulo.ordem}: ${modulo.titulo}`);
  }

  console.log(`\n${MODULOS.length} módulos inseridos. Carga horária total: ${MODULOS.reduce((acc, m) => acc + m.cargaHoraria, 0)}h`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

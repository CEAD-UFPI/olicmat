# Correção pós-prova da Fase 1

Roda **depois** que o gabarito oficial for preenchido nas questões da prova
(`Questao.correta`), o que normalmente só acontece após o dia da prova.

## Como rodar (produção)

```zsh
cd apps/admin/api
source .env
# Descubra o id da edição real (a de ano mais alto):
npx tsx -e "const {PrismaClient}=await import('./generated/prisma/client.js');const {PrismaPg}=await import('@prisma/adapter-pg');const p=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});console.log(await p.edicao.findMany({select:{id:true,ano:true,titulo:true},orderBy:{ano:'desc'}}));await p.\$disconnect()"
# 1) Simulação (não grava nada):
npx tsx scripts/corrigir-fase1.ts --edicao <id>
# 2) Gravação definitiva (registra auditoria):
npx tsx scripts/corrigir-fase1.ts --edicao <id> --commit
```

O script **recusa** rodar (exit 2) se alguma questão da prova ainda tiver
`correta = NULL`, listando quais faltam. Isso impede gravar notas com gabarito
incompleto.

## Depois de gravar

A nota `fase1Nota` dos finalizados passa a refletir o gabarito. Para publicar
no ranking e distribuir medalhas, execute as ações existentes do admin
(`atualizarMedalhas` e `publicarRanking`), como já feito após cada recomputação.

## Idempotência

Rodar `--commit` de novo é seguro: respostas já corretas não mudam e notas já
iguais não são regravadas (só é criado um novo registro de auditoria).

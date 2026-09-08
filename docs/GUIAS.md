# Apresentação e guias de uso — OLICMAT 2026

Três páginas HTML autocontidas (CSS e JS embutidos), sem build e sem
dependências. Abra qualquer uma direto no navegador:

```bash
xdg-open docs/guia-coordenador.html        # Linux
open docs/guia-coordenador.html            # macOS
start docs/guia-coordenador.html           # Windows
```

| Arquivo | Público | Conteúdo |
|---------|---------|----------|
| `apresentacao-sistema.html` | Comissão organizadora | Visão operacional da plataforma em 15 slides: perfis de acesso, ciclo da competição, regras de classificação, cronograma e situação atual |
| `guia-coordenador.html` | Coordenações de curso | Passo a passo: aceitar o convite, convidar alunos em lote, acompanhar cadastros, validar inscrições, métricas |
| `guia-participante.html` | Participantes (alunos) | Passo a passo: do convite ao resultado, com as regras da prova cronometrada e os envios da Fase 2 |

A apresentação usa navegação por slides: `→` `←` `Espaço` avançam e voltam,
`Home`/`End` vão ao primeiro e ao último, `F` alterna tela cheia, e o clique na
metade direita ou esquerda do palco também navega. Os dois guias são páginas de
rolagem com índice lateral fixo.

Fontes vêm do Google Fonts; sem internet elas caem para os fallbacks do sistema
e o resto continua legível.

## Distinção em relação a `apresentacao/index.html`

`apresentacao/index.html` é a apresentação de **lançamento** — vende a
olimpíada para o público externo. `docs/apresentacao-sistema.html` é a
apresentação **operacional** — explica à comissão como a plataforma funciona,
quem faz o quê e o que ainda não está pronto. As duas compartilham os mesmos
tokens de design (cores, tipografia, símbolos π ∫ Σ) e não repetem conteúdo.

## Ao alterar

- **Datas**: a fonte única em código é `apps/web/src/lib/cronograma.ts`. Estes
  três arquivos são HTML autocontido e não a leem — replique à mão e confira
  contra o Regulamento.
- **Passos dos guias**: eles descrevem rótulos literais das telas. Ao renomear
  um botão ou campo no painel, o guia correspondente precisa acompanhar, senão
  vira instrução para uma tela que não existe mais.

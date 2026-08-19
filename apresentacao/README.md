# OLICMAT — Apresentação de Lançamento

Apresentação interativa (slides em tela cheia) para o **lançamento oficial da OLICMAT**,
construída com o mesmo design system da aplicação principal — mesmas cores, tipografia
(Fraunces / Outfit / JetBrains Mono), símbolos de marca (π Fase 1, ∫ Fase 2, Σ Premiação)
e componentes visuais (cards, badges, mockups de interface).

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Apresentação completa (HTML + CSS + JS embutidos), autocontida |
| `logo-semfundo.png` | Logotipo usado no slide de abertura |
| `README.md` | Este arquivo |

## Como executar

Não há build nem dependências — basta abrir o arquivo no navegador:

```bash
# Opção 1 — abrir diretamente
xdg-open apresentacao/index.html        # Linux
open apresentacao/index.html            # macOS
start apresentacao/index.html           # Windows

# Opção 2 — servir via HTTP local (recomendado, evita restrição de arquivos locais)
cd apresentacao
python3 -m http.server 8080
# acesse http://localhost:8080
```

> A apresentação usa fontes do Google Fonts e um QR code gerado por serviço externo
> (`api.qrserver.com`), então **precisa de internet** para exibir esses elementos.
> Sem internet, as fontes caem para os fallbacks do sistema e o QR vira o link em texto.

## Como navegar

| Ação | Tecla / gesto |
|------|---------------|
| Avançar slide | `→` · `Espaço` · `PageDown` · clique na metade direita |
| Voltar slide | `←` · `PageUp` · clique na metade esquerda |
| Primeiro / último slide | `Home` / `End` |
| Alternar modo apresentador | `P` (contador + rótulo do slide no canto) |
| Tela cheia | `F` |
| Ir para slide específico | `G` (pede o número) |
| Swipe (touch) | arrastar para os lados |

A barra de progresso e o contador (`1 / 20`) ficam no rodapé do palco.

## Estrutura da apresentação

- **Abertura** — logo + evento + tagline
- **Roteiro** — os 5 blocos
1. **A Plataforma** — o que é, as duas fases, público-alvo, landing page
2. **Cadastro & Configuração** — entidades, 5 perfis de acesso, dashboards/exportações/auditoria
3. **Fluxo de Inscrição** — passo a passo, estados PENDENTE/CONFIRMADA/REJEITADA, documentos
4. **Sistema de Prova** — execução cronometrada, autosave, antifraude
5. **Correção & Classificação** — Fase 1 automática / Fase 2 manual, nota final + desempate, ranking + medalhas, publicação controlada
- **Encerramento** — CTA "Inscrições abertas em 30/08/2026" + link + QR + cronograma resumido

## Consistência visual

Os tokens de design são declarados no topo do `index.html` (bloco `:root`) e espelham
`apps/*/web/src/app/globals.css`:

- **Cores:** `#171722` (fundo), `#20202e`, `#262636` (superfícies), `#F4C840` (ouro), `#5FC964` (verde), `#4FC0F0` (azul), `#ffffff` / `#d6d2e4` / `#b6b2c4` (textos), `#45455c` (bordas)
- **Fontes:** Fraunces (títulos), Outfit (corpo), JetBrains Mono (mono/dados)
- **Símbolos:** π = Fase 1, ∫ = Fase 2, Σ = Premiação / Cadastro

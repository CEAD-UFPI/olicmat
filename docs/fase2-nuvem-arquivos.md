# Fase 2 — Nuvem de arquivos e compressão de vídeos (VPS)

**Data:** 17/11/2026. A infraestrutura já está **instalada e testada** na VPS Hostinger.

## Visão geral

```
Participante ──(1) pede autorização──────────▶ admin-api (UFPI)   só assina URLs
     └──(2) envia o vídeo ORIGINAL (≤ 4 GB)──▶ Nuvem S3 na VPS (SeaweedFS)
Compressor (VPS) ──(3) "próximo vídeo?"──────▶ admin-api (HTTPS público)
     ├──(4) baixa o original (rede interna) ─▶ Nuvem
     ├──(5) ffmpeg → MP4 720p (≈ 6× tempo real)
     ├──(6) grava a versão final ────────────▶ Nuvem
     └──(7) "pronto" e apaga o original ─────▶ admin-api / Nuvem
Avaliador ──(8) URL temporária (6 h) da versão final ──▶ Nuvem
```

**Divisão de papéis:**
- O participante não precisa comprimir nada; ele envia o vídeo do jeito que gravou.
- A API da UFPI nunca chama a nuvem para enviar arquivos, porque a rede da UFPI bloqueia TLS de saída. Ela só assina URLs.
- O compressor é quem chama a API, pelo domínio público `olicmat.cead.ufpi.br`, que recebe conexões normalmente.

**Robustez:**
- A fila fica no banco, na tabela `VideoFase2`, que é a fonte da verdade.
- Um vídeo que falha é tentado 3 vezes. Se continuar falhando, o participante vê "Não conseguimos ler este vídeo… envie novamente".
- O compressor confere a duração da saída antes de apagar o original.
- **Envio único:** cada arquivo (videoaula e portfólio) só pode ser enviado uma vez. A exceção é o vídeo que o compressor não conseguiu ler nas 3 tentativas, que pode ser reenviado. A regra é aplicada na API, com trava da inscrição para impedir que duas abas enviem ao mesmo tempo.
- **Liberar reenvio (exceção):** no painel *Fase 2: Envio e Avaliação*, a Comissão clica em "liberar reenvio", escolhe o arquivo e informa o motivo.
  - O participante pode enviar aquele arquivo mais uma vez, até o prazo, e recebe um e-mail avisando.
  - O arquivo atual continua valendo até o novo terminar, e a liberação é consumida pelo envio.
  - Fica registrado na auditoria (`LIBERAR_REENVIO_FASE2` / `REVOGAR_REENVIO_FASE2`) e pode ser revogado.
- Os originais já convertidos e os arquivos descartados são apagados automaticamente. Descartados são, por exemplo, o vídeo ilegível que foi reenviado ou o arquivo da aba que perdeu a disputa.
- Uploads interrompidos (aba fechada, internet caída) deixam partes na nuvem. O compressor as apaga a cada 30 min, quando têm mais de 8 h (`INCOMPLETOS_HORAS`).

## O que está na VPS

| Item | Valor |
|---|---|
| Servidor | Ubuntu 24.04, 8 vCPU, 31 GB de RAM, 387 GB de disco, EasyPanel + Traefik 3.7 |
| Pasta | `/opt/olicmat-fase2` (cópia de `infra/vps-fase2` do repositório) |
| Nuvem | Contêiner `olicmat-nuvem`, imagem `chrislusf/seaweedfs:4.54`, bucket `olicmat-fase2`, volume `olicmat-fase2_nuvem` |
| Compressor | Contêiner `olicmat-compressor`, Node 22 + ffmpeg, 2 vídeos em paralelo × 3 threads, limitado a 6 CPUs |
| Endereço | `https://arquivos-olicmat.q7zbrj.easypanel.host`, pelo certificado curinga do EasyPanel; rota em `/etc/easypanel/traefik/config/olicmat-fase2.yaml` |
| Segredos | `/opt/olicmat-fase2/.env` (chmod 600): chaves S3 e o token do compressor. Ficam fora do git. |
| CORS | Só `https://admin.olicmat.cead.ufpi.br` |
| Portas | Nenhuma publicada. O acesso é só pelo Traefik (HTTPS). |

O contêiner `olicmat-db`, do kit de standby, é independente e não foi alterado.

**Desempenho medido na VPS:** 2 min de vídeo 1080p em 20 s. Uma aula de 20 min leva cerca de 3,5 min e fica com cerca de 150 a 250 MB. Mesmo que os 182 vídeos chegassem de uma vez, a fila terminaria em cerca de 5 h.

## Configurar a Máquina 1 (UFPI)

No `/opt/olicmat/.env`, use os valores de `/opt/olicmat-fase2/.env` da VPS:

```
FASE2_S3_ENDPOINT=https://arquivos-olicmat.q7zbrj.easypanel.host
FASE2_S3_REGION=us-east-1
FASE2_S3_BUCKET=olicmat-fase2
FASE2_S3_ACCESS_KEY=<S3_ACCESS_KEY da VPS>
FASE2_S3_SECRET_KEY=<S3_SECRET_KEY da VPS>
FASE2_COMPRESSOR_TOKEN=<FASE2_COMPRESSOR_TOKEN da VPS>
```

Depois do deploy, confira a partir da Máquina 1:

```bash
docker exec olicmat-admin-api mkdir -p /app/scripts
docker cp apps/admin/api/scripts/verificar-nuvem-fase2.ts olicmat-admin-api:/app/scripts/
docker exec -w /app olicmat-admin-api npx tsx scripts/verificar-nuvem-fase2.ts
```

Na VPS, o log do compressor deve parar de mostrar `HTTP 404`:

```bash
docker logs --tail 20 olicmat-compressor
```

## Operação na VPS

```bash
cd /opt/olicmat-fase2
docker compose ps                         # estado
docker logs -f olicmat-compressor         # acompanhar as compressões
docker exec olicmat-nuvem sh -c 'echo "s3.bucket.list" | weed shell'   # uso do bucket
./instalar.sh                             # reinstalar/atualizar (mantém .env e dados)
```

Para atualizar o compressor depois de mudanças no repositório:
1. Copie `infra/vps-fase2/compressor/*` para `/opt/olicmat-fase2/compressor/`.
2. Rode `docker compose up -d --build compressor`.

## Cópia de segurança

- Ative os **snapshots** semanais da VPS no painel da Hostinger.
- Faça um snapshot manual **logo após o fim do prazo de 24 h**.

## Problemas comuns

| Sintoma | O que fazer |
|---|---|
| O compressor mostra `HTTP 404` | A API ainda não tem as rotas (falta deploy) ou falta `FASE2_COMPRESSOR_TOKEN` na Máquina 1. |
| O compressor mostra `HTTP 404` mesmo após o deploy | O token da Máquina 1 é diferente do token da VPS. |
| "A nuvem de arquivos não respondeu" para o participante | Rode `docker compose ps` na VPS e o script de verificação. |
| Vídeo com falha no painel | Veja `docker logs olicmat-compressor`. Se o arquivo estiver corrompido, o participante precisa reenviar. |
| Disco enchendo | Confira se as remoções aparecem no log (`removidos:`). Com menos de 5% livre, a nuvem fica só para leitura. |

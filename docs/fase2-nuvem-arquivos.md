# Fase 2 — Nuvem própria para videoaulas e portfólios

**Data:** 17/11/2026

A nuvem fica na VPS Hostinger (8 vCPU, 32 GB de RAM, 400 GB de disco, 32 TB de banda), com EasyPanel. Ela guarda a videoaula (até 3 GB) e o portfólio em PDF (até 50 MB) dos 182 classificados.

## Como funciona

```
Navegador do participante ──(1) pede autorização──▶ admin-api (UFPI)
          │                                          só ASSINA URLs, sem rede
          └──(2) envia o arquivo em partes de 8 MB──▶ Nuvem S3 na VPS (SeaweedFS)
Navegador do avaliador ──(3) URL temporária (6 h)──▶ Nuvem S3 (assiste/baixa)
```

O arquivo nunca passa pela UFPI. A API assina URLs localmente (AWS Signature V4, sem nenhuma chamada de rede). Isso importa porque a rede da UFPI já bloqueou a saída TLS do Node para o Cloudinary.

A única chamada da API para a nuvem é a conferência (HEAD) ao final do upload, e ela é tolerante. Se a nuvem não responder a partir da UFPI, o envio é aceito e um aviso vai para o log.

**Segurança dos arquivos:**
- O bucket é privado: abrir um arquivo exige URL assinada, e quem não tem assinatura recebe 403.
- O participante só envia arquivos para o próprio prefixo (`fase2/<edição>/<inscrição>/`) e só enquanto o prazo de 24 h estiver aberto.
- O avaliador recebe URLs apenas dos participantes atribuídos a ele.

**Robustez:**
- **Envio:** o vídeo sobe em partes de 8 MB, 3 por vez, e cada parte é reenviada até 6 vezes se a conexão cair.
- **Histórico:** vale o último envio. Cada substituição gera um novo registro em `EnvioFase2`.
- **Alternativa:** sem as variáveis `FASE2_S3_*`, o sistema volta automaticamente ao envio por links.

## Por que SeaweedFS

| Opção | Situação |
|---|---|
| MinIO | A edição comunitária deixou de ser distribuída: `minio/minio` e `quay.io/minio/minio` recusam o download. |
| **SeaweedFS** (Apache 2.0) | Testado aqui. Funcionaram upload multipart assinado, CORS (libera a origem e expõe o `ETag`), HEAD, GET com nome de arquivo e recusa de assinatura errada ou expirada. Sobe com um único comando. |
| Garage, RustFS | Funcionariam, mas pedem mais passos de configuração ou são menos maduros. |

O código é compatível com qualquer serviço S3. Se um dia a nuvem mudar, troque apenas as variáveis `FASE2_S3_*`.

## Instalação no EasyPanel (cerca de 15 minutos)

**Pré-requisito:** um subdomínio apontando para o IP da VPS, por exemplo `arquivos.SEU-DOMINIO` (registro DNS do tipo A).

### 1. Gerar as chaves

Rode em qualquer terminal:

```bash
echo "ACCESS_KEY=olicmat$(openssl rand -hex 6)"
echo "SECRET_KEY=$(openssl rand -base64 36 | tr -d '/+=')"
```

Guarde as duas chaves; elas vão para o `s3.json` e para o `.env` da Máquina 1.

### 2. Criar o serviço

1. No EasyPanel, abra **Projeto → + Serviço → App** e dê o nome `nuvem-fase2`.
2. Em **Source → Docker Image**, informe `chrislusf/seaweedfs:4.54`. Essa é a versão testada; não use `latest`.
3. Em **Deploy → Command**, informe:
   ```
   weed server -dir=/data -s3 -s3.port=8333 -s3.config=/etc/seaweedfs/s3.json -volume.max=0 -volume.minFreeSpace=5 -s3.allowedOrigins=https://admin.olicmat.cead.ufpi.br
   ```
   - `-volume.max=0` libera o uso do disco inteiro. O padrão (8 volumes de 30 GB) limitaria a nuvem a 240 GB.
   - `-volume.minFreeSpace=5` deixa a nuvem só para leitura quando restar menos de 5% de disco, em vez de corromper dados.
4. Em **Mounts**, crie dois:
   - **Volume:** nome `dados`, caminho `/data`. Aqui ficam os arquivos; não apague.
   - **File:** caminho `/etc/seaweedfs/s3.json`, com o conteúdo abaixo e as chaves do passo 1:
     ```json
     {
       "identities": [
         {
           "name": "olicmat",
           "credentials": [{ "accessKey": "ACCESS_KEY_AQUI", "secretKey": "SECRET_KEY_AQUI" }],
           "actions": ["Admin", "Read", "Write", "List", "Tagging"]
         }
       ]
     }
     ```
5. Em **Domains**, adicione `arquivos.SEU-DOMINIO` com **HTTPS ativado** e porta interna **8333**.
6. Clique em **Deploy**.

### 3. Criar o bucket

No **Console** do serviço, no EasyPanel:

```bash
echo "s3.bucket.create -name olicmat-fase2" | weed shell
```

### 4. Configurar a Máquina 1 (UFPI)

Acrescente ao `/opt/olicmat/.env`:

```
FASE2_S3_ENDPOINT=https://arquivos.SEU-DOMINIO
FASE2_S3_REGION=us-east-1
FASE2_S3_BUCKET=olicmat-fase2
FASE2_S3_ACCESS_KEY=<do passo 1>
FASE2_S3_SECRET_KEY=<do passo 1>
```

Recrie a API:

```bash
cd /opt/olicmat && docker compose -f docker-compose.prod.yml up -d --no-deps admin-api
```

### 5. Conferir

```bash
docker exec olicmat-admin-api mkdir -p /app/scripts
docker cp apps/admin/api/scripts/verificar-nuvem-fase2.ts olicmat-admin-api:/app/scripts/
docker exec -w /app olicmat-admin-api npx tsx scripts/verificar-nuvem-fase2.ts
```

Esperado: todas as linhas com `OK` e a mensagem "Nuvem pronta para a Fase 2".

Uma falha **só** na conferência a partir da UFPI não impede os envios, porque os navegadores falam direto com a VPS. Mesmo assim, investigue antes do início.

Também vale testar de fora da UFPI, pelo celular com 4G: entre como participante de teste no ambiente local ou de homologação e envie um vídeo.

## Capacidade

- **Disco:** 182 participantes × ~1 GB (videoaula de 20 min em 720p/1080p) ≈ 180 GB, mais as substituições. O limite de 3 GB por vídeo e os 400 GB de disco comportam o pior caso realista. Acompanhe o uso em **EasyPanel → Monitor**.
- **Banda:** 32 TB/mês é muito acima do necessário. O envio de todos (~200 GB) e cada avaliador assistindo cada vídeo (~400 GB) somam menos de 1 TB.
- **Simultaneidade:** 182 envios ao mesmo tempo são só I/O de disco e rede. O SeaweedFS absorve isso com folga em 8 vCPU e 32 GB de RAM.

## Cópia de segurança

- Ative os **snapshots** semanais da VPS no painel da Hostinger.
- Faça um snapshot manual **logo após o fim do prazo de 24 h**.
- Ao final da avaliação, se quiser guardar os arquivos fora da VPS, sincronize o bucket com qualquer ferramenta S3 (por exemplo, `rclone sync`).

## Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| "A nuvem de arquivos não respondeu" para o participante | Serviço parado, domínio ou HTTPS errado | Veja o log do serviço no EasyPanel e rode o passo 5. |
| Erro de CORS no navegador | `-s3.allowedOrigins` diferente do domínio do admin | Corrija o comando do passo 2.3 e faça o redeploy. |
| Partes falhando em conexões lentas | Tempo-limite do proxy | As partes têm 8 MB, para caber nos 60 s padrão do Traefik. Se persistir, aumente o `readTimeout` do Traefik no EasyPanel. |
| Envio recusado como "incompleto" | Upload interrompido | O participante envia de novo. |

import { Injectable, BadRequestException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface MulterBufferFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

/** Teto de tamanho, em MB, para qualquer arquivo enviado à plataforma. */
const TAMANHO_MAXIMO_MB = 10;

const FORMATOS_PADRAO: Record<"video" | "image" | "raw", string[]> = {
  video: ["mp4", "mov", "avi", "webm"],
  image: ["jpg", "jpeg", "png", "webp"],
  raw: ["pdf", "doc", "docx", "jpg", "png"],
};

/**
 * Armazenamento de arquivos é local (disco + volume Docker), e não no
 * Cloudinary. Motivo: a rede da UFPI deixa a conexão TCP até api.cloudinary.com
 * abrir, mas o handshake TLS do Node não flui — o upload ficava pendurado até o
 * nginx devolver 504. Disco local não depende de nenhuma rede externa.
 */
@Injectable()
export class UploadService {
  private readonly dirBase: string;
  private readonly urlBase: string;

  constructor() {
    this.dirBase = process.env.UPLOAD_DIR || "/app/uploads";
    // Host público da API (sem a barra final). Os arquivos são servidos em
    // `/api/uploads/...` pela rota do UploadsController, então a URL pública
    // só precisa do domínio que o proxy expõe para a API.
    this.urlBase = (process.env.PUBLIC_API_URL || "https://olicmat.cead.ufpi.br").replace(/\/+$/, "");
  }

  /**
   * Recusa o arquivo antes de escrevê-lo em disco. Devolve a extensão já
   * normalizada (minúscula) para ser reutilizada no nome do arquivo salvo.
   */
  private validar(
    nome: string,
    tamanho: number,
    formatosPermitidos: string[],
  ): string {
    const extensao = nome.split(".").pop()?.toLowerCase() ?? "";

    if (!formatosPermitidos.includes(extensao)) {
      throw new BadRequestException(
        `Formato não aceito. Envie um arquivo ${formatosPermitidos
          .join(", ")
          .toUpperCase()}.`,
      );
    }

    if (tamanho > TAMANHO_MAXIMO_MB * 1024 * 1024) {
      throw new BadRequestException(
        `Arquivo muito grande. O limite é de ${TAMANHO_MAXIMO_MB} MB.`,
      );
    }

    return extensao;
  }

  /**
   * Grava o buffer em `<UPLOAD_DIR>/<folder>/<uuid>.<ext>` e devolve a URL
   * pública para acessá-lo. O nome gerado (UUID) elimina colisão e path
   * traversal por construção.
   */
  private async salvarNoDisco(
    buffer: Buffer,
    folder: string,
    extensao: string,
  ): Promise<string> {
    const nome = `${randomUUID()}.${extensao}`;
    const pasta = join(this.dirBase, folder);
    await mkdir(pasta, { recursive: true });
    await writeFile(join(pasta, nome), buffer);
    return `${this.urlBase}/api/uploads/${folder}/${nome}`;
  }

  async uploadArquivo(
    file: MulterBufferFile,
    folder: string,
    resourceType: "video" | "image" | "raw" = "raw",
    formatosPermitidos?: string[],
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException("Arquivo não enviado");
    }

    const formatos = formatosPermitidos ?? FORMATOS_PADRAO[resourceType];
    const extensao = this.validar(file.originalname, file.size, formatos);
    return this.salvarNoDisco(file.buffer, folder, extensao);
  }

  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename: string,
    resourceType: "video" | "image" | "raw" = "raw",
    formatosPermitidos?: string[],
  ): Promise<string> {
    const formatos = formatosPermitidos ?? FORMATOS_PADRAO[resourceType];
    const extensao = this.validar(filename, buffer.byteLength, formatos);
    return this.salvarNoDisco(buffer, folder, extensao);
  }
}

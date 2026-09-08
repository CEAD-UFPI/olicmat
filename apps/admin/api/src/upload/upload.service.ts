import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

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

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Recusa o arquivo antes de gastar a viagem até o Cloudinary. Sem isto, um
   * formato não aceito só falhava lá, e o erro que chegava à pessoa era o da
   * biblioteca — indecifrável para quem só quer anexar um comprovante.
   */
  private validar(
    nome: string,
    tamanho: number,
    formatosPermitidos: string[],
  ): void {
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
    this.validar(file.originalname, file.size, formatos);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `olicmat/${folder}`,
          resource_type: resourceType,
          allowed_formats: formatos,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename: string,
    resourceType: "video" | "image" | "raw" = "raw",
    formatosPermitidos?: string[],
  ): Promise<string> {
    const formatos = formatosPermitidos ?? FORMATOS_PADRAO[resourceType];
    this.validar(filename, buffer.byteLength, formatos);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `olicmat/${folder}`,
          resource_type: resourceType,
          public_id: filename.replace(/\.[^/.]+$/, ""),
          allowed_formats: formatos,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      );

      uploadStream.end(buffer);
    });
  }
}

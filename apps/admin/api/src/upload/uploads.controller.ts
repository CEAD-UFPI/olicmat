import { Controller, Get, Param, Res, NotFoundException } from "@nestjs/common";
import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import type { Response } from "express";

const MIME_POR_EXTENSAO: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  mp4: "video/mp4",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  webm: "video/webm",
};

/**
 * Serve os arquivos gravados pelo UploadService em `<UPLOAD_DIR>/<folder>/<file>`.
 * Acesso público por URL — mesma postura do antigo Cloudinary (secure_url), em
 * que quem tem o link enxerga o arquivo.
 */
@Controller("uploads")
export class UploadsController {
  private readonly dirBase = process.env.UPLOAD_DIR || "/app/uploads";

  @Get(":folder/:file")
  servir(
    @Param("folder") folder: string,
    @Param("file") file: string,
    @Res() res: Response,
  ) {
    // Blinda contra path traversal: só aceita um segmento simples de pasta e
    // um nome de arquivo plano. Qualquer barra ou ".." é recusado.
    if (!/^[a-zA-Z0-9_-]+$/.test(folder) || !/^[a-zA-Z0-9._-]+$/.test(file)) {
      throw new NotFoundException("Arquivo não encontrado");
    }

    const caminho = join(this.dirBase, folder, file);
    if (!existsSync(caminho)) {
      throw new NotFoundException("Arquivo não encontrado");
    }

    const extensao = (file.split(".").pop() ?? "").toLowerCase();
    res.setHeader(
      "Content-Type",
      MIME_POR_EXTENSAO[extensao] ?? "application/octet-stream",
    );
    res.setHeader("Content-Disposition", `inline; filename="${file}"`);
    createReadStream(caminho).pipe(res);
  }
}

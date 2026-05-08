import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadArquivo(
    file: Express.Multer.File,
    folder: string,
    resourceType: "video" | "image" | "raw" = "raw"
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException("Arquivo não enviado");
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `olicmat/${folder}`,
          resource_type: resourceType,
          allowed_formats:
            resourceType === "video"
              ? ["mp4", "mov", "avi", "webm"]
              : resourceType === "image"
              ? ["jpg", "jpeg", "png", "webp"]
              : ["pdf", "doc", "docx", "jpg", "png"],
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
    resourceType: "video" | "image" | "raw" = "raw"
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `olicmat/${folder}`,
          resource_type: resourceType,
          public_id: filename.replace(/\.[^/.]+$/, ""),
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
let UploadService = class UploadService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadArquivo(file, folder, resourceType = "raw") {
        if (!file) {
            throw new BadRequestException("Arquivo não enviado");
        }
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: `olicmat/${folder}`,
                resource_type: resourceType,
                allowed_formats: resourceType === "video"
                    ? ["mp4", "mov", "avi", "webm"]
                    : resourceType === "image"
                        ? ["jpg", "jpeg", "png", "webp"]
                        : ["pdf", "doc", "docx", "jpg", "png"],
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result.secure_url);
            });
            uploadStream.end(file.buffer);
        });
    }
    async uploadBuffer(buffer, folder, filename, resourceType = "raw") {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: `olicmat/${folder}`,
                resource_type: resourceType,
                public_id: filename.replace(/\.[^/.]+$/, ""),
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result.secure_url);
            });
            uploadStream.end(buffer);
        });
    }
};
UploadService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], UploadService);
export { UploadService };
//# sourceMappingURL=upload.service.js.map